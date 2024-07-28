/*
 * Copyright © 2024 Kard Inc. All rights reserved.
 */
import {EventArg, useNavigation} from '@react-navigation/native';
import {useEffect} from 'react';
type EventType = EventArg<
  'beforeRemove',
  true,
  {
    action: Readonly<{
      type: string;
      payload?: object | undefined;
      source?: string | undefined;
      target?: string | undefined;
    }>;
  }
>;
const useDisAppear = (fn?: (e: EventType) => void, ...deps: Array<any>) => {
  const navigation = useNavigation();
  useEffect(() => {
    return navigation.addListener('beforeRemove', e => {
      fn?.(e);
    });
  }, [fn, navigation, deps]);
};

export default useDisAppear;
