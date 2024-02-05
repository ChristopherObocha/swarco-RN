import React, {useCallback} from 'react';
import {useDictionary} from 'providers/dictionary/dictionary-provider';
import {useScale} from 'providers/style/scale-provider';
import {useStyle} from 'providers/style/style-provider';
import {useState} from 'react';

import {RangeSlider} from '@react-native-assets/slider';
import {Spacer} from 'components/utils/spacer';
import {StyleSheet, View, Text} from 'react-native';
import {sliderMapping} from 'utils/constants';

const mappingValues = Object.values(sliderMapping);

const RangeSliderComponent = ({item}: any) => {
  const {
    dictionary: {FilterModal},
  } = useDictionary();

  const setValueFunction = item?.setValueFunc;
  const filter = item?.filters;
  const minIndex = filter?.min
    ? mappingValues.findIndex(value => value === filter?.min)
    : 0;
  const maxIndex = filter?.max
    ? mappingValues.findIndex(value => value === filter?.max)
    : mappingValues.length - 1;

  const defaultValues: [number, number] = [minIndex, maxIndex];

  const [range, setRange] = useState<[number, number]>(defaultValues);

  // ** ** ** ** ** STYLES ** ** ** ** **
  const {
    textStyles,
    coloursTheme,
    coloursTheme: {primaryColor},
  } = useStyle();
  const {getHeight, getRadius, getWidth} = useScale();
  const styles = StyleSheet.create({
    rangeSlider: {
      borderRadius: getRadius(10),
      backgroundColor: coloursTheme.card.backgroundColor,
      padding: getWidth(15),
      minHeight: getHeight(110),
      marginBottom: getHeight(15),
    },
    markContainer: {
      height: getHeight(8),
      aspectRatio: 1,
      backgroundColor: coloursTheme.checkbox.inactive,
      borderRadius: getRadius(4),
    },
    markContainerSelected: {
      height: getHeight(15),
      aspectRatio: 1,
      backgroundColor: coloursTheme.card.backgroundColor,
      borderRadius: getRadius(7.5),
      borderWidth: getWidth(3),
      borderColor: primaryColor,
    },
    marks: {
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      alignSelf: 'center',
      minWidth: getWidth(25),
      color: coloursTheme.text.primary,
      position: 'absolute',
      top: getHeight(10),
      ...textStyles.regular14,
    },
    slider: {
      paddingVertical: getHeight(10),
      width: getWidth(286), //adjusted to fit card
      alignSelf: 'center',
    },
  });

  // ** ** ** ** ** ACTIONS ** ** ** ** **
  function formatText(val: number) {
    return sliderMapping[val];
  }

  const checkPosition = useCallback(
    (val: number) => {
      const firstIndex = range[0];
      const secondIndex = range[1];

      const inactiveMark = {
        height: getHeight(8),
        aspectRatio: 1,
        backgroundColor: coloursTheme.checkbox.inactive,
        borderRadius: getRadius(4),
      };

      const activeMark = {
        height: getHeight(8),
        aspectRatio: 1,
        backgroundColor: primaryColor,
        borderRadius: getRadius(4),
      };

      if (val <= secondIndex && val >= firstIndex) {
        return activeMark;
      } else {
        return inactiveMark;
      }
    },
    [coloursTheme.checkbox.inactive, getHeight, getRadius, primaryColor, range],
  );

  const changePosition = (value: [number, number]) => {
    const newValues = value.map(val => formatText(val));

    setRange(value);
    setValueFunction(newValues);
  };

  // ** ** ** ** ** RENDER ** ** ** ** **
  const CustomThumb = useCallback(() => {
    return (
      <>
        <View style={styles.markContainerSelected}>
          <Spacer size={getHeight(20)} vertical />
        </View>
      </>
    );
  }, [getHeight, styles.markContainerSelected]);

  const CustomMark = useCallback(
    ({value}: any) => {
      return (
        <>
          <View style={checkPosition(value)}>
            <Spacer size={getHeight(20)} vertical />
          </View>
          <Text style={styles.marks} numberOfLines={1}>
            {formatText(value)}
          </Text>
        </>
      );
    },
    [checkPosition, getHeight, styles.marks],
  );

  return (
    <View style={styles.rangeSlider}>
      <Text style={textStyles.semiBold20}>{FilterModal.ChargerSpeed}</Text>
      <RangeSlider
        style={styles.slider}
        minimumValue={0}
        maximumValue={mappingValues.length - 1}
        slideOnTap={true}
        range={range}
        step={1}
        minimumRange={0}
        crossingAllowed={true}
        CustomMark={CustomMark}
        CustomThumb={CustomThumb}
        onValueChange={position => changePosition(position)}
        outboundColor={coloursTheme.checkbox.inactive}
        inboundColor={primaryColor}
      />
    </View>
  );
};

export default RangeSliderComponent;
