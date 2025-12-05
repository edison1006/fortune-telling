#!/bin/bash
# 启动后端服务器的简单脚本

echo "Starting Fortune Telling Backend Server..."
echo "Make sure you have installed dependencies: pip install -r requirements.txt"
echo ""

# 检查是否在正确的目录
if [ ! -f "main.py" ]; then
    echo "Error: Please run this script from the backend directory"
    exit 1
fi

# 设置默认端口
PORT=${PORT:-8000}

# 启动服务器
echo "Starting server on http://127.0.0.1:${PORT}"
echo "API docs available at http://127.0.0.1:${PORT}/docs"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

uvicorn main:app --reload --host 127.0.0.1 --port ${PORT}

