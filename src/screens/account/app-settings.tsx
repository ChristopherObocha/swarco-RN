/*
 * Jira Ticket:
 * Zeplin Design:
 * Feature Document:
 * Created Date: Tue, 24th Oct 2023, 12:14:47 pm
 * Author: Christopher Obocha (chris.obocha@thedistance.co.uk)
 * Copyright (c) 2023 The Distance
 */

import React, {useMemo, useState, useEffect, useCallback, useRef} from 'react';

import {useScale} from 'providers/style/scale-provider';
import {useStyle} from 'providers/style/style-provider';
import {useDictionary} from 'providers/dictionary/dictionary-provider';
import {useProfile} from 'providers/apis/profile';
import {useUser} from 'providers/apis/user';
import {useAlert} from 'providers/alert/alert-provider';
import {useBiometrics} from 'providers/biometrics/biometrics-provider';
import {getObject, setObject} from 'utils/storage-utils';
import {PLATFORMS, STORAGE} from 'utils/constants';
import {LoadingView} from 'components/utils/loading-view';

import {
  View,
  StyleSheet,
  Text,
  SectionList,
  Platform,
  AppState,
  AppStateStatus,
} from 'react-native';
import {Spacer} from 'components/utils/spacer';
import DefaultHeader from 'components/headers/default-header';
import {Switch} from '@rneui/themed';

import ScreenContainer from 'components/containers/screen-container';
import {getAppVersion} from 'utils/general-utils';
import {PERMISSIONS, check, RESULTS, request} from 'react-native-permissions';
import {useUpdateLocationSettingsAlert} from 'utils/hooks';

