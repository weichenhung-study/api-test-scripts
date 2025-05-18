@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

:: 清空 metrics.txt（避免多餘空行）
type nul > metrics.txt

:: 提示使用者輸入 project 名稱
set /p projectName=請輸入專案名稱 (例如 jersey-monolith): 

:: 逐行讀取 classlist.txt 並執行 ckjm
for /f "delims=" %%i in (classlist_%projectName%.txt) do (
    echo 分析: %%i
    java -jar ckjm-1.0-SNAPSHOT.jar "%%i" >> metrics_%projectName%.txt
)

echo 完成分析！
pause
