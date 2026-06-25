import mongoose, { Document } from 'mongoose';
export interface IAuditLog extends Document {
    user: mongoose.Types.ObjectId;
    action: string;
    asset?: mongoose.Types.ObjectId;
    details?: string;
    ipAddress?: string;
    userAgent?: string;
    createdAt: Date;
}
declare const _default: mongoose.Model<IAuditLog, {}, {}, {}, mongoose.Document<unknown, {}, IAuditLog, {}, mongoose.DefaultSchemaOptions> & IAuditLog & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IAuditLog>;
export default _default;
//# sourceMappingURL=AuditLog.d.ts.map