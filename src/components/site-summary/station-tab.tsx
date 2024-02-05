import React, {Fragment, useCallback} from 'react';

import {useScale} from 'providers/style/scale-provider';
import {useStyle} from 'providers/style/style-provider';
import {useSite} from 'providers/apis/site';
import {useNavigation} from '@react-navigation/native';
import {useAlert} from 'providers/alert/alert-provider';
import {useDictionary} from 'providers/dictionary/dictionary-provider';

import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ImageStyle,
  TouchableOpacity,
} from 'react-native';
import Pill from 'components/pills/pill';
import CardContainer from 'components/cards/card-container';
import {
  CHARGE_CONNECTOR_STATES,
  CONNECTOR_TYPES,
  CONNECTOR_TYPE_MAP,
} from 'utils/constants';
import {
  CHARGE_CONNECTOR_STATE_DESCRIPTION,
  MappedSiteChargePoints,
} from 'providers/types/site';
import {CHARGING_SCREENS} from '../../types/navigation';
import {getAvailableChargersCount} from 'utils/charging-utils';

type StyleProp = ViewStyle | TextStyle | ImageStyle;

const StationTab = () => {
  const {siteResponse} = useSite();
  const stations = siteResponse?.site_charge_points;
  const navigation = useNavigation<any>();
  const {
    dictionary: {SiteSummary, ConnectorState},
  } = useDictionary();

  const {alert} = useAlert();

  // ** ** ** ** ** STYLES ** ** ** ** **
  const {coloursTheme, textStyles} = useStyle();
  const {getHeight, getWidth, getRadius} = useScale();

  const styles: {[key: string]: StyleProp} = StyleSheet.create({
    container: {
      backgroundColor: coloursTheme.backgroundColor,
      alignItems: 'center',
      paddingTop: getHeight(15),
      paddingBottom: getHeight(40),
      minHeight: '100%',
    },
    stationCard: {
      flexDirection: 'row',
      height: getHeight(77),
      borderRadius: getRadius(10),
      marginBottom: getHeight(10),
      padding: getHeight(15),
    },
    iconContainer: {
      justifyContent: 'center',
      marginRight: getWidth(10),
    },
    informationContainer: {
      justifyContent: 'space-between',
      flex: 1,
    },
    pillContainer: {
      justifyContent: 'center',
    },
    title: {
      ...textStyles.semiBold18,
    },
    subText: {
      ...textStyles.regular18,
      color: coloursTheme.text.secondary,
    },
    pill: {
      paddingHorizontal: getWidth(12),
    },
    red: {
      backgroundColor: coloursTheme.pill.status.unavailable.backgroundColor,
      color: coloursTheme.pill.status.unavailable.color,
    },
    lightBlue: {
      backgroundColor: coloursTheme.pill.status.lightBlue.backgroundColor,
      color: coloursTheme.pill.status.lightBlue.color,
    },
    green: {
      backgroundColor: coloursTheme.pill.status.available.backgroundColor,
      color: coloursTheme.pill.status.available.color,
    },
    darkBlue: {
      backgroundColor: coloursTheme.pill.status.darkBlue.backgroundColor,
      color: coloursTheme.pill.status.darkBlue.color,
    },
    stationButton: {
      flex: 1,
      flexDirection: 'row',
    },
  });

  const renderStation = useCallback(
    (station: MappedSiteChargePoints, index: number) => {
      const Icon = station.charge_point_connectors?.reduce(
        (acc: any, connector) => {
          if (
            !acc &&
            typeof connector.connector_type !== 'string' &&
            !!connector.connector_type?.altIcon
          ) {
            acc = connector.connector_type?.altIcon;
          }
          return acc;
        },
        null,
      );

      const amountOfSocketsAvailable = getAvailableChargersCount(
        station?.charge_point_connectors,
      );

      const chargeConnectorState =
        station?.charge_connector_state as CHARGE_CONNECTOR_STATE_DESCRIPTION;

      const connectorState = CHARGE_CONNECTOR_STATES[chargeConnectorState];

      const name = ConnectorState[connectorState.name];
      const renderIcon = () => {
        if (Icon) {
          return <Icon />;
        } else {
          const DefaultIcon = CONNECTOR_TYPE_MAP.find(
            connector => connector.name === CONNECTOR_TYPES.OTHERS,
          )?.icon;
          return <DefaultIcon />;
        }
      };

      const handleChargePointPress = async () => {
        const chargepointID = station.display_name;

        if (!chargepointID) {
          alert(
            SiteSummary.NoChargePointIDTitle,
            SiteSummary.NoChargePointIDDescription,
          );
          return;
        }

        navigation.navigate(CHARGING_SCREENS.SOCKETS, {
          chargepoint_id: chargepointID,
        });
      };

      return (
        <CardContainer key={index} style={styles.stationCard}>
          <TouchableOpacity
            style={styles.stationButton}
            onPress={handleChargePointPress}>
            <View style={styles.iconContainer}>{renderIcon()}</View>
            <View style={styles.informationContainer}>
              <Text style={styles.title}>{station.display_name}</Text>
              <Text style={styles.subText}>
                {SiteSummary.StationTabSubText(
                  amountOfSocketsAvailable,
                  station?.charge_point_connectors?.length,
                )}
              </Text>
            </View>
            <View style={styles.pillContainer}>
              <Pill
                text={name}
                textStyle={styles[connectorState?.color]}
                containerStyle={[styles.pill, styles[connectorState?.color]]}
              />
            </View>
          </TouchableOpacity>
        </CardContainer>
      );
    },
    [ConnectorState, SiteSummary, alert, navigation, styles],
  );

  // ** ** ** ** ** RENDER ** ** ** ** **
  return (
    <View style={styles.container}>
      {stations?.map((station, index) => (
        <Fragment key={index}>{renderStation(station, index)}</Fragment>
      ))}
    </View>
  );
};

export default StationTab;
