@echo off
chcp 65001 >nul
echo ★ 開始執行匯出 %~nx0 結果檔：執行curl
echo.



setlocal enabledelayedexpansion

:: 取得批次檔名稱（不含副檔名）
set "BATCH_NAME=%~n0"

:: docker container port號
set "PORT=8071"

:: 取得當前日期與時間
for /f "tokens=2 delims==." %%I in ('wmic os get localdatetime /value') do set datetime=%%I
set "YYYYMMDD=%datetime:~0,8%"
set "HHMMSS=%datetime:~8,6%"

:: 設定目標資料夾與檔案名稱
set "BASE_DIR=result"
set "LOG_DIR=%BASE_DIR%\%YYYYMMDD%"
set "LOG_FILE=%BATCH_NAME%_%YYYYMMDD%%HHMMSS%.txt"

:: 若目錄不存在則建立
if not exist "%LOG_DIR%" mkdir "%LOG_DIR%"

:: 記錄執行日誌
set "LOG_PATH=%LOG_DIR%\%LOG_FILE%"

:: URL 路徑
set "SC0101001-Application=res/SC0101001"
set "SC0102001-Review=res/SC0102001"
set "SC0103001-Activation=res/SC0103001"
set "SC0104001-Transaction=res/SC0104001"
set "SC0106001-TransactionQuery=res/SC0106001"
set "SC0106002-DisputeNotation=res/SC0106002"
set "SC0107001-FeePayment=res/SC0107001"

:: 定義大寫英文字母
set "LETTERS=ABCDEFGHIJKLMNOPQRSTUVWXYZ"

:: 產生首字（大寫字母）
set /a randIndex=%random% %% 26
set "CID=!LETTERS:~%randIndex%,1!"

:: 產生後續 9 碼（0-9 數字）
for /l %%i in (1,1,9) do (
    set /a randNum=!random! %% 10
    set "CID=!CID!!randNum!"
)

:: 檢查 temp 資料夾是否存在，若不存在則創建
if not exist "%~dp0temp" (
    mkdir "%~dp0temp"
)

:: 將身分證號儲存為檔案
<nul set /p ="!CID!" >"%~dp0temp\cid.txt"

:: 執行各步驟並記錄輸出
(
    echo [START] %~nx0
	for /f "delims=" %%a in ('powershell -Command "[DateTimeOffset]::UtcNow.ToUnixTimeMilliseconds()"') do set start_time=%%a
	echo 開始時間: !start_time!
    echo ========== 
    echo.
    echo 申請信用卡
    call SC0101001-Application.bat %BATCH_NAME% %PORT% %SC0101001-Application%
    echo ----------
    echo.
    echo 銀行審核信用卡
    call SC0102001-Review.bat %BATCH_NAME% %PORT% %SC0102001-Review%
    echo ----------
    echo.
    echo 客戶信用卡開卡
    call SC0103001-Activation.bat %BATCH_NAME% %PORT% %SC0103001-Activation%
    echo ----------
    echo.
    echo 客戶信用卡消費
    call SC0104001-Transaction.bat %BATCH_NAME% %PORT% %SC0104001-Transaction%
    echo ----------
    echo.
    echo 消費紀錄區間查詢
    call SC0106001-TransactionQuery.bat %BATCH_NAME% %PORT% %SC0106001-TransactionQuery%
    echo ----------
    echo.
    echo 客戶爭議款項申請
    call SC0106002-DisputeNotation.bat %BATCH_NAME% %PORT% %SC0106002-DisputeNotation%
    echo ----------
    echo.
    echo 客戶繳交信用卡費
    call SC0107001-FeePayment.bat %BATCH_NAME% %PORT% %SC0107001-FeePayment%
    echo ----------
    echo.
	
	:: 記錄請求完成的時間
	for /f "delims=" %%a in ('powershell -Command "[DateTimeOffset]::UtcNow.ToUnixTimeMilliseconds()"') do set end_time=%%a
	echo 完成時間: !end_time!
	
	:: 計算API執行時間（毫秒）
	set /a sum=0
	
	:: 遍歷所有檔名以 SC 開頭的 txt 檔案
	for %%f in (%~dp0temp\SC*.txt) do (
		:: 讀取每個檔案中的數字並加總
		for /f "tokens=*" %%a in (%%f) do (
			set /a sum=!sum! + %%a
		)
	)
	echo ☆ API總執行時間: !sum! 毫秒
	
    echo ========== 
    echo [END] %~nx0
) > "%LOG_PATH%"

echo.
echo ★ 執行結果已儲存至 %LOG_PATH%
