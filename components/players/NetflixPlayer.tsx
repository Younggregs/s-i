import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, Image } from 'react-native';
import UrlPreview from '../packages/UrlPreview';
import { Text, View } from '../Themed';
import Modal from "react-native-modal";
import { WebView } from 'react-native-webview';
import { getLinkPreview, getPreviewFromContent } from "link-preview-js";
import { queryClient } from '../../App';
import { useQuery, useMutation, QueryClient } from 'react-query'
import * as interests from '../../store/actions/interests'

export default function NetflixPlayer({link_text}) {
    const [loaded, setLoaded] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);

    const {data, isLoading} = useQuery(
      ['player_preview', link_text],
      () => interests.fetch_preview_query(link_text))
    
    return (
        <View style={styles.itemView}>
            <Modal
                propagateSwipe={true}
                swipeDirection="down"
                onSwipeComplete={() => { setModalVisible(false) }}
                isVisible={modalVisible}
            >
                <WebView
                    style={styles.container}
                    source={{ uri: link_text }}
                    />
            </Modal>

        <TouchableOpacity style={styles.itemView} onPress={() => setModalVisible(true)}>
              {isLoading ? (
                <View style={styles.itemView}>
                  <Text style={styles.loadingText}>Loading...</Text>
                </View>
              ) : (
              <View style={styles.itemView}>
                {data.images &&  
                  <Image 
                    source={{uri: data?.images[0]}} 
                    style={styles.imagePreview} 
                  />
                }
                <View style={styles.text}>
                  <Text style={styles.textTitle}>
                    {data?.title && data?.title.substring(0,50)} 
                    {data?.title && data?.title.length >= 150 && '...'}
                  </Text>
                  <Text>
                    {data?.description && data?.description.substring(0,100)} 
                    {data?.description && data?.description.length >= 150 && '...'}
                  </Text>
                </View> 
              </View> 
              )}
        </TouchableOpacity>
        </View>
  );
}

const styles = StyleSheet.create({
    itemView: {
      height: 300,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 5
    },
    imagePreview: {
      height: 200,
      width: 400,
      borderColor: '#fff',
      borderWidth: 1,
      borderStyle: 'solid',
      resizeMode: 'cover',
      borderRadius: 10
    },
    textTitle: {
      fontWeight: 'bold',
      fontSize: 15,
      textDecorationLine: 'underline'
    },
    loadingText: {
        textAlign: 'center',
        fontSize: 15,
        fontWeight: 'bold',
        margin:5
    },
    container: {
      flex: 1,
      marginTop: 200,
      borderColor: 'rgba(255,255,255,0.1)',
      borderStyle: "solid",
      borderWidth: 0.5,
      borderRadius: 15
    },
});
