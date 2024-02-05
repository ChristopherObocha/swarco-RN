import React, {useEffect, useMemo, useState} from 'react';
import {useScale} from 'providers/style/scale-provider';
import {useDictionary} from 'providers/dictionary/dictionary-provider';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useAuth} from 'providers/apis/auth';
import {useNavigation} from '@react-navigation/native';
import {useAlert} from 'providers/alert/alert-provider';
import {useProfile} from 'providers/apis/profile';

import DefaultHeader from 'components/headers/default-header';
import {Platform, Pressable, ScrollView, StyleSheet, View} from 'react-native';
import {PrimaryButton} from 'components/buttons/primary-button';
import {SecondaryButton} from 'components/buttons/secondary-button';
import {TertiaryButton} from 'components/buttons/tertiary-button';
import {Spacer} from 'components/utils/spacer';
import ScreenContainer from 'components/containers/screen-container';
import {Input} from '@rneui/themed';

import {ACCOUNT_SCREENS, APP_CONTAINER_SCREENS} from '../../types/navigation';
import DeleteAccountModal from 'components/modals/delete-account-modal';
import UpdateNameModal from 'components/modals/update-name-modal';
import UpdatePhoneNumberModal from 'components/modals/update-phone-number-modal';
import UpdateDateOfBirthModal from 'components/modals/update-date-of-birth-modal';

