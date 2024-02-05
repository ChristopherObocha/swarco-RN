import React, {useCallback, useEffect, useState} from 'react';
import {useDictionary} from 'providers/dictionary/dictionary-provider';
import {useScale} from 'providers/style/scale-provider';
import {useStyle} from 'providers/style/style-provider';
import {useHandleLinkPress} from 'utils/hooks';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useSite} from 'providers/apis/site';
import {useLoading} from 'providers/loading/loading-provider';

import DefaultHeader from 'components/headers/default-header';
import {Platform, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import CardContainer from 'components/cards/card-container';
import SupportCentreIcon from 'assets/svg/support-centre-icon.svg';
import ScreenContainer from 'components/containers/screen-container';
import {PrimaryButton} from 'components/buttons/primary-button';
import {SecondaryButton} from 'components/buttons/secondary-button';
import {Spacer} from 'components/utils/spacer';
import {ScrollView} from 'react-native';
import {Support} from 'providers/types/site';
import {SOCIAL_ICONS} from 'utils/constants';
import {useNavigation} from '@react-navigation/native';
import {ACCOUNT_SCREENS} from '../../types/navigation';
import ContactUnavailableCard from 'components/cards/content-unavailable-card';
import {LoadingView} from 'components/utils/loading-view';

const SupportCenterScreen = () => {
  const {
    dictionary: {SupportCentre},
  } = useDictionary();

  const {loading} = useLoading();
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

  useEffect(() => {
    fetchSupport();
  }, [fetchSupport]);

  // ** ** ** ** ** STYLES ** ** ** ** **
  const {getHeight, getWidth} = useScale();
  const {textStyles} = useStyle();
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
      paddingVertical: getHeight(25),
    },
    centeredText: {
      textAlign: 'center',
    },
    socialIconWrapper: {
      flexDirection: 'row',
    },
    iconStyle: {
      marginRight: getWidth(25),
    },
  });

  if (!supportInformation && loading) {
    return <LoadingView />;
  }

  // ** ** ** ** ** RENDER ** ** ** ** **
  return (
    <>
      <DefaultHeader title={SupportCentre.Header} />

      <ScreenContainer style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.contentContainer}>
          {!supportInformation ? (
            <ContactUnavailableCard />
          ) : (
            <>
              <CardContainer style={styles.cardContainer}>
                <SupportCentreIcon
                  width={getWidth(120)}
                  height={getHeight(120)}
                />
                <Spacer size={getHeight(25)} vertical />
                <Text style={textStyles.semiBold20}>{SupportCentre.Title}</Text>
                <Spacer size={getHeight(15)} vertical />
                <Text style={[styles.centeredText, textStyles.regular16]}>
                  {SupportCentre.Description}
                </Text>
                {supportInformation?.email && (
                  <>
                    <Spacer size={getHeight(25)} vertical />
                    <PrimaryButton
                      title={SupportCentre.EmailSupportTeam}
                      onPress={() =>
                        handleLinkPress(
                          `mailto:${encodeURIComponent(
                            supportInformation?.email,
                          )}`,
                        )
                      }
                      customWidth={getWidth(295)}
                    />
                  </>
                )}
                {supportPhone && (
                  <>
                    <Spacer size={getHeight(15)} vertical />
                    <SecondaryButton
                      title={SupportCentre.CallSupportTeam}
                      onPress={() =>
                        handleLinkPress(
                          `tel:${encodeURIComponent(supportPhone)}`,
                        )
                      }
                      customWidth={getWidth(295)}
                    />
                  </>
                )}
              </CardContainer>
              <Spacer size={getHeight(15)} vertical />
              <CardContainer style={styles.cardContainer}>
                <Text style={textStyles.semiBold20}>
                  {SupportCentre.FaqsTitle}
                </Text>
                <Spacer size={getHeight(25)} vertical />
                <PrimaryButton
                  title={SupportCentre.ViewFaqs}
                  customWidth={getWidth(295)}
                  onPress={() => navigation.navigate(ACCOUNT_SCREENS.FAQS)}
                />
              </CardContainer>

              {supportInformation?.support_socials &&
                supportInformation?.support_socials?.length > 0 && (
                  <>
                    <Spacer size={getHeight(15)} vertical />
                    <CardContainer style={styles.cardContainer}>
                      <Text style={textStyles.semiBold18}>
                        {SupportCentre.VisitSocialsTitle}
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
                                    supportInformation?.support_socials.length -
                                      1 &&
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
              <Spacer size={getHeight(25)} vertical />
            </>
          )}
        </ScrollView>
      </ScreenContainer>
    </>
  );
};

export default SupportCenterScreen;
