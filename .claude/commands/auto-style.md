# Intelligent Style Auto-Selection

ANALYZE the task context and AUTOMATICALLY choose the best practitioner style:

## Detection Rules:

### 1. **Kent Beck TDD Style** - IF:
- Task mentions: 'test', 'bug', 'failing', 'edge case', 'regression'
- New feature development from scratch
- Debugging or fixing broken functionality

### 2. **Uncle Bob Clean Code Style** - IF:
- Task mentions: 'refactor', 'clean up', 'organize', 'architecture'
- Adding new features to existing codebase
- Code review or improvement tasks

### 3. **Martin Fowler Evolutionary Style** - IF:
- Task mentions: 'improve', 'modify', 'extend', 'change'
- Working with legacy code
- Architecture decisions or design patterns

### 4. **Jessica Kerr Functional Style** - IF:
- Task mentions: 'data processing', 'transform', 'pipeline', 'pure function'
- Working with state management
- API or data layer development

### 5. **Kelsey Hightower Cloud Native Style** - IF:
- Task mentions: 'deploy', 'infrastructure', 'config', 'observability'
- DevOps or operational tasks
- Production readiness or monitoring

## Auto-Application Process:
1. Detect style based on task context
2. Apply appropriate rules and principles
3. Explain WHY this style was chosen
4. Execute task using selected methodology
5. Validate result against style standards

## Multi-Factor Analysis:

### File Context Detection:
- *.test.js, *_test.py, *Test.java → Kent Beck TDD
- package.json, requirements.txt, pom.xml → Uncle Bob Clean Architecture  
- Dockerfile, docker-compose.yml, k8s/*.yaml → Kelsey Cloud Native
- *.config.js, *.env, terraform/*.tf → Kelsey Infrastructure
- data/, etl/, pipeline/ directories → Jessica Kerr Functional

### Git Context Detection:
- Branch names: feature/* → Uncle Bob, fix/* → Kent Beck, refactor/* → Fowler
- Recent commits mentioning 'test' → Kent Beck
- Recent commits mentioning 'deploy' → Kelsey
- Recent commits mentioning 'clean' → Uncle Bob

### Task Complexity Detection:
- Simple CRUD operations → Uncle Bob Clean Code
- Complex business logic → Martin Fowler Evolutionary
- Data transformations → Jessica Kerr Functional  
- System integration → Kelsey Cloud Native
- Bug reproduction → Kent Beck TDD

### Team Context Detection:
- Morning (planning) → Fowler Evolutionary Design
- Midday (implementation) → Uncle Bob Clean Code
- Testing phases → Kent Beck TDD
- Pre-deployment → Kelsey Cloud Native
- Code review → Multi-style analysis

PROCEED with automatic style selection and application.
