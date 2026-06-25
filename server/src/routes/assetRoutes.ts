import express from 'express';
import multer from 'multer';
import { 
  uploadAsset, 
  getAssets, 
  streamAsset, 
  deleteAsset, 
  getAssetAnalytics, 
  getAssetTimeline, 
  renameAsset, 
  detectDuplicates,
  getBinAssets,
  restoreAsset,
  permanentlyDeleteAsset,
  archiveAsset,
  unarchiveAsset,
  lockAsset,
  unlockAsset,
  unlockAssetAccess
} from '../controllers/assetController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Multer memory storage (since we encrypt before saving)
const upload = multer({ storage: multer.memoryStorage() });

router.use(protect);

router.post('/upload', upload.single('file'), uploadAsset);
router.get('/analytics', getAssetAnalytics);
router.get('/', getAssets);
router.get('/bin', getBinAssets);
router.get('/duplicates', detectDuplicates);
router.get('/:id/stream', streamAsset);
router.get('/:id/timeline', getAssetTimeline);
router.patch('/:id/rename', renameAsset);
router.patch('/:id/archive', archiveAsset);
router.patch('/:id/unarchive', unarchiveAsset);
router.post('/:id/lock', lockAsset);
router.patch('/:id/unlock', unlockAsset);
router.post('/:id/unlock-access', unlockAssetAccess);
router.patch('/:id/restore', restoreAsset);
router.delete('/:id', deleteAsset);
router.delete('/:id/permanent', permanentlyDeleteAsset);

export default router;
