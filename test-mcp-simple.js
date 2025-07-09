#!/usr/bin/env node

// Simple test MCP server for debugging
const server = {
  handleMessage(message) {
    const { id, method } = message;
    
    switch (method) {
      case "initialize":
        return {
          jsonrpc: "2.0",
          id,
          result: {
            protocolVersion: "2024-11-05",
            capabilities: { tools: {} },
            serverInfo: { name: "test-server", version: "1.0.0" }
          }
        };
      case "tools/list":
        return {
          jsonrpc: "2.0",
          id,
          result: {
            tools: [{
              name: "test_tool",
              description: "A simple test tool",
              inputSchema: {
                type: "object",
                properties: {
                  message: { type: "string", description: "Test message" }
                }
              }
            }]
          }
        };
      case "tools/call":
        return {
          jsonrpc: "2.0",
          id,
          result: {
            content: [{ type: "text", text: "Test tool called successfully!" }]
          }
        };
      default:
        return {
          jsonrpc: "2.0",
          id,
          error: { code: -32601, message: "Method not found" }
        };
    }
  }
};

// Handle stdin
process.stdin.on('data', (data) => {
  const lines = data.toString().trim().split('\n');
  
  for (const line of lines) {
    if (line.trim()) {
      try {
        const message = JSON.parse(line);
        const response = server.handleMessage(message);
        console.log(JSON.stringify(response));
      } catch (error) {
        console.log(JSON.stringify({
          jsonrpc: "2.0",
          id: null,
          error: { code: -32700, message: "Parse error" }
        }));
      }
    }
  }
});

process.stdin.setEncoding('utf8');
console.error("Simple MCP test server started");