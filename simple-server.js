#!/usr/bin/env node

// Simple MCP server that doesn't require TypeScript compilation
import express from 'express';

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    name: 'fuzzy-disco-ai',
    version: '1.0.0',
    status: 'running',
    description: 'AI-powered development tools and MCP server'
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});