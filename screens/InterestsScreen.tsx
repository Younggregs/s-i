import React, { useState, useCallback, useEffect } from "react";
import { StyleSheet, Platform, AppState, AppStateStatus, FlatList, ActivityIndicator, Linking, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import InterestCategorySwitch from '../components/InterestCategorySwitch';
import AddInterest from '../components/AddInterest';
import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';
import { useQuery, useQueryClient, focusManager } from 'react-query'

import * as interests from '../store/actions/interests';
import * as Network from 'expo-network';
import Toast from 'react-native-root-toast';

import InterestComponent from "../components/InterestComponent";

const wait = (timeout) => {
  return new Promise(resolve => setTimeout(resolve, timeout));
}

export default function InterestsScreen({ navigation }: RootTabScreenProps<'Interests'>) {

  const queryClient = useQueryClient()
  const {data, isLoading} = useQuery('interestsList', interests.fetch_interests_query,{
    initialData: () => {
      return queryClient.getQueryData('interestsList') || []
    }
  })

  const [modalVisible, setModalVisible] = useState(false);
  const categories = useSelector(state => state.interest.allCategories);
  const activeCategory = categories.find(category => category.active === true);

  const interestsList = useSelector(state => state.interest.allInterests);
  let interestsBucket = []
  interestsBucket = data.filter(interest => interest.category.id === activeCategory.id)

  // const [isLoading, setIsLoading] = useState(false); 
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const dispatch = useDispatch();

  const [visible, setVisible] = useState(false);
  const hideMenu = () => setVisible(false);
  const showMenu = () => setVisible(true);

  const loadInterest = useCallback(async () => {
    setError('');
    setIsLoading(true);
    try {
        await dispatch(interests.fetchInterests());
    } catch (err) {
        setError(err.message);
    }
    setIsLoading(false);
  }, [dispatch, setError])

  const refreshInterest = useCallback(async () => {
    try {
        await dispatch(interests.fetchInterests());
    } catch (err) {
        setError(err.message);
    }
  }, [dispatch])

  useEffect(() => {
    checkNetworkConnection()
    // loadInterest()
    .then(() => {
        // setIsLoading(false);
    });
  }, [dispatch, loadInterest])

  const checkNetworkConnection = async () => {
    const status = await Network.getNetworkStateAsync();
    if (!status.isConnected || !status.isInternetReachable){
      Toast.show('No or poor internet connection', {
        duration: Toast.durations.LONG,
      });

    }
  }

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    wait(2000).then(() => {
      checkNetworkConnection()
      refreshInterest()
      setRefreshing(false)
    });
  }, []);


const onViewableItemsChanged = useCallback(
    (info: { changed: ViewToken[] }): void => {
      const visibleItems = info.changed.filter((entry) => entry.isViewable);
      visibleItems.forEach((visible) => {
        !visible.item.mine && interestViewed(visible.item)
      });
    },
    []
  );

  const interestViewed = useCallback(async (item) => {
    try {
       await dispatch(interests.interestViewRecord(item.id));
    } catch (err) {
    }
  }, [dispatch])

  function onAppStateChange(status: AppStateStatus) {
    if (Platform.OS !== 'web') {
      focusManager.setFocused(status === 'active')
    }
  }
  
  useEffect(() => {
    const subscription = AppState.addEventListener('change', onAppStateChange)
  
    return () => subscription.remove()
  }, [])
 


  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
      {isLoading ? (
        <View style={styles.loading}>
          <ActivityIndicator color="#fff" size='large'/>
        </View>
      ) : (
      <View>
        <FlatList
          onViewableItemsChanged={onViewableItemsChanged}
          contentContainerStyle={{ paddingBottom: 250 }}
          viewabilityConfig={{
            itemVisiblePercentThreshold: 100,
            minimumViewTime: 2000,
          }}
          // refreshControl={
          //  <RefreshControl
          //    refreshing={refreshing}
          //    onRefresh={onRefresh}
          //  />
          // }
          data={interestsBucket}
          renderItem={({ item }) => (
            <InterestComponent key={item.id} item={item} />
          )}
        />
        <View style={styles.footerContainer}>
          <TouchableOpacity onPress={() => Linking.openURL('https://shareinterest.app')} style={styles.link}>
              <Text style={styles.linkText}>shareinterest.app</Text>
          </TouchableOpacity>
        </View>
        
      </View>
      )}
      </View>
      <View style={styles.fab}>
        <AddInterest path="/screens/InterestsScreen.tsx"/>
      </View>
      <InterestCategorySwitch path="/screens/InterestsScreen.tsx" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  signature: {
    height: 100
  },
  contentContainer: {
      flex: 1, // pushes the footer to the end of the screen
  },
  loading: {
    margin: 100
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  linkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  categoryText: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    margin:5
  },
  footerContainer: {
    borderColor: 'rgba(255,255,255,0.1)',
    borderWidth: 0.5,
    borderStyle: 'solid',
    height: 150,
    width: '100%',
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center'
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
    backgroundColor: 'transparent',
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
