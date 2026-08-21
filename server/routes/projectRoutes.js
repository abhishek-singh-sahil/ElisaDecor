import express from 'express';
import {
  getPublicProjects,
  getPublicProjectBySlug,
  getAdminProjects,
  getAdminProjectById,
  createProject,
  updateProject,
  deleteProject,
} from '../controllers/projectController.js';
import { authenticateAdmin } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/projects', getPublicProjects);
router.get('/projects/:slug', getPublicProjectBySlug);

// Admin routes
router.get('/admin/projects', authenticateAdmin, getAdminProjects);
router.post('/admin/projects', authenticateAdmin, createProject);
router.get('/admin/projects/:id', authenticateAdmin, getAdminProjectById);
router.put('/admin/projects/:id', authenticateAdmin, updateProject);
router.patch('/admin/projects/:id', authenticateAdmin, updateProject);
router.delete('/admin/projects/:id', authenticateAdmin, deleteProject);

export default router;
