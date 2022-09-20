import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect, useCallback } from 'react';
import { Platform, StyleSheet, TextInput, TouchableNativeFeedback, TouchableOpacity } from 'react-native';
import { Menu, MenuItem, MenuDivider } from 'react-native-material-menu';
import { useDispatch, useSelector } from 'react-redux';
import * as Linking from 'expo-linking';

import { Text, View } from '../Themed';
import { RootTabScreenProps } from '../../types';
import { useNavigation } from '@react-navigation/native';
import * as interests from '../../store/actions/interests';

export default function TwitterPlayer({id, link_text}) {

    const [visible, setVisible] = useState(false);
    const [text, setText] = useState('');
    const [tweet, setTweet] = useState({})
    const [isLoading, setIsLoading] = useState(false)
    const navigation = useNavigation();

    const dispatch = useDispatch();

    const fetchTweet = useCallback(async () => {
        setIsLoading(true)
        try {
            const res = await dispatch(interests.fetchTweet(id));
            setTweet(res)
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
