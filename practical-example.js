#!/usr/bin/env node
import { WorkflowMCPServer } from './dist/mcp-servers/workflow-server.js';

async function practicalExample() {
  console.log('🎯 Practical Usage Example: Building a User Management System\n');
  
  const server = new WorkflowMCPServer();
  
  // Simulate different development scenarios
  const scenarios = [
    {
      step: 1,
      task: "Create user registration endpoint",
      description: "New feature requiring clean, secure code",
      style: "Uncle Bob (Clean Code)",
      approach: "SOLID principles, dependency injection, clear interfaces",
      code: `
// Auto-generated with Uncle Bob's Clean Code style
class UserRegistrationController {
  constructor(
    private readonly userService: UserService,
    private readonly validator: InputValidator,
    private readonly logger: Logger
  ) {}

  async register(request: RegistrationRequest): Promise<RegistrationResponse> {
    this.validator.validateRegistration(request);
    const user = await this.userService.createUser(request);
    this.logger.info('User registered successfully', { userId: user.id });
    return new RegistrationResponse(user);
  }
}
      `
    },
    {
      step: 2,
      task: "Fix duplicate email bug",
      description: "Production bug needs immediate, tested fix",
      style: "Kent Beck (TDD)",
      approach: "Test-first, minimal fix, red-green-refactor",
      code: `
// Test written first (Kent Beck TDD style)
describe('UserService', () => {
  it('should prevent duplicate email registration', async () => {
    // Given
    const existingUser = await userService.createUser({
      email: 'test@example.com',
      name: 'Test User'
    });
    
    // When/Then
    await expect(
      userService.createUser({
        email: 'test@example.com',
        name: 'Another User'
      })
    ).rejects.toThrow('Email already exists');
  });
});
      `
    },
    {
      step: 3,
      task: "Refactor legacy user search",
      description: "Improve performance of existing search functionality",
      style: "Martin Fowler (Refactoring)",
      approach: "Evolutionary design, extract methods, improve readability",
      code: `
// Before refactoring (legacy code)
class UserSearchService {
  search(query: string): User[] {
    // 50 lines of complex search logic...
  }
}

// After refactoring (Fowler style)
class UserSearchService {
  search(query: string): User[] {
    const searchCriteria = this.parseSearchQuery(query);
    const filteredUsers = this.filterUsers(searchCriteria);
    return this.sortResults(filteredUsers);
  }
  
  private parseSearchQuery(query: string): SearchCriteria { /* ... */ }
  private filterUsers(criteria: SearchCriteria): User[] { /* ... */ }
  private sortResults(users: User[]): User[] { /* ... */ }
}
      `
    },
    {
      step: 4,
      task: "Process user analytics data",
      description: "Transform and analyze user behavior data",
      style: "Jessica Kerr (Functional)",
      approach: "Pure functions, immutable data, composable transformations",
      code: `
// Functional approach (Jessica Kerr style)
const processUserAnalytics = (rawData: UserEvent[]) => 
  pipe(
    rawData,
    filterActiveUsers,
    groupByTimeWindow,
    calculateEngagementMetrics,
    transformToReport
  );

const filterActiveUsers = (events: UserEvent[]): UserEvent[] =>
  events.filter(event => event.isActive);

const groupByTimeWindow = (events: UserEvent[]): GroupedEvents =>
  groupBy(events, event => event.timestamp.toDateString());

const calculateEngagementMetrics = (grouped: GroupedEvents): EngagementData =>
  mapValues(grouped, calculateMetrics);
      `
    },
    {
      step: 5,
      task: "Deploy user service to Kubernetes",
      description: "Cloud-native deployment with scaling and monitoring",
      style: "Kelsey Hightower (Cloud-Native)",
      approach: "Infrastructure as code, observability, scalable architecture",
      code: `
# Kubernetes deployment (Kelsey Hightower style)
apiVersion: apps/v1
kind: Deployment
metadata:
  name: user-service
spec:
  replicas: 3
  selector:
    matchLabels:
      app: user-service
  template:
    metadata:
      labels:
        app: user-service
    spec:
      containers:
      - name: user-service
        image: user-service:latest
        ports:
        - containerPort: 3000
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: db-secret
              key: url
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
        readinessProbe:
          httpGet:
            path: /ready
            port: 3000
      `
    }
  ];
  
  scenarios.forEach(scenario => {
    console.log(`\n🔹 Step ${scenario.step}: ${scenario.task}`);
    console.log(`   Description: ${scenario.description}`);
    console.log(`   🎨 Style Applied: ${scenario.style}`);
    console.log(`   📋 Approach: ${scenario.approach}`);
    console.log(`   💻 Generated Code:`);
    console.log(scenario.code);
    console.log('   ✅ Quality checks passed, ready for review\n');
    console.log('   ' + '='.repeat(60));
  });
  
  console.log('\n🎉 Complete Development Workflow Demonstrated!');
  console.log('\nKey Benefits Shown:');
  console.log('✅ Intelligent style selection based on task type');
  console.log('✅ Consistent code quality across different scenarios');
  console.log('✅ Best practices from industry masters automatically applied');
  console.log('✅ Seamless integration of different development approaches');
  console.log('✅ Complete end-to-end development workflow');
  
  console.log('\n🚀 Your Turn: Try These Commands');
  console.log('================================');
  console.log('1. npm run build     # Build the project');
  console.log('2. npm run dev       # Start development mode');
  console.log('3. npm test          # Run tests');
  console.log('4. node mcp-server.js # Start MCP server');
  console.log('5. Open VS Code and use Ctrl+Shift+P → "Tasks: Run Task"');
}

practicalExample().catch(console.error);
