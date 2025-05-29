@echo off
chcp 65001 >nul
setlocal EnableDelayedExpansion

set /p projectName=請輸入專案名稱 (例如 jersey-monolith): 
set "CLASSROOT=D:\Project\%projectName%\target\classes"
set "LIBROOT=D:\Project\%projectName%\lib"
set "projectName=%projectName:\=_%"

set "OUTPUTDIR=%~dp0"
set "METRICS=%OUTPUTDIR%metrics_%projectName%.csv"
set "METRICS_RAW=%OUTPUTDIR%metrics_raw_%projectName%.txt"
set "CLASS_LIST=%OUTPUTDIR%class_list.txt"

del "%METRICS%" >nul 2>nul
del "%METRICS_RAW%" >nul 2>nul
del "%CLASS_LIST%" >nul 2>nul

echo 掃描 class 檔案...
dir /s /b "%CLASSROOT%\*.class" > "%CLASS_LIST%"

set "CP=runable-ckjm_ext-2.8.jar;%CLASSROOT%"
for %%j in ("%LIBROOT%\*.jar") do (
    set "CP=!CP!;%%~fj"
)

echo 開始逐檔執行 CKJM 分析...
for /f "usebackq delims=" %%i in ("%CLASS_LIST%") do (
    java -cp "!CP!" gr.spinellis.ckjm.MetricsFilter "%%i" >> "%METRICS_RAW%"
)

:: 加入表頭
echo ClassName,WMC,DIT,NOC,CBO,RFC,LCOM,Ca,Ce,NPM,LCOM3,LOC,DAM,MOA,MFA,CAM,IC,CBM,AMC > "%METRICS%"

:: 過濾 ~ method 行，格式化為 CSV
powershell -NoProfile -ExecutionPolicy Bypass -Command "Get-Content -LiteralPath '%METRICS_RAW%' | Where-Object { $_ -notmatch '^\s*~' } | ForEach-Object { ($_ -replace '\s+', ',') } | Add-Content -LiteralPath '%METRICS%'"

echo 完成分析！結果已寫入 %METRICS%
pause
