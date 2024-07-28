import React from 'react';
import {NavigationContainerRef, NavigationProp} from '@react-navigation/native';
import {ScreenName} from './containts';

interface RefObject<T> {
  current: T | null;
}
export const navigationRef = React.createRef<NavigationContainerRef<{}>>();
export type RootStackParamList = Record<keyof typeof ScreenName, any>;
export type StackNavigation = NavigationProp<RootStackParamList>;
export const routeNameRef: RefObject<string> = React.createRef<string | null>();
function navigate(name: keyof typeof ScreenName, params?: Record<string, any>) {
  const navigation: StackNavigation =
    navigationRef.current as unknown as StackNavigation;
  navigation?.navigate<any>(ScreenName[name], params);
}

function goBack() {
  navigationRef.current?.goBack();
}

const NavigationService = {
  navigate,
  goBack,
};

export default NavigationService;
