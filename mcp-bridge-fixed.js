#!/usr/bin/env node

// Fixed Windows MCP Bridge for Claude Desktop
const https = require('https');

class FixedMCPBridge {
  constructor() {
    this.apiUrl = 'https://fuzzy-disco-ai-production.up.railway.app';
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
              description: "Number of team members",
              default: 1
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
              description: "Type of code to generate"
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
              items: {
                type: "string"
              },
              description: "Areas to focus analysis on",
              default: ["clean-code", "maintainability"]
            }
          },
          required: ["code"]
        }
      }
    ];
    
    this.startServer();
  }

  startServer() {
    process.stdin.setEncoding('utf8');
    
    let buffer = '';
    process.stdin.on('data', (chunk) => {
      buffer += chunk;
      
      let lines = buffer.split('\n');
      buffer = lines.pop() || '';
      
      for (const line of lines) {
        if (line.trim()) {
          this.handleMessage(line.trim());
        }
      }
    });

    process.stderr.write('Fixed MCP Bridge started\n');
  }

  async handleMessage(messageStr) {
    try {
      const message = JSON.parse(messageStr);
      let response;

      switch (message.method) {
        case 'initialize':
          response = this.handleInitialize(message);
          break;
        case 'tools/list':
          response = this.handleToolsList(message);
          break;
        case 'tools/call':
          response = await this.handleToolCall(message);
          break;
        default:
          response = {
            jsonrpc: "2.0",
            id: message.id,
            error: {
              code: -32601,
              message: "Method not found"
            }
          };
      }

      process.stdout.write(JSON.stringify(response) + '\n');
    } catch (error) {
      const errorResponse = {
        jsonrpc: "2.0",
        id: null,
        error: {
          code: -32700,
          message: "Parse error: " + error.message
        }
      };
      process.stdout.write(JSON.stringify(errorResponse) + '\n');
    }
  }

  handleInitialize(message) {
    return {
      jsonrpc: "2.0",
      id: message.id,
      result: {
        protocolVersion: "2024-11-05",
        capabilities: {
          tools: {}
        },
        serverInfo: {
          name: "fuzzy-disco-ai-fixed",
          version: "1.0.0"
        }
      }
    };
  }

  handleToolsList(message) {
    return {
      jsonrpc: "2.0",
      id: message.id,
      result: {
        tools: this.tools
      }
    };
  }

  async handleToolCall(message) {
    const { name, arguments: args } = message.params;
    
    try {
      let endpoint;
      switch (name) {
        case "select_practitioner_style":
          endpoint = "/api/select-style";
          break;
        case "generate_code_with_style":
          endpoint = "/api/generate-code";
          break;
        case "analyze_code_quality":
          endpoint = "/api/analyze-code";
          break;
        default:
          throw new Error(`Unknown tool: ${name}`);
      }

      const result = await this.callAPI(endpoint, args);
      
      return {
        jsonrpc: "2.0",
        id: message.id,
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
      return {
        jsonrpc: "2.0",
        id: message.id,
        error: {
          code: -32000,
          message: `Tool execution failed: ${error.message}`
        }
      };
    }
  }

  async callAPI(endpoint, data) {
    return new Promise((resolve, reject) => {
      const postData = JSON.stringify(data);
      
      const options = {
        hostname: 'fuzzy-disco-ai-production.up.railway.app',
        port: 443,
        path: endpoint,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData)
        }
      };

      const req = https.request(options, (res) => {
        let responseData = '';
        
        res.on('data', (chunk) => {
          responseData += chunk;
        });
        
        res.on('end', () => {
          try {
            resolve(JSON.parse(responseData));
          } catch (error) {
            reject(new Error("Invalid JSON response"));
          }
        });
      });

      req.on('error', (error) => {
        reject(error);
      });

      req.write(postData);
      req.end();
    });
  }
}

new FixedMCPBridge();