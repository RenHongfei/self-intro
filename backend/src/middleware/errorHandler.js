class AppError extends Error {
  constructor(message, statusCode = 500, code = 'INTERNAL_ERROR') {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message) {
    super(message, 400, 'VALIDATION_ERROR');
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = '未授权访问') {
    super(message, 401, 'UNAUTHORIZED');
  }
}

export class ForbiddenError extends AppError {
  constructor(message = '禁止访问') {
    super(message, 403, 'FORBIDDEN');
  }
}

export class NotFoundError extends AppError {
  constructor(message = '资源不存在') {
    super(message, 404, 'NOT_FOUND');
  }
}

export class ConflictError extends AppError {
  constructor(message) {
    super(message, 409, 'CONFLICT');
  }
}

export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const code = err.code || 'INTERNAL_ERROR';
  
  if (process.env.NODE_ENV !== 'production') {
    console.error(`[${new Date().toISOString()}] Error:`, {
      message: err.message,
      code,
      stack: err.stack,
      path: req.path,
      method: req.method
    });
  }

  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ 
      error: '无效的令牌',
      code: 'INVALID_TOKEN'
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ 
      error: '令牌已过期',
      code: 'TOKEN_EXPIRED'
    });
  }

  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ 
      error: '文件大小超过限制（最大50MB）',
      code: 'FILE_TOO_LARGE'
    });
  }

  res.status(statusCode).json({
    error: err.isOperational ? err.message : '服务器内部错误',
    code,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  });
};

export const notFoundHandler = (req, res, next) => {
  next(new NotFoundError(`路由 ${req.method} ${req.path} 不存在`));
};
