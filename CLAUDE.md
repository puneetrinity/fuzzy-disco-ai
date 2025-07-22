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

## MCP Agent Integration (Real Framework)

### Setup Commands:
```bash
# Install dependencies
pip install -r requirements.txt

# Copy and configure secrets
cp mcp_agent.secrets.yaml.example mcp_agent.secrets.yaml
# Edit secrets file with your API keys

# Test integration
python test_mcp_agent_integration.py

# Run full demo
python fuzzy_disco_agents.py
```

### Real MCP Agent Features:
- **Authentic Framework** - Uses official MCP Agent from LastMile AI
- **Practitioner Agents** - Uncle Bob, Martin Fowler, Kent Beck, Jessica Kerr, Kelsey Hightower
- **Team Coordination** - Multi-agent code reviews and design consensus
- **Parallel Workflows** - Simultaneous expert analysis and synthesis
- **LLM Integration** - Works with Anthropic Claude and OpenAI models

### Architecture:
```
┌─────────────────────────────────┐
│     Real MCP Agent Framework    │
├─────────────────────────────────┤
│  • PractitionerAgent classes    │
│  • TeamCoordinatorAgent        │ 
│  • ParallelWorkflowEngine       │
│  • Anthropic/OpenAI LLMs        │
└─────────────────────────────────┘
              │
              │ MCP Protocol
              ▼
┌─────────────────────────────────┐
│   Node.js MCP Server (Yours)    │
│  • select_practitioner_style    │
│  • generate_code_with_style     │
│  • coordinate_team_workflow     │
│  • analyze_code_quality         │
└─────────────────────────────────┘
```

### Available Workflows:
- **Single Expert Analysis** - Individual practitioner code generation/review  
- **Team Code Review** - All practitioners analyze code in parallel
- **Design Consensus** - Multi-expert design decision building
- **Feature Planning** - Coordinated development planning