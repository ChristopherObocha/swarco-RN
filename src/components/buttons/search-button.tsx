import React, {useEffect, useRef, useState} from 'react';

import {useStyle} from 'providers/style/style-provider';

import {
  ActivityIndicator,
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useScale} from 'providers/style/scale-provider';
import {useDictionary} from 'providers/dictionary/dictionary-provider';

interface ButtonProps {
  show: boolean;
  onPress?: () => Promise<void>;
  onLoad?: () => void;
}

export const SearchButton = ({show, onPress, onLoad}: ButtonProps) => {
  const insets = useSafeAreaInsets();
  const {getWidth, getHeight, getRadius} = useScale();
  const {shadow, coloursTheme, textStyles} = useStyle();
  const {
    dictionary: {MapSearch},
  } = useDictionary();
  const [loading, setLoading] = useState(false);

  const buttonOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (show) {
      Animated.timing(buttonOpacity, {
        toValue: 1,
        duration: 50,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(buttonOpacity, {
        toValue: 0,
        duration: 50,
        useNativeDriver: true,
      }).start(({finished}) => {
        if (finished) {
          setLoading(false); // Set loading to false when the animation finishes
        }
      });
    }
  }, [show, buttonOpacity]);

  const styles = StyleSheet.create({
    container: {
      position: 'absolute',
      marginTop: insets.top + getHeight(40) + getHeight(30),
      alignSelf: 'center',
      opacity: buttonOpacity.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
      }) as unknown as number,
    },
    button: {
      ...shadow,
      backgroundColor: coloursTheme.input.background,
      paddingVertical: getHeight(10),
      paddingHorizontal: getWidth(20),
      borderRadius: getRadius(20),
      justifyContent: 'center',
      alignContent: 'center',
    },
    text: {
      ...textStyles.regular16,
      color: coloursTheme.input.text,
      paddingStart: getWidth(8),
      opacity: loading ? 0 : 1,
    },
    loading: {
      position: 'absolute',
      alignSelf: 'center',
    },
  });

  // ** ** ** ** ** RENDER ** ** ** ** **
  return (
    <Animated.View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        activeOpacity={0.7}
        onPress={async () => {
          setLoading(true);
          onPress && (await onPress());

          onLoad && onLoad();
        }}>
        <Text style={styles.text}>{MapSearch.SearchThisArea}</Text>
        {loading && (
          <ActivityIndicator
            size="small"
            color="black"
            style={styles.loading}
          />
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};
