import React, {useCallback} from 'react';
import {StatusBar, StyleSheet, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {SiteImages} from 'providers/types/site';
import {ImageGallery} from '@georstat/react-native-image-gallery';
import DefaultHeader from 'components/headers/default-header';

interface ImageModalProps {
  images: SiteImages[];
  isVisible: boolean;
  testID?: string;
  selectedImageURL: string | null;
  setSelectedImageURL: (url: string | null) => void;
}

const ImageModal = ({
  images,
  selectedImageURL,
  setSelectedImageURL,
}: ImageModalProps) => {
  const imagesToRender = images.map(({site_image_url}) => ({
    url: site_image_url,
  }));

  // ** ** ** ** ** STYLES ** ** ** ** **
  const {top} = useSafeAreaInsets();

  const styles = StyleSheet.create({
    headerContainer: {
      marginTop: top,
    },
  });

  const removeSelectedImageURL = useCallback(
    () => setSelectedImageURL(null),
    [],
  );

  // ** ** ** ** ** RENDER ** ** ** ** **
  return (
    <ImageGallery
      close={removeSelectedImageURL}
      isOpen={!!selectedImageURL}
      images={imagesToRender}
      renderHeaderComponent={() => (
        <View style={styles.headerContainer}>
          <StatusBar barStyle="light-content" />
          <DefaultHeader
            hideGoBack
            rightIcons={[
              {
                name: 'times',
                onPress: () => setSelectedImageURL(null),
                selected: false,
                isPro: true,
              },
            ]}
          />
        </View>
      )}
    />
  );
};

export default ImageModal;
