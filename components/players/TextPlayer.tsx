import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import UrlPreview from '../packages/UrlPreview';
import { Text, View } from '../Themed';
import Modal from "react-native-modal";
import { WebView } from 'react-native-webview';

export default function TextPlayer({link_text, caption}) {
    const [loaded, setLoaded] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);

    function truncate(str, n){
        return (str.length > n) ? str.slice(0, n-1) + '...' : str;
      };
    
    return (
        <View style={styles.itemView}>
            <Modal
                propagateSwipe={true}
                swipeDirection="down"
                onSwipeComplete={() => { setModalVisible(false) }}
                isVisible={modalVisible}
            >
                <View style={styles.itemView2}>
                    <Text style={styles.captionText}>{caption}</Text>
                    <Text style={styles.categoryText}>
                        {link_text && link_text}
                    </Text>
                </View>
            </Modal>

        <TouchableOpacity style={styles.itemView} onPress={() => setModalVisible(true)}>
            <View style={styles.itemView}>
                <Text style={styles.categoryText}>
                    {link_text && truncate(link_text, 75)}
                </Text>
            </View>
        </TouchableOpacity>
        </View>
  );
}

const styles = StyleSheet.create({
    itemView: {
        height: 150,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 5,
      },
    itemView2: {
        minHeight: 350,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 5,
        borderColor: 'rgba(255,255,255,0.1)',
        borderStyle: "solid",
        borderWidth: 0.5,
        borderRadius: 15
      },
    loadingText: {
        fontSize: 15,
        fontWeight: 'bold',
        margin:5
    },
    categoryText: {
        fontSize: 18,
    },
    captionText:{
        fontSize: 20,
        fontWeight: 'bold'
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
