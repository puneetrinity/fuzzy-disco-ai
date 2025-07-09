#!/usr/bin/env node

/**
 * Complete MCP Railway Integration Test
 * Tests all MCP tools through the Railway bridge
 */

import { spawn } from 'child_process';
import { writeFileSync, readFileSync } from 'fs';

class MCPRailwayIntegrationTest {
  constructor() {
    this.testResults = [];
    this.bridgeProcess = null;
  }

  async runTest() {
    console.log('🚀 Starting MCP Railway Integration Test...\n');
    
    try {
      // Start bridge process
      await this.startBridge();
      
      // Wait for bridge to be ready
      await this.sleep(2000);
      
      // Test all MCP methods
      await this.testInitialize();
      await this.testListTools();
      await this.testSelectPractitionerStyle();
      await this.testGenerateCode();
      await this.testCoordinateWorkflow();
      await this.testAnalyzeCode();
      
      // Generate report
      this.generateReport();
      
    } catch (error) {
      console.error('❌ Test failed:', error);
    } finally {
      // Clean up
      if (this.bridgeProcess) {
        this.bridgeProcess.kill();
      }
    }
  }

  async startBridge() {
    return new Promise((resolve, reject) => {
      this.bridgeProcess = spawn('node', ['mcp-railway-bridge.js'], {
        stdio: ['pipe', 'pipe', 'pipe']
      });

      let initSuccess = false;
      
      this.bridgeProcess.stderr.on('data', (data) => {
        const message = data.toString();
        if (message.includes('Bridge initialization: SUCCESS')) {
          initSuccess = true;
          resolve();
        }
      });

      this.bridgeProcess.on('error', reject);
      
      // Timeout after 10 seconds
      setTimeout(() => {
        if (!initSuccess) {
          reject(new Error('Bridge failed to initialize within 10 seconds'));
        }
      }, 10000);
    });
  }

  async sendMCPMessage(message) {
    return new Promise((resolve, reject) => {
      const messageStr = JSON.stringify(message) + '\n';
      
      let responseReceived = false;
      
      const onData = (data) => {
        try {
          const response = JSON.parse(data.toString().trim());
          responseReceived = true;
          this.bridgeProcess.stdout.removeListener('data', onData);
          resolve(response);
        } catch (error) {
          reject(new Error('Failed to parse MCP response: ' + error.message));
        }
      };

      this.bridgeProcess.stdout.on('data', onData);
      this.bridgeProcess.stdin.write(messageStr);
      
      // Timeout after 30 seconds
      setTimeout(() => {
        if (!responseReceived) {
          this.bridgeProcess.stdout.removeListener('data', onData);
          reject(new Error('MCP message timeout'));
        }
      }, 30000);
    });
  }

  async testInitialize() {
    console.log('🔧 Testing MCP initialize...');
    
    const message = {
      jsonrpc: "2.0",
      id: "test-init",
      method: "initialize",
      params: {
        protocolVersion: "2024-11-05",
        capabilities: {},
        clientInfo: {
          name: "integration-test",
          version: "1.0.0"
        }
      }
    };

    try {
      const response = await this.sendMCPMessage(message);
      const success = response.result && response.result.serverInfo;
      
      this.testResults.push({
        test: 'initialize',
        success,
        response: success ? response.result.serverInfo : response.error
      });
      
      console.log(success ? '✅ Initialize: SUCCESS' : '❌ Initialize: FAILED');
      
    } catch (error) {
      this.testResults.push({
        test: 'initialize',
        success: false,
        error: error.message
      });
      console.log('❌ Initialize: FAILED -', error.message);
    }
  }

  async testListTools() {
    console.log('🔧 Testing tools/list...');
    
    const message = {
      jsonrpc: "2.0",
      id: "test-tools",
      method: "tools/list",
      params: {}
    };

    try {
      const response = await this.sendMCPMessage(message);
      const success = response.result && response.result.tools && response.result.tools.length > 0;
      
      this.testResults.push({
        test: 'tools/list',
        success,
        toolCount: success ? response.result.tools.length : 0,
        tools: success ? response.result.tools.map(t => t.name) : []
      });
      
      console.log(success ? 
        `✅ Tools List: SUCCESS (${response.result.tools.length} tools)` : 
        '❌ Tools List: FAILED'
      );
      
    } catch (error) {
      this.testResults.push({
        test: 'tools/list',
        success: false,
        error: error.message
      });
      console.log('❌ Tools List: FAILED -', error.message);
    }
  }

  async testSelectPractitionerStyle() {
    console.log('🔧 Testing select_practitioner_style...');
    
    const message = {
      jsonrpc: "2.0",
      id: "test-style",
      method: "tools/call",
      params: {
        name: "select_practitioner_style",
        arguments: {
          taskType: "feature",
          context: "user authentication system",
          teamSize: 3
        }
      }
    };

    try {
      const response = await this.sendMCPMessage(message);
      const success = response.result && response.result.content && response.result.content[0];
      
      this.testResults.push({
        test: 'select_practitioner_style',
        success,
        result: success ? JSON.parse(response.result.content[0].text) : response.error
      });
      
      console.log(success ? '✅ Select Style: SUCCESS' : '❌ Select Style: FAILED');
      
    } catch (error) {
      this.testResults.push({
        test: 'select_practitioner_style',
        success: false,
        error: error.message
      });
      console.log('❌ Select Style: FAILED -', error.message);
    }
  }

