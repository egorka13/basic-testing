import { simpleCalculator, Action } from './index';

const testCases = [
  { a: 1, b: 2, action: Action.Add, expected: 3 },
  { a: 2, b: 2, action: Action.Add, expected: 4 },
  { a: 3, b: 2, action: Action.Add, expected: 5 },

  { a: 5, b: 2, action: Action.Subtract, expected: 3 },
  { a: 10, b: 4, action: Action.Subtract, expected: 6 },

  { a: 3, b: 4, action: Action.Multiply, expected: 12 },
  { a: 7, b: 6, action: Action.Multiply, expected: 42 },

  { a: 10, b: 2, action: Action.Divide, expected: 5 },
  { a: 9, b: 3, action: Action.Divide, expected: 3 },
  { a: 10, b: 0, action: Action.Divide, expected: Infinity },

  { a: 2, b: 3, action: Action.Exponentiate, expected: 8 },
  { a: 5, b: 2, action: Action.Exponentiate, expected: 25 },

  { a: 'invalid', b: 3, action: Action.Add, expected: null },
  { a: 3, b: 'invalid', action: Action.Subtract, expected: null },
  { a: 2, b: 3, action: 'invalid', expected: null },
  { a: 'invalid', b: 'invalid', action: Action.Multiply, expected: null },
];

describe('simpleCalculator', () => {
  test.each(testCases)(
    'should return $expected when a is $a, b is $b, and action is $action',
    ({ a, b, action, expected }) => {
      const result = simpleCalculator({ a, b, action });
      expect(result).toBe(expected);
    },
  );
});
