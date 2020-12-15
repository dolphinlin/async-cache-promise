import AsyncCache from '../asyncCache';
import { mockDB } from './mockDB';

describe('AsyncCache method', () => {
  const asyncCache = new AsyncCache<number>({
    load: (key) => mockDB.get(key),
  });

  const key1 = 'serial-001';
  const key2 = 'serial-002';

  it('get method should be return correct value.', async () => {
    const result = await asyncCache.get(key1);

    return expect(result).toBe(1);
  });

  it('db data should be called one time.', async () => {
    const [result1, result2, result3] = await Promise.all([
      asyncCache.get(key1),
      asyncCache.get(key2),
      asyncCache.get(key2),
    ]);

    return expect([result1, result2, result3]).toStrictEqual([1, 1, 1]);
  });

  it('has method should be return True', () => {
    expect(asyncCache.has(key1)).toBe(true);
  });

  it('delete method test', async () => {
    asyncCache.del(key1);

    expect(asyncCache.has(key1)).toBe(false);

    const newResult = await asyncCache.get(key1);

    return expect(newResult).toBe(2);
  });
});
