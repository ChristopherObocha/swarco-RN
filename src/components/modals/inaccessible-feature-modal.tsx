/*
 * Jira Ticket:
 * Zeplin Design:
 * Feature Document:
 * Created Date: Mon, 8th Jan 2024, 15:09:44 pm
 * Author: Christopher Obocha (chris.obocha@thedistance.co.uk)
 * Copyright (c) 2024 The Distance
 */
import React from 'react';
import {useDictionary} from 'providers/dictionary/dictionary-provider';
import {useStyle} from 'providers/style/style-provider';
import {useScale} from 'providers/style/scale-provider';
import {useNavigation} from '@react-navigation/native';
import {ACCOUNT_SCREENS} from '../../types/navigation';

import {View, Text, StyleSheet} from 'react-native';
import ModalContainer from 'components/containers/modal-container';
import UserIcon from 'assets/svg/user-icon.svg';
import {Spacer} from 'components/utils/spacer';
import {PrimaryButton} from 'components/buttons/primary-button';
import {TertiaryButton} from 'components/buttons/tertiary-button';

interface Props {
  modalVisible: boolean;
  closeModal: () => void;
}

const InaccessibleFeatureModal = ({modalVisible, closeModal}: Props) => {
  const {
    dictionary: {SignInModal, InaccessibleFeatureModal},
  } = useDictionary();

  const navigation = useNavigation<any>();

  // ** ** ** ** ** STYLES ** ** ** ** **
  const {getHeight, getWidth} = useScale();
  const {textStyles, coloursTheme} = useStyle();
  const styles = StyleSheet.create({
    container: {
      paddingVertical: getHeight(20),
      paddingHorizontal: getWidth(30),
      alignItems: 'center',
    },
    titleText: {
      ...textStyles.semiBold25,
      color: coloursTheme.modal.text,
      textAlign: 'center',
      lineHeight: getHeight(30),
      marginBottom: getHeight(15),
    },
    descriptionText: {
      ...textStyles.regular16,
      color: coloursTheme.modal.text,
      textAlign: 'center',
      lineHeight: getHeight(20),
      marginBottom: getHeight(30),
    },
  });

  const handleRegister = () => {
    closeModal();
    navigation.navigate(ACCOUNT_SCREENS.CREATE_ACCOUNT);
  };

  const handleSignIn = () => {
    closeModal();
    navigation.navigate(ACCOUNT_SCREENS.SIGN_IN);
  };

  // ** ** ** ** ** RENDER ** ** ** ** **
  return (
    <ModalContainer modalVisible={modalVisible} closeModal={closeModal}>
      <View style={styles.container}>
        <UserIcon />
        <Spacer vertical size={50} />
        <Text style={styles.titleText}>{InaccessibleFeatureModal.Title}</Text>
        <Text style={styles.descriptionText} numberOfLines={3}>
          {InaccessibleFeatureModal.Description}
        </Text>

        <PrimaryButton
          title={SignInModal.CreateAccount}
          onPress={handleRegister}
        />
        <Spacer vertical size={15} />
        <TertiaryButton title={SignInModal.SignIn} onPress={handleSignIn} />
      </View>
    </ModalContainer>
  );
};

export default InaccessibleFeatureModal;
