import {} from 'express';
import User from '../models/User.js';
const LIMITS = {
    image: { min: 10 * 1024, max: 20 * 1024 * 1024 }, // 10KB - 20MB
    pdf: { min: 1024, max: 100 * 1024 * 1024 }, // 1KB - 100MB
    video: { min: 100 * 1024, max: 1024 * 1024 * 1024 }, // 100KB - 1GB
    audio: { min: 10 * 1024, max: 500 * 1024 * 1024 }, // 10KB - 500MB
    document: { min: 1024, max: 50 * 1024 * 1024 }, // 1KB - 50MB
    zip: { min: 10 * 1024, max: 2 * 1024 * 1024 * 1024 }, // 10KB - 2GB
};
export const validateAsset = async (req, res, next) => {
    if (!req.file)
        return next();
    const mime = req.file.mimetype;
    const size = req.file.size;
    let type = 'document';
    if (mime.startsWith('image/'))
        type = 'image';
    else if (mime.startsWith('video/'))
        type = 'video';
    else if (mime.startsWith('audio/'))
        type = 'audio';
    else if (mime === 'application/pdf')
        type = 'pdf';
    else if (mime === 'application/zip' || mime.includes('archive'))
        type = 'zip';
    const limit = LIMITS[type];
    // 1. Check strict size limits per type
    if (limit) {
        if (size < limit.min) {
            return res.status(400).json({ message: `File too small. Minimum for ${type} is ${limit.min / 1024} KB` });
        }
        if (size > limit.max) {
            return res.status(400).json({ message: `File too large. Maximum for ${type} is ${limit.max / (1024 * 1024)} MB` });
        }
    }
    // 2. Check user storage quota (10GB)
    const user = await User.findById(req.user._id);
    if (user) {
        if (user.storageUsed + size > user.storageLimit) {
            return res.status(400).json({ message: 'Storage quota exceeded (10GB limit)' });
        }
    }
    next();
};
//# sourceMappingURL=validateAsset.js.map