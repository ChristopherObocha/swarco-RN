/*
 * Jira Ticket:
 * Zeplin Design:
 * Feature Document:
 * Created Date: Mon, 8th Jan 2024, 10:45:15 am
 * Author: Nawaf Ibrahim (nawaf.ibrahim@thedistance.co.uk)
 * Copyright (c) 2024 The Distance
 */

import React, {useEffect, useState} from 'react';
import {useDictionary} from 'providers/dictionary/dictionary-provider';
import {useScale} from 'providers/style/scale-provider';
import {useStyle} from 'providers/style/style-provider';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useLoading} from 'providers/loading/loading-provider';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useFAQ} from 'providers/apis/faq';

import DefaultHeader from 'components/headers/default-header';
import {Platform, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import CardContainer from 'components/cards/card-container';
import ScreenContainer from 'components/containers/screen-container';
import {Spacer} from 'components/utils/spacer';
import {ScrollView} from 'react-native';
import FA5 from 'react-native-vector-icons/FontAwesome5';
import FA5Pro from 'react-native-vector-icons/FontAwesome5Pro';
import {ACCOUNT_SCREENS} from '../../types/navigation';
import {FAQs} from 'providers/types/faqs';
import ContactUnavailableCard from 'components/cards/content-unavailable-card';
import {FAQ_TYPES} from 'utils/constants';

import {LoadingView} from 'components/utils/loading-view';

const FAQCategories = () => {
  const testID = 'FAQCategories';
  const {
    dictionary: {Account},
  } = useDictionary();

  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const {getFAQs} = useFAQ();
  const [faqs, setFaqs] = useState<FAQs[]>();
  const {loading} = useLoading();

  const faqCategories = [
    {
      type: FAQ_TYPES.HEADSET,
      renderIcon: () => renderIcon('headset', true),
    },
    {
      type: FAQ_TYPES.USER_COG,
      renderIcon: () => renderIcon('user-cog', true),
    },
    {
      type: FAQ_TYPES.CHARGING_STATION,
      renderIcon: () => renderIcon('charging-station', true),
    },
    {
      type: FAQ_TYPES.COINS,

      renderIcon: () => renderIcon('coins', true),
    },
    {
      type: FAQ_TYPES.MAP,
      renderIcon: () => renderIcon('map', true),
    },
    {
      type: FAQ_TYPES.OTHER,
      renderIcon: () => renderIcon('question-circle', true),
    },
  ];
  // ** ** ** ** ** EFFECTS ** ** ** ** **
  useEffect(() => {
    callGetFAQs();
  }, []);

  // ** ** ** ** ** FUNCTIONS ** ** ** ** **
  const callGetFAQs = async () => {
    const res = await getFAQs();
    if (res?.success) {
      setFaqs(res?.data);
    }
  };

  // ** ** ** ** ** STYLES ** ** ** ** **
  const {getHeight, getWidth, getFontSize} = useScale();
  const {textStyles, coloursTheme} = useStyle();
  const {bottom} = useSafeAreaInsets();

  const platformSpecificPaddingBottom = Platform.select({
    android: bottom + getHeight(100),
    ios: bottom + getHeight(50),
  });

  const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
      flex: 1,
    },
    contentContainer: {
      paddingBottom: platformSpecificPaddingBottom,
    },
    cardContainer: {
      alignItems: 'center',
      flexDirection: 'row',
    },
    iconContainer: {
      backgroundColor: coloursTheme.primaryColor,
      width: getWidth(40),
      aspectRatio: 1,
      borderRadius: getWidth(40) / 2,
      alignItems: 'center',
      justifyContent: 'center',
    },
    title: {
      ...textStyles.semiBold18,
      letterSpacing: 0,
    },
  });

  // ** ** ** ** ** RENDER ** ** ** ** **
  const renderIcon = (name: string, isPro: boolean = false) => {
    const Icon = isPro ? FA5Pro : FA5;
    return (
      <View style={styles.iconContainer} testID={`${testID}.fontAwesomeIcon`}>
        <Icon
          name={name}
          size={getFontSize(19)}
          solid={false}
          color={coloursTheme.button.icon.selected.color}
        />
      </View>
    );
  };

  if (!faqs || (faqs && !faqs?.length && loading)) {
    return <LoadingView />;
  }

  return (
    <>
      <DefaultHeader
        title={Account.faqs}
        customBackAction={
          route?.params?.tab
            ? () =>
                navigation.navigate(route?.params?.tab, {
                  returningFromFAQScreenParams:
                    route?.params?.returningFromFAQScreenParams,
                })
            : undefined
        }
      />

      <ScreenContainer style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.contentContainer}>
          {faqs && faqs?.length > 0 ? (
            faqs?.map(item => (
              <>
                <CardContainer>
                  <TouchableOpacity
                    style={styles.cardContainer}
                    onPress={() =>
                      navigation.navigate(
                        ACCOUNT_SCREENS.FAQ_SELECTED_CATEGORY,
                        {
                          title: item?.title,
                          faqs: item?.items,
                        },
                      )
                    }>
                    {faqCategories?.findIndex(i => i.type === item?.type) !==
                      -1 &&
                      faqCategories[
                        faqCategories.findIndex(i => i.type === item?.type)
                      ].renderIcon()}
                    <Spacer horizontal size={10} />
                    <Text style={styles.title} numberOfLines={1}>
                      {item.title}
                    </Text>
                  </TouchableOpacity>
                </CardContainer>
                <Spacer vertical size={15} />
              </>
            ))
          ) : (
            <ContactUnavailableCard />
          )}
        </ScrollView>
      </ScreenContainer>
    </>
  );
};

export default FAQCategories;
