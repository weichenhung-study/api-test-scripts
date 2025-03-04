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
curl -X POST "http://127.0.0.1:%2/%1/%3" ^
     -H "Content-Type: application/json" ^
     -d "{""chName"":""皮卡邱"",""enName"":""pika chu"",""cid"":""%CID%"",""cidReissueDate"":""2000/01/01"",""cidReissueLocation"":""北市"",""cidReissueStatus"":""狀態正常"",""birthDate"":""1990/05/05"",""maritalStatus"":""01"",""education"":""05"",""currentResidentialAdd"":""台北市內湖區"",""residentialAdd"":""台北市中山區"",""cellphone"":""0933123456"",""email"":""tuluber@gmail.com"",""companyName"":""POKEMON股份有限公司"",""companyIndustry"":""03"",""occupation"":""襄理"",""department"":""資訊部"",""jobTitle"":""職員"",""dateOfEmployment"":""2015/09/08"",""companyAddress"":""台北市內湖區"",""companyPhoneNum"":""021234567"",""annualIncome"":""100"",""eventCode"":""friday"",""cardType"":""2"",""remark"":""加急辦理""}"





echo.
:: 記錄請求完成的時間
for /f "delims=" %%a in ('powershell -Command "Get-Date -Format 'yyyy-MM-dd HH:mm:ss.fff'"') do set end_time=%%a
echo 完成請求時間: %end_time%

:: 計算執行時間（毫秒）
for /f "delims=" %%a in ('powershell -Command "(Get-Date).Subtract([datetime]'%start_time%').TotalMilliseconds"') do set duration=%%a
echo ○ 總執行時間: %duration% 毫秒

echo ● [END] %~nx0
