import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { StyleSheet, TouchableOpacity, Modal, Image, Pressable, ScrollView } from 'react-native';

import Colors from '../constants/Colors';
import { Text, View } from './Themed';

import * as interests from '../store/actions/interests';

import spotify from '../assets/images/category-icons/spotify.png'
import youtube from '../assets/images/category-icons/youtube.png'
import pinterest from '../assets/images/category-icons/pinterest.png'
import instagram from '../assets/images/category-icons/instagram.png'
import netflix from '../assets/images/category-icons/netflix.png'
import snapchat from '../assets/images/category-icons/snapchat.png'
import tiktok from '../assets/images/category-icons/tik-tok.png'
import twitter from '../assets/images/category-icons/twitter.png'
import globe from '../assets/images/category-icons/globe.png'

export default function InterestCategorySwitch({ path }: { path: string }) {
  const [modalVisible, setModalVisible] = useState(false);
  const activeCategory = useSelector(state => state.interest.allCategories.find(category => category.active === true))
  const categories = useSelector(state => state.interest.allCategories);
  const categoriesLength = Object.keys(categories).length;

  const categoryIndex = categories.findIndex(category => category.active === true);
  const previousIndex = categoryIndex === 0 ? categoriesLength - 1 : categoryIndex - 1;
  const nextIndex = categoryIndex === categoriesLength - 1 ? 0 : categoryIndex + 1;

  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState('');

  const dispatch = useDispatch();

  const loadCategories = useCallback(async () => {
    setError('');
    setIsRefreshing(true);
    try {
        await dispatch(interests.fetchCategories());
    } catch (err) {
        setError(err.message);
    }
    setIsRefreshing(false);
  }, [dispatch, setIsLoading, setError])

  const selectCategory = useCallback(async (categoryId) => {
    setError('');
    setIsRefreshing(true);
    try {
        await dispatch(interests.selectCategory(categoryId));
    } catch (err) {
        setError(err.message);
    }
    setIsRefreshing(false);
  }, [dispatch, setIsLoading, setError])

  // Previous
  const selectPreviousCategory = useCallback(async (previousIndex) => {
    setError('');
    setIsRefreshing(true);
    try {
        await dispatch(interests.selectToggleCategory(previousIndex));
    } catch (err) {
        setError(err.message);
    }
    setIsRefreshing(false);
  }, [dispatch, setIsLoading, setError])


  // Next
  const selectNextCategory = useCallback(async (nextIndex) => {
    setError('');
    setIsRefreshing(true);
    try {
        await dispatch(interests.selectToggleCategory(nextIndex));
    } catch (err) {
        setError(err.message);
    }
    setIsRefreshing(false);
  }, [dispatch, setIsLoading, setError])

  useEffect(() => {
    setIsLoading(true);
    loadCategories()
    .then(() => {
        setIsLoading(false);
    });
  }, [dispatch, loadCategories])

  const renderCategoryIcon = (activeCategory: string) => {
    switch (activeCategory) {
      case 'YouTube':
          return youtube
      
      case 'Twitter':
          return twitter

      case 'Spotify':
          return spotify

      case 'Instagram':
          return instagram

      case 'Snapchat':
        return snapchat

      case 'Netflix':
          return netflix
      
      case 'Tiktok':
          return tiktok
      
      case 'Others':
          return globe
        
      case 'Pinterest':
          return pinterest
    
      default:
        return globe
        break;
    }
  }

  return (
    <View>
      <View style={styles.centeredView}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          // Alert.alert("Modal has been closed.");
          setModalVisible(!modalVisible);
        }}
      >
        <ScrollView>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              {categories.map((item =>
                <TouchableOpacity 
                  key={item.id}
                  onPress={() => {
                    selectCategory(item.id),
                    setModalVisible(!modalVisible)
                  }}
                  style={
                    [styles.interestCategoryContainer, 
                    item.active && styles.interestCategoryActiveContainer
                    ]
                  }
                >
                  <Text style={styles.categoryText}>{item.name}</Text>
                </TouchableOpacity>
              ))}
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => setModalVisible(!modalVisible)}
              >
                <Text style={styles.textStyle}>Close</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </Modal>
      </View>
      
      <View style={styles.bottomContainer}>
        <View style={styles.iconContainer}>
          <TouchableOpacity style={styles.icon} onPress={() => selectPreviousCategory(previousIndex)}>
            {activeCategory &&  <Image source={renderCategoryIcon(categories[previousIndex].name)} style={{ width: 35, height: 35 }} /> }
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={() => setModalVisible(true)} style={[styles.helpLink, styles.labelContainer]}>
          <Text style={styles.categoryText} lightColor={Colors.light.tint}>
            {activeCategory && activeCategory.name}
          </Text>
        </TouchableOpacity>
        <View style={styles.iconContainer}>
            <TouchableOpacity style={styles.icon} onPress={() => selectNextCategory(nextIndex) }>
              {activeCategory &&  <Image source={renderCategoryIcon(categories[nextIndex].name)} style={{ width: 35, height: 35 }} /> }
            </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
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
    fontWeight: 'bold'
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
    width: 40,
    height: 40,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  iconText: {
    fontWeight: 'bold',
    fontSize: 20,
    color: '#000'
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
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  },
  interestCategoryContainer: {
    borderColor: '#fff',
    borderWidth: 1,
    borderStyle: 'solid',
    height: 60,
    width: '100%',
    marginTop: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000'
  },
  interestCategoryActiveContainer: {
    backgroundColor: "#2196F3",
  }
  
});

