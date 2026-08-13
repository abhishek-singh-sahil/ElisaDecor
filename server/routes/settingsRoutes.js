import express from 'express';
import { getPublicSettings, getAdminSettings, updateSettings } from '../controllers/settingsController.js';
import { authenticateAdmin } from '../middleware/auth.js';

const router = express.Router();

// Public
router.get('/settings', getPublicSettings);

// Admin
router.get('/admin/settings', authenticateAdmin, getAdminSettings);
router.put('/admin/settings', authenticateAdmin, updateSettings);
router.patch('/admin/settings', authenticateAdmin, updateSettings);

export default router;
