import React, {memo, useCallback, useState} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useDispatch, useSelector} from 'react-redux';
import {GlobalAgoraConfig} from '../../common/agora-config';
import {
  getUsersJoinedChannel,
  UserCase,
} from '../../store/reducer/user-joined-reducer';
import {scaledSize} from '../../utils';
import NavigationService from '../../utils/app-navigator';
import {ScreenName} from '../../utils/containts';

const LocalControl = () => {
  const dispatch = useDispatch();
  const users = useSelector(getUsersJoinedChannel);
  const userDefault = users?.find(user => user?.uid === 0);
  const [isVideo, setVideo] = useState(userDefault?.video);
  const [isVoice, setVoice] = useState(userDefault?.voice);

  const handledVideo = useCallback(() => {
    if (isVideo) {
      const formattedUser = users?.map(user => {
        return {
          ...user,
          video: false,
        };
      });
      GlobalAgoraConfig.current?.muteLocalVideoStream?.();
      dispatch(UserCase.setInitialUser({users: formattedUser}));
      setVideo(false);
    } else {
      const formattedUser = users?.map(user => {
        return {
          ...user,
          video: true,
        };
      });
      GlobalAgoraConfig.current?.unMuteLocalVideoStream?.();
      dispatch(UserCase.setInitialUser({users: formattedUser}));
      setVideo(true);
    }
  }, [dispatch, isVideo, users]);

  const handleEndCall = useCallback(() => {
    GlobalAgoraConfig.current?.leaveChannel?.();
    NavigationService.navigate(ScreenName.homeScreen);
  }, []);

  const handleVoice = useCallback(() => {
    if (isVoice) {
      const formattedUser = users?.map(user => {
        return {
          ...user,
          voice: false,
        };
      });
      GlobalAgoraConfig.current?.muteLocalAudioStream?.();
      dispatch(UserCase.setInitialUser({users: formattedUser}));
      setVoice(false);
    } else {
      const formattedUser = users?.map(user => {
        return {
          ...user,
          voice: true,
        };
      });
      GlobalAgoraConfig.current?.unMuteLocalAudioStream?.();

      dispatch(UserCase.setInitialUser({users: formattedUser}));
      setVoice(true);
    }
  }, [dispatch, isVoice, users]);

  return (
    <View style={styles.container}>
      <Pressable
        style={[styles.btnCotainer, {backgroundColor: '#6D696A'}]}
        onPress={handledVideo}>
        <Ionicons
          name={isVideo ? 'videocam' : 'videocam-off'}
          size={scaledSize.moderateScale(24)}
          color="#FFFF"
        />
      </Pressable>
      <View style={{width: scaledSize.scale(16)}} />
      <Pressable
        style={[styles.btnCotainer, {backgroundColor: '#FF5959'}]}
        onPress={handleEndCall}>
        <FontAwesome
          name="phone"
          size={scaledSize.moderateScale(28)}
          color="#FFFF"
        />
      </Pressable>
      <View style={{width: scaledSize.scale(16)}} />
      <Pressable
        style={[styles.btnCotainer, {backgroundColor: '#6D696A'}]}
        onPress={handleVoice}>
        <FontAwesome
          name={isVoice ? 'microphone' : 'microphone-slash'}
          size={scaledSize.moderateScale(24)}
          color="#FFFF"
        />
      </Pressable>
    </View>
  );
};

export default memo(LocalControl);

const styles = StyleSheet.create({
  container: {
    width: scaledSize.deviceWidth,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  btnCotainer: {
    width: scaledSize.scale(63),
    height: scaledSize.scale(63),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
    backgroundColor: '#6D696A',
  },
});
