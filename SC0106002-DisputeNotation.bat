@echo off
chcp 65001 >nul
echo ● [START] %~nx0

if exist cid.txt (	:: 讀取 CID（如果檔案存在）
    set /p CID=<cid.txt
)
echo 取得的 CID: %CID%
echo 呼叫自: %1, 連接埠: %2

:: 發送請求
curl -X PUT "http://127.0.0.1:%2/%1/res/SC0106002" ^
     -H "Content-Type: application/json" ^
     -d "{""uuid"":""4b88085a-b58f-4115-9dee-57b88603b108""}"





echo.
echo ● [END] %~nx0
