#!/usr/bin/env node
import { WorkflowMCPServer } from './dist/mcp-servers/workflow-server.js';

async function main() {
  try {
    const server = new WorkflowMCPServer();
    await server.run();
    
    // Keep the process alive - MCP servers should run indefinitely
    process.stdin.resume();
    
  } catch (error) {
    console.error('Failed to start MCP server:', error);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error('Unhandled error:', error);
  process.exit(1);
});
