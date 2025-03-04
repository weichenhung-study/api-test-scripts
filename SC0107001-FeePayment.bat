@echo off
chcp 65001 >nul
echo ● [START] SC0107001-FeePayment.bat

if exist cid.txt (	:: 讀取 CID（如果檔案存在）
    set /p CID=<cid.txt
)
echo 取得的 CID: %CID%
echo 呼叫自: %1, 連接埠: %2

:: 發送請求
curl -X POST "http://127.0.0.1:%2/%1/res/SC0107001" ^
     -H "Content-Type: application/json" ^
	 -d "{""cid"":""%CID%"",""cardType"":""2"",""payDate"":""2024/10"",""payAmt"":""8800""}"





echo.
echo ● [END] SC0107001-FeePayment.bat
