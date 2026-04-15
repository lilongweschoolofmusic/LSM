@echo off
echo ===============================
echo   LSM WEBSITE QUICK UPDATE
echo ===============================

cd /d "%~dp0"

git add .
git commit -m "Website update"
git push

echo.
echo ✅ Update complete!
pause
