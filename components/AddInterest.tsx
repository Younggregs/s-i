import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { StyleSheet, TouchableOpacity, Modal, TextInput, ActivityIndicator } from 'react-native';  
import { FloatingAction } from "react-native-floating-action";
import AsyncStorage from '@react-native-async-storage/async-storage';
import PlayerComponent from './PlayerComponent';

import { Text, View } from './Themed';

import youtubeRegex from './category_regexes/YoutubeRegex';
import twitterRegex from './category_regexes/TwitterRegex';
import tiktokRegex from './category_regexes/TiktokRegex';
import spotifyRegex from './category_regexes/SpotifyRegex';
import snapchatRegex from './category_regexes/SnapchatRegex';
import instagramRegex from './category_regexes/InstagramRegex';
import netflixRegex from './category_regexes/NetflixRegex';
import pinterestRegex from './category_regexes/PinterestRegex';

import * as interests from '../store/actions/interests';

var linkify = require('linkifyjs');



export default function AddInterest({ path }: { path: string }) {
  const [user, setUser] = useState({})
  const [modalVisible, setModalVisible] = useState(false);
  const [link, onChangeLink] = useState('');
  const [caption, onChangeCaption] = useState('');
  const [loaded, setLoaded] = useState(false);
  const [type, setType] = useState('')
  const [category, setCategory] = useState('')
  const [errorMessage, setErrorMessage] = useState(false)
  const [youtubeId, setYoutubeId] = useState('')
  const categories = useSelector(state => state.interest.allCategories);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const dispatch = useDispatch();

  useEffect(() => {
    const getData = async () => {
      try {
        const user = await AsyncStorage.getItem('user')
        if(user !== null) {
          setUser(user)
        }
      } catch(e) {
        // error reading value
      }
      
    }
    getData()
  }, [dispatch])

  const add = async () => {
    setIsLoading(true)
    setErrorMessage(false)
    if(link.length <= 0){
      setError('Link can not be empty')
      setErrorMessage(true)
    } 
    else if(link.length >= 256){
      setError('Link/Text can not be more than 256 characters')
      setErrorMessage(true)
    }
    else if(caption.length <= 0){
      setError('Caption can not be empty')
      setErrorMessage(true)
    }else if(caption.length >= 256){
      setError('Caption can not be more than 256 characters')
      setErrorMessage(true)
    }else{
      try {
        const interestCategory = categories.find((item: { name: any; }) => item.name === category);
        const interestObject = {
          'id': Math.random().toString(36).substring(2, 15),
          'link_text': link,
          'caption': caption,
          'account':  {
            profileImage: '',
            phone: '',
            name: 'Me'
          },
          'category':  {
              id: interestCategory.id,
              name: interestCategory.name, 
              slug: interestCategory.slug,
              active: false
          },
          'type': type,
          'interesting': false,
          'created_at': new Date(),
          'mine': true
        }
        const res = await dispatch(interests.addInterest(interestObject));
        if(res.error_message){
          setError(res.res_message)
          setErrorMessage(true)
        }else{
          setModalVisible(false)
        }
        
        onChangeCaption('')
        onChangeLink('')
      } catch (err) {
          setError(err.message);
      }
    }
    setIsLoading(false)
  }

  const determineLinkCategory = async () => {
    if(link.length > 0){
      const data = linkify.find(link)
      if(Object.keys(data).length > 0){
        let res = youtubeRegex(link)
        setType('url')
        if(res){
          setCategory('YouTube')
          setYoutubeId(res)
        }
        else if(tiktokRegex(link)){
          setCategory('Tiktok')
        }
        else if(twitterRegex(link)){
          setCategory('Twitter')
        }
        else if(spotifyRegex(link)){
          setCategory('Spotify')
        }
        else if(instagramRegex(link)){
          setCategory('Instagram')
        }
        else if(snapchatRegex(link)){
          setCategory('Snapchat')
        }
        else if(netflixRegex(link)){
          setCategory('Netflix')
        }
        else if(pinterestRegex(link)){
          setCategory('Pinterest')
        }
        
        else{
          setCategory('Others')
        }
      }else{
        setCategory('Others')
        setType('text')
      }
    }
    
  }

  return (
  <View style={styles.container}>
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(!modalVisible);
      }}
    >
    <View style={styles.centeredView}>
      <View style={styles.modalView}>
          <Text style={styles.categoryText}>Share Interest</Text>
          <TextInput
              style={styles.input}
              placeholderTextColor='white'
              onChangeText={(value) => onChangeLink(value)}
              onEndEditing={() => determineLinkCategory()}
              placeholder="Link"
              value={link}
          />
          <TextInput
              style={styles.input}
              placeholderTextColor='white'
              onChangeText={(value) => onChangeCaption(value)}
              placeholder="Caption"
              value={caption}
          />

          <View style={styles.previewView}>
              <Text style={styles.previewText}>{category && link  && ( `Preview (${category})`)}</Text>
          </View>
          
          {link ? (
            <View style={styles.preview}>
              <View style={styles.caption}> 
                  <Text style={styles.captionText}>{caption}</Text>
              </View>
              <View style={styles.previewBody}>
                <PlayerComponent item={{link_text: link, category: {slug: category.toLowerCase()}, type: type, preview: true}}/>
              </View>
            </View>
          ): (
            <View />
          )}

          {errorMessage && <Text style={{color: '#ff0000'}}>{error}</Text>}

          {isLoading ? (
                <TouchableOpacity
                style={styles.button}
            >
              <ActivityIndicator color="#fff" />
          </TouchableOpacity>
          ) : (
          
          <TouchableOpacity
              style={[styles.button, styles.buttonClose]}
              onPress={() => add()}
          >
              <Text style={styles.textStyle}>Share</Text>
          </TouchableOpacity>
          )}

          <TouchableOpacity
              style={[styles.button, styles.buttonClose, styles.buttonCancel]}
              onPress={() => setModalVisible(false)}
          >
              <Text style={styles.textStyle}>Cancel</Text>
          </TouchableOpacity>
      </View>
    </View>
    </Modal>
    <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
      <FloatingAction
        showBackground={false}
        onPressMain={() => setModalVisible(true)}
      />
    </TouchableOpacity>
    </View>
  );
}


