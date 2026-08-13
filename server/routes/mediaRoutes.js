import express from 'express';
import multer from 'multer';
import {
  getMedia,
  uploadMediaAsset,
  updateMediaMetadata,
  deleteMediaAsset,
} from '../controllers/mediaController.js';
import { authenticateAdmin } from '../middleware/auth.js';

const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();

router.get('/admin/media', authenticateAdmin, getMedia);
router.post('/admin/media', authenticateAdmin, upload.single('file'), uploadMediaAsset);
router.patch('/admin/media/:id', authenticateAdmin, updateMediaMetadata);
router.delete('/admin/media/:id', authenticateAdmin, deleteMediaAsset);

export default router;
