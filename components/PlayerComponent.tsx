import React, { useState } from 'react';
import { StyleSheet, TextInput } from 'react-native';
import TwitterPlayer from './players/TwitterPlayer';
import OthersPlayer from './players/OthersPlayer';
import TextPlayer from './players/TextPlayer';

import { View } from '../components/Themed';

export default function PlayerComponent({item}) {
    
    return (
        <View>

          {item.category.slug === 'youtube' && item.type === 'url' && (
            <OthersPlayer link_text={item.link_text} />
          )}

          {item.category.slug === 'spotify' && item.type === 'url' && (
            <OthersPlayer link_text={item.link_text} />
          )}

          {item.category.slug === 'twitter' && item.type === 'url' && (
            <TwitterPlayer id={item.id} link_text={item.link_text} preview={item.preview}/>
          )}

          {item.category.slug === 'instagram' && item.type === 'url' && (
            <OthersPlayer link_text={item.link_text} />
          )}

          {item.category.slug === 'tiktok' && item.type === 'url' && (
            <OthersPlayer link_text={item.link_text} />
          )}

          {item.category.slug === 'snapchat' && item.type === 'url' && (
            <OthersPlayer link_text={item.link_text} />
          )}

          {item.category.slug === 'pinterest' && item.type === 'url' && (
            <OthersPlayer link_text={item.link_text} />
          )}

          {item.category.slug === 'netflix' && item.type === 'url' && (
            <OthersPlayer link_text={item.link_text} />
          )}
          
          {item.category.slug === 'others' && item.type === 'url' && (
            <OthersPlayer link_text={item.link_text} />
          )}

          {item.category.slug === 'others' && item.type === 'text' && (
            <TextPlayer link_text={item.link_text}/>
          )}
        </View>
  );
}

const styles = StyleSheet.create({
    container: { 
        flexDirection: 'row',
        backgroundColor: 'transparent'
    },
    search: {
        width: '100%',
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 5,
        backgroundColor: 'transparent'
    },
    searchText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    textInputContainer: {
        flex: 1,
        color: '#fff'
    },
    icon: {
        width: 30,
        height: 30,
        backgroundColor: '#fff'
    }
});
