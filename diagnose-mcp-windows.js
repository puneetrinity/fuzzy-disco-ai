#!/usr/bin/env node

/**
 * MCP Windows Diagnostic Tool
 * Diagnoses common MCP issues on Windows with WSL
 */

import { execSync } from 'child_process';
import { existsSync, readFileSync } from 'fs';
import { platform } from 'os';

class MCPWindowsDiagnostic {
  constructor() {
    this.issues = [];
    this.fixes = [];
  }

  async run() {
    console.log('🔍 MCP Windows Diagnostic Tool');
    console.log('===============================\n');

    await this.checkPlatform();
    await this.checkWSL();
    await this.checkNodeJS();
    await this.checkClaudeDesktopConfig();
    await this.checkRailwayServer();
    await this.checkBridgeFiles();
    await this.checkDependencies();
    await this.testBridgeConnection();

    this.generateReport();
  }

  async checkPlatform() {
    console.log('1️⃣ Checking Platform...');
    
    const platformInfo = platform();
    console.log(`   Platform: ${platformInfo}`);
    
    if (platformInfo === 'win32') {
      console.log('   ✅ Running on Windows');
      this.fixes.push('Use windows-claude-config.json for Claude Desktop on Windows');
    } else if (platformInfo === 'linux') {
      console.log('   ⚠️  Running on Linux (likely WSL)');
      this.fixes.push('Use linux config for Claude Desktop if running in WSL');
    } else {
      console.log('   ❌ Unsupported platform');
      this.issues.push('Platform not supported');
    }
    console.log('');
  }

  async checkWSL() {
    console.log('2️⃣ Checking WSL...');
    
    try {
      const wslInfo = process.env.WSL_DISTRO_NAME;
      if (wslInfo) {
        console.log(`   ✅ WSL detected: ${wslInfo}`);
        console.log(`   ✅ WSL2 environment confirmed`);
      } else {
        console.log('   ⚠️  Not running in WSL');
      }
    } catch (error) {
      console.log('   ❌ Error checking WSL:', error.message);
      this.issues.push('WSL check failed');
    }
    console.log('');
  }

  async checkNodeJS() {
    console.log('3️⃣ Checking Node.js...');
    
    try {
      const nodeVersion = process.version;
      console.log(`   ✅ Node.js version: ${nodeVersion}`);
      
      const major = parseInt(nodeVersion.split('.')[0].substring(1));
      if (major >= 18) {
        console.log('   ✅ Node.js version is compatible');
      } else {
        console.log('   ❌ Node.js version too old (need 18+)');
        this.issues.push('Node.js version too old');
        this.fixes.push('Upgrade Node.js to version 18 or later');
      }
    } catch (error) {
      console.log('   ❌ Error checking Node.js:', error.message);
      this.issues.push('Node.js check failed');
    }
    console.log('');
  }

  async checkClaudeDesktopConfig() {
    console.log('4️⃣ Checking Claude Desktop Configuration...');
    
    const configPaths = [
      '/home/ews/.config/claude-desktop/config.json',
      '/mnt/c/Users/EverWanderingSoul/AppData/Roaming/Claude/config.json',
      '/mnt/c/Users/EverWanderingSoul/.config/claude-desktop/config.json'
    ];
    
    let configFound = false;
    
    for (const path of configPaths) {
      if (existsSync(path)) {
        console.log(`   ✅ Config found: ${path}`);
        configFound = true;
        
        try {
          const config = JSON.parse(readFileSync(path, 'utf8'));
          if (config.mcpServers && config.mcpServers['fuzzy-disco-ai-railway']) {
            console.log('   ✅ MCP server configured');
          } else {
            console.log('   ❌ MCP server not configured');
            this.issues.push('MCP server not configured in Claude Desktop');
          }
        } catch (error) {
          console.log('   ❌ Error reading config:', error.message);
          this.issues.push('Config file corrupted');
        }
      }
    }
    
    if (!configFound) {
      console.log('   ❌ No Claude Desktop config found');
      this.issues.push('Claude Desktop config not found');
      this.fixes.push('Create Claude Desktop config file');
    }
    console.log('');
  }

