export interface IMockDB {
    data: {
        [key: string]: any;
    };
    get: (key: string) => Promise<any>;
}
export declare const mockDB: IMockDB;
