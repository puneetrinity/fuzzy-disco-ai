# Contributing to AI-Enhanced Engineering Workflow

Thank you for your interest in contributing to the AI-Enhanced Engineering Workflow! This document provides guidelines for contributing to the project.

## 🤝 Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md).

## 🚀 How to Contribute

### Types of Contributions

We welcome several types of contributions:

1. **Bug Reports** - Help us identify and fix issues
2. **Feature Requests** - Suggest new functionality
3. **Code Contributions** - Implement features or bug fixes
4. **Documentation** - Improve or add documentation
5. **Testing** - Add or improve test coverage
6. **Style Guides** - Enhance practitioner style implementations

### Getting Started

1. **Fork the Repository**
   ```bash
   git clone https://github.com/ai-revo-labs/ai-enhanced-workflow.git
   cd ai-enhanced-workflow
   ```

2. **Set Up Development Environment**
   ```bash
   npm install
   npm run build
   npm test
   ```

3. **Create a Branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

### Development Workflow

1. **Make Your Changes**
   - Follow the existing code style
   - Write tests for new functionality
   - Update documentation as needed

2. **Test Your Changes**
   ```bash
   npm test
   npm run lint
   npm run build
   ```

3. **Commit Your Changes**
   ```bash
   git add .
   git commit -m "feat: add new practitioner style for X"
   ```

4. **Push and Create Pull Request**
   ```bash
   git push origin feature/your-feature-name
   ```

### Commit Message Guidelines

We use conventional commits:

- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `test:` - Test additions or modifications
- `refactor:` - Code refactoring
- `style:` - Code style changes
- `chore:` - Maintenance tasks

Examples:
```
feat(mcp): add new tool for code analysis
fix(server): resolve connection timeout issue
docs(readme): update installation instructions
test(workflow): add unit tests for style selector
```

## 📋 Pull Request Process

1. **Before Submitting**
   - [ ] All tests pass
   - [ ] Code follows project style guidelines
   - [ ] Documentation is updated
   - [ ] Commit messages follow convention
   - [ ] Changes are backwards compatible (or breaking changes are documented)

2. **Pull Request Requirements**
   - Clear description of changes
   - Link to related issues
   - Screenshots (if applicable)
   - Test results

3. **Review Process**
   - At least one maintainer review required
   - Address all feedback
   - Ensure CI passes
   - Squash commits if requested

## 🏗️ Development Guidelines

### Code Style

- **TypeScript**: Use strict type checking
- **ESLint**: Follow project linting rules
- **Prettier**: Format code consistently
- **Comments**: Document complex logic

### Testing

- **Unit Tests**: Test individual functions/classes
- **Integration Tests**: Test component interactions
- **End-to-End Tests**: Test complete workflows
- **Coverage**: Maintain 90%+ test coverage

### Documentation

- **JSDoc**: Document all public APIs
- **README**: Update for new features
- **Guides**: Create usage examples
- **Architecture**: Document design decisions

## 🎯 Specific Contribution Areas

### Adding New Practitioner Styles

1. Create style guide in `.claude/rules/`
2. Add style logic in `src/styles/`
3. Update style selector
4. Add tests and documentation

### Enhancing MCP Server

1. Add new tools in `src/mcp-servers/`
2. Update tool registration
3. Add comprehensive schemas
4. Test with MCP clients

### Improving Team Workflows

1. Extend `src/team/` modules
2. Add coordination features
3. Test multi-developer scenarios
4. Document team processes

## 🐛 Bug Reports

Use the bug report template when creating issues:

```markdown
**Bug Description**
Clear description of the bug

**Steps to Reproduce**
1. Step one
2. Step two
3. Step three

**Expected Behavior**
What should happen

**Actual Behavior**
What actually happens

**Environment**
- OS: [e.g., Windows 11]
- Node.js: [e.g., 18.17.0]
- Package version: [e.g., 1.0.0]

**Additional Context**
Any other relevant information
```

## 💡 Feature Requests

Use the feature request template:

```markdown
**Feature Description**
Clear description of the proposed feature

**Problem Statement**
What problem does this solve?

**Proposed Solution**
How should this be implemented?

**Alternatives Considered**
Other approaches you considered

**Additional Context**
Any other relevant information
```

## 🔧 Development Setup

### Prerequisites

- Node.js 18+
- npm 9+
- Git
- VS Code (recommended)

### Environment Variables

```bash
# .env file
NODE_ENV=development
LOG_LEVEL=debug
MCP_SERVER_PORT=3000
```

### VS Code Extensions

Recommended extensions:
- TypeScript and JavaScript Language Features
- ESLint
- Prettier
- Jest
- GitLens

### Build Process

```bash
# Development build
npm run dev

# Production build
npm run build

# Watch mode
npm run dev -- --watch
```

## 🎖️ Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- Project documentation
- Annual contributor highlights

## 📞 Getting Help

- **GitHub Discussions**: General questions
- **Issues**: Bug reports and feature requests
- **Discord**: Real-time community chat
- **Email**: security@ai-revo-labs.com (security issues only)

## 📜 License

By contributing to this project, you agree that your contributions will be licensed under the MIT License.

---

**Thank you for contributing to AI-Enhanced Engineering Workflow! 🚀**

*Built with ❤️ by the AI Revo Labs community*
