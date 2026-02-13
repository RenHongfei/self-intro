-- 创建数据库
CREATE DATABASE IF NOT EXISTS self_intro DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE self_intro;

-- 管理员用户表
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 内容块表
CREATE TABLE IF NOT EXISTS content_blocks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  type ENUM('text', 'richtext', 'image', 'video', 'pdf', 'title', 'section') NOT NULL,
  title VARCHAR(255),
  content TEXT,
  media_url VARCHAR(500),
  media_alt VARCHAR(255),
  settings JSON,
  sort_order INT DEFAULT 0,
  is_visible BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 点赞记录表
CREATE TABLE IF NOT EXISTS likes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  content_block_id INT NOT NULL,
  visitor_id VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (content_block_id) REFERENCES content_blocks(id) ON DELETE CASCADE,
  UNIQUE KEY unique_like (content_block_id, visitor_id)
);

-- 点赞统计表
CREATE TABLE IF NOT EXISTS like_counts (
  content_block_id INT PRIMARY KEY,
  count INT DEFAULT 0,
  FOREIGN KEY (content_block_id) REFERENCES content_blocks(id) ON DELETE CASCADE
);

-- 页面配置表
CREATE TABLE IF NOT EXISTS page_config (
  id INT AUTO_INCREMENT PRIMARY KEY,
  config_key VARCHAR(100) NOT NULL UNIQUE,
  config_value JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 插入默认管理员 (密码: admin123，需要在应用中修改)
INSERT INTO users (username, password) VALUES ('admin', '$2a$10$placeholder_hash_change_this');

-- 插入示例内容
INSERT INTO content_blocks (type, title, content, sort_order) VALUES 
('title', '你好，我是小明', '欢迎来到我的个人主页', 1),
('text', '关于我', '我是一名热爱编程的开发者，喜欢探索新技术和创造有趣的项目。', 2),
('section', '我的技能', NULL, 3);

-- 插入默认页面配置
INSERT INTO page_config (config_key, config_value) VALUES 
('theme', '{"primaryColor": "#FF6B9D", "secondaryColor": "#C44569", "backgroundColor": "#FFF5F8"}'),
('profile', '{"name": "小明", "avatar": "", "bio": "热爱生活的程序员"}');
