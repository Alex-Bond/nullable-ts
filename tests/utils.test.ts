import { isUndefinedOrNull } from '../src/utils'

describe('utils', () => {
  describe('isUndefinedOrNull', () => {
    it('should return true for undefined', () => {
      expect(isUndefinedOrNull(undefined)).toBe(true)
    })

    it('should return true for null', () => {
      expect(isUndefinedOrNull(null)).toBe(true)
    })

    it('should return false for empty string', () => {
      expect(isUndefinedOrNull('')).toBe(false)
    })

    it('should return false for 0', () => {
      expect(isUndefinedOrNull(0)).toBe(false)
    })

    it('should return false for false', () => {
      expect(isUndefinedOrNull(false)).toBe(false)
    })

    it('should return false for objects', () => {
      expect(isUndefinedOrNull({})).toBe(false)
      expect(isUndefinedOrNull([])).toBe(false)
    })
    
    it('should act as a type guard', () => {
      // This test is primarily a TypeScript compilation check
      const testTypeGuard = <T>(value: T | null | undefined): T | undefined => {
        if (isUndefinedOrNull(value)) {
          // TypeScript should recognize this branch handles null and undefined
          return undefined;
        }
        // TypeScript should recognize value is of type T here
        return value;
      }
      
      expect(testTypeGuard('test')).toBe('test');
      expect(testTypeGuard(null)).toBeUndefined();
      expect(testTypeGuard(undefined)).toBeUndefined();
    })
  })
})
