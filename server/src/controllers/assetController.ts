import { type Request, type Response } from 'express';
import path from 'path';
import { StorageService } from '../services/StorageService.js';
import Asset from '../models/Asset.js';
import User from '../models/User.js';
import AuditLog from '../models/AuditLog.js';
import Activity from '../models/Activity.js';

const FILE_LIMITS: Record<string, { min: number, max: number, types: string[] }> = {
  IMAGES: { 
    min: 10 * 1024, 
    max: 2 * 1024 * 1024 * 1024, 
    types: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'] 
  },
  PDF: { 
    min: 1 * 1024, 
    max: 2 * 1024 * 1024 * 1024, 
    types: ['application/pdf'] 
  },
  VIDEOS: { 
    min: 100 * 1024, 
    max: 2 * 1024 * 1024 * 1024, 
    types: ['video/mp4', 'video/mpeg', 'video/quicktime', 'video/x-msvideo', 'video/webm'] 
  },
  AUDIO: { 
    min: 10 * 1024, 
    max: 2 * 1024 * 1024 * 1024, 
    types: ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/aac', 'audio/flac'] 
  },
  DOCUMENTS: { 
    min: 1 * 1024, 
    max: 2 * 1024 * 1024 * 1024, 
    types: [
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword', 
      'text/plain', 
      'application/rtf',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation'
    ] 
  },
  ZIP: { 
    min: 10 * 1024, 
    max: 2 * 1024 * 1024 * 1024, 
    types: ['application/zip', 'application/x-zip-compressed', 'application/x-rar-compressed'] 
  }
};

const getFileCategory = (mimeType: string): string | null => {
  for (const [category, config] of Object.entries(FILE_LIMITS)) {
    if (config.types.includes(mimeType)) return category;
  }
  if (mimeType.startsWith('image/')) return 'IMAGES';
  if (mimeType.startsWith('video/')) return 'VIDEOS';
  if (mimeType.startsWith('audio/')) return 'AUDIO';
  if (mimeType.startsWith('text/')) return 'DOCUMENTS';
  return null;
};