const PersonalDetails = () => {
  const {
    dictionary: {PersonalDetails},
  } = useDictionary();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showUpdateNameModal, setShowUpdateNameModal] = useState(false);
  const [showUpdatePhoneNumberModal, setShowUpdatePhoneNumberModal] =
    useState(false);
  const [showUpdateDateOfBirthModal, setShowUpdateDateOfBirthModal] =
    useState(false);

  const [multiLineHeight, setMultiLineHeight] = useState(0);

  const navigation = useNavigation<any>();
  const {logout} = useAuth();
  const {alert} = useAlert();
  const {getProfile, profile} = useProfile();

  const addressInFormFormat = useMemo(() => {
    return {
      postcode: profile?.postcode ?? '',
      line_1: profile?.address1 ?? '',
      line_2: profile?.address2 ?? '',
      town_or_city: profile?.town ?? '',
      country: 'United Kingdom',
    };
  }, [profile]);

  const handleLogout = () => {
    const success = logout();

    if (success) {
      navigation.reset({
        index: 0,
        routes: [{name: APP_CONTAINER_SCREENS.BOTTOM_TABS}],
      });
    }
  };

  useEffect(() => {
    getProfile();
  }, [getProfile]);

  // ** ** ** ** ** STYLES ** ** ** ** **
  const {getWidth, getHeight} = useScale();
  const {bottom} = useSafeAreaInsets();

  const platformSpecificStyles = Platform.select({
    android: {
      buttonContainer: {
        alignItems: 'center',
        paddingBottom: bottom + getHeight(100),
      },
    },
    ios: {
      buttonContainer: {
        alignItems: 'center',
        paddingBottom: bottom + getHeight(50),
      },
    },
  }) as any;

  const styles = StyleSheet.create({
    container: {
      paddingHorizontal: getWidth(20),
    },
    multilineInput: {
      height: 'auto',
      paddingVertical: 5,
    },
    pressableOverlay: {
      position: 'absolute',
      top: 28,
      left: 0,
      right: 0,
      height: getHeight(45),
      zIndex: 1,
    },
  });

  // ** ** ** ** ** RENDER ** ** ** ** **
  return (
    <>
      <DefaultHeader
        title={PersonalDetails.Title}
        rightIcons={[
          {
            name: 'cog',
            onPress: () =>
              navigation.navigate(ACCOUNT_SCREENS.MARKETING_SETTINGS),
            isPro: true,
          },
        ]}
      />

      <ScreenContainer style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View>
            {/* onPress in <Input/> doesn't trigger when editable is false on android and hence Pressable is used to execute onPress functionality  */}
            <Pressable
              onPress={() => setShowUpdateNameModal(true)}
              style={styles.pressableOverlay}
            />
            <Input
              label={PersonalDetails.FullName}
              defaultValue={`${profile?.firstname} ${profile?.lastname}`}
              editable={false}
            />
          </View>

          <Input
            label={PersonalDetails.EmailAddress}
            defaultValue={profile?.email}
            editable={false}
            disabled
          />

          <View>
            {/* onPress in <Input/> doesn't trigger when editable is false on android and hence Pressable is used to execute onPress functionality  */}
            <Pressable
              style={styles.pressableOverlay}
              onPress={() => setShowUpdatePhoneNumberModal(true)}
            />
            <Input
              label={PersonalDetails.PhoneNumber}
              defaultValue={profile?.phonenumber}
              editable={false}
            />
          </View>

          <View>
            {/* onPress in <Input/> doesn't trigger when editable is false on android and hence Pressable is used to execute onPress functionality  */}
            <Pressable
              style={[styles.pressableOverlay, {height: multiLineHeight + 10}]}
              onPress={() =>
                navigation.navigate(ACCOUNT_SCREENS.ADD_HOME_ADDRESS, {
                  isUpdate: true,
                  userAddress: addressInFormFormat,
                })
              }
            />
            <Input
              label={PersonalDetails.FullAddress}
              defaultValue={`${profile?.address1 ?? ''}\n${
                profile?.address2 ? profile?.address2 + '\n' : ''
              }${profile?.town ? profile?.town + '\n' : ''}${
                profile?.postcode || ''
              }`}
              editable={false}
              multiline
              scrollEnabled={false}
              inputContainerStyle={styles.multilineInput}
              onLayout={e => {
                setMultiLineHeight(e.nativeEvent.layout.height);
              }}
              inputStyle={styles.multilineInput}
            />
          </View>

          <View>
            {/* onPress in <Input/> doesn't trigger when editable is false on android and hence Pressable is used to execute onPress functionality  */}
            <Pressable
              style={styles.pressableOverlay}
              onPress={() => setShowUpdateDateOfBirthModal(true)}
            />
            <Input
              label={PersonalDetails.DateOfBirth}
              defaultValue={profile?.dateofbirth}
              editable={false}
              placeholder={PersonalDetails.DateOfBirthPlaceholder}
            />
          </View>

          <View style={platformSpecificStyles.buttonContainer}>
            <PrimaryButton
              title={PersonalDetails.ChangePassword}
              onPress={() =>
                navigation.navigate(ACCOUNT_SCREENS.CHANGE_PASSWORD)
              }
            />
            <Spacer size={getHeight(20)} vertical />
            <SecondaryButton
              title={PersonalDetails.SignOut}
              onPress={() =>
                alert(PersonalDetails.AlertTitle, '', [
                  {onPress: handleLogout, text: PersonalDetails.AcceptText},
                  {
                    text: PersonalDetails.CancelText,
                    style: 'cancel',
                  },
                ])
              }
            />
            <Spacer size={getHeight(20)} vertical />
            <TertiaryButton
              title={PersonalDetails.RequestToDeleteAccount}
              onPress={() => setShowDeleteModal(true)}
            />
          </View>
        </ScrollView>
      </ScreenContainer>

      <DeleteAccountModal
        modalVisible={showDeleteModal}
        closeModal={() => setShowDeleteModal(false)}
      />
      <UpdateNameModal
        modalVisible={showUpdateNameModal}
        closeModal={() => setShowUpdateNameModal(false)}
      />
      <UpdatePhoneNumberModal
        modalVisible={showUpdatePhoneNumberModal}
        closeModal={() => setShowUpdatePhoneNumberModal(false)}
      />
      <UpdateDateOfBirthModal
        modalVisible={showUpdateDateOfBirthModal}
        closeModal={() => setShowUpdateDateOfBirthModal(false)}
      />
    </>
  );
};

export default PersonalDetails;
