import React, {useCallback, useState} from 'react';
import {useScale} from 'providers/style/scale-provider';
import {useStyle} from 'providers/style/style-provider';

import InfoTab from 'components/site-summary/info-tab';
import StationTab from 'components/site-summary/station-tab';
import SupportTab from 'components/site-summary/support-tab';
import TariffTab from 'components/site-summary/tariff-tab';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';

import {palette} from 'providers/style/palette';
import {SEGEMENTED_CONTROL} from 'utils/constants';

const siteSegmentedControlValues: {
  [key: string]: number;
} = {
  stations: 0,
  tariff: 1,
  info: 2,
  support: 3,
};

const siteSegmentedControlOptions: {
  [key: number]: string;
} = {
  [siteSegmentedControlValues.stations]: SEGEMENTED_CONTROL.STATIONS,
  [siteSegmentedControlValues.tariff]: SEGEMENTED_CONTROL.TARIFF,
  [siteSegmentedControlValues.info]: SEGEMENTED_CONTROL.INFO,
  [siteSegmentedControlValues.support]: SEGEMENTED_CONTROL.SUPPORT,
};

const segmentedTab = {
  [siteSegmentedControlValues.stations]: <StationTab />,
  [siteSegmentedControlValues.tariff]: <TariffTab />,
  [siteSegmentedControlValues.info]: <InfoTab />,
  [siteSegmentedControlValues.support]: <SupportTab />,
};

const SiteSegmentedControl = () => {
  const [selectedControl, setSelectedControl] = useState(0);

  // ** ** ** ** ** STYLES ** ** ** ** **
  const {getWidth, getHeight} = useScale();
  const {textStyles, coloursTheme} = useStyle();

  const styles = StyleSheet.create({
    container: {
      borderBottomWidth: getHeight(2),
      borderBottomColor: coloursTheme.lightGrey,
      alignItems: 'center',
    },
    segmentContainer: {
      width: getWidth(334),
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: getHeight(25),
    },
    segment: {
      width: getWidth(76),
      height: getHeight(30),
      alignItems: 'center',
      justifyContent: 'center',
    },
    active: {
      height: getHeight(2),
      width: getWidth(76),
      backgroundColor: palette.blue,
      position: 'absolute',
      bottom: getWidth(-2),
    },
    text: {
      ...textStyles.regular16,
    },
  });

  const Tab = useCallback(
    ({item}: {item: number}) => (
      <TouchableOpacity
        style={styles.segment}
        onPress={() => setSelectedControl(item)}>
        <Text style={styles.text}>{siteSegmentedControlOptions[item]}</Text>

        {selectedControl === item && <View style={styles.active} />}
      </TouchableOpacity>
    ),
    [selectedControl, styles],
  );

  // ** ** ** ** ** RENDER ** ** ** ** **
  return (
    <>
      <View style={styles.container}>
        <View style={styles.segmentContainer}>
          {Object.values(siteSegmentedControlValues).map(key => (
            <Tab key={key} item={key} />
          ))}
        </View>
      </View>
      {segmentedTab[selectedControl]}
    </>
  );
};

export default SiteSegmentedControl;
