import React, {useCallback, useState} from 'react';
import {useStyle} from 'providers/style/style-provider';
import {useScale} from 'providers/style/scale-provider';

import {
  View,
  StyleSheet,
  TouchableOpacity,
  GestureResponderEvent,
} from 'react-native';
import {Text} from '@rneui/themed';
import {useDictionary} from 'providers/dictionary/dictionary-provider';
import FA5 from 'react-native-vector-icons/FontAwesome5';
import FA5Pro from 'react-native-vector-icons/FontAwesome5Pro';
import {useNavigation} from '@react-navigation/native';
import {ACCOUNT_SCREENS} from '../../types/navigation';
import {palette} from 'providers/style/palette';
import InaccessibleFeatureModal from 'components/modals/inaccessible-feature-modal';
import {STORAGE} from 'utils/constants';
import {getObject} from 'utils/storage-utils';

export enum AccountItemType {
  VEHICLE_DETAILS = 'vehicleDetails',
  NOTIFICATIONS = 'notifications',
  RFID_CARD = 'rfidCard',
  INVOICES = 'invoices',
  SUPPORT_CENTER = 'supportCenter',
  FAQS = 'faqs',
  CHARGING_GUIDES = 'chargingGuides',
  MAP_INFO = 'mapInfo',
  SETUP_PAYMENTS = 'setupPayments',
  ADD_E_VEHICLE = 'addVehicle',
}

interface AccountCardProps {
  type: AccountItemType;
  testID?: string;
  completed?: boolean;
  required?: boolean;
  disabled?: boolean;
  onPress?: (event: GestureResponderEvent) => void;
  titleNumberOfLines?: number;
}

type CardItemProps = {
  type: AccountItemType;
  renderIcon: Function;
  title: string;
  style?: any;
  onPress: (event: GestureResponderEvent) => void;
};

