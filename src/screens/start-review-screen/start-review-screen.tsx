import React, {memo, useCallback, useEffect, useState} from 'react';
import {
  DeviceEventEmitter,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {RenderModeType, RtcSurfaceView} from 'react-native-agora';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useDispatch, useSelector} from 'react-redux';
import {GlobalAgoraConfig} from '../../common/agora-config';
import useDisAppear from '../../hooks/use-disappear';
import {
  getUsersJoinedChannel,
  UserCase,
} from '../../store/reducer/user-joined-reducer';
import NavigationService from '../../utils/app-navigator';
import {UserJoinedChannel} from '../../utils/global-types';
import {BASIC_INFO, EventType, ScreenName} from '../../utils/containts';
import {scaledSize} from '../../utils';

const StartReviewScreen = () => {
  const dispatch = useDispatch();
  const defaultUsers = useSelector(getUsersJoinedChannel)?.[0];
  const [isVideo, setVideo] = useState(true);
  const [isVoice, setVoice] = useState(true);

  const onJoinedChannel = useCallback(async () => {
    const newUser = [
      {...defaultUsers, voice: isVoice, video: isVideo},
    ] as UserJoinedChannel.IUser[];
    dispatch(UserCase.setInitialUser({users: newUser}));

    if (!isVideo) {
      GlobalAgoraConfig.current?.muteLocalVideoStream?.();
    }
    if (!isVoice) {
      GlobalAgoraConfig.current?.muteLocalAudioStream?.();
    }
    await GlobalAgoraConfig.current?.joinChannel?.({
      token: BASIC_INFO.token,
      channelName: BASIC_INFO.channelName,
      uid: BASIC_INFO.uid,
    });
  }, [defaultUsers, dispatch, isVideo, isVoice]);

  const _renderMuteVideoView = useCallback(() => {
    return (
      <View style={styles.videoView}>
        <Ionicons
          name="videocam-off"
          size={scaledSize.moderateScale(52)}
          color="#FFFF"
        />
      </View>
    );
  }, []);

  useEffect(() => {
    const evJoinSuccess = DeviceEventEmitter.addListener(
      EventType.joinChannelSuccess,
      () => {
        NavigationService.navigate(ScreenName.videoCallScreen);
      },
    );
    return evJoinSuccess.remove;
  }, []);

  useDisAppear(() => {
    GlobalAgoraConfig.current?.stopReview?.();
  }, []);

  const _renderLocalControls = useCallback(() => {
    return (
      <View style={styles.localControlsContainer}>
        <Pressable
          style={[styles.controlBtn, {backgroundColor: '#6D696A'}]}
          onPress={() => {
            setVideo(!isVideo);
          }}>
          <Ionicons
            name={isVideo ? 'videocam' : 'videocam-off'}
            size={scaledSize.moderateScale(24)}
            color="#FFFF"
          />
        </Pressable>
        <View style={{width: scaledSize.scale(16)}} />
        <Pressable
          style={[styles.joinBtn, {backgroundColor: '#30A77A'}]}
          onPress={onJoinedChannel}>
          <Text style={styles.joinTxt}>Tham gia</Text>
        </Pressable>
        <View style={{width: scaledSize.scale(16)}} />
        <Pressable
          style={[styles.controlBtn, {backgroundColor: '#6D696A'}]}
          onPress={() => {
            setVoice(!isVoice);
          }}>
          <FontAwesome
            name={isVoice ? 'microphone' : 'microphone-slash'}
            size={scaledSize.moderateScale(24)}
            color="#FFFF"
          />
        </Pressable>
      </View>
    );
  }, [isVideo, isVoice, onJoinedChannel]);

  return (
    <View style={{flex: 1}}>
      <View style={styles.videoContainer}>
        {isVideo ? (
          <RtcSurfaceView
            style={styles.videoView}
            canvas={{
              renderMode: RenderModeType.RenderModeFit,
              uid: BASIC_INFO.uid,
            }}
          />
        ) : (
          _renderMuteVideoView()
        )}
      </View>
      <View style={{paddingBottom: scaledSize.moderateScale(40)}}>
        {_renderLocalControls()}
      </View>
    </View>
  );
};

export default memo(StartReviewScreen);

const styles = StyleSheet.create({
  title: {
    paddingTop: scaledSize.moderateScale(32),
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoView: {
    width: scaledSize.scale(260),
    height: scaledSize.verticalScale(360),
    backgroundColor: '#6D696A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlBtn: {
    width: scaledSize.scale(63),
    height: scaledSize.verticalScale(63),
    borderRadius: Number.MAX_SAFE_INTEGER,
    justifyContent: 'center',
    alignItems: 'center',
  },
  joinBtn: {
    width: scaledSize.scale(120),
    height: scaledSize.verticalScale(63),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: scaledSize.scale(16),
  },
  localControlsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  joinTxt: {
    color: '#fff',
    fontWeight: '700',
    fontSize: scaledSize.moderateScale(16),
  },
  titleText: {
    color: '#333333',
    fontWeight: '700',
    fontSize: scaledSize.moderateScale(24),
  },
});
