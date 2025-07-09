#!/usr/bin/env node

/**
 * MCP Bridge for Railway Connection
 * Connects Claude Desktop to Railway-hosted MCP server via HTTP
 */

import fetch from 'node-fetch';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class MCPRailwayBridge {
  constructor() {
    this.serverUrl = 'https://fuzzy-disco-ai-production.up.railway.app';
    this.messageEndpoint = `${this.serverUrl}/message`;
    this.healthEndpoint = `${this.serverUrl}/health`;
    
    // Setup stdio for MCP communication
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
      console.error('MCP Railway Bridge shutting down...');
      process.exit(0);
    });

    process.on('SIGTERM', () => {
      console.error('MCP Railway Bridge shutting down...');
      process.exit(0);
    });
  }

  async forwardToRailway(message) {
    try {
      const response = await fetch(this.messageEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'MCP-Railway-Bridge/1.0.0'
        },
        body: JSON.stringify(message),
        timeout: 30000 // 30 second timeout
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      return result;
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

  async healthCheck() {
    try {
      const response = await fetch(this.healthEndpoint, {
        method: 'GET',
        timeout: 5000
      });
      
      if (response.ok) {
        const health = await response.json();
        console.error(`Railway server health: ${health.status} (${health.timestamp})`);
        return true;
      } else {
        console.error(`Railway server unhealthy: ${response.status}`);
        return false;
      }
    } catch (error) {
      console.error('Health check failed:', error.message);
      return false;
    }
  }

  async start() {
    console.error('Starting MCP Railway Bridge...');
    console.error(`Railway server: ${this.serverUrl}`);
    
    // Check server health
    const healthy = await this.healthCheck();
    if (!healthy) {
      console.error('Railway server is not healthy. Exiting...');
      process.exit(1);
    }
    
    console.error('MCP Railway Bridge ready. Listening for messages...');
    
    // Send initial capabilities to verify connection
    const initMessage = {
      jsonrpc: "2.0",
      id: "bridge-init",
      method: "initialize",
      params: {
        protocolVersion: "2024-11-05",
        capabilities: {},
        clientInfo: {
          name: "mcp-railway-bridge",
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
const bridge = new MCPRailwayBridge();
bridge.start().catch(error => {
  console.error('Failed to start MCP Railway Bridge:', error);
  process.exit(1);
});