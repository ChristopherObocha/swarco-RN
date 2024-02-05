import React, {useEffect, useMemo, useRef, useState} from 'react';

import {useScale} from 'providers/style/scale-provider';
import {useStyle} from 'providers/style/style-provider';

import {Pressable, StyleSheet, Text, View} from 'react-native';
import {SearchBar, SearchBarProps} from '@rneui/themed';
import FontAwesome5Pro from 'react-native-vector-icons/FontAwesome5Pro';
import {palette} from 'providers/style/palette';

interface SearchInputPropType {
  onSearch: (text: string) => void;
  clearSearch?: () => void;
  onFocus?: () => void;
  placeholder?: string;
  returnKeyDisabled?: boolean;
  disabledInput?: boolean;
  hideClearIcon?: boolean;
  focusOnMount?: boolean;
  hideShadow?: boolean;
}

export type SearchInputProps = SearchInputPropType & SearchBarProps;

const SearchInput = ({
  onSearch,
  clearSearch,
  placeholder,
  returnKeyDisabled,
  containerStyle,
  label,
  testID = 'SearchInput',
  onFocus,
  value,
  disabledInput = false,
  autoCapitalize,
  inputContainerStyle,
  inputStyle,
  hideClearIcon,
  focusOnMount,
  hideShadow,
}: SearchInputProps) => {
  const {getHeight, getWidth, getRadius} = useScale();
  const {coloursTheme, textStyles, shadow} = useStyle();

  const searchBarRef = useRef<any>(null);

  const [textChanged, setTextChanged] = useState<string>(value || '');

  useEffect(() => {
    setTextChanged(value || '');
  }, [value]);

  useEffect(() => {
    if (focusOnMount) {
      setTimeout(() => {
        searchBarRef?.current?.focus();
      });
    }
  }, [focusOnMount]);

  // ** ** ** ** ** STYLES ** ** ** ** **
  const styles = StyleSheet.create({
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: getRadius(20),
      height: getHeight(40),
      backgroundColor: coloursTheme.input.background,
      borderWidth: getWidth(1),
      borderColor: coloursTheme.input.border,
      borderTopColor: coloursTheme.input.border,
      borderBottomColor: coloursTheme.input.border,
      marginHorizontal: getWidth(20),
      paddingHorizontal: getWidth(0),
    },
    searchInput: {
      backgroundColor: palette.transparent,
    },
    searchInputText: {
      ...textStyles.regular16,
      color: value ? coloursTheme.input.text : coloursTheme.input.placeholder,
    },
    leftIconContainerStyle: {
      marginRight: getWidth(-5),
      marginLeft: getWidth(15),
    },
  });

  const disabledStyles = StyleSheet.create({
    searchComponentContainer: {
      width: getWidth(225),
      ...styles.inputContainer,
      marginHorizontal: 0,
      paddingStart: getWidth(15),
      paddingEnd: getWidth(12),
    },
    input: {
      ...styles.searchInputText,
      paddingStart: getWidth(8),
      paddingEnd: value ? getWidth(2) : 0,
    },
  });

  const disabledSearchComponent = useMemo(() => {
    return (
      <View
        style={[
          disabledStyles.searchComponentContainer,
          !hideShadow && shadow,
          inputContainerStyle,
        ]}>
        <FontAwesome5Pro
          name="search"
          size={getHeight(20)}
          color={coloursTheme.input.icon}
          testID={`${testID}.search-icon`}
        />
        <Pressable style={[styles.searchInput, inputStyle]} onPress={onFocus}>
          <Text
            style={disabledStyles.input}
            ellipsizeMode="tail"
            numberOfLines={1}>
            {value || placeholder}
          </Text>
        </Pressable>
        {value && !hideClearIcon && (
          <FontAwesome5Pro
            name="times"
            size={getHeight(20)}
            color={coloursTheme.input.icon}
            onPress={() => {
              setTextChanged('');
              clearSearch && clearSearch();
            }}
            testID={`${testID}.clear-icon`}
          />
        )}
      </View>
    );
  }, [
    clearSearch,
    coloursTheme.input.icon,
    disabledStyles.input,
    disabledStyles.searchComponentContainer,
    getHeight,
    hideClearIcon,
    hideShadow,
    inputContainerStyle,
    inputStyle,
    onFocus,
    placeholder,
    shadow,
    styles.searchInput,
    testID,
    value,
  ]);

  // ** ** ** ** ** RENDER ** ** ** ** **
  return (
    <>
      {disabledInput ? (
        disabledSearchComponent
      ) : (
        <SearchBar
          ref={searchBarRef}
          placeholder={placeholder}
          onChangeText={text => {
            setTextChanged(text);
            onSearch(text);
          }}
          enablesReturnKeyAutomatically={returnKeyDisabled}
          placeholderTextColor={coloursTheme.input.placeholder}
          containerStyle={[styles.inputContainer, containerStyle]}
          inputContainerStyle={[styles.searchInput, inputContainerStyle]}
          inputStyle={[styles.searchInputText, inputStyle]}
          selectionColor={coloursTheme.input.icon}
          leftIconContainerStyle={styles.leftIconContainerStyle}
          value={textChanged}
          searchIcon={
            <FontAwesome5Pro
              name="search"
              size={getHeight(20)}
              color={coloursTheme.input.icon}
              testID={`${testID}.search-icon`}
            />
          }
          clearIcon={
            !hideClearIcon && (
              <FontAwesome5Pro
                name="times"
                size={getHeight(20)}
                color={coloursTheme.input.icon}
                onPress={() => {
                  setTextChanged('');
                  clearSearch && clearSearch();
                }}
                testID={`${testID}.clear-icon`}
              />
            )
          }
          testID={testID}
          onFocus={onFocus}
          autoCapitalize={autoCapitalize || 'none'}
        />
      )}
    </>
  );
};

export default SearchInput;
