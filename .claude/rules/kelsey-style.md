# Kelsey Hightower's Cloud Native Style

Kelsey Hightower - "The Cloud Native Pragmatist"

## Core Principles

- Master fundamentals before adopting new platforms
- Focus on reliable, disciplined code regardless of deployment target
- Make systems observable and debuggable
- Prefer simple, composable solutions
- Test in production with proper safeguards
- Infrastructure as code with version control
- Automate operational tasks, but understand manual processes first

## Application Guidelines

**Use Kelsey's style when:**
- Deploy, infrastructure, config, observability tasks
- DevOps or operational tasks
- Production readiness or monitoring
- Cloud-native and scalable systems

**Key Principles:**
- **Production First**: Every generated configuration should be production-ready
- **Observability**: Make systems debuggable and monitorable by default
- **Operational Excellence**: Focus on reliability and maintainability
- **Infrastructure as Code**: Version control everything

**Code Example:**
```typescript
// Kelsey's Cloud Native approach

// Production-ready service with comprehensive observability
class UserService {
  constructor(
    private userRepository: UserRepository,
    private logger: Logger,
    private metrics: MetricsCollector,
    private tracer: Tracer
  ) {}

  async createUser(userData: CreateUserRequest): Promise<User> {
    // Start distributed tracing
    const span = this.tracer.startSpan('user.create');
    
    try {
      // Log structured data for observability
      this.logger.info('Creating new user', {
        email: userData.email,
        source: userData.source,
        timestamp: new Date().toISOString()
      });

      // Validate input with clear error handling
      this.validateUserInput(userData);

      // Create user with comprehensive error handling
      const user = await this.userRepository.create(userData);

      // Emit metrics for monitoring
      this.metrics.increment('user.created', {
        source: userData.source,
        region: process.env.AWS_REGION || 'unknown'
      });

      // Success logging with context
      this.logger.info('User created successfully', {
        userId: user.id,
        email: user.email,
        duration: span.duration()
      });

      return user;

    } catch (error) {
      // Comprehensive error handling and logging
      this.logger.error('Failed to create user', {
        email: userData.email,
        error: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString()
      });

      // Error metrics
      this.metrics.increment('user.creation.failed', {
        errorType: error.constructor.name,
        source: userData.source
      });

      // Re-throw with context
      throw new UserCreationError(
        `Failed to create user for ${userData.email}`,
        { cause: error }
      );

    } finally {
      // Always close span for tracing
      span.finish();
    }
  }

  // Health check endpoint for operational monitoring
  async healthCheck(): Promise<HealthStatus> {
    const checks = await Promise.allSettled([
      this.checkDatabaseConnection(),
      this.checkExternalServices(),
      this.checkSystemResources()
    ]);

    const healthStatus: HealthStatus = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: process.env.APP_VERSION || 'unknown',
      checks: checks.map((check, index) => ({
        name: ['database', 'external_services', 'system_resources'][index],
        status: check.status === 'fulfilled' ? 'healthy' : 'unhealthy',
        message: check.status === 'fulfilled' ? 'OK' : check.reason?.message
      }))
    };

    // Set overall status based on critical checks
    const hasFailures = healthStatus.checks.some(check => check.status === 'unhealthy');
    if (hasFailures) {
      healthStatus.status = 'unhealthy';
    }

    return healthStatus;
  }

  private async checkDatabaseConnection(): Promise<void> {
    await this.userRepository.ping();
  }

  private async checkExternalServices(): Promise<void> {
    // Check external dependencies
    // Implementation would depend on your services
  }

  private async checkSystemResources(): Promise<void> {
    const memoryUsage = process.memoryUsage();
    const maxHeapSize = 512 * 1024 * 1024; // 512MB

    if (memoryUsage.heapUsed > maxHeapSize * 0.9) {
      throw new Error(`High memory usage: ${memoryUsage.heapUsed} bytes`);
    }
  }
}

// Infrastructure as Code - Kubernetes Deployment
const deploymentConfig = {
  apiVersion: 'apps/v1',
  kind: 'Deployment',
  metadata: {
    name: 'user-service',
    labels: {
      app: 'user-service',
      version: process.env.APP_VERSION || 'latest'
    }
  },
  spec: {
    replicas: parseInt(process.env.REPLICA_COUNT || '3'),
    selector: {
      matchLabels: {
        app: 'user-service'
      }
    },
    template: {
      metadata: {
        labels: {
          app: 'user-service'
        }
      },
      spec: {
        containers: [{
          name: 'user-service',
          image: `user-service:${process.env.APP_VERSION || 'latest'}`,
          ports: [{
            containerPort: 3000,
            name: 'http'
          }],
          // Production-ready resource limits
          resources: {
            requests: {
              memory: '256Mi',
              cpu: '250m'
            },
            limits: {
              memory: '512Mi',
              cpu: '500m'
            }
          },
          // Health checks for Kubernetes
          livenessProbe: {
            httpGet: {
              path: '/health',
              port: 3000
            },
            initialDelaySeconds: 30,
            periodSeconds: 10
          },
          readinessProbe: {
            httpGet: {
              path: '/ready',
              port: 3000
            },
            initialDelaySeconds: 5,
            periodSeconds: 5
          },
          // Environment configuration
          env: [
            {
              name: 'NODE_ENV',
              value: 'production'
            },
            {
              name: 'DATABASE_URL',
              valueFrom: {
                secretKeyRef: {
                  name: 'user-service-secrets',
                  key: 'database-url'
                }
              }
            }
          ]
        }]
      }
    }
  }
};

// Monitoring and Alerting Configuration
class MonitoringService {
  constructor(private metrics: MetricsCollector) {}

  setupDefaultMetrics(): void {
    // Application metrics
    this.metrics.gauge('app.uptime', () => process.uptime());
    this.metrics.gauge('app.memory.usage', () => process.memoryUsage().heapUsed);
    this.metrics.gauge('app.cpu.usage', () => process.cpuUsage().user);

    // Business metrics
    this.metrics.gauge('users.active.count', async () => {
      // Implementation would query active users
      return 0;
    });

    // Infrastructure metrics
    this.metrics.gauge('database.connections.active', async () => {
      // Implementation would check database pool
      return 0;
    });
  }

  createAlert(name: string, condition: string, severity: 'warning' | 'critical'): Alert {
    return {
      name,
      condition,
      severity,
      labels: {
        service: 'user-service',
        environment: process.env.NODE_ENV || 'development'
      },
      annotations: {
        summary: `${name} alert triggered`,
        description: `Condition: ${condition}`,
        runbook: `https://docs.company.com/runbooks/${name}`
      }
    };
  }
}
```

## Production Best Practices

**1. Graceful Shutdown:**
```typescript
process.on('SIGTERM', async () => {
  console.log('Received SIGTERM, shutting down gracefully');
  
  // Stop accepting new requests
  server.close(() => {
    // Close database connections
    database.close();
    process.exit(0);
  });
});
```

**2. Configuration Management:**
```typescript
const config = {
  port: parseInt(process.env.PORT || '3000'),
  database: {
    url: process.env.DATABASE_URL || 'postgresql://localhost:5432/users',
    maxConnections: parseInt(process.env.DB_MAX_CONNECTIONS || '10')
  },
  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379'
  }
};
```

**3. Circuit Breaker for Resilience:**
```typescript
class CircuitBreaker {
  private failures = 0;
  private lastFailure = 0;
  private threshold = 5;
  private timeout = 60000; // 1 minute

  async execute<T>(operation: () => Promise<T>): Promise<T> {
    if (this.isOpen()) {
      throw new Error('Circuit breaker is open');
    }

    try {
      const result = await operation();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private isOpen(): boolean {
    return this.failures >= this.threshold && 
           (Date.now() - this.lastFailure) < this.timeout;
  }

  private onSuccess(): void {
    this.failures = 0;
  }

  private onFailure(): void {
    this.failures++;
    this.lastFailure = Date.now();
  }
}
```
