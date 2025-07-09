# MCP Bridge for Windows Claude Desktop via PowerShell
# This script starts the MCP bridge through WSL

Write-Host "🚀 Starting MCP Railway Bridge for Windows..." -ForegroundColor Green
Write-Host "📡 Connecting to: https://fuzzy-disco-ai-production.up.railway.app" -ForegroundColor Cyan
Write-Host "🐧 Using WSL distribution: Ubuntu" -ForegroundColor Yellow

# Check if WSL is available
if (Get-Command wsl -ErrorAction SilentlyContinue) {
    Write-Host "✅ WSL found, starting bridge..." -ForegroundColor Green
    wsl -d Ubuntu -e node /home/ews/fuzzy-disco-ai/mcp-railway-bridge.js
} else {
    Write-Host "❌ WSL not found. Please install WSL first." -ForegroundColor Red
    exit 1
}