import { Router } from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';
import { authMiddleware } from '../middleware/auth.js';
import * as authController from '../controllers/authController.js';

const router = Router();

router.post('/login', asyncHandler(authController.login));
router.post('/change-password', authMiddleware, asyncHandler(authController.changePassword));
router.get('/verify', authMiddleware, (req, res) => {
  res.json({ valid: true, user: req.user });
});

export default router;
