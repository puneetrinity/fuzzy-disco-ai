# Martin Fowler's Refactoring Style

Martin Fowler - "The Refactoring Philosopher"

## Core Principles

- Write code for humans first, computers second
- Refactor continuously in small bursts during development
- Make code intention immediately apparent without mental translation
- Focus on evolutionary design rather than big upfront design
- Self-testing code with comprehensive automated tests
- Simple designs that are easy to change

## Key Quotes

> "Any fool can write code that a computer can understand. Good programmers write code that humans can understand."

> "Whenever I have to think to understand what the code is doing, I ask myself if I can refactor the code to make that understanding more immediately apparent."

## Application Guidelines

**Use Fowler's style when:**
- Refactoring and evolutionary design tasks
- Working with legacy code
- Architecture decisions or design patterns
- Code clarity and maintainability improvements

**Key Techniques:**
- Extract Method: Break down large functions
- Rename Variables/Methods: Make intent clear
- Replace Magic Numbers: Use named constants
- Simplify Conditional Expressions
- Continuous refactoring in small steps

**Code Example:**
```typescript
// Before - unclear intent
function calc(x: number, y: number): number {
  return x * 0.1 + y * 0.05;
}

// After - Fowler's approach
function calculateTotalTax(income: number, bonus: number): number {
  const INCOME_TAX_RATE = 0.1;
  const BONUS_TAX_RATE = 0.05;
  
  return calculateIncomeTax(income) + calculateBonusTax(bonus);
}

function calculateIncomeTax(income: number): number {
  const INCOME_TAX_RATE = 0.1;
  return income * INCOME_TAX_RATE;
}

function calculateBonusTax(bonus: number): number {
  const BONUS_TAX_RATE = 0.05;
  return bonus * BONUS_TAX_RATE;
}
```

## Architecture Philosophy

- Architecture as "shared understanding that expert developers have of the system design"
- Evolutionary architecture that can adapt to changing requirements
- Prefer simple solutions that can evolve over complex upfront designs
- Regular architectural refactoring to prevent technical debt
