import mongoose, { Document } from 'mongoose';
export interface IAsset extends Document {
    name: string;
    originalName: string;
    mimeType: string;
    size: number;
    extension: string;
    path: string;
    encryptionKey: string;
    iv: string;
    owner: mongoose.Types.ObjectId;
    tags: string[];
    category: string;
    metadata: Record<string, any>;
    isPublic: boolean;
    isArchived: boolean;
    isLocked: boolean;
    lockPassword?: string;
    version: number;
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<IAsset, {}, {}, {}, mongoose.Document<unknown, {}, IAsset, {}, mongoose.DefaultSchemaOptions> & IAsset & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IAsset>;
export default _default;
//# sourceMappingURL=Asset.d.ts.map