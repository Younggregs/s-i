import React, { useState } from 'react';
import { StyleSheet,TouchableNativeFeedback } from 'react-native';
import Modal from "react-native-modal";
import { WebView } from 'react-native-webview';
import { useQuery } from 'react-query'

import { Text, View } from '../Themed';
import * as interests from '../../store/actions/interests';

export default function TwitterPlayer({id, link_text, preview}) {
    const [modalVisible, setModalVisible] = useState(false);

    const tweetFunction = preview ?  
    () => interests.fetch_tweet_preview_query(link_text) :
    () => interests.fetch_tweet_query(id)

    const {data, isLoading} = useQuery(
        ['player_preview', link_text, id],
        () => tweetFunction(), {
            enabled: preview
        }
    )
    
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
            {isLoading ? (
                <View>
                  <Text style={styles.loadingText}>Loading...</Text>
                </View>
            ) : (
                <TouchableNativeFeedback onPress={() => setModalVisible(true)}>
                    <Text>{data}</Text>
                </TouchableNativeFeedback>
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
    container: {
        flex: 1,
        marginTop: 200,
        borderColor: 'rgba(255,255,255,0.1)',
        borderStyle: "solid",
        borderWidth: 0.5,
        borderRadius: 15
      },
});
