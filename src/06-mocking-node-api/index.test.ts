import {
  readFileAsynchronously,
  doStuffByTimeout,
  doStuffByInterval,
} from './index';
import { existsSync } from 'fs';
import { readFile } from 'fs/promises';
import path from 'path';

jest.mock('fs');
jest.mock('fs/promises');

describe('doStuffByTimeout', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set timeout with provided callback and timeout', () => {
    const callback = jest.fn();
    const timeout = 1000;
    const setTimeoutSpy = jest.spyOn(global, 'setTimeout');

    doStuffByTimeout(callback, timeout);

    expect(setTimeoutSpy).toHaveBeenCalledWith(callback, timeout);

    setTimeoutSpy.mockRestore();
  });

  test('should call callback only after timeout', () => {
    const callback = jest.fn();
    doStuffByTimeout(callback, 1000);

    expect(callback).not.toHaveBeenCalled();

    jest.advanceTimersByTime(1000);
    expect(callback).toHaveBeenCalled();
  });
});

describe('doStuffByInterval', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set interval with provided callback and timeout', () => {
    const callback = jest.fn();
    const interval = 1000;
    const setIntervalSpy = jest.spyOn(global, 'setInterval');

    doStuffByInterval(callback, interval);

    expect(setIntervalSpy).toHaveBeenCalledWith(callback, interval);

    setIntervalSpy.mockRestore();
  });

  test('should call callback multiple times after multiple intervals', () => {
    const callback = jest.fn();
    doStuffByInterval(callback, 1000);

    expect(callback).not.toHaveBeenCalled();

    jest.advanceTimersByTime(1000);
    expect(callback).toHaveBeenCalledTimes(1);

    jest.advanceTimersByTime(1000);
    expect(callback).toHaveBeenCalledTimes(2);
  });
});

describe('readFileAsynchronously', () => {
  const mockedExistsSync = existsSync as jest.Mock;
  const mockedReadFile = readFile as jest.Mock;

  beforeEach(() => {
    mockedExistsSync.mockClear();
    mockedReadFile.mockClear();
  });

  test('should call join with pathToFile', async () => {
    const mockedJoin = jest.spyOn(path, 'join');
    const fakeContent = Buffer.from('This is a test file');
    mockedExistsSync.mockReturnValue(true);
    mockedReadFile.mockResolvedValue(fakeContent);

    await readFileAsynchronously('test.txt');

    expect(mockedJoin).toHaveBeenCalledWith(__dirname, 'test.txt');
  });

  test('should return null if file does not exist', async () => {
    mockedExistsSync.mockReturnValue(false);

    const result = await readFileAsynchronously('nonexistent.txt');

    expect(mockedExistsSync).toHaveBeenCalledWith(
      expect.stringContaining('nonexistent.txt'),
    );
    expect(mockedReadFile).not.toHaveBeenCalled();
    expect(result).toBeNull();
  });

  test('should return file content if file exists', async () => {
    const fakeContent = Buffer.from('This is a test file');
    mockedExistsSync.mockReturnValue(true);
    mockedReadFile.mockResolvedValue(fakeContent);

    const result = await readFileAsynchronously('test.txt');

    expect(mockedExistsSync).toHaveBeenCalledWith(
      expect.stringContaining('test.txt'),
    );
    expect(mockedReadFile).toHaveBeenCalledWith(
      expect.stringContaining('test.txt'),
    );
    expect(result).toBe('This is a test file');
  });
});
