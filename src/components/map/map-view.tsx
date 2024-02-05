/*
 * Jira Ticket:
 * Zeplin Design:
 * Feature Document:
 * Created Date: Wed, 15th Nov 2023, 15:49:56 pm
 * Author: Christopher Obocha (chris.obocha@thedistance.co.uk)
 * Copyright (c) 2023 The Distance
 */

import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {useScale} from 'providers/style/scale-provider';
import {useSite} from 'providers/apis/site';
import {usePrevious} from 'utils/usePrevious';
import {useDictionary} from 'providers/dictionary/dictionary-provider';
import {useNavigation} from '@react-navigation/native';

import {KeyboardAvoidingView, Platform, StyleSheet} from 'react-native';
import SearchHeader from 'components/headers/search-header';
import MapRef from 'react-native-maps';
import Map from 'react-native-map-clustering';
import Geolocation from '@react-native-community/geolocation';
import MapCluster from './map-cluster';
import IconButton from 'components/buttons/icon-button';
import SiteSummaryModal from 'components/modals/site-summary-modal';
import SitePin from 'components/map/site-pins';
import PointOfInterestPin from './point-of-interest-pin';

import {PROVIDER_GOOGLE, Region} from 'react-native-maps';
import {GlobalStorage, getObject, setObject} from 'utils/storage-utils';
import mapStyle from './map-style';
import {PERMISSIONS, RESULTS, check, request} from 'react-native-permissions';
import {
  PLATFORMS,
  STORAGE,
  maxMeterRadius,
  oneDegreeOfLatitudeInMeters,
} from 'utils/constants';
import {MappedRadiusSiteResponse} from 'providers/types/site';

import FilterModal from 'components/modals/filter-modal';
import {MAP_SCREENS} from '../../types/navigation';
import {useLoading} from 'providers/loading/loading-provider';
import {LoadingView} from 'components/utils/loading-view';
import {palette} from 'providers/style/palette';
import {SearchButton} from 'components/buttons/search-button';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useUpdateLocationSettingsAlert} from 'utils/hooks';

const {IOS} = PLATFORMS;

const defaultZoom = 0.04;

const defaultLocation = {
  latitude: 53.8008,
  longitude: -1.5491,
  latitudeDelta: defaultZoom,
  longitudeDelta: defaultZoom,
};

interface MapViewProps {
  searchPosition?: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  };
  selectedSite?: string;
  locationSearchValue?: string;
  selectedCPID?: string;
}

interface FilterProps {
  searchValue: (string | number)[];
  chargeSpeed?: {
    max: number;
    min: number;
  };
}

const initialRegion = {
  latitude: defaultLocation.latitude,
  longitude: defaultLocation.longitude,
  latitudeDelta: defaultZoom,
  longitudeDelta: defaultZoom,
};

const areRegionsDifferent = (region1: Region, region2: Region) => {
  return (
    region1.latitude.toFixed(4) !== region2.latitude.toFixed(4) ||
    region1.longitude.toFixed(4) !== region2.longitude.toFixed(4) ||
    region1.latitudeDelta.toFixed(4) !== region2.latitudeDelta.toFixed(4) ||
    region1.longitudeDelta.toFixed(4) !== region2.longitudeDelta.toFixed(4)
  );
};

