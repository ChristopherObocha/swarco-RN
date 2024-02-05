import React, {useEffect, useState} from 'react';
import {useScale} from 'providers/style/scale-provider';
import {useDictionary} from 'providers/dictionary/dictionary-provider';
import {useWalkthroughItem} from 'providers/apis/walkthroughItem';
import {useNavigation} from '@react-navigation/native';

import {APP_CONTAINER_SCREENS, ACCOUNT_SCREENS} from '../../types/navigation';

import CardCarousel from 'components/carousel/card-carousel';

import {StyleSheet, View} from 'react-native';
import {PrimaryButton} from 'components/buttons/primary-button';
import {TertiaryButton} from 'components/buttons/tertiary-button';
import {Spacer} from 'components/utils/spacer';
import DefaultHeader from 'components/headers/default-header';
import {GlobalStorage} from 'utils/storage-utils';
import {STORAGE} from 'utils/constants';
import {WalkthroughItem} from 'providers/types/walkthroughItem';
import {LoadingView} from 'components/utils/loading-view';

const CardGraphic = require('assets/svg/card-graphic.svg').default;
const ChargingGraphic = require('assets/svg/charging-graphic.svg').default;
const SupportGraphic = require('assets/svg/support-graphic.svg').default;

const Walkthrough = () => {
  const {getHeight} = useScale();
  const navigation = useNavigation<any>();
  const hasShownWalkthrough =
    GlobalStorage.getString(STORAGE.SHOWN_WALKTHROUGH) === 'true';

  const {getWalkthroughItems} = useWalkthroughItem();
  const {
    dictionary: {Walkthrough},
  } = useDictionary();

  const carouselItems: WalkthroughItem[] = [
    {
      id: '1',
      order_index: 1,
      title: Walkthrough.WalkthroughTitle1,
      description: Walkthrough.WalkthroughDescription1,
      image: CardGraphic,
    },
    {
      id: '2',
      order_index: 2,
      title: Walkthrough.WalkthroughTitle2,
      description: Walkthrough.WalkthroughDescription2,
      image: ChargingGraphic,
    },
    {
      id: '3',
      order_index: 3,
      title: Walkthrough.WalkthroughTitle3,
      description: Walkthrough.WalkthroughDescription3,
      image: SupportGraphic,
    },
  ];

  const [carouselContent, setCarouselContent] =
    useState<WalkthroughItem[]>(carouselItems);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    getWalkthroughItems()
      .then(response => {
        if (response?.data) {
          setCarouselContent(prevState => {
            const newState = response.data as WalkthroughItem[];

            if (newState.length === 0) {
              return prevState;
            }

            return prevState.map(item => ({
              ...item,
              title: newState[item.order_index - 1].title,
              description: newState[item.order_index - 1].description,
            }));
          });
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [getWalkthroughItems]);

  useEffect(() => {
    if (!hasShownWalkthrough) {
      GlobalStorage.set(STORAGE.SHOWN_WALKTHROUGH, 'true');
    }
  }, [hasShownWalkthrough]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
    },
    buttonContainer: {
      alignItems: 'center',
    },
  });

  if (isLoading) {
    return <LoadingView />;
  }
  // ** ** ** ** ** RENDER ** ** ** ** **
  return (
    <>
      <DefaultHeader />

      <View style={styles.container}>
        <CardCarousel items={carouselContent} />

        <View style={styles.buttonContainer}>
          <PrimaryButton
            title={Walkthrough.GetStarted}
            onPress={() =>
              navigation.navigate(APP_CONTAINER_SCREENS.BOTTOM_TABS)
            }
          />
          <Spacer size={getHeight(15)} />
          <TertiaryButton
            title={Walkthrough.SignInToExistingAccount}
            onPress={() =>
              navigation.navigate(APP_CONTAINER_SCREENS.ACCOUNT_CONTAINER, {
                screen: ACCOUNT_SCREENS.SIGN_IN,
              })
            }
          />
        </View>
      </View>
    </>
  );
};

export default Walkthrough;
