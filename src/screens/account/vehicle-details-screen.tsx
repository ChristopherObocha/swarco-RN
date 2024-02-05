/*
 * Jira Ticket:
 * Zeplin Design:
 * Feature Document:
 * Created Date: Fri, 17th Nov 2023, 13:08:18 pm
 * Author: Christopher Obocha (chris.obocha@thedistance.co.uk)
 * Copyright (c) 2023 The Distance
 */

import React, {useEffect, useMemo, useState} from 'react';

import {useScale} from 'providers/style/scale-provider';
import {useStyle} from 'providers/style/style-provider';
import {useDictionary} from 'providers/dictionary/dictionary-provider';
import {useVehicle} from 'providers/apis/vehicle/ index';

import {View, StyleSheet, Text} from 'react-native';
import {FlashList} from '@shopify/flash-list';
import {Spacer} from 'components/utils/spacer';

import DefaultHeader from 'components/headers/default-header';

const CarCircle = require('../../../assets/svg/car-circle-filled.svg').default;

import {PrimaryButton} from 'components/buttons/primary-button';
import VehicleCard from 'components/cards/vehicle-card';
import VehicleModal from 'components/modals/vehicle-modal';
import {ScrollView} from 'react-native-gesture-handler';

const VehicleDetailsScreen = () => {
  const testID = 'VehicleDetailsScreen';

  const {
    coloursTheme: {card},
    textStyles,
  } = useStyle();

  const {getHeight, getWidth, getRadius} = useScale();
  const {
    dictionary: {
      Account: {Vehicle},
    },
  } = useDictionary();
  const {
    getVehicles,
    usersVehicles,
    getFavouriteVehicleIDs,
    favouriteVehicleIDs,
  } = useVehicle();

  const sortedVehicles = useMemo(() => {
    if (!usersVehicles) {
      return [];
    }

    return [...usersVehicles].sort((a, b) => {
      const aIsFavourite = favouriteVehicleIDs.includes(a.vehicle_id as string);
      const bIsFavourite = favouriteVehicleIDs.includes(b.vehicle_id as string);

      if (aIsFavourite && !bIsFavourite) {
        return -1;
      }

      if (!aIsFavourite && bIsFavourite) {
        return 1;
      }

      return 0;
    });
  }, [favouriteVehicleIDs, usersVehicles]);

  const [modalVisible, setModalVisible] = useState<boolean>(false);

  useEffect(() => {
    getVehicles();
  }, [getVehicles]);

  useEffect(() => {
    getFavouriteVehicleIDs();
  }, [getFavouriteVehicleIDs]);

  // ** ** ** ** ** STYLES ** ** ** ** **
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: getWidth(20),
    },
    contentContainer: {
      alignItems: 'center',
    },
    cardContainer: {
      paddingHorizontal: getWidth(15),
      alignItems: 'center',
      paddingVertical: getHeight(30),
      borderRadius: getRadius(10),
      overflow: 'hidden',
      backgroundColor: card.backgroundColor,
      width: '100%',
    },
    listContainer: {
      minHeight: getHeight(225),
      minWidth: getWidth(5),
      width: getWidth(335),
    },
    headerText: {
      ...textStyles.semiBold20,
    },
    text: {
      ...textStyles.regular16,
      width: '100%',
    },
    alignTextToCenter: {
      textAlign: 'center',
    },
  });

  // ** ** ** ** ** RENDER ** ** ** ** *
  const NoRegisteredVehiclesCard = (
    <View
      testID={`${testID}.noRegisteredVehicles`}
      style={styles.cardContainer}>
      <CarCircle
        width={getWidth(110)}
        height={getHeight(110)}
        testID={`${testID}.carCircle`}
      />
      <Spacer vertical size={30} />
      <Text style={styles.headerText} testID={`${testID}.carCircleHeader`}>
        {Vehicle.NoVehiclesHeader}
      </Text>
      <Spacer vertical size={20} />
      <Text
        style={[styles.text, styles.alignTextToCenter]}
        testID={`${testID}.carCircleText`}>
        {Vehicle.NoVehiclesText}
      </Text>

      <Spacer vertical size={30} />
      <PrimaryButton
        title={Vehicle.AddVehicle}
        testID={`${testID}.primaryButton`}
        customWidth={getWidth(295)}
        onPress={() => setModalVisible(true)}
      />
    </View>
  );

  return (
    <>
      <DefaultHeader
        title={Vehicle.VehicleDetails}
        rightIcons={[
          {
            name: 'plus',
            onPress: () => setModalVisible(true),
            isPro: true,
          },
        ]}
      />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}>
        <Spacer vertical size={10} />
        <Text style={styles.text}>{Vehicle.AddAndManageEV}</Text>
        <Spacer vertical size={15} />

        <View style={styles.listContainer}>
          <FlashList
            data={sortedVehicles}
            ItemSeparatorComponent={() => <Spacer vertical size={10} />}
            renderItem={({item}) => (
              <>
                <VehicleCard data={item} />
                <Spacer vertical size={10} />
              </>
            )}
            ListHeaderComponent={
              <>
                <Text style={styles.headerText}>{Vehicle.MyVehicles}</Text>
                <Spacer vertical size={15} />
              </>
            }
            ListEmptyComponent={NoRegisteredVehiclesCard}
            estimatedItemSize={getHeight(200)}
          />
        </View>
        <Spacer vertical size={150} />
      </ScrollView>

      <VehicleModal
        modalVisible={modalVisible}
        closeModal={() => setModalVisible(false)}
      />
    </>
  );
};

export default VehicleDetailsScreen;
