export declare class EncryptionService {
    /**
     * Encrypts a buffer
     */
    static encrypt(buffer: Buffer): {
        encryptedData: Buffer;
        iv: string;
        authTag: string;
    };
    /**
     * Decrypts a buffer
     */
    static decrypt(encryptedData: Buffer, iv: string, authTag: string): Buffer;
    /**
     * Generate a random key for per-file encryption if needed
     */
    static generateRandomKey(): string;
}
//# sourceMappingURL=EncryptionService.d.ts.map