export const uploadAsset = async (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  try {
    const user = await User.findById((req as any).user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // 1. Category & Size Validation
    const category = getFileCategory(req.file.mimetype);
    if (!category) {
      return res.status(400).json({ message: 'Unsupported file type.' });
    }

    const limits = FILE_LIMITS[category];
    if (!limits) return res.status(400).json({ message: 'Invalid category' });

    if (req.file.size < limits.min) {
      return res.status(400).json({ 
        message: `File too small. Minimum size for ${category} is ${Math.round(limits.min / 1024)}KB.` 
      });
    }
    if (req.file.size > limits.max) {
      return res.status(400).json({ 
        message: `File too large. Maximum size for ${category} is ${Math.round(limits.max / (1024 * 1024))}MB.` 
      });
    }

    // 2. Storage Quota Check (10GB)
    if (user.storageUsed + req.file.size > user.storageLimit) {
      return res.status(400).json({ message: 'Storage limit exceeded. (10GB Quota)' });
    }

    // 3. Folder Path Preservation
    const folderPath = req.body.folderPath || '/';

    const { path: fileName, iv, authTag, fileHash } = await StorageService.saveFile(req.file);
    
    const asset = await Asset.create({
      name: req.body.originalName || req.body.name || req.file.originalname,
      originalName: req.body.originalName || req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
      extension: path.extname(req.body.originalName || req.file.originalname),
      path: fileName,
      folderPath,
      encryptionKey: 'master', 
      iv,
      fileHash,
      metadata: { authTag },
      owner: user._id,
      tags: req.body.tags ? JSON.parse(req.body.tags) : [],
      category: category.toLowerCase(),
      isEncrypted: req.body.isEncrypted === 'true'
    });

    // 4. Update usage
    user.storageUsed += asset.size;
    await user.save();

    // 5. Advanced Activity Timeline
    await Activity.create({
      asset: asset._id as any,
      user: user._id as any,
      action: 'UPLOAD',
      details: { fileName: asset.originalName, size: asset.size, category },
      ipAddress: req.ip || '127.0.0.1',
      userAgent: req.headers['user-agent'] || 'unknown'
    });

    res.status(201).json(asset);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error uploading file' });
  }
};

export const getAssets = async (req: Request, res: Response) => {
  try {
    const { archived, locked, category, search } = req.query;
    const query: any = { owner: (req as any).user._id, isDeleted: false };
    
    query.isArchived = archived === 'true';
    query.isLocked = locked === 'true';

    if (category) query.category = category;
    if (search) query.name = { $regex: search, $options: 'i' };

    const assets = await Asset.find(query).sort({ createdAt: -1 });
    res.json(assets);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching assets' });
  }
};

export const getBinAssets = async (req: Request, res: Response) => {
  try {
    const assets = await Asset.find({ owner: (req as any).user._id, isDeleted: true }).sort({ updatedAt: -1 });
    res.json(assets);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching trash' });
  }
};

export const restoreAsset = async (req: Request, res: Response) => {
  try {
    const asset = await Asset.findOne({ _id: req.params.id, owner: (req as any).user._id } as any);
    if (!asset) return res.status(404).json({ message: 'Asset not found' });

    asset.isDeleted = false;
    await asset.save();
    res.json({ message: 'Asset restored successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error restoring asset' });
  }
};

export const permanentlyDeleteAsset = async (req: Request, res: Response) => {
  try {
    const asset = await Asset.findOne({ _id: req.params.id, owner: (req as any).user._id } as any);
    if (!asset) return res.status(404).json({ message: 'Asset not found' });

    // Deduct from user storage
    const user = await User.findById((req as any).user._id);
    if (user) {
      user.storageUsed = Math.max(0, user.storageUsed - asset.size);
      await user.save();
    }

    // Actually delete the file from storage
    await StorageService.deleteFile(asset.path);
    await Asset.deleteOne({ _id: asset._id });

    res.json({ message: 'Asset permanently removed' });
  } catch (error) {
    res.status(500).json({ message: 'Error permanent delete' });
  }
};

export const archiveAsset = async (req: Request, res: Response) => {
  try {
    const asset = await Asset.findOne({ _id: req.params.id, owner: (req as any).user._id } as any);
    if (!asset) return res.status(404).json({ message: 'Asset not found' });

    asset.isArchived = true;
    await asset.save();
    res.json(asset);
  } catch (error) {
    res.status(500).json({ message: 'Error archiving asset' });
  }
};

export const unarchiveAsset = async (req: Request, res: Response) => {
  try {
    const asset = await Asset.findOne({ _id: req.params.id, owner: (req as any).user._id } as any);
    if (!asset) return res.status(404).json({ message: 'Asset not found' });

    asset.isArchived = false;
    await asset.save();
    res.json(asset);
  } catch (error) {
    res.status(500).json({ message: 'Error unarchiving asset' });
  }
};

export const lockAsset = async (req: Request, res: Response) => {
  try {
    const asset = await Asset.findOne({ _id: req.params.id, owner: (req as any).user._id } as any);
    if (!asset) return res.status(404).json({ message: 'Asset not found' });

    asset.isLocked = true;
    await asset.save();
    res.json({ message: 'Asset locked successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error locking asset' });
  }
};

export const unlockAsset = async (req: Request, res: Response) => {
  try {
    const asset = await Asset.findOne({ _id: req.params.id, owner: (req as any).user._id } as any);
    if (!asset) return res.status(404).json({ message: 'Asset not found' });

    asset.isLocked = false;
    await asset.save();
    res.json({ message: 'Asset unlocked and returned to vault' });
  } catch (error) {
    res.status(500).json({ message: 'Error unlocking asset' });
  }
};

export const unlockAssetAccess = async (req: Request, res: Response) => {
  try {
    const { password } = req.body;
    const asset = await Asset.findOne({ _id: req.params.id, owner: (req as any).user._id } as any);
    if (!asset) return res.status(404).json({ message: 'Asset not found' });

    if (asset.lockPassword !== password) {
      return res.status(401).json({ message: 'Incorrect password' });
    }

    res.json({ message: 'Verified' });
  } catch (error) {
    res.status(500).json({ message: 'Error' });
  }
};

export const streamAsset = async (req: Request, res: Response) => {
  try {
    const asset = await Asset.findById(req.params.id);
    if (!asset || asset.isDeleted) {
      return res.status(404).json({ message: 'Asset not found' });
    }

    // Check ownership
    if (asset.owner.toString() !== (req as any).user._id.toString() && !asset.isPublic) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // High-level Security: Locked assets require password for EVERY access
    if (asset.isLocked) {
      const { password } = req.query; // For streaming, we might pass it as query or check a dynamic session token
      if (!password || asset.lockPassword !== password) {
        return res.status(401).json({ message: 'Password required to decrypt this asset.' });
      }
    }

    const authTag = (asset.metadata as any).get('authTag');
    const decryptedBuffer = await StorageService.getFile(asset.path, asset.iv, authTag);

    // Timeline Logging
    await Activity.create({
      asset: asset._id as any,
      user: (req as any).user._id as any,
      action: 'DOWNLOAD',
      details: { fileName: asset.originalName },
      ipAddress: req.ip || '127.0.0.1',
      userAgent: req.headers['user-agent'] || 'unknown'
    });

    res.set('Content-Type', asset.mimeType);
    res.set('Content-Length', decryptedBuffer.length.toString());
    res.set('Content-Disposition', `inline; filename="${asset.originalName}"`);
    res.send(decryptedBuffer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error streaming file' });
  }
};

export const deleteAsset = async (req: Request, res: Response) => {
  try {
    const asset = await Asset.findById(req.params.id);
    if (!asset) return res.status(404).json({ message: 'Asset not found' });

    if (asset.owner.toString() !== (req as any).user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    asset.isDeleted = true;
    await asset.save();

    await Activity.create({
      asset: asset._id as any,
      user: (req as any).user._id as any,
      action: 'DELETE',
      details: { fileName: asset.name },
      ipAddress: req.ip || '127.0.0.1'
    });

    res.json({ message: 'Asset moved to trash bin' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting asset' });
  }
};

export const renameAsset = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    const asset = await Asset.findOne({ _id: req.params.id, owner: (req as any).user._id } as any);
    if (!asset) return res.status(404).json({ message: 'Asset not found' });

    asset.name = name;
    await asset.save();
    res.json(asset);
  } catch (error) {
    res.status(500).json({ message: 'Error' });
  }
};

export const detectDuplicates = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id;
    const duplicates = await Asset.aggregate([
      { $match: { owner: userId, isDeleted: false } },
      { $group: { 
        _id: "$fileHash", 
        count: { $sum: 1 }, 
        assets: { $push: { id: "$_id", name: "$name" } } 
      }},
      { $match: { count: { $gt: 1 } } }
    ]);
    res.json(duplicates);
  } catch (error) {
    res.status(500).json({ message: 'Error' });
  }
};

// Analytics & Features Endpoint
export const getAssetAnalytics = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id;
    const assets = await Asset.find({ owner: userId, isDeleted: false });
    
    const categoriesCount = assets.reduce((acc: any, asset) => {
      acc[asset.category] = (acc[asset.category] || 0) + 1;
      return acc;
    }, {});

    const totalStorage = assets.reduce((acc, asset) => acc + asset.size, 0);

    // Calculate Asset Health Score
    // Formula: (Encryption (100) + Locked Status (50) - Expiry Penalty (20 if close)) / Total
    const healthScore = assets.length > 0 ? assets.reduce((acc, asset) => {
      let score = 100; // AES is always on
      if (asset.isLocked) score += 50;
      if (asset.expiryDate && new Date(asset.expiryDate).getTime() - Date.now() < 86400000 * 7) score -= 30;
      return acc + score;
    }, 0) / assets.length : 100;

    res.json({
      totalAssets: assets.length,
      categoriesCount,
      totalStorage,
      healthScore: Math.min(healthScore, 100).toFixed(0),
      storageLimit: 10 * 1024 * 1024 * 1024
    });
  } catch (error) {
    res.status(500).json({ message: 'Error' });
  }
};

export const getAssetTimeline = async (req: Request, res: Response) => {
  try {
    const activities = await Activity.find({ asset: req.params.id as any })
      .sort({ createdAt: -1 })
      .populate('user', 'name avatar');
    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: 'Error' });
  }
};
