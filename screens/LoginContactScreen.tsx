import React, { useEffect, useState, useCallback } from 'react';
import { Platform, StyleSheet, FlatList, TextInput, ActivityIndicator, TouchableOpacity } from 'react-native';
import * as Contacts from 'expo-contacts';
import { useDispatch, useSelector } from 'react-redux';

import { StatusBar } from 'expo-status-bar';
import { Text, View } from '../components/Themed';

import * as friends from '../store/actions/friends';
import * as auth from '../store/actions/auth';
import onShare from "../components/Share";
import ContactItem from "../components/ContactItem";

import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';

import { useNavigation } from '@react-navigation/native';

const testActiveContacts = [
  {
    contactType: "person",
    firstName: "0802",
    id: "23350",
    imageAvailable: false,
    lastName: "5431",
    lookupKey: "3789r23006-132313172113191D1B1915",
    middleName: "703",
    name: "0802 703 5431",
  },
  {
    contactType: "person",
    firstName: "7",
    id: "21900",
    imageAvailable: false,
    lastName: "Emmy",
    lookupKey: "1724i126931420c65fbd1.3789r21657-213242425A",
    name: "7 Emmy",
  },
  {
    contactType: "person",
    firstName: "AO",
    id: "21806",
    imageAvailable: false,
    lookupKey: "1724i60424f7a0e70f9f7",
    name: "AO",
  },
  {
    contactType: "person",
    firstName: "Abdul",
    id: "22315",
    imageAvailable: false,
    lastName: "BoardMan",
    lookupKey: "1724i43be121e8b832a69",
    name: "Abdul BoardMan",
  },
  {
    contactType: "person",
    firstName: "Abdul",
    id: "2712",
    imageAvailable: false,
    lastName: "Ptwn",
    lookupKey: "1724i7ec282d98a3e602f",
    name: "Abdul Ptwn",
  },
  {
    contactType: "person",
    firstName: "Abdulrasaq",
    id: "2718",
    imageAvailable: false,
    lookupKey: "1724i55ef0d650b520827",
    name: "Abdulrasaq",
  },
  {
    contactType: "person",
    firstName: "Abdulsalam",
    id: "23181",
    imageAvailable: false,
    lookupKey: "3789r21671-2A2C3052404E2A402A42.1724i36227f9109c197f7",
    name: "Abdulsalam",
  },
];