const styles = StyleSheet.create({
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent'
  },
  itemView: {
    height: 150,
    alignItems: 'center',
    justifyContent: 'center'
  },
  fab: {
    flex: 1,
    height: 100,
    width: 100,
    backgroundColor: 'transparent',
  },
  caption: {
    flex: 2,
    width: '100%',
    backgroundColor: '#373737',
  },
  previewBody:{
    flex: 8,
    width: '100%',
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  previewView: {
    marginTop: 20,
  },
  previewText: {
    fontWeight: 'bold'
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightContainer: {
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 17,
    lineHeight: 24,
    textAlign: 'center',
  },
  helpContainer: {
    marginTop: 15,
    marginHorizontal: 20,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
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
  bottomContainer: {
    width: '100%',
    borderTopColor: '#fff',
    borderWidth: 2,
    borderStyle: 'solid',
    flexDirection: 'row'
  },
  labelContainer: {
    flex: 8
  },
  iconContainer: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center'
  },
  icon: {
    width: 30,
    height: 30,
    backgroundColor: '#fff'
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: 'rgba(0, 0, 0, 0.7)'
  },
  modalView: {
    margin: 20,
    borderRadius: 20,
    padding: 35,
    width: '100%',
    backgroundColor: 'transparent',
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
    borderWidth: 2,
    borderStyle: 'solid',
    height: 40,
    width: '100%',
    marginTop: 20,
    borderRadius: 10,
  },
  buttonCancel: {
    backgroundColor: '#000',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#fff',
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  },
  captionText: {
    fontSize: 15,
    paddingHorizontal: 20,
    paddingVertical: 10
  },
  input: {
    height: 50,
    width: '100%',
    marginTop: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#373737',
    color: '#fff',
    paddingHorizontal: 20,
  },
  preview: {
    flexDirection: 'column',
    height: 200,
    width: '100%',
    marginVertical: 10,
  }
  
});

