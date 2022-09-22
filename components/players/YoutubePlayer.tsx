import React, { useState, useCallback } from 'react';
import { StyleSheet } from 'react-native';
import YoutubePlayer from "react-native-youtube-iframe";
import { Text, View } from '../Themed';
import youtubeRegex from '../category_regexes/YoutubeRegex';

export default function YouTubePlayer({link_text}) {

    const [loaded, setLoaded] = useState(false);

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
    itemView: {
        height: 150,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 5
      },
    loadingText: {
        textAlign: 'center',
        fontSize: 15,
        fontWeight: 'bold',
        margin:5
      },
});
