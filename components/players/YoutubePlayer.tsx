import React, { useState, useCallback } from 'react';
import { StyleSheet, TouchableNativeFeedback, TouchableOpacity } from 'react-native';
import YoutubePlayer from "react-native-youtube-iframe";
import { Text, View } from '../Themed';
import Modal from "react-native-modal";
import UrlPreview from '../packages/UrlPreview';
import youtubeRegex from '../category_regexes/YoutubeRegex';

export default function YouTubePlayer({link_text}) {

    const [loaded, setLoaded] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
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
          {/* <Modal
              propagateSwipe={true}
              swipeDirection="down"
              onSwipeComplete={() => { setModalVisible(false) }}
              isVisible={modalVisible}
            >
              <View style={styles.container}>
                
                {/* <YoutubePlayer
                  height={350}
                  play={playing}
                  videoId={youtubeRegex(link_text)}
                  onChangeState={onStateChange}
                  onReady={() => setIsLoading(false)}
                />

                {isLoading && (
                  <View style={styles.itemView}>
                      <Text style={styles.loadingText}>Loading...</Text>
                  </View>
                )} 
              </View>
          </Modal> 
        */}

          <YoutubePlayer
            height={300}
            play={playing}
            videoId={youtubeRegex(link_text)}
            onChangeState={onStateChange}
            onReady={() => setIsLoading(false)}
          />
          {isLoading && (
            <View style={styles.itemView2}>
                <Text style={styles.loadingText}>Loading...</Text>
            </View>
          )}

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
    padding: 5
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
