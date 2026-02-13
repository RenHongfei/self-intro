import { Router } from 'express';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { asyncHandler, ValidationError } from '../middleware/errorHandler.js';
import { authMiddleware } from '../middleware/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = Router();

const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${uuidv4()}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedMimes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'video/mp4',
    'video/webm',
    'application/pdf'
  ];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new ValidationError('不支持的文件类型，仅支持图片、视频和PDF'));
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter
});

router.post('/upload', authMiddleware, upload.single('file'), asyncHandler((req, res) => {
  if (!req.file) {
    throw new ValidationError('没有上传文件');
  }

  res.json({
    message: '文件上传成功',
    url: `/uploads/${req.file.filename}`,
    filename: req.file.filename,
    size: req.file.size,
    mimetype: req.file.mimetype
  });
}));

router.delete('/:filename', authMiddleware, asyncHandler((req, res) => {
  const { filename } = req.params;
  
  if (!filename.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.[a-z0-9]+$/i)) {
    throw new ValidationError('无效的文件名');
  }

  const filepath = path.join(uploadDir, filename);

  if (!fs.existsSync(filepath)) {
    return res.status(404).json({ error: '文件不存在' });
  }

  fs.unlinkSync(filepath);
  res.json({ message: '文件删除成功' });
}));

export default router;
