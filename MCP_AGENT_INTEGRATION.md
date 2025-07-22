# MCP Agent Integration Guide

This guide explains how to integrate the MCP Agent framework with your Fuzzy Disco AI system for advanced multi-agent workflows.

## 🚀 Quick Start

1. **Install Dependencies**
   ```bash
   python setup_mcp_agent.py
   ```

2. **Run Quick Demo**
   ```bash
   python demo_integration.py
   ```

3. **Try Advanced Examples**
   ```bash
   python examples/code_review_agent.py examples/code_review_agent.py
   python examples/team_simulation.py
   ```

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────┐
│                Python MCP Agents                    │
├─────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────────────────┐│
│  │ Practitioner    │  │   Advanced Workflow        ││
│  │   Agents        │  │      Engine                ││
│  │                 │  │                            ││
│  │ • Uncle Bob     │  │ • Parallel Review          ││
│  │ • Martin Fowler │  │ • Sequential Improvement   ││
│  │ • Kent Beck     │  │ • Consensus Building       ││
│  │ • Jessica Kerr  │  │ • Collaborative Design     ││
│  │ • Kelsey H.     │  │                            ││
│  └─────────────────┘  └─────────────────────────────┘│
└─────────────────────────────────────────────────────┘
                        │
                        │ MCP Protocol (stdio/subprocess)
                        │
┌─────────────────────────────────────────────────────┐
│              Node.js MCP Server                     │
├─────────────────────────────────────────────────────┤
│  • select_practitioner_style                       │
│  • generate_code_with_style                         │
│  • coordinate_team_workflow                         │
│  • analyze_code_quality                             │
└─────────────────────────────────────────────────────┘
```

## 🔧 Key Components

### 1. FuzzyDiscoMCPClient
- Manages communication with Node.js MCP server
- Handles JSON-RPC protocol over stdio
- Provides async tool calling interface

### 2. PractitionerAgent
- Represents individual software engineering practitioners
- Encapsulates practitioner-specific logic and preferences
- Can analyze code and generate solutions from specific perspectives

### 3. TeamCoordinatorAgent
- Orchestrates multiple practitioner agents
- Enables parallel execution of reviews and analyses
- Builds consensus from multiple perspectives

### 4. AdvancedWorkflowEngine
- Implements complex multi-agent workflow patterns
- Supports various team simulation scenarios
- Provides structured results and consensus building

## 🎯 Use Cases

### Code Review Automation
```python
coordinator = TeamCoordinatorAgent(practitioner_agents, mcp_client)
review = await coordinator.coordinate_code_review(code, "javascript")
print(f"Score: {review['consensus']['average_score']}")
```

### Multi-Perspective Design
```python
engine = AdvancedWorkflowEngine(mcp_client)
result = await engine.run_consensus_building_workflow(
    "How should we architect a microservices system?"
)
```

### Sequential Code Improvement
```python
improved = await engine.run_sequential_improvement_workflow(
    code, target_score=80
)
print(f"Improved by {improved.results['improvement']} points")
```

### Team Simulation
```python
simulator = TeamSimulator()
await simulator.simulate_sprint_planning(user_stories)
await simulator.simulate_code_review_meeting(code_samples)
```

## 🔄 Workflow Patterns

### 1. Parallel Review
- All practitioners analyze code simultaneously
- Results aggregated into consensus
- Identifies common issues and recommendations

### 2. Sequential Improvement
- Iterative improvement cycles
- Each cycle addresses worst issues first
- Continues until target quality score reached

### 3. Consensus Building
- Practitioners provide different perspectives
- Common principles identified
- Unified recommendation generated

### 4. Collaborative Design
- Role-specific contributions
- Phase-based design process
- Comprehensive system design

## 📁 File Structure

```
fuzzy-disco-ai/
├── mcp_agent_integration.py    # Core integration classes
├── workflows.py                # Advanced workflow patterns
├── setup_mcp_agent.py         # Setup and installation script
├── demo_integration.py        # Quick demo script
├── requirements.txt           # Python dependencies
└── examples/
    ├── code_review_agent.py   # Code review examples
    └── team_simulation.py     # Team scenario simulations
```

## 🛠️ Development

### Adding New Workflow Patterns

1. **Extend AdvancedWorkflowEngine**
   ```python
   async def run_custom_workflow(self, params) -> WorkflowResult:
       # Your workflow logic
       return WorkflowResult(...)
   ```

2. **Add New Agent Types**
   ```python
   class SpecialistAgent(Agent):
       def __init__(self, specialty, mcp_client):
           super().__init__(name=f"{specialty}_specialist")
           # Custom logic
   ```

### Customizing Practitioner Behaviors
- Modify `PRACTITIONERS` list in `mcp_agent_integration.py`
- Add new focus areas and principles
- Customize analysis logic per practitioner

## 🔍 Debugging

### Common Issues

1. **Node.js server not starting**
   - Check Node.js installation: `node --version`
   - Verify server path in FuzzyDiscoMCPClient

2. **Import errors**
   - Install requirements: `pip install -r requirements.txt`
   - Check Python path in example scripts

3. **MCP communication errors**
   - Verify JSON-RPC message format
   - Check server logs in subprocess stderr

### Debug Mode
Set environment variable for verbose logging:
```bash
export MCP_DEBUG=1
python examples/code_review_agent.py
```

## 🚀 Production Deployment

### Docker Integration
Add to existing Dockerfile:
```dockerfile
# Python dependencies for MCP agents
COPY requirements.txt .
RUN pip install -r requirements.txt

# Copy MCP agent files
COPY mcp_agent_integration.py .
COPY workflows.py .
COPY examples/ ./examples/
```

### Railway/Heroku Deployment
- Include Python requirements in buildpack
- Ensure Node.js and Python both available
- Set appropriate environment variables

## 🤝 Contributing

1. Fork the repository
2. Create feature branch for your workflow pattern
3. Add comprehensive tests and examples
4. Submit pull request with clear description

## 📚 Further Reading

- [MCP Agent Documentation](https://github.com/lastmile-ai/mcp-agent)
- [Model Context Protocol](https://modelcontextprotocol.io/)
- [Fuzzy Disco AI Original Documentation](./README.md)