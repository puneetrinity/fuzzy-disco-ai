#!/usr/bin/env node

// Windows-compatible MCP bridge for Claude Desktop
// This runs on Windows and connects to Railway API server

const https = require('https');
const http = require('http');
const { URL } = require('url');

const API_BASE_URL = 'https://fuzzy-disco-ai-production.up.railway.app';

class WindowsMCPBridge {
  constructor() {
    this.tools = [
      {
        name: "select_practitioner_style",
        description: "Auto-select the best practitioner style based on task context",
        inputSchema: {
          type: "object",
          properties: {
            taskType: { type: "string", enum: ["feature", "bug-fix", "refactor", "data-processing", "infrastructure"] },
            context: { type: "string" },
            teamSize: { type: "number" }
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
            practitioner: { type: "string", enum: ["uncle-bob", "martin-fowler", "kent-beck", "jessica-kerr", "kelsey-hightower"] },
            codeType: { type: "string" },
            requirements: { type: "string" },
            language: { type: "string", default: "typescript" }
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
            workflow: { type: "string", enum: ["feature-development", "bug-fix", "refactor", "sprint-planning"] },
            teamMembers: { type: "array", items: { type: "string" } },
            priority: { type: "string", enum: ["low", "medium", "high", "critical"], default: "medium" }
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
            code: { type: "string" },
            language: { type: "string", default: "javascript" },
            focusAreas: { type: "array", items: { type: "string" }, default: ["clean-code", "maintainability", "performance"] }
          },
          required: ["code"]
        }
      }
    ];
    this.setupStdio();
    console.error("Windows MCP Bridge started - connecting to Railway API server");
  }

  setupStdio() {
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', async (data) => {
      try {
        const lines = data.toString().trim().split('\n');
        
        for (const line of lines) {
          if (line.trim()) {
            const message = JSON.parse(line);
            const response = await this.handleMessage(message);
            console.log(JSON.stringify(response));
          }
        }
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
    });
  }

  async handleMessage(message) {
    const { id, method, params } = message;

    switch (method) {
      case "initialize":
        return {
          jsonrpc: "2.0",
          id,
          result: {
            protocolVersion: "2024-11-05",
            capabilities: { tools: {} },
            serverInfo: { name: "fuzzy-disco-ai-windows", version: "1.0.0" }
          }
        };
      case "tools/list":
        return {
          jsonrpc: "2.0",
          id,
          result: { tools: this.tools }
        };
      case "tools/call":
        return await this.handleToolCall(id, params);
      default:
        return {
          jsonrpc: "2.0",
          id,
          error: { code: -32601, message: "Method not found" }
        };
    }
  }

  async handleToolCall(id, params) {
    const { name, arguments: args } = params;
    
    try {
      let endpoint;
      switch (name) {
        case "select_practitioner_style":
          endpoint = "/api/select-style";
          break;
        case "generate_code_with_style":
          endpoint = "/api/generate-code";
          break;
        case "coordinate_team_workflow":
          endpoint = "/api/coordinate-team";
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
      return {
        jsonrpc: "2.0",
        id,
        error: {
          code: -32000,
          message: `Tool execution failed: ${error.message}`
        }
      };
    }
  }

  async callAPI(endpoint, data) {
    return new Promise((resolve, reject) => {
      const url = new URL(API_BASE_URL + endpoint);
      const postData = JSON.stringify(data);
      
      const options = {
        hostname: url.hostname,
        port: url.port || 443,
        path: url.pathname,
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
            const response = JSON.parse(responseData);
            resolve(response);
          } catch (error) {
            reject(new Error("Invalid JSON response: " + error.message));
          }
        });
      });

      req.on('error', (error) => {
        reject(new Error("Connection error: " + error.message));
      });

      req.write(postData);
      req.end();
    });
  }
}

// Start the bridge
new WindowsMCPBridge();