const MapView = ({
  searchPosition,
  selectedSite,
  locationSearchValue,
}: MapViewProps) => {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [region, setRegion] = useState<Region | undefined>(undefined);

  const {setButtonLoading} = useLoading();

  const prevRegion = usePrevious<Region | undefined>(region);

  const [mapSearchPosition, setMapSearchPosition] = useState<
    Region | undefined
  >(searchPosition);
  const [mapSearchValue, setMapSearchValue] = useState<string | undefined>(
    locationSearchValue,
  );

  const mapViewRef = useRef<MapRef>(null);

  const {
    dictionary: {MapSearch},
  } = useDictionary();
  const navigation = useNavigation<any>();

  const {siteRadiusSearch} = useSite();
  const {setLoading} = useLoading();

  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedSiteID, setSelectedSiteID] = useState<
    string | undefined | null
  >(selectedSite || null);

  const [sites, setSites] = useState<MappedRadiusSiteResponse[]>([]);
  const [filteredSites, setFilteredSites] =
    useState<MappedRadiusSiteResponse[]>(sites);

  const [mapChanged, setMapChanged] = useState<boolean>(false);

  const [filters, setFilters] = useState<FilterProps | undefined>();

  const [allowLocation, setAllowLocation] = useState<boolean | undefined>(
    getObject(STORAGE.LOCATION),
  );

  const prevProps = usePrevious({
    searchPosition,
    selectedSite,
    locationSearchValue,
  });

  useEffect(() => {
    const listener = GlobalStorage.addOnValueChangedListener(changedKey => {
      const newValue = getObject(changedKey) as boolean;

      if (changedKey === STORAGE.LOCATION) {
        setAllowLocation(newValue);
      }
    });

    return () => {
      listener?.remove();
    };
  }, []);

  const getBounds = useCallback(() => {
    const radiusInMeters = region?.latitudeDelta
      ? (region?.latitudeDelta * oneDegreeOfLatitudeInMeters) / 2
      : 0;

    if (radiusInMeters > maxMeterRadius) {
      return maxMeterRadius;
    }

    return Math.round(radiusInMeters);
  }, [region?.latitudeDelta]);

  const fetchSites = useCallback(
    async (searchRegion?: {latitude: number; longitude: number}) => {
      try {
        setLoading(true);
        const postBody = {
          lat: searchRegion?.latitude || region?.latitude || 0,
          long: searchRegion?.longitude || region?.longitude || 0,
          bound: getBounds(),
        };
        const response = await siteRadiusSearch(postBody);

        if (response.data) {
          setSites(response?.data || []);
        }
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    },
    [
      getBounds,
      region?.latitude,
      region?.longitude,
      setLoading,
      siteRadiusSearch,
    ],
  );

  useEffect(() => {
    if (searchPosition !== prevProps?.searchPosition) {
      setMapSearchPosition(searchPosition);
      fetchSites(searchPosition);
    }

    if (locationSearchValue !== prevProps?.locationSearchValue) {
      setMapSearchValue(locationSearchValue);
    }

    if (selectedSite !== prevProps?.selectedSite) {
      setSelectedSiteID(selectedSite);
    }
  }, [
    fetchSites,
    locationSearchValue,
    prevProps?.locationSearchValue,
    prevProps?.searchPosition,
    prevProps?.selectedSite,
    searchPosition,
    selectedSite,
  ]);

  const [showSearchHere, setShowSearchHere] = useState(false);

  // This useEffect hook is used to handle changes in the map view.
  useEffect(() => {
    // If the map has loaded and the current region (prevRegion) is different from the initial region,
    // and the new region (region) is different from the current region (prevRegion),
    // then we show the "Search Here" button.
    if (!mapLoaded || !prevRegion || !region) {
      return;
    } else if (
      mapLoaded &&
      areRegionsDifferent(prevRegion, initialRegion) &&
      areRegionsDifferent(region, prevRegion)
    ) {
      setShowSearchHere(true);
    }
    // If the "Search Here" button is not shown, we fetch the sites.
    else if (!showSearchHere) {
      fetchSites();
    }
  }, [fetchSites, mapLoaded, prevRegion, region, showSearchHere]);

  const updateLocationSettingsAlert = useUpdateLocationSettingsAlert();

  const checkLocationPermission = useCallback(async () => {
    const locationPermission =
      Platform.OS === IOS
        ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
        : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;
    const locationSettingAllowed = getObject(STORAGE.LOCATION);
    check(locationPermission).then((checkResult: string) => {
      if (
        checkResult === RESULTS.DENIED ||
        checkResult === RESULTS.LIMITED ||
        (checkResult === RESULTS.BLOCKED && locationSettingAllowed)
      ) {
        request(locationPermission).then(async (requestResult: string) => {
          const updateLocationSettingsAlertAlreadyShown = (await getObject(
            STORAGE.UPDATE_LOCATION_SETTINGS_ALERT_SHOWN,
          )) as number;
          const now = Date.now();
          if (
            requestResult === RESULTS.BLOCKED ||
            (requestResult === RESULTS.DENIED &&
              (!updateLocationSettingsAlertAlreadyShown ||
                now - updateLocationSettingsAlertAlreadyShown > 10000))
          ) {
            updateLocationSettingsAlert();
            setRegion(initialRegion);
          } else if (
            requestResult === RESULTS.GRANTED &&
            locationSettingAllowed !== false
          ) {
            setObject(STORAGE.LOCATION, true);
            getUsersLocation();
          } else {
            setRegion(initialRegion);
          }
        });
      } else if (
        checkResult === RESULTS.GRANTED &&
        locationSettingAllowed !== false
      ) {
        setObject(STORAGE.LOCATION, true);
        getUsersLocation();
      } else {
        setRegion(initialRegion);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRegionChange = useCallback((newRegion: Region) => {
    if (!mapViewRef?.current) {
      return;
    }
    mapViewRef.current?.animateToRegion(newRegion, 250);
    setMapChanged(false);
  }, []);

  const handleSelectSite = useCallback(
    (siteID: string, newRegion: Region) => {
      if (!newRegion.latitudeDelta || !newRegion.longitudeDelta) {
        newRegion = {
          ...newRegion,
          latitudeDelta: region?.latitudeDelta || defaultZoom,
          longitudeDelta: region?.longitudeDelta || defaultZoom,
        };
      }

      if (siteID === selectedSiteID) {
        setSelectedSiteID(prevSite => prevSite + '');
      } else {
        setSelectedSiteID(siteID.toString());
      }

      handleRegionChange(newRegion);
    },
    [
      handleRegionChange,
      region?.latitudeDelta,
      region?.longitudeDelta,
      selectedSiteID,
    ],
  );

  useEffect(() => {
    if (mapLoaded && searchPosition) {
      // Small timeout needed to allow map to load before animating to region
      setTimeout(() => {
        if (selectedSite) {
          handleSelectSite(selectedSite, searchPosition);
        } else {
          handleRegionChange(searchPosition);
        }
      }, 50);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchPosition, selectedSite, mapLoaded]);

  const getUsersLocation = useCallback(async () => {
    if (allowLocation !== false) {
      Geolocation.getCurrentPosition(
        position => {
          const newRegion: Region = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            latitudeDelta: defaultZoom,
            longitudeDelta: defaultZoom,
          };

          if (!region) {
            setRegion(newRegion);
            return;
          } else if (areRegionsDifferent(newRegion, region)) {
            handleRegionChange(newRegion);
          }
        },
        () => {},
        {},
      );
    } else {
      setRegion(initialRegion);
    }
  }, [allowLocation, handleRegionChange, region]);

  useEffect(() => {
    checkLocationPermission();
  }, [checkLocationPermission]);

  const flattenObjectValues = useCallback(
    (obj: any): (string | number | null | undefined)[] => {
      return Object.values(obj).reduce(
        (acc: (string | number | null | undefined)[], val) => {
          if (val && typeof val === 'object') {
            acc.push(...flattenObjectValues(val));
          } else {
            acc.push(val as string | number | null | undefined);
          }
          return acc;
        },
        [] as (string | number | null | undefined)[],
      );
    },
    [],
  );

  const filterByChargeSpeed = useCallback(
    (item: any, chargeSpeed: any, filtered: Set<any>) => {
      item?.site_charge_points.forEach((siteCP: any) => {
        siteCP.charge_point_connectors.forEach((connector: any) => {
          if (
            connector?.max_charge_rate <= chargeSpeed.max &&
            connector?.max_charge_rate >= chargeSpeed.min
          ) {
            filtered.add(item);
          }
        });
      });
    },
    [],
  );

  const filterFunction = useCallback(() => {
    const searchValue = filters?.searchValue || [];
    const chargeSpeed = filters?.chargeSpeed;

    if (!!searchValue.length || !!chargeSpeed) {
      setFilteredSites(sites);
    }
    const filtered: Set<any> = new Set();

    sites.forEach((item: any) => {
      if (searchValue.length) {
        //if there are card filters
        const flatArray = flattenObjectValues(item);
        searchValue.forEach((it: any) => {
          const doesValueExist = flatArray.includes(it?.value);
          if (doesValueExist) {
            if (chargeSpeed) {
              filterByChargeSpeed(item, chargeSpeed, filtered);
            } else {
              filtered.add(item);
            }
          }
        });
      } else if (chargeSpeed && !searchValue.length) {
        filterByChargeSpeed(item, chargeSpeed, filtered);
      }
    });

    setFilteredSites(Array.from(filtered));

    setModalVisible(false);
  }, [
    filterByChargeSpeed,
    filters?.chargeSpeed,
    filters?.searchValue,
    flattenObjectValues,
    sites,
  ]);

  useEffect(() => {
    if (filters) {
      filterFunction();
    } else {
      setFilteredSites(sites || []);
    }
  }, [sites, filters, filterFunction]);

  const resetFunction = useCallback(() => {
    setFilteredSites(sites);
    setModalVisible(false);
    setFilters(undefined);
  }, [sites]);

  // ** ** ** ** ** STYLES ** ** ** ** **
  const {getWidth, getHeight} = useScale();
  const insets = useSafeAreaInsets();

  const bottomSpacing = insets.bottom || getHeight(10);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    mapStyles: {
      ...StyleSheet.absoluteFillObject,
    },
    inputContainer: {
      marginHorizontal: 0,
      flexGrow: 1,
    },
    locationButton: {
      position: 'absolute',
      bottom:
        bottomSpacing + getHeight((Platform.OS === 'ios' ? 57.2 : 67) + 20),

      right: getWidth(20),
    },
  });

  const handleFilters = useCallback(
    async ({searchValue, chargeSpeed}: any) => {
      try {
        setButtonLoading(true);
        await fetchSites();
      } catch (e) {
        console.log(e);
      } finally {
        setFilters({searchValue, chargeSpeed});
        setButtonLoading(false);
      }
    },
    [fetchSites, setButtonLoading],
  );

  const showFilters = useMemo(() => {
    return (
      <FilterModal
        modalVisible={modalVisible}
        closeModal={() => setModalVisible(false)}
        filterFunction={handleFilters}
        resetFunction={resetFunction}
        filter={filters}
      />
    );
  }, [filters, handleFilters, modalVisible, resetFunction]);

  if (!region) {
    return LoadingView();
  }

  // ** ** ** ** ** RENDER ** ** ** ** **
  return (
    <>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <SearchHeader
          placeholder={MapSearch.SearchLocation}
          backgroundColor={palette.transparent}
          onSearch={() => {}}
          disabledInput={true}
          onFocus={() =>
            navigation.navigate(MAP_SCREENS.MAP_SEARCH, {
              locationSearchValue: locationSearchValue,
              position: mapSearchPosition,
              selectedSite: selectedSiteID,
            })
          }
          rightIcons={[
            {
              name: 'sliders-h',
              isPro: true,
              onPress: () => setModalVisible(true),
              showShadow: true,
              selected: filters
                ? filters.searchValue.length > 0 || !!filters.chargeSpeed
                : false,
            },
          ]}
          inputContainerStyle={styles.inputContainer}
          inputStyle={{flex: 1}}
          testID="MapView.SearchHeader"
          hideGoBack
          value={mapSearchValue}
          clearSearch={() => {
            setMapSearchPosition(undefined);
            setMapSearchValue(undefined);
            navigation.setParams({locationSearchValue: undefined});
          }}
        />

        <>
          <Map
            ref={mapViewRef}
            provider={PROVIDER_GOOGLE}
            initialRegion={region}
            onRegionChangeComplete={newRegion => {
              // It first checks if the new region's latitude and longitude are the same as the current region's,
              // and if the absolute difference between the new and current region's latitudeDelta and longitudeDelta is less than or equal to 0.02.
              // This means we only consider the region to have changed if the center coordinates (latitude and longitude) are different,
              // and the span of the map (latitudeDelta and longitudeDelta) has changed by more than 0.02.
              if (
                newRegion.latitude.toFixed(2) === region?.latitude.toFixed(2) &&
                newRegion.longitude.toFixed(2) ===
                  region?.longitude.toFixed(2) &&
                Math.abs(newRegion.latitudeDelta - region?.latitudeDelta) <=
                  0.02 &&
                Math.abs(newRegion.longitudeDelta - region?.longitudeDelta) <=
                  0.02
              ) {
                return;
              }
              // If the conditions are not met (meaning the region has changed significantly), we update the region state with the new region?.
              setRegion(newRegion);
            }}
            onPanDrag={() => {
              setMapChanged(true);
            }}
            style={styles.mapStyles}
            onMapReady={() => setMapLoaded(true)}
            showsMyLocationButton={false}
            minPoints={3}
            renderCluster={cluster => (
              <MapCluster
                key={`${cluster.geometry.coordinates[0]}_${cluster.geometry.coordinates[1]}`}
                {...cluster}
              />
            )}
            showsUserLocation={allowLocation}
            testID="charging-network-map"
            customMapStyle={mapStyle}
            showsBuildings={false}>
            {filteredSites.map((site, index) => (
              <SitePin
                coordinate={{
                  longitude: site.geo_coordinate?.coordinates[0] || 0,
                  latitude: site.geo_coordinate?.coordinates[1] || 0,
                }}
                key={site.UUID}
                site={site}
                handleSelectSite={handleSelectSite}
                testID={`StationTag.${index}`}
                selected={selectedSiteID}
              />
            ))}

            {locationSearchValue && mapSearchPosition && !selectedSite && (
              <PointOfInterestPin
                coordinate={mapSearchPosition}
                cluster={false}
              />
            )}
          </Map>
          <IconButton
            name="location"
            containerStyle={styles.locationButton}
            onPress={() => getUsersLocation()}
            testID="location-button"
            isPro
            showShadow
          />
        </>
      </KeyboardAvoidingView>
      {selectedSiteID && (
        <SiteSummaryModal
          siteID={selectedSiteID}
          onClose={() => setSelectedSiteID(null)}
          hasMapChanged={mapChanged}
        />
      )}
      {showFilters}

      <SearchButton
        show={showSearchHere}
        onPress={fetchSites}
        onLoad={() => setShowSearchHere(false)}
      />
    </>
  );
};

export default MapView;
