import {
  getBankAccount,
  InsufficientFundsError,
  SynchronizationFailedError,
  TransferFailedError,
} from './index';
import { random } from 'lodash';

jest.mock('lodash', () => ({
  random: jest.fn(),
}));

describe('BankAccount', () => {
  test('should create account with initial balance', () => {
    const account = getBankAccount(100);
    expect(account.getBalance()).toBe(100);
  });

  test('should throw InsufficientFundsError error when withdrawing more than balance', () => {
    const account = getBankAccount(100);
    expect(() => account.withdraw(200)).toThrow(InsufficientFundsError);
    expect(() => account.withdraw(200)).toThrow(
      'Insufficient funds: cannot withdraw more than 100',
    );
  });

  test('should throw error when transferring more than balance', () => {
    const account = getBankAccount(50);
    const targetAccount = getBankAccount(100);

    expect(() => account.transfer(100, targetAccount)).toThrow(
      InsufficientFundsError,
    );
    expect(() => account.transfer(100, targetAccount)).toThrow(
      'Insufficient funds: cannot withdraw more than 50',
    );
  });

  test('should throw error when transferring to the same account', () => {
    const account = getBankAccount(50);

    expect(() => account.transfer(50, account)).toThrow(TransferFailedError);
    expect(() => account.transfer(50, account)).toThrow('Transfer failed');
  });

  test('should deposit money', () => {
    const account = getBankAccount(100);
    account.deposit(50);
    expect(account.getBalance()).toBe(150);
  });

  test('should withdraw money', () => {
    const account = getBankAccount(100);
    account.withdraw(50);
    expect(account.getBalance()).toBe(50);
  });

  test('should transfer money', () => {
    const account = getBankAccount(100);
    const targetAccount = getBankAccount(50);

    account.transfer(50, targetAccount);

    expect(account.getBalance()).toBe(50);
    expect(targetAccount.getBalance()).toBe(100);
  });

  test('fetchBalance should return number in case if request did not failed', async () => {
    (random as jest.Mock).mockReturnValueOnce(80);
    (random as jest.Mock).mockReturnValueOnce(1); // Request succeeded

    const account = getBankAccount(100);
    const balance = await account.fetchBalance();
    expect(typeof balance).toBe('number');
  });

  test('should set new balance if fetchBalance returned number', async () => {
    (random as jest.Mock).mockReturnValueOnce(80);
    (random as jest.Mock).mockReturnValueOnce(1); // Request succeeded

    const account = getBankAccount(100);
    const balance = await account.fetchBalance();
    expect(balance).toBe(80);
  });

  test('should throw SynchronizationFailedError if fetchBalance returned null', async () => {
    (random as jest.Mock).mockReturnValueOnce(80);
    (random as jest.Mock).mockReturnValueOnce(0); // Request failed

    const account = getBankAccount(100);
    await expect(account.synchronizeBalance()).rejects.toThrow(
      SynchronizationFailedError,
    );
  });
});
