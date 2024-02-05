import React, {useState} from 'react';
import {useScale} from 'providers/style/scale-provider';
import {useStyle} from 'providers/style/style-provider';

import {Platform, StyleSheet, View, Image} from 'react-native';
import {Text} from '@rneui/themed';
import SnapCarousel, {Pagination} from 'react-native-snap-carousel';
import {ChargingGuideItem} from 'providers/types/user';

const DOT_SIZE = 10;

interface CarouselItem {
  id: string;
  order_index: number;
  title: string;
  description: string;
  image: string;
}

interface CarouselProps {
  items: CarouselItem[] | ChargingGuideItem[];
  testID?: string;
  carouselHeight?: number;
}

const CardCarousel = ({
  items,
  testID = 'CardCarousel',
  carouselHeight,
}: CarouselProps) => {
  const {coloursTheme, textStyles} = useStyle();
  const {getWidth, getHeight, getRadius} = useScale();
  const [swiperIndex, setSwiperIndex] = useState(0);

  const carouselWidth = getWidth(335);
  const contentWidth = getWidth(290);

  // ** ** ** ** ** STYLES ** ** ** ** **
  const styles = StyleSheet.create({
    carouselContainer: {
      width: carouselWidth,
      height: carouselHeight ?? getHeight(560),
      borderRadius: getRadius(10),
      paddingVertical: getHeight(40),
      backgroundColor: coloursTheme.card.backgroundColor,
      justifyContent: 'space-between',
      marginBottom: getHeight(30),
    },
    paginationDotStyle: {
      width: getWidth(DOT_SIZE),
      height: getWidth(DOT_SIZE),
      borderRadius: getWidth(DOT_SIZE / 2),
      marginHorizontal: getWidth(1),
      backgroundColor: coloursTheme.carousel.activeDot,
    },
    inactivePaginationDotStyle: {
      width: getWidth(DOT_SIZE),
      height: getWidth(DOT_SIZE),
      borderRadius: getWidth(DOT_SIZE / 2),
      marginHorizontal: getWidth(1),
      backgroundColor: coloursTheme.carousel.inactiveDot,
    },
    paginationDotContainerStyle: {
      width: 0,
      marginHorizontal: getWidth(DOT_SIZE),
    },
    paginationContainer: {
      flex: 1,
      paddingTop: 0,
      paddingBottom: 0,
      backgroundColor:
        Platform.OS === 'android' ? 'rgba(255,255,255,0.001)' : 'transparent',
      alignItems: 'flex-end',
    },
    bannerCellContainerStyle: {
      alignItems: 'center',
      marginLeft: 0,
    },
    itemContainer: {
      alignItems: 'center',
      width: carouselWidth,
    },
    contentContainer: {
      alignItems: 'center',
      width: contentWidth,
    },
    h1Text: {
      ...textStyles.semiBold20,
      color: coloursTheme.text.primary,
      marginTop: getHeight(30),
      marginBottom: getHeight(15),
    },
    description: {
      ...textStyles.regular16,
      textAlign: 'center',
    },
    imageContainer: {
      width: getWidth(180),
      height: getHeight(180),
    },
  });

  const renderItem = ({item, index}: {item: CarouselItem; index: number}) => {
    const Icon = item.image;
    return (
      <View
        style={styles.itemContainer}
        testID={`${testID}.CarouselItem.${index}`}>
        <View style={styles.contentContainer}>
          {typeof item?.image === 'string' ? (
            <View>
              <Image source={{uri: item.image}} />
            </View>
          ) : (
            <View style={styles.imageContainer}>
              {/* @ts-ignore */}
              <Icon width={'100%'} height={'100%'} />
            </View>
          )}

          <Text h1 h1Style={styles.h1Text}>
            {item.title}
          </Text>
          <Text style={styles.description} numberOfLines={8}>
            {item.description}
          </Text>
        </View>
      </View>
    );
  };

  // ** ** ** ** ** RENDER ** ** ** ** **
  return (
    <View style={styles.carouselContainer}>
      <SnapCarousel
        data={items.sort((a, b) => a.order_index - b.order_index)}
        renderItem={renderItem}
        sliderWidth={carouselWidth}
        itemWidth={carouselWidth}
        inactiveSlideScale={1}
        inactiveSlideOpacity={1}
        onSnapToItem={(index: number) => setSwiperIndex(index)}
        contentContainerStyle={{flex: 1, justifyContent: 'center'}}
        testID={testID}
        extraData={items}
      />
      <Pagination
        dotsLength={items.length}
        activeDotIndex={swiperIndex}
        inactiveDotScale={1}
        dotStyle={styles.paginationDotStyle}
        inactiveDotStyle={styles.inactivePaginationDotStyle}
        containerStyle={styles.paginationContainer}
        dotContainerStyle={styles.paginationDotContainerStyle}
      />
    </View>
  );
};

export default CardCarousel;
