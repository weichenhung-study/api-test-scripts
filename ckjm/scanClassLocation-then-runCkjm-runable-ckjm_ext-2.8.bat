@echo off
chcp 65001 >nul
setlocal EnableDelayedExpansion

set /p projectName=請輸入專案名稱 (例如 jersey-monolith): 
set "CLASSROOT=D:\Project\%projectName%\target\classes"
set "LIBROOT=D:\Project\%projectName%\lib"
set "projectName=%projectName:\=_%"
set "METRICS=metrics_%projectName%.csv"
set "METRICS_RAW=metrics_raw_%projectName%.txt"
set "CLASS_LIST=class_list.txt"

:: 清除舊檔案
del "%METRICS%" >nul 2>nul
del "%METRICS_RAW%" >nul 2>nul
del "%CLASS_LIST%" >nul 2>nul

echo 掃描 class 檔案...
dir /s /b "%CLASSROOT%\*.class" > "%CLASS_LIST%"

:: 建立變數保存所有 .class 檔路徑
set "ALL_CLASSES="
for /f "usebackq delims=" %%i in ("%CLASS_LIST%") do (
    set "ALL_CLASSES=!ALL_CLASSES! "%%i""
)

:: 構建 classpath（含 CKJM jar、自行 class、與所有 lib JAR）
set "CP=runable-ckjm_ext-2.8.jar;%CLASSROOT%"
for %%j in ("%LIBROOT%\*.jar") do (
    set "CP=!CP!;%%j"
)

echo 開始執行 CKJM 分析...
java -cp "!CP!" gr.spinellis.ckjm.MetricsFilter !ALL_CLASSES! > "%METRICS_RAW%"

:: 處理為 CSV
echo ClassName,WMC,DIT,NOC,CBO,RFC,LCOM,Ca,NPM > "%METRICS%"
powershell -Command "Get-Content '%METRICS_RAW%' | ForEach-Object { ($_ -replace '\s+', ',') } | Add-Content '%METRICS%'"

:: 清除暫存
::del "%CLASS_LIST%" >nul 2>nul
::del "%METRICS_RAW%" >nul 2>nul

echo 完成分析！結果已寫入 %METRICS%
pause
