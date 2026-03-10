@echo off
echo Starting MindMate AI Backend Server...
echo.
echo Make sure you have installed the dependencies:
echo   pip install -r requirements.txt
echo.
cd /d "%~dp0backend"
python main.py

