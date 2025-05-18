@echo off
setlocal EnableDelayedExpansion

set "CLASSROOT=D:\Project\ckjm\target\WEB-INF\classes"
set "TMP=classlist.txt"
del "%TMP%" 2>nul

for /R "%CLASSROOT%" %%f in (*.class) do (
    echo %%f>>"%TMP%"
)

echo All absolute class paths written to %TMP%
