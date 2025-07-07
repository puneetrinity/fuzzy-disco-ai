# 🚀 Developer Onboarding & Contribution Guide

Welcome to the **AI-Enhanced Engineering Workflow** project! This guide will help you get started as a contributor and understand how to work effectively with our AI-powered development environment.

## 🎯 Project Overview

This project creates a world-class AI-enhanced engineering workflow that combines:
- **Model Context Protocol (MCP) servers** for intelligent AI assistance
- **Multi-practitioner style guides** from industry masters (Martin Fowler, Uncle Bob, Kent Beck, Jessica Kerr, Kelsey Hightower)
- **Intelligent auto-style selection** based on task context
- **Team coordination workflows** for collaborative development
- **Claude Code integration** with automated quality assurance

## 🏃‍♂️ Quick Start (5 Minutes)

### 1. Environment Setup
```bash
# Clone the repository
git clone <repository-url>
cd ai-enhanced-workflow

# Install dependencies
npm install

# Build the project
npm run build

# Test everything works
node demo.js
```

### 2. Verify Your Setup
```bash
# Run the getting started guide
node getting-started.js

# Test Claude Code integration
node claude-code-demo.js

# Run the practical examples
node practical-example.js
```

### 3. Start the Development Environment
```bash
# Start development mode (watches for changes)
npm run dev

# In another terminal, start the MCP server
node mcp-server.js
```

## 🛠️ Development Environment

### Required Tools
- **Node.js** (v18+)
- **TypeScript** (v5+)
- **VS Code** (recommended)
- **Git**

### Optional but Recommended
- **Claude Code** extension for VS Code
- **Docker** for containerized development
- **Kubernetes** for deployment testing

### VS Code Extensions
```bash
# Install recommended extensions
code --install-extension ms-vscode.vscode-typescript-next
code --install-extension esbenp.prettier-vscode
code --install-extension ms-vscode.vscode-eslint
```

## 📁 Project Structure

```
ai-enhanced-workflow/
├── 🤖 .claude/                # Claude Code configuration
│   ├── commands/              # Custom AI commands
│   ├── rules/                 # Practitioner style guides
│   ├── context/               # Team coordination files
│   └── mcp/                   # MCP server configs
├── 🔧 .vscode/                # VS Code settings and tasks
├── 🚀 .github/                # GitHub workflows and instructions
│   └── workflows/             # CI/CD pipelines
├── 📦 src/                    # Source code
│   ├── mcp-servers/          # MCP server implementations
│   ├── workflow/             # Workflow engine
│   ├── styles/               # Practitioner styles
│   └── team/                 # Team coordination
├── 🏗️ dist/                  # Compiled JavaScript
├── 📚 docs/                  # Documentation
└── 🧪 tests/                 # Test suites
```

## 🎨 Understanding Practitioner Styles

Our system automatically selects the appropriate style based on your task:

### 🎯 When Each Style is Applied

| Task Type | Style | Leader | Approach |
|-----------|-------|--------|----------|
| **New Features** | Clean Code | Uncle Bob | SOLID principles, clean interfaces |
| **Bug Fixes** | TDD | Kent Beck | Test-first, minimal fixes |
| **Refactoring** | Evolutionary Design | Martin Fowler | Incremental improvements |
| **Data Processing** | Functional | Jessica Kerr | Pure functions, immutable data |
| **Cloud Deployment** | Cloud-Native | Kelsey Hightower | Infrastructure as code |

### 📚 Style Guide References
- **Uncle Bob**: `.claude/rules/uncle-bob-style.md`
- **Kent Beck**: `.claude/rules/kent-beck-style.md`
- **Martin Fowler**: `.claude/rules/fowler-style.md`
- **Jessica Kerr**: `.claude/rules/jessica-kerr-style.md`
- **Kelsey Hightower**: `.claude/rules/kelsey-style.md`

## 🤝 Contributing Guidelines

### 🔄 Development Workflow

1. **Choose Your Task Type**
   - New feature → Uncle Bob style
   - Bug fix → Kent Beck style
   - Refactoring → Fowler style
   - Data processing → Jessica Kerr style
   - Deployment → Kelsey style

