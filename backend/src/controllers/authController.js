import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import pool from '../config/database.js';
import { ValidationError, UnauthorizedError } from '../middleware/errorHandler.js';

export const login = async (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    throw new ValidationError('用户名和密码不能为空');
  }

  const [users] = await pool.execute(
    'SELECT * FROM users WHERE username = ?',
    [username]
  );

  if (users.length === 0) {
    throw new UnauthorizedError('用户名或密码错误');
  }

  const user = users[0];
  const isValidPassword = await bcrypt.compare(password, user.password);

  if (!isValidPassword) {
    throw new UnauthorizedError('用户名或密码错误');
  }

  const token = jwt.sign(
    { userId: user.id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );

  res.json({
    message: '登录成功',
    token,
    user: {
      id: user.id,
      username: user.username
    }
  });
};

export const changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const userId = req.user.userId;

  if (!oldPassword || !newPassword) {
    throw new ValidationError('旧密码和新密码不能为空');
  }

  if (newPassword.length < 6) {
    throw new ValidationError('新密码长度至少6位');
  }

  const [users] = await pool.execute(
    'SELECT * FROM users WHERE id = ?',
    [userId]
  );

  if (users.length === 0) {
    throw new UnauthorizedError('用户不存在');
  }

  const user = users[0];
  const isValidPassword = await bcrypt.compare(oldPassword, user.password);

  if (!isValidPassword) {
    throw new UnauthorizedError('旧密码错误');
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await pool.execute(
    'UPDATE users SET password = ? WHERE id = ?',
    [hashedPassword, userId]
  );

  res.json({ message: '密码修改成功' });
};
