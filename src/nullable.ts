import { isUndefinedOrNull } from './utils'

/**
 * Configuration state for Nullable instances
 */
type State = Record<string, any> & {
  allowNull: boolean
  onUndefined: null | Error
  middleware: Middleware[]
}

/**
 * Function type for middleware that transforms Nullable instances
 */
type Middleware = (current: Nullable) => Nullable

/**
 * Nullable provides ability to work with unknown values of variables.
 *
 * Nullable helps prevent type and null/undefined value related issues.
 *
 * - Type-safe handling of null/undefined values
 * - Chainable transformations through middleware
 * - Configurable error handling for null/undefined cases
 * - Safe type conversions with validation
 * - Immutable operations
 */
class Nullable<ValueType = unknown> {
  private readonly value: ValueType

  readonly state: State = {
    allowNull: false,
    onUndefined: null,
    middleware: [],
  }

  /**
   * Creates a new Nullable instance
   * @param value The value to wrap
   * @param state Optional configuration state
   */
  constructor(value: ValueType, state?: State) {
    this.value = value
    if (state) {
      this.state = state
    }
  }

  /**
   * Returns the wrapped value
   */
  getValue() {
    return this.value
  }

  /**
   * Configures the instance to throw a specific error when value is undefined or null
   * @param error The error to throw
   * @returns A new Nullable instance with updated configuration
   */
  orThrow(error: Error): Nullable<ValueType> {
    return new Nullable(this.value, { ...this.state, onUndefined: error })
  }

  /**
   * Configures the instance to allow null values
   * @returns A new Nullable instance with updated configuration
   */
  isNullable() {
    return new Nullable(this.value, { ...this.state, allowNull: true })
  }

  /**
   * Adds middleware functions to transform the value
   * @param middleware One or more middleware functions
   * @returns A new Nullable instance with the middleware applied
   */
  use(...middleware: Middleware[]): Nullable {
    return new Nullable(this.value, {
      ...this.state,
      middleware: [...this.state.middleware, ...middleware],
    })
  }

  /**
   * Converts the value to a string, handling null/undefined according to configuration
   * @returns String representation of the value, or null/undefined
   */
  getString() {
    const value = this.terminateChain()
    if (isUndefinedOrNull(value)) return value as null | undefined

    return String(value)
  }

  /**
   * Converts the value to a number, handling null/undefined according to configuration
   * @returns Numeric representation of the value, or null/undefined
   * @throws Error if the value cannot be converted to a number
   */
  getNumber() {
    const value = this.terminateChain()
    if (isUndefinedOrNull(value)) return value as null | undefined

    const num = Number(value)
    if (isNaN(num)) {
      throw new Error('Value cannot be converted to a number')
    }
    return num
  }

  /**
   * Converts the value to a boolean, handling null/undefined according to configuration
   *
   * Number >= 0 => true (only if value type is number, not string)
   * Strings "true", "1", "yes" => true
   * String "false", "0", "no" => false
   *
   * @param force If true, coerces any value to boolean using Boolean() after checking number and string value types
   * @returns Boolean representation of the value, or null/undefined
   * @throws Error if the value cannot be converted to a boolean and force is false
   */
  getBool(force = false) {
    const value = this.terminateChain()
    if (isUndefinedOrNull(value)) return value as null | undefined

    if (typeof value === 'boolean') return value

    if (typeof value === 'number' || typeof value === 'bigint') {
      return value > 0
    }

    if (typeof value === 'string') {
      const lowerValue = value.toLowerCase()
      if (lowerValue === 'true' || lowerValue === '1' || lowerValue === 'yes') return true
      if (lowerValue === 'false' || lowerValue === '0' || lowerValue === 'no') return false
    }

    if (force) return Boolean(value)

    throw new Error('Value cannot be converted to a bool')
  }

  /**
   * Processes the value through configuration and middleware
   * @returns The final processed value
   * @throws Error if configured to throw on undefined/null
   */
  private terminateChain() {
    if (this.value === undefined || (this.value === null && !this.state.allowNull)) {
      if (this.state.onUndefined) throw this.state.onUndefined
    }

    // eslint-disable-next-line @typescript-eslint/no-this-alias
    let state: Nullable = this
    this.state.middleware.forEach((f) => {
      state = f(state)
    })

    return state.value
  }
}

/**
 * This function is the entry point for creating Nullable instances.
 *
 * @example
 * // Basic usage
 * const name = nullable("John").getString();
 *
 * // With error handling
 * const requiredValue = nullable(data.value)
 *   .orThrow(new Error("Required value is missing"))
 *   .getString();
 *
 * // With type conversion
 * const age = nullable("42").getNumber();
 *
 * @param value The value to wrap
 * @returns A new Nullable instance with default configuration
 */
function nullable<T>(value: T): Nullable<T> {
  return new Nullable(value)
}

export { nullable }
