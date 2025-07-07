#!/usr/bin/env node
import express from 'express';

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());

// Basic info endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'Fuzzy Disco AI',
    version: '1.0.0',
    description: 'AI-Enhanced Engineering Workflow System',
    status: 'running',
    endpoints: {
      '/health': 'Health check',
      '/api/tools': 'List AI tools',
      '/api/select-style': 'Auto-select practitioner style',
      '/api/generate-code': 'Generate code with style',
      '/api/coordinate-team': 'Team workflow coordination',
      '/api/analyze-code': 'Code quality analysis'
    }
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString() 
  });
});

// List available tools
app.get('/api/tools', (req, res) => {
  res.json({
    tools: [
      {
        name: 'select_practitioner_style',
        description: 'Auto-select best practitioner style for task',
        endpoint: 'POST /api/select-style',
        parameters: ['taskType', 'context', 'teamSize']
      },
      {
        name: 'generate_code_with_style',
        description: 'Generate code following practitioner principles',
        endpoint: 'POST /api/generate-code',
        parameters: ['practitioner', 'codeType', 'requirements', 'language']
      },
      {
        name: 'coordinate_team_workflow',
        description: 'AI-powered team coordination',
        endpoint: 'POST /api/coordinate-team',
        parameters: ['workflow', 'teamMembers', 'priority']
      },
      {
        name: 'analyze_code_quality',
        description: 'Multi-perspective code analysis',
        endpoint: 'POST /api/analyze-code',
        parameters: ['code', 'language', 'focusAreas']
      }
    ]
  });
});

// Auto-select practitioner style
app.post('/api/select-style', (req, res) => {
  const { taskType, context, teamSize } = req.body;
  
  if (!taskType) {
    return res.status(400).json({ error: 'taskType is required' });
  }

  const styleRecommendations = {
    'feature': {
      style: 'Martin Fowler',
      reasoning: 'Enterprise patterns and refactoring expertise for feature development',
      principles: ['Domain modeling', 'Enterprise patterns', 'Evolutionary architecture']
    },
    'bug-fix': {
      style: 'Uncle Bob (Robert Martin)',
      reasoning: 'Clean code principles for maintainable bug fixes',
      principles: ['Clean code', 'SOLID principles', 'Test-driven development']
    },
    'refactor': {
      style: 'Kent Beck',
      reasoning: 'Incremental improvement and test-first approach',
      principles: ['Small steps', 'Test-first', 'Simple design']
    },
    'data-processing': {
      style: 'Jessica Kerr',
      reasoning: 'Systems thinking and functional programming approach',
      principles: ['Functional programming', 'Systems thinking', 'Observability']
    },
    'infrastructure': {
      style: 'Kelsey Hightower',
      reasoning: 'Cloud-native and operational excellence',
      principles: ['Cloud-native design', 'Operational excellence', 'Automation']
    }
  };

  const recommendation = styleRecommendations[taskType] || styleRecommendations['feature'];
  
  res.json({
    taskType,
    context: context || 'No additional context provided',
    teamSize: teamSize || 1,
    recommendation,
    teamGuidance: teamSize > 1 ? 'Consider pair programming and code reviews' : 'Focus on clean, self-documenting code'
  });
});

