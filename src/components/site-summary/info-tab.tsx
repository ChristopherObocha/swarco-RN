import React, {Fragment} from 'react';

import {useScale} from 'providers/style/scale-provider';
import {useStyle} from 'providers/style/style-provider';
import {useSite} from 'providers/apis/site';
import {useAlert} from 'providers/alert/alert-provider';
import {useDictionary} from 'providers/dictionary/dictionary-provider';

import {View, StyleSheet, Linking} from 'react-native';
import {InfoListCard} from 'components/cards/info-list-card';
import {Spacer} from 'components/utils/spacer';
import CardContainer from 'components/cards/card-container';
import {Text} from '@rneui/themed';
import {SecondaryButton} from 'components/buttons/secondary-button';
import FastImage from 'react-native-fast-image';
import {
  AccessTypeTaxonomyMap,
  DAYS,
  LocationTaxonomyMap,
  PaymentTaxonomyMap,
  SITE_OPEN_TIMES,
} from 'providers/types/site';
import {
  capitalizeFirstLetter,
  convertHoursToHumanReadableTime,
} from 'utils/general-utils';
import {NETWORK_VALUES, WHAT3WORDS} from 'utils/constants';

const what3WordsLogo = require('assets/images/logos/what3words.png');

const convertResponseToList = (
  data: PaymentTaxonomyMap[] | LocationTaxonomyMap[] | AccessTypeTaxonomyMap[],
) => {
  return data.map(item => {
    const {icon, name, value} = item;
    return {
      iconName: icon || 'info-circle',
      description: name || value || '',
    };
  });
};

const convertWorkingHoursToString = (data?: SITE_OPEN_TIMES[]) => {
  if (!data) {
    return '';
  }

  const openTimes = data.map(({day, starthours, endhours}) => {
    const dayName = DAYS[day];
    const openTime = convertHoursToHumanReadableTime(starthours);
    const closeTime = convertHoursToHumanReadableTime(endhours);

    return `${capitalizeFirstLetter(dayName)}: ${openTime} - ${closeTime}`;
  });

  return openTimes.join('\n');
};

const InfoTab = () => {
  const {
    dictionary: {
      SiteSummary: {Info, What3Words, UnableToOpenWhat3Words},
    },
  } = useDictionary();
  const {siteResponse} = useSite();
  const {alert} = useAlert();

  const operatorDetails =
    siteResponse?.network_provider?.operator_details || '';
  const accessibilityStandards = siteResponse?.access_types;

  const infoList = [
    siteResponse?.payment_methods?.length
      ? {
          title: Info.PaymentMethods,
          iconAndDescriptionList: convertResponseToList(
            siteResponse?.payment_methods,
          ),
        }
      : null,
    {
      title: Info.SiteOperator,
      iconAndDescriptionList: [
        {
          iconName: 'building',
          description: siteResponse?.whitelabel_domain
            ? NETWORK_VALUES[siteResponse?.whitelabel_domain]
            : NETWORK_VALUES.others,
        },
      ],
    },
    siteResponse?.charge_point_opening_times?.length || siteResponse?.open_24_7
      ? {
          title: Info.OpeningHours,
          iconAndDescriptionList: [
            {
              iconName: 'clock',
              description: siteResponse?.open_24_7
                ? Info.OpeningHoursDescription
                : convertWorkingHoursToString(
                    siteResponse?.charge_point_opening_times,
                  ),
            },
          ],
        }
      : null,
    siteResponse?.location_details?.length
      ? {
          title: Info.LocationDetails,
          iconAndDescriptionList: convertResponseToList(
            siteResponse?.location_details,
          ),
        }
      : null,
    siteResponse?.site_facility?.length
      ? {
          title: Info.LocationFacilities,
          iconAndDescriptionList: convertResponseToList(
            siteResponse?.site_facility,
          ),
        }
      : null,
    accessibilityStandards?.length
      ? {
          title: Info.AccessibilityStandards,
          iconAndDescriptionList: convertResponseToList(accessibilityStandards),
        }
      : null,
    operatorDetails
      ? {
          title: Info.AccessibilityStandards,
          iconAndDescriptionList: [
            {
              iconName: 'info-circle',
              description: operatorDetails,
            },
          ],
        }
      : null,
  ];

  const handleOpenWhat3Words = async () => {
    const what3wordsUrl = WHAT3WORDS(siteResponse?.site_what3words);
    const canOpenWhat3Words = await Linking.canOpenURL(what3wordsUrl);

    if (canOpenWhat3Words) {
      await Linking.openURL(what3wordsUrl);
    } else {
      alert(UnableToOpenWhat3Words);
    }
  };

  // ** ** ** ** ** STYLES ** ** ** ** **
  const {coloursTheme, textStyles} = useStyle();
  const {getHeight, getWidth} = useScale();

  const styles = StyleSheet.create({
    container: {
      backgroundColor: coloursTheme.backgroundColor,
      padding: getHeight(15),
      paddingBottom: getHeight(40),
      minHeight: '100%',
    },
    titleContainer: {
      alignItems: 'center',
    },
    starContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    ratingTextContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    ratingText: {
      ...textStyles.semiBold18,
    },
    wordsDescription: {
      ...textStyles.regular16,
      letterSpacing: 0,
    },
  });

  // ** ** ** ** ** RENDER ** ** ** ** **
  return (
    <View style={styles.container}>
      {infoList
        .filter(data => !!data)
        .map((data, index) => {
          return (
            <Fragment key={index}>
              <InfoListCard
                key={index}
                title={data?.title}
                iconAndDescriptionList={data?.iconAndDescriptionList}
              />
              {index !== infoList.length - 1 && (
                <Spacer size={getHeight(15)} vertical />
              )}
            </Fragment>
          );
        })}
      {!!siteResponse?.site_what3words && (
        <>
          <Spacer size={15} vertical />

          <CardContainer>
            <FastImage
              source={what3WordsLogo}
              style={{
                width: getWidth(160),
                height: getHeight(56),
              }}
              resizeMode="contain"
            />
            <Spacer size={getHeight(5)} />
            <Text style={styles.wordsDescription}>{What3Words}</Text>
            <Spacer size={getHeight(15)} />
            <SecondaryButton
              title="View map"
              customWidth={getWidth(295)}
              onPress={handleOpenWhat3Words}
            />
          </CardContainer>
        </>
      )}
    </View>
  );
};

export default InfoTab;
