import React, {useEffect, useRef} from 'react';
import {BackHandler, StyleSheet, View} from 'react-native';
import {getBottomSpace} from 'react-native-iphone-x-helper';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useSelector} from 'react-redux';
import {GlobalAgoraConfig} from '../../common/agora-config';
import {LocalControl} from '../../components';
import useDisAppear from '../../hooks/use-disappear';
import {getUsersJoinedChannel} from '../../store/reducer/user-joined-reducer';
import GridVideo from './components/grid-video';
import PinnedVideo from './components/pinned-video';
import {scaledSize} from '../../utils';
const VideoCallScreen = () => {
  const safeAreaInsets = useSafeAreaInsets();
  const isMounted = useRef(false);
  const user = useSelector(getUsersJoinedChannel);
  const defaultUsers = user?.find(users => users?.uid === 0);
  useDisAppear(() => {
    GlobalAgoraConfig.current?.leaveChannel?.();
  }, []);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        return true;
      },
    );
    return () => {
      backHandler.remove();
    };
  }, []);

  useEffect(() => {
    if (isMounted.current) {
      return;
    }
    if (!defaultUsers?.video) {
      GlobalAgoraConfig.current?.muteLocalVideoStream?.();
    }
    if (!defaultUsers?.voice) {
      GlobalAgoraConfig.current?.muteLocalAudioStream?.();
    }
    isMounted.current = true;
  }, [defaultUsers?.video, defaultUsers?.voice]);

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.overlay,
          styles.gridContent,
          {top: scaledSize.moderateScale(16) + safeAreaInsets.top},
        ]}>
        <GridVideo users={user?.[0]} />
      </View>
      <PinnedVideo users={user?.[1]} />
      <View
        style={[
          styles.localControlContainer,
          {bottom: scaledSize.moderateScale(24) + getBottomSpace()},
        ]}>
        <LocalControl />
      </View>
    </View>
  );
};

export default VideoCallScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gridVideoContainer: {
    position: 'absolute',
    zIndex: 1,
  },
  localControlContainer: {
    position: 'absolute',
  },
  overlay: {
    position: 'absolute',
  },
  gridContent: {
    zIndex: 1,
    right: scaledSize.moderateScale(24),
  },
});
