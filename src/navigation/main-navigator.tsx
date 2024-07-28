import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {memo} from 'react';
import {ScreenName} from '../utils/containts';
import {HomeScreen, StartReviewScreen, VideoCallScreen} from '../screens';
import {navigationRef} from '../utils/app-navigator';

const Stack = createNativeStackNavigator();

const MainNavigator = () => {
  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator
        screenOptions={{headerShown: false}}
        initialRouteName={ScreenName.homeScreen}>
        <Stack.Screen
          name={ScreenName.homeScreen}
          component={HomeScreen}
          options={{gestureEnabled: false}}
        />
        <Stack.Screen
          name={ScreenName.startReviewScreen}
          component={StartReviewScreen}
        />
        <Stack.Screen
          name={ScreenName.videoCallScreen}
          component={VideoCallScreen}
          options={{gestureEnabled: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default memo(MainNavigator);
