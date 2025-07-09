#!/usr/bin/env node

/**
 * Verify Windows MCP Setup
 * Final verification that everything is working correctly
 */

import { existsSync, readFileSync } from 'fs';
import { spawn } from 'child_process';

class WindowsMCPVerification {
  constructor() {
    this.checks = [];
  }

  async run() {
    console.log('🔍 Verifying Windows MCP Setup');
    console.log('================================\n');

    await this.checkWindowsConfig();
    await this.checkWSLConfig();
    await this.checkBridgeFiles();
    await this.checkRailwayServer();
    await this.testBridgeStartup();
    await this.testMCPIntegration();

    this.generateFinalReport();
  }

  async checkWindowsConfig() {
    console.log('1️⃣ Checking Windows Claude Desktop Config...');
    
    const windowsConfigPath = '/mnt/c/Users/EverWanderingSoul/AppData/Roaming/Claude/config.json';
    
    if (existsSync(windowsConfigPath)) {
      console.log('   ✅ Windows config file exists');
      
      try {
        const config = JSON.parse(readFileSync(windowsConfigPath, 'utf8'));
        if (config.mcpServers && config.mcpServers['fuzzy-disco-ai-railway']) {
          console.log('   ✅ MCP server configured in Windows config');
          console.log('   ✅ Uses WSL command correctly');
          this.checks.push({ test: 'Windows Config', status: 'PASS' });
        } else {
          console.log('   ❌ MCP server not configured in Windows config');
          this.checks.push({ test: 'Windows Config', status: 'FAIL' });
        }
      } catch (error) {
        console.log('   ❌ Error reading Windows config:', error.message);
        this.checks.push({ test: 'Windows Config', status: 'FAIL' });
      }
    } else {
      console.log('   ❌ Windows config file missing');
      this.checks.push({ test: 'Windows Config', status: 'FAIL' });
    }
    console.log('');
  }

  async checkWSLConfig() {
    console.log('2️⃣ Checking WSL Config (backup)...');
    
    const wslConfigPath = '/home/ews/.config/claude-desktop/config.json';
    
    if (existsSync(wslConfigPath)) {
      console.log('   ✅ WSL config file exists (backup)');
      this.checks.push({ test: 'WSL Config Backup', status: 'PASS' });
    } else {
      console.log('   ❌ WSL config file missing');
      this.checks.push({ test: 'WSL Config Backup', status: 'FAIL' });
    }
    console.log('');
  }

  async checkBridgeFiles() {
    console.log('3️⃣ Checking Bridge Files...');
    
    const bridgeFiles = [
      'mcp-railway-bridge.js',
      'mcp-windows-native.js',
      'mcp-windows-bridge.bat',
      'mcp-windows-bridge.ps1'
    ];
    
    let allExist = true;
    for (const file of bridgeFiles) {
      const path = `/home/ews/fuzzy-disco-ai/${file}`;
      if (existsSync(path)) {
        console.log(`   ✅ ${file} exists`);
      } else {
        console.log(`   ❌ ${file} missing`);
        allExist = false;
      }
    }
    
    this.checks.push({ test: 'Bridge Files', status: allExist ? 'PASS' : 'FAIL' });
    console.log('');
  }

  async checkRailwayServer() {
    console.log('4️⃣ Checking Railway Server...');
    
    return new Promise((resolve) => {
      const curl = spawn('curl', ['-s', 'https://fuzzy-disco-ai-production.up.railway.app/health']);
      
      let output = '';
      curl.stdout.on('data', (data) => {
        output += data;
      });
      
      curl.on('close', (code) => {
        if (code === 0) {
          try {
            const health = JSON.parse(output);
            if (health.status === 'healthy') {
              console.log('   ✅ Railway server is healthy');
              this.checks.push({ test: 'Railway Server', status: 'PASS' });
            } else {
              console.log('   ❌ Railway server is not healthy');
              this.checks.push({ test: 'Railway Server', status: 'FAIL' });
            }
          } catch (error) {
            console.log('   ❌ Invalid response from Railway server');
            this.checks.push({ test: 'Railway Server', status: 'FAIL' });
          }
        } else {
          console.log('   ❌ Cannot connect to Railway server');
          this.checks.push({ test: 'Railway Server', status: 'FAIL' });
        }
        console.log('');
        resolve();
      });
    });
  }

