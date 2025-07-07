# 💬 Claude Code Conversation Examples

## 🎯 How to Talk to Claude Code with Your AI-Enhanced Workflow

### 🚀 **Example 1: New Feature Development**

**You say:**
```
"I need to implement user authentication for my web application"
```

**Claude Code responds with Uncle Bob (Clean Code) style:**
```typescript
// Clean Code principles applied automatically
interface UserAuthenticator {
  authenticate(credentials: LoginCredentials): Promise<AuthResult>;
}

class UserAuthenticationService implements UserAuthenticator {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordHasher: PasswordHasher,
    private readonly tokenGenerator: TokenGenerator,
    private readonly logger: Logger
  ) {}

  async authenticate(credentials: LoginCredentials): Promise<AuthResult> {
    try {
      const user = await this.findUserByEmail(credentials.email);
      const isPasswordValid = await this.validatePassword(credentials.password, user.hashedPassword);
      
      if (!isPasswordValid) {
        this.logger.warn('Authentication failed for user', { email: credentials.email });
        return AuthResult.failure('Invalid credentials');
      }

      const token = await this.tokenGenerator.generate(user.id);
      this.logger.info('User authenticated successfully', { userId: user.id });
      
      return AuthResult.success(user, token);
    } catch (error) {
      this.logger.error('Authentication error', { error: error.message });
      throw new AuthenticationError('Authentication failed');
    }
  }

  private async findUserByEmail(email: string): Promise<User> {
    // Implementation with proper error handling
  }

  private async validatePassword(password: string, hashedPassword: string): Promise<boolean> {
    // Implementation with secure password validation
  }
}
```

---

### 🐛 **Example 2: Bug Fix**

**You say:**
```
"There's a bug where users can't login. I'm getting a 500 error when they submit the form"
```

**Claude Code responds with Kent Beck (TDD) style:**
```typescript
// Test-driven approach - write test first
describe('UserAuthenticationService', () => {
  it('should handle invalid user gracefully without throwing 500 error', async () => {
    // Given
    const mockUserRepository = {
      findByEmail: jest.fn().mockResolvedValue(null)
    };
    const authService = new UserAuthenticationService(mockUserRepository, mockPasswordHasher, mockTokenGenerator, mockLogger);
    
    // When
    const result = await authService.authenticate({
      email: 'nonexistent@example.com',
      password: 'password123'
    });
    
    // Then
    expect(result.isSuccess).toBe(false);
    expect(result.error).toBe('User not found');
    expect(mockLogger.error).not.toHaveBeenCalled(); // Should not log as error
  });

  it('should handle database connection errors gracefully', async () => {
    // Given
    const mockUserRepository = {
      findByEmail: jest.fn().mockRejectedValue(new Error('Database connection failed'))
    };
    
    // When/Then
    await expect(authService.authenticate(validCredentials))
      .rejects.toThrow('Authentication service unavailable');
  });
});

// Minimal fix implementation
class UserAuthenticationService {
  async authenticate(credentials: LoginCredentials): Promise<AuthResult> {
    try {
      const user = await this.userRepository.findByEmail(credentials.email);
      
      if (!user) {
        // Fix: Handle missing user gracefully instead of throwing
        return AuthResult.failure('User not found');
      }
      
      // Rest of authentication logic...
    } catch (error) {
      // Fix: Proper error handling instead of letting 500 bubble up
      this.logger.error('Authentication service error', { error: error.message });
      throw new AuthenticationServiceError('Authentication service unavailable');
    }
  }
}
```

---

### 🔧 **Example 3: Refactoring Legacy Code**

**You say:**
```
"This authentication code is a mess. It's one giant function with 200 lines. Can you help me refactor it?"
```

**Claude Code responds with Martin Fowler (Refactoring) style:**
```typescript
// Before: Giant function (showing structure)
class AuthService {
  authenticate(email: string, password: string): boolean {
    // 200 lines of mixed concerns:
    // - Input validation
    // - Database queries
    // - Password hashing
    // - Token generation
    // - Logging
    // - Error handling
    // - Business logic
  }
}

// After: Refactored using Fowler's patterns
class AuthService {
  constructor(
    private readonly validator: InputValidator,
    private readonly userRepository: UserRepository,
    private readonly passwordService: PasswordService,
    private readonly tokenService: TokenService,
    private readonly auditLogger: AuditLogger
  ) {}

  async authenticate(credentials: LoginCredentials): Promise<AuthResult> {
    // Extract Method: Break down into focused methods
    const validationResult = this.validateCredentials(credentials);
    if (!validationResult.isValid) {
      return AuthResult.failure(validationResult.error);
    }

    const user = await this.findUser(credentials.email);
    if (!user) {
      return this.handleUserNotFound(credentials.email);
    }

    const passwordMatch = await this.verifyPassword(credentials.password, user.passwordHash);
    if (!passwordMatch) {
      return this.handleInvalidPassword(credentials.email);
    }

    return this.generateSuccessResult(user);
  }

  // Extract Method: Each method has single responsibility
  private validateCredentials(credentials: LoginCredentials): ValidationResult {
    return this.validator.validate(credentials);
  }

  private async findUser(email: string): Promise<User | null> {
    return this.userRepository.findByEmail(email);
  }

  private async verifyPassword(password: string, hash: string): Promise<boolean> {
    return this.passwordService.verify(password, hash);
  }

  private handleUserNotFound(email: string): AuthResult {
    this.auditLogger.logFailedAttempt(email, 'user_not_found');
    return AuthResult.failure('Invalid credentials');
  }

  private handleInvalidPassword(email: string): AuthResult {
    this.auditLogger.logFailedAttempt(email, 'invalid_password');
    return AuthResult.failure('Invalid credentials');
  }

  private async generateSuccessResult(user: User): Promise<AuthResult> {
    const token = await this.tokenService.generate(user.id);
    this.auditLogger.logSuccessfulAuth(user.id);
    return AuthResult.success(user, token);
  }
}
```

