#!/usr/bin/env node

/**
 * MCP Bridge for Windows - Native Node.js Version
 * This version can run directly on Windows without WSL
 */

import https from 'https';
import { URL } from 'url';

class MCPWindowsNativeBridge {
  constructor() {
    this.serverUrl = 'https://fuzzy-disco-ai-production.up.railway.app';
    this.messageEndpoint = `${this.serverUrl}/message`;
    this.healthEndpoint = `${this.serverUrl}/health`;
    
    this.setupStdio();
  }

  setupStdio() {
    // Handle incoming messages from Claude Desktop
    process.stdin.on('data', async (data) => {
      try {
        const message = JSON.parse(data.toString().trim());
        const response = await this.forwardToRailway(message);
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
    });

    // Handle process termination
    process.on('SIGINT', () => {
      console.error('MCP Windows Bridge shutting down...');
      process.exit(0);
    });

    process.on('SIGTERM', () => {
      console.error('MCP Windows Bridge shutting down...');
      process.exit(0);
    });
  }

  async forwardToRailway(message) {
    try {
      const response = await this.httpsRequest(this.messageEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'MCP-Windows-Bridge/1.0.0'
        },
        body: JSON.stringify(message)
      });

      return JSON.parse(response);
    } catch (error) {
      console.error('Error forwarding to Railway:', error);
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

  async httpsRequest(url, options) {
    return new Promise((resolve, reject) => {
      const urlObj = new URL(url);
      const requestOptions = {
        hostname: urlObj.hostname,
        port: urlObj.port || 443,
        path: urlObj.pathname + urlObj.search,
        method: options.method || 'GET',
        headers: options.headers || {}
      };

      const req = https.request(requestOptions, (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(data);
          } else {
            reject(new Error(`HTTP ${res.statusCode}: ${res.statusMessage}`));
          }
        });
      });

      req.on('error', (error) => {
        reject(error);
      });

      if (options.body) {
        req.write(options.body);
      }

      req.end();
    });
  }

  async healthCheck() {
    try {
      const response = await this.httpsRequest(this.healthEndpoint);
      const health = JSON.parse(response);
      console.error(`Railway server health: ${health.status} (${health.timestamp})`);
      return health.status === 'healthy';
    } catch (error) {
      console.error('Health check failed:', error.message);
      return false;
    }
  }

  async start() {
    console.error('Starting MCP Windows Native Bridge...');
    console.error(`Railway server: ${this.serverUrl}`);
    
    // Check server health
    const healthy = await this.healthCheck();
    if (!healthy) {
      console.error('Railway server is not healthy. Exiting...');
      process.exit(1);
    }
    
    console.error('MCP Windows Native Bridge ready. Listening for messages...');
    
    // Send initial capabilities to verify connection
    const initMessage = {
      jsonrpc: "2.0",
      id: "bridge-init",
      method: "initialize",
      params: {
        protocolVersion: "2024-11-05",
        capabilities: {},
        clientInfo: {
          name: "mcp-windows-native-bridge",
          version: "1.0.0"
        }
      }
    };
    
    const initResponse = await this.forwardToRailway(initMessage);
    console.error('Bridge initialization:', initResponse.result ? 'SUCCESS' : 'FAILED');
    
    // Keep the process alive
    process.stdin.resume();
  }
}

// Start the bridge
const bridge = new MCPWindowsNativeBridge();
bridge.start().catch(error => {
  console.error('Failed to start MCP Windows Native Bridge:', error);
  process.exit(1);
});