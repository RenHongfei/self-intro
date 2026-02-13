import { Router } from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';
import { authMiddleware } from '../middleware/auth.js';
import * as likeController from '../controllers/likeController.js';

const router = Router();

router.post('/:contentBlockId', asyncHandler(likeController.toggleLike));
router.get('/:contentBlockId', asyncHandler(likeController.getLikes));
router.get('/', asyncHandler(likeController.getAllLikes));

export default router;
