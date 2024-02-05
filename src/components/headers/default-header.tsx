import React, {ReactElement} from 'react';

import {useScale} from 'providers/style/scale-provider';

import {View, StyleSheet, Platform, StatusBarProps} from 'react-native';
import {useStyle} from 'providers/style/style-provider';
import IconButton, {IconButtonProps} from 'components/buttons/icon-button';
import {Header, HeaderProps} from '@rneui/themed';
import {useNavigation} from '@react-navigation/native';
import {palette} from 'providers/style/palette';

interface DefaultHeaderProps extends HeaderProps {
  title?: string | ReactElement;
  leftIcons?: IconButtonProps[];
  rightIcons?: IconButtonProps[];
  backgroundColor?: string;
  hideGoBack?: boolean;
  customBackAction?: () => void;
  statusBarProps?: StatusBarProps;
}

const DefaultHeader = ({
  title,
  leftIcons,
  rightIcons,
  backgroundColor = palette.transparent,
  hideGoBack,
  customBackAction,
  containerStyle,
  statusBarProps,
}: DefaultHeaderProps) => {
  const {getWidth, getHeight} = useScale();
  const {textStyles} = useStyle();

  const navigation = useNavigation();

  const marginTop = Platform.select({
    android: getHeight(5),
    ios: 0,
  });

  // ** ** ** ** ** STYLES ** ** ** ** **
  const styles = StyleSheet.create({
    headerContainer: {
      backgroundColor,
      paddingBottom: getWidth(20),
      paddingHorizontal: getWidth(15),
      borderBottomWidth: 0,
      marginTop: marginTop,
      paddingTop: getHeight(5),
    },
    titleContainer: {
      justifyContent: 'center',
      flex: 5,
    },
    title: {
      ...textStyles.semiBold25,
    },
    headerLeftContainer: {
      justifyContent: 'center',
    },
    headerLeft: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    headerRightContainer: {
      justifyContent: 'center',
    },
    headerRight: {
      flexDirection: 'row',
      alignItems: 'center',
    },
  });

  const handleGoBack = () => {
    if (customBackAction) {
      customBackAction();
    } else {
      navigation.goBack();
    }
  };

  const centerComponent =
    typeof title === 'string'
      ? {
          text: title,
          style: styles.title,
        }
      : title;

  // ** ** ** ** ** RENDER ** ** ** ** **
  return (
    <Header
      statusBarProps={statusBarProps ?? {backgroundColor: palette.transparent}}
      containerStyle={[styles.headerContainer, containerStyle]}
      leftContainerStyle={styles.headerLeftContainer}
      leftComponent={
        <View style={styles.headerLeft}>
          {(customBackAction || (navigation.canGoBack() && !hideGoBack)) && (
            <View style={{marginRight: getWidth(5)}}>
              <IconButton name="chevron-left" onPress={handleGoBack} isPro />
            </View>
          )}

          {leftIcons?.map((icon, index) => (
            <View key={index} style={{marginRight: getWidth(5)}}>
              <IconButton {...icon} />
            </View>
          ))}
        </View>
      }
      centerContainerStyle={styles.titleContainer}
      centerComponent={centerComponent}
      rightContainerStyle={styles.headerRightContainer}
      rightComponent={
        <View style={styles.headerRight}>
          {rightIcons?.map((icon, index) => (
            <View key={index} style={{marginRight: getWidth(5)}}>
              <IconButton {...icon} />
            </View>
          ))}
        </View>
      }
    />
  );
};
export default DefaultHeader;
