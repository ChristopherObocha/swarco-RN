import {Linking, Platform} from 'react-native';
import {convertDistance, getDistance} from 'geolib';
import Geolocation from '@react-native-community/geolocation';

interface Location {
  lat: number;
  lng: number;
  label: string;
}

export function openMaps(coordinates: Location) {
  const {lat, lng, label} = coordinates;
  const scheme = Platform.select({ios: 'maps://0,0?q=', android: 'geo:0,0?q='});
  const latLng = `${lat},${lng}`;
  const url = Platform.select({
    ios: `${scheme}${label}@${latLng}`,
    android: `${scheme}${latLng}(${label})`,
  });

  if (!url) {
    return;
  }

  Linking.openURL(url);
}

export const getDistanceFromUser = (
  location: Location,
): Promise<number | string> => {
  return new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      position => {
        const distanceInMeters = getDistance(
          {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          },
          location,
        );

        const distance = convertDistance(distanceInMeters, 'mi');

        if (distance > 10) {
          resolve(Math.round(distance));
        }

        resolve(distance.toFixed(1));
      },
      error => reject(error),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
    );
  });
};
