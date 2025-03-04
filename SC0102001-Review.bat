@echo off
chcp 65001 >nul
echo ● [START] %~nx0

:: 記錄發送請求的時間
for /f "delims=" %%a in ('powershell -Command "Get-Date -Format 'yyyy-MM-dd HH:mm:ss.fff'"') do set start_time=%%a
echo 發送請求時間: %start_time%


if exist cid.txt (	:: 讀取 CID（如果檔案存在）
    set /p CID=<cid.txt
)
echo 取得的 CID: %CID%
echo 呼叫自: %1, 連接埠: %2, 路徑: %3

:: 發送請求
curl -X PUT "http://127.0.0.1:%2/%1/%3" ^
     -H "Content-Type: application/json" ^
     -d "{""cid"":""%CID%"",""cardType"":""2"",""cardApprovalStatus"":""01"",""applyRemark"":""通過""}"





echo.
:: 記錄請求完成的時間
for /f "delims=" %%a in ('powershell -Command "Get-Date -Format 'yyyy-MM-dd HH:mm:ss.fff'"') do set end_time=%%a
echo 完成請求時間: %end_time%

:: 計算執行時間（毫秒）
for /f "delims=" %%a in ('powershell -Command "(Get-Date).Subtract([datetime]'%start_time%').TotalMilliseconds"') do set duration=%%a
echo ○ 總執行時間: %duration% 毫秒

echo ● [END] %~nx0
