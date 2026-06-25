import mongoose, { Schema, Document } from 'mongoose';
const AssetSchema = new Schema({
    name: { type: String, required: true },
    originalName: { type: String, required: true },
    mimeType: { type: String, required: true },
    size: { type: Number, required: true },
    extension: { type: String, required: true },
    path: { type: String, required: true },
    encryptionKey: { type: String, required: true },
    iv: { type: String, required: true },
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    tags: [{ type: String }],
    category: { type: String, default: 'Uncategorized' },
    metadata: { type: Map, of: Schema.Types.Mixed, default: {} },
    isPublic: { type: Boolean, default: false },
    isArchived: { type: Boolean, default: false },
    isLocked: { type: Boolean, default: false },
    lockPassword: { type: String },
    version: { type: Number, default: 1 },
    isDeleted: { type: Boolean, default: false },
}, { timestamps: true });
// Index for search
AssetSchema.index({ name: 'text', originalName: 'text', tags: 'text' });
export default mongoose.model('Asset', AssetSchema);
//# sourceMappingURL=Asset.js.map