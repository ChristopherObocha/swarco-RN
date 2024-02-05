/*
 * Jira Ticket:
 * Zeplin Design:
 * Feature Document:
 * Created Date: Thu, 16th Nov 2023, 21:39:37 pm
 * Author: Christopher Obocha (chris.obocha@thedistance.co.uk)
 * Copyright (c) 2023 The Distance
 */

import React, {useState, useCallback, useMemo} from 'react';
import {useStyle} from 'providers/style/style-provider';
import {useScale} from 'providers/style/scale-provider';
import {useVehicle} from 'providers/apis/vehicle/ index';
import {useDictionary} from 'providers/dictionary/dictionary-provider';
import {useAlert} from 'providers/alert/alert-provider';

import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import CardContainer from './card-container';
import FontAwesome5Pro from 'react-native-vector-icons/FontAwesome5Pro';
import {Spacer} from 'components/utils/spacer';
import VehicleModal from 'components/modals/vehicle-modal';
import {VehicleId} from 'providers/types/vehicles';
import {CONNECTOR_TYPES, CONNECTOR_TYPE_MAP} from 'utils/constants';

interface VehicleCardProps {
  testID?: string;
  data: any;
}

const VehicleCard = ({data}: VehicleCardProps) => {
  const {
    colour,
    make,
    model,
    year_of_vehicle_manufacture,
    taxi_number,
    plug_type,
  } = data?.vehicle[0];
  const {vehicle_id} = data;

  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const {
    favourVehicle,
    getFavouriteVehicleIDs,
    favouriteVehicleIDs,
    deleteFavouriteVehicle,
  } = useVehicle();

  const {
    dictionary: {
      Account: {Vehicle},
    },
  } = useDictionary();
  const {alert} = useAlert();

  const makeFavorite = useCallback(
    async (id: VehicleId) => {
      const res = await favourVehicle(id);

      if (!res.success) {
        alert(Vehicle.FavouriteVehicleError);
      }

      getFavouriteVehicleIDs();
    },
    [
      Vehicle.FavouriteVehicleError,
      alert,
      favourVehicle,
      getFavouriteVehicleIDs,
    ],
  );

  const removeFavorite = useCallback(
    async (id: VehicleId) => {
      const res = await deleteFavouriteVehicle(id);

      if (!res.success) {
        alert(Vehicle.FavouriteVehicleError);
      }

      getFavouriteVehicleIDs();
    },
    [
      Vehicle.FavouriteVehicleError,
      alert,
      deleteFavouriteVehicle,
      getFavouriteVehicleIDs,
    ],
  );

  const isFavourite = useMemo(() => {
    return favouriteVehicleIDs.includes(vehicle_id);
  }, [favouriteVehicleIDs, vehicle_id]);

  // ** ** ** ** ** STYLES ** ** ** ** **
  const {
    coloursTheme,
    coloursTheme: {
      button: {icon},
    },
    textStyles,
  } = useStyle();
  const {getHeight, getRadius, getWidth, getFontSize} = useScale();
  const styles = StyleSheet.create({
    card: {
      borderRadius: getRadius(15),
      paddingHorizontal: 0,
      paddingVertical: 0,
    },
    iconContainer: {
      borderTopLeftRadius: getRadius(15),
      borderTopRightRadius: getRadius(15),
      height: getHeight(100),
      backgroundColor: coloursTheme.primaryColor,
      justifyContent: 'center',
      alignItems: 'center',
    },
    favoriteIcon: {
      justifyContent: 'center',
      alignItems: 'center',
      height: getHeight(40),
      width: getWidth(40),
      position: 'absolute',
      right: getWidth(10),
      bottom: getHeight(55),
    },
    contentContainer: {
      paddingHorizontal: getWidth(15),
      paddingTop: getHeight(15),
      paddingBottom: getHeight(15),
    },
    row: {
      flexDirection: 'row',
    },
    headerText: {
      ...textStyles.semiBold18,
      marginRight: getWidth(15),
    },
    subText: {
      ...textStyles.regular16,
    },
    optionalIconText: {
      ...textStyles.regular18,
    },
    alignCenter: {
      alignItems: 'center',
    },
  });

  // ** ** ** ** ** RENDER ** ** ** ** **
  const RenderVehicleModal = useCallback(
    () => (
      <VehicleModal
        modalVisible={modalVisible}
        closeModal={() => setModalVisible(false)}
        data={data}
      />
    ),
    [data, modalVisible],
  );

  const PlugIcon = useMemo(() => {
    const plugIcon = CONNECTOR_TYPE_MAP.find(
      connector => connector.name === plug_type,
    )?.icon;

    return (
      plugIcon ??
      CONNECTOR_TYPE_MAP.find(
        connector => connector.name === CONNECTOR_TYPES.OTHERS,
      )?.icon
    );
  }, [plug_type]);

  // ** ** ** ** ** RENDER ** ** ** ** **
  return (
    <>
      <CardContainer style={styles.card}>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <View style={styles.iconContainer}>
            <View>
              <FontAwesome5Pro
                name={taxi_number ? 'taxi' : 'car'}
                color={icon.backgroundColor}
                size={getFontSize(70)}
              />
            </View>
            <TouchableOpacity
              onPress={() =>
                isFavourite
                  ? removeFavorite(vehicle_id)
                  : makeFavorite(vehicle_id)
              }
              style={styles.favoriteIcon}>
              <FontAwesome5Pro
                name="heart"
                color={icon.backgroundColor}
                size={getFontSize(25)}
                solid={isFavourite}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.contentContainer}>
            <View style={styles.row}>
              <Text style={styles.headerText}>{colour}</Text>
              <Text style={styles.headerText}>{make}</Text>
              <Text style={styles.headerText}>
                {year_of_vehicle_manufacture}
              </Text>
            </View>
            <Spacer size={10} vertical />
            <Text style={styles.subText}>{model}</Text>
            <Spacer size={10} vertical />
            <View style={[styles.row, styles.alignCenter]}>
              <PlugIcon />
              <Spacer size={10} />
              <Text style={textStyles.regular18}>{plug_type}</Text>
            </View>
          </View>
        </TouchableOpacity>
      </CardContainer>

      <RenderVehicleModal />
    </>
  );
};

export default VehicleCard;
