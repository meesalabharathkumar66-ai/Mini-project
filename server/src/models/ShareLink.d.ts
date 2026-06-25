import mongoose, { Document } from 'mongoose';
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
declare const _default: mongoose.Model<IShareLink, {}, {}, {}, mongoose.Document<unknown, {}, IShareLink, {}, mongoose.DefaultSchemaOptions> & IShareLink & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IShareLink>;
export default _default;
//# sourceMappingURL=ShareLink.d.ts.map