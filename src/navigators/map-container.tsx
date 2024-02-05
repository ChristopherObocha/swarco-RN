import React, {useLayoutEffect} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {getFocusedRouteNameFromRoute} from '@react-navigation/native';

import {MAP_SCREENS, MapContainerParamList} from '../types/navigation';
import {useTabBarStyle} from './bottom-tabs-container';

import MapScreen from 'screens/map/map';
import MapSearchScreen from 'screens/map/map-search';
import FAQSelectedCategory from 'screens/account/faq-selected-category';
import FAQCategories from 'screens/account/faq-categories';

const MapStack = createStackNavigator<MapContainerParamList>();

const tabBarShownRoutes = [MAP_SCREENS.MAP, MAP_SCREENS.FAQS];

export function MapContainer({navigation, route}: any) {
  const initialRouteName = MAP_SCREENS.MAP;

  const tabBarStyle = useTabBarStyle();

  useLayoutEffect(() => {
    const routeName =
      (getFocusedRouteNameFromRoute(route) as MAP_SCREENS) ?? initialRouteName;

    if (tabBarShownRoutes.includes(routeName)) {
      navigation.setOptions({tabBarStyle: tabBarStyle});
    } else {
      navigation.setOptions({tabBarStyle: {display: 'none'}});
    }
  }, [initialRouteName, navigation, route, tabBarStyle]);

  return (
    <MapStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName={initialRouteName}>
      <MapStack.Screen name={MAP_SCREENS.MAP} component={MapScreen} />
      <MapStack.Screen
        name={MAP_SCREENS.MAP_SEARCH}
        component={MapSearchScreen}
      />
      <MapStack.Screen name={MAP_SCREENS.FAQS} component={FAQCategories} />
      <MapStack.Screen
        name={MAP_SCREENS.FAQ_SELECTED_CATEGORY}
        component={FAQSelectedCategory}
      />
    </MapStack.Navigator>
  );
}
