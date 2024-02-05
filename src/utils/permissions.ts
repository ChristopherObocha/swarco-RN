import {
  request,
  check,
  PERMISSIONS,
  RESULTS,
  requestNotifications,
  checkNotifications,
} from 'react-native-permissions';

export const requestStartupPermissions = async () => {
  const iosTrackingPermission = PERMISSIONS.IOS.APP_TRACKING_TRANSPARENCY;

  const notificationStatus = await checkNotifications();
  if (notificationStatus.status !== RESULTS.GRANTED) {
    await requestNotifications([]);
  }

  const permissionStatus = await check(iosTrackingPermission);
  if (permissionStatus !== RESULTS.GRANTED) {
    await request(iosTrackingPermission);
  }
};
