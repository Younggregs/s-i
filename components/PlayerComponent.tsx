import React from 'react';
import TwitterPlayer from './players/TwitterPlayer';
import OthersPlayer from './players/OthersPlayer';
import TextPlayer from './players/TextPlayer';
import SpotifyPlayer from './players/SpotifyPlayer';
import YouTubePlayer from './players/YoutubePlayer';
import TikTokPlayer from './players/TikTokPlayer';
import InstagramPlayer from './players/InstagramPlayer';
import SnapchatPlayer from './players/SnapchatPlayer';
import PinterestPlayer from './players/PinterestPlayer';
import NetflixPlayer from './players/NetflixPlayer';
import { View } from '../components/Themed';

export default function PlayerComponent({item}) {
    
    return (
        <View>

          {item.category.slug === 'youtube' && item.type === 'url' && (
            <YouTubePlayer link_text={item.link_text} />
          )}

          {item.category.slug === 'spotify' && item.type === 'url' && (
            <SpotifyPlayer link_text={item.link_text} />
          )}

          {item.category.slug === 'twitter' && item.type === 'url' && (
            <TwitterPlayer id={item.id} link_text={item.link_text} preview={item.preview}/>
          )}

          {item.category.slug === 'instagram' && item.type === 'url' && (
            <InstagramPlayer link_text={item.link_text} />
          )}

          {item.category.slug === 'tiktok' && item.type === 'url' && (
            <TikTokPlayer link_text={item.link_text} />
          )}

          {item.category.slug === 'snapchat' && item.type === 'url' && (
            <SnapchatPlayer link_text={item.link_text} />
          )}

          {item.category.slug === 'pinterest' && item.type === 'url' && (
            <PinterestPlayer link_text={item.link_text} />
          )}

          {item.category.slug === 'netflix' && item.type === 'url' && (
            <NetflixPlayer link_text={item.link_text} />
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