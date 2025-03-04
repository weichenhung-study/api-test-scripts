@echo off
chcp 65001 >nul
echo ● [START] SC0103001-Activation.bat

if exist cid.txt (	:: 讀取 CID（如果檔案存在）
    set /p CID=<cid.txt
)
echo 取得的 CID: %CID%

:: 發送請求
curl -X PUT "http://127.0.0.1:8071/jersey-monolith/res/SC0103001" ^
     -H "Content-Type: application/json" ^
     -d "{""cid"":""%CID%"",""cardType"":""2""}"





echo.
echo ● [END] SC0103001-Activation.bat