export default function LoginContactsScreen() {
  const [contact, setContact] = useState([])
  const [text, setText] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState('');

  const dispatch = useDispatch();

  const processContacts = async (data) => {
    const contact_list = []
    
    data.forEach(contact => {
      if(contact.phoneNumbers){
        let phone_id = contact.phoneNumbers[0].number;
        phone_id = phone_id.replace(/\s/g, '');
        contact_list.push(phone_id)
      }
    });

    return contact_list;
  }

  const requestInvite = useCallback(async (data) => {
    setError('');
    setIsLoading(true);
    try {
      const contact_list = await processContacts(data)
      const message = await dispatch(friends.request_invite(contact_list));
      setContact(message)
    } catch (err) {
        setError(err.message);
    }
    setIsLoading(false);
}, [dispatch, setIsLoading, setError])

  const friendList = useSelector((state) => state.friend.allFriends);
  const contactList = useSelector((state) => state.friend.allContacts);
  const tempList = contactList.filter((item) => {
    const isFriend = friendList.find((friend) => friend.id === item.id);
    if (isFriend === undefined) {
      const activeContact = testActiveContacts.find(
        (contact) => contact.id === item.id
      );
      if (activeContact !== undefined) {
        Object.assign(item, { active: true });
      }
      return item;
    }
  });

  const activeList = contactList.filter((item) => {
    let isActive = false
    let isMyFriend = false
    contact.find((friend) => {
      const isFriend = friendList.find((myFriend) => myFriend.phone === friend.phone_id);
      if(isFriend === undefined){
        isMyFriend = true
      }
      if(item.phoneNumbers){
        const phone = item.phoneNumbers[0].number
        if(phone.replace(/\s/g, '') === friend.phone_id){
          isActive = true
        }
      }
    })
    
    if(isActive && isMyFriend){
      Object.assign(item, { active: true });
      return item
    }
  })

  const bufferList = tempList.filter((item) => {
    const isActive = activeList.find((friend) => friend.id === item.id);
    const isMyFriend = friendList.find((friend) => friend.phone === item.phone);
    if (isActive === undefined && isMyFriend === undefined) {
      return item
    }
  })

  // Subtract my friend from active contacts
  const tagList = activeList.filter((item) => {
    if(item.phoneNumbers){
      const phone = item.phoneNumbers[0].number
      const isFriend = friendList.find((myFriend) => myFriend.phone === phone.replace(/\s/g, ''));
      if(isFriend === undefined){
        Object.assign(item, { active: true });
        return item
      }
    }
  })
  
  const searchList1 = tagList.filter((friend) => friend.name.toUpperCase().indexOf(text.toUpperCase()) > -1)
  const searchList2 = bufferList.filter((friend) => friend.name.toUpperCase().indexOf(text.toUpperCase()) > -1)
  const searchList = searchList1.concat(searchList2)
  
  const loadContact = useCallback(async (data) => {
    setError('');
    setIsLoading(true);
    try {
        await dispatch(friends.setContacts(data));
    } catch (err) {
        setError(err.message);
    }
    setIsLoading(false);
  }, [dispatch, setIsLoading, setError])

  useEffect(() => {
    (async () => {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status === 'granted') {
        const { data } = await Contacts.getContactsAsync({
          fields: [Contacts.Fields.PhoneNumbers],
        });

        if (data.length > 0) {
          const valid_contacts = data.filter(item => item.name !== undefined)
          loadContact(valid_contacts)
          requestInvite(valid_contacts);
        }
      }
    })();
  }, []);


  const finish = () => {
    try {
        dispatch(auth.signin());
    } catch (err) {
    }
}


  return (
    <View style={styles.container}>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <View style={styles.searchContainer}>
        <View style={styles.search}>
            <TextInput
                style={styles.input}
                placeholder="Click to search contact"
                placeholderTextColor={'#fff'}
                autoFocus={true}
                returnKeyType="search"
                clearButtonMode="always"
                enablesReturnKeyAutomatically={true}
                onChangeText={newText => setText(newText)}
                defaultValue={text}
            />
        </View>
        <View style={styles.buttonView}>
            <TouchableOpacity style={styles.button} onPress={() => finish()}>
                <Text style={styles.buttonText}> Done </Text>
            </TouchableOpacity> 
        </View>    
      </View>
      <View style={styles.contactView}>
        {isLoading ? (
            <View style={styles.container} >
              <ActivityIndicator color="#fff" size='large' />
            </View>
        ) : (
          <FlatList
              data={searchList}
              renderItem={({ item }) => (
                <ContactItem item={item}/>
              )}
            />
        )}
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
  input: {
    color: '#fff',
    fontSize: 18,
    fontWeight: "bold"
  },
  search: {
    flex: 8,
    borderRadius: 10,
    paddingVertical: 5,
    backgroundColor: 'transparent'
  },
  searchContainer: { 
    flexDirection: 'row',
    paddingHorizontal: 10,
    width: '100%',
    paddingVertical: 5,
    backgroundColor: 'transparent',
    alignItems: 'center',
  },
  buttonView: {
    flex: 3,
    backgroundColor: 'transparent'
  },
  button: {
    height: 40,
    width: 100,
    padding: 5,
    borderRadius: 5,
    backgroundColor: "#2196F3",
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
    height: '90%',
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
  buttonText: {
    fontWeight: "bold",
  },
  contactImage: {
    height: 40,
    width: 40,
    borderRadius: 25,
    borderColor: '#ffffff',
    borderWidth: 1,
    borderStyle: 'solid',
    justifyContent: "center",
    alignItems: 'center'
  },
  contactText: {
    fontWeight: 'bold',
    fontSize: 20
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 40,
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
