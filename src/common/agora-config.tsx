import React, {
  createRef,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import createAgoraRtcEngine, {
  ChannelProfileType,
  ClientRoleType,
  IRtcEngine,
} from 'react-native-agora';
import {BASIC_INFO, EventType} from '../utils/containts';
import {getPermission} from '../utils/permissions';
import {DeviceEventEmitter} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {
  getUsersJoinedChannel,
  UserCase,
} from '../store/reducer/user-joined-reducer';

interface IChannelInfo {
  token?: string;
  channelName?: string;
  uid?: number;
}

export interface AgoraConfigRef {
  startReview?: () => void;
  stopReview?: () => void;
  muteLocalVideoStream?: () => void;
  unMuteLocalVideoStream?: () => void;
  muteLocalAudioStream?: () => void;
  unMuteLocalAudioStream?: () => void;
  joinChannel?: (channelInfo: IChannelInfo) => void;
  leaveChannel?: () => void;
}
const AgoraConfig = (props: any, ref: React.Ref<unknown> | undefined) => {
  const agoraEngineRef = useRef<IRtcEngine>();
  const user = useSelector(getUsersJoinedChannel);

  const dispatch = useDispatch();
  const [isJoined, setIsJoined] = useState(false);

  const setupVideoSDKEngine = async () => {
    try {
      await getPermission();
      agoraEngineRef.current = createAgoraRtcEngine();
      const agoraEngine = agoraEngineRef.current;
      // Register event callbacks
      agoraEngine.registerEventHandler({
        onJoinChannelSuccess: () => {
          console.log('Successfully joined the channel: ');
          DeviceEventEmitter.emit(EventType.joinChannelSuccess);
          setIsJoined(true);
        },
        onUserJoined: (_connection, Uid) => {
          const newUser = {
            uid: Uid,
            voice: true,
            video: true,
            streamType: 'low',
          };
          dispatch(UserCase.setUserJoinedChanel({user: newUser}));
          DeviceEventEmitter.emit(EventType.userJoined);
        },
        onUserOffline: (_connection, Uid) => {
          const newUsers = user?.filter(value => value?.uid !== Uid);
          console.log('Remote user ' + Uid + ' has left the channel');
          dispatch(UserCase.setInitialUser({users: newUsers}));
          DeviceEventEmitter.emit(EventType.userOffline);
        },
        // handle event when remote video change
        onRemoteVideoStateChanged: (_connection, remoteUid, state) => {
          DeviceEventEmitter.emit(EventType.remoteVideoStateChanged, state);
        },
        // handle event when remote voice change
        onRemoteAudioStateChanged(connection, remoteUid, state) {
          DeviceEventEmitter.emit(EventType.remoteAudioStateChanged, state);
        },
      });
      // Initialize the engine
      agoraEngine.initialize({
        appId: BASIC_INFO.appId,
      });
    } catch (e) {
      console.log(e);
    }
  };

  const handleStartReview = useCallback(async () => {
    await agoraEngineRef.current?.enableVideo();
    await agoraEngineRef.current?.startPreview();
  }, []);

  const handleStopReview = useCallback(() => {
    agoraEngineRef.current?.stopPreview();
  }, []);

  const handleMuteLocalVideoStream = useCallback(() => {
    agoraEngineRef.current?.muteLocalVideoStream(true);
  }, []);

  const handleUnMuteLocalVideoStream = useCallback(() => {
    agoraEngineRef.current?.muteLocalVideoStream(false);
  }, []);

  const handleJoinChannel = useCallback(
    (channelInfo: IChannelInfo) => {
      if (isJoined) {
        return;
      }
      try {
        // Set the channel profile type to ChannelProfileCommunication after joining the channel
        agoraEngineRef.current?.setChannelProfile(
          ChannelProfileType.ChannelProfileCommunication,
        );
        // Call the joinChannel method to join the channel
        agoraEngineRef.current?.joinChannel(
          channelInfo?.token ?? '',
          channelInfo?.channelName ?? '',
          channelInfo?.uid ?? 0,
          {
            // Set the user role to broadcaster
            clientRoleType: ClientRoleType.ClientRoleBroadcaster,
          },
        );
      } catch (e) {
        console.log(e);
      }
    },
    [isJoined],
  );

  const handleLeaveChannel = useCallback(() => {
    agoraEngineRef.current?.leaveChannel();
    setIsJoined(false);
  }, []);

  const handleMuteLocalAudioStream = useCallback(() => {
    agoraEngineRef.current?.muteLocalAudioStream(true);
  }, []);

  const handleUnMuteLocalAudioStream = useCallback(() => {
    agoraEngineRef.current?.muteLocalVideoStream(false);
  }, []);

  useEffect(() => {
    setupVideoSDKEngine();
  });

  useImperativeHandle(
    ref,
    () => {
      return {
        startReview: () => {
          handleStartReview();
        },
        stopReview: () => {
          handleStopReview();
        },
        muteLocalVideoStream: () => {
          handleMuteLocalVideoStream();
        },
        unMuteLocalVideoStream: () => {
          handleUnMuteLocalVideoStream();
        },
        muteLocalAudioStream: () => {
          handleMuteLocalAudioStream();
        },
        unMuteLocalAudioStream: () => {
          handleUnMuteLocalAudioStream();
        },
        joinChannel: (channelInfo: IChannelInfo) => {
          handleJoinChannel(channelInfo);
        },
        leaveChannel: () => {
          handleLeaveChannel();
        },
      };
    },
    [
      handleJoinChannel,
      handleLeaveChannel,
      handleMuteLocalAudioStream,
      handleMuteLocalVideoStream,
      handleStartReview,
      handleStopReview,
      handleUnMuteLocalAudioStream,
      handleUnMuteLocalVideoStream,
    ],
  );

  return <></>;
};

export const GlobalAgoraConfig = createRef<AgoraConfigRef>();

export default forwardRef(AgoraConfig);
