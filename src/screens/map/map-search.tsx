/*
 * Jira Ticket:
 * Zeplin Design:
 * Feature Document:
 * Created Date: Mon, 30th Oct 2023, 16:30:52 pm
 * Author: Christopher Obocha (chris.obocha@thedistance.co.uk)
 * Copyright (c) 2023 The Distance
 */

import React, {useState, useEffect, useCallback} from 'react';

import {useScale} from 'providers/style/scale-provider';
import {useStyle} from 'providers/style/style-provider';
import {useDictionary} from 'providers/dictionary/dictionary-provider';
import {useCharging} from 'providers/apis/charging';

import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import {Spacer} from 'components/utils/spacer';

const SearchIcon = require('../../../assets/svg/search-icon.svg').default;

import SearchHeader from 'components/headers/search-header';
import {FlashList} from '@shopify/flash-list';

import {useNavigation, useRoute} from '@react-navigation/native';

import {MAP_SCREENS} from '../../types/navigation';
import {useUser} from 'providers/apis/user';
import {AddressAutoCompleteResponse} from 'providers/types/user';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import FontAwesome5Pro from 'react-native-vector-icons/FontAwesome5Pro';
import {ChargePointPartialAPIResponse} from 'providers/types/charging';
import {useLoading} from 'providers/loading/loading-provider';
import {LoadingView} from 'components/utils/loading-view';
import {getAvailableChargersCount} from 'utils/charging-utils';

const TabTypes: {
  Locations: number;
  ChargePoints: number;
} = {
  Locations: 1,
  ChargePoints: 2,
};

type Tabs = (typeof TabTypes)[keyof typeof TabTypes];

