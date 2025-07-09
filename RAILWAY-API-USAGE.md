# Railway API Usage Guide

## 🚀 Railway Server Status
- **Production URL**: https://fuzzy-disco-ai-production.up.railway.app
- **Status**: ✅ Active and Running
- **Health Check**: `/health` endpoint available

## 🔧 Available Tools

### 1. Select Practitioner Style
**Purpose**: Auto-select the best coding approach for your task

**Usage**:
```bash
# Test via API
curl -X POST https://fuzzy-disco-ai-production.up.railway.app/message \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "tools/call",
    "params": {
      "name": "select_practitioner_style",
      "arguments": {
        "taskType": "feature",
        "context": "Building user authentication",
        "teamSize": 3
      }
    }
  }'
```

### 2. Generate Code with Style
**Purpose**: Generate code following specific practitioner principles

**Usage**:
```bash
curl -X POST https://fuzzy-disco-ai-production.up.railway.app/message \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 2,
    "method": "tools/call",
    "params": {
      "name": "generate_code_with_style",
      "arguments": {
        "practitioner": "uncle-bob",
        "codeType": "UserService",
        "requirements": "authenticate user with JWT",
        "language": "typescript"
      }
    }
  }'
```

### 3. Coordinate Team Workflow
**Purpose**: AI-powered team coordination and planning

**Usage**:
```bash
curl -X POST https://fuzzy-disco-ai-production.up.railway.app/message \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 3,
    "method": "tools/call",
    "params": {
      "name": "coordinate_team_workflow",
      "arguments": {
        "workflow": "feature-development",
        "teamMembers": ["Alice", "Bob", "Charlie"],
        "priority": "high"
      }
    }
  }'
```

### 4. Analyze Code Quality
**Purpose**: Multi-perspective code analysis

**Usage**:
```bash
curl -X POST https://fuzzy-disco-ai-production.up.railway.app/message \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 4,
    "method": "tools/call",
    "params": {
      "name": "analyze_code_quality",
      "arguments": {
        "code": "function calculateTotal(items) { return items.reduce((sum, item) => sum + item.price, 0); }",
        "language": "javascript",
        "focusAreas": ["clean-code", "maintainability"]
      }
    }
  }'
```

## 💻 Interactive Client Usage

### Run Interactive Client
```bash
node railway-mcp-client.js
```

### Available Commands
- `select-style [taskType] [context]` - Select practitioner style
- `generate-code [practitioner] [codeType] [requirements]` - Generate code
- `coordinate-team [workflow] [teamMembers...]` - Plan team workflow
- `analyze-code [code]` - Analyze code quality
- `help` - Show available commands
- `exit` - Exit the client

## 🧪 Testing Scripts

### Test API Functionality
```bash
node test-railway-api.js
```

### Run Development Demo
```bash
node demo-railway-usage.js
```

## 🔌 Claude Desktop Integration

### MCP Configuration
The Claude Desktop configuration is already set up in `claude-desktop-config.json`:

```json
{
  "mcpServers": {
    "fuzzy-disco-ai-global": {
      "command": "node",
      "args": ["/home/ews/fuzzy-disco-ai/mcp-global-bridge.js"],
      "env": {
        "API_URL": "https://fuzzy-disco-ai-production.up.railway.app"
      }
    }
  }
}
```

### Using in Claude Desktop
1. Copy the configuration to your Claude Desktop settings
2. Restart Claude Desktop
3. The tools will be available in your conversations

## 🎯 Practical Examples

### Feature Development Workflow
```javascript
const assistant = new RailwayDevAssistant();

// Step 1: Select approach
const style = await assistant.selectPractitionerStyle('feature', 'user auth');

// Step 2: Generate code
const code = await assistant.generateCode('uncle-bob', 'AuthService', 'JWT authentication');

// Step 3: Plan workflow
const workflow = await assistant.coordinateTeam('feature-development', ['Dev1', 'Dev2']);

// Step 4: Analyze quality
const analysis = await assistant.analyzeCode(code);
```

### Bug Fix Process
```javascript
const bugFix = await assistant.fixBug('Null pointer exception in user lookup', buggyCode);
```

### Code Review
```javascript
const review = await assistant.codeReview(codeToReview);
```

## 🌟 Key Features

✅ **Global Access**: Works from anywhere with internet  
✅ **Real-time**: Railway server is always available  
✅ **Multi-practitioner**: Uncle Bob, Martin Fowler, Kent Beck, Jessica Kerr, Kelsey Hightower  
✅ **Full Workflow**: From planning to deployment  
✅ **Quality Analysis**: Multi-perspective code analysis  
✅ **Team Coordination**: AI-powered workflow planning  

## 🚀 Ready to Use!

The Railway API is now fully functional and ready for your development workflow. Use any of the provided scripts or integrate directly with Claude Desktop for the best experience.