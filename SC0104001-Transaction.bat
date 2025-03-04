@echo off
chcp 65001 >nul
echo ● [START] %~nx0

if exist cid.txt (	:: 讀取 CID（如果檔案存在）
    set /p CID=<cid.txt
)
echo 取得的 CID: %CID%
echo 呼叫自: %1, 連接埠: %2

:: 發送請求
curl -X POST "http://127.0.0.1:%2/%1/res/SC0104001" ^
     -H "Content-Type: application/json" ^
	 -d "{""buyChannel"":""00"",""buyDate"":""2025/03/04 10:10:00.000"",""reqPaymentDate"":""2025/03/04 10:10:00.100"",""cardType"":""2"",""shopId"":""好享食商行"",""cid"":""%CID%"",""buyCurrency"":""NTD"",""buyAmount"":""1000"",""disputedFlag"":""00"",""status"":""00"",""remark"":""信用卡付款"",""issuingBank"":""00"",""cardNum"":""6387968437129792"",""securityCode"":""307""}"





echo.
echo ● [END] %~nx0
