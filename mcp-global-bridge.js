#!/usr/bin/env node

// Global MCP Bridge - Routes MCP requests to the API server
import fetch from 'node-fetch';

class GlobalMCPBridge {
  constructor() {
    this.apiUrl = process.env.API_URL || 'http://localhost:8000';
    this.tools = [
      {
        name: "select_practitioner_style",
        description: "Auto-select the best practitioner style based on task context",
        inputSchema: {
          type: "object",
          properties: {
            taskType: {
              type: "string",
              description: "Type of task",
              enum: ["feature", "bug-fix", "refactor", "data-processing", "infrastructure"]
            },
            context: {
              type: "string",
              description: "Additional context about the task"
            },
            teamSize: {
              type: "number",
              description: "Number of team members"
            }
          },
          required: ["taskType"]
        }
      },
      {
        name: "generate_code_with_style",
        description: "Generate code following a specific practitioner's style",
        inputSchema: {
          type: "object",
          properties: {
            practitioner: {
              type: "string",
              description: "Practitioner to emulate",
              enum: ["uncle-bob", "martin-fowler", "kent-beck", "jessica-kerr", "kelsey-hightower"]
            },
            codeType: {
              type: "string",
              description: "Type of code to generate (class, function, etc.)"
            },
            requirements: {
              type: "string",
              description: "Specific requirements for the code"
            },
            language: {
              type: "string",
              description: "Programming language",
              default: "typescript"
            }
          },
          required: ["practitioner", "codeType", "requirements"]
        }
      },
      {
        name: "coordinate_team_workflow",
        description: "Coordinate team workflows and task distribution",
        inputSchema: {
          type: "object",
          properties: {
            workflow: {
              type: "string",
              description: "Type of workflow",
              enum: ["feature-development", "bug-fix", "refactor", "sprint-planning"]
            },
            teamMembers: {
              type: "array",
              items: { type: "string" },
              description: "List of team member names"
            },
            priority: {
              type: "string",
              enum: ["low", "medium", "high", "critical"],
              default: "medium"
            }
          },
          required: ["workflow"]
        }
      },
      {
        name: "analyze_code_quality",
        description: "Analyze code quality using multiple practitioner perspectives",
        inputSchema: {
          type: "object",
          properties: {
            code: {
              type: "string",
              description: "Code to analyze"
            },
            language: {
              type: "string",
              description: "Programming language",
              default: "javascript"
            },
            focusAreas: {
              type: "array",
              items: { type: "string" },
              description: "Areas to focus analysis on",
              default: ["clean-code", "maintainability", "performance"]
            }
          },
          required: ["code"]
        }
      }
    ];
  }

  async handleMessage(message) {
    const { id, method, params } = message;

    switch (method) {
      case "initialize":
        return this.handleInitialize(id, params);
      case "tools/list":
        return this.handleListTools(id);
      case "tools/call":
        return await this.handleCallTool(id, params);
      default:
        return this.errorResponse(id, -32601, "Method not found");
    }
  }

  handleInitialize(id, params) {
    return {
      jsonrpc: "2.0",
      id,
      result: {
        protocolVersion: "2024-11-05",
        capabilities: {
          tools: {}
        },
        serverInfo: {
          name: "fuzzy-disco-ai-global",
          version: "1.0.0"
        }
      }
    };
  }

  handleListTools(id) {
    return {
      jsonrpc: "2.0",
      id,
      result: {
        tools: this.tools
      }
    };
  }

  async handleCallTool(id, params) {
    const { name, arguments: args } = params;

    try {
      let result;

      switch (name) {
        case "select_practitioner_style":
          result = await this.callAPI('/api/select-style', args);
          break;
        case "generate_code_with_style":
          result = await this.callAPI('/api/generate-code', args);
          break;
        case "coordinate_team_workflow":
          result = await this.callAPI('/api/coordinate-team', args);
          break;
        case "analyze_code_quality":
          result = await this.callAPI('/api/analyze-code', args);
          break;
        default:
          throw new Error(`Unknown tool: ${name}`);
      }

      return {
        jsonrpc: "2.0",
        id,
        result: {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2)
            }
          ]
        }
      };
    } catch (error) {
      return this.errorResponse(id, -32000, `Tool execution failed: ${error.message}`);
    }
  }

  async callAPI(endpoint, data) {
    const response = await fetch(`${this.apiUrl}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error(`API call failed: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  }

  errorResponse(id, code, message) {
    return {
      jsonrpc: "2.0",
      id,
      error: {
        code,
        message
      }
    };
  }
}

// MCP Protocol handler
class MCPHandler {
  constructor() {
    this.bridge = new GlobalMCPBridge();
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', (data) => {
      this.handleInput(data);
    });
  }

  async handleInput(data) {
    const lines = data.trim().split('\n');

    for (const line of lines) {
      if (line.trim()) {
        try {
          const message = JSON.parse(line);
          const response = await this.bridge.handleMessage(message);
          console.log(JSON.stringify(response));
        } catch (error) {
          console.log(JSON.stringify({
            jsonrpc: "2.0",
            id: null,
            error: {
              code: -32700,
              message: "Parse error: " + error.message
            }
          }));
        }
      }
    }
  }
}

// Start the global MCP bridge
if (import.meta.url === `file://${process.argv[1]}`) {
  // Check if API server is running
  const apiUrl = process.env.API_URL || 'http://localhost:8000';
  
  fetch(`${apiUrl}/health`)
    .then(response => response.json())
    .then(data => {
      console.error(`✅ Connected to API server: ${data.status}`);
      new MCPHandler();
      console.error("🌐 Global MCP Bridge started - routing to API server");
    })
    .catch(error => {
      console.error(`❌ Failed to connect to API server at ${apiUrl}`);
      console.error(`💡 Make sure to run: node server.js`);
      process.exit(1);
    });
}

export { GlobalMCPBridge };