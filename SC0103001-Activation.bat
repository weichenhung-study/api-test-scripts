@echo off
chcp 65001 >nul
echo ● [START] %~nx0

if exist cid.txt (	:: 讀取 CID（如果檔案存在）
    set /p CID=<cid.txt
)
echo 取得的 CID: %CID%
echo 呼叫自: %1, 連接埠: %2, 路徑: %3

:: 發送請求
curl -X PUT "http://127.0.0.1:%2/%1/%3" ^
     -H "Content-Type: application/json" ^
     -d "{""cid"":""%CID%"",""cardType"":""2""}"





echo.
echo ● [END] %~nx0
