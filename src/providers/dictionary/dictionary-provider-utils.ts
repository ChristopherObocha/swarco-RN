import {JsonObject, LocaleDictionaryMap} from './dictionary-provider-types';

interface KeyDifference {
  key: string;
  object: string;
  action: 'missing' | 'additional';
}

const checkForKeyDifferencesRecursive = (
  referenceObj: JsonObject,
  currentObj: JsonObject,
  objectName: string,
  action: 'missing' | 'additional',
  keyDifferences: KeyDifference[],
): void => {
  const referenceKeys = Object.keys(referenceObj);
  const currentKeys = Object.keys(currentObj);

  for (const key of referenceKeys) {
    if (!currentKeys.includes(key)) {
      keyDifferences.push({key, object: objectName, action});
    } else {
      const referenceValue = referenceObj[key];
      const currentValue = currentObj[key];

      if (
        typeof referenceValue === 'object' &&
        typeof currentValue === 'object'
      ) {
        checkForKeyDifferencesRecursive(
          referenceValue,
          currentValue,
          objectName,
          action,
          keyDifferences,
        );
      }
    }
  }
};

export const checkObjectsForKeyDifferences = (
  map: LocaleDictionaryMap,
): KeyDifference[] | null => {
  const mapEntries = Object.entries(map);
  const keyDifferences: KeyDifference[] = [];

  for (const [objectName, currentObject] of mapEntries) {
    checkForKeyDifferencesRecursive(
      mapEntries[0][1],
      currentObject,
      objectName,
      'missing',
      keyDifferences,
    );
    checkForKeyDifferencesRecursive(
      currentObject,
      mapEntries[0][1],
      objectName,
      'additional',
      keyDifferences,
    );
  }

  return keyDifferences.length > 0 ? keyDifferences : null;
};
