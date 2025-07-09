#!/usr/bin/env node

// Local MCP server for Claude Code integration
// This runs via stdio transport for local development

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { 
  CallToolRequestSchema, 
  ListToolsRequestSchema,
  Tool
} from '@modelcontextprotocol/sdk/types.js';

class LocalMCPServer {
  constructor() {
    this.server = new Server({
      name: 'fuzzy-disco-ai-local',
      version: '1.0.0',
    }, {
      capabilities: {
        tools: {}
      }
    });

    this.setupHandlers();
  }

  setupHandlers() {
    // List tools handler
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'select_practitioner_style',
            description: 'Auto-select the best practitioner style based on task context',
            inputSchema: {
              type: 'object',
              properties: {
                taskType: {
                  type: 'string',
                  description: 'Type of task',
                  enum: ['feature', 'bug-fix', 'refactor', 'data-processing', 'infrastructure']
                },
                context: {
                  type: 'string',
                  description: 'Additional context about the task'
                },
                teamSize: {
                  type: 'number',
                  description: 'Number of team members'
                }
              },
              required: ['taskType']
            }
          },
          {
            name: 'generate_code_with_style',
            description: 'Generate code following a specific practitioner\'s style',
            inputSchema: {
              type: 'object',
              properties: {
                practitioner: {
                  type: 'string',
                  description: 'Practitioner to emulate',
                  enum: ['uncle-bob', 'martin-fowler', 'kent-beck', 'jessica-kerr', 'kelsey-hightower']
                },
                codeType: {
                  type: 'string',
                  description: 'Type of code to generate (class, function, etc.)'
                },
                requirements: {
                  type: 'string',
                  description: 'Specific requirements for the code'
                },
                language: {
                  type: 'string',
                  description: 'Programming language',
                  default: 'typescript'
                }
              },
              required: ['practitioner', 'codeType', 'requirements']
            }
          },
          {
            name: 'coordinate_team_workflow',
            description: 'Coordinate team workflows and task distribution',
            inputSchema: {
              type: 'object',
              properties: {
                workflow: {
                  type: 'string',
                  description: 'Type of workflow',
                  enum: ['feature-development', 'bug-fix', 'refactor', 'sprint-planning']
                },
                teamMembers: {
                  type: 'array',
                  items: { type: 'string' },
                  description: 'List of team member names'
                },
                priority: {
                  type: 'string',
                  enum: ['low', 'medium', 'high', 'critical'],
                  default: 'medium'
                }
              },
              required: ['workflow']
            }
          },
          {
            name: 'analyze_code_quality',
            description: 'Analyze code quality using multiple practitioner perspectives',
            inputSchema: {
              type: 'object',
              properties: {
                code: {
                  type: 'string',
                  description: 'Code to analyze'
                },
                language: {
                  type: 'string',
                  description: 'Programming language',
                  default: 'javascript'
                },
                focusAreas: {
                  type: 'array',
                  items: { type: 'string' },
                  description: 'Areas to focus analysis on',
                  default: ['clean-code', 'maintainability', 'performance']
                }
              },
              required: ['code']
            }
          }
        ]
      };
    });

    // Call tool handler
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        let result;
        
        switch (name) {
          case 'select_practitioner_style':
            result = await this.selectPractitionerStyle(args);
            break;
          case 'generate_code_with_style':
            result = await this.generateCodeWithStyle(args);
            break;
          case 'coordinate_team_workflow':
            result = await this.coordinateTeamWorkflow(args);
            break;
          case 'analyze_code_quality':
            result = await this.analyzeCodeQuality(args);
            break;
          default:
            throw new Error(`Unknown tool: ${name}`);
        }

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2)
            }
          ]
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error: ${error.message}`
            }
          ],
          isError: true
        };
      }
    });
  }

  // Tool implementations
  async selectPractitionerStyle(args) {
    const { taskType, context, teamSize } = args;
    
    const recommendations = {
      'feature': {
        practitioner: 'Martin Fowler',
        reasoning: 'Enterprise patterns and refactoring expertise for feature development',
        principles: ['Domain modeling', 'Enterprise patterns', 'Evolutionary architecture'],
        approach: 'Start with domain modeling, use enterprise patterns, focus on maintainable architecture'
      },
      'bug-fix': {
        practitioner: 'Uncle Bob (Robert Martin)',
        reasoning: 'Clean code principles ensure maintainable and robust bug fixes',
        principles: ['Clean code', 'SOLID principles', 'Test-driven development'],
        approach: 'Write tests first, fix the root cause, refactor for clarity'
      },
      'refactor': {
        practitioner: 'Kent Beck',
        reasoning: 'Incremental improvement and test-first approach for safe refactoring',
        principles: ['Small steps', 'Test-first', 'Simple design'],
        approach: 'Make small changes, keep tests green, improve design incrementally'
      },
      'data-processing': {
        practitioner: 'Jessica Kerr',
        reasoning: 'Systems thinking and functional programming for robust data processing',
        principles: ['Functional programming', 'Systems thinking', 'Observability'],
        approach: 'Use immutable data, compose functions, add comprehensive monitoring'
      },
      'infrastructure': {
        practitioner: 'Kelsey Hightower',
        reasoning: 'Cloud-native expertise for scalable and reliable infrastructure',
        principles: ['Cloud-native design', 'Operational excellence', 'Automation'],
        approach: 'Design for cloud, automate everything, monitor and observe'
      }
    };

    const recommendation = recommendations[taskType] || recommendations['feature'];
    
    return {
      task: {
        type: taskType,
        context: context || 'No additional context provided',
        teamSize: teamSize || 1
      },
      recommendation,
      teamGuidance: teamSize > 1 
        ? 'Foster pair programming, conduct thorough code reviews, ensure knowledge sharing'
        : 'Focus on clear documentation and self-explaining code'
    };
  }

  async generateCodeWithStyle(args) {
    const { practitioner, codeType, requirements, language = 'typescript' } = args;

    const codeTemplates = {
      'uncle-bob': `// Clean Code by Uncle Bob - ${codeType}
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
    // ${requirements} - Add specific validation
  }

  private processRequest(request: ${codeType}Request): ProcessResult {
    // Core business logic: ${requirements}
    return this.executeBusinessLogic(request);
  }

  private executeBusinessLogic(request: ${codeType}Request): ProcessResult {
    // Implementation of: ${requirements}
    return { success: true, data: request };
  }
}`,

      'martin-fowler': `// Enterprise Patterns by Martin Fowler - ${codeType}
