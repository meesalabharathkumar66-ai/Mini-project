import mongoose, { Schema, Document } from 'mongoose';
const AuditLogSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    action: { type: String, required: true },
    asset: { type: Schema.Types.ObjectId, ref: 'Asset' },
    details: { type: String },
    ipAddress: { type: String },
    userAgent: { type: String },
}, { timestamps: true });
export default mongoose.model('AuditLog', AuditLogSchema);
//# sourceMappingURL=AuditLog.js.map