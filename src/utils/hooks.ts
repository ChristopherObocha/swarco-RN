import {useAlert} from 'providers/alert/alert-provider';
import {useDictionary} from 'providers/dictionary/dictionary-provider';
import {setObject} from './storage-utils';
import {PLATFORMS, STORAGE} from './constants';
import {Linking, Platform} from 'react-native';
import {useCharging} from 'providers/apis/charging';

export const useUpdateLocationSettingsAlert = () => {
  const {
    dictionary: {MapSearch},
  } = useDictionary();
  const {alert} = useAlert();

  const updateLocationSettingsAlert = (handleClose?: () => void) => {
    setObject(STORAGE.UPDATE_LOCATION_SETTINGS_ALERT_SHOWN, Date.now());
    alert(
      MapSearch.UpdateLocationSettingsAlert.Title,
      MapSearch.UpdateLocationSettingsAlert.Description,
      [
        {
          text: MapSearch.UpdateLocationSettingsAlert.UpdateButtonText,
          onPress: () => {
            Platform.OS === PLATFORMS.IOS
              ? Linking.openURL('app-settings:')
              : Linking.sendIntent('android.settings.LOCATION_SOURCE_SETTINGS');
          },
        },
        {
          text: MapSearch.UpdateLocationSettingsAlert.CloseButtonText,
          style: 'destructive',
          onPress: handleClose ?? (() => {}),
        },
      ],
    );
  };

  return updateLocationSettingsAlert;
};

export const useHandleLinkPress = () => {
  const {alert} = useAlert();
  const {
    dictionary: {Errors},
  } = useDictionary();

  const handleLinkPress = (url: string) => {
    if (!url) {
      const {Title, Description, CTA} = Errors.NoUrl;

      alert(Title, Description, [{text: CTA}]);
      return;
    }

    Linking.canOpenURL(url)
      .then(supported => {
        if (supported) {
          Linking.openURL(url);
        } else {
          const {Title, Description, CTA} = Errors.UrlError;

          alert(Title, Description, [{text: CTA}]);
        }
      })
      .catch(error => {
        const {Title, Description, CTA} = Errors.unknown;

        console.log(error);
        alert(Title, Description, [{text: CTA}]);
      });
  };

  return handleLinkPress;
};

export const useCheckActiveSession = () => {
  const {checkActiveSession} = useCharging();

  const checkIfUserIsCharging = async () => {
    const response = await checkActiveSession();
    return response.success && response?.data?.charging_point_id;
  };

  return checkIfUserIsCharging;
};
