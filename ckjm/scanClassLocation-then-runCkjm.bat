@echo off
chcp 65001 >nul
setlocal EnableDelayedExpansion

:: 提示使用者輸入 project 名稱
set /p projectName=請輸入專案名稱 (例如 jersey-monolith): 

:: 原始 class 目錄
set "CLASSROOT=D:\Project\%projectName%\target\classes"

:: 將專案名稱中的 \ 換成 _
set "projectName=%projectName:\=_%" 

:: 設定輸出檔名
set "TMP=classlist_%projectName%.txt"
set "METRICS=metrics_%projectName%.csv"

:: 刪除舊檔案（如有）
del "%TMP%" >nul 2>nul
del "%METRICS%" >nul 2>nul

:: 掃描所有 .class 並儲存到 TMP
echo 正在掃描 %CLASSROOT% 中的 class 檔案...
for /R "%CLASSROOT%" %%f in (*.class) do (
    echo %%f>>"%TMP%"
)
echo 已將所有 class 路徑寫入 %TMP%

:: 建立 metrics 檔並寫入 CSV 標頭
echo ClassName,WMC,DIT,NOC,CBO,RFC,LCOM,Ca,NPM > "%METRICS%"

:: 執行 CKJM 分析並轉換為 CSV 格式
echo 開始執行 CKJM 分析...
for /f "delims=" %%i in (%TMP%) do (
    echo 分析: %%i
    for /f "delims=" %%m in ('java -jar ckjm-1.0-SNAPSHOT.jar "%%i"') do (
        rem 使用 powershell 將空白轉換為逗號，並以 no newline 輸出
        for /f "delims=" %%x in ('powershell -Command "$line = '%%m'; $line -replace '\s+', ','"') do (
            echo %%x>>"%METRICS%"
        )
    )
)

:: 刪除 class list 暫存檔
del "%TMP%" >nul 2>nul

echo 完成分析！結果已寫入 %METRICS%
pause
