import mongoose, { Schema, Document } from 'mongoose';

export interface IShareLink extends Document {
  asset: mongoose.Types.ObjectId;
  token: string;
  creator: mongoose.Types.ObjectId;
  expiresAt?: Date;
  downloadLimit?: number;
  downloadCount: number;
  password?: string;
  createdAt: Date;
}

const ShareLinkSchema: Schema = new Schema({
  asset: { type: Schema.Types.ObjectId, ref: 'Asset', required: true },
  token: { type: String, required: true, unique: true },
  creator: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  expiresAt: { type: Date },
  downloadLimit: { type: Number },
  downloadCount: { type: Number, default: 0 },
  password: { type: String },
}, { timestamps: true });

export default mongoose.model<IShareLink>('ShareLink', ShareLinkSchema);
