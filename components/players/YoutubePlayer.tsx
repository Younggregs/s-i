import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect, useCallback } from 'react';
import { Platform, StyleSheet, TextInput, TouchableNativeFeedback, TouchableOpacity } from 'react-native';
import { Menu, MenuItem, MenuDivider } from 'react-native-material-menu';
import { useDispatch, useSelector } from 'react-redux';
import RNUrlPreview from 'react-native-url-preview';
import YoutubePlayer from "react-native-youtube-iframe";

import { Text, View } from '../Themed';
import { RootTabScreenProps } from '../../types';
import { useNavigation } from '@react-navigation/native';
import * as interests from '../../store/actions/interests';
import youtubeRegex from '../category_regexes/YoutubeRegex';

export default function YouTubePlayer({link_text}) {

    const [visible, setVisible] = useState(false);
    const [text, setText] = useState('');
    const [tweet, setTweet] = useState({})
    const [loaded, setLoaded] = useState(false);
    const navigation = useNavigation();

    const [playing, setPlaying] = useState(false);

    const onStateChange = useCallback((state) => {
        if (state === "ended") {
          setPlaying(false);
        }
    }, []);
  
    const togglePlaying = useCallback(() => {
      setPlaying((prev) => !prev);
    }, []);

    
    return (
        <View>
           {!loaded && (
                <View style={styles.itemView}>
                    <Text style={styles.loadingText}>Loading...</Text>
                </View>
              )}
              <YoutubePlayer
                height={150}
                play={playing}
                videoId={youtubeRegex(link_text)}
                onChangeState={onStateChange}
                onReady={() => setLoaded(true)}
              />
        </View>
  );
}

const styles = StyleSheet.create({
    container: { 
        flexDirection: 'row',
        backgroundColor: 'transparent',
        
    },
    itemView: {
        height: 150,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 5
      },
    separator: {
        marginVertical: 30,
        height: 1,
        width: '80%',
    },
    loadingText: {
        textAlign: 'center',
        fontSize: 15,
        fontWeight: 'bold',
        margin:5
      },
});
