import React, {useState} from 'react';

import {useDictionary} from 'providers/dictionary/dictionary-provider';

import ModalContainer from 'components/containers/modal-container';
import {StyleSheet, View} from 'react-native';

import {PrimaryButton} from 'components/buttons/primary-button';
import {TertiaryButton} from 'components/buttons/tertiary-button';
import {useScale} from 'providers/style/scale-provider';
import {useStyle} from 'providers/style/style-provider';
import {Spacer} from 'components/utils/spacer';

import {Text} from '@rneui/themed';

const signInSvg = require('assets/svg/user-icon.svg');

const IconGraphic = signInSvg.default;

const SignInModal = () => {
  const [modalVisible, setModalVisible] = useState(true);
  const {getHeight} = useScale();
  const {textStyles, coloursTheme} = useStyle();
  const {dictionary} = useDictionary();
  const {SignInModal: SignInModalDictionary} = dictionary;

  // ** ** ** ** ** STYLES ** ** ** ** **
  const styles = StyleSheet.create({
    contentContainer: {
      padding: getHeight(20),
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

  // ** ** ** ** ** RENDER ** ** ** ** **
  return (
    <ModalContainer
      modalVisible={modalVisible}
      closeModal={() => setModalVisible(false)}>
      <View style={styles.contentContainer}>
        <IconGraphic />
        <Spacer vertical size={50} />
        <Text style={styles.titleText}>{SignInModalDictionary.Title}</Text>
        <Text style={styles.descriptionText}>
          {SignInModalDictionary.Description}
        </Text>

        <PrimaryButton title={SignInModalDictionary.CreateAccount} />
        <Spacer vertical size={30} />
        <TertiaryButton title={SignInModalDictionary.SignIn} />
      </View>
    </ModalContainer>
  );
};

export default SignInModal;
