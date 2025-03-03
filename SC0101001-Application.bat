@echo off
chcp 65001 >nul
echo ● [START] SC0101001-Application.bat

if exist cid.txt (	:: 讀取 CID（如果檔案存在）
    set /p CID=<cid.txt
)
echo 取得的 CID: %CID%

:: 發送請求
curl -X POST "http://127.0.0.1:8071/jersey-monolith/res/SC0101001" ^
     -H "Content-Type: application/json" ^
     -d "{""chName"":""皮卡邱"",""enName"":""pika chu"",""cid"":""%CID%"",""cidReissueDate"":""2000/01/01"",""cidReissueLocation"":""北市"",""cidReissueStatus"":""狀態正常"",""birthDate"":""1990/05/05"",""maritalStatus"":""01"",""education"":""05"",""currentResidentialAdd"":""台北市內湖區"",""residentialAdd"":""台北市中山區"",""cellphone"":""0933123456"",""email"":""tuluber@gmail.com"",""companyName"":""POKEMON股份有限公司"",""companyIndustry"":""03"",""occupation"":""襄理"",""department"":""資訊部"",""jobTitle"":""職員"",""dateOfEmployment"":""2015/09/08"",""companyAddress"":""台北市內湖區"",""companyPhoneNum"":""021234567"",""annualIncome"":""100"",""eventCode"":""friday"",""cardType"":""2"",""remark"":""加急辦理""}"





echo.
echo ● [END] SC0101001-Application.bat
