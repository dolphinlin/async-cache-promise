export interface IMockDB {
  data: {
    [key: string]: any;
  };
  get: (key: string) => Promise<any>;
}

export const mockDB: IMockDB = {
  data: {
    'serial-001': 0,
    'serial-002': 0,
  },
  get(key: string) {
    return new Promise((resolve, reject) => {
      if (this.data[key] === undefined)
        return reject(new Error('key not found.'));
      const val = ++this.data[key];

      return resolve(val);
    });
  },
};
