import React, { useEffect, useState, useCallback } from 'react';
import { Platform, StyleSheet, FlatList, TextInput, ActivityIndicator, TouchableOpacity } from 'react-native';
import * as Contacts from 'expo-contacts';
import { useDispatch, useSelector } from 'react-redux';
import parsePhoneNumber from 'libphonenumber-js'

import { StatusBar } from 'expo-status-bar';
import { Text, View } from '../components/Themed';

import * as friends from '../store/actions/friends';
import * as auth from '../store/actions/auth';
import ContactItem from "../components/ContactItem";


export default function LoginContactsScreen() {
  const [contact, setContact] = useState([])
  const [text, setText] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState('');

  const dispatch = useDispatch();

  const processContacts = async (data) => {
    const contact_list = []

    // We'll need to generate atleast two different phone number format for each phone returned
    // eg 8109599597 and 08109599597 or if it starts with + 
    // eg +2348109599597 and +2348109599597.
    data.forEach(contact => {
      if(contact.phoneNumbers){
        let phone_id = contact.phoneNumbers[0].number;
        phone_id = phone_id.replace(/\s/g, '');

        if(phone_id.charAt(0) === '0'){
          contact_list.push(phone_id.slice(1))
          contact_list.push(phone_id)
        }else if(phone_id.charAt(0) === '+') {
          // This small process here is crazy lol
          const phoneNumber = parsePhoneNumber(phone_id)
          const callingCode = phoneNumber ? phoneNumber.countryCallingCode : '+234'
          let phone = phoneNumber ? phoneNumber.formatNational() : '';
          phone = phone.replace(/\s/g, '');
          const phone1_id = '+' + callingCode + phone
          const phone2_id = '+' + callingCode + phone.slice(1)

          contact_list.push(phone1_id)
          contact_list.push(phone2_id)
        }else{
          contact_list.push('0' + phone_id)
          contact_list.push(phone_id)
        }
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

const loadFriends = useCallback(async () => {
  setError('');
  setIsLoading(true);
  try {
      await dispatch(friends.fetch_friends());
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
      const activeContact = contact.find(
        (obj) => obj.id === item.id
      );
      if (activeContact !== undefined) {
        Object.assign(item, { active: true });
      }
      return item;
    }
  });

  // get all active contacts
  const activeList = contactList.filter((item) => {
    let isActive = false
    contact.find((friend) => {
      if(item.phoneNumbers){
        const phone = item.phoneNumbers[0].number
        const phoneRegex = phone.replace(/\s/g, '')
        if( phoneRegex === friend.phone_id || phoneRegex === friend.phone1_id || phoneRegex === friend.phone || phoneRegex === friend.phone1){
          isActive = true
          Object.assign(item, { active: true, phone_id: friend.phone_id, phone1_id: friend.phone1_id, phone: friend.phone, phone1: friend.phone1});
        }
      }
    })
    
    if(isActive){
      return item
    }
  })

  // Substract all active contacts from contacts
  const bufferList = tempList.filter((item) => {
    const isActive = activeList.find((friend) => friend.id === item.id);
    const isMyFriend = friendList.find((friend) => friend.phone === item.phone);
    if (isActive === undefined && isMyFriend === undefined) {
      return item
    }
  })

  // Subtract my friends from active contacts
  const tagList = activeList.filter((item) => {
    if(item.phoneNumbers){
      const phone = item.phoneNumbers[0].number
      const phoneRegex = phone.replace(/\s/g, '')
      const isFriend = friendList.find((myFriend) => myFriend.phone === phoneRegex || myFriend.phone === item.phone_id || myFriend.phone === item.phone1_id || myFriend.phone === item.phone || myFriend.phone === item.phone1);
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
          loadFriends()
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
    <>
    {isLoading ? (
      <View style={styles.container} >
        <ActivityIndicator color="#fff" size='large' />
      </View>
    ) : (
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
    )}
    </>
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
