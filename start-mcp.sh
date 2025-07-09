#!/bin/bash

# Start MCP Railway Bridge
# This script starts the MCP bridge that connects Claude Desktop to Railway

cd /home/ews/fuzzy-disco-ai

echo "🚀 Starting MCP Railway Bridge..."
echo "📡 Connecting to: https://fuzzy-disco-ai-production.up.railway.app"
echo "⚙️  Config: ~/.config/claude-desktop/config.json"
echo ""

# Check if Railway server is healthy
echo "🔍 Checking Railway server health..."
if curl -s https://fuzzy-disco-ai-production.up.railway.app/health > /dev/null; then
    echo "✅ Railway server is healthy"
else
    echo "❌ Railway server is not responding"
    exit 1
fi

# Check if node-fetch is installed
if ! node -e "import('node-fetch')" 2>/dev/null; then
    echo "📦 Installing node-fetch..."
    npm install node-fetch@3.3.2
fi

# Start the bridge
echo "🌉 Starting MCP bridge..."
node mcp-railway-bridge.js