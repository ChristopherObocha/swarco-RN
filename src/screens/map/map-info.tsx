import React from 'react';

import {useDictionary} from 'providers/dictionary/dictionary-provider';
import {useScale} from 'providers/style/scale-provider';
import {useStyle} from 'providers/style/style-provider';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {View, StyleSheet, ScrollView} from 'react-native';
import DefaultHeader from 'components/headers/default-header';
import {Text} from '@rneui/themed';
import {Spacer} from 'components/utils/spacer';
import BoltIcon from 'assets/svg/bolt-icon.svg';
import FontAwesome5Pro from 'react-native-vector-icons/FontAwesome5Pro';
// import FlagIcon from 'assets/svg/'

interface ListItem {
  text: string;
  tagProps: {
    type?: 'darkBlue' | 'blue' | 'outlined';
    icon?: string | JSX.Element;
    number?: string;
  };
}

const MapInfoScreen = () => {
  const {
    dictionary: {MapInfo},
  } = useDictionary();

  // ** ** ** ** ** STYLES ** ** ** ** **
  const {getWidth, getHeight, getRadius, getFontSize} = useScale();
  const {
    coloursTheme,
    textStyles,
    coloursTheme: {
      pin: {pointOfInterest},
    },
  } = useStyle();
  const {bottom} = useSafeAreaInsets();

  const styles = StyleSheet.create({
    container: {
      paddingHorizontal: getWidth(20),
      paddingTop: getWidth(10),
      marginBottom: bottom,
    },
    card: {
      paddingHorizontal: getWidth(15),
      paddingVertical: getHeight(15),
      width: getWidth(335),
      borderRadius: getRadius(10),
      backgroundColor: coloursTheme.card.backgroundColor,
    },
    listItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: getHeight(10),
      width: getWidth(305),
    },
    listItemText: {
      ...textStyles.regular16,
      width: getWidth(245),
      letterSpacing: -0.5,
    },
    tag: {
      borderRadius: getRadius(5),
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      width: getWidth(28),
      height: getWidth(28),
    },
    longTag: {
      width: getWidth(58.5),
      height: getWidth(28),
      justifyContent: 'space-evenly',
    },
    blue: {
      backgroundColor: coloursTheme.map.stationTag.blue.backgroundColour,
    },
    darkBlue: {
      backgroundColor: pointOfInterest.backgroundColor,
    },
    outlined: {
      borderWidth: getWidth(2),
      borderColor: coloursTheme.map.stationTag.outlined.borderColour,
      width: getWidth(42),
      height: getWidth(35),
      backgroundColor: coloursTheme.map.stationTag.outlined.backgroundColour,
    },
  });

  const mapPinsList: ListItem[] = [
    {
      text: MapInfo.SearchedLocation,
      tagProps: {
        type: 'darkBlue',
        icon: 'flag',
      },
    },
    {
      text: MapInfo.AvailableAllStations,
      tagProps: {
        icon: <BoltIcon />,
        number: '4/4',
      },
    },
    {
      text: MapInfo.UnavailableStations,
      tagProps: {
        icon: <BoltIcon />,
      },
    },
    {
      text: MapInfo.NumberOfStations,
      tagProps: {
        type: 'outlined',
        number: '21',
      },
    },
  ];

  const siteTypesList: ListItem[] = [
    {
      text: MapInfo.PublicStations,
      tagProps: {
        icon: <BoltIcon />,
      },
    },
    {
      text: MapInfo.TaxiStations,
      tagProps: {
        icon: 'taxi',
      },
    },
    {
      text: MapInfo.HomeStations,
      tagProps: {
        icon: 'home',
      },
    },
    {
      text: MapInfo.AccessibleStations,
      tagProps: {
        icon: 'wheelchair',
      },
    },
    {
      text: MapInfo.UnknownStations,
      tagProps: {
        icon: 'question-circle',
      },
    },
    {
      text: MapInfo.CarParkStations,
      tagProps: {
        icon: 'parking',
      },
    },
    {
      text: MapInfo.MaintainenceStations,
      tagProps: {
        icon: 'tools',
      },
    },
    {
      text: MapInfo.ConstructionStations,
      tagProps: {
        icon: 'construction',
      },
    },
  ];

  // ** ** ** ** ** RENDER ** ** ** ** **
  return (
    <>
      <DefaultHeader title={MapInfo.MapInfo} />
      <ScrollView style={styles.container}>
        <View style={styles.card}>
          <Text style={{...textStyles.semiBold20}}>{MapInfo.MapPins}</Text>

          {mapPinsList.map(({text, tagProps}, index) => {
            const isLongTag = tagProps.number && tagProps.icon ? true : false;
            const tagType = tagProps.type || 'blue';
            const {textColour} = coloursTheme.map.stationTag[tagType];

            return (
              <View key={index} style={styles.listItem}>
                <Text style={styles.listItemText}>{text}</Text>

                <View
                  style={[
                    styles.tag,
                    styles[tagType],
                    isLongTag ? styles.longTag : null,
                  ]}>
                  {tagProps.icon && typeof tagProps.icon === 'string' ? (
                    <FontAwesome5Pro
                      name={tagProps.icon}
                      color={textColour}
                      size={getFontSize(14)}
                      solid
                    />
                  ) : (
                    tagProps.icon
                  )}

                  {tagProps.number && (
                    <Text
                      style={{
                        ...textStyles.bold16,
                        color: textColour,
                      }}>
                      {tagProps.number}
                    </Text>
                  )}
                </View>
              </View>
            );
          })}
        </View>
        <Spacer size={getHeight(15)} />
        <View style={styles.card}>
          <Text style={{...textStyles.semiBold20}}>{MapInfo.SiteTypes}</Text>

          {siteTypesList.map(({text, tagProps}, index) => {
            const isLongTag = tagProps.number && tagProps.icon ? true : false;
            const tagType = tagProps.type || 'blue';
            const {textColour} = coloursTheme.map.stationTag[tagType];

            return (
              <View key={index} style={styles.listItem}>
                <Text style={styles.listItemText}>{text}</Text>

                <View
                  style={[
                    styles.tag,
                    styles[tagType],
                    isLongTag ? styles.longTag : null,
                  ]}>
                  {tagProps.icon && typeof tagProps.icon === 'string' ? (
                    <FontAwesome5Pro
                      name={tagProps.icon}
                      color={textColour}
                      size={getFontSize(14)}
                      solid
                    />
                  ) : (
                    tagProps.icon
                  )}

                  {tagProps.number && (
                    <Text
                      style={{
                        ...textStyles.bold16,
                        color: textColour,
                      }}>
                      {tagProps.number}
                    </Text>
                  )}
                </View>
              </View>
            );
          })}
        </View>
        <Spacer size={getHeight(30)} />
      </ScrollView>
    </>
  );
};

export default MapInfoScreen;
