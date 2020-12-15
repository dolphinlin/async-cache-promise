import type { Options } from 'lru-cache';
export declare type IPending<V> = [
    (value: V | PromiseLike<V>) => void,
    (reason: any) => void
];
export declare type ILoaderFunc<V> = (key: string) => Promise<V>;
export interface IAsyncCacheOptions<K, V> extends Options<K, V> {
    load: ILoaderFunc<V>;
}
declare class AsyncCache<V = unknown> {
    private cache;
    private pending;
    private load;
    constructor(opt: IAsyncCacheOptions<string, V>);
    get(key: string): Promise<V>;
    keys(): string[];
    set(key: string, val: V, maxAge?: number): boolean;
    reset(): void;
    has(key: string): boolean;
    del(key: string): void;
    peek(key: string): V | null | undefined;
}
export default AsyncCache;