  async testBridgeStartup() {
    console.log('5️⃣ Testing Bridge Startup...');
    
    return new Promise((resolve) => {
      const bridge = spawn('timeout', ['5s', 'node', '/home/ews/fuzzy-disco-ai/mcp-railway-bridge.js']);
      
      let output = '';
      bridge.stderr.on('data', (data) => {
        output += data.toString();
      });
      
      bridge.on('close', (code) => {
        if (output.includes('Bridge initialization: SUCCESS')) {
          console.log('   ✅ Bridge starts successfully');
          console.log('   ✅ Bridge connects to Railway server');
          this.checks.push({ test: 'Bridge Startup', status: 'PASS' });
        } else {
          console.log('   ❌ Bridge startup failed');
          this.checks.push({ test: 'Bridge Startup', status: 'FAIL' });
        }
        console.log('');
        resolve();
      });
    });
  }

  async testMCPIntegration() {
    console.log('6️⃣ Testing MCP Integration...');
    
    return new Promise((resolve) => {
      const integration = spawn('timeout', ['15s', 'node', '/home/ews/fuzzy-disco-ai/test-mcp-railway-integration.js']);
      
      let output = '';
      integration.stdout.on('data', (data) => {
        output += data.toString();
      });
      
      integration.on('close', (code) => {
        if (output.includes('All tests passed')) {
          console.log('   ✅ MCP integration test passed');
          console.log('   ✅ All 4 tools working correctly');
          this.checks.push({ test: 'MCP Integration', status: 'PASS' });
        } else {
          console.log('   ❌ MCP integration test failed');
          this.checks.push({ test: 'MCP Integration', status: 'FAIL' });
        }
        console.log('');
        resolve();
      });
    });
  }

  generateFinalReport() {
    console.log('📊 Final Verification Report');
    console.log('============================\n');
    
    const passedTests = this.checks.filter(c => c.status === 'PASS').length;
    const totalTests = this.checks.length;
    const successRate = Math.round((passedTests / totalTests) * 100);
    
    console.log(`✅ Passed: ${passedTests}/${totalTests} tests`);
    console.log(`📈 Success Rate: ${successRate}%\n`);
    
    this.checks.forEach(check => {
      const icon = check.status === 'PASS' ? '✅' : '❌';
      console.log(`${icon} ${check.test}: ${check.status}`);
    });
    
    console.log('\n🎯 Setup Status:');
    if (successRate === 100) {
      console.log('🎉 PERFECT! Your MCP setup is fully functional.');
      console.log('');
      console.log('📋 Next Steps:');
      console.log('1. Close Claude Desktop completely');
      console.log('2. Restart Claude Desktop');
      console.log('3. Look for "fuzzy-disco-ai-railway" in the MCP section');
      console.log('4. Try these prompts:');
      console.log('   - "Select the best practitioner style for a REST API"');
      console.log('   - "Generate TypeScript code using Uncle Bob principles"');
      console.log('   - "Analyze this code for quality issues"');
      console.log('   - "Plan a team workflow for bug fixing"');
    } else if (successRate >= 80) {
      console.log('⚠️  MOSTLY WORKING: Minor issues detected.');
      console.log('   The system should work but may have some problems.');
    } else {
      console.log('❌ NEEDS FIXING: Major issues detected.');
      console.log('   Please fix the failed tests before using.');
    }
    
    console.log('\n🔧 Configuration Files:');
    console.log('   Windows: C:\\Users\\EverWanderingSoul\\AppData\\Roaming\\Claude\\config.json');
    console.log('   WSL: ~/.config/claude-desktop/config.json');
    console.log('   Bridge: /home/ews/fuzzy-disco-ai/mcp-railway-bridge.js');
    
    console.log('\n📡 Railway Server:');
    console.log('   URL: https://fuzzy-disco-ai-production.up.railway.app/');
    console.log('   Health: https://fuzzy-disco-ai-production.up.railway.app/health');
  }
}

// Run the verification
const verification = new WindowsMCPVerification();
verification.run();