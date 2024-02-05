import React from 'react';

import {useScale} from 'providers/style/scale-provider';
import {useStyle} from 'providers/style/style-provider';

import {Text, StyleSheet, ScrollView, View} from 'react-native';
import ModalContainer from 'components/containers/modal-container';
import {PrimaryButton} from 'components/buttons/primary-button';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

interface Props {
  modalVisible: boolean;
  closeModal: () => void;
  handleAccept: () => void;
  title: string;
  description: string;
}

const ContentModal = ({
  modalVisible,
  closeModal,
  handleAccept,
  title,
  description,
}: Props) => {
  // ** ** ** ** ** STYLES ** ** ** ** **
  const {getWidth, getHeight} = useScale();
  const {textStyles} = useStyle();
  const {bottom} = useSafeAreaInsets();

  const styles = StyleSheet.create({
    container: {
      paddingHorizontal: getWidth(20),
    },
    text: {
      ...textStyles.regular16,
    },
    buttonStyle: {
      marginTop: getWidth(40),
      marginBottom: bottom + getHeight(50),
      alignItems: 'center',
    },
  });

  // ** ** ** ** ** RENDER ** ** ** ** **
  return (
    <ModalContainer
      title={title}
      modalVisible={modalVisible}
      closeModal={closeModal}>
      <ScrollView style={styles.container}>
        <Text style={styles.text}>{description}</Text>

        <View style={styles.buttonStyle}>
          <PrimaryButton title="Accept" onPress={handleAccept} />
        </View>
      </ScrollView>
    </ModalContainer>
  );
};

export default ContentModal;
