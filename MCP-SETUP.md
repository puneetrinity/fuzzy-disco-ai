# MCP Server Setup for Claude Desktop

## 🚀 Quick Setup

You now have **BOTH** options available:

1. **Web API**: https://fuzzy-disco-ai-production.up.railway.app/ (already working)
2. **MCP Server**: For direct Claude Desktop integration (setup below)

## 📋 MCP Server Installation

### Step 1: Install Dependencies
```bash
# Clone the repo (if you haven't already)
git clone https://github.com/puneetrinity/fuzzy-disco-ai.git
cd fuzzy-disco-ai

# Install minimal dependencies
npm install
```

### Step 2: Configure Claude Desktop

Create or edit your Claude Desktop configuration file:

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
**Linux**: `~/.config/Claude/claude_desktop_config.json`

Add this configuration:

```json
{
  "mcpServers": {
    "fuzzy-disco-ai": {
      "command": "node",
      "args": ["/FULL/PATH/TO/fuzzy-disco-ai/mcp-server-standalone.js"],
      "env": {}
    }
  }
}
```

**Replace `/FULL/PATH/TO/` with your actual path!**

### Step 3: Restart Claude Desktop

Close and reopen Claude Desktop completely.

### Step 4: Verify Installation

In Claude Desktop, you should see these tools available:

- 🎯 **select_practitioner_style** - Auto-select coding approach
- 🛠️ **generate_code_with_style** - Generate code in practitioner styles  
- 👥 **coordinate_team_workflow** - Team coordination
- 🔍 **analyze_code_quality** - Multi-perspective code analysis

## 🧪 Test MCP Tools

Try these in Claude Desktop:

### Test Style Selection:
```
Use the select_practitioner_style tool with:
- taskType: "feature"
- context: "user authentication system"
- teamSize: 3
```

### Test Code Generation:
```
Use the generate_code_with_style tool with:
- practitioner: "uncle-bob"
- codeType: "UserService" 
- requirements: "authenticate users with JWT tokens"
- language: "typescript"
```

### Test Team Coordination:
```
Use the coordinate_team_workflow tool with:
- workflow: "feature-development"
- teamMembers: ["Alice", "Bob", "Charlie"]
- priority: "high"
```

### Test Code Analysis:
```
Use the analyze_code_quality tool with:
- code: "function authenticate(user) { return user.password === 'admin'; }"
- language: "javascript"
- focusAreas: ["security", "clean-code"]
```

## 🔧 Troubleshooting

### MCP Server Not Showing Up:
1. Check file path in config is correct and absolute
2. Ensure Node.js is installed and in PATH
3. Restart Claude Desktop completely
4. Check Claude Desktop logs for errors

### Tools Not Working:
1. Verify the standalone server file exists
2. Test manually: `node mcp-server-standalone.js`
3. Check JSON syntax in claude_desktop_config.json

### Permission Issues:
```bash
chmod +x mcp-server-standalone.js
```

## 📊 Both Options Available

### Web API (Current):
- **URL**: https://fuzzy-disco-ai-production.up.railway.app/
- **Use with**: curl, Postman, any HTTP client
- **Endpoints**: /api/select-style, /api/generate-code, etc.

### MCP Server (New):
- **Use with**: Claude Desktop directly
- **Tools**: Available as tools in Claude conversations
- **Setup**: Local installation required

**Choose the option that works best for your workflow!**

## 🎯 What You Get

With MCP integration, you can:

- Ask Claude to **select the best coding approach** for your task
- Have Claude **generate code** following specific practitioner principles
- Get **team coordination** recommendations
- Analyze **code quality** from multiple expert perspectives

All directly within your Claude conversations! 🚀