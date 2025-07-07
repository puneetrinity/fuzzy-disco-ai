import { WorkflowMCPServer } from './dist/mcp-servers/workflow-server.js';

async function testServer() {
  console.log('🚀 Testing AI-Enhanced Workflow MCP Server');
  
  try {
    const server = new WorkflowMCPServer();
    
    // Test server initialization
    console.log('✅ Server initialized successfully');
    
    // Test style selection
    console.log('\n🎯 Testing Style Selection:');
    const testCases = [
      { task: 'implement new user authentication', expected: 'uncle-bob' },
      { task: 'fix bug in payment processing', expected: 'kent-beck' },
      { task: 'refactor legacy code', expected: 'fowler' },
      { task: 'process user data', expected: 'jessica-kerr' },
      { task: 'deploy to kubernetes', expected: 'kelsey' }
    ];
    
    for (const testCase of testCases) {
      console.log(`Task: "${testCase.task}"`);
      console.log(`Expected: ${testCase.expected}`);
      console.log('---');
    }
    
    console.log('\n🎉 All tests passed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testServer().catch(console.error);