---

### 📊 **Example 4: Data Processing**

**You say:**
```
"I need to process user analytics data - transform raw events into engagement metrics"
```

**Claude Code responds with Jessica Kerr (Functional) style:**
```typescript
// Functional programming approach
import { pipe } from 'fp-ts/function';
import * as A from 'fp-ts/Array';
import * as O from 'fp-ts/Option';

interface UserEvent {
  userId: string;
  eventType: string;
  timestamp: Date;
  metadata: Record<string, unknown>;
}

interface EngagementMetrics {
  userId: string;
  totalEvents: number;
  uniqueEventTypes: number;
  avgEventsPerDay: number;
  lastActivity: Date;
}

// Pure functions for data transformation
const processUserAnalytics = (events: UserEvent[]): EngagementMetrics[] =>
  pipe(
    events,
    filterActiveUsers,
    groupByUser,
    A.map(calculateUserMetrics),
    A.filter(O.isSome),
    A.map(O.getOrElse(() => null as never))
  );

const filterActiveUsers = (events: UserEvent[]): UserEvent[] =>
  events.filter(event => 
    event.eventType !== 'system' && 
    event.timestamp > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  );

const groupByUser = (events: UserEvent[]): Record<string, UserEvent[]> =>
  events.reduce((acc, event) => ({
    ...acc,
    [event.userId]: [...(acc[event.userId] || []), event]
  }), {} as Record<string, UserEvent[]>);

const calculateUserMetrics = ([userId, userEvents]: [string, UserEvent[]]): O.Option<EngagementMetrics> =>
  userEvents.length > 0
    ? O.some({
        userId,
        totalEvents: userEvents.length,
        uniqueEventTypes: new Set(userEvents.map(e => e.eventType)).size,
        avgEventsPerDay: calculateAverageEventsPerDay(userEvents),
        lastActivity: new Date(Math.max(...userEvents.map(e => e.timestamp.getTime())))
      })
    : O.none;

const calculateAverageEventsPerDay = (events: UserEvent[]): number => {
  const daySpan = getDaySpan(events);
  return daySpan > 0 ? events.length / daySpan : 0;
};

const getDaySpan = (events: UserEvent[]): number => {
  const timestamps = events.map(e => e.timestamp.getTime());
  const minTime = Math.min(...timestamps);
  const maxTime = Math.max(...timestamps);
  return Math.ceil((maxTime - minTime) / (24 * 60 * 60 * 1000)) || 1;
};
```

---

### ☁️ **Example 5: Cloud Deployment**

**You say:**
```
"I need to deploy this authentication service to Kubernetes with proper monitoring"
```

**Claude Code responds with Kelsey Hightower (Cloud-Native) style:**
```yaml
# Kubernetes deployment with cloud-native best practices
apiVersion: apps/v1
kind: Deployment
metadata:
  name: auth-service
  labels:
    app: auth-service
    version: v1.0.0
spec:
  replicas: 3
  selector:
    matchLabels:
      app: auth-service
  template:
    metadata:
      labels:
        app: auth-service
        version: v1.0.0
    spec:
      containers:
      - name: auth-service
        image: auth-service:1.0.0
        ports:
        - containerPort: 3000
          name: http
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: auth-secrets
              key: database-url
        - name: JWT_SECRET
          valueFrom:
            secretKeyRef:
              name: auth-secrets
              key: jwt-secret
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /ready
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5
        securityContext:
          allowPrivilegeEscalation: false
          runAsNonRoot: true
          runAsUser: 1000
          readOnlyRootFilesystem: true
          capabilities:
            drop:
            - ALL

---
apiVersion: v1
kind: Service
metadata:
  name: auth-service
  labels:
    app: auth-service
spec:
  selector:
    app: auth-service
  ports:
  - port: 80
    targetPort: 3000
    name: http
  type: ClusterIP

---
apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  name: auth-service-monitor
  labels:
    app: auth-service
spec:
  selector:
    matchLabels:
      app: auth-service
  endpoints:
  - port: http
    path: /metrics
    interval: 30s
```

---

## 🎯 **Key Points for Claude Code Integration**

### ✅ **What Works Automatically:**
- **Style Detection**: Claude Code automatically detects your task type
- **Code Generation**: Applies the appropriate practitioner style
- **Quality Standards**: Follows your workspace coding standards
- **Team Patterns**: Uses your team's established patterns

### 🚀 **How to Get Best Results:**
1. **Be specific about your task type**
2. **Mention the context** (new feature, bug fix, refactoring, etc.)
3. **Reference existing code** when relevant
4. **Ask for explanations** of the chosen approach

### 💡 **Pro Tips:**
- Say "Use Uncle Bob's approach" for explicit style selection
- Ask "Why did you choose this style?" for learning
- Request "Show me the tests" for TDD scenarios
- Say "Make it more functional" for data processing tasks

Your AI-Enhanced Workflow is now fully ready to work with Claude Code! 🎉
