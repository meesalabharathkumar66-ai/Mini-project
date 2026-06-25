import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const AUTH_TAG_LENGTH = 16;
const KEY = crypto.scryptSync(process.env.ENCRYPTION_SECRET || 'default_secret_key_32_chars_long!!', 'salt', 32);

export class EncryptionService {
  /**
   * Encrypts a buffer
   */
  static encrypt(buffer: Buffer, customKey?: Buffer): { encryptedData: Buffer; iv: string; authTag: string } {
    const iv = crypto.randomBytes(IV_LENGTH);
    const encryptionKey = customKey || KEY;
    const cipher = crypto.createCipheriv(ALGORITHM, encryptionKey, iv);
    
    const encrypted = Buffer.concat([cipher.update(buffer), cipher.final()]);
    const authTag = cipher.getAuthTag();

    return {
      encryptedData: encrypted,
      iv: iv.toString('hex'),
      authTag: authTag.toString('hex')
    };
  }

  /**
   * Decrypts a buffer
   */
  static decrypt(encryptedData: Buffer, iv: string, authTag: string, customKey?: Buffer): Buffer {
    const encryptionKey = customKey || KEY;
    const decipher = crypto.createDecipheriv(ALGORITHM, encryptionKey, Buffer.from(iv, 'hex'));
    decipher.setAuthTag(Buffer.from(authTag, 'hex'));
    
    const decrypted = Buffer.concat([decipher.update(encryptedData), decipher.final()]);
    return decrypted;
  }

  /**
   * Generate a random key for per-file encryption if needed
   */
  static generateRandomKey(): string {
    return crypto.randomBytes(32).toString('hex');
  }
}
