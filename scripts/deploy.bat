@echo off
chcp 65001 >nul
echo.
echo ╔══════════════════════════════════════════════════╗
echo ║   Kason Marketing OS V3.0 — 一键部署启动器       ║
echo ╚══════════════════════════════════════════════════╝
echo.

REM Check if .env exists
if not exist "..\.env" (
    echo ❌ 未找到 .env 文件！
    echo.
    echo 请先执行以下步骤:
    echo   1. 复制 .env.example 为 .env
    echo   2. 填入 FEISHU_APP_ID 和 FEISHU_APP_SECRET
    echo   3. 重新运行此脚本
    echo.
    pause
    exit /b 1
)

echo ✅ .env 文件已找到
echo.
echo 即将执行:
echo   1. 安装依赖 (npm install)
echo   2. 自动创建飞书多维表格 (7个表)
echo   3. 自动注册47个技能
echo.
echo 预计耗时: 3-5 分钟
echo.
set /p CONFIRM="按 Enter 继续, 或 Ctrl+C 取消..."

echo.
echo 📦 步骤1: 安装依赖...
call npm install --prefix ..

echo.
echo 🚀 步骤2: 开始飞书部署...
node auto-deploy.js

echo.
echo ═══════════════════════════════════════════════
echo 部署完成! 请查看上方输出获取多维表格 URL
echo ═══════════════════════════════════════════════
pause
