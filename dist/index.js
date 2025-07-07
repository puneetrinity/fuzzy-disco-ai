#!/usr/bin/env node
/**
 * Main entry point for the AI-Enhanced Engineering Workflow MCP Server
 */
import { WorkflowMCPServer } from './mcp-servers/workflow-server.js';
// Create and start the server
const server = new WorkflowMCPServer();
server.run().catch((error) => {
    console.error('Failed to start MCP server:', error);
    process.exit(1);
});
