@echo off
chcp 65001 >nul
setlocal EnableDelayedExpansion

:: 提示使用者輸入 project 名稱
set /p projectName=請輸入專案名稱 (例如 jersey-monolith): 

:: 設定變數
set "CLASSROOT=D:\Project\%projectName%\target\classes"

:: 將不合法字元轉為底線
set "projectName=%projectName:\=_%"
set "TMP=classlist_%projectName%.txt"
set "METRICS=metrics_%projectName%.txt"

:: 刪除舊的 classlist 檔
del "%TMP%" 2>nul

:: 遞迴掃描所有 .class 並輸出路徑
echo 正在掃描 %CLASSROOT% 中的 class 檔案...
for /R "%CLASSROOT%" %%f in (*.class) do (
    echo %%f>>"%TMP%"
)
echo 已將所有 class 路徑寫入 %TMP%

:: 清空 metrics 檔
type nul > "%METRICS%"

:: 執行 ckjm 分析
echo 開始執行 CKJM 分析...
for /f "delims=" %%i in (%TMP%) do (
    echo 分析: %%i
    java -jar ckjm-1.0-SNAPSHOT.jar "%%i" >> "%METRICS%"
)

echo 完成分析！結果已寫入 %METRICS%
pause
