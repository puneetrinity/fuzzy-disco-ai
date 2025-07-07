#!/usr/bin/env node

// Standalone MCP server for Claude Desktop integration
// This runs separately from the web API

class SimpleMCPServer {
  constructor() {
    this.tools = [
      {
        name: "select_practitioner_style",
        description: "Auto-select the best practitioner style based on task context",
        inputSchema: {
          type: "object",
          properties: {
            taskType: {
              type: "string",
              description: "Type of task",
              enum: ["feature", "bug-fix", "refactor", "data-processing", "infrastructure"]
            },
            context: {
              type: "string", 
              description: "Additional context about the task"
            },
            teamSize: {
              type: "number",
              description: "Number of team members"
            }
          },
          required: ["taskType"]
        }
      },
      {
        name: "generate_code_with_style",
        description: "Generate code following a specific practitioner's style",
        inputSchema: {
          type: "object",
          properties: {
            practitioner: {
              type: "string",
              description: "Practitioner to emulate",
              enum: ["uncle-bob", "martin-fowler", "kent-beck", "jessica-kerr", "kelsey-hightower"]
            },
            codeType: {
              type: "string",
              description: "Type of code to generate (class, function, etc.)"
            },
            requirements: {
              type: "string",
              description: "Specific requirements for the code"
            },
            language: {
              type: "string",
              description: "Programming language",
              default: "typescript"
            }
          },
          required: ["practitioner", "codeType", "requirements"]
        }
      },
      {
        name: "coordinate_team_workflow",
        description: "Coordinate team workflows and task distribution",
        inputSchema: {
          type: "object",
          properties: {
            workflow: {
              type: "string",
              description: "Type of workflow",
              enum: ["feature-development", "bug-fix", "refactor", "sprint-planning"]
            },
            teamMembers: {
              type: "array",
              items: { type: "string" },
              description: "List of team member names"
            },
            priority: {
              type: "string",
              enum: ["low", "medium", "high", "critical"],
              default: "medium"
            }
          },
          required: ["workflow"]
        }
      },
      {
        name: "analyze_code_quality",
        description: "Analyze code quality using multiple practitioner perspectives",
        inputSchema: {
          type: "object",
          properties: {
            code: {
              type: "string",
              description: "Code to analyze"
            },
            language: {
              type: "string",
              description: "Programming language",
              default: "javascript"
            },
            focusAreas: {
              type: "array",
              items: { type: "string" },
              description: "Areas to focus analysis on",
              default: ["clean-code", "maintainability", "performance"]
            }
          },
          required: ["code"]
        }
      }
    ];
  }

  // Handle incoming MCP messages
  async handleMessage(message) {
    const { id, method, params } = message;

    switch (method) {
      case "initialize":
        return this.handleInitialize(id, params);
      case "tools/list":
        return this.handleListTools(id);
      case "tools/call":
        return await this.handleCallTool(id, params);
      default:
        return this.errorResponse(id, -32601, "Method not found");
    }
  }

  handleInitialize(id, params) {
    return {
      jsonrpc: "2.0",
      id,
      result: {
        protocolVersion: "2024-11-05",
        capabilities: {
          tools: {}
        },
        serverInfo: {
          name: "fuzzy-disco-ai",
          version: "1.0.0"
        }
      }
    };
  }

  handleListTools(id) {
    return {
      jsonrpc: "2.0",
      id,
      result: {
        tools: this.tools
      }
    };
  }

