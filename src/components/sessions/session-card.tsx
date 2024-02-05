import React from 'react';

import {useScale} from 'providers/style/scale-provider';
import {useStyle} from 'providers/style/style-provider';
import {useNavigation} from '@react-navigation/native';

import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import FontAwesome5Pro from 'react-native-vector-icons/FontAwesome5Pro';
import {Spacer} from 'components/utils/spacer';
import {format} from 'date-fns';
import {SESSION_SCREENS} from '../../types/navigation';
import {SdrData} from 'providers/types/charging';

interface SessionCardProps {
  session: SdrData;
}

const SessionCard = ({
  session: {charging_point_id, endDateTime, total, id},
}: SessionCardProps) => {
  const navigation = useNavigation<any>();

  // ** ** ** ** ** STYLES ** ** ** ** **
  const {getHeight, getWidth, getRadius} = useScale();
  const {coloursTheme, textStyles} = useStyle();
  const styles = StyleSheet.create({
    container: {
      width: getWidth(335),
      backgroundColor: coloursTheme.card.backgroundColor,
      borderRadius: getRadius(10),
      padding: getWidth(15),
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    blueCircle: {
      width: getWidth(30),
      height: getWidth(30),
      borderRadius: getWidth(15),
      backgroundColor: coloursTheme.primaryColor,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
  // ** ** ** ** ** RENDER ** ** ** ** **
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() =>
        navigation.navigate(SESSION_SCREENS.SESSION_DETAILS, {
          sessionID: id,
          chargepointID: charging_point_id,
        })
      }>
      <View style={styles.row}>
        <Text style={textStyles.semiBold18}>{charging_point_id}</Text>
      </View>
      <Spacer size={getHeight(15)} vertical />
      <View style={styles.row}>
        <View style={styles.row}>
          <View style={styles.blueCircle}>
            <FontAwesome5Pro name="calendar-day" color="white" size={15} />
          </View>
          <Spacer size={getHeight(5)} />
          <Text style={textStyles.regular18}>
            {endDateTime ? format(new Date(endDateTime), 'dd.MM.yyyy') : 'N/A'}
          </Text>
        </View>
        <Spacer size={getHeight(15)} />
        <View style={styles.row}>
          <View style={styles.blueCircle}>
            <FontAwesome5Pro name="coins" color="white" size={15} />
          </View>
          <Spacer size={getHeight(5)} />
          <Text style={textStyles.regular18}>{`Total: £${
            total?.toFixed(2) ?? 0.0
          }`}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default SessionCard;