2. **Follow the Style Guide**
   - Read the relevant style guide in `.claude/rules/`
   - Apply the principles consistently
   - Use the auto-style selection when available

3. **Write Tests**
   - Follow TDD for bug fixes
   - Add comprehensive tests for new features
   - Ensure 90%+ test coverage

4. **Use AI Assistance**
   - Let Claude Code apply the appropriate style
   - Review and understand the generated code
   - Customize based on specific requirements

### 📋 Code Standards

#### TypeScript/JavaScript
```typescript
// ✅ Good: Clean, SOLID principles
class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly logger: Logger
  ) {}

  async createUser(userData: CreateUserRequest): Promise<User> {
    this.logger.info('Creating user', { email: userData.email });
    return this.userRepository.save(userData);
  }
}

// ❌ Avoid: Tight coupling, no dependency injection
class UserService {
  async createUser(userData: any) {
    console.log('Creating user'); // Use proper logging
    const db = new Database(); // Inject dependencies
    return db.save(userData);
  }
}
```

#### Testing
```typescript
// ✅ Good: Comprehensive, focused tests
describe('UserService', () => {
  let userService: UserService;
  let mockRepository: jest.Mocked<UserRepository>;

  beforeEach(() => {
    mockRepository = createMockRepository();
    userService = new UserService(mockRepository, mockLogger);
  });

  it('should create user with valid data', async () => {
    // Given
    const userData = { email: 'test@example.com', name: 'Test User' };
    mockRepository.save.mockResolvedValue(userData);

    // When
    const result = await userService.createUser(userData);

    // Then
    expect(result).toEqual(userData);
    expect(mockRepository.save).toHaveBeenCalledWith(userData);
  });
});
```

### 🌿 Branch Strategy

```bash
# Main branches
main          # Production-ready code
develop       # Integration branch
feature/*     # New features
bugfix/*      # Bug fixes
refactor/*    # Refactoring work
docs/*        # Documentation updates
```

### 📝 Commit Messages

Follow conventional commits:
```bash
# Format: <type>(<scope>): <description>
feat(auth): implement user authentication with Uncle Bob style
fix(payment): resolve 500 error in payment processing (TDD approach)
refactor(user): extract UserService methods following Fowler patterns
docs(onboarding): add developer contribution guide
test(auth): add comprehensive authentication tests
```

## 🧪 Testing Strategy

### Test Types
- **Unit Tests**: Individual function/class testing
- **Integration Tests**: Component interaction testing
- **End-to-End Tests**: Full workflow testing
- **Style Compliance Tests**: Verify practitioner style adherence

### Running Tests
```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run specific test file
npm test -- user.test.ts

# Run in watch mode
npm run test:watch
```

### Test Structure
```typescript
// Arrange-Act-Assert pattern
describe('FeatureName', () => {
  describe('when condition', () => {
    it('should expected behavior', () => {
      // Arrange (Given)
      const input = createTestInput();
      
      // Act (When)
      const result = systemUnderTest.method(input);
      
      // Assert (Then)
      expect(result).toBe(expectedOutput);
    });
  });
});
```

## 🤖 Working with Claude Code

### Integration Setup
1. **Install Claude Code** extension in VS Code
2. **Configure MCP server** (see `CLAUDE-CODE-INTEGRATION.md`)
3. **Start MCP server**: `node mcp-server.js`
4. **Begin AI-assisted development**

### Best Practices
```typescript
// ✅ Good: Specific task description
"I need to implement user authentication (new feature)"
// Claude Code applies Uncle Bob (Clean Code) style

// ✅ Good: Bug fix context
"Users can't login, getting 500 error (bug fix)"
// Claude Code applies Kent Beck (TDD) style

// ✅ Good: Refactoring request
"This code is complex and needs refactoring"
// Claude Code applies Martin Fowler (Refactoring) style
```

## 🔧 Build and Deployment

### Local Development
```bash
# Build TypeScript
npm run build

# Development mode (watch)
npm run dev

# Lint code
npm run lint

# Format code
npm run format
```

