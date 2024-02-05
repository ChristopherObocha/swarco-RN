import React, {useCallback, useEffect, useState} from 'react';

import {useScale} from 'providers/style/scale-provider';
import {useStyle} from 'providers/style/style-provider';
import {useDictionary} from 'providers/dictionary/dictionary-provider';
import {useUser} from 'providers/apis/user';
import {useNavigation} from '@react-navigation/native';

import ScreenContainer from 'components/containers/screen-container';
import SearchHeader from 'components/headers/search-header';
import {Pressable, StyleSheet, View} from 'react-native';
import {Text} from '@rneui/themed';

import SearchIcon from 'assets/svg/search-icon.svg';
import {FlashList} from '@shopify/flash-list';
import {PrimaryButton} from 'components/buttons/primary-button';
import {AddressAutoCompleteResponse} from 'providers/types/user';
import {
  AccountContainerParamList,
  ACCOUNT_SCREENS,
} from '../../types/navigation';
import {StackNavigationProp, StackScreenProps} from '@react-navigation/stack';

import LinearGradient from 'react-native-linear-gradient';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

interface SearchAddressProps
  extends StackScreenProps<
    AccountContainerParamList,
    ACCOUNT_SCREENS.SEARCH_ADDRESS
  > {
  testID?: string;
}

type NavigationProp = StackNavigationProp<
  AccountContainerParamList,
  ACCOUNT_SCREENS.ADD_HOME_ADDRESS
>;

const SearchAddress = ({
  route,
  testID = 'SearchAddress',
}: SearchAddressProps) => {
  const [searchText, setSearchText] = useState('');
  const [addressResults, setAddressResults] = useState<
    AddressAutoCompleteResponse[]
  >([]);

  const navigation = useNavigation<NavigationProp>();
  const {formState, isUpdate, redirect} = route.params;

  const {
    dictionary: {SearchAddress},
  } = useDictionary();

  const {getAddress, getAutocompleteAddress} = useUser();

  const {bottom} = useSafeAreaInsets();

  const handleAddressClick = async (addressID: string) => {
    const {data: address} = await getAddress({id: addressID});

    navigation.push(ACCOUNT_SCREENS.ADD_HOME_ADDRESS, {
      userAddress: address,
      formState,
      isUpdate,
      redirect,
    });
  };

  const searchAutoComplete = useCallback(async () => {
    const {data} = await getAutocompleteAddress({input: searchText});

    if (data?.length) {
      setAddressResults(data);
    }
  }, [getAutocompleteAddress, searchText]);

  useEffect(() => {
    if (searchText?.length > 2) {
      searchAutoComplete();
    }
  }, [searchAutoComplete, searchText]);

  const renderCard = ({item, index}: any) => (
    <Pressable
      style={styles.addressCard}
      onPress={() => handleAddressClick(item.id)}
      testID={`${testID}.addressCard.${index}`}>
      <Text style={styles.addressText}>{item.address}</Text>
    </Pressable>
  );

  // ** ** ** ** ** STYLES ** ** ** ** **
  const {getWidth, getHeight, getRadius} = useScale();
  const {coloursTheme, textStyles} = useStyle();
  const styles = StyleSheet.create({
    container: {
      padding: getWidth(20),
    },
    card: {
      backgroundColor: coloursTheme.card.backgroundColor,
      width: getWidth(335),
      height: getHeight(327),
      borderRadius: getRadius(10),
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    iconContainer: {
      height: getHeight(140),
      justifyContent: 'flex-end',
      marginBottom: getHeight(25),
    },
    textContainer: {
      alignItems: 'center',
      flex: 1,
    },
    semiBoldText: {
      ...textStyles.semiBold20,
      marginBottom: getHeight(15),
    },
    text: {
      ...textStyles.regular18,
      textAlign: 'center',
      height: getHeight(86),
      width: getWidth(305),
      letterSpacing: -0.5,
    },
    addressCard: {
      backgroundColor: coloursTheme.card.backgroundColor,
      width: getWidth(335),
      borderRadius: getRadius(10),
      justifyContent: 'center',
      padding: getWidth(15),
      marginBottom: getHeight(15),
    },
    addressText: {
      ...textStyles.regular18,
    },
    buttonContainer: {
      justifyContent: 'center',
      paddingHorizontal: getWidth(30),
      zIndex: 1,
      position: 'absolute',
      width: getWidth(375),
      bottom: -bottom,
      height: getHeight(154) + bottom,
    },
    fadeContainer: {
      width: getWidth(375),
      position: 'absolute',
      bottom: -bottom,
      height: getHeight(154) + bottom,
    },
  });

  // ** ** ** ** ** RENDER ** ** ** ** **
  const EnterManuallyButton = useCallback(
    () => (
      <>
        <PrimaryButton
          title={SearchAddress.EnterManually}
          onPress={() => navigation.goBack()}
          containerStyle={styles.buttonContainer}
        />
        <LinearGradient
          style={styles.fadeContainer}
          colors={[
            coloursTheme.button.backgroundGradient.transparent,
            coloursTheme.button.backgroundGradient.translucent,
            coloursTheme.button.backgroundGradient.opaque,
          ]}
        />
      </>
    ),
    [
      SearchAddress.EnterManually,
      coloursTheme.button.backgroundGradient,
      navigation,
      styles,
    ],
  );
  return (
    <>
      <SearchHeader
        onSearch={val => setSearchText(val)}
        value={searchText}
        focusOnMount
      />
      <ScreenContainer style={styles.container} enableKeyboardAvoidingView>
        {searchText.length > 2 ? (
          <>
            <FlashList
              data={addressResults}
              renderItem={renderCard}
              estimatedItemSize={55}
              keyboardShouldPersistTaps="handled"
              testID={testID}
              showsVerticalScrollIndicator={false}
            />
            <EnterManuallyButton />
          </>
        ) : (
          <View style={styles.card}>
            <View style={styles.iconContainer}>
              <SearchIcon />
            </View>

            <View style={styles.textContainer}>
              <Text style={styles.semiBoldText}>
                {SearchAddress.StartSearchingTitle}
              </Text>

              <Text style={styles.text}>
                {SearchAddress.StartSearchingDescription}
              </Text>
            </View>
          </View>
        )}
      </ScreenContainer>
    </>
  );
};

export default SearchAddress;
