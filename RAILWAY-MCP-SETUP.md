# Railway MCP Setup Guide

## ✅ Complete Setup

Your MCP server is now fully configured and working! Here's what has been set up:

### 🚀 Railway Server Status
- **URL**: https://fuzzy-disco-ai-production.up.railway.app/
- **Health**: ✅ Running
- **Tools**: 4 AI tools available
- **Test Results**: 100% success rate

### 🔧 Files Created
1. **mcp-railway-bridge.js** - Connects Claude Desktop to Railway server
2. **claude-desktop-config-railway.json** - Configuration for Claude Desktop
3. **test-mcp-railway-integration.js** - Integration test suite
4. **mcp-integration-test-report.json** - Test results

### 📱 Available Tools
1. **select_practitioner_style** - Auto-select coding approach
2. **generate_code_with_style** - Generate code with practitioner styles
3. **coordinate_team_workflow** - Team coordination and planning
4. **analyze_code_quality** - Multi-perspective code analysis

## 🛠️ Claude Desktop Setup

### Step 1: Install Dependencies
```bash
cd /home/ews/fuzzy-disco-ai
npm install  # Already done
```

### Step 2: Configure Claude Desktop
Add this to your Claude Desktop configuration:

**Linux/WSL**: `~/.config/claude-desktop/config.json`
**Windows**: `%APPDATA%/Claude/config.json`
**macOS**: `~/Library/Application Support/Claude/config.json`

```json
{
  "mcpServers": {
    "fuzzy-disco-ai-railway": {
      "command": "node",
      "args": ["/home/ews/fuzzy-disco-ai/mcp-railway-bridge.js"],
      "env": {
        "NODE_ENV": "production",
        "RAILWAY_URL": "https://fuzzy-disco-ai-production.up.railway.app"
      }
    }
  }
}
```

### Step 3: Restart Claude Desktop
Close and reopen Claude Desktop to load the new MCP server.

## 🧪 Testing

### Quick Test
```bash
node test-mcp-railway-integration.js
```

### Manual Test
```bash
# Test the bridge directly
node mcp-railway-bridge.js
```

### Railway Server Test
```bash
curl https://fuzzy-disco-ai-production.up.railway.app/health
```

## 🔍 Usage Examples

### 1. Select Practitioner Style
```
Please select the best practitioner style for implementing a user authentication system with a team of 3 developers.
```

### 2. Generate Code
```
Generate a TypeScript class for user authentication using Uncle Bob's clean code principles.
```

### 3. Coordinate Team Workflow
```
Create a workflow plan for feature development with team members Alice, Bob, and Charlie.
```

### 4. Analyze Code Quality
```
Analyze this JavaScript function for security and maintainability issues:
function authenticate(user) { if (user.password === 'password123') return true; return false; }
```

## 📊 Test Results Summary

✅ **All systems operational**
- Railway server: ✅ Healthy
- MCP bridge: ✅ Working
- All 4 tools: ✅ Functional
- Integration: ✅ 100% success rate

## 🔧 Troubleshooting

### Bridge Not Starting
```bash
# Check if Railway server is healthy
curl https://fuzzy-disco-ai-production.up.railway.app/health

# Check node version (requires Node.js 18+)
node --version
```

### Claude Desktop Not Connecting
1. Verify config.json path is correct
2. Check that the absolute path to mcp-railway-bridge.js is correct
3. Restart Claude Desktop
4. Check Claude Desktop logs for errors

### Railway Server Issues
```bash
# Test server endpoints
curl https://fuzzy-disco-ai-production.up.railway.app/
curl https://fuzzy-disco-ai-production.up.railway.app/health
```

## 🎉 Success!

Your MCP setup is complete and fully functional. You can now:
- Use AI-powered code generation in Claude Desktop
- Get practitioner-style recommendations
- Coordinate team workflows
- Analyze code quality

The system bridges Claude Desktop to your Railway-hosted MCP server, providing seamless AI-enhanced development tools.

## 📞 Support

If you encounter any issues:
1. Check the test report: `mcp-integration-test-report.json`
2. Run the integration test: `node test-mcp-railway-integration.js`
3. Verify Railway server health: `curl https://fuzzy-disco-ai-production.up.railway.app/health`

---

**🚀 Your AI-Enhanced Development Workflow is Ready!**