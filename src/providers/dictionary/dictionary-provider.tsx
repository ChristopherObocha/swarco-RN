/*
 * Jira Ticket:
 * Zeplin Design:
 * Feature Document:
 * Created Date: Fri, 18th Aug 2023, 2:156:35 pm
 * Author: Nawaf Ibrahim (nawaf.ibrahim@thedistance.co.uk)
 * Copyright (c) 2023 The Distance
 */

import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
  createContext,
  useContext,
} from 'react';

import {getLocales} from 'react-native-localize';
import {enGB} from './languages/en-gb';
import {ChildrenProps} from '../../generic-types';
import {GlobalStorage} from 'utils/storage-utils';
import {STORAGE} from 'utils/constants';
import {useStateWithCallbackLazy} from 'utils/useStateWithCallbackLazy';
import {checkObjectsForKeyDifferences} from './dictionary-provider-utils';
const {LANGUAGE} = STORAGE;

export type Dictionary = typeof enGB;
export type ErrorBodyType = keyof Dictionary['Errors'];

interface DictionaryProviderInterface {
  locale: string;
  dictionary: Dictionary;
  getLanguage: () => Promise<void>;
  setLanguage: (value: string) => Promise<void>;
  isLocaleSet: boolean;
}

interface LocaleDictionaryMap {
  [key: string]: Dictionary;
}

// ** ** ** ** ** CREATE ** ** ** ** **
const DictionaryContext = createContext<DictionaryProviderInterface | null>(
  null,
);

// ** ** ** ** ** USE ** ** ** ** **
export function useDictionary() {
  const context = useContext(DictionaryContext);
  if (context === undefined || context === null) {
    throw new Error(
      '`useDictionary` hook must be used within a `DictionaryProvider` component',
    );
  }
  return context;
}

export const languageDictionaryMap: LocaleDictionaryMap = {
  default: enGB,
  'en-GB': enGB,
  // 'fr-FR': frFR,
};

function verifyDictionaries() {
  const result = checkObjectsForKeyDifferences(languageDictionaryMap);
  if (result) {
    console.log('Dictionary key differences found:');
    result.forEach(diff => {
      const actionText =
        diff.action === 'missing' ? 'Missing in' : 'Additional in';
      console.log(`${actionText} ${diff.object}: Key '${diff.key}'`);
    });
  } else {
    console.log('No Dictionary key differences found.');
  }
}

verifyDictionaries();

// ** ** ** ** ** PROVIDE ** ** ** ** **
export function DictionaryProvider({children}: ChildrenProps): JSX.Element {
  // ** ** ** ** ** SETUP ** ** ** ** **
  const [locale, setLocale] = useStateWithCallbackLazy('default');
  const [isLocaleSet, setLocaleSet] = useState(false);

  const [dictionary, setDictionary] = useState<Dictionary>(
    languageDictionaryMap.default,
  );

  useEffect(() => {
    console.log('App - locale: ', locale);

    setDictionary(languageDictionaryMap[locale]);
  }, [locale]);

  const getDeviceLocale = useCallback(async () => {
    const currentLocale = GlobalStorage.getString(LANGUAGE);
    if (currentLocale) {
      setLocale(currentLocale);
    } else {
      const locales = getLocales();
      const firstLocale = locales[0];
      const languageTag = firstLocale?.languageTag;
      console.log('Device - languageTag: ', languageTag);
      if (languageTag && languageTag in languageDictionaryMap) {
        setLocale(languageTag, () => setLocaleSet(true));
      } else {
        setLocale('default', () => setLocaleSet(true));
      }
    }
  }, [setLocale]);

  useEffect(() => {
    getDeviceLocale();
  }, [getDeviceLocale]);

  const getLanguage = useCallback(async () => {
    try {
      const language = GlobalStorage.getString(LANGUAGE);
      setLocale(language ?? 'en-GB');
    } catch (e) {
      console.log('Dictionary - fetchLanguage - error: ', e);
    }
    return;
  }, [setLocale]);

  const saveLanguage = useCallback(async (language = 'en-GB') => {
    try {
      GlobalStorage.set(LANGUAGE, language);
    } catch (e) {
      console.log('Dictionary - saveLanguage - error: ', e);
    }
  }, []);

  const setLanguage = useCallback(
    async (value: string) => {
      // Update session locale
      setLocale(value);
      // Update saved value
      return await saveLanguage(value);
    },
    [saveLanguage, setLocale],
  );

  // ** ** ** ** ** MEMOIZE ** ** ** ** **
  const values: DictionaryProviderInterface = useMemo(
    () => ({locale, dictionary, getLanguage, setLanguage, isLocaleSet}),
    [locale, dictionary, getLanguage, setLanguage, isLocaleSet],
  );

  // ** ** ** ** ** RENDER ** ** ** ** **
  return (
    <DictionaryContext.Provider value={values}>
      {children}
    </DictionaryContext.Provider>
  );
}