  async handleCallTool(id, params) {
    const { name, arguments: args } = params;

    try {
      let result;
      
      switch (name) {
        case "select_practitioner_style":
          result = await this.selectPractitionerStyle(args);
          break;
        case "generate_code_with_style":
          result = await this.generateCodeWithStyle(args);
          break;
        case "coordinate_team_workflow":
          result = await this.coordinateTeamWorkflow(args);
          break;
        case "analyze_code_quality":
          result = await this.analyzeCodeQuality(args);
          break;
        default:
          throw new Error(`Unknown tool: ${name}`);
      }

      return {
        jsonrpc: "2.0",
        id,
        result: {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2)
            }
          ]
        }
      };
    } catch (error) {
      return this.errorResponse(id, -32000, error.message);
    }
  }

  async selectPractitionerStyle(args) {
    const { taskType, context, teamSize } = args;
    
    const recommendations = {
      "feature": {
        practitioner: "Martin Fowler",
        reasoning: "Enterprise patterns and refactoring expertise for feature development",
        principles: ["Domain modeling", "Enterprise patterns", "Evolutionary architecture"],
        approach: "Start with domain modeling, use enterprise patterns, focus on maintainable architecture"
      },
      "bug-fix": {
        practitioner: "Uncle Bob (Robert Martin)",
        reasoning: "Clean code principles ensure maintainable and robust bug fixes",
        principles: ["Clean code", "SOLID principles", "Test-driven development"],
        approach: "Write tests first, fix the root cause, refactor for clarity"
      },
      "refactor": {
        practitioner: "Kent Beck",
        reasoning: "Incremental improvement and test-first approach for safe refactoring",
        principles: ["Small steps", "Test-first", "Simple design"],
        approach: "Make small changes, keep tests green, improve design incrementally"
      },
      "data-processing": {
        practitioner: "Jessica Kerr",
        reasoning: "Systems thinking and functional programming for robust data processing",
        principles: ["Functional programming", "Systems thinking", "Observability"],
        approach: "Use immutable data, compose functions, add comprehensive monitoring"
      },
      "infrastructure": {
        practitioner: "Kelsey Hightower",
        reasoning: "Cloud-native expertise for scalable and reliable infrastructure",
        principles: ["Cloud-native design", "Operational excellence", "Automation"],
        approach: "Design for cloud, automate everything, monitor and observe"
      }
    };

    const recommendation = recommendations[taskType] || recommendations["feature"];
    
    return {
      task: {
        type: taskType,
        context: context || "No additional context provided",
        teamSize: teamSize || 1
      },
      recommendation,
      teamGuidance: teamSize > 1 
        ? "Foster pair programming, conduct thorough code reviews, ensure knowledge sharing"
        : "Focus on clear documentation and self-explaining code"
    };
  }

  async generateCodeWithStyle(args) {
    const { practitioner, codeType, requirements, language = "typescript" } = args;

    const codeTemplates = {
      "uncle-bob": `// Clean Code by Uncle Bob - ${codeType}
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
    // Following single responsibility principle
    return this.executeBusinessLogic(request);
  }

  private executeBusinessLogic(request: ${codeType}Request): ProcessResult {
    // Implementation of: ${requirements}
    return { success: true, data: request };
  }

  private formatResponse(result: ProcessResult): ${codeType}Response {
    return {
      timestamp: new Date().toISOString(),
      success: result.success,
      data: result.data
    };
  }

  private validateDependencies(deps: Dependencies): void {
    if (!deps) {
      throw new Error('Dependencies are required');
    }
  }
}`,

      "martin-fowler": `// Enterprise Patterns by Martin Fowler - ${codeType}
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
}

// Repository Pattern
export interface ${codeType}Repository {
  findById(id: string): Promise<${codeType}Aggregate>;
  save(aggregate: ${codeType}Aggregate): Promise<void>;
}

// Domain Event
export class ${codeType}ProcessedEvent {
  constructor(
    public readonly result: ${codeType}Result,
    public readonly timestamp: Date = new Date()
  ) {}
}`,

      "kent-beck": `// Test-First by Kent Beck - ${codeType}
// 1. Write the test first
describe('${codeType}', () => {
  test('should ${requirements.toLowerCase()}', () => {
    // Arrange
    const ${codeType.toLowerCase()} = new ${codeType}();
    const input = createTestInput();
    
    // Act
    const result = ${codeType.toLowerCase()}.process(input);
    
    // Assert
    expect(result).toBeDefined();
    expect(result.success).toBe(true);
    verifyRequirements(result);
  });

  function createTestInput() {
    return { /* minimal test data */ };
  }

  function verifyRequirements(result) {
    // Verify: ${requirements}
    expect(result.data).toBeTruthy();
  }
});

// 2. Make it pass with simplest implementation
export class ${codeType} {
  process(input: any): ProcessResult {
    // ${requirements}
    // Simplest thing that could possibly work
    return {
      success: true,
      data: this.transform(input),
      message: 'Processed successfully'
    };
  }

  private transform(input: any): any {
    // Core transformation logic
    return { ...input, processed: true };
  }
}`,

      "jessica-kerr": `// Systems Thinking by Jessica Kerr - ${codeType}
// Functional composition with observability

export const create${codeType}Pipeline = (
  logger: Logger,
  metrics: Metrics,
  config: Config
) => {
  return (input: ${codeType}Input) => 
    pipe(
      input,
      logStart,
      validateInput,
      processCore,
      logCompletion,
      measureSuccess
    );

  function logStart(input: ${codeType}Input): ${codeType}Input {
    logger.info('Starting ${codeType.toLowerCase()} process', { 
      inputSize: JSON.stringify(input).length,
      timestamp: new Date().toISOString()
    });
    metrics.increment('${codeType.toLowerCase()}.started');
    return input;
  }

  function validateInput(input: ${codeType}Input): ${codeType}Input {
    if (!input) {
      const error = new Error('Input validation failed');
      logger.error('Validation failed', { error });
      metrics.increment('${codeType.toLowerCase()}.validation_failed');
      throw error;
    }
    return input;
  }

  function processCore(input: ${codeType}Input): ${codeType}Output {
    // ${requirements}
    const startTime = Date.now();
    
    try {
      const result = {
        id: generateId(),
        processedData: transform(input),
        metadata: {
          processedAt: new Date().toISOString(),
          version: '1.0.0'
        }
      };
      
      metrics.timing('${codeType.toLowerCase()}.processing_time', Date.now() - startTime);
      return result;
    } catch (error) {
      metrics.increment('${codeType.toLowerCase()}.processing_failed');
      throw error;
    }
  }

  function logCompletion(output: ${codeType}Output): ${codeType}Output {
    logger.info('Process completed', { 
      outputId: output.id,
      processingTime: output.metadata.processedAt
    });
    return output;
  }

  function measureSuccess(output: ${codeType}Output): ${codeType}Output {
    metrics.increment('${codeType.toLowerCase()}.completed');
    return output;
  }

  function transform(input: ${codeType}Input): any {
    // Pure transformation logic
    return { ...input, transformed: true };
  }

  function generateId(): string {
    return Math.random().toString(36).substring(2, 15);
  }
};

// Compose higher-order functions
const pipe = (...fns: Function[]) => (value: any) => 
  fns.reduce((acc, fn) => fn(acc), value);`,

      "kelsey-hightower": `// Cloud-Native by Kelsey Hightower - ${codeType}
import { Request, Response } from 'express';
import { Logger } from './logger';
import { Metrics } from './metrics';

export class ${codeType}Service {
  private readonly config = {
    timeout: parseInt(process.env.TIMEOUT || '5000'),
    retries: parseInt(process.env.RETRIES || '3'),
    serviceName: process.env.SERVICE_NAME || '${codeType.toLowerCase()}-service',
    version: process.env.VERSION || '1.0.0'
  };

  constructor(
    private readonly logger: Logger,
    private readonly metrics: Metrics
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    const traceId = req.headers['x-trace-id'] as string || this.generateTraceId();
    const startTime = Date.now();

    this.logger.info('Processing request', { 
      traceId, 
      service: this.config.serviceName,
      endpoint: req.path 
    });

    try {
      // ${requirements}
      const result = await this.processWithRetry(req.body, traceId);
      
      this.metrics.timing('request.duration', Date.now() - startTime);
      this.metrics.increment('request.success');
      
      res.status(200).json({
        success: true,
        data: result,
        metadata: {
          traceId,
          service: this.config.serviceName,
          version: this.config.version,
          timestamp: new Date().toISOString()
        }
      });
    } catch (error) {
      this.metrics.increment('request.error');
      this.logger.error('Request failed', { traceId, error: error.message });
      
      res.status(500).json({
        success: false,
        error: {
          message: error.message,
          code: 'PROCESSING_ERROR'
        },
        metadata: {
          traceId,
          service: this.config.serviceName
        }
      });
    }
  }

  private async processWithRetry(data: any, traceId: string): Promise<any> {
    let attempt = 0;
    
    while (attempt < this.config.retries) {
      try {
        return await Promise.race([
          this.processData(data, traceId),
          this.timeoutPromise()
        ]);
      } catch (error) {
        attempt++;
        this.logger.warn('Retry attempt', { traceId, attempt, error: error.message });
        
        if (attempt === this.config.retries) {
          throw error;
        }
        
        await this.delay(Math.pow(2, attempt) * 1000); // Exponential backoff
      }
    }
  }

  private async processData(data: any, traceId: string): Promise<any> {
    // Core processing logic: ${requirements}
    this.logger.debug('Processing data', { traceId, dataSize: JSON.stringify(data).length });
    
    return {
      result: 'processed',
      data: { ...data, processedBy: this.config.serviceName },
      traceId
    };
  }

  private timeoutPromise(): Promise<never> {
    return new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Request timeout')), this.config.timeout)
    );
  }

  private generateTraceId(): string {
    return \`\${Date.now()}-\${Math.random().toString(36).substring(2, 15)}\`;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Health check endpoint
  health(): { status: string; service: string; uptime: number } {
    return {
      status: 'healthy',
      service: this.config.serviceName,
      uptime: process.uptime()
    };
  }
}`
    };

    const template = codeTemplates[practitioner] || codeTemplates["uncle-bob"];
    
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
    const { workflow, teamMembers = [], priority = "medium" } = args;
    
    const workflows = {
      "feature-development": {
        phases: ["Planning", "Design", "Implementation", "Testing", "Review", "Deployment"],
        estimatedDuration: "1-2 weeks",
        tasks: [
          {
            phase: "Planning",
            assignee: teamMembers[0] || "Product Owner",
            duration: "1-2 days",
            description: "Requirements gathering, user story creation, acceptance criteria"
          },
          {
            phase: "Design", 
            assignee: teamMembers[1] || "Tech Lead",
            duration: "2-3 days",
            description: "System design, API contracts, database schema, architecture decisions"
          },
          {
            phase: "Implementation",
            assignee: teamMembers[2] || "Development Team",
            duration: "5-8 days",
            description: "Core feature development, following chosen practitioner principles"
          },
          {
            phase: "Testing",
            assignee: teamMembers[3] || "QA Engineer",
            duration: "2-3 days", 
            description: "Unit tests, integration tests, end-to-end testing"
          },
          {
            phase: "Review",
            assignee: "Entire Team",
            duration: "1 day",
            description: "Code review, documentation review, security review"
          },
          {
            phase: "Deployment",
            assignee: teamMembers[1] || "DevOps Engineer",
            duration: "0.5-1 day",
            description: "Production deployment, monitoring setup, rollback preparation"
          }
        ]
      },
      "bug-fix": {
        phases: ["Investigation", "Root Cause", "Fix", "Testing", "Deploy"],
        estimatedDuration: "2-5 days",
        tasks: [
          {
            phase: "Investigation",
            assignee: teamMembers[0] || "Developer",
            duration: "2-4 hours",
            description: "Reproduce issue, gather logs, understand scope and impact"
          },
          {
            phase: "Root Cause",
            assignee: teamMembers[0] || "Developer", 
            duration: "2-6 hours",
            description: "Deep analysis, identify root cause, plan fix approach"
          },
          {
            phase: "Fix",
            assignee: teamMembers[0] || "Developer",
            duration: "4-16 hours",
            description: "Implement fix, add regression tests, update documentation"
          },
          {
            phase: "Testing",
            assignee: teamMembers[1] || "QA Engineer",
            duration: "2-4 hours",
            description: "Verify fix, run regression tests, test edge cases"
          },
          {
            phase: "Deploy",
            assignee: teamMembers[1] || "DevOps",
            duration: "1-2 hours",
            description: "Deploy fix, monitor for issues, communicate resolution"
          }
        ]
      }
    };

    const selectedWorkflow = workflows[workflow] || workflows["feature-development"];
    
    return {
      workflow,
      priority,
      team: {
        size: teamMembers.length,
        members: teamMembers
      },
      coordination: selectedWorkflow,
      recommendations: this.getWorkflowRecommendations(workflow, teamMembers.length),
      riskFactors: this.assessRiskFactors(workflow, priority, teamMembers.length),
      nextSteps: [
        "Assign team members to phases",
        "Set up communication channels", 
        "Schedule regular check-ins",
        "Prepare development environment"
      ]
    };
  }

  async analyzeCodeQuality(args) {
    const { code, language = "javascript", focusAreas = ["clean-code", "maintainability"] } = args;
    
    // Simple code analysis metrics
    const metrics = {
      lines: code.split('\n').length,
      functions: (code.match(/function|=>|def\s+|\w+\s*\(/g) || []).length,
      classes: (code.match(/class\s+\w+/g) || []).length,
      complexity: this.calculateComplexity(code),
      testCoverage: code.includes('test') || code.includes('spec') ? 'Present' : 'Missing'
    };

    const practitionerAnalysis = {
      "Uncle Bob": this.analyzeWithCleanCode(code, metrics),
      "Martin Fowler": this.analyzeWithRefactoring(code, metrics),
      "Kent Beck": this.analyzeWithTDD(code, metrics), 
      "Jessica Kerr": this.analyzeWithSystems(code, metrics),
      "Kelsey Hightower": this.analyzeWithOperational(code, metrics)
    };

    const overallScore = this.calculateOverallScore(metrics, practitionerAnalysis);
    
    return {
      code: code.length > 200 ? code.substring(0, 200) + "..." : code,
      language,
      focusAreas,
      metrics,
      overallScore,
      practitionerPerspectives: practitionerAnalysis,
      recommendations: this.generateRecommendations(metrics, practitionerAnalysis),
      actionItems: this.generateActionItems(overallScore, metrics)
    };
  }

  // Helper methods
  getPrinciplesForPractitioner(practitioner) {
    const principles = {
      "uncle-bob": ["Single Responsibility", "Open/Closed", "Liskov Substitution", "Interface Segregation", "Dependency Inversion"],
      "martin-fowler": ["Domain modeling", "Enterprise patterns", "Refactoring", "Evolutionary architecture"],
      "kent-beck": ["Test-first", "Simple design", "Incremental development", "Refactor mercilessly"],
      "jessica-kerr": ["Functional programming", "Systems thinking", "Observability", "Composition"],
      "kelsey-hightower": ["Cloud-native design", "Operational excellence", "Automation", "Monitoring"]
    };
    return principles[practitioner] || principles["uncle-bob"];
  }

  getWorkflowRecommendations(workflow, teamSize) {
    const base = [
      "Establish clear communication channels",
      "Set up continuous integration",
      "Define done criteria",
      "Plan regular retrospectives"
    ];

    if (teamSize > 3) {
      base.push("Consider splitting into smaller sub-teams", "Implement more frequent standups");
    }

    if (workflow === "feature-development") {
      base.push("Use feature flags for safe deployment", "Plan A/B testing strategy");
    }

    return base;
  }

  assessRiskFactors(workflow, priority, teamSize) {
    const risks = [];
    
    if (priority === "critical" && teamSize < 3) {
      risks.push("High priority with small team - consider adding resources");
    }
    
    if (teamSize > 5) {
      risks.push("Large team size may lead to coordination challenges");
    }
    
    if (workflow === "bug-fix" && priority === "critical") {
      risks.push("Critical bug fix requires immediate attention and testing");
    }
    
    return risks.length > 0 ? risks : ["Low risk - team size and priority are well balanced"];
  }

  calculateComplexity(code) {
    let complexity = 1;
    
    // Count decision points
    complexity += (code.match(/if|else|switch|case|for|while|catch|\?/g) || []).length;
    complexity += (code.match(/&&|\|\|/g) || []).length;
    
    return Math.min(complexity, 15); // Cap at 15
  }

  analyzeWithCleanCode(code, metrics) {
    const issues = [];
    const strengths = [];
    
    if (metrics.functions === 0) issues.push("No functions detected - consider better structure");
    if (code.includes("var ")) issues.push("Uses 'var' - prefer 'const' or 'let'");
    if (code.length > 500 && metrics.functions < 3) issues.push("Large code block - consider extracting functions");
    
    if (code.includes("const ")) strengths.push("Uses const declarations");
    if (code.includes("// ")) strengths.push("Contains comments");
    
    return {
      score: Math.max(1, 10 - issues.length + strengths.length),
      issues: issues.slice(0, 3),
      strengths: strengths.slice(0, 3),
      focus: "Clean naming, small functions, clear responsibilities"
    };
  }

  analyzeWithRefactoring(code, metrics) {
    const suggestions = [];
    
    if (metrics.complexity > 8) suggestions.push("High complexity - consider Extract Method refactoring");
    if (code.includes("switch")) suggestions.push("Switch statement detected - consider Replace Conditional with Polymorphism");
    if (metrics.functions > 10) suggestions.push("Many functions - consider organizing into classes or modules");
    
    return {
      score: Math.max(1, 10 - Math.floor(metrics.complexity / 2)),
      suggestions: suggestions.slice(0, 3),
      focus: "Extracting methods, reducing complexity, improving design"
    };
  }

  analyzeWithTDD(code, metrics) {
    const testPresent = code.includes('test') || code.includes('spec') || code.includes('describe');
    
    return {
      score: testPresent ? 9 : 3,
      testCoverage: testPresent ? "Tests present" : "No tests detected",
      recommendations: testPresent 
        ? ["Ensure all edge cases are tested", "Consider property-based testing"]
        : ["Add unit tests", "Practice test-first development", "Start with simple test cases"],
      focus: "Test coverage, test-first development, simple design"
    };
  }

  analyzeWithSystems(code, metrics) {
    const hasLogging = code.includes('log') || code.includes('console');
    const hasErrorHandling = code.includes('try') || code.includes('catch') || code.includes('throw');
    
    return {
      score: (hasLogging ? 3 : 0) + (hasErrorHandling ? 4 : 0) + 3,
      observability: hasLogging ? "Logging present" : "Add logging for observability",
      resilience: hasErrorHandling ? "Error handling present" : "Add error handling",
      focus: "Observability, error handling, system boundaries"
    };
  }

  analyzeWithOperational(code, metrics) {
    const hasConfig = code.includes('process.env') || code.includes('config');
    const hasHealth = code.includes('health') || code.includes('/health');
    
    return {
      score: (hasConfig ? 3 : 0) + (hasHealth ? 3 : 0) + 4,
      configuration: hasConfig ? "Environment configuration detected" : "Add environment configuration",
      monitoring: hasHealth ? "Health check present" : "Add health check endpoint",
      focus: "Configuration management, health checks, operational readiness"
    };
  }

  calculateOverallScore(metrics, practitionerAnalysis) {
    const scores = Object.values(practitionerAnalysis).map(analysis => analysis.score || 5);
    const average = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    return Math.round(average * 10); // Convert to percentage
  }

  generateRecommendations(metrics, practitionerAnalysis) {
    const recommendations = [];
    
    if (metrics.complexity > 10) recommendations.push("Reduce cyclomatic complexity");
    if (metrics.testCoverage === 'Missing') recommendations.push("Add comprehensive unit tests");
    if (metrics.functions === 0) recommendations.push("Extract reusable functions");
    
    return recommendations.slice(0, 5);
  }

  generateActionItems(score, metrics) {
    if (score > 80) return ["Code quality is excellent", "Consider adding performance optimizations"];
    if (score > 60) return ["Good foundation", "Focus on test coverage", "Add error handling"];
    return ["Significant improvements needed", "Start with unit tests", "Refactor for clarity", "Add documentation"];
  }

  errorResponse(id, code, message) {
    return {
      jsonrpc: "2.0",
      id,
      error: {
        code,
        message
      }
    };
  }
}

// Simple stdio handling for MCP protocol
class StdioHandler {
  constructor() {
    this.server = new SimpleMCPServer();
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', (data) => {
      this.handleInput(data);
    });
  }

  async handleInput(data) {
    const lines = data.trim().split('\n');
    
    for (const line of lines) {
      if (line.trim()) {
        try {
          const message = JSON.parse(line);
          const response = await this.server.handleMessage(message);
          console.log(JSON.stringify(response));
        } catch (error) {
          console.log(JSON.stringify({
            jsonrpc: "2.0",
            id: null,
            error: {
              code: -32700,
              message: "Parse error: " + error.message
            }
          }));
        }
      }
    }
  }
}

// Start the MCP server
if (import.meta.url === `file://${process.argv[1]}`) {
  new StdioHandler();
  console.error("MCP Server started - ready for Claude Desktop integration");
}

export { SimpleMCPServer };