import React from 'react';
import {useScale} from 'providers/style/scale-provider';
import {useStyle} from 'providers/style/style-provider';
import {useSite} from 'providers/apis/site';
import {useDictionary} from 'providers/dictionary/dictionary-provider';

import {View, StyleSheet} from 'react-native';
import {Text} from '@rneui/themed';
import {Spacer} from 'components/utils/spacer';
import CardContainer from 'components/cards/card-container';

const InfoIcon = require('assets/svg/info-circle.svg').default;

const TariffTab = () => {
  const {siteResponse} = useSite();
  const {
    dictionary: {
      SiteSummary: {Tariff},
    },
  } = useDictionary();

  // ** ** ** ** ** STYLES ** ** ** ** **
  const {coloursTheme, textStyles} = useStyle();
  const {getHeight, getWidth} = useScale();

  const styles = StyleSheet.create({
    container: {
      backgroundColor: coloursTheme.backgroundColor,
      padding: getHeight(15),
      paddingBottom: getHeight(40),
      minHeight: '100%',
      alignItems: 'center',
    },
    row: {
      flexDirection: 'row',
    },
    textStyles: {
      ...textStyles.regular16,
      width: getWidth(264),
    },
  });

  // ** ** ** ** ** RENDER ** ** ** ** **
  return (
    <View style={styles.container}>
      <CardContainer>
        <Text style={textStyles.semiBold18}>{Tariff.AdditionalFees}</Text>
        <Spacer size={getHeight(15)} vertical />
        <View style={styles.row}>
          <InfoIcon />
          <Spacer size={getWidth(10)} />
          <Text style={styles.textStyles}>
            {Tariff.AdditionalFeesDescription}
          </Text>
        </View>
        {siteResponse?.site_tariff?.data?.description && (
          <>
            <Spacer size={getWidth(15)} vertical />
            <View style={styles.row}>
              <InfoIcon />
              <Spacer size={getWidth(10)} />
              <Text style={styles.textStyles}>
                {siteResponse?.site_tariff?.data?.description}
              </Text>
            </View>
            <Spacer size={getWidth(15)} vertical />
          </>
        )}
      </CardContainer>
    </View>
  );
};

export default TariffTab;
