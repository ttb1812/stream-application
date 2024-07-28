import React from 'react';
import {StyleSheet, View} from 'react-native';
import {RenderModeType, RtcSurfaceView} from 'react-native-agora';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {UserJoinedChannel} from '../../../utils/global-types';
import {scaledSize} from '../../../utils';

const GridVideo = ({users}: {users: UserJoinedChannel.IUser}) => {
  if (users?.video) {
    return (
      <RtcSurfaceView
        style={styles.videoContent}
        canvas={{renderMode: RenderModeType.RenderModeFit, uid: 0}}
        zOrderMediaOverlay={true}
      />
    );
  } else {
    return (
      <View style={[styles.videoContent, styles.muteContent]}>
        <Ionicons
          name="videocam-off"
          size={scaledSize.moderateScale(24)}
          color="#FFFF"
        />
      </View>
    );
  }
};

export default GridVideo;

const styles = StyleSheet.create({
  muteContent: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#6D696A',
  },
  videoContent: {
    width: scaledSize.scale(90),
    height: scaledSize.verticalScale(112),
  },
});
