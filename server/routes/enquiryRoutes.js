import express from 'express';
import {
  createEnquiry,
  getEnquiries,
  getEnquiryById,
  updateEnquiry,
  deleteEnquiry,
} from '../controllers/enquiryController.js';
import { authenticateAdmin } from '../middleware/auth.js';

const router = express.Router();

// Public submission
router.post('/enquiries', createEnquiry);

// Admin endpoints
router.get('/admin/enquiries', authenticateAdmin, getEnquiries);
router.get('/admin/enquiries/:id', authenticateAdmin, getEnquiryById);
router.patch('/admin/enquiries/:id', authenticateAdmin, updateEnquiry);
router.delete('/admin/enquiries/:id', authenticateAdmin, deleteEnquiry);

export default router;
