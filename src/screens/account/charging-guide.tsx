/*
 * Jira Ticket:
 * Zeplin Design:
 * Feature Document:
 * Created Date: Mon, 8th Jan 2024, 12:02:03 pm
 * Author: Christopher Obocha (chris.obocha@thedistance.co.uk)
 * Copyright (c) 2024 The Distance
 */

import React, {useState, useEffect} from 'react';
import {useScale} from 'providers/style/scale-provider';
import {useDictionary} from 'providers/dictionary/dictionary-provider';
import {useCharging} from 'providers/apis/charging';
import {ChargingGuideItem} from 'providers/types/user';

import CardCarousel from 'components/carousel/card-carousel';

import {StyleSheet, View} from 'react-native';
import {Spacer} from 'components/utils/spacer';
import DefaultHeader from 'components/headers/default-header';
import {LoadingView} from 'components/utils/loading-view';
import ContactUnavailableCard from 'components/cards/content-unavailable-card';
import {useLoading} from 'providers/loading/loading-provider';

const ChargingGuide = () => {
  const {getHeight} = useScale();
  const {getChargingGuides} = useCharging();
  const [chargingGuides, setChargeGuides] = useState<ChargingGuideItem[]>();

  const callChargingGuide = async () => {
    const res: any = await getChargingGuides();
    if (res?.success) {
      setChargeGuides(res?.data);
    }
  };

  callChargingGuide();

  useEffect(() => {
    if (!chargingGuides) {
      callChargingGuide();
    }
  }, []);

  const {
    dictionary: {
      Account: {ChargingGuide},
    },
  } = useDictionary();

  const {loading} = useLoading();
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
    },
    buttonContainer: {
      alignItems: 'center',
    },
  });

  if (loading) {
    return <LoadingView />;
  }

  // ** ** ** ** ** RENDER ** ** ** ** **
  return (
    <>
      <DefaultHeader title={ChargingGuide.ChargingGuide} />

      <Spacer vertical size={10} />
      <View style={styles.container}>
        {chargingGuides && chargingGuides?.length > 0 ? (
          <CardCarousel
            items={chargingGuides}
            carouselHeight={getHeight(537)}
          />
        ) : (
          <ContactUnavailableCard />
        )}
      </View>
    </>
  );
};

export default ChargingGuide;
