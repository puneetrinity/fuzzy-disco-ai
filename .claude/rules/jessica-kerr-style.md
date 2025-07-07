# Jessica Kerr's Functional Style

Jessica Kerr - "The Functional Pragmatist"

## Core Principles

- Make data dependencies explicit through method signatures
- Clearly separate pure functions from side-effect functions
- Use immutable data structures where possible
- Minimize state mutation, isolate when necessary
- Prefer composition over inheritance
- Make invalid states unrepresentable
- Use static methods for pure computations

## Application Guidelines

**Use Jessica Kerr's style when:**
- Data processing, transform, pipeline, pure function tasks
- Working with state management
- API or data layer development
- Complex data transformations

**Key Concepts:**
- **Pure Functions**: Same input always produces same output, no side effects
- **Immutability**: Data doesn't change after creation
- **Composition**: Build complex behavior from simple functions
- **Explicit Dependencies**: Function signatures show what data is needed

**Code Example:**
```typescript
// Jessica Kerr's Functional approach

// Pure functions - no side effects, predictable
function calculateTotalPrice(items: readonly Item[]): number {
  return items.reduce((total, item) => total + item.price, 0);
}

function applyDiscount(price: number, discountPercent: number): number {
  return price * (1 - discountPercent / 100);
}

function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency
  }).format(amount);
}

// Immutable data structures
interface Item {
  readonly id: string;
  readonly name: string;
  readonly price: number;
  readonly category: string;
}

interface ShoppingCart {
  readonly items: readonly Item[];
  readonly customerId: string;
}

// Functional composition - build complex behavior from simple functions
function calculateDiscountedTotal(
  cart: ShoppingCart,
  discountPercent: number
): number {
  const totalPrice = calculateTotalPrice(cart.items);
  return applyDiscount(totalPrice, discountPercent);
}

// Side effects isolated to boundaries
class ShoppingCartService {
  constructor(
    private cartRepository: CartRepository,
    private logger: Logger
  ) {}

  // Pure core logic
  private calculateOrderSummary(cart: ShoppingCart, discount: number): OrderSummary {
    const subtotal = calculateTotalPrice(cart.items);
    const discountAmount = subtotal * (discount / 100);
    const total = subtotal - discountAmount;
    
    return {
      subtotal,
      discountAmount,
      total,
      items: cart.items
    };
  }

  // Side effects at the boundary
  async processOrder(cartId: string, discountPercent: number): Promise<OrderSummary> {
    // Side effect: database read
    const cart = await this.cartRepository.findById(cartId);
    
    if (!cart) {
      throw new Error(`Cart not found: ${cartId}`);
    }

    // Pure computation
    const orderSummary = this.calculateOrderSummary(cart, discountPercent);
    
    // Side effect: logging
    this.logger.info(`Order processed for customer ${cart.customerId}`, {
      total: orderSummary.total,
      itemCount: cart.items.length
    });

    return orderSummary;
  }
}

// Function pipeline for data transformation
function processUserData(rawData: string): User[] {
  return pipe(
    rawData,
    parseJsonSafely,
    validateUserData,
    normalizeUserNames,
    sortByCreationDate
  );
}

// Utility function for function composition
function pipe<T>(value: T, ...functions: Function[]): any {
  return functions.reduce((acc, fn) => fn(acc), value);
}

// Pure transformation functions
function parseJsonSafely(jsonString: string): unknown[] {
  try {
    const parsed = JSON.parse(jsonString);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function validateUserData(data: unknown[]): UserData[] {
  return data.filter(isValidUserData);
}

function isValidUserData(item: unknown): item is UserData {
  return typeof item === 'object' && 
         item !== null && 
         'name' in item && 
         'email' in item;
}

function normalizeUserNames(users: UserData[]): UserData[] {
  return users.map(user => ({
    ...user,
    name: user.name.trim().toLowerCase()
  }));
}

function sortByCreationDate(users: UserData[]): User[] {
  return [...users]
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    .map(userData => new User(userData));
}
```

## Functional Patterns

**1. Map/Filter/Reduce for Data Processing:**
```typescript
const activeUsers = users
  .filter(user => user.isActive)
  .map(user => ({ ...user, lastSeen: formatDate(user.lastSeen) }))
  .reduce((acc, user) => ({ ...acc, [user.id]: user }), {});
```

**2. Option/Maybe Types for Null Safety:**
```typescript
type Option<T> = T | null;

function findUserById(id: string): Option<User> {
  return users.find(user => user.id === id) || null;
}
```

**3. Result Types for Error Handling:**
```typescript
type Result<T, E> = { success: true; data: T } | { success: false; error: E };

function parseUser(data: unknown): Result<User, string> {
  if (!isValidUserData(data)) {
    return { success: false, error: "Invalid user data format" };
  }
  
  return { success: true, data: new User(data) };
}
```
