import express from 'express';
import multer from 'multer';
import { uploadAsset, getAssets, streamAsset, deleteAsset } from '../controllers/assetController.js';
import { protect } from '../middlewares/authMiddleware.js';
const router = express.Router();
// Multer memory storage (since we encrypt before saving)
const upload = multer({ storage: multer.memoryStorage() });
router.use(protect);
router.post('/upload', upload.single('file'), uploadAsset);
router.get('/', getAssets);
router.get('/:id/stream', streamAsset);
router.delete('/:id', deleteAsset);
export default router;
//# sourceMappingURL=assetRoutes.js.map