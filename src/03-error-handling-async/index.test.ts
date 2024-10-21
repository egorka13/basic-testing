import {
  throwError,
  throwCustomError,
  resolveValue,
  MyAwesomeError,
  rejectCustomError,
} from './index';

describe('resolveValue', () => {
  test('should resolve provided value', async () => {
    const value = 42;
    await expect(resolveValue(value)).resolves.toBe(value);
  });

  test('should resolve null when provided with null', async () => {
    await expect(resolveValue(null)).resolves.toBe(null);
  });

  test('should resolve an object', async () => {
    const obj = { key: 'value' };
    await expect(resolveValue(obj)).resolves.toEqual(obj);
  });
});

describe('throwError', () => {
  test('should throw error with provided message', () => {
    const customMessage = 'Custom error message';
    expect(() => throwError(customMessage)).toThrow(customMessage);
  });

  test('should throw error with default message if message is not provided', () => {
    expect(() => throwError()).toThrow('Oops!');
  });
});

describe('throwCustomError', () => {
  test('should throw custom error', () => {
    expect(() => throwCustomError()).toThrow(MyAwesomeError);
    expect(() => throwCustomError()).toThrow(
      'This is my awesome custom error!',
    );
  });
});

describe('rejectCustomError', () => {
  test('should reject custom error', async () => {
    await expect(rejectCustomError()).rejects.toThrow(MyAwesomeError);
    await expect(rejectCustomError()).rejects.toThrow(
      'This is my awesome custom error!',
    );
  });
});
