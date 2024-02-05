import {firebaseCrashlyticsEvent} from 'utils/error-logging';
import {STORAGE} from 'utils/constants';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
} from 'react';
import {
  setJSExceptionHandler,
  setNativeExceptionHandler,
} from 'react-native-exception-handler';

import ErrorBoundary from 'react-native-error-boundary';
import analytics from '@react-native-firebase/analytics';
import crashlytics from '@react-native-firebase/crashlytics';
import {GlobalStorage} from '../../utils/storage-utils';
import {ChildrenProps} from '../../generic-types';

interface ErrorReportContextInterface {
  init: () => Promise<void>;
}

const ErrorReportContext = createContext<ErrorReportContextInterface | null>(
  null,
);

export function useErrorReport() {
  const context = useContext(ErrorReportContext);
  if (!context) {
    throw new Error(
      '`useErrorReport` hook must be used within an `ErrorReportProvider` component',
    );
  }
  return context;
}

const errorHandler = (e: Error, isFatal: boolean) => {
  console.log('setJSExceptionHandler:', e, isFatal);
  if (isFatal) {
    // Handle fatal error
  } else {
    // Handle non-fatal error
  }
  firebaseCrashlyticsEvent(e);
};

setJSExceptionHandler(errorHandler, true);

setNativeExceptionHandler((errorString: string) => {
  console.log('setNativeExceptionHandler:', errorString);
  firebaseCrashlyticsEvent(errorString);
});

export function ErrorReportProvider(props: ChildrenProps): JSX.Element {
  const init = useCallback(async () => {
    const analyticsAllowed = GlobalStorage.getBoolean(STORAGE.ANALYTICS);
    const crashlyticsAllowed = GlobalStorage.getBoolean(STORAGE.CRASHLYTICS);

    analytics().setAnalyticsCollectionEnabled(
      analyticsAllowed === undefined ? true : analyticsAllowed,
    );
    crashlytics().setCrashlyticsCollectionEnabled(
      crashlyticsAllowed === undefined ? true : crashlyticsAllowed,
    );
  }, []);

  useEffect(() => {
    analytics()
      .getAppInstanceId()
      .then(instanceId =>
        console.log('FirebaseAnalytics.AppInstanceId:', instanceId),
      )
      .catch(error => console.log('FirebaseAnalytics.AppInstanceId:', error));

    init();
  }, [init]);

  const values: ErrorReportContextInterface = useMemo(() => ({init}), [init]);

  return (
    <ErrorBoundary onError={error => firebaseCrashlyticsEvent(error)}>
      <ErrorReportContext.Provider value={values}>
        {props.children}
      </ErrorReportContext.Provider>
    </ErrorBoundary>
  );
}
