import React, { useEffect, useState } from 'react';
import YouTube from 'react-youtube';
import { musicCatalog } from '../data/music-catalog';

// Context or props can be used. We'll pass state from App.jsx

export default function YouTubePlayer({ currentTrackId, isPlaying, onTrackEnd }) {
  const [player, setPlayer] = useState(null);
  
  const currentTrack = musicCatalog.find(t => t.id === currentTrackId);
  
  useEffect(() => {
    if (!player) return;
    
    if (isPlaying) {
      player.playVideo();
    } else {
      player.pauseVideo();
    }
  }, [isPlaying, currentTrackId, player]);

  const onReady = (event) => {
    setPlayer(event.target);
    event.target.setVolume(50); // Start at 50% volume
  };

  const onStateChange = (event) => {
    // YT.PlayerState.ENDED = 0
    if (event.data === 0 && onTrackEnd) {
      onTrackEnd();
    }
  };

  const opts = {
    height: '0',
    width: '0',
    playerVars: {
      autoplay: 0,
      controls: 0,
      disablekb: 1,
      modestbranding: 1,
      rel: 0,
    },
  };

  if (!currentTrack) return null;

  return (
    <div style={{ position: 'absolute', top: '-9999px', left: '-9999px', opacity: 0, pointerEvents: 'none' }}>
      <YouTube 
        videoId={currentTrack.youtubeId} 
        opts={opts} 
        onReady={onReady} 
        onStateChange={onStateChange} 
      />
    </div>
  );
}
