/*
 * Jira Ticket:
 * Zeplin Design:
 * Feature Document:
 * Created Date: Mon, 16th Oct 2023, 15:46:37 pm
 * Author: Christopher Obocha (chris.obocha@thedistance.co.uk)
 * Copyright (c) 2023 The Distance
 */

import React, {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {Text, Image, StyleSheet, View, Pressable} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {useScale} from 'providers/style/scale-provider';
import {useStyle} from 'providers/style/style-provider';
import {useSite} from 'providers/apis/site';

import {Spacer} from 'components/utils/spacer';
import BottomSheet, {BottomSheetScrollView} from '@gorhom/bottom-sheet';
import DirectionsButton from 'components/buttons/directions-button';
import DefaultHeader from 'components/headers/default-header';
import ImageGallery from 'components/images/image-gallery';
import SiteSegmentedControl from 'components/controls/site-segmented-control';
import Pill from 'components/pills/pill';
import {getDistanceFromUser, openMaps} from 'utils/location';

import {MappedSiteResponse} from 'providers/types/site';
import {
  CONNECTOR_TYPES,
  CONNECTOR_TYPE_MAP,
  NETWORK_IDS,
  NETWORK_LOGOS,
} from 'utils/constants';
import {usePrevious} from 'utils/usePrevious';
import {useLoading} from 'providers/loading/loading-provider';
import {useAlert} from 'providers/alert/alert-provider';
import {useDictionary} from 'providers/dictionary/dictionary-provider';
import {getSitesAvailableChargersCount} from 'utils/charging-utils';

interface SiteSummaryProps {
  siteID: string;
  onClose: () => void;
  hasMapChanged: boolean;
}

const SiteSummaryModal = ({
  siteID,
  onClose,
  hasMapChanged,
}: SiteSummaryProps) => {
  const {top} = useSafeAreaInsets();
  const bottomSheetRef = useRef<BottomSheet>(null);

  const [showHeader, setShowHeader] = useState(false);
  const [site, setSite] = useState<MappedSiteResponse | undefined>(undefined);
  const [siteDistance, setSiteDistance] = useState<number | string>(0);

  const {getWidth, getRadius, getHeight} = useScale();
  const {alert} = useAlert();

  const snapPoints = useMemo(
    () => [getHeight(236), getHeight(366), '100%'],
    [getHeight],
  );

  const prevHasMapChanged = usePrevious(hasMapChanged);
  const prevSiteID = usePrevious(siteID);

  useEffect(() => {
    if (hasMapChanged && !prevHasMapChanged) {
      bottomSheetRef.current?.snapToIndex(0);
    }
  }, [getHeight, hasMapChanged, prevHasMapChanged]);

  useEffect(() => {
    if (siteID !== prevSiteID) {
      bottomSheetRef.current?.snapToIndex(1);
    }
  }, [siteID, prevSiteID, getHeight]);

  const handleSheetAnimation = useCallback(
    (fromIndex: number, toIndex: number) => {
      if (
        fromIndex === snapPoints.length - 1 &&
        toIndex !== snapPoints.length - 1
      ) {
        setShowHeader(false);
      } else if (
        fromIndex !== snapPoints.length - 1 &&
        toIndex === snapPoints.length - 1
      ) {
        setShowHeader(true);
      }
    },
    [snapPoints.length],
  );

  const {getSiteDetails} = useSite();
  const {loading, setLoading} = useLoading();

  const {
    dictionary: {
      SiteSummary: {ErrorAlert, CustomLabel},
    },
  } = useDictionary();

  const fetchSiteDetails = useCallback(async () => {
    const params = {site_id: siteID};
    try {
      setLoading(true);

      const response = await getSiteDetails(params);

      if (!response) {
        alert(ErrorAlert.Title, ErrorAlert.Description, [
          {text: ErrorAlert.CTA},
        ]);

        return;
      }

      setSite(response.data);
    } catch {
      alert(ErrorAlert.Title, ErrorAlert.Description, [{text: ErrorAlert.CTA}]);
    } finally {
      setLoading(false);
    }
  }, [
    ErrorAlert.CTA,
    ErrorAlert.Description,
    ErrorAlert.Title,
    alert,
    getSiteDetails,
    setLoading,
    siteID,
  ]);

  const getMaxChargers = useCallback(() => {
    return site?.site_charge_points?.length;
  }, [site?.site_charge_points]);

  const getMaxKwh = useCallback(() => {
    let maxKwh = 0;

    site?.site_charge_points?.forEach(charger => {
      const maxRate = charger?.max_charge_rate;

      if (maxRate && maxRate > maxKwh) {
        maxKwh = maxRate;
      }
    });

    return maxKwh;
  }, [site?.site_charge_points]);

  const getConnectorIcons = useCallback(() => {
    const connectors = site?.site_charge_points
      ?.map(charger => {
        return charger?.charge_point_connectors?.map(connector => {
          if (
            connector?.connector_type &&
            typeof connector?.connector_type !== 'string'
          ) {
            return connector?.connector_type?.icon;
          } else {
            return null;
          }
        });
      })
      .flat(2);

    const uniqueConnectors = [...new Set(connectors)].filter(
      connector => !!connector,
    );

    if (!uniqueConnectors?.length) {
      const Icon = CONNECTOR_TYPE_MAP.find(
        connector => connector.name === CONNECTOR_TYPES.OTHERS,
      )?.icon;
      return <Icon />;
    }

    return uniqueConnectors?.map((Icon, index) => {
      return (
        <Fragment key={index}>
          {/*@ts-ignore*/}
          <Icon />
          <Spacer size={getWidth(5)} />
        </Fragment>
      );
    });
  }, [getWidth, site?.site_charge_points]);

  useEffect(() => {
    fetchSiteDetails();
  }, [fetchSiteDetails]);

  useEffect(() => {
    async function getDistance() {
      const distance = await getDistanceFromUser({
        lng: site?.geo_coordinate?.coordinates[0] || 0,
        lat: site?.geo_coordinate?.coordinates[1] || 0,
        label: site?.site_name ?? CustomLabel,
      });

      setSiteDistance(distance);
    }

    getDistance();
  }, [CustomLabel, site?.geo_coordinate?.coordinates, site?.site_name]);

  // ** ** ** ** ** STYLES ** ** ** ** **
  const {textStyles, coloursTheme} = useStyle();

  const networkStyles: {
    [key: string]: {
      color: string;
      logo: any;
      height?: number;
      width?: number;
    };
  } = {
    [NETWORK_IDS.SWARCO]: {
      color: coloursTheme.primaryColor,
      logo: NETWORK_LOGOS[NETWORK_IDS.SWARCO],
    },
    [NETWORK_IDS.POGO]: {
      color: coloursTheme.pogo.siteDetails.backgroundColor,
      logo: NETWORK_LOGOS[NETWORK_IDS.POGO],
    },
    [NETWORK_IDS.CPS]: {
      color: coloursTheme.cps.siteDetails.backgroundColor,
      logo: NETWORK_LOGOS[NETWORK_IDS.CPS],
    },
    [NETWORK_IDS.SSE]: {
      color: coloursTheme.sse.siteDetails.backgroundColor,
      logo: NETWORK_LOGOS[NETWORK_IDS.SSE],
    },
    [NETWORK_IDS.EVCM]: {
      color: coloursTheme.evcm.siteDetails.backgroundColor,
      logo: NETWORK_LOGOS[NETWORK_IDS.EVCM],
    },
    [NETWORK_IDS.OTHERS]: {
      color: coloursTheme.primaryColor,
      logo: NETWORK_LOGOS[NETWORK_IDS.OTHERS],
      height: getHeight(36),
      width: getWidth(36),
    },
  };

  const network =
    (site?.whitelabel_domain && networkStyles[site?.whitelabel_domain]) ||
    networkStyles[NETWORK_IDS.OTHERS];

  const styles = StyleSheet.create({
    modal: {
      flex: 1,
      margin: 0,
      marginTop: top + getHeight(402),
    },
    container: {
      flex: 1,
      borderRadius: getRadius(15),
      alignItems: 'center',
    },
    scrollView: {
      flexGrow: 1,
      paddingBottom: getHeight(80),
    },
    headerContainer: {
      flexDirection: 'row',
      width: getWidth(335),
      paddingHorizontal: getWidth(20),
    },
    iconContainer: {
      height: getHeight(36),
      flexDirection: 'row',
    },
    imageContainer: {
      borderRadius: getRadius(10),
      height: getWidth(90),
      width: getWidth(90),
      backgroundColor: network.color,
      justifyContent: 'center',
      alignItems: 'center',
      padding: getWidth(8),
    },
    textContainer: {
      width: getWidth(230),
    },
    statsRowContainer: {
      height: getHeight(48),
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    image: {
      resizeMode: 'contain',
      height: network.height || '100%',
      width: network.width || '100%',
    },
    pill: {
      width: getWidth(27),
      height: getHeight(5),
      borderRadius: getRadius(2.5),
      backgroundColor: 'rgb(222, 222, 222)',
    },
    headerText: {
      ...textStyles.semiBold20,
    },
    text: {
      ...textStyles.regular16,
      color: coloursTheme.text.secondary,
    },
    handleStyle: {
      display: 'none',
    },
    pillContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: getHeight(11),
    },
    pillButtonContainer: {
      width: getWidth(334),
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginHorizontal: getWidth(20),
    },
    availableContainer: {
      backgroundColor: coloursTheme.pill.status.available.backgroundColor,
    },
    unavailableContainer: {
      backgroundColor: coloursTheme.pill.status.unavailable.backgroundColor,
    },
    availableText: {
      color: coloursTheme.pill.status.available.color,
    },
    unavailableText: {
      color: coloursTheme.pill.status.unavailable.color,
    },
    statusPill: {
      width: getWidth(161),
    },
    divider: {
      width: getWidth(2),
      height: getHeight(44),
      opacity: 0.5,
      borderRadius: getRadius(1),
      backgroundColor: coloursTheme.divider.backgroundColor,
    },
    contentContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1,
    },
  });

  if (!site && loading) {
    return null;
  }

  // ** ** ** ** ** RENDER ** ** ** ** **
  return (
    <BottomSheet
      ref={bottomSheetRef}
      snapPoints={snapPoints}
      style={styles.container}
      handleStyle={styles.handleStyle}
      onAnimate={handleSheetAnimation}
      enablePanDownToClose
      onClose={onClose}
      containerStyle={{zIndex: 100}}
      animateOnMount
      index={1}>
      {showHeader ? (
        <DefaultHeader
          hideGoBack
          leftIcons={[
            {
              name: 'chevron-down',
              onPress: () =>
                bottomSheetRef.current?.snapToIndex(snapPoints.length - 2),
              isPro: true,
            },
          ]}
        />
      ) : (
        <>
          <Pressable
            style={styles.pillContainer}
            onPress={() =>
              bottomSheetRef.current?.snapToIndex(snapPoints.length - 1)
            }
            hitSlop={50}>
            <View style={styles.pill} />
          </Pressable>
          <Spacer vertical size={24} />
        </>
      )}
      <BottomSheetScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollView}>
        <View style={styles.headerContainer}>
          <View style={styles.imageContainer}>
            <Image style={styles.image} source={network.logo} />
          </View>
          <Spacer horizontal size={15} />
          <View style={styles.textContainer}>
            <Text style={styles.headerText} numberOfLines={1}>
              {site?.site_name}
            </Text>
            <Spacer vertical size={3} />
            <Text style={styles.text} numberOfLines={1}>
              {`${site?.site_address_address_line1}, ${site?.site_address_postal_code}, ${site?.site_address_locality}`}
            </Text>
            <Spacer vertical size={15} />
            <View style={styles.iconContainer}>{getConnectorIcons()}</View>
          </View>
        </View>

        <Spacer vertical size={18} />
        <View style={styles.statsRowContainer}>
          <View style={styles.contentContainer}>
            <Text style={styles.headerText} numberOfLines={1}>
              {siteDistance}
            </Text>
            <Spacer vertical size={5} />
            <Text style={styles.text}>miles</Text>
          </View>

          <View style={styles.divider} />
          <View style={styles.contentContainer}>
            <Text style={styles.headerText} numberOfLines={1}>
              {`${getSitesAvailableChargersCount(site)}/${getMaxChargers()}`}
            </Text>
            <Spacer vertical size={5} />
            <Text style={styles.text}>available</Text>
          </View>

          <View style={styles.divider} />
          <View style={styles.contentContainer}>
            <Text style={styles.headerText} numberOfLines={1}>
              {getMaxKwh()}
            </Text>
            <Spacer vertical size={5} />
            <Text style={styles.text}>max kW</Text>
          </View>
        </View>
        <Spacer vertical size={20} />
        <View style={styles.pillButtonContainer}>
          <Pill
            containerStyle={[
              styles.statusPill,
              true ? styles.availableContainer : styles.unavailableContainer,
            ]}
            text={true ? 'Open' : 'Closed'}
            textStyle={true ? styles.availableText : styles.unavailableText}
          />

          <Spacer horizontal size={13} />
          <DirectionsButton
            onPress={() =>
              openMaps({
                lng: site?.geo_coordinate?.coordinates[0] || 0,
                lat: site?.geo_coordinate?.coordinates[1] || 0,
                label: site?.site_name ?? CustomLabel,
              })
            }
          />
        </View>

        <ImageGallery images={site?.site_images || []} />

        <SiteSegmentedControl />
      </BottomSheetScrollView>
    </BottomSheet>
  );
};

export default SiteSummaryModal;
