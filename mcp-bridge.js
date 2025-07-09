#!/usr/bin/env node

// Bridge script to connect Claude Desktop to our Railway MCP server
// This avoids the mcp-remote dependency issues

import { spawn } from 'child_process';
import { createServer } from 'http';

const MCP_SERVER_URL = 'https://fuzzy-disco-ai-production.up.railway.app/message';

class MCPBridge {
  constructor() {
    this.setupStdio();
  }

  setupStdio() {
    // Handle stdin/stdout for MCP protocol
    process.stdin.on('data', async (data) => {
      try {
        const lines = data.toString().trim().split('\n');
        
        for (const line of lines) {
          if (line.trim()) {
            const message = JSON.parse(line);
            const response = await this.sendToServer(message);
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

    process.stdin.setEncoding('utf8');
    process.stdin.resume();
  }

  async sendToServer(message) {
    try {
      const response = await fetch(MCP_SERVER_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      return {
        jsonrpc: "2.0",
        id: message.id || null,
        error: {
          code: -32603,
          message: "Internal error: " + error.message
        }
      };
    }
  }
}

// Start the bridge
new MCPBridge();
console.error("MCP Bridge started - connecting to Railway server");