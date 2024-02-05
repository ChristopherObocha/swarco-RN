import React from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import AppSetupContainer from './src/navigators/app-setup-container';
import {NavigationProvider} from 'providers/navigation/navigation-provider';
import {IPHONE_X} from 'utils/constants';
import {ScaleProvider} from 'the-core-ui-utils';
import {ErrorReportProvider} from 'providers/error-report/error-report-provider';
import {LayoutProvider as StyleProvider} from 'providers/style/layout-provider';
import {NetworkProvider} from 'providers/network/network-provider';
import {DictionaryProvider} from 'providers/dictionary/dictionary-provider';
import {DateTimeFormatterProvider} from 'providers/date-time-formatter/date-time-formatter-provider';
import {
  ThemeProvider as ElementsThemeProvider,
  createTheme,
} from '@rneui/themed';
import {AlertProvider} from 'providers/alert/alert-provider';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {BiometricsProvider} from 'providers/biometrics/biometrics-provider';

import {loadErrorMessages, loadDevMessages} from '@apollo/client/dev';

if (__DEV__) {
  // Adds messages only in a dev environment
  loadDevMessages();
  loadErrorMessages();
}

function App(): JSX.Element {
  // Includes all providers that are needed globally and do not need further configuration
  return (
    <ErrorReportProvider>
      <SafeAreaProvider>
        <ScaleProvider config={IPHONE_X}>
          <ElementsThemeProvider theme={createTheme({})}>
            <StyleProvider>
              <NavigationProvider>
                <NetworkProvider>
                  <DictionaryProvider>
                    <DateTimeFormatterProvider>
                      <AlertProvider>
                        <GestureHandlerRootView style={{flex: 1}}>
                          <BiometricsProvider>
                            <AppSetupContainer />
                          </BiometricsProvider>
                        </GestureHandlerRootView>
                      </AlertProvider>
                    </DateTimeFormatterProvider>
                  </DictionaryProvider>
                </NetworkProvider>
              </NavigationProvider>
            </StyleProvider>
          </ElementsThemeProvider>
        </ScaleProvider>
      </SafeAreaProvider>
    </ErrorReportProvider>
  );
}

export default App;
