import React, {useEffect} from 'react';

import AccountCard, {AccountItemType} from 'components/cards/account-card';
import AccountHeader from 'components/headers/account-header';
import {Spacer} from 'components/utils/spacer';
import {useScale} from 'providers/style/scale-provider';
import {View} from 'react-native';
import {FlashList} from '@shopify/flash-list';
import {Text} from '@rneui/themed';
import {useStyle} from 'providers/style/style-provider';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useVehicle} from 'providers/apis/vehicle/ index';

const AccountScreen = () => {
  // ** ** ** ** ** STYLES ** ** ** ** **
  const {getHeight, getWidth} = useScale();
  const {textStyles} = useStyle();

  const insets = useSafeAreaInsets();

  const bottomSpacing = insets.bottom || getHeight(10);
  const minTabHeight = bottomSpacing + getHeight(100);

  const {getVehicles, usersVehicles} = useVehicle();

  useEffect(() => {
    getVehicles();
  }, [getVehicles]);

  const sections = [
    'Account details',
    [
      {
        type: AccountItemType.VEHICLE_DETAILS,
        required: usersVehicles && usersVehicles.length <= 0,
      },
      //Uncomment in R4
      // {type: AccountItemType.NOTIFICATIONS},
      // {
      //   type: AccountItemType.RFID_CARD,
      //   disabled: isBusinessUser || !isLoggedIn,
      //   completed: isBusinessUser || !!profile?.paymentprovider,
      //   required: true,
      // },
      // {type: AccountItemType.INVOICES},
    ],
    'Additional Services',
    [
      {type: AccountItemType.SUPPORT_CENTER},
      {type: AccountItemType.FAQS},
      {type: AccountItemType.CHARGING_GUIDES},
      {type: AccountItemType.MAP_INFO},
    ],
  ];

  // ** ** ** ** ** RENDER ** ** ** ** **

  const renderSectionHeader = ({section: {title}, index}: any) => (
    <Text
      style={{
        ...textStyles.semiBold20,
        marginBottom: getHeight(20),
        marginTop: index === 0 ? getHeight(30) : getHeight(15),
      }}>
      {title}
    </Text>
  );

  const renderItem = ({item: {type, disabled, completed, required}}: any) => (
    <AccountCard
      type={type}
      disabled={disabled}
      completed={completed}
      required={required}
    />
  );

  const renderDivider = () => <Spacer size={15} />;

  const renderItemGrid = ({item}: any) => {
    return (
      <FlashList
        data={item}
        numColumns={2}
        estimatedItemSize={4}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item: any, index) => `${item?.type}.${index}`}
        scrollEnabled={false}
        renderItem={renderItem}
        ItemSeparatorComponent={renderDivider}
      />
    );
  };

  // ** ** ** ** ** RENDER ** ** ** ** **
  return (
    <View style={{flex: 1}}>
      <AccountHeader />
      <FlashList
        data={sections}
        contentContainerStyle={{
          paddingHorizontal: getWidth(20),
        }}
        numColumns={1}
        estimatedItemSize={4}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item: any, index) => `${item?.type}.${index}`}
        renderItem={({item, index}) => {
          if (typeof item === 'string') {
            return renderSectionHeader({section: {title: item}, index});
          } else {
            return renderItemGrid({item});
          }
        }}
        getItemType={item => {
          return typeof item === 'string' ? 'sectionHeader' : 'row';
        }}
        ListFooterComponent={<Spacer size={minTabHeight} />}
      />
    </View>
  );
};

export default AccountScreen;
