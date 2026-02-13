import { Router } from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';
import { authMiddleware } from '../middleware/auth.js';
import * as contentController from '../controllers/contentController.js';

const router = Router();

router.get('/', asyncHandler(contentController.getAllContent));
router.get('/admin', authMiddleware, asyncHandler(contentController.getAllContentAdmin));
router.get('/:id', asyncHandler(contentController.getContentById));
router.post('/', authMiddleware, asyncHandler(contentController.createContent));
router.put('/:id', authMiddleware, asyncHandler(contentController.updateContent));
router.delete('/:id', authMiddleware, asyncHandler(contentController.deleteContent));
router.put('/sort/order', authMiddleware, asyncHandler(contentController.updateSortOrder));

export default router;
