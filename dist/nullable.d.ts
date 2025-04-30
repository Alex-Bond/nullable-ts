/**
 * Configuration state for Nullable instances
 */
type State = Record<string, any> & {
    allowNull: boolean;
    onUndefined: null | Error;
    middleware: Middleware[];
};
/**
 * Function type for middleware that transforms Nullable instances
 */
export type Middleware = <ValueType = unknown, ErrorState extends boolean = false, NullableState extends boolean = false>(current: Nullable<ValueType, ErrorState, NullableState>, setter: (value: unknown) => Nullable<unknown, ErrorState, NullableState>) => Nullable<unknown, ErrorState, NullableState>;
type ReturnType<T, ErrorState extends boolean, NullableState extends boolean> = ErrorState extends true ? (NullableState extends true ? T | null : T) : T | null | undefined;
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
declare class Nullable<ValueType = unknown, ErrorState extends boolean = false, NullableState extends boolean = false> {
    private readonly value;
    readonly state: State;
    /**
     * Creates a new Nullable instance
     * @param value The value to wrap
     * @param state Optional configuration state
     */
    constructor(value: ValueType, state?: State);
    /**
     * Returns the wrapped value
     */
    getValue(): ValueType;
    /**
     * Configures the instance to throw a specific error when value is undefined or null
     * @param error The error to throw
     * @returns A new Nullable instance with updated configuration
     */
    orThrow(error: Error): Nullable<ValueType, true, NullableState>;
    /**
     * Configures the instance to allow null values
     * @returns A new Nullable instance with updated configuration
     */
    isNullable(): Nullable<ValueType, ErrorState, true>;
    /**
     * Adds middleware functions to transform the value
     * @param middleware One or more middleware functions
     * @returns A new Nullable instance with the middleware applied
     */
    use(...middleware: Middleware[]): Nullable<ValueType, ErrorState, NullableState>;
    /**
     * Converts the value to a string, handling null/undefined according to configuration
     * @returns String representation of the value, or null/undefined
     */
    getString(): ReturnType<string, ErrorState, NullableState>;
    /**
     * Converts the value to a number, handling null/undefined according to configuration
     * @returns Numeric representation of the value, or null/undefined
     * @throws Error if the value cannot be converted to a number
     */
    getNumber(): ReturnType<number, ErrorState, NullableState>;
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
    getBool(force?: boolean): ReturnType<boolean, ErrorState, NullableState>;
    /**
     * Processes the value through configuration and middleware
     * @returns The final processed value
     * @throws Error if configured to throw on undefined/null
     */
    private terminateChain;
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
declare function nullable<T>(value: T): Nullable<T>;
export { nullable };
//# sourceMappingURL=nullable.d.ts.map