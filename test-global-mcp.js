#!/usr/bin/env node

// Test script for global MCP bridge
import { spawn } from 'child_process';
import fetch from 'node-fetch';

async function testGlobalMCPBridge() {
  console.log('🧪 Testing Global MCP Bridge...\n');

  // First, check if API server is available
  try {
    const apiUrl = 'https://fuzzy-disco-ai-production.up.railway.app';
    console.log(`🌐 Testing API connection to: ${apiUrl}`);
    
    const response = await fetch(`${apiUrl}/health`);
    const data = await response.json();
    console.log(`✅ API Health Check: ${data.status}\n`);
    
    // Test API endpoints directly
    console.log('📡 Testing API endpoints directly...');
    
    // Test select style endpoint
    const styleResponse = await fetch(`${apiUrl}/api/select-style`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ taskType: 'feature', context: 'test', teamSize: 2 })
    });
    const styleData = await styleResponse.json();
    console.log('✅ Select Style API:', styleData.recommendation?.style);
    
    // Test generate code endpoint
    const codeResponse = await fetch(`${apiUrl}/api/generate-code`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        practitioner: 'uncle-bob', 
        codeType: 'UserService', 
        requirements: 'authenticate user' 
      })
    });
    const codeData = await codeResponse.json();
    console.log('✅ Generate Code API:', codeData.practitioner, 'for', codeData.codeType);
    
    console.log('\n🔌 Testing MCP Bridge...');
    
    // Test MCP bridge
    const mcp = spawn('node', ['mcp-global-bridge.js'], {
      stdio: ['pipe', 'pipe', 'pipe'],
      env: { ...process.env, API_URL: apiUrl }
    });
    
    let output = '';
    mcp.stdout.on('data', (data) => {
      output += data.toString();
    });
    
    mcp.stderr.on('data', (data) => {
      console.log('MCP Bridge:', data.toString().trim());
    });
    
    // Test initialize
    const initMessage = { jsonrpc: "2.0", id: 1, method: "initialize", params: {} };
    mcp.stdin.write(JSON.stringify(initMessage) + '\n');
    
    // Test tools list
    const toolsMessage = { jsonrpc: "2.0", id: 2, method: "tools/list", params: {} };
    mcp.stdin.write(JSON.stringify(toolsMessage) + '\n');
    
    // Test tool call
    const callMessage = { 
      jsonrpc: "2.0", 
      id: 3, 
      method: "tools/call", 
      params: { 
        name: "select_practitioner_style", 
        arguments: { taskType: "feature", context: "test", teamSize: 2 } 
      } 
    };
    mcp.stdin.write(JSON.stringify(callMessage) + '\n');
    
    // Wait for responses
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    mcp.kill();
    
    // Parse responses
    const responses = output.trim().split('\n').filter(line => line.trim());
    console.log(`\n📊 MCP Bridge Test Results (${responses.length} responses):`);
    
    responses.forEach((response, index) => {
      try {
        const parsed = JSON.parse(response);
        console.log(`${index + 1}. ${parsed.result ? '✅' : '❌'} ${JSON.stringify(parsed).substring(0, 100)}...`);
      } catch (e) {
        console.log(`${index + 1}. ❌ Parse error: ${response.substring(0, 100)}...`);
      }
    });
    
    console.log('\n🎉 Global MCP Bridge test completed!');
    console.log('💡 You can now use this configuration in Claude Desktop.');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('💡 Make sure the API server is running and accessible.');
  }
}

// Run the test
testGlobalMCPBridge();