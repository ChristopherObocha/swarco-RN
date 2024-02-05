import {useScale} from 'providers/style/scale-provider';
import {useStyle} from 'providers/style/style-provider';
import React from 'react';

import {Text, StyleSheet} from 'react-native';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';

const CELL_COUNT = 6;

const PasscodeInput = ({controllerProps, commonProps}: any) => {
  const {
    field: {value},
  } = controllerProps;
  const {onChangeText, testID = 'PasscodeInput'} = commonProps;

  const ref = useBlurOnFulfill({value, cellCount: CELL_COUNT});
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue: onChangeText,
  });

  // ** ** ** ** ** STYLES ** ** ** ** **
  const {coloursTheme, textStyles} = useStyle();
  const {getRadius, getWidth, getHeight, getFontSize} = useScale();
  const styles = StyleSheet.create({
    codeFieldRoot: {
      flex: 1,
    },
    cell: {
      ...textStyles.semiBold25,
      width: getWidth(45),
      height: getHeight(54),
      borderRadius: getRadius(10),
      backgroundColor: coloursTheme.passcodeCell.backgroundColor,
      overflow: 'hidden',
      textAlign: 'center',
      lineHeight: getHeight(54),
      verticalAlign: 'middle',
    },
    focusCell: {
      fontSize: getFontSize(45),
      fontWeight: '200',
      borderColor: coloursTheme.passcodeCell.active.border,
      color: coloursTheme.passcodeCell.active.border,
      borderWidth: getWidth(1.5),
      lineHeight: getHeight(48),
      textAlign: 'left',
      paddingLeft: getWidth(5),
    },
  });

  // ** ** ** ** ** RENDER ** ** ** ** **
  return (
    <CodeField
      ref={ref}
      {...props}
      {...commonProps}
      value={value}
      cellCount={CELL_COUNT}
      rootStyle={styles.codeFieldRoot}
      keyboardType="number-pad"
      textContentType="oneTimeCode"
      renderCell={({index, symbol, isFocused}) => (
        <Text
          key={index}
          style={[
            styles.cell,
            isFocused && styles.focusCell,
            index === 2 && {marginRight: getWidth(10)},
          ]}
          onLayout={getCellOnLayoutHandler(index)}>
          {symbol || (isFocused ? <Cursor /> : null)}
        </Text>
      )}
      testID={testID}
    />
  );
};

export default PasscodeInput;
