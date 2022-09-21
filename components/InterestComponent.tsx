import { StatusBar } from 'expo-status-bar';
import { FontAwesome } from '@expo/vector-icons';
import React, { useState, useCallback, useEffect } from 'react';
import { Platform, StyleSheet, Linking, Image, Modal, TouchableOpacity } from 'react-native';
import { Menu, MenuItem, MenuDivider } from 'react-native-material-menu';
import { useDispatch, useSelector } from 'react-redux';
import * as Clipboard from 'expo-clipboard';
import Toast from 'react-native-root-toast';
import TimeAgo from 'react-native-timeago';
import AsyncStorage from '@react-native-async-storage/async-storage';

import RNUrlPreview from 'react-native-url-preview';
import YoutubePlayer from "react-native-youtube-iframe";
import TwitterPlayer from './players/TwitterPlayer';
import OthersPlayer from './players/OthersPlayer';
import TextPlayer from './players/TextPlayer';
import YouTubePlayer from './players/YoutubePlayer';

import InterestingList from './InterestingList';
import InterestViews from './InterestViews'; 


import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';

import { Text, View } from '../components/Themed';
import onShare from './Share';
import { RootTabScreenProps } from '../types';
import { useNavigation } from '@react-navigation/native';

import youtubeRegex from './category_regexes/YoutubeRegex';
import * as interests from '../store/actions/interests';

import whatsapp from '../assets/images/category-icons/whatsapp.png'


