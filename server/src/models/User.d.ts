import mongoose, { Document } from 'mongoose';
export declare enum UserRole {
    ADMIN = "ADMIN",
    MANAGER = "MANAGER",
    USER = "USER"
}
export interface IUser extends Document {
    googleId?: string;
    email: string;
    password?: string;
    name: string;
    avatar?: string;
    role: UserRole;
    isEmailVerified: boolean;
    twoFactorEnabled: boolean;
    storageUsed: number;
    storageLimit: number;
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<IUser, {}, {}, {}, mongoose.Document<unknown, {}, IUser, {}, mongoose.DefaultSchemaOptions> & IUser & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IUser>;
export default _default;
//# sourceMappingURL=User.d.ts.map