const AppSettings = () => {
  const testID = 'app-settings';
  const {profile, getAppSettings} = useProfile();
  const {updateAppSettings} = useUser();
  const {deviceSupportsBiometrics, checkBiometrics} = useBiometrics();
  const {IS_BIOMETRICS_ENABLED} = STORAGE;
  const {coloursTheme, textStyles, palette} = useStyle();
  const {getHeight, getWidth, getRadius} = useScale();
  const {alert} = useAlert();
  const {
    dictionary: {AppSettings, Errors},
  } = useDictionary();

  const isLoggedIn = !getObject(STORAGE.GUEST_TOKEN);

  const locationSettings = getObject(STORAGE.LOCATION) || false;
  const analyticsSettings = getObject(STORAGE.ANALYTICS) || false;
  const crashlyticsSettings = getObject(STORAGE.CRASHLYTICS) || false;

  const defaultAppSettings = useMemo(() => {
    return {
      chargingNotifications: false,
      advertNotifications: false,
      locationNotifications: false,
      tariffNotifications: false,
      paymentNotifications: false,
      location: locationSettings,
      analytics: analyticsSettings,
      errorReports: crashlyticsSettings,
      biometrics: getObject(IS_BIOMETRICS_ENABLED) || false,
    };
  }, [
    IS_BIOMETRICS_ENABLED,
    analyticsSettings,
    crashlyticsSettings,
    locationSettings,
  ]);

  const [appSettings, setAppSettings] = useState<any | undefined>(
    defaultAppSettings,
  );

  //this takes appsSettings to the desired format. Once appSettings is returned directly from the provider, setSwitches directly to appSettings
  const devSettings = useMemo(() => {
    return {
      chargingNotifications: appSettings?.chargingNotifications,
      advertNotifications: appSettings?.advertNotifications,
      locationNotifications: appSettings?.locationNotifications,
      tariffNotifications: appSettings?.tariffNotifications,
      paymentNotifications: appSettings?.paymentNotifications,
      location: appSettings?.location,
      analytics: appSettings?.analytics,
      errorReports: appSettings?.errorReports,
      biometrics: appSettings?.biometrics,
    };
  }, [
    appSettings?.advertNotifications,
    appSettings?.analytics,
    appSettings?.biometrics,
    appSettings?.chargingNotifications,
    appSettings?.errorReports,
    appSettings?.location,
    appSettings?.locationNotifications,
    appSettings?.paymentNotifications,
    appSettings?.tariffNotifications,
  ]);

  const [switches, setSwitches] = useState(devSettings);

  const allNotifications = useMemo(() => {
    const notifications =
      devSettings.advertNotifications &&
      devSettings.chargingNotifications &&
      devSettings.locationNotifications &&
      devSettings.paymentNotifications &&
      devSettings.tariffNotifications;

    return notifications;
  }, [devSettings]);

  const [allNotificationsState, setAllNotifications] = useState(
    allNotifications === true ? true : false,
  );

  useEffect(() => {
    setAllNotifications(allNotifications === true ? true : false);
  }, [allNotifications]);

  const settingsContent = useMemo(() => {
    const guestToken = getObject(STORAGE.GUEST_TOKEN);

    const baseData = [
      {
        title: AppSettings.YourLocation,
        description: AppSettings.YourLocationContent,
        isEnabled: switches.location,
      },
      {
        title: AppSettings.Analytics,
        description: AppSettings.AnalyticsContent,
        isEnabled: switches.analytics,
      },
      {
        title: AppSettings.ErrorReports,
        description: AppSettings.ErrorReportsContent,
        isEnabled: switches.errorReports,
      },
    ];

    if (!guestToken && deviceSupportsBiometrics) {
      // Add the AppSettings.Biometrics object based on following conditions:
      // - user is logged in
      // - device supports biometrics
      baseData.push({
        title: AppSettings.Biometrics,
        description: AppSettings.BiometricsContent,
        isEnabled: switches.biometrics,
      });
    }

    // const notificationsData = [
    //   {
    //     title: AppSettings.AllNotifications,
    //     isEnabled: allNotificationsState,
    //   },
    //   {
    //     title: AppSettings.ChargingOverstay,
    //     description: AppSettings.ChargingOverstayContent,
    //     isEnabled: switches.chargingNotifications,
    //   },
    //   {
    //     title: AppSettings.Payments,
    //     description: AppSettings.PaymentsContent,
    //     isEnabled: switches.paymentNotifications,
    //   },
    //   {
    //     title: AppSettings.Location,
    //     description: AppSettings.LocationContent,
    //     isEnabled: switches.locationNotifications,
    //   },
    //   {
    //     title: AppSettings.Tariff,
    //     description: AppSettings.TariffContent,
    //     isEnabled: switches.tariffNotifications,
    //   },
    //   {
    //     title: AppSettings.Network,
    //     description: AppSettings.NetworkContent,
    //     isEnabled: switches.advertNotifications,
    //   },
    // ];

    return [
      {
        data: baseData,
      },
      // {  notifications is not part of R2
      //   title: AppSettings.Notifications,
      //   data: notificationsData,
      // },
    ];
  }, [
    AppSettings.YourLocation,
    AppSettings.YourLocationContent,
    AppSettings.Analytics,
    AppSettings.AnalyticsContent,
    AppSettings.ErrorReports,
    AppSettings.ErrorReportsContent,
    AppSettings.Biometrics,
    AppSettings.BiometricsContent,
    switches.location,
    switches.analytics,
    switches.errorReports,
    switches.biometrics,
    deviceSupportsBiometrics,
  ]);

  const callAppSettings = useCallback(async () => {
    const res = await getAppSettings();
    if (!res?.success) {
      const {Title, Description, CTA} = Errors.unknown;

      alert(Title, Description, [
        {
          text: CTA,
        },
      ]);
    }

    setObject(STORAGE.LOCATION, res?.data?.location);
    setObject(STORAGE.ANALYTICS, res?.data?.analytics);
    setObject(STORAGE.CRASHLYTICS, res?.data?.errorReports);

    setAppSettings((prevSettings: typeof defaultAppSettings) => {
      return {
        ...prevSettings,
        location: res?.data?.location,
        analytics: res?.data?.analytics,
        errorReports: res?.data?.errorReports,
      };
    });
  }, [getAppSettings, Errors.unknown, alert]);

  const updateBiometrics = async (propertyName: string, newValue: boolean) => {
    if (newValue === false) {
      setObject(IS_BIOMETRICS_ENABLED, false);
      const params = {
        ...switches,
        [propertyName]: newValue,
      };

      setSwitches(params);
    } else {
      setObject(IS_BIOMETRICS_ENABLED, true);
      const isBiometricsEnabled = await checkBiometrics();

      if (isBiometricsEnabled === true) {
        const params = {
          ...switches,
          [propertyName]: newValue,
        };

        setSwitches(params);
      } else {
        setObject(IS_BIOMETRICS_ENABLED, false);
      }
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      callAppSettings();
    }
  }, [callAppSettings, isLoggedIn, profile, switches]);

  useEffect(() => {
    setSwitches(devSettings);
  }, [devSettings]);

  // ** ** ** ** ** ACTIONS ** ** ** ** *

  const updateProperty = async (propertyName: string, newValue: boolean) => {
    const params = {
      ...switches,
      [propertyName]: newValue,
    };
    try {
      if (isLoggedIn) {
        const res = await updateAppSettings(params);
        console.log(res);
        if (!res.success) {
          const {Title, Description, CTA} = Errors.unknown;

          alert(Title, Description, [
            {
              text: CTA,
            },
          ]);
        }
      }

      setSwitches(params);
    } catch (error) {
      console.log(error);
    }
  };

  const updateAllNotifications = async (newValue: boolean) => {
    const params = {
      ...switches,
      chargingNotifications: newValue,
      advertNotifications: newValue,
      locationNotifications: newValue,
      tariffNotifications: newValue,
      paymentNotifications: newValue,
    };

    const res = await updateAppSettings(params);
    if (!res.success) {
      const {Title, Description, CTA} = Errors.unknown;

      alert(Title, Description, [
        {
          text: CTA,
        },
      ]);
    }

    setAllNotifications(newValue);
    setSwitches(params);
  };
  const updateLocationSettingsAlert = useUpdateLocationSettingsAlert();

  const handleClose = useCallback(() => {
    setObject(STORAGE.LOCATION, false);
    updateProperty('location', false);
  }, [updateProperty]);

  const checkLocationPermission = useCallback(async () => {
    const locationPermission =
      Platform.OS === PLATFORMS.IOS
        ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
        : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;
    const locationSettingAllowed = getObject(STORAGE.LOCATION);
    check(locationPermission).then((checkResult: string) => {
      if (
        checkResult === RESULTS.DENIED ||
        checkResult === RESULTS.LIMITED ||
        checkResult === RESULTS.BLOCKED
      ) {
        request(locationPermission).then(async (requestResult: string) => {
          const updateLocationSettingsAlertAlreadyShown = (await getObject(
            STORAGE.UPDATE_LOCATION_SETTINGS_ALERT_SHOWN,
          )) as number;
          const now = Date.now();

          if (
            (requestResult !== RESULTS.GRANTED &&
              !updateLocationSettingsAlertAlreadyShown) ||
            now - updateLocationSettingsAlertAlreadyShown > 5000
          ) {
            setObject(STORAGE.LOCATION, true);
            updateLocationSettingsAlert(handleClose);
          } else if (
            requestResult === RESULTS.GRANTED &&
            locationSettingAllowed !== false
          ) {
            setObject(STORAGE.LOCATION, true);
          } else if (requestResult !== RESULTS.GRANTED) {
            handleClose();
          }
        });
      } else if (
        checkResult === RESULTS.GRANTED &&
        locationSettingAllowed !== false
      ) {
        updateProperty('location', true);
      }
    });
  }, [handleClose, updateLocationSettingsAlert, updateProperty]);

  const appState = useRef(AppState.currentState);
  const appStateListener = useCallback(
    async (nextAppState: AppStateStatus) => {
      if (appState.current === 'background' && nextAppState === 'active') {
        checkLocationPermission();
      }

      appState.current = nextAppState;
    },
    [checkLocationPermission],
  );

  useEffect(() => {
    const listener = AppState.addEventListener('change', appStateListener);
    return () => {
      listener.remove();
    };
  }, [appStateListener]);

  const toggleSwitch = (title: string) => {
    switch (title) {
      case AppSettings.YourLocation:
        const newValue = !switches.location;
        if (newValue) {
          checkLocationPermission();
        }
        setObject(STORAGE.LOCATION, newValue);
        updateProperty('location', newValue);
        break;
      case AppSettings.Analytics:
        const analyticsValue = !switches.analytics;
        setObject(STORAGE.ANALYTICS, analyticsValue);
        updateProperty('analytics', analyticsValue);
        break;
      case AppSettings.ErrorReports:
        const errorReportsValue = !switches.errorReports;
        setObject(STORAGE.CRASHLYTICS, errorReportsValue);
        updateProperty('errorReports', errorReportsValue);
        break;
      case AppSettings.Biometrics:
        updateBiometrics('biometrics', !switches.biometrics);
        break;
      case AppSettings.AllNotifications:
        updateAllNotifications(!allNotificationsState);
        break;
      case AppSettings.ChargingOverstay:
        updateProperty(
          'chargingNotifications',
          !switches.chargingNotifications,
        );
        break;
      case AppSettings.Payments:
        updateProperty('paymentNotifications', !switches.paymentNotifications);
        break;
      case AppSettings.Location:
        updateProperty(
          'locationNotifications',
          !switches.locationNotifications,
        );
        break;
      case AppSettings.Tariff:
        updateProperty('tariffNotifications', !switches.tariffNotifications);
        break;
      case AppSettings.Network:
        updateProperty('advertNotifications', !switches.advertNotifications);
        break;
      default:
        break;
    }
  };

  // ** ** ** ** ** STYLES ** ** ** ** **
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: coloursTheme.backgroundColor,
    },
    sectionListContentContainer: {
      paddingHorizontal: getWidth(20),
    },
    title: {
      ...textStyles.semiBold18,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: coloursTheme.card.backgroundColor,
      marginBottom: getHeight(15),
      paddingHorizontal: getWidth(15),
      paddingVertical: getHeight(15),
      borderRadius: getRadius(10),
    },
    secondSection: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: coloursTheme.card.backgroundColor,
      paddingHorizontal: getWidth(15),
      paddingVertical: getHeight(15),
    },
    secondSectionTop: {
      borderTopLeftRadius: getRadius(10),
      borderTopRightRadius: getRadius(10),
      paddingVertical: getHeight(15),
    },
    secondSectionBottom: {
      borderBottomLeftRadius: getRadius(10),
      borderBottomRightRadius: getRadius(10),
      paddingVertical: getHeight(15),
    },
    secondSectionContainer: {
      minHeight: getHeight(5),
      minWidth: getWidth(5),
    },
    descriptionContainer: {
      width: getWidth(237),
    },
    switchContainer: {
      width: getWidth(75),
      alignItems: 'flex-end',
      height: '100%',
    },
    switchTrackStyle: {
      height: getHeight(30),
      width: getWidth(50),
    },
    switchThumbStyle: {
      height: getHeight(26),
      width: getWidth(26),
      borderRadius: getRadius(26 / 2),
    },
    sectionTitle: {
      ...textStyles.semiBold18,
    },
    subsectionTitle: {
      ...textStyles.semiBold18,
    },
    subsectionDescription: {
      ...textStyles.regular16,
    },
    version: {
      ...textStyles.regular16,
      color: palette.grey,
      alignSelf: 'center',
    },
  });

  // ** ** ** ** ** RENDER ** ** ** ** *
  if (!appSettings) {
    return <LoadingView />;
  }

  const renderItem = ({item, index, section}: any) => {
    const firstSection = section.data.length === 4;
    let itemStyle =
      section.data.length <= 4 || index === 0
        ? styles.row
        : styles.secondSection;

    let secondSectionStyle =
      !firstSection && index === 1 ? styles.secondSectionTop : null;
    let secondSectionBottomStyle =
      !firstSection && index === 5 ? styles.secondSectionBottom : null;

    return (
      <View
        style={[itemStyle, secondSectionStyle, secondSectionBottomStyle]}
        testID={`${testID}.${item?.title}-container`}>
        <View style={styles.descriptionContainer}>
          <Text
            style={styles.subsectionTitle}
            testID={`${testID}.${item?.title}`}>
            {item.title}
          </Text>
          <Spacer vertical size={5} />

          <Text
            style={styles.subsectionDescription}
            testID={`${testID}.${item?.description}`}>
            {item.description}
          </Text>
        </View>
        <View style={styles.switchContainer}>
          <Switch
            value={item.isEnabled}
            onValueChange={() => toggleSwitch(item.title)}
            testID={testID}
          />
        </View>
      </View>
    );
  };

  return (
    <>
      <DefaultHeader
        title={AppSettings.AppSettings}
        testID={`${testID}.screen-header`}
        backgroundColor={coloursTheme.backgroundColor}
      />
      <ScreenContainer style={styles.container}>
        <Spacer vertical size={10} />
        <SectionList
          sections={settingsContent}
          stickySectionHeadersEnabled={false}
          showsVerticalScrollIndicator={false}
          renderItem={renderItem}
          contentContainerStyle={styles.sectionListContentContainer}
          ListFooterComponent={
            <>
              <Spacer vertical size={30} />
              <Text style={styles.version}>{`${
                AppSettings.EConnect
              } ${getAppVersion()}`}</Text>
              <Spacer vertical size={50} />
            </>
          }
        />

        <Spacer vertical size={30} />
      </ScreenContainer>
    </>
  );
};

export default AppSettings;
