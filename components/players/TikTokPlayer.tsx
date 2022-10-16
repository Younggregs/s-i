import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import UrlPreview from '../packages/UrlPreview';
import { Text, View } from '../Themed';
import Modal from "react-native-modal";
import { WebView } from 'react-native-webview';

export default function TikTokPlayer({link_text}) {
    const [loaded, setLoaded] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    
    return (
        <View style={styles.itemView}>
            <Modal
                propagateSwipe={true}
                swipeDirection="down"
                onSwipeComplete={() => { setModalVisible(false) }}
                isVisible={modalVisible}
            >
                <WebView
                    style={styles.container}
                    source={{ uri: link_text }}
                    />
            </Modal>

        <TouchableOpacity style={styles.itemView} onPress={() => setModalVisible(true)}>
           <UrlPreview 
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
        </TouchableOpacity>
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
    container: {
    flex: 1,
    marginTop: 200,
    borderColor: 'rgba(255,255,255,0.1)',
    borderStyle: "solid",
    borderWidth: 0.5,
    borderRadius: 15
    },
});
