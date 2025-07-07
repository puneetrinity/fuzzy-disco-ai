# Copilot Instructions for AI-Enhanced Engineering Workspace

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Project Overview

This is a comprehensive AI-enhanced engineering workspace that integrates:

- **Model Context Protocol (MCP) servers** for intelligent AI assistance
- **Multi-practitioner style guides** from industry masters (Martin Fowler, Uncle Bob, Kent Beck, Jessica Kerr, Kelsey Hightower)
- **Team coordination workflows** for multi-developer collaboration
- **Intelligent auto-style selection** based on task context
- **WSL and cross-platform compatibility**
- **GitHub integration** with automated deployment pipelines

## AI Workflow Philosophy

When generating code for this workspace:

1. **Channel Practitioner Wisdom**: Apply appropriate software engineering principles from the masters:
   - **Martin Fowler**: Evolutionary design, continuous refactoring
   - **Uncle Bob**: Clean code, SOLID principles
   - **Kent Beck**: Test-driven development, simple design
   - **Jessica Kerr**: Functional programming, pure functions
   - **Kelsey Hightower**: Cloud-native, production excellence

2. **Context-Aware Development**: Consider the task type when selecting approaches:
   - New features → Uncle Bob's Clean Code
   - Bug fixes → Kent Beck's TDD
   - Refactoring → Martin Fowler's techniques
   - Data processing → Jessica Kerr's functional approach
   - Infrastructure → Kelsey's cloud-native principles

3. **Team Collaboration**: Generate code that supports multi-developer workflows:
   - Clear interfaces and abstractions
   - Comprehensive testing
   - Self-documenting code
   - Proper error handling

## MCP Server Guidelines

You can find more info and examples at https://modelcontextprotocol.io/llms-full.txt

When working with MCP servers:
- Use TypeScript with proper type safety
- Implement comprehensive error handling
- Follow the MCP SDK patterns
- Create clear tool descriptions and schemas

## Code Quality Standards

- **Test Coverage**: Aim for 90%+ coverage with meaningful tests
- **Documentation**: Every public API should be documented
- **Error Handling**: Graceful degradation and clear error messages
- **Performance**: Consider scalability and optimization
- **Security**: Follow secure coding practices

## File Organization

```
.claude/                 # Claude Code configurations
├── commands/           # Custom AI commands
├── rules/             # Practitioner style guides
├── context/           # Team coordination files
└── mcp/              # MCP server configurations

src/                    # Source code
├── mcp-servers/       # MCP server implementations
├── workflow/          # AI workflow engine
├── styles/            # Practitioner style implementations
└── team/              # Team coordination tools

docs/                   # Documentation
tests/                  # Test suites
scripts/                # Utility scripts
```

## Development Workflow

1. **Start with Tests**: Use TDD when appropriate
2. **Apply Style Selection**: Choose the right practitioner approach
3. **Consider Team Impact**: Think about how changes affect other developers
4. **Document Decisions**: Include reasoning for architectural choices
5. **Validate Quality**: Ensure code meets all quality gates

Remember: The goal is to create code that is not just functional, but embodies decades of software engineering wisdom while enabling intelligent AI collaboration.
