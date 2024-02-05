/*
 * Jira Ticket:
 * Zeplin Design:
 * Feature Document:
 * Created Date: Tue, 28th Nov 2023, 4:14:47 pm
 * Author: Nawaf Ibrahim (nawaf.ibrahim@thedistance.co.uk)
 * Copyright (c) 2023 The Distance
 */

import React, {useMemo, useState, useEffect, Fragment} from 'react';

import {useScale} from 'providers/style/scale-provider';
import {useStyle} from 'providers/style/style-provider';
import {useDictionary} from 'providers/dictionary/dictionary-provider';
import {useProfile} from 'providers/apis/profile';

import {View, StyleSheet, Text, ScrollView} from 'react-native';
import {Spacer} from 'components/utils/spacer';
import DefaultHeader from 'components/headers/default-header';
import {Switch} from '@rneui/themed';

import ScreenContainer from 'components/containers/screen-container';
import {getObject} from 'utils/storage-utils';
import {STORAGE} from 'utils/constants';
import {useUser} from 'providers/apis/user';
import {useAlert} from 'providers/alert/alert-provider';

const MarketingSettings = () => {
  const testID = 'marketing-settings';
  const {coloursTheme, textStyles} = useStyle();
  const {getHeight, getWidth, getRadius} = useScale();
  const {
    dictionary: {MarketingSettings, Errors},
  } = useDictionary();

  const {profile, getProfile} = useProfile();
  const initialMarketingSettings = useMemo(() => {
    return {
      allMarketing:
        (profile?.marketingemail && profile?.marketingtext) ?? false,
      email: profile?.marketingemail ?? false,
      text: profile?.marketingtext ?? false,
    };
  }, [profile]);

  const [switches, setSwitches] = useState(initialMarketingSettings);
  const isLoggedIn = !getObject(STORAGE.GUEST_TOKEN);
  const {alert} = useAlert();
  const {updateUser} = useUser();

  const settingsContent = useMemo(() => {
    const allMarketing = [
      {
        title: MarketingSettings.AllMarketingTitle,
        description: '',
        isEnabled: switches.allMarketing && switches.email && switches.text,
      },
    ];
    const marketingCommunication = [
      {
        title: MarketingSettings.MarketingEmailTitle,
        description: MarketingSettings.MarketingEmailDescription,
        isEnabled: switches.email,
      },
      {
        title: MarketingSettings.MarketingTextsTitle,
        description: MarketingSettings.MarketingTextsDescription,
        isEnabled: switches.text,
      },
    ];

    return [
      {title: 'allMarketing', data: allMarketing},
      {title: 'marketingCommunication', data: marketingCommunication},
    ];
  }, [MarketingSettings, switches.allMarketing, switches.email, switches.text]);

  useEffect(() => {
    setSwitches(initialMarketingSettings);
  }, [initialMarketingSettings]);

  // ** ** ** ** ** ACTIONS ** ** ** ** *

  const updateProperty = async (propertyName: string, newValue: boolean) => {
    const params = {
      ...switches,
      [propertyName]: newValue,
    };

    if (propertyName === 'allMarketing') {
      params.email = newValue;
      params.text = newValue;
    } else if (propertyName === 'email' || propertyName === 'text') {
      params.allMarketing = false;
    }

    try {
      if (isLoggedIn) {
        const res = await updateUser({
          marketingemail: params.email,
          marketingtext: params.text,
        });
        if (!res.success) {
          const {Title, Description, CTA} = Errors.unknown;

          alert(Title, Description, [
            {
              text: CTA,
            },
          ]);
        } else {
          getProfile();
        }
      }

      setSwitches(params);
    } catch (error) {
      console.log(error);
    }
  };
  const toggleSwitch = (title: string) => {
    switch (title) {
      case MarketingSettings.AllMarketingTitle:
        updateProperty('allMarketing', !switches.allMarketing);
        break;
      case MarketingSettings.MarketingEmailTitle:
        updateProperty('email', !switches.email);
        break;
      case MarketingSettings.MarketingTextsTitle:
        updateProperty('text', !switches.text);
        break;
      default:
        break;
    }
  };

  // ** ** ** ** ** STYLES ** ** ** ** **
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: coloursTheme.backgroundColor,
    },
    sectionListContentContainer: {
      paddingHorizontal: getWidth(20),
      paddingTop: getHeight(10),
    },
    title: {
      ...textStyles.semiBold18,
    },
    section: {
      backgroundColor: coloursTheme.card.backgroundColor,
      marginBottom: getHeight(15),
      paddingHorizontal: getWidth(15),
      paddingVertical: getHeight(15),
      borderRadius: getRadius(10),
    },
    row: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
    },
    descriptionContainer: {
      width: getWidth(230),
    },
    switchContainer: {
      alignItems: 'flex-end',
      height: '100%',
    },
    switchTrackStyle: {
      height: getHeight(30),
      width: getWidth(50),
    },
    switchThumbStyle: {
      height: getHeight(26),
      width: getWidth(26),
      borderRadius: getRadius(26 / 2),
    },
    subsectionTitle: {
      ...textStyles.semiBold16,
    },
    subsectionDescription: {
      ...textStyles.regular16,
      letterSpacing: -0.7,
    },
  });

  // ** ** ** ** ** RENDER ** ** ** ** *

  return (
    <>
      <DefaultHeader
        title={MarketingSettings.MarketingSettingsHeader}
        testID={`${testID}.screen-header`}
        backgroundColor={coloursTheme.backgroundColor}
      />
      <ScreenContainer style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.sectionListContentContainer}>
          {settingsContent?.map((section, index) => (
            <View
              key={index}
              style={styles.section}
              testID={`${testID}.${section?.title}-container`}>
              {section?.data?.map((item, index) => (
                <Fragment key={index}>
                  {index > 0 && <Spacer vertical size={30} />}
                  <View style={styles.row}>
                    <View style={styles.descriptionContainer}>
                      <Text
                        style={styles.subsectionTitle}
                        testID={`${testID}.${item?.title}`}>
                        {item.title}
                      </Text>
                      <Spacer vertical size={5} />

                      {item.description && (
                        <Text
                          style={styles.subsectionDescription}
                          testID={`${testID}.${item?.description}`}>
                          {item.description}
                        </Text>
                      )}
                    </View>
                    <View style={styles.switchContainer}>
                      <Switch
                        value={item.isEnabled}
                        onValueChange={() => toggleSwitch(item.title)}
                        testID={testID}
                      />
                    </View>
                  </View>
                </Fragment>
              ))}
            </View>
          ))}
          <Spacer vertical size={75} />
        </ScrollView>
      </ScreenContainer>
    </>
  );
};

export default MarketingSettings;
