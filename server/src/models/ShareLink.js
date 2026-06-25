import mongoose, { Schema, Document } from 'mongoose';
const ShareLinkSchema = new Schema({
    asset: { type: Schema.Types.ObjectId, ref: 'Asset', required: true },
    token: { type: String, required: true, unique: true },
    creator: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    expiresAt: { type: Date },
    downloadLimit: { type: Number },
    downloadCount: { type: Number, default: 0 },
    password: { type: String },
}, { timestamps: true });
export default mongoose.model('ShareLink', ShareLinkSchema);
//# sourceMappingURL=ShareLink.js.map