### CI/CD Pipeline
Our GitHub Actions workflow (`.github/workflows/ci-cd.yml`) automatically:
- Runs tests on multiple Node.js versions
- Performs code quality checks
- Builds and packages the application
- Deploys to staging/production environments

### Deployment
```bash
# Production build
npm run build

# Run production server
npm start

# Docker deployment
docker build -t ai-workflow .
docker run -p 3000:3000 ai-workflow
```

## 📊 Quality Assurance

### Code Quality Metrics
- **Test Coverage**: 90%+ required
- **Code Complexity**: Keep cyclomatic complexity < 10
- **Type Safety**: 100% TypeScript coverage
- **Linting**: Zero ESLint errors
- **Style Compliance**: Follow practitioner guidelines

### Quality Gates
```bash
# Before committing
npm run lint          # Check code style
npm test             # Run all tests
npm run build        # Verify builds
npm run type-check   # Check TypeScript
```

## 🎓 Learning Resources

### Understanding the Practitioner Styles
- **Uncle Bob**: "Clean Code" book, SOLID principles
- **Kent Beck**: "Test-Driven Development" book
- **Martin Fowler**: "Refactoring" book, fowler.com
- **Jessica Kerr**: Functional programming principles
- **Kelsey Hightower**: Cloud-native architecture

### Project-Specific Resources
- **`HOW-TO-USE.md`**: Complete usage guide
- **`CLAUDE-CODE-EXAMPLES.md`**: Practical examples
- **`PROJECT-STATUS.md`**: Current features and roadmap
- **`.claude/rules/`**: Detailed style guides

## 🐛 Troubleshooting

### Common Issues

#### Build Errors
```bash
# Clear and rebuild
rm -rf dist node_modules
npm install
npm run build
```

#### MCP Server Issues
```bash
# Check server status
node mcp-server.js

# Verify configuration
cat .vscode/mcp.json
```

#### Test Failures
```bash
# Run specific test
npm test -- --testNamePattern="specific test"

# Debug test
npm run test:debug
```

### Getting Help
- **Check existing issues** in GitHub
- **Read the documentation** in the project
- **Ask questions** in team channels
- **Create detailed bug reports** with reproduction steps

## 🎯 Contribution Checklist

Before submitting a PR:
- [ ] **Tests pass**: `npm test`
- [ ] **Code builds**: `npm run build`
- [ ] **Linting passes**: `npm run lint`
- [ ] **Documentation updated** (if needed)
- [ ] **Style guide followed** (appropriate practitioner style)
- [ ] **Commit messages follow** conventional format
- [ ] **Branch follows** naming convention
- [ ] **PR description** explains changes and reasoning

## 🌟 Advanced Contributors

### Extending the System
- **Add new practitioner styles**: Follow existing patterns in `.claude/rules/`
- **Enhance MCP server**: Add new tools in `src/mcp-servers/`
- **Improve style selection**: Update logic in `src/styles/`
- **Add team features**: Extend `src/team/` modules

### Architecture Decisions
- **Follow established patterns**: Study existing implementations
- **Maintain consistency**: Use similar structures and naming
- **Document decisions**: Add ADRs for significant changes
- **Consider team impact**: Think about other developers

## 🎉 Welcome to the Team!

You're now ready to contribute to our AI-Enhanced Engineering Workflow! This system combines decades of software engineering wisdom with cutting-edge AI capabilities to create an exceptional development experience.

### Next Steps
1. **Set up your environment** using the quick start guide
2. **Explore the codebase** to understand the architecture
3. **Try the examples** to see the system in action
4. **Pick your first issue** and start contributing
5. **Join our community** and help improve the workflow

Remember: The goal is to create code that embodies the wisdom of master practitioners while leveraging AI to boost productivity and maintain quality.

**Happy coding, and welcome to the future of software engineering! 🚀**

---

*Built with ❤️ by the AI-Enhanced Engineering Team*
*Powered by Claude Code, MCP, and decades of software engineering wisdom*
