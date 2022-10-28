import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet,TouchableNativeFeedback, Linking } from 'react-native';
import { useDispatch } from 'react-redux';
import Modal from "react-native-modal";
import { WebView } from 'react-native-webview';

import { Text, View } from '../Themed';
import * as interests from '../../store/actions/interests';

export default function TwitterPlayer({id, link_text, preview}) {
    const [modalVisible, setModalVisible] = useState(false);
    const [tweet, setTweet] = useState()


    // const {data, isLoading} = useQuery(
    //     ['player_preview', link_text],
    //     () => interests.fetch_preview_query(link_text))
  
    //   console.log('request: ', data?.images[0], data?.title)

    const [isLoading, setIsLoading] = useState(false)

    const dispatch = useDispatch();

    const fetchTweet = useCallback(async () => {
        setIsLoading(true)
        try {
            if(preview){
                const res = await dispatch(interests.fetchTweetPreview(link_text));
                setTweet(res[0].text)
            }else{
                const res = await dispatch(interests.fetchTweet(id));
                setTweet(res.tweet)
            }
            
        } catch (err) {}
        setIsLoading(false)
    }, [dispatch])

    useEffect(() => {
        fetchTweet()
        .then(() => {
            setIsLoading(false);
        });
    },[dispatch, fetchTweet])

    // onPress={() => Linking.openURL(link_text)}
    
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
            ): (
                <TouchableNativeFeedback onPress={() => setModalVisible(true)}>
                    <Text>{tweet}</Text>
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
