import React, {useCallback, useEffect, useState} from 'react';
import {useDictionary} from 'providers/dictionary/dictionary-provider';
import {useBiometrics} from 'providers/biometrics/biometrics-provider';
import {useStyle} from 'providers/style/style-provider';
import {useScale} from 'providers/style/scale-provider';
import {useProfile} from 'providers/apis/profile';

import {View, Text, StyleSheet} from 'react-native';
import ModalContainer from 'components/containers/modal-container';
import BiometricsIcon from 'assets/svg/biometrics-icon.svg';
import {Spacer} from 'components/utils/spacer';
import {PrimaryButton} from 'components/buttons/primary-button';
import {SecondaryButton} from 'components/buttons/secondary-button';
import {getToken} from 'utils/get-token';
import {STORAGE, TOKEN_TYPES} from 'utils/constants';
import {getObject, setObject} from 'utils/storage-utils';

const BiometricsSignInModal = () => {
  const {
    dictionary: {BiometricsModal},
  } = useDictionary();
  const {checkBiometrics, deviceSupportsBiometrics} = useBiometrics();
  const {getProfile, profile} = useProfile();
  const [isVerified, setIsVerified] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const token = getToken(TOKEN_TYPES.ACCESS_TOKEN);
  const guestToken = getObject(STORAGE.GUEST_TOKEN);

  const fetchProfile = useCallback(async () => {
    await getProfile();
  }, [getProfile]);

  useEffect(() => {
    if (token && !guestToken) {
      if (profile) {
        const {emailverified} = profile;
        setIsVerified(emailverified);
      } else {
        fetchProfile();
      }
    }
  }, [token, fetchProfile, profile, guestToken]);

  useEffect(() => {
    isVerified && openModal();
  }, [isVerified]);

  const openModal = async () => {
    const hasShownBiometricsModal = getObject(STORAGE.SHOWN_BIOMETRICS);
    const isBiometricsEnabled = getObject(STORAGE.IS_BIOMETRICS_ENABLED);

    if (isBiometricsEnabled) {
      return setObject(STORAGE.SHOWN_BIOMETRICS, true);
    }

    !hasShownBiometricsModal && setShowModal(true);
  };

  const closeModal = () => {
    setObject(STORAGE.SHOWN_BIOMETRICS, true);
    setShowModal(false);
  };

  const handleUseBiometrics = async () => {
    setObject(STORAGE.IS_BIOMETRICS_ENABLED, true);
    const isBiometricsEnabled = await checkBiometrics();
    if (isBiometricsEnabled) {
      closeModal();
    }
  };

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

  if (!token || !deviceSupportsBiometrics) {
    return null;
  }

  // ** ** ** ** ** RENDER ** ** ** ** **
  return (
    <ModalContainer modalVisible={showModal} closeModal={closeModal}>
      <View style={styles.container}>
        <BiometricsIcon />
        <Spacer vertical size={50} />
        <Text style={styles.titleText}>{BiometricsModal.Title}</Text>
        <Text style={styles.descriptionText}>
          {BiometricsModal.Description}
        </Text>

        <PrimaryButton
          title={BiometricsModal.PrimaryButton}
          onPress={handleUseBiometrics}
        />
        <Spacer vertical size={15} />
        <SecondaryButton
          title={BiometricsModal.SecondaryButton}
          onPress={closeModal}
        />
      </View>
    </ModalContainer>
  );
};

export default BiometricsSignInModal;