  async checkRailwayServer() {
    console.log('5️⃣ Checking Railway Server...');
    
    try {
      const { spawn } = await import('child_process');
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
            } else {
              console.log('   ❌ Railway server is not healthy');
              this.issues.push('Railway server unhealthy');
            }
          } catch (error) {
            console.log('   ❌ Invalid response from Railway server');
            this.issues.push('Railway server response invalid');
          }
        } else {
          console.log('   ❌ Cannot connect to Railway server');
          this.issues.push('Railway server unreachable');
        }
      });
      
      // Wait for curl to complete
      await new Promise(resolve => {
        curl.on('close', resolve);
      });
      
    } catch (error) {
      console.log('   ❌ Error checking Railway server:', error.message);
      this.issues.push('Railway server check failed');
    }
    console.log('');
  }

  async checkBridgeFiles() {
    console.log('6️⃣ Checking Bridge Files...');
    
    const bridgeFiles = [
      '/home/ews/fuzzy-disco-ai/mcp-railway-bridge.js',
      '/home/ews/fuzzy-disco-ai/mcp-windows-native.js',
      '/home/ews/fuzzy-disco-ai/mcp-windows-bridge.bat'
    ];
    
    for (const file of bridgeFiles) {
      if (existsSync(file)) {
        console.log(`   ✅ ${file.split('/').pop()} exists`);
      } else {
        console.log(`   ❌ ${file.split('/').pop()} missing`);
        this.issues.push(`Missing bridge file: ${file.split('/').pop()}`);
      }
    }
    console.log('');
  }

  async checkDependencies() {
    console.log('7️⃣ Checking Dependencies...');
    
    const dependencies = ['node-fetch', 'express', 'ws'];
    
    for (const dep of dependencies) {
      try {
        await import(dep);
        console.log(`   ✅ ${dep} is installed`);
      } catch (error) {
        console.log(`   ❌ ${dep} is missing`);
        this.issues.push(`Missing dependency: ${dep}`);
        this.fixes.push(`Install ${dep}: npm install ${dep}`);
      }
    }
    console.log('');
  }

  async testBridgeConnection() {
    console.log('8️⃣ Testing Bridge Connection...');
    
    try {
      // Test if we can start the bridge
      const { spawn } = await import('child_process');
      const bridge = spawn('timeout', ['5s', 'node', '/home/ews/fuzzy-disco-ai/mcp-railway-bridge.js']);
      
      let output = '';
      bridge.stderr.on('data', (data) => {
        output += data.toString();
      });
      
      bridge.on('close', (code) => {
        if (output.includes('Bridge initialization: SUCCESS')) {
          console.log('   ✅ Bridge connection successful');
        } else {
          console.log('   ❌ Bridge connection failed');
          this.issues.push('Bridge connection failed');
          console.log(`   Output: ${output}`);
        }
      });
      
      // Wait for bridge test to complete
      await new Promise(resolve => {
        bridge.on('close', resolve);
      });
      
    } catch (error) {
      console.log('   ❌ Error testing bridge:', error.message);
      this.issues.push('Bridge test failed');
    }
    console.log('');
  }

  generateReport() {
    console.log('📊 Diagnostic Report');
    console.log('====================\n');
    
    if (this.issues.length === 0) {
      console.log('🎉 No issues found! Your MCP setup should be working.');
    } else {
      console.log(`❌ Found ${this.issues.length} issue(s):`);
      this.issues.forEach((issue, index) => {
        console.log(`   ${index + 1}. ${issue}`);
      });
    }
    
    if (this.fixes.length > 0) {
      console.log('\n🔧 Recommended Fixes:');
      this.fixes.forEach((fix, index) => {
        console.log(`   ${index + 1}. ${fix}`);
      });
    }
    
    console.log('\n📋 Configuration Options:');
    console.log('   For WSL: Use ~/.config/claude-desktop/config.json');
    console.log('   For Windows: Use windows-claude-config.json');
    console.log('   Bridge files: mcp-railway-bridge.js, mcp-windows-native.js');
    
    console.log('\n🔗 Helpful Commands:');
    console.log('   Test Railway: curl https://fuzzy-disco-ai-production.up.railway.app/health');
    console.log('   Test bridge: node mcp-railway-bridge.js');
    console.log('   Full test: node test-mcp-railway-integration.js');
  }
}

// Run the diagnostic
const diagnostic = new MCPWindowsDiagnostic();
diagnostic.run();