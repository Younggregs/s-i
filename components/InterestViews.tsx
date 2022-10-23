import React, { useState, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { StyleSheet, TouchableOpacity, FlatList } from 'react-native';  
import Modal from "react-native-modal";
import { Text, View } from './Themed';
import { useQuery } from 'react-query'

import * as interests from '../store/actions/interests';
import TimeAgo from 'react-native-timeago';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';

export default function InterestViews(interestItem) {
  const [modalVisible, setModalVisible] = useState(false);
  const { data } = useQuery(
    ['viewList', interestItem.id], 
    () => interests.view_list_query(interestItem.id), 
    { initialData: []})

  // const interestingsList = useSelector(state => state.interest.allViews);
  // let itemInterestings = []
  // itemInterestings = interestingsList.filter(interesting => interesting.interest_id == interestItem.id)

  // const dispatch = useDispatch();

  // useEffect(() => {
  //     interestingList()
  // }, [dispatch])

  // const interestingList = useCallback(async () => {
  //   try {
  //      await dispatch(interests.interestViewList(interestItem.id));
  //   } catch (err) {
  //   }
  // }, [dispatch])


  return (
  <View style={styles.interactionsView}>
    <Modal
      propagateSwipe={true}
      swipeDirection="down"
      onSwipeComplete={() => { setModalVisible(false) }}
      isVisible={modalVisible}
    >
        <View style={styles.container}>
            <View style={styles.swipeCueView}>
                <View style={styles.swipeCue} />
            </View>
            <Text style={styles.categoryText}>Views</Text>
            <FlatList
                data={data}
                renderItem={({ item }) => (
                <ContactItem item={item}/>
                )}
            />
            <TouchableOpacity
              style={[styles.button, styles.buttonClose, styles.buttonCancel]}
              onPress={() => setModalVisible(false)}
          >
              <Text style={styles.textStyle}>Close</Text>
          </TouchableOpacity>
        </View>
        
    </Modal>
    <TouchableOpacity onPress={() => setModalVisible(true)}>
        <Text style={styles.interactionsText}> 
            <FontAwesome
                name="eye"
                size={20}
                color={'#fff'}
            /> {data.length}
        </Text>
    </TouchableOpacity>
    </View>
  );
}

const ContactItem = ({item}) => {
    const navigation = useNavigation();
    const friend = {  
        id: item.friend.friend.id, 
        name: item.friend.name, 
        phone: item.friend.friend.phone_id,
        notification: item.friend.notification
    }
    return(
        <View style={styles.centeredView}>
        <View style={styles.modalView}>
            <TouchableOpacity
                onPress={() => navigation.navigate('ProfileModal', {item: friend}) }
                style={styles.contact}
            >
                <View style={styles.contactImage}>
                    <Text style={styles.contactText}>{item.friend.name.substring(0, 1)}</Text>
                </View>
                    <Text style={styles.item}>{`${item.friend.name}`}</Text>
                
                <View
                    style={styles.tagView}
                >
                    <Text style={styles.timer}>
                        <TimeAgo time={item.created_at} interval={20000} hideAgo={true}/>
                    </Text>
                </View>
            </TouchableOpacity>
        </View>
    </View> 
    )
}



const styles = StyleSheet.create({
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  swipeCueView: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  swipeCue: {
    width: 50,
    backgroundColor: '#fff',
    borderRadius: 5,
    height: 4,
  },
  timer: {
    color: '#fff',
    fontSize: 15,
    flex: 3
  },
  container: {
    flex: 1,
    marginTop: 200,
    borderColor: 'rgba(255,255,255,0.1)',
    borderStyle: "solid",
    borderWidth: 0.5,
    borderRadius: 15
  },
  contact: {
    flexDirection: "row",
    alignItems: "center",
    flex: 2,
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
  interactionsText: {
    fontSize: 15,
    fontWeight: 'bold'
  },
  item: {
    height: 50,
    width: "100%",
    paddingHorizontal: 20,
    paddingVertical: 10,
    fontSize: 15,
    flex: 8,
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
    margin: 5,
    borderRadius: 20,
    padding: 10,
    width: '100%',
    alignItems: "center",
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
  },
  contactView: {
    height: '100%',
    width: '100%',
  },
  contactText: {
    fontWeight: 'bold',
    fontSize: 20
  },
  tagView: {
    padding: 10,
    borderRadius: 5,
    flex: 4,
  },
  contactImage: {
    height: 40,
    width: 40,
    borderRadius: 25,
    borderColor: "#ffffff",
    borderWidth: 1,
    borderStyle: "solid",
    justifyContent: "center",
    alignItems: 'center'
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  buttonText: {
    fontWeight: "bold",
  },
});

