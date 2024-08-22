@echo off

REM Open the current folder in Visual Studio Code
code .\

REM Wait for Visual Studio Code to open
ping 127.0.0.1 -n 1 -w 1000 > nul

REM Minimize the terminal window
powershell -Command "(New-Object -ComObject Shell.Application).Namespace('shell:AppsFolder\Microsoft.WindowsTerminal_8wekyb3d8bbwe!App').Application.MainWindowHandle | ForEach-Object { &('Win32Interop.User32.dll', 'SetForegroundWindow', $_) }"
powershell -Command "&('Win32Interop.User32.dll', 'ShowWindowAsync', (Get-Process -Name 'cmd' | Where-Object {$_.MainWindowTitle -like '*Visual Studio Code*' }).MainWindowHandle, 6)"
