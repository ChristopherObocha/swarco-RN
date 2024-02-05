import React from 'react';
import {useScale} from 'providers/style/scale-provider';
import {useStyle} from 'providers/style/style-provider';
import {useState, useRef, useEffect, useCallback} from 'react';

import {StyleSheet, TouchableOpacity, View, Text, Animated} from 'react-native';
import {FlashList} from '@shopify/flash-list';
import {Spacer} from 'components/utils/spacer';
import FontAwesome5Pro from 'react-native-vector-icons/FontAwesome5Pro';
import {SITE_FILTERS} from 'utils/constants';

const FilterCardComponent = ({item}: any) => {
  const {getHeight, getWidth, getFontSize, getRadius} = useScale();
  const {textStyles, coloursTheme} = useStyle();

  const [showInfo, setShowInfo] = useState<boolean>(item?.showInfo);
  const infoOpacity = useRef(new Animated.Value(0)).current;
  const spinAnim = useRef(new Animated.Value(0)).current; // Initial value for spin

  const [filters, setFilters] = useState(item?.data);
  const setValueFunction = item?.setValueFunc;
  const filterName = item?.name;
  const isSelectOne = item?.isSelectOne;

  // ** ** ** ** ** EFFECTS ** ** ** ** **  ** //
  useEffect(() => {
    setShowInfo(item?.showInfo);
  }, [item?.showInfo]);

  useEffect(() => {
    Animated.timing(infoOpacity, {
      toValue: showInfo ? 1 : 0,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [infoOpacity, showInfo]);

  // ** ** ** ** ** ACTIONS ** ** ** ** **  //
  const handleMoreInfoPress = () => {
    Animated.timing(spinAnim, {
      toValue: showInfo ? 0 : 1,
      duration: 200,
      useNativeDriver: true,
    }).start();

    setShowInfo(state => !state);
  };

  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '-180deg'],
  });

  const onPressAnswer = useCallback(
    (item: string) => {
      const itemIndex = filters.findIndex(
        (element: any) => element?.name === item,
      );

      if (isSelectOne) {
        // Update the isSelected property of the selected item
        const updatedData = [...filters];
        updatedData.forEach((element: any) => {
          element.isSelected = false;
        });
        updatedData[itemIndex] = {
          ...updatedData[itemIndex],
          isSelected: !updatedData[itemIndex].isSelected,
        };

        // Set the updated data to trigger a re-render
        setFilters(updatedData);

        // Update the selected item state
        setValueFunction(updatedData);
        return;
      }
      // Update the isSelected property of the selected item
      const updatedData = [...filters];
      updatedData[itemIndex] = {
        ...updatedData[itemIndex],
        isSelected: !updatedData[itemIndex].isSelected,
      };

      // Set the updated data to trigger a re-render
      setFilters(updatedData);

      // Update the selected item state
      setValueFunction(updatedData);
    },
    [filters, isSelectOne, setValueFunction],
  );

  // ** ** ** ** ** STYLES ** ** ** ** **
  const styles = StyleSheet.create({
    container: {
      backgroundColor: coloursTheme.card.backgroundColor,
      paddingHorizontal: getWidth(15),
      borderRadius: getRadius(10),
      minHeight: getHeight(5),
      minWidth: getWidth(5),
      marginBottom: getHeight(15),
    },
    iconContainer: {
      verticalAlign: 'middle',
      width: getWidth(30),
      aspectRatio: 1,
      marginRight: getWidth(10),
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: getRadius(15),
      backgroundColor: coloursTheme.tertiaryColor,
    },
    iconTextContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      width: getWidth(261),
    },
    text: {
      ...textStyles.regular16,
      letterSpacing: -0.1,
    },
    tickMarkContainer: {
      width: getWidth(25),
      aspectRatio: 1,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: getRadius(12.5),
    },
    infoRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: getWidth(15),
    },
    justifyBetween: {
      justifyContent: 'space-between',
    },
    moreInfoText: {
      ...textStyles.semiBold20,
      width: getWidth(261),
    },
    listContainer: {
      minHeight: getHeight(5),
    },
    textWrapper: {
      width: getWidth(225),
    },
  });

  const chevronContainer = {
    ...styles.tickMarkContainer,
    transform: [{rotate: spin}],
  };

  // ** ** ** ** ** RENDER ** ** ** ** ** //
  const filterCard = useCallback(
    ({item}: any) => {
      const selectedTickStyle = {
        ...styles.tickMarkContainer,
        backgroundColor: coloursTheme.primaryColor,
      };
      const inActiveTickStyle = {
        ...styles.tickMarkContainer,
        borderWidth: 2,
        borderColor: coloursTheme.checkbox.inactive,
      };

      let Icon;
      if (filterName === SITE_FILTERS.CONNECTOR_TYPE) {
        //uses custom SVGs
        Icon = item.icon;
      }

      return (
        <>
          <TouchableOpacity
            style={styles.infoRow}
            onPress={() => onPressAnswer(item?.name)}>
            <View style={styles.iconTextContainer}>
              <View style={styles.iconContainer}>
                {filterName !== SITE_FILTERS.CONNECTOR_TYPE ? (
                  <FontAwesome5Pro
                    name={item?.icon}
                    color={coloursTheme.primaryColor}
                    size={getFontSize(16)}
                  />
                ) : (
                  <Icon width={getWidth(30)} height={getWidth(30)} />
                )}
              </View>
              <View style={styles.textWrapper}>
                <Text style={styles.text}>{item?.name}</Text>
              </View>
            </View>

            <View
              style={
                item?.isSelected === true
                  ? selectedTickStyle
                  : inActiveTickStyle
              }>
              {item?.isSelected === true && (
                <FontAwesome5Pro
                  name="check"
                  color={coloursTheme.button.icon.backgroundColor}
                  size={getFontSize(15)}
                  solid
                />
              )}
            </View>
          </TouchableOpacity>
          <Spacer vertical size={15} />
        </>
      );
    },
    [
      coloursTheme.button.icon.backgroundColor,
      coloursTheme.checkbox.inactive,
      coloursTheme.primaryColor,
      filterName,
      getFontSize,
      getWidth,
      onPressAnswer,
      styles.iconContainer,
      styles.iconTextContainer,
      styles.infoRow,
      styles.text,
      styles.tickMarkContainer,
    ],
  );

  return (
    <View style={styles.container} testID={'test'}>
      <TouchableOpacity style={styles.row} onPress={handleMoreInfoPress}>
        <Text style={styles.moreInfoText}>{item?.name}</Text>

        <Animated.View style={chevronContainer}>
          <FontAwesome5Pro
            name="chevron-down"
            size={getFontSize(20)}
            color={coloursTheme.text.primary}
          />
        </Animated.View>
      </TouchableOpacity>
      {showInfo && (
        <View style={styles.listContainer}>
          <FlashList
            scrollEnabled={false}
            data={filters}
            renderItem={filterCard}
            showsVerticalScrollIndicator={false}
            estimatedItemSize={50}
          />
        </View>
      )}
    </View>
  );
};

export default FilterCardComponent;
