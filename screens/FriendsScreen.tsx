import React, { useState, useCallback, useEffect } from "react";
import { FlatList, StyleSheet, TouchableOpacity, RefreshControl, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useQuery, useQueryClient } from 'react-query'

import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';

import * as friends from '../store/actions/friends';

const wait = (timeout) => {
  return new Promise(resolve => setTimeout(resolve, timeout));
}

export default function FriendsScreen({ navigation }: RootTabScreenProps<'Friends'>) {
  const queryClient = useQueryClient()
  const {data, isLoading} = useQuery('friendsList', friends.fetch_friends_query,{
    initialData: () => {
      return queryClient.getQueryData('friendsList') || []
    }
  })

  const friendList = useSelector(state => state.friend.allFriends);


  // const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  // const [error, setError] = useState('');

  const dispatch = useDispatch();

  // const loadFriends = useCallback(async () => {
  //   setError('');
  //   setIsLoading(true);
  //   try {
  //       await dispatch(friends.fetch_friends());
  //   } catch (err) {
  //       setError(err.message);
  //   }
  //   setIsLoading(false);
  // }, [dispatch, setIsLoading, setError])

  const refreshFriends = useCallback(async () => {
    try {
        await dispatch(friends.fetch_friends());
    } catch (err) {
        setError(err.message);
    }
  }, [dispatch])

  // useEffect(() => {
  //   setIsLoading(true);
  //   loadFriends()
  //   .then(() => {
  //       setIsLoading(false);
  //   });
  // }, [dispatch, loadFriends])

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    wait(2000).then(() => {
      refreshFriends()
      setRefreshing(false)
    });
  }, []);



  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
      {isLoading ? (
        <View style={styles.loading}>
          <ActivityIndicator color="#fff" size='large'/>
        </View>
      ) : (
        <FlatList
          contentContainerStyle={{ paddingBottom: 20 }}
          // refreshControl={
          //  <RefreshControl
          //    refreshing={refreshing}
          //    onRefresh={onRefresh}
          //  />
          // }
          data={data}
          renderItem={({ item }) => (
            <TouchableOpacity 
              onPress={() => navigation.navigate('ProfileModal', {item})}
              key={item.id} 
              style={styles.interestContainer} 
              lightColor="#eee" 
              darkColor="rgba(255,255,255,0.1)">
              <View style={styles.contactImage}>
                <Text style={styles.contactText}>{item.name.substring(0, 1)}</Text>
              </View>
              <Text style={styles.item}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
      )}
      </View>
      <TouchableOpacity style={styles.newFriendContainer} onPress={() => navigation.navigate('ContactModal')}>
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
