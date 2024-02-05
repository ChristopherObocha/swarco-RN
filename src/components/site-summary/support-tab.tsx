import React, {useCallback, useEffect, useState} from 'react';
import {useScale} from 'providers/style/scale-provider';
import {useStyle} from 'providers/style/style-provider';
import {useSite} from 'providers/apis/site';
import {useDictionary} from 'providers/dictionary/dictionary-provider';
import {useHandleLinkPress} from 'utils/hooks';

import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {PrimaryButton} from 'components/buttons/primary-button';
import {SecondaryButton} from 'components/buttons/secondary-button';
import {Spacer} from 'components/utils/spacer';

import CardContainer from 'components/cards/card-container';
import {Support} from 'providers/types/site';
import {SOCIAL_ICONS} from 'utils/constants';
import {useNavigation, useRoute} from '@react-navigation/native';
import {ACCOUNT_SCREENS, MAP_SCREENS} from '../../types/navigation';

const SupportTab = () => {
  const {
    dictionary: {SupportTab},
  } = useDictionary();

  const {getSupport} = useSite();
  const [supportInformation, setSupportInformation] = useState<Support | null>(
    null,
  );
  const supportPhone = supportInformation?.phone?.replace(/\s/g, '');
  const handleLinkPress = useHandleLinkPress();
  const fetchSupport = useCallback(async () => {
    const response = await getSupport();

    if (response?.data) {
      setSupportInformation(response?.data);
    }
  }, [getSupport]);

  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  useEffect(() => {
    fetchSupport();
  }, [fetchSupport]);

  // ** ** ** ** ** STYLES ** ** ** ** **
  const {coloursTheme, textStyles} = useStyle();
  const {getWidth, getHeight} = useScale();

  const styles = StyleSheet.create({
    container: {
      backgroundColor: coloursTheme.backgroundColor,
      padding: getHeight(15),
      minHeight: '100%',
      alignItems: 'center',
    },
    card: {
      alignItems: 'center',
    },
    descriptionText: {
      ...textStyles.regular16,
      textAlign: 'center',
      letterSpacing: -0.2,
    },
    socialIconWrapper: {
      flexDirection: 'row',
    },
    iconStyle: {
      marginRight: getWidth(25),
    },
  });

  // ** ** ** ** ** RENDER ** ** ** ** **
  return (
    <View style={styles.container}>
      <CardContainer style={styles.card}>
        <Text style={textStyles.semiBold20}>{SupportTab.Title}</Text>
        <Spacer size={getHeight(15)} vertical />
        <Text style={styles.descriptionText}>{SupportTab.Description}</Text>
        <Spacer size={getHeight(25)} vertical />
        {supportInformation?.email && (
          <>
            <PrimaryButton
              title={SupportTab.EmailSupportTeam}
              onPress={() =>
                handleLinkPress(
                  `mailto:${encodeURIComponent(supportInformation?.email)}`,
                )
              }
              customWidth={getWidth(295)}
            />
            <Spacer size={getHeight(15)} vertical />
          </>
        )}
        {supportPhone && (
          <SecondaryButton
            title={SupportTab.CallSupportTeam}
            onPress={() =>
              handleLinkPress(`tel:${encodeURIComponent(supportPhone)}`)
            }
            customWidth={getWidth(295)}
          />
        )}
      </CardContainer>
      <Spacer size={getHeight(15)} vertical />
      <CardContainer style={styles.card}>
        <Text style={textStyles.semiBold20}>{SupportTab.FaqsTitle}</Text>
        <Spacer size={getHeight(20)} vertical />
        <PrimaryButton
          title={SupportTab.ViewFaqs}
          onPress={() =>
            navigation.navigate(MAP_SCREENS.FAQS, {
              tab: route.name,
            })
          }
          customWidth={getWidth(295)}
        />
      </CardContainer>

      {supportInformation?.support_socials &&
        supportInformation?.support_socials?.length > 0 && (
          <>
            <Spacer size={getHeight(15)} vertical />
            <CardContainer style={styles.card}>
              <Text style={textStyles.semiBold20}>
                {SupportTab.VisitSocialsTitle}
              </Text>
              <Spacer size={getHeight(20)} vertical />
              <View style={styles.socialIconWrapper}>
                {supportInformation?.support_socials?.map(
                  ({type, url}, index) => {
                    const Icon = SOCIAL_ICONS[type];

                    return (
                      <TouchableOpacity
                        onPress={() => handleLinkPress(url)}
                        style={
                          supportInformation?.support_socials &&
                          index !==
                            supportInformation?.support_socials.length - 1 &&
                          styles.iconStyle
                        }
                        key={url}>
                        <Icon />
                      </TouchableOpacity>
                    );
                  },
                )}
              </View>
            </CardContainer>
          </>
        )}
      <Spacer size={getHeight(15)} vertical />
    </View>
  );
};

export default SupportTab;
