import analytics from '@react-native-firebase/analytics';
import crashlytics from '@react-native-firebase/crashlytics';
import {format} from 'date-fns';

import {STORAGE} from './constants';
import {GlobalStorage} from './storage-utils';

export const firebaseAnalyticsEvent = async (
  event: string,
  params: object = {},
) => {
  const allowed: boolean | undefined = GlobalStorage.getBoolean(
    STORAGE.ANALYTICS,
  );

  if (allowed) {
    const time = format(new Date(), 'hh:mm');
    const date = format(new Date(), 'dd/MM/yyyy');
    console.log('firebaseAnalyticsEvent', event + ' at ' + time + ', ' + date);

    analytics().logEvent(event, params);
  } else {
    console.log(STORAGE.ANALYTICS, !!allowed);
  }
};

export const firebaseCrashlyticsEvent = async (error?: string | Error) => {
  const allowed: boolean | undefined =
    !__DEV__ && GlobalStorage.getBoolean(STORAGE.CRASHLYTICS);

  if (allowed) {
    if (typeof error === 'string') {
      crashlytics().recordError(new Error(error));
    } else if (error) {
      crashlytics().recordError(error);
    } else {
      crashlytics().recordError(new Error());
    }
  } else {
    console.log(STORAGE.CRASHLYTICS, !!allowed);
  }
};
