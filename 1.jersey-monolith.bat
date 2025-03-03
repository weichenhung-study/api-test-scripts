@echo off
chcp 65001 >nul
echo [START] 1.jersey-monolith.bat
echo ==========
echo.



setlocal enabledelayedexpansion

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
call SC0101001-Application.bat
echo ----------
echo.

:: 審核信用卡
call SC0102001-Review.bat
echo ----------
echo.




















:: del cid.txt  :: 刪除暫存檔
echo ==========
echo [END] 1.jersey-monolith.bat

pause

