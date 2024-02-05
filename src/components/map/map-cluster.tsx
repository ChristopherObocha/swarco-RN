import React from 'react';
import {useScale} from 'providers/style/scale-provider';

import {Text, StyleSheet, View} from 'react-native';
import {Marker} from 'react-native-maps';
import {useStyle} from 'providers/style/style-provider';

interface Props {
  id: number;
  geometry: {
    coordinates: number[];
    type: string;
  };
  onPress: () => void;
  properties: {
    cluster: boolean;
    cluster_id: number;
    point_count: number;
    point_count_abbreviated: number;
  };
  type: string;
  testID?: string;
}

const MapCluster = ({
  geometry: {coordinates},
  properties: {point_count},
  testID = 'MapCluster',
  onPress,
}: Props) => {
  const points = point_count;

  // ** ** ** ** ** STYLES ** ** ** ** **
  const {getHeight, getWidth, getRadius} = useScale();
  const {coloursTheme, textStyles} = useStyle();
  const styles = StyleSheet.create({
    container: {
      paddingHorizontal: getWidth(12),
      paddingVertical: getHeight(5),
      borderRadius: getRadius(5),
      backgroundColor: coloursTheme.map.clusterTag.backgroundColour,
      borderStyle: 'solid',
      borderWidth: getWidth(2),
      borderColor: coloursTheme.map.clusterTag.borderColour,
    },
    text: {
      ...textStyles.bold16,
      color: coloursTheme.map.clusterTag.textColour,
    },
  });

  // ** ** ** ** ** RENDER ** ** ** ** **
  return (
    <Marker
      key={`${coordinates[0]}_${coordinates[1]}`}
      coordinate={{
        longitude: coordinates[0],
        latitude: coordinates[1],
      }}
      tracksViewChanges={false}
      style={{zIndex: points + 1}}
      testID={`${testID}.marker`}
      onPress={onPress}>
      <View style={styles.container}>
        <Text style={styles.text}>{points}</Text>
      </View>
    </Marker>
  );
};

export default MapCluster;
