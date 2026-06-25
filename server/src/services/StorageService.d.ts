export declare class StorageService {
    private static storagePath;
    static saveFile(file: Express.Multer.File): Promise<{
        path: string;
        iv: string;
        authTag: string;
    }>;
    static getFile(fileName: string, iv: string, authTag: string): Promise<Buffer>;
    static deleteFile(fileName: string): Promise<void>;
}
//# sourceMappingURL=StorageService.d.ts.map