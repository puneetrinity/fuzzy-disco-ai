# AI-Enhanced Engineering Workflow System

## Quick Commands

### MCP Server Commands:
```bash
# Start MCP server for Claude Desktop
node mcp-server-standalone.js

# Test MCP server
node test-mcp.js
```

### Web API Commands:
```bash
# Start local web server
node server.js

# Test web API
curl https://fuzzy-disco-ai-production.up.railway.app/api/tools
```

## VS Code Integration

Use Command Palette (Ctrl+Shift+P) -> "Tasks: Run Task":
- **Start MCP Server** - Launch MCP server for Claude Desktop
- **Test MCP Server** - Test MCP functionality
- **Start Web Server** - Launch local web API
- **Test Web API** - Test Railway deployment

## Available AI Tools

1. **select_practitioner_style** - Auto-select coding approach
2. **generate_code_with_style** - Generate code following practitioner principles
3. **coordinate_team_workflow** - Team coordination and planning
4. **analyze_code_quality** - Multi-perspective code analysis

## Deployment

- **Production URL**: https://fuzzy-disco-ai-production.up.railway.app/
- **Local Development**: http://localhost:8000
- **MCP Server**: Runs on stdio for Claude Desktop integration

## Practitioner Styles

- **Uncle Bob** - Clean Code, SOLID principles
- **Martin Fowler** - Enterprise patterns, refactoring
- **Kent Beck** - Test-first, simple design
- **Jessica Kerr** - Systems thinking, functional programming
- **Kelsey Hightower** - Cloud-native, operational excellence