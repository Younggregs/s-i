import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import RNUrlPreview from 'react-native-url-preview';
import { Text, View } from '../Themed';

export default function SpotifyPlayer({link_text}) {

    const [loaded, setLoaded] = useState(false);
    
    return (
        <View style={styles.itemView}>
           <RNUrlPreview 
              text={link_text}
              containerStyle={styles.itemView}
              titleStyle={{color: '#fff', fontWeight: 'bold', fontSize: 15}}
              descriptionStyle={{color: '#fff'}}
              imageStyle={{height: 140, width: 100}}
              onLoad={() => setLoaded(true)}
            />
              {!loaded && (
                <View style={styles.itemView}>
                  <Text style={styles.loadingText}>Loading...</Text>
                </View>
              )}
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
