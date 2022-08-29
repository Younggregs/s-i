import React, { useState, useCallback } from 'react';
import { StyleSheet, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import * as interests from '../store/actions/interests';

import { Text, View } from '../components/Themed';
import { RootStackScreenProps } from '../types';

export default function ContactScreen({ navigation }: RootStackScreenProps<'NotFound'>) {
    const [message, setMessage] = useState('')
    const [success, setSuccess] = useState(false)
    const [failed, setFailed] = useState(false)
    const dispatch = useDispatch()

    const [isLoading, setIsLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState('');

    const submit = useCallback(
      async (message) => {
        setError("");
        setIsLoading(true);
        setSuccess(false);
        setFailed(false)
        try {
          const res = await dispatch(interests.feedback(message));
          if(res.error_message){
            setFailed(true)
          }else{
            setSuccess(true)
          }
          setMessage('')
        } catch (err) {
          setError(err.message);
        }
        setIsLoading(false);
      },
      [dispatch, setIsLoading, setError]
    );


  return (
    <View style={styles.container}>
        <Text style={styles.title}>Send us a message</Text>
            <TextInput
                style={styles.input}
                placeholderTextColor='white'
                multiline
                onChangeText={(value) => setMessage(value)}
                placeholder="Message"
                value={message}
        />
        {!success ? <View /> : <Text>Received successfully</Text>}
        {!failed  ? <View /> : <Text> Sorry something went wrong, please retry</Text>}
        {isLoading ? (
          <TouchableOpacity
          style={styles.button}
        >
          <ActivityIndicator color="#fff" />
        </TouchableOpacity>
        ) : (
        <TouchableOpacity style={styles.button} onPress={() => submit(message)}>
            <Text style={styles.textStyle}>Share</Text>
        </TouchableOpacity>
        )}

        
        <TouchableOpacity onPress={() => navigation.replace('Root')} style={styles.link}>
            <Text style={styles.linkText}>shareinterest.app</Text>
        </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  button: {
    backgroundColor: "#2196F3",
    borderWidth: 2,
    borderStyle: 'solid',
    height: 40,
    width: '100%',
    marginTop: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textStyle: {
    fontWeight: "bold",
    textAlign: "center"
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  linkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
  input: {
    height: 150,
    width: '100%',
    marginTop: 20,
    marginBottom: 20,
    borderRadius: 10,
    backgroundColor: '#373737',
    color: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 5
  }
});
