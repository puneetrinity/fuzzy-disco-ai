#!/usr/bin/env node
import express from 'express';
import { WorkflowMCPServer } from './dist/mcp-servers/workflow-server.js';

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(express.static('public'));

// Initialize the MCP server
let mcpServer;
try {
  mcpServer = new WorkflowMCPServer();
  console.log('MCP Server initialized successfully');
} catch (error) {
  console.error('Failed to initialize MCP server:', error);
}

// Basic endpoints
app.get('/', (req, res) => {
  res.json({
    name: 'fuzzy-disco-ai',
    version: '1.0.0',
    description: 'AI-Enhanced Engineering Workflow with MCP Tools',
    status: 'running',
    endpoints: {
      '/': 'Server info',
      '/health': 'Health check',
      '/api/tools': 'List available AI tools',
      '/api/select-style': 'Auto-select practitioner style',
      '/api/generate-code': 'Generate code with specific style',
      '/api/coordinate-team': 'Coordinate team workflow',
      '/api/analyze-code': 'Analyze code quality'
    }
  });
});

app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    mcpServer: mcpServer ? 'initialized' : 'failed'
  });
});

// API endpoint to list available tools
app.get('/api/tools', (req, res) => {
  const tools = [
    {
      name: 'select_practitioner_style',
      description: 'Automatically select the best practitioner style based on task context',
      parameters: ['taskType', 'context', 'teamSize']
    },
    {
      name: 'generate_code_with_style',
      description: 'Generate code following a specific practitioner\'s style',
      parameters: ['practitioner', 'codeType', 'requirements', 'language']
    },
    {
      name: 'coordinate_team_workflow',
      description: 'Coordinate team workflows and task distribution',
      parameters: ['workflow', 'teamMembers', 'priority']
    },
    {
      name: 'analyze_code_quality',
      description: 'Analyze code quality using multiple practitioner perspectives',
      parameters: ['code', 'language', 'focusAreas']
    }
  ];
  
  res.json({ tools });
});

// API endpoint for style selection
app.post('/api/select-style', async (req, res) => {
  try {
    const { taskType, context, teamSize } = req.body;
    
    if (!taskType) {
      return res.status(400).json({ error: 'taskType is required' });
    }

    // Mock implementation for now - replace with actual MCP call
    const styleMapping = {
      'feature': 'martin-fowler',
      'bug-fix': 'uncle-bob',
      'refactor': 'kent-beck',
      'data-processing': 'jessica-kerr',
      'infrastructure': 'kelsey-hightower'
    };

    const selectedStyle = styleMapping[taskType] || 'martin-fowler';
    
    res.json({
      taskType,
      context,
      teamSize,
      recommendedStyle: selectedStyle,
      reasoning: `Based on task type "${taskType}" and team context, ${selectedStyle} approach is recommended for best practices and team collaboration.`
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API endpoint for code generation
app.post('/api/generate-code', async (req, res) => {
  try {
    const { practitioner, codeType, requirements, language } = req.body;
    
    if (!practitioner || !codeType || !requirements) {
      return res.status(400).json({ error: 'practitioner, codeType, and requirements are required' });
    }

    // Mock implementation - replace with actual code generation
    const codeTemplate = {
      'uncle-bob': `// Clean Code approach by Uncle Bob
class ${codeType}Service {
  constructor(private dependencies: Dependencies) {}
  
  public execute(${requirements.toLowerCase().replace(/\s+/g, '')}Input: Input): Output {
    this.validateInput(input);
    return this.processRequest(input);
  }
  
  private validateInput(input: Input): void {
    // Validation logic
  }
  
  private processRequest(input: Input): Output {
    // Business logic
  }
}`,
      'martin-fowler': `// Refactoring and design patterns by Martin Fowler
class ${codeType} {
  // Following enterprise patterns
  ${requirements}
}`,
      'kent-beck': `// Test-driven development approach by Kent Beck
// Tests first, then implementation
describe('${codeType}', () => {
  test('should ${requirements}', () => {
    // Test implementation
  });
});`
    };

    const generatedCode = codeTemplate[practitioner] || `// Generated code for ${requirements}`;
    
    res.json({
      practitioner,
      codeType,
      requirements,
      language: language || 'typescript',
      generatedCode,
      styleNotes: `This code follows ${practitioner}'s principles and best practices.`
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API endpoint for team coordination
app.post('/api/coordinate-team', async (req, res) => {
  try {
    const { workflow, teamMembers, priority } = req.body;
    
    const coordination = {
      workflow: workflow || 'feature-development',
      teamMembers: teamMembers || [],
      priority: priority || 'medium',
      tasks: [
        { assignee: teamMembers?.[0] || 'developer1', task: 'Design and architecture', estimate: '2 days' },
        { assignee: teamMembers?.[1] || 'developer2', task: 'Core implementation', estimate: '3 days' },
        { assignee: teamMembers?.[2] || 'developer3', task: 'Testing and documentation', estimate: '1 day' }
      ],
      timeline: 'Estimated completion: 6 days',
      recommendations: [
        'Start with architecture discussion',
        'Use pair programming for complex features',
        'Regular code reviews between team members'
      ]
    };
    
    res.json(coordination);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API endpoint for code analysis
app.post('/api/analyze-code', async (req, res) => {
  try {
    const { code, language, focusAreas } = req.body;
    
    if (!code) {
      return res.status(400).json({ error: 'code is required' });
    }

    const analysis = {
      code: code.substring(0, 100) + '...',
      language: language || 'typescript',
      focusAreas: focusAreas || ['clean-code', 'testing', 'design'],
      score: Math.floor(Math.random() * 30) + 70, // Random score 70-100
      insights: [
        'Code follows clean code principles',
        'Consider adding more unit tests',
        'Good separation of concerns',
        'Variable naming could be more descriptive'
      ],
      suggestions: [
        'Extract magic numbers into constants',
        'Add JSDoc comments for public methods',
        'Consider using dependency injection'
      ]
    };
    
    res.json(analysis);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`AI-Enhanced Workflow Server running on port ${PORT}`);
  console.log(`Access the API at: http://localhost:${PORT}`);
});