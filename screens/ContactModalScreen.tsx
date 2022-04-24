import React, { useEffect, useState, useCallback } from 'react';
import { Platform, StyleSheet, FlatList, ScrollViewBase, ScrollView, TouchableOpacityBase, TouchableOpacity } from 'react-native';
import * as Contacts from 'expo-contacts';
import { useDispatch, useSelector } from 'react-redux';

import { StatusBar } from 'expo-status-bar';
import { Text, View } from '../components/Themed';

import * as friends from '../store/actions/friends';

export default function ContactModalScreen() {
  const [contact, setContact] = useState()
  const friendList = useSelector(state => state.friend.allFriends);
  const contactList = useSelector(state => state.friend.allContacts);
  const tempList =  contactList.filter(item => {
    const isFriend = friendList.find(friend => friend.id === item.id)
      if(isFriend === undefined){
          return(
              item
          )
      }
  })

  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState('');

  const dispatch = useDispatch();

  const add = useCallback(async (item) => {
    setError('');
    setIsRefreshing(true);
    try {
        await dispatch(friends.addFriends(item));
    } catch (err) {
        setError(err.message);
    }
    setIsRefreshing(false);
  }, [dispatch, setIsLoading, setError])

  const loadContact = useCallback(async (data) => {
    setError('');
    setIsRefreshing(true);
    try {
        await dispatch(friends.setContacts(data));
    } catch (err) {
        setError(err.message);
    }
    setIsRefreshing(false);
  }, [dispatch, setIsLoading, setError])

  useEffect(() => {
    (async () => {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status === 'granted') {
        const { data } = await Contacts.getContactsAsync({
          fields: [Contacts.Fields.Emails],
        });

        if (data.length > 0) {
          loadContact(data)
        }
      }
    })();
  }, []);


  return (
    <View style={styles.container}>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <View style={styles.contactView}>
        <FlatList
          data={tempList}
          renderItem={({item}) => 
          <View style={styles.contact} lightColor="#eee" darkColor="rgba(255,255,255,0.1)">
            <View style={styles.contactImage}/>
            <Text style={styles.item}>{item.name}</Text>
            <TouchableOpacity onPress={() => add(item)} style={styles.tagView}>
               <Text>Tag</Text> 
            </TouchableOpacity>
          </View>
          
        }
        />
        </View>
      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
   
  },
  contact: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 1,
    flex: 2
  },
  contactView: {
    height: '100%',
    width: '100%',
  },
  tagView: {
    padding: 10,
    borderRadius: 5,
    borderColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderStyle: 'solid',
    flex: 2

  },
  contactImage: {
    height: 40,
    width: 40,
    borderRadius: 25,
    borderColor: '#ffffff',
    borderWidth: 1,
    borderStyle: 'solid',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  item: {
    height: 50,
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: 10,
    fontSize: 15,
    flex: 8
  }
});
