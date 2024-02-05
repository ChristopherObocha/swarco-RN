import React, {useEffect, useState} from 'react';
import {default as NativeSplashScreen} from 'react-native-splash-screen';

import {fetchSecrets} from 'config/fetch-secrets';
import {ApolloProvider} from '@apollo/client';
import {ClientProvider} from 'providers/client/client-provider';
import {ApolloClient} from 'providers/client/apollo/apollo-client';
import {I18nManager, Text, View} from 'react-native';
import {RestApiProvider} from 'providers/client/rest-api-client/rest-api-provider';
import {restrictAccess} from 'utils/security-utils';
import ContentLoadingContainer from 'navigators/content-loading-container';
// import {ExampleProvider} from 'providers/example/example-provider';
import {UserProvider} from 'providers/apis/user';
import {AuthProvider} from 'providers/apis/auth';
import {ProfileProvider} from 'providers/apis/profile';
import {LoadingProvider} from 'providers/loading/loading-provider';
import RefreshTokenProvider from 'providers/refresh-token/refresh-token-provider';
import {WalkthroughItemProvider} from 'providers/apis/walkthroughItem';
import * as Font from 'expo-font';
import {ChargingProvider} from 'providers/apis/charging';
import {PaymentProvider} from 'providers/apis/payment';
import {SiteProvider} from 'providers/apis/site';
import SimulatedSplashScreen from './simulated-splash-screen';
import {requestStartupPermissions} from 'utils/permissions';
import {VehicleProvider} from 'providers/apis/vehicle/ index';
import {useDictionary} from 'providers/dictionary/dictionary-provider';
import {FAQProvider} from 'providers/apis/faq';

export default function AppSetupContainer(): React.JSX.Element {
  const [appIsReady, setAppIsReady] = useState(false);
  const [client, setClient] = useState<any>(null);

  const {
    dictionary: {Errors},
  } = useDictionary();

  const setLanguage = () => {
    // Note: Handle reset language
    if (I18nManager.isRTL) {
      I18nManager.forceRTL(false);
    }
  };

  const setupApollo = async () => {
    const newClient = await ApolloClient();
    setClient(newClient);
  };

  useEffect(() => {
    setTimeout(() => {
      NativeSplashScreen.hide();
    }, 1000);

    async function prepare() {
      try {
        const secrets = fetchSecrets();
        console.log('secrets: ', secrets);

        setLanguage();

        if (!client) {
          await setupApollo();
        }

        // Pre-load fonts, make any API calls you need to do here
        // Artificially delay for two seconds to simulate a slow loading
        // experience. Please remove this if you copy and paste the code!
        await Font.loadAsync({
          RobotoMedium: require('assets/fonts/Roboto-Medium.ttf'),
        });

        await new Promise<void>(resolve => setTimeout(resolve, 2000));

        await requestStartupPermissions();
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
      }
    }

    prepare();
  }, [client]);

  if (restrictAccess()) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          paddingHorizontal: 36,
        }}>
        <Text
          style={{
            fontSize: 48,
            fontWeight: '300',
            paddingBottom: 16,
          }}>
          {Errors.Generic.Title}
        </Text>
        <Text
          style={{
            fontSize: 32,
            fontWeight: '800',
          }}>
          {Errors.Generic.Description}
        </Text>
        <Text style={{paddingVertical: 16}}>
          {restrictAccess()?.toString()}
        </Text>
      </View>
    );
  } else if (appIsReady) {
    // Includes all providers that need further configuration ie ApolloProvider
    return (
      <ApolloProvider client={client}>
        <LoadingProvider>
          <RestApiProvider>
            <ClientProvider>
              <UserProvider>
                <AuthProvider>
                  <ProfileProvider>
                    <RefreshTokenProvider>
                      <WalkthroughItemProvider>
                        <SiteProvider>
                          <ChargingProvider>
                            <PaymentProvider>
                              <VehicleProvider>
                                <FAQProvider>
                                  <ContentLoadingContainer />
                                </FAQProvider>
                              </VehicleProvider>
                            </PaymentProvider>
                          </ChargingProvider>
                        </SiteProvider>
                      </WalkthroughItemProvider>
                    </RefreshTokenProvider>
                  </ProfileProvider>
                </AuthProvider>
              </UserProvider>
            </ClientProvider>
          </RestApiProvider>
        </LoadingProvider>
      </ApolloProvider>
    );
  } else {
    return <SimulatedSplashScreen />;
  }
}
