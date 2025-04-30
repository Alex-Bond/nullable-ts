import nullable from '../src/index'

describe('Nullable', () => {
  describe('getValue', () => {
    it('should return the original value', () => {
      const value = 'test'
      expect(nullable(value).getValue()).toBe(value)
    })
  })

  describe('orThrow', () => {
    it('should throw the specified error when value is undefined', () => {
      const error = new Error('Value is undefined')
      expect(() => {
        nullable(undefined).orThrow(error).getString()
      }).toThrow(error)
    })

    it('should throw the specified error when value is null and allowNull is false', () => {
      const error = new Error('Value is null')
      expect(() => {
        nullable(null).orThrow(error).getString()
      }).toThrow(error)
    })

    it('should not throw for non-null, non-undefined values', () => {
      const error = new Error('Should not throw')
      expect(() => {
        nullable('test').orThrow(error).getString()
      }).not.toThrow()
    })

    it('should return a new instance with updated settings', () => {
      const original = nullable('test')
      const withThrow = original.orThrow(new Error('test'))

      expect(withThrow).not.toBe(original)
    })
  })

  describe('isNullable', () => {
    it('should allow null values', () => {
      expect(() => {
        nullable(null).isNullable().getString()
      }).not.toThrow()
    })

    it('should still throw for undefined values if orThrow was called', () => {
      const error = new Error('Value is undefined')
      expect(() => {
        nullable(undefined).isNullable().orThrow(error).getString()
      }).toThrow(error)
    })

    it('should return a new instance with updated settings', () => {
      const original = nullable('test')
      const nullable2 = original.isNullable()

      expect(nullable2).not.toBe(original)
    })
  })

  describe('getString', () => {
    it('should convert value to string', () => {
      expect(nullable(123).getString()).toBe('123')
      expect(nullable(true).getString()).toBe('true')
      expect(nullable({}).getString()).toBe('[object Object]')
    })

    it('should return null when value is null and isNullable is called', () => {
      expect(nullable(null).isNullable().getString()).toBeNull()
    })

    it('should return undefined when value is undefined', () => {
      expect(nullable(undefined).isNullable().getString()).toBeUndefined()
    })
  })

  describe('getNumber', () => {
    it('should convert string to number', () => {
      expect(nullable('123').getNumber()).toBe(123)
    })

    it('should return numeric values as is', () => {
      expect(nullable(456).getNumber()).toBe(456)
    })

    it('should throw for non-numeric strings', () => {
      expect(() => {
        nullable('abc').getNumber()
      }).toThrow('Value cannot be converted to a number')
    })

    it('should return null when value is null and isNullable is called', () => {
      expect(nullable(null).isNullable().getNumber()).toBeNull()
    })
  })

  describe('getBool', () => {
    it('should return boolean values as is', () => {
      expect(nullable(true).getBool()).toBe(true)
      expect(nullable(false).getBool()).toBe(false)
    })

    it('should convert truthy string values to true', () => {
      expect(nullable('true').getBool()).toBe(true)
      expect(nullable('yes').getBool()).toBe(true)
      expect(nullable('1').getBool()).toBe(true)
      expect(nullable('TRUE').getBool()).toBe(true)
    })

    it('should convert falsy string values to false', () => {
      expect(nullable('false').getBool()).toBe(false)
      expect(nullable('no').getBool()).toBe(false)
      expect(nullable('0').getBool()).toBe(false)
      expect(nullable('FALSE').getBool()).toBe(false)
    })

    it('should convert positive numbers to true, zero and negative to false', () => {
      expect(nullable(1).getBool()).toBe(true)
      expect(nullable(10).getBool()).toBe(true)
      expect(nullable(0).getBool()).toBe(false)
      expect(nullable(-1).getBool()).toBe(false)
    })

    it('should throw for non-convertible values without force flag', () => {
      expect(() => {
        nullable({}).getBool()
      }).toThrow('Value cannot be converted to a bool')
    })

    it('should coerce any value to boolean with force flag', () => {
      expect(nullable({}).getBool(true)).toBe(true)
      expect(nullable('').getBool(true)).toBe(false)
    })

    it('should return null when value is null and isNullable is called', () => {
      expect(nullable(null).isNullable().getBool()).toBeNull()
    })
  })

  describe('middleware', () => {
    it('should apply middleware to transform values', () => {
      const middleware = (current: any) => {
        const value = current.getValue()
        return nullable(value.toUpperCase())
      }

      expect(nullable('test').use(middleware).getString()).toBe('TEST')
    })

    it('should apply multiple middleware in order', () => {
      const prefix = (current: any) => {
        const value = current.getValue()
        return nullable(`prefix_${value}`)
      }

      const suffix = (current: any) => {
        const value = current.getValue()
        return nullable(`${value}_suffix`)
      }

      expect(nullable('test').use(prefix, suffix).getString()).toBe('prefix_test_suffix')
    })
  })
})
