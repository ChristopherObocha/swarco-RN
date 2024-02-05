/*
 * Jira Ticket:
 * Zeplin Design:
 * Feature Document:
 * Created Date: Tue, 7th Nov 2023, 13:26:40 pm
 * Author: Christopher Obocha (chris.obocha@thedistance.co.uk)
 * Copyright (c) 2023 The Distance
 */

import React, {useCallback, useMemo} from 'react';

import {useScale} from 'providers/style/scale-provider';
import {useStyle} from 'providers/style/style-provider';
import {MapMarkerProps, Marker} from 'react-native-maps';

import {View, Text} from 'react-native';
import {StyleSheet} from 'react-native';
import FontAwesome5Pro from 'react-native-vector-icons/FontAwesome5Pro';
import {Spacer} from 'components/utils/spacer';
import BoltIcon from 'assets/svg/bolt-icon.svg';
import {MappedRadiusSiteResponse} from 'providers/types/site';
import {getSitesAvailableChargersCount} from 'utils/charging-utils';
import {palette} from 'providers/style/palette';

interface SitePinProps extends MapMarkerProps {
  site: MappedRadiusSiteResponse;
  handleSelectSite: (siteID: string, region: any) => void;
  testID?: string;
  selected?: string | undefined | null;
}

const Pin = ({site, coordinate, handleSelectSite, selected}: SitePinProps) => {
  const testID = 'sitePin';

  const icon = site?.site_type?.icon || 'bolt';

  // ** ** ** ** ** STYLES ** ** ** ** **
  const {getHeight, getWidth, getRadius, getFontSize} = useScale();
  const {
    textStyles,
    coloursTheme: {
      pin: {sitePin, pointOfInterest},
      map: {stationTag},
    },
  } = useStyle();

  const color = useMemo(() => {
    if (selected === site?.site_id?.toString()) {
      return pointOfInterest?.backgroundColor;
    } else {
      return stationTag?.blue?.backgroundColour;
    }
  }, [
    selected,
    site?.site_id,
    pointOfInterest?.backgroundColor,
    stationTag?.blue?.backgroundColour,
  ]);

  const styles = StyleSheet.create({
    sitePinContainer: {
      maxWidth: getWidth(81),
      minWidth: getWidth(28),
      height: getWidth(28), //use getWidth here to ensure square UI
      flexDirection: 'row',
      backgroundColor: color,
      borderRadius: getRadius(5),
      paddingHorizontal: getWidth(8),
      alignItems: 'center',
      justifyContent: 'center',
    },
    triangleContainer: {
      alignItems: 'center',
      marginTop: getHeight(-0.5),
      marginLeft: getWidth(-3),
    },
    triangle: {
      width: 0,
      height: 0,
      backgroundColor: palette.transparent,
      borderStyle: 'solid',
      borderLeftWidth: getWidth(5),
      borderRightWidth: getWidth(5),
      borderBottomWidth: getHeight(8),
      borderLeftColor: palette.transparent,
      borderRightColor: palette.transparent,
      transform: [{rotate: '180deg'}],
      borderBottomColor: color,
    },
    text: {
      ...textStyles.bold16,
      color: sitePin.color,
    },
  });

  const getMaxChargers = useCallback(() => {
    return site?.site_charge_points?.length;
  }, [site?.site_charge_points]);

  const availableChargers = getSitesAvailableChargersCount(site);
  const maxChargers = getMaxChargers();

  const onPress = useCallback(() => {
    if (!site?.site_id) {
      return;
    }

    handleSelectSite(site.site_id, {
      longitude: site.geo_coordinate?.coordinates[0] || 0,
      latitude: site.geo_coordinate?.coordinates[1] || 0,
    });
  }, [handleSelectSite, site?.site_id, site.geo_coordinate?.coordinates]);

  // ** ** ** ** ** RENDER ** ** ** ** **
  const Triangle = <View style={styles.triangle} />;

  return (
    <Marker
      coordinate={coordinate}
      testID={testID}
      onPress={onPress}
      key={site.UUID}
      tracksViewChanges={!!selected}>
      <View style={styles.sitePinContainer}>
        {icon === 'bolt' ? (
          <BoltIcon />
        ) : (
          <FontAwesome5Pro
            name={icon}
            color={sitePin.color}
            size={getFontSize(14)}
            solid
          />
        )}

        {!!availableChargers && (
          <>
            <Spacer horizontal size={7} />
            <Text style={styles.text} testID={`${testID}.text`}>
              {availableChargers}/{maxChargers}
            </Text>
          </>
        )}
      </View>
      <View style={styles.triangleContainer}>{Triangle}</View>
    </Marker>
  );
};

// Function to compare the arrays
// function compareArrays(
//   arr1: MappedSiteChargePoints[],
//   arr2: MappedSiteChargePoints[],
// ) {
//   // Check if arrays have different lengths
//   if (arr1.length !== arr2.length) {
//     return true; // Arrays have different lengths, so there must be a change
//   }

//   // Iterate through each object in the arrays
//   for (let i = 0; i < arr1.length; i++) {
//     const obj1 = arr1[i];
//     const obj2 = arr2[i];

//     // Compare charge_connector_state or connector_state properties
//     if (
//       obj1.charge_connector_state !== obj2.charge_connector_state ||
//       obj1.charge_point_connectors?.some(
//         (connector1, index) =>
//           // Check if connector_state property changed in any connector
//           connector1.connector_state !==
//           obj2?.charge_point_connectors!![index].connector_state,
//       )
//     ) {
//       return true; // Change found
//     }
//   }

//   return false; // No change found
// }

export default Pin;
