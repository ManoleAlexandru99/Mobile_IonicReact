export const baseUrl = 'localhost:3000';

export const getLogger: (tag: string) => (...args: any) => void =
    tag => (...args) => console.log(tag, ...args);

const log = getLogger('api');

export interface ResponseProps<T> {
  data: T;
}

export function baseFunction<T>(promise: Promise<ResponseProps<T>>, fname: string): Promise<T> {
  console.log(`${fname} - started`);
  return promise
  .then(res => { return Promise.resolve(res.data)})
  .catch(err => { return Promise.reject(err)})
}

export const config = {
  headers: {
    'Content-Type': 'application/json'
  }
};

export const authConfig = (token?: string) => ({
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  }
});