const MapSearchScreen = () => {
  const testID = 'MapSearchScreen';
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  const {bottom} = useSafeAreaInsets();
  const {loading, setLoading} = useLoading();

  const {
    coloursTheme,
    textStyles,
    coloursTheme: {card, mapSearch},
  } = useStyle();

  const {getHeight, getWidth, getRadius, getFontSize} = useScale();
  const {
    dictionary: {MapSearch},
  } = useDictionary();

  const [selected, setSelected] = useState<Tabs>(TabTypes.Locations);
  const [searching, setSearching] = useState<boolean>(false);
  const [searchedLocation, setSearchedLocation] = useState<string>(
    route?.params?.locationSearchValue || '',
  );
  const [searchValue, setSearchValue] = useState<string>(
    route?.params?.locationSearchValue || '',
  );

  const {getAddress, getAutocompleteAddress} = useUser();

  useEffect(() => {
    if (route?.params?.locationSearchValue) {
      onSearch(route?.params?.locationSearchValue);
    }

    if (route?.params?.selectedSite) {
      setSelected(TabTypes.ChargePoints);
    }
  }, [route]);

  const handleAddressClick = useCallback(
    async ({id, address}: {id: string; address: string}) => {
      const {data} = await getAddress({id: id});
      const longitude = data?.longitude;
      const latitude = data?.latitude;

      const position = {
        latitude: latitude,
        longitude: longitude,
        latitudeDelta: 0.04,
        longitudeDelta: 0.04,
      };

      navigation.navigate(MAP_SCREENS.MAP, {
        position: position,
        locationSearchValue: address,
      });
    },
    [getAddress, navigation],
  );

  const onSearch = (val: string) => {
    setSearchValue(val);
    setSearching(true);
  };

  const onPressClear = () => {
    setSearching(false);
    setSearchValue('');
    setAddressResults([]);
    setSearchedLocation('');
  };

  const [addressResults, setAddressResults] = useState<
    AddressAutoCompleteResponse[]
  >([]);

  useEffect(() => {
    if (searchValue?.length > 2 && selected === TabTypes.Locations) {
      setLoading(true);
      getAutocompleteAddress({input: searchValue})
        .then(({data}) => {
          if (data?.length) {
            setAddressResults(data);
          }
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [getAutocompleteAddress, searchValue, selected, setLoading]);

  const {getChargePointPartial} = useCharging();

  const [chargePoints, setChargePoints] = useState<
    ChargePointPartialAPIResponse[] | undefined
  >(undefined);

  const fetchChargePoint = useCallback(async () => {
    setLoading(true);
    try {
      let response = await getChargePointPartial({
        chargepoint_id: searchValue,
      });

      if (response?.data?.length) {
        setChargePoints(response.data);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  }, [getChargePointPartial, searchValue, setLoading]);

  useEffect(() => {
    if (selected === TabTypes.ChargePoints && searchValue.length > 2) {
      fetchChargePoint();
    }
  }, [fetchChargePoint, searchValue, selected]);

  // ** ** ** ** ** STYLES ** ** ** ** **
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: getWidth(20),
      alignItems: 'center',
    },
    cardContainer: {
      backgroundColor: card.backgroundColor,
      paddingHorizontal: getWidth(15),
      paddingVertical: getHeight(30),
      alignItems: 'center',
      borderRadius: getRadius(10),
      overflow: 'hidden',
      width: getWidth(335),
    },
    headerText: {
      ...textStyles.semiBold20,
      textAlign: 'center',
    },
    text: {
      ...textStyles.regular18,
      textAlign: 'center',
    },
    tertiaryButton: {
      alignItems: 'center',
    },

    tabContainer: {
      backgroundColor: card.backgroundColor,
      height: getHeight(30),
      flexDirection: 'row',
      justifyContent: 'center',
    },
    tab: {
      justifyContent: 'center',
      alignItems: 'center',
      width: getWidth(187.5),
      borderBottomColor: coloursTheme.lightGrey,
      borderBottomWidth: getHeight(2),
    },
    tabText: {
      ...textStyles.regular16,
    },
    flashListContainer: {
      flex: 1,
      minWidth: getWidth(335),
    },
    addressCard: {
      backgroundColor: coloursTheme.card.backgroundColor,
      width: getWidth(335),
      borderRadius: getRadius(10),
      padding: getWidth(15),
      marginBottom: getHeight(15),
      flexDirection: 'row',
      alignItems: 'center',
    },
    addressContentRow: {
      flexDirection: 'row',
    },
    addressText: {
      ...textStyles.regular16,
      color: coloursTheme.text.secondary,
      width: getWidth(245),
    },
    socketsText: {
      ...textStyles.semiBold18,
      marginTop: getHeight(10),
    },
    buttonContainer: {
      justifyContent: 'center',
      paddingHorizontal: getWidth(30),
      zIndex: 1,
      position: 'absolute',
      width: getWidth(375),
      bottom: -bottom,
      height: getHeight(154) + bottom,
    },
    fadeContainer: {
      width: getWidth(375),
      position: 'absolute',
      bottom: -bottom,
      height: getHeight(154) + bottom,
    },

    title: {
      ...textStyles.semiBold18,
      marginBottom: getHeight(8),
      width: getWidth(245),
    },
    iconContainer: {
      verticalAlign: 'middle',
      width: getWidth(40),
      aspectRatio: 1,
      borderRadius: getWidth(20),
      backgroundColor: coloursTheme.tertiaryColor,
      marginRight: getWidth(15),
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

  // ** ** ** ** ** RENDER ** ** ** ** *
  const renderAddressItem = useCallback(
    ({item}: any) => {
      const displayName = item.address.split(',')[0];
      return (
        <>
          <TouchableOpacity
            style={styles.addressCard}
            testID={testID}
            onPress={() =>
              handleAddressClick({id: item.id, address: item.address})
            }>
            <View style={styles.iconContainer}>
              <FontAwesome5Pro
                name="location-arrow"
                size={getFontSize(16)}
                solid={false}
                style={{
                  color: coloursTheme.primaryColor,
                }}
              />
            </View>

            <View>
              {displayName && (
                <Text
                  style={styles.title}
                  testID={`${testID}.title`}
                  numberOfLines={2}>
                  {displayName}
                </Text>
              )}
              <Text
                style={styles.addressText}
                testID={`${testID}.addressText`}
                numberOfLines={2}>
                {item.address}
              </Text>
            </View>
          </TouchableOpacity>
        </>
      );
    },
    [
      coloursTheme.primaryColor,
      getFontSize,
      handleAddressClick,
      styles.addressCard,
      styles.addressText,
      styles.iconContainer,
      styles.title,
    ],
  );

  const renderCPIDItem = useCallback(
    ({item}: {item: ChargePointPartialAPIResponse}) => {
      return (
        <TouchableOpacity
          style={styles.addressCard}
          testID={testID}
          onPress={() =>
            navigation.navigate(MAP_SCREENS.MAP, {
              position: {
                latitude: item?.site?.geo_coordinate?.coordinates[1],
                longitude: item?.site?.geo_coordinate?.coordinates[0],
                latitudeDelta: 0.04,
                longitudeDelta: 0.04,
              },
              selectedSite: item?.site?.site_id,
              locationSearchValue: item?.display_name,
            })
          }>
          <View style={styles.addressContentRow}>
            <View style={styles.iconContainer}>
              <FontAwesome5Pro
                name="location-arrow"
                size={getFontSize(16)}
                solid={false}
                style={{
                  color: coloursTheme.primaryColor,
                }}
              />
            </View>

            <View>
              {item?.display_name && (
                <Text style={styles.title} testID={`${testID}.title`}>
                  {item?.display_name}
                </Text>
              )}
              <Text style={styles.addressText} testID={`${testID}.addressText`}>
                {`${item?.site?.site_address_address_line1}, ${
                  item?.site?.site_address_address_line2
                    ? item?.site?.site_address_address_line2 + ', '
                    : ''
                }${item?.site?.site_address_locality}, ${
                  item?.site?.site_address_postal_code
                }`}
              </Text>

              <Text style={styles.socketsText}>
                {`${getAvailableChargersCount(item?.charge_point_connectors)}/${
                  item?.charge_point_connectors?.length
                } Sockets available`}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      );
    },
    [
      coloursTheme.primaryColor,
      getFontSize,
      navigation,
      styles.addressCard,
      styles.addressContentRow,
      styles.addressText,
      styles.iconContainer,
      styles.socketsText,
      styles.title,
    ],
  );

  const renderTabs = () => {
    const selectedTabStyles = {
      borderBottomColor: mapSearch.tabBorderColour,
      borderBottomWidth: getHeight(2),
    };

    return (
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tab,
            selected === TabTypes.Locations && selectedTabStyles,
          ]}
          onPress={() => setSelected(TabTypes.Locations)}>
          <Text style={styles.tabText}>{MapSearch.Locations}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tab,
            selected === TabTypes.ChargePoints && selectedTabStyles,
          ]}
          onPress={() => setSelected(TabTypes.ChargePoints)}>
          <Text style={styles.tabText}>{MapSearch.ChargePoints}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderSearchCard = useCallback(() => {
    const headerText = !searching
      ? MapSearch.WhereDoYouWantToCharge
      : MapSearch.NoResults;

    const text = !searching
      ? MapSearch.StartSearchText
      : selected === TabTypes.Locations
      ? MapSearch.NoResultsLocationText
      : MapSearch.NoResultsCPIDText;

    return (
      <View testID={`${testID}.card`} style={styles.cardContainer}>
        <SearchIcon
          width={getWidth(110)}
          height={getHeight(110)}
          testID={`${testID}.SearchIcon`}
        />
        <Spacer vertical size={30} />
        <Text style={styles.headerText} testID={`${testID}.headerText`}>
          {headerText}
        </Text>
        <Spacer vertical size={15} />
        <Text style={styles.text} testID={`${testID}.text`}>
          {text}
        </Text>
      </View>
    );
  }, [
    MapSearch.NoResults,
    MapSearch.NoResultsCPIDText,
    MapSearch.NoResultsLocationText,
    MapSearch.StartSearchText,
    MapSearch.WhereDoYouWantToCharge,
    getHeight,
    getWidth,
    searching,
    selected,
    styles.cardContainer,
    styles.headerText,
    styles.text,
  ]);

  const renderAddresContent = useCallback(() => {
    return (
      <>
        <FlashList
          data={addressResults}
          renderItem={renderAddressItem}
          estimatedItemSize={55}
          keyboardShouldPersistTaps="handled"
          testID={testID}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={renderSearchCard}
        />
      </>
    );
  }, [addressResults, renderAddressItem, renderSearchCard]);

  const renderCPIDContent = useCallback(() => {
    return (
      <>
        <FlashList
          data={chargePoints?.length ? chargePoints : []}
          renderItem={renderCPIDItem}
          estimatedItemSize={55}
          keyboardShouldPersistTaps="handled"
          testID={testID}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={renderSearchCard}
        />
      </>
    );
  }, [chargePoints, renderCPIDItem, renderSearchCard]);

  return (
    <>
      <SearchHeader
        hideGoBack={false}
        onSearch={onSearch}
        clearSearch={onPressClear}
        backgroundColor={coloursTheme.card.backgroundColor}
        autoFocus={true}
        value={searchValue}
        placeholder={MapSearch.SearchLocation}
        autoCapitalize={
          selected === TabTypes.ChargePoints ? 'characters' : 'none'
        }
        customBackAction={() =>
          navigation.navigate(MAP_SCREENS.MAP, {
            locationSearchValue: searchedLocation,
            position: route?.params?.position,
            selectedSite: route?.params?.selectedSite || '',
          })
        }
        focusOnMount
      />

      {renderTabs()}
      <View style={styles.container}>
        <Spacer vertical size={25} />

        <View style={styles.flashListContainer}>
          {!searching
            ? renderSearchCard()
            : selected === TabTypes.Locations
            ? renderAddresContent()
            : renderCPIDContent()}
        </View>
      </View>

      {loading && <LoadingView />}
    </>
  );
};

export default MapSearchScreen;