// Generate code with specific style
app.post('/api/generate-code', (req, res) => {
  const { practitioner, codeType, requirements, language } = req.body;
  
  if (!practitioner || !codeType || !requirements) {
    return res.status(400).json({ 
      error: 'practitioner, codeType, and requirements are required' 
    });
  }

  const codeTemplates = {
    'uncle-bob': {
      template: `// Clean Code by Uncle Bob - ${codeType}
export class ${codeType} {
  constructor(private readonly dependencies: Dependencies) {
    this.validateDependencies(dependencies);
  }

  public execute(request: ${codeType}Request): ${codeType}Response {
    this.validateRequest(request);
    const result = this.processRequest(request);
    return this.formatResponse(result);
  }

  private validateRequest(request: ${codeType}Request): void {
    if (!request) {
      throw new Error('Request cannot be null');
    }
    // Add specific validation logic here
  }

  private processRequest(request: ${codeType}Request): any {
    // ${requirements}
    // Implementation follows single responsibility principle
    return this.businessLogic(request);
  }

  private businessLogic(request: ${codeType}Request): any {
    // Core business logic here
    return { success: true, data: request };
  }

  private formatResponse(result: any): ${codeType}Response {
    return {
      timestamp: new Date().toISOString(),
      result
    };
  }

  private validateDependencies(deps: Dependencies): void {
    if (!deps) {
      throw new Error('Dependencies are required');
    }
  }
}`,
      principles: ['Single Responsibility', 'Open/Closed', 'Dependency Inversion', 'Clean naming']
    },
    'martin-fowler': {
      template: `// Enterprise Patterns by Martin Fowler - ${codeType}
export class ${codeType} {
  // Domain model approach with enterprise patterns
  
  constructor(
    private readonly repository: ${codeType}Repository,
    private readonly validator: ${codeType}Validator,
    private readonly eventBus: EventBus
  ) {}

  async handle(command: ${codeType}Command): Promise<${codeType}Result> {
    // ${requirements}
    
    await this.validator.validate(command);
    
    const domainObject = await this.repository.findById(command.id);
    const result = domainObject.${requirements.toLowerCase().replace(/\s+/g, '')}(command);
    
    await this.repository.save(domainObject);
    await this.eventBus.publish(new ${codeType}CompletedEvent(result));
    
    return result;
  }
}

// Repository pattern
export interface ${codeType}Repository {
  findById(id: string): Promise<${codeType}>;
  save(entity: ${codeType}): Promise<void>;
}

// Domain events
export class ${codeType}CompletedEvent {
  constructor(public readonly result: ${codeType}Result) {}
}`,
      principles: ['Domain modeling', 'Repository pattern', 'Domain events', 'Enterprise architecture']
    },
    'kent-beck': {
      template: `// Test-First by Kent Beck - ${codeType}
// Start with the test
describe('${codeType}', () => {
  test('should ${requirements.toLowerCase()}', () => {
    // Arrange
    const ${codeType.toLowerCase()} = new ${codeType}();
    const input = { /* test data */ };
    
    // Act
    const result = ${codeType.toLowerCase()}.execute(input);
    
    // Assert
    expect(result).toBeDefined();
    expect(result.success).toBe(true);
  });
});

// Simple implementation that makes tests pass
export class ${codeType} {
  execute(input: any): any {
    // ${requirements}
    // Simplest thing that could possibly work
    return {
      success: true,
      data: input,
      message: 'Operation completed successfully'
    };
  }
}`,
      principles: ['Test-first', 'Simple design', 'Incremental development', 'Refactor mercilessly']
    },
    'jessica-kerr': {
      template: `// Systems Thinking by Jessica Kerr - ${codeType}
import { pipe } from 'fp-ts/function';
import * as TE from 'fp-ts/TaskEither';

// Functional approach with observability
export const ${codeType.toLowerCase()}Pipeline = (
  logger: Logger,
  metrics: Metrics
) => pipe(
  // ${requirements}
  TE.fromTask(async (input: ${codeType}Input) => {
    logger.info('Starting ${codeType.toLowerCase()} process', { input });
    metrics.increment('${codeType.toLowerCase()}.started');
    return input;
  }),
  TE.chain(validateInput),
  TE.chain(processRequest),
  TE.map(result => {
    logger.info('${codeType.toLowerCase()} completed', { result });
    metrics.increment('${codeType.toLowerCase()}.completed');
    return result;
  }),
  TE.mapLeft(error => {
    logger.error('${codeType.toLowerCase()} failed', { error });
    metrics.increment('${codeType.toLowerCase()}.failed');
    return error;
  })
);

const validateInput = (input: ${codeType}Input): TE.TaskEither<Error, ${codeType}Input> =>
  input ? TE.right(input) : TE.left(new Error('Invalid input'));

const processRequest = (input: ${codeType}Input): TE.TaskEither<Error, ${codeType}Output> =>
  TE.right({ result: 'processed', data: input });`,
      principles: ['Functional programming', 'Observability', 'Systems thinking', 'Composition']
    },
    'kelsey-hightower': {
      template: `// Cloud-Native by Kelsey Hightower - ${codeType}
import { Request, Response } from 'express';

// Kubernetes-ready microservice
export class ${codeType}Service {
  private readonly config = {
    timeout: parseInt(process.env.TIMEOUT || '5000'),
    retries: parseInt(process.env.RETRIES || '3'),
    serviceName: process.env.SERVICE_NAME || '${codeType.toLowerCase()}-service'
  };

  async handle(req: Request, res: Response): Promise<void> {
    const traceId = req.headers['x-trace-id'] || this.generateTraceId();
    
    try {
      // ${requirements}
      const result = await this.processWithRetry(req.body, traceId);
      
      res.status(200).json({
        success: true,
        data: result,
        traceId,
        service: this.config.serviceName
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
        traceId,
        service: this.config.serviceName
      });
    }
  }

  private async processWithRetry(data: any, traceId: string): Promise<any> {
    let attempts = 0;
    
    while (attempts < this.config.retries) {
      try {
        return await this.process(data, traceId);
      } catch (error) {
        attempts++;
        if (attempts === this.config.retries) throw error;
        await this.delay(1000 * attempts);
      }
    }
  }

  private async process(data: any, traceId: string): Promise<any> {
    // Core business logic here
    return { processed: true, traceId };
  }

  private generateTraceId(): string {
    return Math.random().toString(36).substring(2, 15);
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}`,
      principles: ['Cloud-native design', 'Observability', 'Resilience', 'Operational excellence']
    }
  };

  const template = codeTemplates[practitioner] || codeTemplates['uncle-bob'];
  
  res.json({
    practitioner,
    codeType,
    requirements,
    language: language || 'typescript',
    generatedCode: template.template,
    principles: template.principles,
    usage: `This code follows ${practitioner}'s software engineering principles and best practices.`
  });
});

