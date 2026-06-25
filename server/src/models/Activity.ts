import mongoose, { Schema, Document } from 'mongoose';

export interface IActivity extends Document {
  asset: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  action: 'UPLOAD' | 'DOWNLOAD' | 'DELETE' | 'SHARE' | 'ARCHIVE' | 'LOCK' | 'UNLOCK' | 'VERSION_RESTORE' | 'EDIT';
  details?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
}

const ActivitySchema: Schema = new Schema({
  asset: { type: Schema.Types.ObjectId, ref: 'Asset', required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  action: { 
    type: String, 
    enum: ['UPLOAD', 'DOWNLOAD', 'DELETE', 'SHARE', 'ARCHIVE', 'LOCK', 'UNLOCK', 'VERSION_RESTORE', 'EDIT'],
    required: true 
  },
  details: { type: Map, of: Schema.Types.Mixed },
  ipAddress: { type: String },
  userAgent: { type: String },
}, { timestamps: { createdAt: true, updatedAt: false } });

ActivitySchema.index({ asset: 1, createdAt: -1 });
ActivitySchema.index({ user: 1, createdAt: -1 });

export default mongoose.model<IActivity>('Activity', ActivitySchema);
