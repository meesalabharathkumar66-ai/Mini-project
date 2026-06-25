import mongoose, { Schema, Document } from 'mongoose';

export interface IAssetVersion {
  version: number;
  path: string;
  iv: string;
  encryptionKey: string;
  size: number;
  createdAt: Date;
}

export interface IAsset extends Document {
  name: string;
  originalName: string;
  mimeType: string;
  size: number;
  extension: string;
  path: string; // Current version path
  folderPath: string; // For directory structure preservation
  encryptionKey: string;
  iv: string;
  fileHash: string;
  owner: mongoose.Types.ObjectId;
  tags: string[];
  category: string;
  metadata: Record<string, any>;
  isPublic: boolean;
  isArchived: boolean;
  isLocked: boolean;
  lockPassword?: string;
  version: number;
  versions: IAssetVersion[];
  expiryDate?: Date;
  isDeleted: boolean;
  isEncrypted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const AssetSchema: Schema = new Schema({
  name: { type: String, required: true },
  originalName: { type: String, required: true },
  mimeType: { type: String, required: true },
  size: { type: Number, required: true },
  extension: { type: String, required: true },
  path: { type: String, required: true },
  folderPath: { type: String, default: '/' },
  encryptionKey: { type: String, required: true },
  iv: { type: String, required: true },
  fileHash: { type: String, required: true },
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  tags: [{ type: String }],
  category: { type: String, default: 'Uncategorized' },
  metadata: { type: Map, of: Schema.Types.Mixed, default: {} },
  isPublic: { type: Boolean, default: false },
  isArchived: { type: Boolean, default: false },
  isLocked: { type: Boolean, default: false },
  lockPassword: { type: String },
  version: { type: Number, default: 1 },
  versions: [{
    version: Number,
    path: String,
    iv: String,
    encryptionKey: String,
    size: Number,
    createdAt: { type: Date, default: Date.now }
  }],
  expiryDate: { type: Date },
  isDeleted: { type: Boolean, default: false },
  isEncrypted: { type: Boolean, default: false },
}, { timestamps: true });

// Index for search
AssetSchema.index({ name: 'text', originalName: 'text', tags: 'text' });

export default mongoose.model<IAsset>('Asset', AssetSchema);
