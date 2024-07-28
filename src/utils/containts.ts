export const ScreenName = {
  homeScreen: 'homeScreen',
  startReviewScreen: 'startReviewScreen',
  videoCallScreen: 'videoCallScreen',
} as const;

export const BASIC_INFO = {
  //app id from agora
  appId: '',
  //app id from agora
  token: '',
  // channel name
  channelName: 'test-channel',
  uid: 0,
};

export const EventType = {
  joinChannelSuccess: 'joinChannelSuccess',
  userJoined: 'userJoined',
  userOffline: 'userOffline',
  remoteVideoStateChanged: 'remoteVideoStateChanged',
  remoteAudioStateChanged: 'remoteAudioStateChanged',
};
