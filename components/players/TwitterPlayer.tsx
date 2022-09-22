import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet,TouchableNativeFeedback } from 'react-native';
import { useDispatch } from 'react-redux';
import * as Linking from 'expo-linking';

import { Text, View } from '../Themed';
import * as interests from '../../store/actions/interests';

export default function TwitterPlayer({id, link_text, preview}) {

    const [tweet, setTweet] = useState({})
    const [isLoading, setIsLoading] = useState(false)

    const dispatch = useDispatch();

    const fetchTweet = useCallback(async () => {
        setIsLoading(true)
        try {
            if(preview){
                const res = await dispatch(interests.fetchTweetPreview(link_text));
                setTweet(res)
            }else{
                const res = await dispatch(interests.fetchTweet(id));
                setTweet(res)
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
    
    return (
        <View style={styles.itemView}>
            {isLoading ? (
                <View>
                  <Text style={styles.loadingText}>Loading...</Text>
                </View>
            ): (
                <TouchableNativeFeedback onPress={() => Linking.openURL(link_text)}>
                    <Text>{tweet.tweet}</Text>
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
});
