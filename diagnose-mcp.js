#!/usr/bin/env node

async function diagnoseMCPServer() {
  console.log('🔍 MCP Server Diagnostics');
  console.log('=========================\n');

  const fs = await import('fs');
  const path = await import('path');

  // Check 1: Required files exist
  console.log('📁 File Check:');
  const requiredFiles = [
    'mcp-server.js',
    'dist/mcp-servers/workflow-server.js',
    '.vscode/mcp.json',
    'package.json'
  ];

  requiredFiles.forEach(file => {
    const exists = fs.existsSync(file);
    console.log(`  ${exists ? '✅' : '❌'} ${file}`);
  });

  // Check 2: Build status
  console.log('\n🏗️ Build Check:');
  try {
    await import('./dist/mcp-servers/workflow-server.js');
    console.log('  ✅ TypeScript compiled successfully');
  } catch (error) {
    console.log('  ❌ Build error:', error.message);
    console.log('  💡 Run: npm run build');
  }

  // Check 3: MCP configuration
  console.log('\n⚙️ Configuration Check:');
  try {
    const mcpConfig = JSON.parse(fs.readFileSync('.vscode/mcp.json', 'utf8'));
    console.log('  ✅ MCP config file valid');
    console.log('  📝 Server name:', Object.keys(mcpConfig.mcpServers)[0]);
    
    const serverConfig = Object.values(mcpConfig.mcpServers)[0];
    console.log('  📝 Command:', serverConfig.command);
    console.log('  📝 Args:', serverConfig.args.join(' '));
  } catch (error) {
    console.log('  ❌ MCP config error:', error.message);
  }

  // Check 4: Dependencies
  console.log('\n📦 Dependencies Check:');
  try {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const deps = packageJson.dependencies || {};
    
    const requiredDeps = ['@modelcontextprotocol/sdk', 'zod'];
    requiredDeps.forEach(dep => {
      const hasDepende = deps[dep] || false;
      console.log(`  ${hasDepende ? '✅' : '❌'} ${dep}`);
    });
  } catch (error) {
    console.log('  ❌ Package.json error:', error.message);
  }

  // Check 5: Server startup test
  console.log('\n🚀 Server Startup Test:');
  try {
    const { WorkflowMCPServer } = await import('./dist/mcp-servers/workflow-server.js');
    const server = new WorkflowMCPServer();
    console.log('  ✅ Server instance created successfully');
    
    // Test if run method exists
    if (typeof server.run === 'function') {
      console.log('  ✅ Run method available');
    } else {
      console.log('  ❌ Run method missing');
    }
  } catch (error) {
    console.log('  ❌ Server creation failed:', error.message);
  }

  console.log('\n🛠️ Common Solutions:');
  console.log('====================');
  console.log('1. Build the project: npm run build');
  console.log('2. Install dependencies: npm install');
  console.log('3. Check MCP config: .vscode/mcp.json');
  console.log('4. Restart VS Code after configuration changes');
  console.log('5. Check VS Code extension: Claude Code should be installed');

  console.log('\n📋 Manual Test Commands:');
  console.log('========================');
  console.log('# Test MCP server directly:');
  console.log('node mcp-server.js');
  console.log('');
  console.log('# Test imports:');
  console.log('node -e "import(\'./dist/mcp-servers/workflow-server.js\').then(console.log)"');
  console.log('');
  console.log('# Check VS Code MCP integration:');
  console.log('# Open VS Code Command Palette (Ctrl+Shift+P)');
  console.log('# Search for "MCP" or "Claude" commands');

  console.log('\n🎯 Expected Behavior:');
  console.log('=====================');
  console.log('✅ Server starts without errors');
  console.log('✅ Shows "AI Workflow MCP Server running on stdio"');
  console.log('✅ VS Code can connect and use MCP tools');
  console.log('✅ Claude Code extension shows the server as available');

  console.log('\n🔧 If Issues Persist:');
  console.log('=====================');
  console.log('1. Check VS Code Developer Console (Help > Toggle Developer Tools)');
  console.log('2. Look for error messages in the Console tab');
  console.log('3. Verify Claude Code extension is installed and enabled');
  console.log('4. Try restarting VS Code completely');
  console.log('5. Check the MCP server logs for specific error messages');
}

diagnoseMCPServer().catch(console.error);
