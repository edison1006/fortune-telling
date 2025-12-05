# 快速启动指南

## 问题：计算失败 "Failed to fetch"

这个错误通常是因为后端服务器没有运行。

## 解决方案

### 方法1：使用启动脚本（推荐）

```bash
cd /Users/zhangxiaoyu/GitHub/fortune-telling/backend
python3 start_simple.py
```

### 方法2：直接使用 uvicorn

```bash
cd /Users/zhangxiaoyu/GitHub/fortune-telling/backend
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

### 方法3：使用 shell 脚本

```bash
cd /Users/zhangxiaoyu/GitHub/fortune-telling/backend
./start.sh
```

## 验证后端是否运行

启动后，在浏览器访问：
- http://127.0.0.1:8000/health （应该返回 `{"status": "ok"}`）
- http://127.0.0.1:8000/docs （API 文档）

## 测试八字接口

```bash
curl -X POST http://127.0.0.1:8000/bazi \
  -H "Content-Type: application/json" \
  -d '{"birth_date": "1990-01-01", "birth_time": "12:00"}'
```

## 注意事项

- 后端可以在没有数据库的情况下运行（计算结果会正常返回，但不会保存历史）
- AI 解读功能是可选的（如果没有配置 OpenAI API，会使用基础解读规则）
- 确保端口 8000 没有被其他程序占用

