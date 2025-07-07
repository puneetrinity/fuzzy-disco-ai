# Kent Beck's TDD Style

Kent Beck - "The TDD Pioneer"

## Core Principles

- Always start with failing test (Red)
- Write minimal code to make test pass (Green)
- Refactor without breaking tests (Refactor)
- Take tiny steps - if stuck, make smaller steps
- List test scenarios before coding
- Fake implementations initially, then make real
- Test names should tell little stories
- Design emerges from refactoring, not upfront planning

## Red-Green-Refactor Cycle

**RED**: Write a failing test
**GREEN**: Write minimal code to pass
**REFACTOR**: Improve design while keeping tests green

## Application Guidelines

**Use Kent Beck's style when:**
- Test-driven development and debugging
- New feature development from scratch
- Debugging or fixing broken functionality
- Bug reproduction and edge case exploration

**TDD Workflow:**
1. Write a failing test that describes desired behavior
2. Run test to confirm it fails
3. Write simplest code to make test pass
4. Run test to confirm it passes
5. Refactor code while keeping tests green
6. Repeat cycle

**Code Example:**
```typescript
// Kent Beck's TDD approach

// 1. RED - Start with failing test
describe("Calculator", () => {
  test("should add two positive numbers", () => {
    const calculator = new Calculator();
    const result = calculator.add(2, 3);
    expect(result).toBe(5);
  });
});

// 2. GREEN - Minimal implementation
class Calculator {
  add(a: number, b: number): number {
    return 5; // Hardcoded to pass the test
  }
}

// 3. RED - Add another test
test("should add different positive numbers", () => {
  const calculator = new Calculator();
  const result = calculator.add(1, 4);
  expect(result).toBe(5);
});

// This fails, so we refactor...

// 4. GREEN - Real implementation
class Calculator {
  add(a: number, b: number): number {
    return a + b; // Now handles all cases
  }
}

// 5. REFACTOR - Add more comprehensive tests
describe("Calculator", () => {
  let calculator: Calculator;

  beforeEach(() => {
    calculator = new Calculator();
  });

  describe("addition", () => {
    test("should add two positive numbers", () => {
      expect(calculator.add(2, 3)).toBe(5);
    });

    test("should handle negative numbers", () => {
      expect(calculator.add(-2, 3)).toBe(1);
    });

    test("should handle zero", () => {
      expect(calculator.add(0, 5)).toBe(5);
    });

    test("should handle decimal numbers", () => {
      expect(calculator.add(1.5, 2.3)).toBeCloseTo(3.8);
    });
  });
});
```

## Test Quality Guidelines

**Good Test Names:**
- Describe the behavior, not the implementation
- Use "should" statements
- Include context and expected outcome

**Example:**
```typescript
// Good test names
test("should throw error when dividing by zero")
test("should return empty array when no users found")
test("should send welcome email after successful registration")

// Poor test names
test("test division")
test("users")
test("email")
```

## TDD Benefits

- **Design**: Tests drive better API design
- **Documentation**: Tests document expected behavior  
- **Confidence**: Refactor safely with test coverage
- **Debugging**: Failing tests pinpoint issues
- **Quality**: Prevents regression bugs
