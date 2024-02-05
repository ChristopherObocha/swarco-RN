import React, {useState} from 'react';
import {useScale} from 'providers/style/scale-provider';
import {useStyle} from 'providers/style/style-provider';

import {Text} from '@rneui/themed';
import {View, StyleSheet, Pressable} from 'react-native';
import FastImage from 'react-native-fast-image';
import ImageModal from './image-modal';
import {SiteImages} from 'providers/types/site';
interface ImageGalleryProps {
  testID?: string;
  images: SiteImages[];
}

const ImageGallery = ({images, testID = 'imageGallery'}: ImageGalleryProps) => {
  const firstImage = images[0];
  const remainingImagesToShow = images.slice(1, 3);
  const [selectedImageID, setSelectedImageID] = useState<string | null>(null);

  // ** ** ** ** ** STYLES ** ** ** ** **
  const {getHeight, getWidth, getRadius} = useScale();
  const {textStyles, coloursTheme} = useStyle();
  const styles = StyleSheet.create({
    rowContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: getHeight(10),
    },
    image: {
      borderRadius: getRadius(10),
    },
    firstImage: {
      width:
        images.length === 1
          ? getWidth(335)
          : images.length > 2
          ? getWidth(217)
          : getWidth(165),
      height: getHeight(155),
      marginRight: images.length === 1 ? 0 : getWidth(6),
    },
    remainingImageContainer: {
      justifyContent: 'space-between',
    },
    remainingImages: {
      height: images.length > 2 ? getHeight(72.5) : getHeight(155),
      width: images.length > 2 ? getWidth(113) : getWidth(165),
    },
    imageCountContainer: {
      position: 'absolute',
      bottom: getHeight(7),
      left: getWidth(6),
      backgroundColor: coloursTheme.imageGallery.imageCount.backgroundColor,
      height: getHeight(30),
      width: getWidth(74),
      borderRadius: getRadius(10),
      zIndex: 2,
      justifyContent: 'center',
      alignItems: 'center',
      display: images.length > 2 ? 'flex' : 'none',
    },
    imageCount: {
      ...textStyles.regular14,
      color: coloursTheme.imageGallery.imageCount.textColor,
    },
  });

  if (!images.length) {
    return null;
  }

  // ** ** ** ** ** RENDER ** ** ** ** **
  return (
    <>
      <View style={styles.rowContainer}>
        <Pressable
          onPress={() => setSelectedImageID(firstImage.site_image_url)}>
          <FastImage
            style={[styles.image, styles.firstImage]}
            source={{uri: firstImage.site_image_url}}
            testID={`${testID}.firstImage`}
          />
          <View style={styles.imageCountContainer}>
            <Text
              style={styles.imageCount}
              testID={`${testID}.imageCount`}>{`${images.length} images`}</Text>
          </View>
        </Pressable>
        <View style={styles.remainingImageContainer}>
          {remainingImagesToShow.map((image, index) => (
            <Pressable
              key={index}
              onPress={() => setSelectedImageID(image.site_image_url)}>
              <FastImage
                source={{uri: image.site_image_url}}
                style={[styles.image, styles.remainingImages]}
                testID={`${testID}.images.${index}`}
              />
            </Pressable>
          ))}
        </View>
      </View>

      <ImageModal
        images={images}
        isVisible={!!selectedImageID}
        selectedImageURL={selectedImageID}
        setSelectedImageURL={setSelectedImageID}
      />
    </>
  );
};

export default ImageGallery;
