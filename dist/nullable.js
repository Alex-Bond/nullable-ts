"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nullable = void 0;
var tslib_1 = require("tslib");
var utils_1 = require("./utils.js");
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
var Nullable = /** @class */ (function () {
    /**
     * Creates a new Nullable instance
     * @param value The value to wrap
     * @param state Optional configuration state
     */
    function Nullable(value, state) {
        this.state = {
            allowNull: false,
            onUndefined: null,
            middleware: [],
        };
        this.value = value;
        if (state) {
            this.state = state;
        }
    }
    /**
     * Returns the wrapped value
     */
    Nullable.prototype.getValue = function () {
        return this.value;
    };
    /**
     * Configures the instance to throw a specific error when value is undefined or null
     * @param error The error to throw
     * @returns A new Nullable instance with updated configuration
     */
    Nullable.prototype.orThrow = function (error) {
        return new Nullable(this.value, tslib_1.__assign(tslib_1.__assign({}, this.state), { onUndefined: error }));
    };
    /**
     * Configures the instance to allow null values
     * @returns A new Nullable instance with updated configuration
     */
    Nullable.prototype.isNullable = function () {
        return new Nullable(this.value, tslib_1.__assign(tslib_1.__assign({}, this.state), { allowNull: true }));
    };
    /**
     * Adds middleware functions to transform the value
     * @param middleware One or more middleware functions
     * @returns A new Nullable instance with the middleware applied
     */
    Nullable.prototype.use = function () {
        var middleware = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            middleware[_i] = arguments[_i];
        }
        return new Nullable(this.value, tslib_1.__assign(tslib_1.__assign({}, this.state), { middleware: tslib_1.__spreadArray(tslib_1.__spreadArray([], this.state.middleware, true), middleware, true) }));
    };
    /**
     * Converts the value to a string, handling null/undefined according to configuration
     * @returns String representation of the value, or null/undefined
     */
    Nullable.prototype.getString = function () {
        var value = this.terminateChain();
        if ((0, utils_1.isUndefinedOrNull)(value))
            return value;
        return String(value);
    };
    /**
     * Converts the value to a number, handling null/undefined according to configuration
     * @returns Numeric representation of the value, or null/undefined
     * @throws Error if the value cannot be converted to a number
     */
    Nullable.prototype.getNumber = function () {
        var value = this.terminateChain();
        if ((0, utils_1.isUndefinedOrNull)(value))
            return value;
        var num = Number(value);
        if (isNaN(num)) {
            throw new Error('Value cannot be converted to a number');
        }
        return num;
    };
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
    Nullable.prototype.getBool = function (force) {
        if (force === void 0) { force = false; }
        var value = this.terminateChain();
        if ((0, utils_1.isUndefinedOrNull)(value))
            return value;
        if (typeof value === 'boolean')
            return value;
        if (typeof value === 'number' || typeof value === 'bigint') {
            return value > 0;
        }
        if (typeof value === 'string') {
            var lowerValue = value.toLowerCase();
            if (lowerValue === 'true' || lowerValue === '1' || lowerValue === 'yes')
                return true;
            if (lowerValue === 'false' || lowerValue === '0' || lowerValue === 'no')
                return false;
        }
        if (force)
            return Boolean(value);
        throw new Error('Value cannot be converted to a bool');
    };
    /**
     * Processes the value through configuration and middleware
     * @returns The final processed value
     * @throws Error if configured to throw on undefined/null
     */
    Nullable.prototype.terminateChain = function () {
        var _this = this;
        if (this.state.onUndefined) {
            if (this.value === undefined || (this.value === null && !this.state.allowNull)) {
                throw this.state.onUndefined;
            }
        }
        var state = this;
        this.state.middleware.forEach(function (f) {
            state = f(state, function (value) {
                return new Nullable(value, _this.state);
            });
        });
        return state.value;
    };
    return Nullable;
}());
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
function nullable(value) {
    return new Nullable(value);
}
exports.nullable = nullable;
//# sourceMappingURL=nullable.js.map