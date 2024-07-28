import React, {memo, useCallback} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {GlobalAgoraConfig} from '../../common/agora-config';
import {scaledSize} from '../../utils';
import NavigationService from '../../utils/app-navigator';
import {ScreenName} from '../../utils/containts';

const HomeScreen = () => {
  const onStart = useCallback(() => {
    GlobalAgoraConfig.current?.startReview?.();
    NavigationService.navigate(ScreenName.startReviewScreen);
  }, []);

  return (
    <View style={styles.container}>
      <Pressable onPress={onStart} style={styles.button}>
        <Text style={styles.textBtn}>Channel 1</Text>
      </Pressable>
    </View>
  );
};

export default memo(HomeScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: scaledSize.moderateScale(16),
  },
  button: {
    backgroundColor: '#6D696A',
    padding: scaledSize.moderateScale(16),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: Number.MAX_SAFE_INTEGER,
  },
  textBtn: {
    color: '#ffffff',
  },
});
