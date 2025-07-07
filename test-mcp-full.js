#!/usr/bin/env node
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('=== MCP Server Full Test ===');

// Start the MCP server
const serverPath = join(__dirname, 'mcp-server.js');
const server = spawn('node', [serverPath], {
  stdio: ['pipe', 'pipe', 'pipe'],
  cwd: __dirname
});

let testsPassed = 0;
let testsFailed = 0;

server.stdout.on('data', (data) => {
  const output = data.toString();
  console.log('📤 Server Response:', output);
  
  try {
    const response = JSON.parse(output);
    if (response.result) {
      console.log('✅ Valid JSON-RPC response received');
      testsPassed++;
    }
  } catch (e) {
    console.log('❌ Invalid JSON response');
    testsFailed++;
  }
});

server.stderr.on('data', (data) => {
  console.log('🔧 Server Log:', data.toString());
});

server.on('close', (code) => {
  console.log(`\n=== Test Results ===`);
  console.log(`✅ Tests Passed: ${testsPassed}`);
  console.log(`❌ Tests Failed: ${testsFailed}`);
  console.log(`🔧 Server exit code: ${code}`);
  
  if (testsPassed > 0 && testsFailed === 0) {
    console.log('🎉 All tests passed! MCP server is working correctly.');
  } else {
    console.log('🚨 Some tests failed. Check the logs above.');
  }
});

// Test sequence
let testStep = 0;
const tests = [
  {
    name: "Initialize",
    request: {
      jsonrpc: "2.0",
      id: 1,
      method: "initialize",
      params: {
        protocolVersion: "2024-11-05",
        capabilities: { tools: {} },
        clientInfo: { name: "test-client", version: "1.0.0" }
      }
    }
  },
  {
    name: "List Tools",
    request: {
      jsonrpc: "2.0",
      id: 2,
      method: "tools/list",
      params: {}
    }
  },
  {
    name: "Select Practitioner Style",
    request: {
      jsonrpc: "2.0",
      id: 3,
      method: "tools/call",
      params: {
        name: "select_practitioner_style",
        arguments: {
          taskType: "feature",
          context: "Building a new user authentication system",
          teamSize: 3
        }
      }
    }
  }
];

function runNextTest() {
  if (testStep >= tests.length) {
    // All tests complete
    setTimeout(() => {
      server.kill();
      process.exit(0);
    }, 1000);
    return;
  }

  const test = tests[testStep];
  console.log(`\n📋 Running Test ${testStep + 1}: ${test.name}`);
  console.log('📨 Request:', JSON.stringify(test.request, null, 2));
  
  server.stdin.write(JSON.stringify(test.request) + '\n');
  testStep++;
  
  // Move to next test after delay
  setTimeout(runNextTest, 1500);
}

// Start tests after server startup
setTimeout(() => {
  console.log('\n🚀 Starting MCP Server Tests...');
  runNextTest();
}, 1000);

server.on('error', (error) => {
  console.error('❌ Server error:', error);
  process.exit(1);
});

process.on('SIGINT', () => {
  console.log('\n🛑 Terminating test...');
  server.kill();
  process.exit(0);
});
