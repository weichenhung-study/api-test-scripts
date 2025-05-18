@echo off
setlocal enabledelayedexpansion

:: 清空 metrics.txt（避免多餘空行）
type nul > metrics.txt

:: 逐行讀取 classlist.txt 並執行 ckjm
for /f "delims=" %%i in (classlist.txt) do (
    echo 分析: %%i
    java -jar ckjm-1.0-SNAPSHOT.jar "%%i" >> metrics.txt
)

echo 完成分析！
pause
