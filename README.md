# @alex-bond/nullable

A TypeScript library for safely handling undefined/null values with immutable, chainable operations and enhanced type safety.

## Installation

```bash
npm install @alex-bond/nullable
```

## Features

- Fully type-safe handling of null/undefined values
- Chainable API with immutable operations
- Configurable error handling for null/undefined cases
- Safe type conversions with validation
- Middleware support for custom transformations
- Generic type parameters for precise return type definitions

## Usage

### Basic Usage

```typescript
import nullable from '@alex-bond/nullable';

// Basic string conversion
const name = nullable("John").getString();  // "John"

// Number conversion
const age = nullable("42").getNumber();     // 42

// Boolean conversion
const isActive = nullable("true").getBool();  // true
const count = nullable(5).getBool();          // true (because 5 > 0)
```

### Handling Undefined/Null Values

```typescript
// Throw an error if value is undefined/null
const requiredValue = nullable(data.value)
  .orThrow(new Error("Required value is missing"))
  .getString();

// Allow null values (but not undefined)
const optionalValue = nullable(data.value)
  .isNullable()
  .getString();  // Returns null if value is null

// Combined configuration
const configuredValue = nullable(data.value)
  .isNullable()  // Allow null
  .orThrow(new Error("Value is required")) // Throw if undefined
  .getString();
```

### Type Conversion

```typescript
// String conversion
nullable(42).getString();  // "42"
nullable(true).getString();  // "true"

// Number conversion
nullable("123").getNumber();  // 123
nullable("abc").getNumber();  // Throws Error: "Value cannot be converted to a number"

// Boolean conversion
nullable("yes").getBool();    // true
nullable("no").getBool();     // false
nullable("true").getBool();   // true
nullable("false").getBool();  // false
nullable("1").getBool();      // true
nullable("0").getBool();      // false
nullable(1).getBool();        // true
nullable(0).getBool();        // false

// Force boolean conversion
nullable({}).getBool();       // Throws Error: "Value cannot be converted to a bool"
nullable({}).getBool(true);   // true (coerced using Boolean())
nullable("").getBool(true);   // false
```

### Using Middleware

Middleware allows for custom transformations in the processing chain. The middleware takes a current value and a setter function for creating a new Nullable instance.

```typescript
// Single middleware
const toUpperCase = (current, set) => {
  const value = current.getValue();
  return set(typeof value === 'string' ? value.toUpperCase() : value);
};

nullable("hello").use(toUpperCase).getString();  // "HELLO"

// Multiple middleware
const addPrefix = (current, set) => {
  const value = current.getValue();
  return set(`prefix_${value}`);
};

const addSuffix = (current, set) => {
  const value = current.getValue();
  return set(`${value}_suffix`);
};

nullable("test").use(addPrefix, addSuffix).getString();  // "prefix_test_suffix"
```

For TypeScript users, middleware can be properly typed using the exported `Middleware` type:

```typescript
import nullable, { Middleware } from '@alex-bond/nullable';

const toUpperCase: Middleware = (current, set) => {
  const value = current.getValue();
  return set(typeof value === 'string' ? value.toUpperCase() : value);
};
```

## API Reference

### `nullable(value)`

Creates a new Nullable instance wrapping the provided value.

### Methods

- `.getValue()` - Returns the original wrapped value
- `.orThrow(error)` - Configures to throw the specified error if value is undefined/null
- `.isNullable()` - Configures to allow null values
- `.getString()` - Converts value to string
- `.getNumber()` - Converts value to number (throws if conversion fails)
- `.getBool(force?)` - Converts value to boolean (throws if conversion fails and force is false)
- `.use(...middleware)` - Applies one or more middleware functions to transform the value

### Type Safety

The library provides full type safety when chaining methods:

```typescript
// With orThrow
const text = nullable('text').orThrow(new Error('test')).getString();
// TypeScript knows that text is a string (not string | null | undefined)

// With isNullable
const nullableText = nullable(null).isNullable().getString();
// TypeScript knows that nullableText is null (not string | null | undefined)

// With both
const stringOrNull = nullable('text').orThrow(new Error('test')).isNullable().getString();
// TypeScript knows that stringOrNull is string | null (not string | null | undefined)
```

## License

MIT
