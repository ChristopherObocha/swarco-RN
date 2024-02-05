import React, {useEffect, useState} from 'react';
import {Keyboard} from 'react-native';
import {
  StyleSheet,
  ViewStyle,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

import {Edge, SafeAreaView} from 'react-native-safe-area-context';
import {useScale} from 'providers/style/scale-provider';

interface Props {
  children: React.ReactNode;
  avoidSafeAreaEdges?: Edge[];
  style?: ViewStyle;
  enableKeyboardAvoidingView?: boolean;
}

const defaultValue = Platform.select({
  ios: false,
  android: true,
});

const ScreenContainer = ({
  children,
  avoidSafeAreaEdges = ['bottom'],
  style,
  enableKeyboardAvoidingView = false,
}: Props) => {
  const [enabled, setEnabled] = useState(defaultValue);

  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardWillShow', () => {
      setEnabled(true);
    });

    const hideSubscription = Keyboard.addListener('keyboardWillHide', () => {
      setEnabled(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  // ** ** ** ** ** STYLES ** ** ** ** **
  const {getHeight} = useScale();
  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
  });

  // ** ** ** ** ** RENDER ** ** ** ** **
  return (
    <SafeAreaView edges={avoidSafeAreaEdges} style={styles.container}>
      <KeyboardAvoidingView
        style={[styles.container, style]}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={
          Platform.OS === 'ios' ? getHeight(120) : getHeight(100)
        }
        enabled={enableKeyboardAvoidingView && enabled}>
        {children}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ScreenContainer;
