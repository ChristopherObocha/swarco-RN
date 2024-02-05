import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import {useAlert} from 'providers/alert/alert-provider';

import ReactNativeBiometrics, {BiometryTypes} from 'react-native-biometrics';
import {STORAGE, TOKEN_TYPES} from 'utils/constants';
import {getObject, setObject} from 'utils/storage-utils';
import {ChildrenProps} from '../../generic-types';
import {getToken} from 'utils/get-token';
import {useDictionary} from 'providers/dictionary/dictionary-provider';

const {IS_BIOMETRICS_ENABLED} = STORAGE;

type BiometricsContextType = {
  checkBiometrics: () => Promise<boolean>;
  deviceSupportsBiometrics: boolean;
};

export const BiometricsContext = createContext<BiometricsContextType>({
  checkBiometrics: () => Promise.resolve(false),
  deviceSupportsBiometrics: false,
});

export function useBiometrics() {
  const context = useContext(BiometricsContext);
  if (!context) {
    throw new Error(
      '`useBiometrics` hook must be used within an `BiometricsProvider` component',
    );
  }
  return context;
}

const rnBiometrics = new ReactNativeBiometrics();

export const BiometricsProvider = ({children}: ChildrenProps) => {
  const {alert} = useAlert();
  const {
    dictionary: {BiometricsModal},
  } = useDictionary();

  const [deviceSupportsBiometrics, setDeviceSupportsBiometrics] =
    useState(false);

  useEffect(() => {
    const checkDeviceSupportsBiometrics = async () => {
      const {available} = await rnBiometrics.isSensorAvailable();

      setDeviceSupportsBiometrics(available);
    };

    checkDeviceSupportsBiometrics();
  }, []);

  const checkBiometrics = useCallback(async () => {
    const token = getToken(TOKEN_TYPES.ACCESS_TOKEN);
    const guestToken = getObject(STORAGE.GUEST_TOKEN);
    const isBiometricsEnabled = getObject(IS_BIOMETRICS_ENABLED);

    if (!token || !!guestToken || !isBiometricsEnabled) {
      return false;
    }

    try {
      const {available, biometryType} = await rnBiometrics.isSensorAvailable();
      const message =
        biometryType === BiometryTypes.FaceID
          ? BiometricsModal.ConfirmFaceID
          : biometryType === BiometryTypes.Biometrics
          ? BiometricsModal.ConfirmBiometrics
          : biometryType === BiometryTypes.TouchID
          ? BiometricsModal.ConfirmTouchID
          : biometryType || BiometricsModal.ConfirmPassword;

      if (available) {
        const {success} = await rnBiometrics.simplePrompt({
          promptMessage: message,
        });

        return success;
      } else {
        setObject(IS_BIOMETRICS_ENABLED, false);
        alert(BiometricsModal.BiometricsNotAvailable);
        return false;
      }
    } catch (error) {
      setObject(IS_BIOMETRICS_ENABLED, false);
      return false;
    }
  }, [
    BiometricsModal.BiometricsNotAvailable,
    BiometricsModal.ConfirmBiometrics,
    BiometricsModal.ConfirmFaceID,
    BiometricsModal.ConfirmPassword,
    BiometricsModal.ConfirmTouchID,
    alert,
  ]);

  return (
    <BiometricsContext.Provider
      value={{
        checkBiometrics,
        deviceSupportsBiometrics,
      }}>
      {children}
    </BiometricsContext.Provider>
  );
};
