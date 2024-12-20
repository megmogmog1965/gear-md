import { describe, it, expect, beforeEach, afterAll } from 'vitest'
import { parseJsonRecursively, createMarkdownString } from './converter.js'


beforeEach(() => {
  // nothing to be done.
})

afterAll(() => {
  // nothing to be done.
})

describe('parseJsonRecursively()', () => {
  it('without nested.', async () => {
    const json = {
      key1: 'value1',
      key2: 2,
      key3: null,
      key4: ['array'],
      key5: {
        key6: 'object',
      },
    }

    // call.
    const actual = parseJsonRecursively(json)

    // assertion.
    expect(actual).toStrictEqual(json)
  })

  it('with nested null.', async () => {
    const json = {
      key1: 'value1',
      key2: 'null',
    }

    // call.
    const actual = parseJsonRecursively(json)

    // assertion.
    expect(actual).toStrictEqual({
      key1: 'value1',
      key2: null,
    })
  })

  it('with nested object.', async () => {
    const json = {
      key1: 'value1',
      key2: '{ "key3": "value3" }',
    }

    // call.
    const actual = parseJsonRecursively(json)

    // assertion.
    expect(actual).toStrictEqual({
      key1: 'value1',
      key2: {
        key3: 'value3',
      },
    })
  })

  it('with nested array.', async () => {
    const json = {
      key1: 'value1',
      key2: '[ "value2", "value3" ]',
    }

    // call.
    const actual = parseJsonRecursively(json)

    // assertion.
    expect(actual).toStrictEqual({
      key1: 'value1',
      key2: [
        'value2',
        'value3',
      ],
    })
  })
})

describe('createMarkdownString()', () => {
  it('null', async () => {
    const obj = null

    // call.
    const actual = createMarkdownString(obj)

    // assertion.
    expect(actual).toBe(`
null
    `.trim())
  })

  it('number', async () => {
    const obj = 123

    // call.
    const actual = createMarkdownString(obj)

    // assertion.
    expect(actual).toBe(`
123
    `.trim())
  })

  it('string', async () => {
    const obj = 'hello'

    // call.
    const actual = createMarkdownString(obj)

    // assertion.
    expect(actual).toBe(`
hello
    `.trim())
  })

  it('object', async () => {
    const obj = {
      key1: null,
      key2: 123,
      key3: 'value',
    }

    // call.
    const actual = createMarkdownString(obj)

    // assertion.
    expect(actual).toBe(`
# key1

null

# key2

123

# key3

value
    `.trim())
  })

  it('array', async () => {
    const obj = [
      null,
      123,
      'value',
    ]

    // call.
    const actual = createMarkdownString(obj)

    // assertion.
    expect(actual).toBe(`
# 1

null

# 2

123

# 3

value
    `.trim())
  })

  it('nested object/array', async () => {
    const obj = {
      key1: [
        {
          key2: 'value 2',
        },
      ],
      key3: 'value 3',
    }

    // call.
    const actual = createMarkdownString(obj)

    // assertion.
    expect(actual).toBe(`
# key1

## 1

### key2

value 2

# key3

value 3
    `.trim())
  })
})

