import LRU from 'lru-cache';
import type { Options } from 'lru-cache';

export type IPending<V> = [
  (value: V | PromiseLike<V>) => void,
  (reason: any) => void
];

export type ILoaderFunc<V> = (key: string) => Promise<V>;

export interface IAsyncCacheOptions<K, V> extends Options<K, V> {
  load: ILoaderFunc<V>;
}

class AsyncCache<V = unknown> {
  private cache: LRU<string, V | null>;

  private pending: Map<string, IPending<V>[]>;

  private load: ILoaderFunc<V>;

  constructor(opt: IAsyncCacheOptions<string, V>) {
    const { load, ...lruOpt } = opt || {};

    this.cache = new LRU(lruOpt);
    this.pending = new Map();
    this.load = load;
  }

  get(key: string): Promise<V> {
    // see: https://cn.eslint.org/docs/rules/no-async-promise-executor
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
      /**
       * if the key were pending, it would wait for previous request finish.
       */
      const pending = this.pending.get(key) || [];

      pending.push([resolve, reject]);

      if (this.pending.has(key)) {
        return this.pending.set(key, pending);
      }

      const hasValue = this.cache.has(key);
      const cached = this.cache.get(key);

      if (hasValue && cached) {
        return resolve(cached);
      }

      this.pending.set(key, pending);

      try {
        const res = await this.load(key);

        this.cache.set(key, res);

        // get new pending
        this.pending.get(key)?.forEach(([cb]) => cb(res));
      } catch (err) {
        // get new pending
        this.pending.get(key)?.forEach(([, cb]) => cb(err));
      } finally {
        this.pending.delete(key);
      }
    });
  }

  keys() {
    return this.cache.keys();
  }

  set(key: string, val: V, maxAge?: number) {
    return this.cache.set(key, val, maxAge);
  }

  reset() {
    return this.cache.reset();
  }

  has(key: string) {
    return this.cache.has(key);
  }

  del(key: string) {
    return this.cache.del(key);
  }

  peek(key: string) {
    return this.cache.peek(key);
  }
}

export default AsyncCache;
