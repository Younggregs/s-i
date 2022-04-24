import React from 'react';
import { FontAwesome } from '@expo/vector-icons';
import { Share, Button, Touchable, TouchableOpacity } from 'react-native';
import { Text, View } from './Themed';

import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';

export default function ShareComponent(){
  const colorScheme = useColorScheme();

  const onShare = async () => {
    try {
      const result = await Share.share({
        message: 'React Native | A framework for building native apps using React',
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };
  return (
    <TouchableOpacity onPress={onShare} title="Share">
        <FontAwesome
          name="share"
          size={20}
          color={Colors[colorScheme].text}
        />
    </TouchableOpacity>
  );
};

