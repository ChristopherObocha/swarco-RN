import React from 'react';
import {useScale} from 'providers/style/scale-provider';
import {useNavigation} from '@react-navigation/native';

import SearchInput, {SearchInputProps} from 'components/utils/search-input';
import {StyleSheet, View} from 'react-native';
import IconButton, {IconButtonProps} from 'components/buttons/icon-button';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Platform} from 'react-native';
import {palette} from 'providers/style/palette';

interface SearchHeaderPropType {
  leftIcons?: IconButtonProps[];
  rightIcons?: IconButtonProps[];
  backgroundColor?: string;
  hideSearchInput?: boolean;
  hideGoBack?: boolean;
  searchWidth?: number;
  value?: string;
  customBackAction?: () => void;
  hideClearIcon?: boolean;
  focusOnMount?: boolean;
}

type SearchHeaderProps = SearchHeaderPropType & SearchInputProps;

const SearchHeader = ({
  leftIcons,
  rightIcons,
  onSearch,
  clearSearch,
  autoFocus,
  onFocus,
  placeholder = 'Search',
  returnKeyDisabled,
  backgroundColor,
  hideSearchInput,
  hideGoBack,
  searchWidth,
  containerStyle,
  testID = 'search-header',
  value,
  disabledInput,
  autoCapitalize,
  inputContainerStyle,
  inputStyle,
  customBackAction,
  hideClearIcon,
  focusOnMount,
}: SearchHeaderProps) => {
  const {getHeight, getWidth} = useScale();

  const navigation = useNavigation();

  const marginTop = Platform.select({
    android: getHeight(5),
    ios: 0,
  });
  // ** ** ** ** ** STYLES ** ** ** ** **
  const styles = StyleSheet.create({
    headerContainer: {
      marginTop: marginTop,
      width: getWidth(375),
      justifyContent: 'center',
      paddingHorizontal: getWidth(20),
      paddingTop: getHeight(11),
      paddingBottom: getHeight(15),
      backgroundColor: backgroundColor ?? palette.transparent,
      zIndex: 1,
    },
    rowContainer: {
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: hideSearchInput ? 'space-between' : 'flex-start',
    },
    leftRowContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
    },
    rightRowContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
      flex: 1,
    },
    searchInput: {
      width: searchWidth || getWidth(280),
      marginHorizontal: getWidth(15),
    },
  });

  const handleGoBack = () => {
    if (customBackAction) {
      customBackAction();
      return;
    }

    navigation.goBack();
  };

  // ** ** ** ** ** RENDER ** ** ** ** **
  return (
    <SafeAreaView
      style={styles.headerContainer}
      edges={['top']}
      testID={testID}>
      <View style={styles.rowContainer} testID={`${testID}.row-container`}>
        <View
          style={styles.leftRowContainer}
          testID={`${testID}.left-row-container`}>
          {navigation.canGoBack() && !hideGoBack && (
            <View>
              <IconButton
                name="chevron-left"
                onPress={handleGoBack}
                testID={`${testID}.go-back-button`}
                isPro
              />
            </View>
          )}

          {leftIcons?.map((icon, index) => (
            <View
              key={index}
              style={{marginRight: getWidth(10)}}
              testID={`${testID}.left-icon-container`}>
              <IconButton {...icon} testID={`${testID}.left-icon-button`} />
            </View>
          ))}
        </View>

        {!hideSearchInput && (
          <SearchInput
            onSearch={onSearch}
            clearSearch={clearSearch}
            autoFocus={autoFocus}
            onFocus={onFocus}
            disabledInput={disabledInput}
            placeholder={placeholder}
            returnKeyDisabled={returnKeyDisabled}
            containerStyle={[styles.searchInput, containerStyle]}
            inputContainerStyle={inputContainerStyle}
            inputStyle={inputStyle}
            testID={`${testID}.search-input`}
            value={value}
            autoCapitalize={autoCapitalize}
            hideClearIcon={hideClearIcon}
            focusOnMount={focusOnMount}
          />
        )}

        <View
          style={styles.rightRowContainer}
          testID={`${testID}.right-row-container`}>
          {rightIcons?.map((icon, index) => (
            <View
              key={index}
              style={{marginLeft: getWidth(10)}}
              testID={`${testID}.right-icon-container`}>
              <IconButton {...icon} testID={`${testID}.right-icon-button`} />
            </View>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SearchHeader;
