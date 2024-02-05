import React, {ReactElement} from 'react';

import {useScale} from 'providers/style/scale-provider';

import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {useStyle} from 'providers/style/style-provider';
import {IconButtonProps} from 'components/buttons/icon-button';
import {HeaderProps, Text} from '@rneui/themed';
import {useNavigation} from '@react-navigation/native';
import FA5Pro from 'react-native-vector-icons/FontAwesome5Pro';
import {useDictionary} from 'providers/dictionary/dictionary-provider';
import {useProfile} from 'providers/apis/profile';
import {ACCOUNT_SCREENS} from '../../types/navigation';
import DefaultHeader from 'components/headers/default-header';
import {getObject} from 'utils/storage-utils';
import {STORAGE} from 'utils/constants';

interface DefaultHeaderProps extends HeaderProps {
  title?: string | ReactElement;
  leftIcons?: IconButtonProps[];
  rightIcons?: IconButtonProps[];
  backgroundColor?: string;
  hideGoBack?: boolean;
  customBackAction?: () => void;
}

const AccountHeader = () => {
  const {getWidth, getHeight, getFontSize, getRadius} = useScale();
  const {textStyles, coloursTheme} = useStyle();

  const {
    dictionary: {Account},
  } = useDictionary();

  const navigation = useNavigation<any>();

  const {profile} = useProfile();

  // ** ** ** ** ** STYLES ** ** ** ** **
  const styles = StyleSheet.create({
    headerContainer: {
      width: '100%',
      height: getHeight(209),
      backgroundColor: coloursTheme.card.backgroundColor,
      borderBottomWidth: getHeight(2),
      borderBottomColor: coloursTheme.input.border,
    },
    innerContainer: {
      paddingHorizontal: getWidth(20),
      paddingBottom: getHeight(28),
      flex: 1,
      flexDirection: 'row',
      marginTop: getHeight(-25),
    },
    iconContainer: {
      width: getWidth(90),
      aspectRatio: 1,
      backgroundColor: coloursTheme.tertiaryColor,
      borderRadius: getRadius(10),
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'center',
    },
    textContainer: {
      justifyContent: 'center',
      paddingHorizontal: getWidth(15),
    },
    h1: {
      ...textStyles.semiBold20,
    },
    h2Container: {
      flexDirection: 'row',
      marginTop: getHeight(10),
      alignItems: 'center',
    },
    h2: {
      ...textStyles.regular16,
    },
  });

  // ** ** ** ** ** RENDER ** ** ** ** **
  return (
    <View style={styles.headerContainer}>
      <DefaultHeader
        hideGoBack
        rightIcons={[
          {
            name: 'cog',
            onPress: () => navigation.navigate(ACCOUNT_SCREENS.APP_SETTINGS),
            isPro: true,
          },
        ]}
      />

      <TouchableOpacity
        style={styles.innerContainer}
        onPress={() =>
          navigation.navigate(
            profile && !getObject(STORAGE.GUEST_TOKEN)
              ? ACCOUNT_SCREENS.PERSONAL_DETAILS
              : ACCOUNT_SCREENS.SIGN_IN,
          )
        }
        testID="AccountHeader.Profile">
        <View style={styles.iconContainer} testID="AccountHeader.Profile.Icon">
          <FA5Pro
            name={'user'}
            solid
            size={getFontSize(50)}
            color={coloursTheme.primaryColor}
          />
        </View>

        <View style={styles.textContainer} testID="AccountHeader.Profile.h1">
          <Text style={styles.h1}>
            {profile && !getObject(STORAGE.GUEST_TOKEN)
              ? `${profile?.firstname} ${profile?.lastname}`
              : Account.SignInRegister}
          </Text>

          <View style={styles.h2Container} testID="AccountHeader.Profile.h2">
            <Text style={styles.h2}>
              {profile && !getObject(STORAGE.GUEST_TOKEN)
                ? Account.ViewPersonalDetails
                : Account.ManageAccount}
            </Text>
            <FA5Pro
              name={'chevron-right'}
              size={getFontSize(16)}
              color={coloursTheme.text.primary}
              style={{marginStart: getWidth(10)}}
            />
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};
export default AccountHeader;
