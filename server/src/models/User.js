import mongoose, { Schema, Document } from 'mongoose';
export var UserRole;
(function (UserRole) {
    UserRole["ADMIN"] = "ADMIN";
    UserRole["MANAGER"] = "MANAGER";
    UserRole["USER"] = "USER";
})(UserRole || (UserRole = {}));
const UserSchema = new Schema({
    googleId: { type: String, unique: true, sparse: true },
    email: { type: String, required: true, unique: true },
    password: { type: String }, // Optional for social login users
    name: { type: String, required: true },
    avatar: { type: String },
    role: { type: String, enum: Object.values(UserRole), default: UserRole.USER },
    isEmailVerified: { type: Boolean, default: false },
    twoFactorEnabled: { type: Boolean, default: false },
    storageUsed: { type: Number, default: 0 },
    storageLimit: { type: Number, default: 10 * 1024 * 1024 * 1024 }, // 10 GB
}, { timestamps: true });
export default mongoose.model('User', UserSchema);
//# sourceMappingURL=User.js.map