export class ${codeType} {
  constructor(
    private readonly repository: ${codeType}Repository,
    private readonly validator: ${codeType}Validator,
    private readonly eventBus: EventBus
  ) {}

  async handle(command: ${codeType}Command): Promise<${codeType}Result> {
    // ${requirements}
    await this.validator.validate(command);
    const aggregate = await this.repository.findById(command.aggregateId);
    const result = aggregate.process(command);
    await this.repository.save(aggregate);
    await this.eventBus.publish(new ${codeType}ProcessedEvent(result));
    return result;
  }
}`,

      'kent-beck': `// Test-First by Kent Beck - ${codeType}
describe('${codeType}', () => {
  test('should ${requirements.toLowerCase()}', () => {
    const ${codeType.toLowerCase()} = new ${codeType}();
    const input = createTestInput();
    const result = ${codeType.toLowerCase()}.process(input);
    expect(result).toBeDefined();
    expect(result.success).toBe(true);
  });
});

export class ${codeType} {
  process(input: any): ProcessResult {
    // ${requirements}
    return {
      success: true,
      data: this.transform(input),
      message: 'Processed successfully'
    };
  }
}`,

      'jessica-kerr': `// Systems Thinking by Jessica Kerr - ${codeType}
export const create${codeType}Pipeline = (
  logger: Logger,
  metrics: Metrics
) => {
  return (input: ${codeType}Input) => 
    pipe(
      input,
      logStart,
      validateInput,
      processCore,
      logCompletion
    );

  function processCore(input: ${codeType}Input): ${codeType}Output {
    // ${requirements}
    return {
      id: generateId(),
      processedData: transform(input),
      metadata: { processedAt: new Date().toISOString() }
    };
  }
};`,

      'kelsey-hightower': `// Cloud-Native by Kelsey Hightower - ${codeType}
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
      res.status(200).json({ success: true, data: result, traceId });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message, traceId });
    }
  }
}`
    };

    const template = codeTemplates[practitioner] || codeTemplates['uncle-bob'];
    
    return {
      practitioner,
      codeType,
      requirements,
      language,
      generatedCode: template,
      principles: this.getPrinciplesForPractitioner(practitioner),
      usage: `This code follows ${practitioner}'s software engineering principles and best practices for ${requirements}.`
    };
  }

  async coordinateTeamWorkflow(args) {
    const { workflow, teamMembers = [], priority = 'medium' } = args;
    
    const workflows = {
      'feature-development': {
        phases: ['Planning', 'Design', 'Implementation', 'Testing', 'Review', 'Deployment'],
        estimatedDuration: '1-2 weeks',
        tasks: [
          {
            phase: 'Planning',
            assignee: teamMembers[0] || 'Product Owner',
            duration: '1-2 days',
            description: 'Requirements gathering, user story creation'
          },
          {
            phase: 'Implementation',
            assignee: teamMembers[1] || 'Development Team', 
            duration: '5-8 days',
            description: 'Core feature development'
          }
        ]
      },
      'bug-fix': {
        phases: ['Investigation', 'Root Cause', 'Fix', 'Testing', 'Deploy'],
        estimatedDuration: '2-5 days',
        tasks: [
          {
            phase: 'Investigation',
            assignee: teamMembers[0] || 'Developer',
            duration: '2-4 hours',
            description: 'Root cause analysis'
          }
        ]
      }
    };

    const selectedWorkflow = workflows[workflow] || workflows['feature-development'];
    
    return {
      workflow,
      priority,
      team: { size: teamMembers.length, members: teamMembers },
      coordination: selectedWorkflow,
      recommendations: this.getWorkflowRecommendations(workflow, teamMembers.length)
    };
  }

  async analyzeCodeQuality(args) {
    const { code, language = 'javascript', focusAreas = ['clean-code', 'maintainability'] } = args;
    
    const metrics = {
      lines: code.split('\n').length,
      functions: (code.match(/function|=>|def\s+|\w+\s*\(/g) || []).length,
      classes: (code.match(/class\s+\w+/g) || []).length,
      complexity: this.calculateComplexity(code)
    };

    const practitionerAnalysis = {
      'Uncle Bob': this.analyzeWithCleanCode(code, metrics),
      'Martin Fowler': this.analyzeWithRefactoring(code, metrics),
      'Kent Beck': this.analyzeWithTDD(code, metrics),
      'Jessica Kerr': this.analyzeWithSystems(code, metrics),
      'Kelsey Hightower': this.analyzeWithOperational(code, metrics)
    };

    const overallScore = this.calculateOverallScore(metrics, practitionerAnalysis);
    
    return {
      code: code.length > 200 ? code.substring(0, 200) + '...' : code,
      language,
      focusAreas,
      metrics,
      overallScore,
      practitionerPerspectives: practitionerAnalysis,
      recommendations: this.generateRecommendations(metrics, practitionerAnalysis)
    };
  }

  // Helper methods
  getPrinciplesForPractitioner(practitioner) {
    const principles = {
      'uncle-bob': ['Single Responsibility', 'Open/Closed', 'Dependency Inversion'],
      'martin-fowler': ['Domain modeling', 'Enterprise patterns', 'Refactoring'],
      'kent-beck': ['Test-first', 'Simple design', 'Incremental development'],
      'jessica-kerr': ['Functional programming', 'Systems thinking', 'Observability'],
      'kelsey-hightower': ['Cloud-native design', 'Operational excellence', 'Automation']
    };
    return principles[practitioner] || principles['uncle-bob'];
  }

  getWorkflowRecommendations(workflow, teamSize) {
    const base = ['Establish clear communication', 'Set up CI/CD', 'Define done criteria'];
    if (teamSize > 3) base.push('Consider splitting into sub-teams');
    return base;
  }

  calculateComplexity(code) {
    let complexity = 1;
    complexity += (code.match(/if|else|switch|for|while|catch|\?/g) || []).length;
    return Math.min(complexity, 15);
  }

  analyzeWithCleanCode(code, metrics) {
    const issues = [];
    if (metrics.functions === 0) issues.push('No functions detected');
    if (code.includes('var ')) issues.push('Uses \'var\' - prefer \'const\'');
    return { score: Math.max(1, 10 - issues.length), issues: issues.slice(0, 3) };
  }

  analyzeWithRefactoring(code, metrics) {
    const suggestions = [];
    if (metrics.complexity > 8) suggestions.push('High complexity - consider refactoring');
    return { score: Math.max(1, 10 - Math.floor(metrics.complexity / 2)), suggestions };
  }

  analyzeWithTDD(code, metrics) {
    const testPresent = code.includes('test') || code.includes('spec');
    return {
      score: testPresent ? 9 : 3,
      testCoverage: testPresent ? 'Tests present' : 'No tests detected'
    };
  }

  analyzeWithSystems(code, metrics) {
    const hasLogging = code.includes('log') || code.includes('console');
    const hasErrorHandling = code.includes('try') || code.includes('catch');
    return {
      score: (hasLogging ? 3 : 0) + (hasErrorHandling ? 4 : 0) + 3,
      observability: hasLogging ? 'Logging present' : 'Add logging'
    };
  }

  analyzeWithOperational(code, metrics) {
    const hasConfig = code.includes('process.env') || code.includes('config');
    return {
      score: (hasConfig ? 3 : 0) + 4,
      configuration: hasConfig ? 'Environment config detected' : 'Add environment config'
    };
  }

  calculateOverallScore(metrics, practitionerAnalysis) {
    const scores = Object.values(practitionerAnalysis).map(analysis => analysis.score || 5);
    const average = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    return Math.round(average * 10);
  }

  generateRecommendations(metrics, practitionerAnalysis) {
    const recommendations = [];
    if (metrics.complexity > 10) recommendations.push('Reduce complexity');
    if (metrics.functions === 0) recommendations.push('Extract functions');
    return recommendations.slice(0, 5);
  }

  async start() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    
    // Keep the process alive
    process.stdin.resume();
    
    // Handle shutdown gracefully
    process.on('SIGINT', async () => {
      console.error('Shutting down MCP server...');
      await this.server.close();
      process.exit(0);
    });
    
    process.on('SIGTERM', async () => {
      console.error('Shutting down MCP server...');
      await this.server.close();
      process.exit(0);
    });
  }
}

// Start the server
const server = new LocalMCPServer();
server.start().catch(console.error);