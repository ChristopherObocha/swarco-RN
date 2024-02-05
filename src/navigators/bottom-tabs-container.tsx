import React from 'react';

import {useScale} from 'providers/style/scale-provider';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useStyle} from 'providers/style/style-provider';

import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {BOTTOM_TABS} from '../types/navigation';
import {Text} from '@rneui/themed';
import {Platform, StyleSheet, View, ViewStyle} from 'react-native';
import {MapContainer} from './map-container';
import {AccountContainer} from './account-container';
import {ChargingContainer} from './charging-container';
import FontAwesome5Pro from 'react-native-vector-icons/FontAwesome5Pro';
import {SessionContainer} from './session-container';

interface RouteIcons {
  [key: string]: {
    icon: any;
  };
}

interface TabItemProps {
  focused: boolean;
  color: string;
  tab: string;
}

const Tab = createBottomTabNavigator();

const routeIcons: RouteIcons = {
  Tab1: {
    icon: 'map-marked',
  },
  Tab2: {
    icon: 'charging-station',
  },
  Tab3: {
    icon: 'list',
  },
  Tab4: {
    icon: 'user',
  },
};

const TabIcon = ({color, tab, focused}: TabItemProps) => {
  const {getFontSize} = useScale();

  const iconProps = {
    input: routeIcons[tab].icon,
    iconInputStyle: {
      color: color,
    },
  };

  return (
    <FontAwesome5Pro
      name={iconProps.input}
      style={iconProps.iconInputStyle}
      size={getFontSize(20)}
      solid={focused}
      light={!focused}
    />
  );
};

const TabLabel = ({focused, tab, color}: TabItemProps) => {
  const {textStyles} = useStyle();

  const labelProps = focused
    ? {
        ...textStyles.semiBold12,
        color: color,
      }
    : {
        ...textStyles.regular12,
        color: color,
      };

  return <Text style={labelProps}>{tab}</Text>;
};

// Define tabBarStyle as an exportable function
export const useTabBarStyle = () => {
  const {coloursTheme} = useStyle();
  const {getHeight, getRadius, getWidth} = useScale();
  const insets = useSafeAreaInsets();
  const bottomSpacing = insets.bottom || getHeight(10);
  const minTabHeight =
    bottomSpacing + getHeight(Platform.OS === 'ios' ? 57.2 : 67);

  return {
    minHeight: minTabHeight,
    paddingTop: getHeight(17),
    paddingHorizontal: getWidth(5),
    paddingBottom:
      bottomSpacing + getHeight(Platform.OS === 'ios' ? 0 : getHeight(5)),
    backgroundColor: coloursTheme.tabBar.background,
    borderTopLeftRadius: getRadius(20),
    borderTopRightRadius: getRadius(20),
    position: 'absolute',
    marginRight: getWidth(-0.5),
    marginBottom: getHeight(-0.5),
    borderTopWidth: 0,
    shadowColor: coloursTheme.tabBar.shadow,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowRadius: 6,
    shadowOpacity: 1,
  };
};

const BottomTabsContainer = ({route}: any) => {
  const {coloursTheme} = useStyle();
  const tabBarStyle = useTabBarStyle();

  // ** ** ** ** ** STYLES ** ** ** ** **
  const styles = StyleSheet.create({
    tabBarContainer: {
      flex: 1,
    },
    tabBarStyle: tabBarStyle as ViewStyle, //used type assertion to resolve type inference issues
  });

  // ** ** ** ** ** RENDER ** ** ** ** **
  const getOptions = (tab: string, tabName: string) => {
    return {
      tabBarActiveTintColor: coloursTheme.tabBar.icon.active,
      tabBarInactiveTintColor: coloursTheme.tabBar.icon.inactive,
      // eslint-disable-next-line react/no-unstable-nested-components
      tabBarIcon: (props: any) => <TabIcon {...props} tab={tab} />,
      // eslint-disable-next-line react/no-unstable-nested-components
      tabBarLabel: (props: any) => <TabLabel {...props} tab={tabName} />,
    };
  };

  return (
    <View style={styles.tabBarContainer}>
      <Tab.Navigator
        screenOptions={{
          lazy: false,
          headerShown: false,
          tabBarStyle: styles.tabBarStyle,
          tabBarHideOnKeyboard: false,
        }}
        initialRouteName={route?.params && BOTTOM_TABS.CHARGING_CONTAINER}>
        <Tab.Screen
          name={BOTTOM_TABS.MAP_CONTAINER}
          component={MapContainer}
          options={() => getOptions('Tab1', 'Map')}
        />
        <Tab.Screen
          name={BOTTOM_TABS.CHARGING_CONTAINER}
          component={ChargingContainer}
          options={() => getOptions('Tab2', 'Charging')}
          initialParams={route?.params}
        />
        <Tab.Screen
          name={BOTTOM_TABS.SESSION_CONTAINER}
          component={SessionContainer}
          options={() => getOptions('Tab3', 'Sessions')}
        />
        <Tab.Screen
          name={BOTTOM_TABS.ACCOUNT_CONTAINER}
          component={AccountContainer}
          options={() => getOptions('Tab4', 'Account')}
        />
      </Tab.Navigator>
    </View>
  );
};

export default BottomTabsContainer;
