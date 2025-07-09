#!/usr/bin/env node

// Windows-compatible MCP bridge for Claude Desktop
// This runs on Windows and connects to Railway MCP server

const https = require('https');
const http = require('http');
const { URL } = require('url');

const MCP_SERVER_URL = 'https://fuzzy-disco-ai-production.up.railway.app/message';

class WindowsMCPBridge {
  constructor() {
    this.setupStdio();
    console.error("Windows MCP Bridge started - connecting to Railway server");
  }

  setupStdio() {
    process.stdin.setEncoding('utf8');
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
  }

  async sendToServer(message) {
    return new Promise((resolve, reject) => {
      const url = new URL(MCP_SERVER_URL);
      const postData = JSON.stringify(message);
      
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
        let data = '';
        
        res.on('data', (chunk) => {
          data += chunk;
        });
        
        res.on('end', () => {
          try {
            const response = JSON.parse(data);
            resolve(response);
          } catch (error) {
            resolve({
              jsonrpc: "2.0",
              id: message.id || null,
              error: {
                code: -32603,
                message: "Invalid JSON response: " + error.message
              }
            });
          }
        });
      });

      req.on('error', (error) => {
        resolve({
          jsonrpc: "2.0",
          id: message.id || null,
          error: {
            code: -32603,
            message: "Connection error: " + error.message
          }
        });
      });

      req.write(postData);
      req.end();
    });
  }
}

// Start the bridge
new WindowsMCPBridge();