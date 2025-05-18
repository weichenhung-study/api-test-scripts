@echo off
chcp 65001 >nul
setlocal EnableDelayedExpansion

:: 提示使用者輸入 project 名稱
set /p projectName=請輸入專案名稱 (例如 jersey-monolith): 

:: 設定變數
set "CLASSROOT=D:\Project\%projectName%\target\classes"
set "TMP=classlist_%projectName%.txt"
del "%TMP%" 2>nul

for /R "%CLASSROOT%" %%f in (*.class) do (
    echo %%f>>"%TMP%"
)

echo All absolute class paths written to %TMP%
