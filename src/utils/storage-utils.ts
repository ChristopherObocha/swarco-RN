import {Secrets, fetchSecrets} from '../config/fetch-secrets';
import {MMKV} from 'react-native-mmkv';
import {STORAGE} from './constants';

const secrets: Secrets | null = fetchSecrets();

if (!secrets) {
  throw new Error('Failed to fetch secrets.');
}

const GlobalStorage: MMKV = new MMKV({
  id: 'global-storage',
  encryptionKey: secrets.encryptionKey,
});

const ApolloCacheStorage = new MMKV({
  id: 'apollo-cache-storage',
  encryptionKey: fetchSecrets().encryptionKey,
});

const setObject = function <T>(name: string, value: T): void {
  try {
    // Serialize the object into a JSON string
    const stringifiedValue = value === undefined ? null : JSON.stringify(value);

    if (!stringifiedValue) {
      GlobalStorage.delete(name);
    } else {
      GlobalStorage.set(name, stringifiedValue);
    }
  } catch (error) {
    console.log(
      `Failed to set name: ${name}, value: ${value}, typeof value: ${typeof value} in storage.`,
    );
  }
};

const getObject = function <T>(name: string): T | undefined {
  // Deserialize the JSON string into an object
  const jsonString = GlobalStorage.getString(name);
  if (!jsonString) {
    return undefined;
  }

  const json = JSON.parse(jsonString) as T;
  return json;
};

const deleteObject = function (name: string): void {
  GlobalStorage.delete(name);
};

const clearStorage = function (): void {
  const persistedValues = [
    STORAGE.SHOWN_WALKTHROUGH,
    STORAGE.IS_BIOMETRICS_ENABLED,
  ];
  for (let key in STORAGE) {
    const value: string = STORAGE[key as keyof typeof STORAGE];
    if (!persistedValues.includes(value)) {
      deleteObject(value);
    }
  }
};

const clearGuestStorage = function (): void {
  deleteObject(STORAGE.GUEST_USERNAME);
  deleteObject(STORAGE.GUEST_PASSWORD);
  deleteObject(STORAGE.GUEST_TOKEN);
};

const clearAppSettings = function (): void {
  deleteObject(STORAGE.ANALYTICS);
  deleteObject(STORAGE.LOCATION);
  deleteObject(STORAGE.CRASHLYTICS);
};

export {
  GlobalStorage,
  ApolloCacheStorage,
  getObject,
  setObject,
  deleteObject,
  clearStorage,
  clearGuestStorage,
  clearAppSettings,
};
