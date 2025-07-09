@echo off
REM MCP Bridge for Windows Claude Desktop
REM This batch file starts the MCP bridge through WSL

echo Starting MCP Railway Bridge for Windows...
echo Connecting to: https://fuzzy-disco-ai-production.up.railway.app
echo Using WSL distribution: Ubuntu

wsl -d Ubuntu -e node /home/ews/fuzzy-disco-ai/mcp-railway-bridge.js