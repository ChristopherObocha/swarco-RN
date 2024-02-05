import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {useErrorReport} from 'providers/error-report/error-report-provider';

import {Alert, AlertButton} from 'react-native';
import {ChildrenProps} from '../../generic-types';
import {useDictionary} from 'providers/dictionary/dictionary-provider';

export interface AlertContextInterface {
  alert: (title: string, message?: string, buttons?: AlertButton[]) => void;
}

const AlertContext = createContext<AlertContextInterface | null>(null);

export function useAlert() {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error(
      '`useAlert` hook must be used within an `AlertProvider` component',
    );
  }
  return context;
}

export function AlertProvider(props: ChildrenProps): JSX.Element {
  const {init} = useErrorReport();
  const [alertQueue, setAlertQueue] = useState<
    {title: string; message?: string; buttons?: AlertButton[]}[]
  >([]);
  const [currentAlert, setCurrentAlert] = useState<{
    title: string;
    message?: string;
    buttons?: AlertButton[] | undefined;
  } | null>(null);

  const {
    dictionary: {AlertModal},
  } = useDictionary();

  const showAlert = useCallback(() => {
    if (currentAlert === null && alertQueue.length > 0) {
      setCurrentAlert(alertQueue[0]);
      setAlertQueue(alertQueue.slice(1));
    }
  }, [currentAlert, alertQueue]);

  const alert = useCallback(
    (title: string, message?: string, buttons?: AlertButton[]) => {
      // Check if an alert with the same title and message already exists in the queue
      const alertExists = alertQueue.some(
        alert => alert.title === title && alert.message === message,
      );

      // If it does not exist, add the new alert to the queue
      if (!alertExists) {
        setAlertQueue([...alertQueue, {title, message, buttons}]);
      }
    },
    [alertQueue],
  );
  const values = useMemo(() => {
    return {
      alert,
    };
  }, [alert]);

  useEffect(() => {
    init();
  }, [init]);

  useEffect(() => {
    showAlert();
  }, [alertQueue, showAlert]);

  useEffect(() => {
    if (currentAlert !== null) {
      Alert.alert(
        currentAlert.title,
        currentAlert.message,
        currentAlert.buttons
          ? currentAlert.buttons.map(button => ({
              ...button,
              onPress: () => {
                button.onPress?.();
                setCurrentAlert(null);
              },
            }))
          : [
              {
                text: AlertModal.CTA,
                onPress: () => setCurrentAlert(null),
              },
            ],
      );
    }
  }, [AlertModal.CTA, currentAlert]);

  return (
    <AlertContext.Provider value={values}>
      {props.children}
    </AlertContext.Provider>
  );
}
