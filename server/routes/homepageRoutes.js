import express from 'express';
import { getPublicHomepage, getAdminHomepage, updateHomepage } from '../controllers/homepageController.js';
import { authenticateAdmin } from '../middleware/auth.js';

const router = express.Router();

// Public
router.get('/homepage', getPublicHomepage);

// Admin
router.get('/admin/homepage', authenticateAdmin, getAdminHomepage);
router.put('/admin/homepage', authenticateAdmin, updateHomepage);
router.patch('/admin/homepage', authenticateAdmin, updateHomepage);

export default router;
