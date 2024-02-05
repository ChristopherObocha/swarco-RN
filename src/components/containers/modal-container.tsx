import React from 'react';

import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useScale} from 'providers/style/scale-provider';

import {View, StyleSheet, ViewStyle, StatusBarProps} from 'react-native';
import Modal from 'react-native-modal';
import DefaultHeader from 'components/headers/default-header';

interface ModalContainerProps {
  children: React.ReactNode;
  modalVisible: boolean;
  backgroundColor?: string;
  closeModal: () => void;
  title?: string;
  backgroundOpacity?: number;
  headerContainerStyle?: ViewStyle;
  containerStyle?: ViewStyle;
  statusBarProps?: StatusBarProps;
}

const ModalContainer = ({
  children,
  modalVisible,
  backgroundColor = 'white',
  closeModal,
  title,
  backgroundOpacity = 0.4,
  headerContainerStyle,
  containerStyle,
  statusBarProps,
}: ModalContainerProps) => {
  const {top} = useSafeAreaInsets();
  const {getRadius, getHeight} = useScale();

  const rightIcons = [
    {
      name: 'times',
      onPress: () => {
        closeModal();
      },
      selected: false,
      isPro: true,
    },
  ];

  // ** ** ** ** ** STYLES ** ** ** ** **
  const styles = StyleSheet.create({
    modal: {
      flex: 1,
      margin: 0,
      marginTop: top,
    },
    container: {
      flex: 1,
      backgroundColor: backgroundColor,
      borderTopLeftRadius: getRadius(15),
      borderTopRightRadius: getRadius(15),
      paddingTop: getHeight(5),
    },
  });

  // ** ** ** ** ** RENDER ** ** ** ** **
  return (
    <Modal
      isVisible={modalVisible}
      style={styles.modal}
      backdropOpacity={backgroundOpacity}
      statusBarTranslucent={true}>
      <View style={[styles.container, containerStyle]}>
        <DefaultHeader
          title={title}
          rightIcons={rightIcons}
          hideGoBack
          containerStyle={headerContainerStyle}
          statusBarProps={statusBarProps}
        />
        {children}
      </View>
    </Modal>
  );
};

export default ModalContainer;
