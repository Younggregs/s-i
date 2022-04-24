import { StatusBar } from 'expo-status-bar';
import { FontAwesome } from '@expo/vector-icons';
import React, { useState, useCallback } from 'react';
import { Platform, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { Menu, MenuItem, MenuDivider } from 'react-native-material-menu';
import { useDispatch, useSelector } from 'react-redux';

import RNUrlPreview from 'react-native-url-preview';
import YoutubePlayer from "react-native-youtube-iframe";

import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';

import { Text, View } from '../components/Themed';
import ShareComponent from './Share';
import { RootTabScreenProps } from '../types';
import { useNavigation } from '@react-navigation/native';

import youtubeRegex from './category_regexes/YoutubeRegex';
import * as interests from '../store/actions/interests';

export default function InterestComponent(props: any) {
    const colorScheme = useColorScheme();
    const [playing, setPlaying] = useState(false);
    const [visible, setVisible] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const hideMenu = () => setVisible(false);
    const showMenu = () => setVisible(true);

    const navigation = useNavigation();

    const dispatch = useDispatch();

    const toggleInterest = useCallback(async (id) => {

      try {
          await dispatch(interests.toggleInterest(id));
      } catch (err) {
      }
    }, [dispatch])

    const onStateChange = useCallback((state) => {
        if (state === "ended") {
          setPlaying(false);
        }
      }, []);
    
      const togglePlaying = useCallback(() => {
        setPlaying((prev) => !prev);
      }, []);
    
    return (
        <View key={props.item.id} style={styles.interestContainer} lightColor="#eee" darkColor="rgba(255,255,255,0.1)">
        <View style={styles.captionView}>
            <Text style={styles.caption}>{props.item.caption}</Text>
        </View>
        <View style={styles.bodyView}>
          
          {props.item.category.name === 'YouTube' && (
            <>
              {!loaded && (
                <View style={styles.itemView}>
                    <Text style={styles.categoryText}>Loading...</Text>
                </View>
              )}
              <YoutubePlayer
                height={150}
                play={playing}
                videoId={youtubeRegex(props.item.link)}
                onChangeState={onStateChange}
                onReady={() => setLoaded(true)}
              />
            </>
          )}
          
          {props.item.category.name.length > 0 && props.item.type === 'url' && (
            <>
            <RNUrlPreview 
              text={props.item.link}
              containerStyle={styles.itemView}
              titleStyle={{color: '#fff', fontWeight: 'bold', fontSize: 15}}
              descriptionStyle={{color: '#fff'}}
              imageStyle={{height: 140, width: 100}}
              onLoad={() => setLoaded(true)}
            />
              {!loaded && (
                <View style={styles.itemView}>
                  <Text style={styles.categoryText}>Loading...</Text>
                </View>
              )}
            </>
            
          )}

          {props.item.category.name.length > 0 && props.item.type === 'text' && (
            <View style={styles.itemView}>
              <Text style={styles.categoryText}>{props.item.link && props.item.link}</Text>
            </View>
            
          )}
        </View>
        <View style={styles.footerView}>
            <View style={styles.nameView}>
              <View style={styles.profileImageView}></View>
              <Text style={styles.nameText}>{props.item.user.name}</Text>
            </View>
            <TouchableOpacity
              onPress={() => toggleInterest(props.item.id)} 
              style={[styles.interactionsView, props.item.interesting && styles.activeInteractionsView]}
            >
              <Text style={styles.interactionsText}>Interesting</Text>
            </TouchableOpacity>
            <View style={styles.shareView}>
              <ShareComponent />
            </View>
            <Menu
                visible={visible}
                anchor={<TouchableOpacity onPress={showMenu} style={styles.optionsView}>
                  <FontAwesome
                      name="ellipsis-h"
                      size={20}
                      color={Colors[colorScheme].text}
                    />
                </TouchableOpacity>}
                onRequestClose={hideMenu}
            >
                <MenuItem  onPress={() => navigation.navigate('ProfileModal')}>Replicate</MenuItem>
                <MenuDivider />
                <MenuItem onPress={() => navigation.navigate('SettingsModal')}>Delete</MenuItem>
            </Menu>
        </View>
      </View>
  );
}

const styles = StyleSheet.create({
    container: { 
        flexDirection: 'row',
        backgroundColor: 'transparent'
    },
    itemView: {
      height: 150,
      alignItems: 'center',
      justifyContent: 'center'
    },
    separator: {
        marginVertical: 30,
        height: 1,
        width: '80%',
    },
    contentContainer: {
        flex: 1, // pushes the footer to the end of the screen
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    categoryText: {
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold',
        margin:5
    },
    interestContainer: {
        borderColor: 'rgba(255,255,255,0.1)',
        borderWidth: 0.5,
        borderStyle: 'solid',
        height: 250,
        width: '100%',
        borderRadius: 5,
        marginTop: 10,
    },
    fab: {
        height: 100,
        width: 100,
        backgroundColor: 'transparent',
        position: 'absolute',
        bottom: 70,
        right: 0
    },
    captionView: {
        borderColor: 'rgba(255,255,255,0.1)',
        borderStyle: "solid",
        borderBottomWidth: 0.5,
        paddingVertical: 10,
        paddingHorizontal: 10,
        backgroundColor: 'transparent',
    },
    caption: {
        color: '#fff',
        fontSize: 15,
    },
    bodyView: {
        borderColor: 'rgba(255,255,255,0.1)',
        borderStyle: "solid",
        borderBottomWidth: 0.5,
        height: 150
    },
    icon: {
        width: 30,
        height: 30,
        borderColor: '#fff',
        borderStyle: "solid",
        borderWidth: 0.5,
    },
    footerView: {
        flexDirection: 'row',
        paddingVertical: 10,
        paddingHorizontal: 10,
        backgroundColor: 'transparent',
    },
    interactionsView: {
        flex: 3,
        backgroundColor: 'transparent',
        borderColor: 'rgba(255,255,255,0.1)',
        borderStyle: "solid",
        borderWidth: 0.5,
        marginHorizontal: 5,
        padding: 5,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 3
    },
    shareView: {
      flex: 2,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'transparent'
    },
    optionsView: {
      flex: 2,
      alignItems: 'center',
      justifyContent: 'center',
    },
    activeInteractionsView: {
      backgroundColor: '#4169E1',
    },
    interactionsText: {
        fontSize: 15,
        fontWeight: 'bold'
    },
    nameView: {
        flex: 6,
        backgroundColor: 'transparent',
        alignItems: 'center',
        flexDirection: 'row',
    },
    nameText: {
        fontSize: 12,
        fontWeight: 'bold'
    },
    profileImageView:{
        borderColor: '#fff',
        borderStyle: "solid",
        borderWidth: 0.5,
        height: 20,
        width: 20,
        borderRadius: 10,
        marginRight: 5
    }
});
