@echo off
chcp 65001 >nul
echo [START] %~nx0
echo ==========
echo.



setlocal enabledelayedexpansion

:: 取得批次檔名稱（不含副檔名）
set "BATCH_NAME=%~n0"

:: docker container port號
set "PORT=8071"

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

:: 將身分證號儲存為檔案
<nul set /p ="!CID!" >cid.txt


:: 申請信用卡
call SC0101001-Application.bat %BATCH_NAME% %PORT%
echo ----------
echo.

:: 銀行審核信用卡
call SC0102001-Review.bat %BATCH_NAME% %PORT%
echo ----------
echo.

:: 客戶信用卡開卡
call SC0103001-Activation.bat %BATCH_NAME% %PORT%
echo ----------
echo.

:: 客戶信用卡消費
call SC0104001-Transaction.bat %BATCH_NAME% %PORT%
echo ----------
echo.

:: 消費紀錄區間查詢
call SC0106001-TransactionQuery.bat %BATCH_NAME% %PORT%
echo ----------
echo.

:: 客戶爭議款項申請
call SC0106002-DisputeNotation.bat %BATCH_NAME% %PORT%
echo ----------
echo.

:: 客戶繳交信用卡費
call SC0107001-FeePayment.bat %BATCH_NAME% %PORT%
echo ----------
echo.





echo ==========
echo [END] %~nx0

pause

