import {} from 'express';
import { StorageService } from '../services/StorageService.js';
import Asset from '../models/Asset.js';
import User from '../models/User.js';
import AuditLog from '../models/AuditLog.js';
import path from 'path';
export const uploadAsset = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }
    try {
        const { path: fileName, iv, authTag } = await StorageService.saveFile(req.file);
        const asset = await Asset.create({
            name: req.body.name || req.file.originalname,
            originalName: req.file.originalname,
            mimeType: req.file.mimetype,
            size: req.file.size,
            extension: path.extname(req.file.originalname),
            path: fileName,
            encryptionKey: 'master', // In a real app, this might be a per-file key encrypted with master
            iv,
            metadata: { authTag }, // Storing authTag in metadata or a separate field
            owner: req.user._id,
            tags: req.body.tags ? JSON.parse(req.body.tags) : [],
            category: req.body.category || 'Uncategorized'
        });
        // Update user storage used
        await User.findByIdAndUpdate(req.user._id, {
            $inc: { storageUsed: asset.size }
        });
        // Logging
        await AuditLog.create({
            user: req.user._id,
            action: 'UPLOAD',
            asset: asset._id,
            details: `Uploaded asset: ${asset.name}`,
            ipAddress: req.ip || '0.0.0.0',
            userAgent: req.headers['user-agent'] || 'unknown'
        });
        res.status(201).json(asset);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error uploading file' });
    }
};
export const getAssets = async (req, res) => {
    try {
        const { archived, locked } = req.query;
        const query = { owner: req.user._id, isDeleted: false };
        if (archived === 'true')
            query.isArchived = true;
        else
            query.isArchived = false;
        if (locked === 'true')
            query.isLocked = true;
        else
            query.isLocked = false;
        const assets = await Asset.find(query).sort({ createdAt: -1 });
        res.json(assets);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching assets' });
    }
};
export const toggleArchive = async (req, res) => {
    try {
        const asset = await Asset.findOne({ _id: req.params.id, owner: req.user._id });
        if (!asset)
            return res.status(404).json({ message: 'Asset not found' });
        asset.isArchived = !asset.isArchived;
        await asset.save();
        res.json(asset);
    }
    catch (error) {
        res.status(500).json({ message: 'Error archiving asset' });
    }
};
export const lockAsset = async (req, res) => {
    try {
        const { password } = req.body;
        const asset = await Asset.findOne({ _id: req.params.id, owner: req.user._id });
        if (!asset)
            return res.status(404).json({ message: 'Asset not found' });
        asset.isLocked = true;
        asset.lockPassword = password; // Should be hashed in production
        await asset.save();
        res.json({ message: 'Asset locked successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error locking asset' });
    }
};
export const unlockAssetAccess = async (req, res) => {
    try {
        const { password } = req.body;
        const asset = await Asset.findOne({ _id: req.params.id, owner: req.user._id });
        if (!asset)
            return res.status(404).json({ message: 'Asset not found' });
        if (asset.lockPassword !== password) {
            return res.status(401).json({ message: 'Incorrect password' });
        }
        res.json({ message: 'Verified' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error' });
    }
};
export const streamAsset = async (req, res) => {
    try {
        const asset = await Asset.findById(req.params.id);
        if (!asset || asset.isDeleted) {
            return res.status(404).json({ message: 'Asset not found' });
        }
        // Check ownership or public status
        if (asset.owner.toString() !== req.user._id.toString() && !asset.isPublic) {
            return res.status(403).json({ message: 'Not authorized' });
        }
        const authTag = asset.metadata.get('authTag');
        const decryptedBuffer = await StorageService.getFile(asset.path, asset.iv, authTag);
        // Logging access
        await AuditLog.create({
            user: req.user._id,
            action: 'ACCESS',
            asset: asset._id,
            details: `Accessed (streamed) asset: ${asset.name}`
        });
        res.set('Content-Type', asset.mimeType);
        res.set('Content-Length', decryptedBuffer.length.toString());
        res.set('Content-Disposition', `inline; filename="${asset.originalName}"`);
        res.send(decryptedBuffer);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error streaming file' });
    }
};
export const deleteAsset = async (req, res) => {
    try {
        const asset = await Asset.findById(req.params.id);
        if (!asset)
            return res.status(404).json({ message: 'Asset not found' });
        if (asset.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }
        asset.isDeleted = true;
        await asset.save();
        await AuditLog.create({
            user: req.user._id,
            action: 'DELETE',
            asset: asset._id,
            details: `Deleted asset: ${asset.name}`
        });
        res.json({ message: 'Asset deleted' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting asset' });
    }
};
//# sourceMappingURL=assetController.js.map