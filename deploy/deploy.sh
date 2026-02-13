#!/bin/bash

# 个人自我介绍网站部署脚本
# 在阿里云服务器上执行此脚本

set -e

echo "🚀 开始部署个人自我介绍网站..."

# 更新系统
echo "📦 更新系统包..."
sudo apt update && sudo apt upgrade -y

# 安装必要软件
echo "📥 安装必要软件..."
sudo apt install -y nginx mysql-server nodejs npm

# 安装 PM2
echo "📥 安装 PM2..."
sudo npm install -g pm2

# 创建项目目录
echo "📁 创建项目目录..."
sudo mkdir -p /var/www/self-intro
sudo chown -R $USER:$USER /var/www/self-intro

# 安装 MySQL 并创建数据库
echo "🗄️ 配置 MySQL..."
sudo mysql -u root <<EOF
CREATE DATABASE IF NOT EXISTS self_intro DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS 'self_intro'@'localhost' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON self_intro.* TO 'self_intro'@'localhost';
FLUSH PRIVILEGES;
EOF

# 克隆代码（如果是从GitHub部署）
# git clone https://github.com/your-username/self-intro.git /var/www/self-intro

# 或者手动上传代码到 /var/www/self-intro

# 后端设置
echo "⚙️ 配置后端..."
cd /var/www/self-intro/backend
npm install
cp .env.example .env
# 编辑 .env 文件设置数据库密码和JWT密钥
nano .env

# 初始化数据库
mysql -u self_intro -p self_intro < src/config/init.sql

# 前端设置
echo "⚙️ 配置前端..."
cd /var/www/self-intro/frontend
npm install
npm run build

# 配置 Nginx
echo "🌐 配置 Nginx..."
sudo cp /var/www/self-intro/deploy/nginx.conf /etc/nginx/sites-available/self-intro
sudo ln -sf /etc/nginx/sites-available/self-intro /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# 使用 PM2 启动后端
echo "🚀 启动后端服务..."
cd /var/www/self-intro/backend
pm2 start /var/www/self-intro/deploy/ecosystem.config.json
pm2 save
pm2 startup

echo "✅ 部署完成！"
echo "🌐 访问 http://47.251.101.229"
