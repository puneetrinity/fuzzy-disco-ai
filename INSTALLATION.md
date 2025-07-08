# 🚀 Installation Guide - Global MCP Server for Claude Desktop

## Overview

This guide shows how to install the AI-Enhanced Engineering Workflow tools globally for Claude Desktop. After installation, you'll have access to 4 AI tools in every Claude Desktop conversation, anywhere in the world.

## 🎯 What You'll Get

- **select_practitioner_style** - Auto-select coding approach based on task type
- **generate_code_with_style** - Generate code following expert principles  
- **coordinate_team_workflow** - Team coordination and planning
- **analyze_code_quality** - Multi-perspective code analysis

## 📋 Prerequisites

- Claude Desktop installed on your system
- Node.js and npm installed
- Command line access (Terminal/Command Prompt/WSL)

## 🔧 Installation Steps

### Step 1: Install MCP Remote Bridge

The MCP remote bridge allows Claude Desktop to connect to remote MCP servers.

**Option A: Global Installation (Recommended)**
```bash
npm install -g mcp-remote
```

**Option B: Local Installation (if global fails)**
```bash
# Navigate to any directory or create a new one
mkdir ~/mcp-tools && cd ~/mcp-tools
npm install mcp-remote
```

### Step 2: Configure Claude Desktop

Find your Claude Desktop configuration file location:

- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Linux**: `~/.config/Claude/claude_desktop_config.json`

Create or edit the file with this configuration:

**For Global Installation:**
```json
{
  "mcpServers": {
    "fuzzy-disco-ai-global": {
      "command": "npx",
      "args": ["mcp-remote", "https://fuzzy-disco-ai-production.up.railway.app/message"],
      "env": {}
    }
  }
}
```

**For Local Installation:**
```json
{
  "mcpServers": {
    "fuzzy-disco-ai-global": {
      "command": "npx",
      "args": ["--prefix", "/path/to/your/mcp-tools", "mcp-remote", "https://fuzzy-disco-ai-production.up.railway.app/message"],
      "env": {}
    }
  }
}
```

### Step 3: WSL Users (Special Instructions)

If you're using WSL (Windows Subsystem for Linux):

1. **Install mcp-remote in WSL:**
   ```bash
   cd /home/yourusername/fuzzy-disco-ai
   npm install mcp-remote
   ```

2. **Copy config to Windows Claude Desktop:**
   ```bash
   # Replace 'YourWindowsUsername' with your actual Windows username
   mkdir -p "/mnt/c/Users/YourWindowsUsername/AppData/Roaming/Claude/"
   
   # Create the config file
   cat > "/mnt/c/Users/YourWindowsUsername/AppData/Roaming/Claude/claude_desktop_config.json" << 'EOF'
   {
     "mcpServers": {
       "fuzzy-disco-ai-global": {
         "command": "npx",
         "args": ["--prefix", "/home/yourusername/fuzzy-disco-ai", "mcp-remote", "https://fuzzy-disco-ai-production.up.railway.app/message"],
         "env": {}
       }
     }
   }
   EOF
   ```

3. **Find your Windows username:**
   ```bash
   ls /mnt/c/Users/
   ```

### Step 4: Restart Claude Desktop

1. **Completely close Claude Desktop**
   - Windows: Right-click system tray icon → Exit
   - macOS: Cmd+Q or Claude Desktop → Quit
   - Linux: Close all windows and quit application

2. **Reopen Claude Desktop**
   - Wait for it to fully load
   - The MCP server will connect automatically

### Step 5: Test Installation

In any Claude Desktop conversation, try:

**"Use the select_practitioner_style tool with taskType 'feature', context 'user authentication system', and teamSize 3"**

**Expected Result:**
Claude should use the tool and return a recommendation for "Martin Fowler" approach with detailed reasoning.

## 🔍 Verification

You can verify the installation by:

1. **Check tools are available:**
   Ask Claude: "What tools do you have available?"
   
2. **Test each tool:**
   - `select_practitioner_style` - Choose coding approach
   - `generate_code_with_style` - Generate code samples
   - `coordinate_team_workflow` - Get team coordination advice
   - `analyze_code_quality` - Analyze code from multiple perspectives

## 🐛 Troubleshooting

### Tools Not Showing Up

1. **Check config file location:**
   ```bash
   # Windows (from WSL)
   cat "/mnt/c/Users/YourUsername/AppData/Roaming/Claude/claude_desktop_config.json"
   
   # macOS
   cat "~/Library/Application Support/Claude/claude_desktop_config.json"
   
   # Linux
   cat ~/.config/Claude/claude_desktop_config.json
   ```

2. **Verify mcp-remote is installed:**
   ```bash
   npx mcp-remote --help
   ```

3. **Check Claude Desktop logs:**
   - Windows: `%APPDATA%\Claude\logs\`
   - macOS: `~/Library/Logs/Claude/`
   - Linux: `~/.config/Claude/logs/`

### Permission Issues

**For npm install issues:**
```bash
# Option 1: Use sudo (Linux/macOS)
sudo npm install -g mcp-remote

# Option 2: Configure npm prefix
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
npm install -g mcp-remote
```

### Server Connection Issues

1. **Test server directly:**
   ```bash
   curl -X POST https://fuzzy-disco-ai-production.up.railway.app/message \
     -H "Content-Type: application/json" \
     -d '{"jsonrpc": "2.0", "id": 1, "method": "tools/list", "params": {}}'
   ```

2. **Check network connectivity:**
   ```bash
   ping fuzzy-disco-ai-production.up.railway.app
   ```

## 🔄 Updating

To update to the latest version:

1. **Update mcp-remote:**
   ```bash
   npm update -g mcp-remote
   # or for local installation
   npm update mcp-remote
   ```

2. **Restart Claude Desktop** to reload the connection

## 🌍 Global Access

Once installed, these AI tools will be available:
- ✅ On any device with Claude Desktop
- ✅ No local server management required
- ✅ Always up-to-date with latest improvements
- ✅ High availability via Railway cloud infrastructure

## 📚 Using the Tools

### select_practitioner_style
```
Use the select_practitioner_style tool with:
- taskType: "feature" | "bug-fix" | "refactor" | "data-processing" | "infrastructure"
- context: "description of your task"
- teamSize: number of team members
```

### generate_code_with_style
```
Use the generate_code_with_style tool with:
- practitioner: "uncle-bob" | "martin-fowler" | "kent-beck" | "jessica-kerr" | "kelsey-hightower"
- codeType: "class" | "function" | "service" | etc.
- requirements: "what the code should do"
- language: "typescript" | "javascript" | "python" | etc.
```

### coordinate_team_workflow
```
Use the coordinate_team_workflow tool with:
- workflow: "feature-development" | "bug-fix" | "refactor" | "sprint-planning"
- teamMembers: ["Alice", "Bob", "Charlie"]
- priority: "low" | "medium" | "high" | "critical"
```

### analyze_code_quality
```
Use the analyze_code_quality tool with:
- code: "your code here"
- language: "javascript" | "typescript" | "python" | etc.
- focusAreas: ["clean-code", "maintainability", "performance", "security"]
```

## 🆘 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Verify your configuration matches the examples
3. Test the server connection directly
4. Restart Claude Desktop completely
5. Check Claude Desktop logs for error messages

## 🎉 Success!

You now have AI-powered engineering workflow tools available globally in Claude Desktop. These tools will help you:
- Choose the right coding approach for any task
- Generate code following industry best practices
- Coordinate team workflows effectively
- Analyze code quality from multiple expert perspectives

Happy coding with AI assistance! 🚀