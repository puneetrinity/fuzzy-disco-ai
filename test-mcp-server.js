#!/usr/bin/env node
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('Testing MCP Server...');

// Start the MCP server
const serverPath = join(__dirname, 'mcp-server.js');
console.log('Server path:', serverPath);

const server = spawn('node', [serverPath], {
  stdio: ['pipe', 'pipe', 'pipe'],
  cwd: __dirname
});

let serverOutput = '';
let serverError = '';

server.stdout.on('data', (data) => {
  serverOutput += data.toString();
  console.log('Server stdout:', data.toString());
});

server.stderr.on('data', (data) => {
  serverError += data.toString();
  console.log('Server stderr:', data.toString());
});

server.on('close', (code) => {
  console.log(`Server exited with code ${code}`);
  if (serverOutput) console.log('Server output:', serverOutput);
  if (serverError) console.log('Server error:', serverError);
});

// Send MCP initialize request
const initializeRequest = {
  jsonrpc: "2.0",
  id: 1,
  method: "initialize",
  params: {
    protocolVersion: "2024-11-05",
    capabilities: {
      tools: {}
    },
    clientInfo: {
      name: "test-client",
      version: "1.0.0"
    }
  }
};

console.log('Sending initialize request...');

// Give server time to start
setTimeout(() => {
  server.stdin.write(JSON.stringify(initializeRequest) + '\n');
  
  // Wait for response then close
  setTimeout(() => {
    server.kill();
    process.exit(0);
  }, 2000);
}, 500);

// Handle any errors
server.on('error', (error) => {
  console.error('Server error:', error);
  process.exit(1);
});

process.on('SIGINT', () => {
  console.log('Terminating test...');
  server.kill();
  process.exit(0);
});
