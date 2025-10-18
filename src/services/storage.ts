import { MMKV } from 'react-native-mmkv';

export const storage = new MMKV();

export const set = (key: string, value: string) => storage.set(key, value);
export const get = (key: string) => storage.getString(key);
export const remove = (key: string) => storage.delete(key);