import * as WebBrowser from 'expo-web-browser';
import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, Modal, Alert, Pressable, ScrollView } from 'react-native';

import Colors from '../constants/Colors';
import { MonoText } from './StyledText';
import { Text, View } from './Themed';

export default function InterestCategorySwitch({ path }: { path: string }) {
  const [modalVisible, setModalVisible] = useState(false);
  return (
    <View>

      <View style={styles.centeredView}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setModalVisible(!modalVisible);
        }}
      >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
                <TouchableOpacity style={styles.interestCategoryContainer}>
                  <Text style={styles.categoryText}>Twitter</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.interestCategoryContainer, styles.interestCategoryActiveContainer]}>
                  <Text style={styles.categoryText}>Youtube</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.interestCategoryContainer}>
                  <Text style={styles.categoryText}>Instagram</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.interestCategoryContainer}>
                  <Text style={styles.categoryText}>Spotify</Text>
                </TouchableOpacity>
                <Pressable
                  style={[styles.button, styles.buttonClose]}
                  onPress={() => setModalVisible(!modalVisible)}
                >
                  <Text style={styles.textStyle}>Close</Text>
                </Pressable>
            </View>
        </View>
      </Modal>
      </View>
      
      <View style={styles.bottomContainer}>
        <View style={styles.iconContainer}>
          <TouchableOpacity style={styles.icon} />
        </View>
        <TouchableOpacity onPress={() => setModalVisible(true)} style={[styles.helpLink, styles.labelContainer]}>
          <Text style={styles.categoryText} lightColor={Colors.light.tint}>
            Youtube
          </Text>
        </TouchableOpacity>
        <View style={styles.iconContainer}>
           <TouchableOpacity style={styles.icon} />
        </View>
      </View>
    </View>
  );
}

function handleHelpPress() {
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

