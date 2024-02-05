import React, {Fragment} from 'react';
import {useStyle} from 'providers/style/style-provider';
import {useScale} from 'providers/style/scale-provider';

import {StyleSheet, TouchableOpacity} from 'react-native';
import {View, Text} from 'react-native';
import FontAwesome5Pro from 'react-native-vector-icons/FontAwesome5Pro';
import {Spacer} from 'components/utils/spacer';
import {uid} from 'utils/general-utils';

const FilterMultiSelect = ({
  item,
  commonProps,
  testID = 'FilterMultiSelect',
}: any) => {
  const options = item?.options;
  const setValueFunc = item?.setValueFunc;

  // ** ** ** ** ** STYLES ** ** ** ** **
  const {coloursTheme, textStyles} = useStyle();
  const {getRadius, getWidth, getHeight, getFontSize} = useScale();
  const styles = StyleSheet.create({
    item: {
      flexDirection: 'row',
      justifyContent: 'space-between',
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
    },
    text: {
      ...textStyles.regular16,
    },
    tickMarkContainer: {
      width: getWidth(25),
      aspectRatio: 1,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: getRadius(12.5),
    },
  });

  // ** ** ** ** ** RENDER ** ** ** ** **
  return (
    <View testID={testID}>
      {options?.map(({name, value, icon}: any, index: number) => {
        const isSelected = commonProps.value === value;
        const selectedTickStyle = {
          ...styles.tickMarkContainer,
          backgroundColor: coloursTheme.primaryColor,
        };
        const inActiveTickStyle = {
          ...styles.tickMarkContainer,
          borderWidth: getWidth(2),
          borderColor: coloursTheme.checkbox.inactive,
        };

        return (
          <Fragment key={`${uid()}.${index}`}>
            <TouchableOpacity
              style={styles.item}
              testID={`${testID}.${index}`}
              onPress={() => {
                if (isSelected === true) {
                  setValueFunc(item.name, '');
                  return;
                }

                setValueFunc(item.name, value);
              }}>
              <View style={styles.iconTextContainer}>
                <View style={styles.iconContainer}>
                  <FontAwesome5Pro
                    name={icon}
                    color={coloursTheme.primaryColor}
                    size={getFontSize(16)}
                  />
                </View>
                <Text style={styles.text}>{name}</Text>
              </View>
              <View
                style={
                  isSelected === true ? selectedTickStyle : inActiveTickStyle
                }>
                {isSelected === true && (
                  <FontAwesome5Pro
                    name="check"
                    color={coloursTheme.button.icon.backgroundColor}
                    size={getFontSize(15)}
                    solid
                  />
                )}
              </View>
            </TouchableOpacity>
            <Spacer vertical size={getHeight(15)} />
          </Fragment>
        );
      })}
    </View>
  );
};

export default FilterMultiSelect;
