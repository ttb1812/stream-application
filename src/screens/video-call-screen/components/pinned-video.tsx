import React, {memo, useCallback, useEffect, useState} from 'react';
import {DeviceEventEmitter, StyleSheet, Text, View} from 'react-native';
import {RenderModeType, RtcSurfaceView} from 'react-native-agora';
import {EventType} from '../../../utils/containts';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {scaledSize} from '../../../utils';
import {UserJoinedChannel} from '../../../utils/global-types';

const PinnedVideo = ({users}: {users: UserJoinedChannel.IUser}) => {
  const [isMuteVideo, setMuteVideo] = useState(false);
  const [isMuteAudio, setMuteAudio] = useState(false);

  useEffect(() => {
    const evRemoteVideoStateChanged = DeviceEventEmitter.addListener(
      EventType.remoteVideoStateChanged,
      state => {
        setMuteVideo(state === 0);
      },
    );
    return evRemoteVideoStateChanged.remove;
  }, []);

  useEffect(() => {
    const evRemoteAudioStateChanged = DeviceEventEmitter.addListener(
      EventType.remoteAudioStateChanged,
      state => {
        setMuteAudio(state === 0);
      },
    );
    return evRemoteAudioStateChanged.remove;
  }, []);

  const _renderContent = useCallback(() => {
    if (!users) {
      return (
        <View style={[styles.container, styles.emtyView]}>
          <Text>Stream chưa bắt đầu</Text>
        </View>
      );
    }
    if (users) {
      if (isMuteVideo) {
        return (
          <View style={[styles.container, styles.emtyView]}>
            <Ionicons
              name="videocam-off"
              size={scaledSize.moderateScale(80)}
              color="#333"
            />
          </View>
        );
      }
      return (
        <RtcSurfaceView
          style={styles.container}
          canvas={{renderMode: RenderModeType.RenderModeFit, uid: users.uid}}
          zOrderMediaOverlay={false}
        />
      );
    }
  }, [isMuteVideo, users]);

  return <>{_renderContent()}</>;
};

export default memo(PinnedVideo);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emtyView: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
