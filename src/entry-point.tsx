import React from 'react';
import AgoraConfig, {GlobalAgoraConfig} from './common/agora-config';
import {MainNavigator} from './navigation';
import {Provider} from 'react-redux';
import {store} from './store/config-store';
const EntryPoint = () => {
  return (
    <Provider store={store}>
      <AgoraConfig ref={GlobalAgoraConfig} />
      <MainNavigator />
    </Provider>
  );
};

export default EntryPoint;
