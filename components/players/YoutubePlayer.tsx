import React, { useState, useCallback } from 'react';
import { StyleSheet } from 'react-native';
import YoutubePlayer from "react-native-youtube-iframe";
import { Text, View } from '../Themed';
import youtubeRegex from '../category_regexes/YoutubeRegex';

export default function YouTubePlayer({link_text}) {
    const [isLoading, setIsLoading] = useState(true);
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
        <View style={styles.itemView}>
          
          {isLoading && (
            <View style={styles.itemView2}>
                <Text style={styles.loadingText}>Loading...</Text>
            </View>
          )}

          <YoutubePlayer
            height={300}
            play={playing}
            videoId={youtubeRegex(link_text)}
            onChangeState={onStateChange}
            onReady={() => setIsLoading(false)}
          />
          

        </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 200,
    borderColor: 'rgba(255,255,255,0.1)',
    borderStyle: "solid",
    borderWidth: 0.5,
    borderRadius: 15
  },
  itemView: {
    height: 220,
  },
  itemView2: {
    height: 220,
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