// Team coordination
app.post('/api/coordinate-team', (req, res) => {
  const { workflow, teamMembers, priority } = req.body;
  
  const workflows = {
    'feature-development': {
      phases: ['Planning', 'Design', 'Implementation', 'Testing', 'Review', 'Deployment'],
      tasks: [
        { phase: 'Planning', assignee: teamMembers?.[0] || 'Lead Developer', duration: '1 day', description: 'Requirements analysis and story breakdown' },
        { phase: 'Design', assignee: teamMembers?.[1] || 'Senior Developer', duration: '2 days', description: 'Architecture design and API specification' },
        { phase: 'Implementation', assignee: teamMembers?.[2] || 'Developer', duration: '5 days', description: 'Core feature implementation' },
        { phase: 'Testing', assignee: teamMembers?.[0] || 'QA Engineer', duration: '2 days', description: 'Unit and integration testing' },
        { phase: 'Review', assignee: 'Team', duration: '1 day', description: 'Code review and documentation' },
        { phase: 'Deployment', assignee: teamMembers?.[1] || 'DevOps', duration: '0.5 days', description: 'Production deployment and monitoring' }
      ]
    },
    'bug-fix': {
      phases: ['Investigation', 'Fix', 'Testing', 'Deployment'],
      tasks: [
        { phase: 'Investigation', assignee: teamMembers?.[0] || 'Developer', duration: '2 hours', description: 'Root cause analysis and reproduction' },
        { phase: 'Fix', assignee: teamMembers?.[0] || 'Developer', duration: '4 hours', description: 'Implement fix following clean code principles' },
        { phase: 'Testing', assignee: teamMembers?.[1] || 'QA', duration: '2 hours', description: 'Verify fix and regression testing' },
        { phase: 'Deployment', assignee: teamMembers?.[1] || 'DevOps', duration: '1 hour', description: 'Hotfix deployment' }
      ]
    }
  };

  const selectedWorkflow = workflows[workflow] || workflows['feature-development'];
  
  res.json({
    workflow: workflow || 'feature-development',
    priority: priority || 'medium',
    teamMembers: teamMembers || ['Developer 1', 'Developer 2', 'Developer 3'],
    coordination: selectedWorkflow,
    recommendations: [
      'Daily standups to track progress',
      'Pair programming for complex tasks',
      'Code reviews for all changes',
      'Continuous integration and testing'
    ],
    estimatedCompletion: selectedWorkflow.tasks.reduce((total, task) => {
      const hours = parseFloat(task.duration) || 1;
      return total + (task.duration.includes('day') ? hours * 8 : hours);
    }, 0) + ' hours'
  });
});

// Code analysis
app.post('/api/analyze-code', (req, res) => {
  const { code, language, focusAreas } = req.body;
  
  if (!code) {
    return res.status(400).json({ error: 'code is required' });
  }

  // Simple code analysis (in real implementation, this would be more sophisticated)
  const codeMetrics = {
    lines: code.split('\n').length,
    functions: (code.match(/function|=>|def\s+/g) || []).length,
    classes: (code.match(/class\s+\w+/g) || []).length,
    complexity: Math.min(10, Math.max(1, Math.floor(code.length / 100)))
  };

  const analysisResults = {
    code: code.length > 200 ? code.substring(0, 200) + '...' : code,
    language: language || 'javascript',
    focusAreas: focusAreas || ['clean-code', 'maintainability', 'performance'],
    metrics: codeMetrics,
    score: Math.max(60, 100 - (codeMetrics.complexity * 5) + (codeMetrics.functions * 2)),
    insights: [
      `Code has ${codeMetrics.lines} lines with ${codeMetrics.functions} functions`,
      codeMetrics.classes > 0 ? `Contains ${codeMetrics.classes} classes - good OOP structure` : 'Consider using classes for better organization',
      codeMetrics.complexity < 5 ? 'Low complexity - easy to understand' : 'Moderate complexity - consider refactoring',
      code.includes('test') || code.includes('spec') ? 'Contains tests - excellent!' : 'Consider adding unit tests'
    ],
    recommendations: [
      'Add comprehensive JSDoc comments',
      'Implement error handling for edge cases',
      'Consider extracting magic numbers into constants',
      'Add input validation',
      'Follow consistent naming conventions'
    ],
    practitionerPerspectives: {
      'Uncle Bob': 'Focus on single responsibility and clean naming',
      'Martin Fowler': 'Consider refactoring for better domain modeling',
      'Kent Beck': 'Write tests first, then refactor incrementally',
      'Jessica Kerr': 'Add observability and error tracking',
      'Kelsey Hightower': 'Ensure cloud-native patterns and monitoring'
    }
  };
  
  res.json(analysisResults);
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Internal server error',
    message: err.message 
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Fuzzy Disco AI running on port ${PORT}`);
  console.log(`📡 API available at: http://localhost:${PORT}`);
  console.log(`🔧 Endpoints: /, /health, /api/tools, /api/*`);
});