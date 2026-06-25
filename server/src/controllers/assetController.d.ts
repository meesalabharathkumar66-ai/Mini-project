import { type Request, type Response } from 'express';
export declare const uploadAsset: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getAssets: (req: Request, res: Response) => Promise<void>;
export declare const toggleArchive: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const lockAsset: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const unlockAssetAccess: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const streamAsset: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteAsset: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=assetController.d.ts.map