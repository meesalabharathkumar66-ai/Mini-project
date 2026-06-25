import mongoose, { Schema, Document } from 'mongoose';

export enum UserRole {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  USER = 'USER'
}

export interface IUser extends Document {
  googleId?: string;
  email: string;
  password?: string;
  vaultPassword?: string; // Hashed vault password for lock/unlock
  masterHash?: string; // Derived key hash for encryption verification
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  name: string;
  avatar?: string;
  role: UserRole;
  isEmailVerified: boolean;
  twoFactorEnabled: boolean;
  storageUsed: number; // in bytes
  storageLimit: number; // in bytes (default 10GB)
  loginAttempts: number;
  lockoutUntil?: Date | null;
  lastNameChangeAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema({
  googleId: { type: String, unique: true, sparse: true },
  email: { type: String, required: true, unique: true },
  password: { type: String }, // Optional for social login users
  vaultPassword: { type: String }, // For the "Locked Folder" and secure vaults
  masterHash: { type: String },
  firstName: { type: String },
  lastName: { type: String },
  phoneNumber: { type: String },
  name: { type: String, required: true },
  avatar: { type: String },
  role: { type: String, enum: Object.values(UserRole), default: UserRole.USER },
  isEmailVerified: { type: Boolean, default: false },
  twoFactorEnabled: { type: Boolean, default: false },
  storageUsed: { type: Number, default: 0 },
  storageLimit: { type: Number, default: 10 * 1024 * 1024 * 1024 }, // 10 GB
  loginAttempts: { type: Number, default: 0 },
  lockoutUntil: { type: Date },
  lastNameChangeAt: { type: Date, default: new Date(0) }, // Default to epoch to allow first change
}, { timestamps: true });

export default mongoose.model<IUser>('User', UserSchema);
