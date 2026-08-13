import express from 'express';
import {
  getPublicProducts,
  getPublicProductBySlug,
  getAdminProducts,
  getAdminProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js';
import { authenticateAdmin } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/products', getPublicProducts);
router.get('/products/:slug', getPublicProductBySlug);

// Admin routes
router.get('/admin/products', authenticateAdmin, getAdminProducts);
router.post('/admin/products', authenticateAdmin, createProduct);
router.get('/admin/products/:id', authenticateAdmin, getAdminProductById);
router.put('/admin/products/:id', authenticateAdmin, updateProduct);
router.patch('/admin/products/:id', authenticateAdmin, updateProduct);
router.delete('/admin/products/:id', authenticateAdmin, deleteProduct);

export default router;
