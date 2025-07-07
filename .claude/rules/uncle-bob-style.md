# Uncle Bob's Clean Code Style

Robert C. Martin (Uncle Bob) - "The Clean Code Craftsman"

## Core Principles

- Functions should be small (< 20 lines), do one thing well
- Use descriptive names that reveal intent
- Avoid switch statements, prefer polymorphism
- Follow SOLID principles rigorously
- Write polite code: important information first
- No comments if code is self-documenting
- Comprehensive unit tests with TDD approach
- Boy Scout Rule: leave code cleaner than you found it

## SOLID Principles

**S** - Single Responsibility Principle
**O** - Open-Closed Principle  
**L** - Liskov Substitution Principle
**I** - Interface Segregation Principle
**D** - Dependency Inversion Principle

## Application Guidelines

**Use Uncle Bob's style when:**
- New feature development and clean architecture
- Adding new features to existing codebase
- Code review or improvement tasks
- Building maintainable, scalable systems

**Key Techniques:**
- Small, focused functions
- Descriptive naming
- Dependency injection
- Interface-based design
- Test-driven development

**Code Example:**
```typescript
// Uncle Bob's Clean Code approach

// Single Responsibility - each class has one reason to change
interface UserRepository {
  save(user: User): Promise<void>;
  findById(id: string): Promise<User | null>;
}

interface EmailService {
  sendWelcomeEmail(user: User): Promise<void>;
}

interface PasswordHasher {
  hash(password: string): Promise<string>;
}

// Clean, small function with descriptive name
class UserRegistrationService {
  constructor(
    private userRepository: UserRepository,
    private emailService: EmailService,
    private passwordHasher: PasswordHasher
  ) {}

  async registerNewUser(userData: CreateUserRequest): Promise<User> {
    this.validateUserData(userData);
    
    const hashedPassword = await this.passwordHasher.hash(userData.password);
    const user = this.createUserFromData(userData, hashedPassword);
    
    await this.userRepository.save(user);
    await this.emailService.sendWelcomeEmail(user);
    
    return user;
  }

  private validateUserData(userData: CreateUserRequest): void {
    if (!this.isValidEmail(userData.email)) {
      throw new InvalidEmailError("Email format is invalid");
    }
    
    if (!this.isStrongPassword(userData.password)) {
      throw new WeakPasswordError("Password does not meet security requirements");
    }
  }

  private isValidEmail(email: string): boolean {
    // Simple validation - descriptive method name
    return email.includes("@") && email.includes(".");
  }

  private isStrongPassword(password: string): boolean {
    // Clear intent through method name
    return password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password);
  }

  private createUserFromData(userData: CreateUserRequest, hashedPassword: string): User {
    return new User(
      generateUserId(),
      userData.email,
      hashedPassword,
      userData.name,
      new Date()
    );
  }
}
```

## Code Structure Rules

1. **Functions**: Small, do one thing, descriptive names
2. **Classes**: Single responsibility, open for extension
3. **Variables**: Descriptive names, avoid abbreviations
4. **Comments**: Only when code cannot be made clearer
5. **Error Handling**: Use exceptions, not error codes
6. **Testing**: Write tests first (TDD), test one concept per test
