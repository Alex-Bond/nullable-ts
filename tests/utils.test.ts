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
  })
})
