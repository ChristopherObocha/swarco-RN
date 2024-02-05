import JailMonkey from 'jail-monkey';
import {isEmulatorSync} from 'react-native-device-info';
import {APP_RESTRICTIONS} from 'utils/constants';

const {JAIL_BROKEN, SUSPICIOUS_APP, IS_EMULATOR} = APP_RESTRICTIONS;

const restrictAccess = () => {
  if (__DEV__) {
    return false;
  }

  if (JailMonkey.isJailBroken()) {
    return JAIL_BROKEN;
  } else if (JailMonkey.hookDetected()) {
    return SUSPICIOUS_APP;
  } else if (isEmulatorSync()) {
    return IS_EMULATOR;
  }
};

export {restrictAccess};