  async testGenerateCode() {
    console.log('🔧 Testing generate_code_with_style...');
    
    const message = {
      jsonrpc: "2.0",
      id: "test-generate",
      method: "tools/call",
      params: {
        name: "generate_code_with_style",
        arguments: {
          practitioner: "uncle-bob",
          codeType: "AuthService",
          requirements: "JWT token validation and user authentication",
          language: "typescript"
        }
      }
    };

    try {
      const response = await this.sendMCPMessage(message);
      const success = response.result && response.result.content && response.result.content[0];
      
      this.testResults.push({
        test: 'generate_code_with_style',
        success,
        hasGeneratedCode: success ? JSON.parse(response.result.content[0].text).generatedCode.length > 0 : false
      });
      
      console.log(success ? '✅ Generate Code: SUCCESS' : '❌ Generate Code: FAILED');
      
    } catch (error) {
      this.testResults.push({
        test: 'generate_code_with_style',
        success: false,
        error: error.message
      });
      console.log('❌ Generate Code: FAILED -', error.message);
    }
  }

  async testCoordinateWorkflow() {
    console.log('🔧 Testing coordinate_team_workflow...');
    
    const message = {
      jsonrpc: "2.0",
      id: "test-workflow",
      method: "tools/call",
      params: {
        name: "coordinate_team_workflow",
        arguments: {
          workflow: "feature-development",
          teamMembers: ["Alice", "Bob", "Charlie"],
          priority: "high"
        }
      }
    };

    try {
      const response = await this.sendMCPMessage(message);
      const success = response.result && response.result.content && response.result.content[0];
      
      this.testResults.push({
        test: 'coordinate_team_workflow',
        success,
        result: success ? JSON.parse(response.result.content[0].text) : response.error
      });
      
      console.log(success ? '✅ Coordinate Workflow: SUCCESS' : '❌ Coordinate Workflow: FAILED');
      
    } catch (error) {
      this.testResults.push({
        test: 'coordinate_team_workflow',
        success: false,
        error: error.message
      });
      console.log('❌ Coordinate Workflow: FAILED -', error.message);
    }
  }

  async testAnalyzeCode() {
    console.log('🔧 Testing analyze_code_quality...');
    
    const message = {
      jsonrpc: "2.0",
      id: "test-analyze",
      method: "tools/call",
      params: {
        name: "analyze_code_quality",
        arguments: {
          code: "function authenticate(user) { if (user.password === 'password123') return true; return false; }",
          language: "javascript",
          focusAreas: ["security", "clean-code", "maintainability"]
        }
      }
    };

    try {
      const response = await this.sendMCPMessage(message);
      const success = response.result && response.result.content && response.result.content[0];
      
      this.testResults.push({
        test: 'analyze_code_quality',
        success,
        result: success ? JSON.parse(response.result.content[0].text) : response.error
      });
      
      console.log(success ? '✅ Analyze Code: SUCCESS' : '❌ Analyze Code: FAILED');
      
    } catch (error) {
      this.testResults.push({
        test: 'analyze_code_quality',
        success: false,
        error: error.message
      });
      console.log('❌ Analyze Code: FAILED -', error.message);
    }
  }

  generateReport() {
    console.log('\n📊 Test Report');
    console.log('================');
    
    const totalTests = this.testResults.length;
    const passedTests = this.testResults.filter(r => r.success).length;
    const failedTests = totalTests - passedTests;
    
    console.log(`Total Tests: ${totalTests}`);
    console.log(`Passed: ${passedTests}`);
    console.log(`Failed: ${failedTests}`);
    console.log(`Success Rate: ${Math.round((passedTests / totalTests) * 100)}%\n`);
    
    this.testResults.forEach(result => {
      const status = result.success ? '✅' : '❌';
      console.log(`${status} ${result.test}`);
      if (result.error) {
        console.log(`   Error: ${result.error}`);
      }
    });
    
    // Save detailed report
    const reportData = {
      timestamp: new Date().toISOString(),
      summary: {
        total: totalTests,
        passed: passedTests,
        failed: failedTests,
        successRate: Math.round((passedTests / totalTests) * 100)
      },
      tests: this.testResults
    };
    
    writeFileSync('mcp-integration-test-report.json', JSON.stringify(reportData, null, 2));
    console.log('\n📄 Detailed report saved to: mcp-integration-test-report.json');
    
    if (passedTests === totalTests) {
      console.log('\n🎉 All tests passed! MCP Railway integration is working correctly.');
    } else {
      console.log('\n⚠️  Some tests failed. Check the report for details.');
    }
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Run the test
const test = new MCPRailwayIntegrationTest();
test.runTest();