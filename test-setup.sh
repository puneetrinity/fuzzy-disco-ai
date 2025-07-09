#!/bin/bash

# Complete MCP Setup Test
# Verifies everything is working correctly

cd /home/ews/fuzzy-disco-ai

echo "🧪 Testing Complete MCP Setup..."
echo "================================="
echo ""

# Test 1: Check Railway server
echo "1️⃣ Testing Railway server..."
if curl -s https://fuzzy-disco-ai-production.up.railway.app/health | grep -q "healthy"; then
    echo "✅ Railway server: HEALTHY"
else
    echo "❌ Railway server: FAILED"
    exit 1
fi

# Test 2: Check Claude Desktop config
echo ""
echo "2️⃣ Testing Claude Desktop config..."
if [ -f ~/.config/claude-desktop/config.json ]; then
    echo "✅ Claude Desktop config: EXISTS"
    if grep -q "fuzzy-disco-ai-railway" ~/.config/claude-desktop/config.json; then
        echo "✅ MCP server configured: YES"
    else
        echo "❌ MCP server configured: NO"
        exit 1
    fi
else
    echo "❌ Claude Desktop config: MISSING"
    exit 1
fi

# Test 3: Check bridge file
echo ""
echo "3️⃣ Testing MCP bridge..."
if [ -f mcp-railway-bridge.js ]; then
    echo "✅ Bridge file: EXISTS"
    if [ -x mcp-railway-bridge.js ]; then
        echo "✅ Bridge executable: YES"
    else
        echo "❌ Bridge executable: NO"
        exit 1
    fi
else
    echo "❌ Bridge file: MISSING"
    exit 1
fi

# Test 4: Check dependencies
echo ""
echo "4️⃣ Testing dependencies..."
if node -e "import('node-fetch')" 2>/dev/null; then
    echo "✅ node-fetch: INSTALLED"
else
    echo "❌ node-fetch: MISSING"
    exit 1
fi

# Test 5: Run integration test
echo ""
echo "5️⃣ Running integration test..."
if timeout 30s node test-mcp-railway-integration.js | grep -q "All tests passed"; then
    echo "✅ Integration test: PASSED"
else
    echo "❌ Integration test: FAILED"
    exit 1
fi

echo ""
echo "🎉 ALL TESTS PASSED!"
echo "================================="
echo ""
echo "✅ Setup Complete! Your MCP integration is ready."
echo ""
echo "📋 Next Steps:"
echo "1. Close and restart Claude Desktop"
echo "2. Look for 'fuzzy-disco-ai-railway' in the MCP section"
echo "3. Try asking Claude to select a practitioner style"
echo ""
echo "🚀 Example prompts to try:"
echo "- 'Select the best practitioner style for a REST API'"
echo "- 'Generate a TypeScript class using Uncle Bob principles'"
echo "- 'Analyze this code for quality issues'"
echo "- 'Plan a team workflow for bug fixing'"