const AccountCard = ({
  type = AccountItemType.VEHICLE_DETAILS,
  completed = false,
  required = false,
  disabled = false,
  onPress,
  titleNumberOfLines = 1,
  testID = 'accountCard',
}: AccountCardProps) => {
  // ** ** ** ** ** STYLES ** ** ** ** **
  const {coloursTheme, textStyles} = useStyle();
  const {getHeight, getRadius, getWidth, getFontSize} = useScale();

  const {
    dictionary: {Account},
  } = useDictionary();

  const navigation = useNavigation<any>();
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const guestToken = getObject(STORAGE.GUEST_TOKEN);

  const styles = StyleSheet.create({
    card: {
      flex: 1,
      backgroundColor: coloursTheme.card.backgroundColor,
      borderRadius: getRadius(10),
      marginTop: getHeight(1),
      marginEnd: getWidth(10),
    },
    innerContainer: {
      borderRadius: getRadius(10),
      paddingVertical: getHeight(15),
      justifyContent: 'center',
      paddingHorizontal: getWidth(13),
      borderWidth: getWidth(1),
      borderColor: palette.transparent,

      ...(completed && {
        borderColor: coloursTheme.pill.status.available.color,
      }),

      opacity: disabled ? 0.5 : 1,
    },
    title: {
      ...textStyles.semiBold18,
      marginTop: getHeight(10),
      letterSpacing: 0,
    },
    iconsRowContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    iconContainer: {
      backgroundColor: coloursTheme.primaryColor,
      width: getWidth(40),
      aspectRatio: 1,
      borderRadius: getWidth(40) / 2,
      alignItems: 'center',
      justifyContent: 'center',
    },
    secondaryIconContainer: {
      margin: 0,
      width: getWidth(25),
      aspectRatio: 1,
      borderRadius: getRadius(25 / 2),
      alignItems: 'center',
      justifyContent: 'center',
      ...(required && {backgroundColor: coloursTheme.primaryColor}),
      ...(completed && {
        backgroundColor: coloursTheme.pill.status.available.color,
      }),
    },
  });

  const renderIcon = (name: string, isPro: boolean = false) => {
    const Icon = isPro ? FA5Pro : FA5;
    return (
      <View style={styles.iconContainer} testID={`${testID}.fontAwesomeIcon`}>
        <Icon
          name={name}
          size={getFontSize(19)}
          solid={false}
          color={coloursTheme.button.icon.selected.color}
        />
      </View>
    );
  };

  const handleNavigation = useCallback(
    (type: string) => {
      if (guestToken) {
        return setModalVisible(true);
      }

      switch (type) {
        case AccountItemType.VEHICLE_DETAILS:
          navigation.navigate(ACCOUNT_SCREENS.VEHICLE_DETAILS);
          break;
        case AccountItemType.NOTIFICATIONS:
          navigation.navigate(ACCOUNT_SCREENS.PERSONAL_DETAILS);
          break;
        case AccountItemType.RFID_CARD:
          navigation.navigate(ACCOUNT_SCREENS.PERSONAL_DETAILS);
          break;
        case AccountItemType.INVOICES:
          navigation.navigate(ACCOUNT_SCREENS.PERSONAL_DETAILS);
          break;
        default:
          navigation.navigate(ACCOUNT_SCREENS.PERSONAL_DETAILS);
      }
    },
    [guestToken, navigation],
  );

  const map: CardItemProps[] = [
    {
      type: AccountItemType.VEHICLE_DETAILS,
      renderIcon: () => renderIcon('car', true),
      title: Account.vehicleDetails,
      onPress: () => handleNavigation(AccountItemType.VEHICLE_DETAILS),
    },
    {
      type: AccountItemType.NOTIFICATIONS,
      renderIcon: () => renderIcon('bell'),
      title: Account.notifications,
      onPress: () => handleNavigation(AccountItemType.NOTIFICATIONS),
    },
    {
      type: AccountItemType.RFID_CARD,
      renderIcon: () => renderIcon('id-card'),
      title: Account.rfidCard,
      onPress: () => handleNavigation(AccountItemType.RFID_CARD),
    },
    {
      type: AccountItemType.INVOICES,
      renderIcon: () => renderIcon('file-invoice', true),
      title: Account.invoices,
      onPress: () => handleNavigation(AccountItemType.INVOICES),
    },
    {
      type: AccountItemType.SUPPORT_CENTER,
      renderIcon: () => renderIcon('user-headset', true),
      title: Account.supportCenter,
      onPress: () => navigation.navigate(ACCOUNT_SCREENS.SUPPORT_CENTER),
    },
    {
      type: AccountItemType.FAQS,
      renderIcon: () => renderIcon('question-circle'),
      title: Account.faqs,
      onPress: () => navigation.navigate(ACCOUNT_SCREENS.FAQS),
    },
    {
      type: AccountItemType.CHARGING_GUIDES,
      renderIcon: () => renderIcon('info-circle', true),
      title: Account.chargingGuides,
      onPress: () => navigation.navigate(ACCOUNT_SCREENS.CHARGING_GUIDE),
    },
    {
      type: AccountItemType.MAP_INFO,
      renderIcon: () => renderIcon('map-marked', true),
      title: Account.mapInfo,
      onPress: () => navigation.navigate(ACCOUNT_SCREENS.MAP_INFO),
    },
    {
      type: AccountItemType.SETUP_PAYMENTS,
      renderIcon: () => renderIcon('credit-card', true),
      title: Account.setupPaymentDetails,
      style: {...textStyles.semiBold16},
      onPress: () => navigation.navigate(ACCOUNT_SCREENS.PERSONAL_DETAILS),
    },
    {
      type: AccountItemType.ADD_E_VEHICLE,
      renderIcon: () => renderIcon('car', true),
      title: Account.addVehicle,
      style: {...textStyles.semiBold16},
      onPress: () => navigation.navigate(ACCOUNT_SCREENS.PERSONAL_DETAILS),
    },
  ];

  const item: CardItemProps = map.find(it => it.type === type) || map[0];

  // ** ** ** ** ** RENDER ** ** ** ** **
  return (
    <>
      <TouchableOpacity
        disabled={disabled}
        style={styles.card}
        onPress={onPress ?? item.onPress}
        testID={`${testID}.${type}`}>
        <View style={styles.innerContainer}>
          <View style={styles.iconsRowContainer}>
            {item.renderIcon()}

            {(completed || required) && (
              <View
                style={styles.secondaryIconContainer}
                testID={`${testID}.fontAwesomeIcon`}>
                <FA5Pro
                  name={completed ? 'check' : 'exclamation'}
                  solid
                  size={getFontSize(14)}
                  color={coloursTheme.backgroundColor}
                />
              </View>
            )}
          </View>
          <Text
            style={{...styles.title, ...(item?.style && {...item.style})}}
            numberOfLines={titleNumberOfLines}>
            {item.title}
          </Text>
        </View>
      </TouchableOpacity>
      <InaccessibleFeatureModal
        modalVisible={modalVisible}
        closeModal={() => setModalVisible(false)}
      />
    </>
  );
};

export default AccountCard;
