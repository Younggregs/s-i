import React, { useState, useCallback, useEffect } from "react";
import { ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';

import * as friends from '../store/actions/friends';

export default function FriendsScreen({ navigation }: RootTabScreenProps<'Friends'>) {
  const friendList = useSelector(state => state.friend.allFriends);

  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState('');

  const dispatch = useDispatch();

  const loadFriends = useCallback(async () => {
    setError('');
    setIsRefreshing(true);
    try {
        await dispatch(friends.fetchFriends());
    } catch (err) {
        setError(err.message);
    }
    setIsRefreshing(false);
  }, [dispatch, setIsLoading, setError])

  useEffect(() => {
    setIsLoading(true);
    loadFriends()
    .then(() => {
        setIsLoading(false);
    });
  }, [dispatch, loadFriends])


  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <ScrollView>
          {friendList.map(item => 
            <TouchableOpacity 
              onPress={() => navigation.navigate('ProfileModal')}
               key={item.id} 
               style={styles.interestContainer} 
               lightColor="#eee" 
               darkColor="rgba(255,255,255,0.1)">
              <View style={styles.contactImage}/>
              <Text style={styles.item}>{item.name}</Text>
          </TouchableOpacity>
          )}
        </ScrollView>
      </View>
      <TouchableOpacity style={styles.newFriendContainer} onPress={() => navigation.navigate('CategoryModal')}>
        <Text style={styles.newFriendText}>Tag Friend</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
      flex: 1 // pushes the footer to the end of the screen
  },
  item: {
    height: 50,
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: 10,
    fontSize: 15
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
  interestContainer: {
    height: 60,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 1
  },
  newFriendContainer: {
    borderTopColor: '#fff',
    borderWidth: 2,
    borderStyle: 'solid',
    paddingVertical: 15,
    width: '100%',
    marginTop: 10
  },
  newFriendText: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold'
  }
});
