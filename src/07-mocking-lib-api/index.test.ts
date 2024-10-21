import axios from 'axios';
import { throttledGetDataFromApi } from './index';

jest.mock('axios');
jest.mock('lodash', () => ({
  throttle: jest.fn((fn) => fn),
}));

describe('throttledGetDataFromApi', () => {
  const mockedAxios = axios.create as jest.Mock;

  beforeEach(() => {
    mockedAxios.mockClear();
  });

  test('should create instance with provided base url', async () => {
    mockedAxios.mockReturnValue({
      get: jest.fn().mockResolvedValue({ data: {} }),
    });

    await throttledGetDataFromApi('/posts/1');

    expect(mockedAxios).toHaveBeenCalledWith({
      baseURL: 'https://jsonplaceholder.typicode.com',
    });
  });

  test('should perform request to correct provided url', async () => {
    const mockGet = jest.fn().mockResolvedValue({ data: {} });
    mockedAxios.mockReturnValue({ get: mockGet });

    await throttledGetDataFromApi('/posts/1');

    expect(mockGet).toHaveBeenCalledWith('/posts/1');
  });

  test('should return response data', async () => {
    const fakeResponseData = { id: 1, title: 'Test Post' };
    mockedAxios.mockReturnValue({
      get: jest.fn().mockResolvedValue({ data: fakeResponseData }),
    });

    const result = await throttledGetDataFromApi('/posts/1');

    expect(result).toEqual(fakeResponseData);
  });
});
