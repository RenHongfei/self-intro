import pool from '../config/database.js';
import { ValidationError, NotFoundError } from '../middleware/errorHandler.js';

export const getAllContent = async (req, res) => {
  const [rows] = await pool.execute(
    'SELECT * FROM content_blocks WHERE is_visible = TRUE ORDER BY sort_order ASC'
  );
  res.json(rows);
};

export const getAllContentAdmin = async (req, res) => {
  const [rows] = await pool.execute(
    'SELECT * FROM content_blocks ORDER BY sort_order ASC'
  );
  res.json(rows);
};

export const getContentById = async (req, res) => {
  const { id } = req.params;
  
  if (!id || isNaN(parseInt(id))) {
    throw new ValidationError('无效的内容ID');
  }

  const [rows] = await pool.execute(
    'SELECT * FROM content_blocks WHERE id = ?',
    [id]
  );

  if (rows.length === 0) {
    throw new NotFoundError('内容不存在');
  }

  res.json(rows[0]);
};

const VALID_TYPES = ['text', 'richtext', 'image', 'video', 'pdf', 'title', 'section'];

export const createContent = async (req, res) => {
  const { type, title, content, media_url, media_alt, settings, sort_order, is_visible } = req.body;

  if (!type || !VALID_TYPES.includes(type)) {
    throw new ValidationError(`内容类型必须是: ${VALID_TYPES.join(', ')}`);
  }

  const [result] = await pool.execute(
    `INSERT INTO content_blocks (type, title, content, media_url, media_alt, settings, sort_order, is_visible)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      type, 
      title || null, 
      content || null, 
      media_url || null, 
      media_alt || null, 
      JSON.stringify(settings || {}), 
      sort_order || 0, 
      is_visible !== false
    ]
  );

  res.status(201).json({
    message: '内容创建成功',
    id: result.insertId
  });
};

export const updateContent = async (req, res) => {
  const { id } = req.params;
  const { type, title, content, media_url, media_alt, settings, sort_order, is_visible } = req.body;

  if (!id || isNaN(parseInt(id))) {
    throw new ValidationError('无效的内容ID');
  }

  if (type && !VALID_TYPES.includes(type)) {
    throw new ValidationError(`内容类型必须是: ${VALID_TYPES.join(', ')}`);
  }

  const [existing] = await pool.execute(
    'SELECT id FROM content_blocks WHERE id = ?',
    [id]
  );

  if (existing.length === 0) {
    throw new NotFoundError('内容不存在');
  }

  await pool.execute(
    `UPDATE content_blocks 
     SET type = COALESCE(?, type), 
         title = COALESCE(?, title), 
         content = COALESCE(?, content), 
         media_url = COALESCE(?, media_url), 
         media_alt = COALESCE(?, media_alt), 
         settings = COALESCE(?, settings), 
         sort_order = COALESCE(?, sort_order), 
         is_visible = COALESCE(?, is_visible)
     WHERE id = ?`,
    [
      type || null,
      title !== undefined ? title : null,
      content !== undefined ? content : null,
      media_url !== undefined ? media_url : null,
      media_alt !== undefined ? media_alt : null,
      settings !== undefined ? JSON.stringify(settings) : null,
      sort_order !== undefined ? sort_order : null,
      is_visible !== undefined ? is_visible : null,
      id
    ]
  );

  res.json({ message: '内容更新成功', id: parseInt(id) });
};

export const deleteContent = async (req, res) => {
  const { id } = req.params;

  if (!id || isNaN(parseInt(id))) {
    throw new ValidationError('无效的内容ID');
  }

  const [result] = await pool.execute(
    'DELETE FROM content_blocks WHERE id = ?',
    [id]
  );

  if (result.affectedRows === 0) {
    throw new NotFoundError('内容不存在');
  }

  res.json({ message: '内容删除成功' });
};

export const updateSortOrder = async (req, res) => {
  const { items } = req.body;

  if (!Array.isArray(items) || items.length === 0) {
    throw new ValidationError('items必须是非空数组');
  }

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    for (const item of items) {
      if (!item.id || typeof item.sort_order !== 'number') {
        throw new ValidationError('每个item必须包含id和sort_order');
      }
      await connection.execute(
        'UPDATE content_blocks SET sort_order = ? WHERE id = ?',
        [item.sort_order, item.id]
      );
    }

    await connection.commit();
    res.json({ message: '排序更新成功', count: items.length });
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};
