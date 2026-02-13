import pool from '../config/database.js';
import { ValidationError } from '../middleware/errorHandler.js';

const getVisitorId = (req) => {
  return req.ip || 
         req.headers['x-forwarded-for']?.split(',')[0]?.trim() || 
         req.headers['x-real-ip'] ||
         'anonymous';
};

export const toggleLike = async (req, res) => {
  const { contentBlockId } = req.params;
  
  if (!contentBlockId || isNaN(parseInt(contentBlockId))) {
    throw new ValidationError('无效的内容ID');
  }

  const visitorId = getVisitorId(req);
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [content] = await connection.execute(
      'SELECT id FROM content_blocks WHERE id = ?',
      [contentBlockId]
    );

    if (content.length === 0) {
      throw new ValidationError('内容不存在');
    }

    const [existing] = await connection.execute(
      'SELECT * FROM likes WHERE content_block_id = ? AND visitor_id = ?',
      [contentBlockId, visitorId]
    );

    if (existing.length > 0) {
      await connection.execute(
        'DELETE FROM likes WHERE content_block_id = ? AND visitor_id = ?',
        [contentBlockId, visitorId]
      );
      await connection.execute(
        'UPDATE like_counts SET count = GREATEST(0, count - 1) WHERE content_block_id = ?',
        [contentBlockId]
      );
      
      await connection.commit();
      res.json({ liked: false, message: '取消点赞' });
    } else {
      await connection.execute(
        'INSERT INTO likes (content_block_id, visitor_id) VALUES (?, ?)',
        [contentBlockId, visitorId]
      );
      
      const [countExists] = await connection.execute(
        'SELECT * FROM like_counts WHERE content_block_id = ?',
        [contentBlockId]
      );

      if (countExists.length > 0) {
        await connection.execute(
          'UPDATE like_counts SET count = count + 1 WHERE content_block_id = ?',
          [contentBlockId]
        );
      } else {
        await connection.execute(
          'INSERT INTO like_counts (content_block_id, count) VALUES (?, 1)',
          [contentBlockId]
        );
      }

      await connection.commit();
      res.json({ liked: true, message: '点赞成功' });
    }
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

export const getLikes = async (req, res) => {
  const { contentBlockId } = req.params;
  
  if (!contentBlockId || isNaN(parseInt(contentBlockId))) {
    throw new ValidationError('无效的内容ID');
  }

  const visitorId = getVisitorId(req);

  const [counts] = await pool.execute(
    'SELECT count FROM like_counts WHERE content_block_id = ?',
    [contentBlockId]
  );

  const [userLike] = await pool.execute(
    'SELECT 1 FROM likes WHERE content_block_id = ? AND visitor_id = ? LIMIT 1',
    [contentBlockId, visitorId]
  );

  res.json({
    count: counts.length > 0 ? counts[0].count : 0,
    liked: userLike.length > 0
  });
};

export const getAllLikes = async (req, res) => {
  const [rows] = await pool.execute(
    'SELECT content_block_id, count FROM like_counts WHERE count > 0'
  );
  
  const result = {};
  rows.forEach(row => {
    result[row.content_block_id] = row.count;
  });

  res.json(result);
};
