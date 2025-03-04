@echo off
chcp 65001 >nul
echo ● [START] SC0106001-TransactionQuery.bat

if exist cid.txt (	:: 讀取 CID（如果檔案存在）
    set /p CID=<cid.txt
)
echo 取得的 CID: %CID%
echo 呼叫自: %1, 連接埠: %2

:: 發送請求
curl -X GET "http://127.0.0.1:%2/%1/res/SC0106001?cid=%CID%&cardType=2&startDate=2024/01/01&endDate=2025/12/31"



echo.
echo ● [END] SC0106001-TransactionQuery.bat