export default function InterestComponent(props: any) {
    const colorScheme = useColorScheme();
    const [playing, setPlaying] = useState(false);
    const [visible, setVisible] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [user, setUser] = useState({});
    const [hide, setHide] = useState(false)
    const hideMenu = () => setVisible(false);
    const showMenu = () => setVisible(true);

    const navigation = useNavigation();

    const dispatch = useDispatch();
    const time = props.item.created_at

    useEffect(() => {
      if(props.item.time_remaining <= 60000){
        setTimeout(function hideToast() {
          setHide(true)
        }, props.item.time_remaining);
      }
    })

    useEffect(() => {
      const getUser = async () =>{
        let user = await AsyncStorage.getItem('user')
        user = JSON.parse(user)
        setUser(user)
      }
      getUser()
    }, [dispatch, setUser])

    const toggleInterest = useCallback(async (id) => {
      try {
          const res = await dispatch(interests.toggleInterest(id));
      } catch (err) {
      }
    }, [dispatch])

    const interestingList = useCallback(async () => {
      try {
         await dispatch(interests.InterestingList(props.item.id));
      } catch (err) {
      }
    }, [dispatch])


    const openWhatsApp = () => {
      let msg = 'Caption: ' + 
        props.item.caption + '\n\n' + 
        props.item.link_text + '\n\nMy Comment:';
      let mobile = props.item.account.phone;
     
      let url =
        "whatsapp://send?text=" +
        msg +
        "&phone=" +
        mobile;
      Linking.openURL(url)
        .then(data => {
          // console.log("WhatsApp Opened successfully " + data);
        })
        .catch(() => {
          alert("Make sure WhatsApp is installed on your device");
        });  
    };

    const copyToClipboard = () => {
      Clipboard.setString(props.item.link_text);
      let toast = Toast.show('Copied to clipboard', {
        duration: Toast.durations.LONG,
      });
      
      // You can manually hide the Toast, or it will automatically disappear after a `duration` ms timeout.
      setTimeout(function hideToast() {
        Toast.hide(toast);
      }, 1000);
    };

    const deleteInterest = useCallback(async (id) => {
      try {
          await dispatch(interests.deleteInterest(id));
      } catch (err) {
      }
    }, [dispatch])
    
    return (
      <>
      {hide ? (<View />) : (
        <View key={props.item.id} style={styles.interestContainer} lightColor="#eee" darkColor="rgba(255,255,255,0.1)">
        <View style={styles.captionView}>
            <Text style={styles.caption}>{props.item.caption}</Text>
            <Text style={styles.timer}>
               <TimeAgo time={time} interval={20000} hideAgo={true} />
            </Text>
        </View>
        <View style={styles.bodyView}>

          {props.item.category.slug === 'youtube' && props.item.type === 'url' && (
            <OthersPlayer link_text={props.item.link_text} />
          )}

          {props.item.category.slug === 'spotify' && props.item.type === 'url' && (
            <OthersPlayer link_text={props.item.link_text} />
          )}

          {props.item.category.slug === 'twitter' && props.item.type === 'url' && (
            <TwitterPlayer id={props.item.id} link_text={props.item.link_text}/>
          )}

          {props.item.category.slug === 'instagram' && props.item.type === 'url' && (
            <OthersPlayer link_text={props.item.link_text} />
          )}

          {props.item.category.slug === 'tiktok' && props.item.type === 'url' && (
            <OthersPlayer link_text={props.item.link_text} />
          )}

          {props.item.category.slug === 'snapchat' && props.item.type === 'url' && (
            <OthersPlayer link_text={props.item.link_text} />
          )}

          {props.item.category.slug === 'pinterest' && props.item.type === 'url' && (
            <OthersPlayer link_text={props.item.link_text} />
          )}

          {props.item.category.slug === 'netflix' && props.item.type === 'url' && (
            <OthersPlayer link_text={props.item.link_text} />
          )}
          
          {props.item.category.slug === 'others' && props.item.type === 'url' && (
            <OthersPlayer link_text={props.item.link_text} />
          )}

          {props.item.category.slug === 'others' && props.item.type === 'text' && (
            <TextPlayer link_text={props.item.link_text}/>
          )}
        </View>
        <View style={styles.footerView}>
          {props.item.mine ? (
            <>
              <InterestingList id={props.item.id}/>
              <InterestViews id={props.item.id} />
            </>
          ): (
            <>
              <TouchableOpacity 
              onPress={() => {
                  user.phone_id == props.item.account.phone ? (
                    navigation.navigate('MyProfile')
                  ): (
                    navigation.navigate('ProfileModal', {item: props.item.account})
                  )
                }
              } 
              style={styles.nameView}>
              <View style={styles.profileImageView}>
                <Text style={styles.profileText}>{props.item.account.name.substring(0, 1)}</Text>
              </View>
              <Text style={styles.nameText}>{props.item.account.name}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => toggleInterest(props.item.id)} 
              style={[styles.interactionsView, props.item.interesting && styles.activeInteractionsView]}
            >
              <Text style={styles.interactionsText}>Interesting</Text>
            </TouchableOpacity>
            </>
          )}
            
            <View style={styles.shareView}>
                <TouchableOpacity 
                  onPress={() => 
                    onShare(
                    `${props.item.link_text} \n\n${props.item.caption}`
                    )
                  } 
                >
                  <FontAwesome
                    name="share"
                    size={20}
                    color={Colors[colorScheme].text}
                  />
                </TouchableOpacity>
            </View>
            <Menu
                style={styles.menu}
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
            {!props.item.mine ? (
              <MenuItem onPress={() => openWhatsApp()} textStyle={styles.menuText}>
                Comment
                <Image source={whatsapp} style={{ width: 20, height: 20 }} />
              </MenuItem>
              ): <View />}
              <MenuDivider color='#fff'/>
              <MenuItem textStyle={styles.menuText}  onPress={() => copyToClipboard()}>
                Copy
              </MenuItem>
              <MenuDivider color='#fff'/>
              {props.item.mine ? (
                <MenuItem textStyle={styles.menuText}  onPress={() => deleteInterest(props.item.id)}>
                  Delete
                </MenuItem>
              ): <View />}
              
            </Menu>
        </View>
      </View>
      )}
    </>
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
    menuText: {
      color: '#fff'
    },
    menu: {
      backgroundColor: '#000'
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
    loadingText: {
      textAlign: 'center',
      fontSize: 15,
      fontWeight: 'bold',
      margin:5
    },
    interestContainer: {
        borderColor: 'rgba(255,255,255,0.1)',
        borderWidth: 0.5,
        borderStyle: 'solid',
        minHeight: 250,
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
        flexDirection: 'row'
    },
    caption: {
        color: '#fff',
        fontSize: 15,
        flex: 10
    },
    timer: {
      color: '#fff',
      fontSize: 15,
      flex: 3
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
        borderColor: '#4169E1',
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
        marginRight: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    profileText: {
      fontSize: 10,
      color: '#fff',
      fontWeight:'bold'
    }
});
