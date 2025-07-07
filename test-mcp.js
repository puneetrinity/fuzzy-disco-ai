#!/usr/bin/env node

// Test script for MCP server
import { spawn } from 'child_process';

const mcpServer = spawn('node', ['mcp-server-standalone.js'], {
  stdio: ['pipe', 'pipe', 'pipe']
});

// Test sequence
const tests = [
  '{"jsonrpc": "2.0", "id": 1, "method": "initialize", "params": {}}\n',
  '{"jsonrpc": "2.0", "id": 2, "method": "tools/list", "params": {}}\n',
  '{"jsonrpc": "2.0", "id": 3, "method": "tools/call", "params": {"name": "select_practitioner_style", "arguments": {"taskType": "feature", "context": "test", "teamSize": 2}}}\n'
];

let testIndex = 0;

mcpServer.stdout.on('data', (data) => {
  console.log('Response:', data.toString());
  
  // Send next test after a short delay
  if (testIndex < tests.length) {
    setTimeout(() => {
      console.log('Sending:', tests[testIndex].trim());
      mcpServer.stdin.write(tests[testIndex]);
      testIndex++;
    }, 100);
  } else {
    mcpServer.kill();
  }
});

mcpServer.stderr.on('data', (data) => {
  console.log('Server log:', data.toString());
});

mcpServer.on('close', (code) => {
  console.log(`MCP server exited with code ${code}`);
});

// Start first test
setTimeout(() => {
  console.log('Sending:', tests[testIndex].trim());
  mcpServer.stdin.write(tests[testIndex]);
  testIndex++;
}, 500);