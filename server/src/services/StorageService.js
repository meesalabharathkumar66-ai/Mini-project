import fs from 'fs';
import path from 'path';
import { EncryptionService } from './EncryptionService.js';
export class StorageService {
    static storagePath = process.env.STORAGE_PATH || './uploads';
    static async saveFile(file) {
        if (!fs.existsSync(this.storagePath)) {
            fs.mkdirSync(this.storagePath, { recursive: true });
        }
        const { encryptedData, iv, authTag } = EncryptionService.encrypt(file.buffer);
        const fileName = `${Date.now()}-${file.originalname}.enc`;
        const fullPath = path.join(this.storagePath, fileName);
        fs.writeFileSync(fullPath, encryptedData);
        return {
            path: fileName,
            iv,
            authTag
        };
    }
    static async getFile(fileName, iv, authTag) {
        const fullPath = path.join(this.storagePath, fileName);
        if (!fs.existsSync(fullPath)) {
            throw new Error('File not found');
        }
        const encryptedData = fs.readFileSync(fullPath);
        return EncryptionService.decrypt(encryptedData, iv, authTag);
    }
    static async deleteFile(fileName) {
        const fullPath = path.join(this.storagePath, fileName);
        if (fs.existsSync(fullPath)) {
            fs.unlinkSync(fullPath);
        }
    }
}
//# sourceMappingURL=StorageService.js.map