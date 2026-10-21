import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import * as engine from './engine';

// One player for the whole page: start a record anywhere and it keeps playing
// while you scroll. Releases with an Apple preview play on the page's own
// turntable (engine.js); the rest, or anyone who asks for the full track, get
// the plain Spotify / Apple Music embed. No third-party script runs on the page.
const PlayerContext = createContext(null);
// Playback time ticks a few times a second; only the transport listens to it.
const StatusContext = createContext(engine.status());

export function PlayerProvider({ children }) {
  const [release, setRelease] = useState(null);
  const [mode, setMode] = useState(null); // 'deck' | 'embed'
  const [status, setStatus] = useState(engine.status);

  useEffect(() => engine.subscribe(() => setStatus(engine.status())), []);

  const play = useCallback((next) => {
    if (release?.id === next.id && mode === 'deck') {
      engine.toggle();
      return;
    }
    setRelease(next);
    if (!next.preview) {
      engine.stop();
      setMode('embed');
      return;
    }
    setMode('deck');
    engine.start(next.preview).catch(() => setMode('embed'));
  }, [release, mode]);

  const toggle = useCallback(() => engine.toggle(), []);
  const fullTrack = useCallback(() => {
    engine.stop();
    setMode('embed');
  }, []);
  const close = useCallback(() => {
    engine.stop();
    setRelease(null);
    setMode(null);
  }, []);

  const playing = mode === 'deck' && status.playing;
  const value = useMemo(
    () => ({ release, mode, playing, play, toggle, fullTrack, close }),
    [release, mode, playing, play, toggle, fullTrack, close],
  );
  return (
    <PlayerContext.Provider value={value}>
      <StatusContext.Provider value={status}>{children}</StatusContext.Provider>
    </PlayerContext.Provider>
  );
}

// eslint-disable-next-line react/only-export-components -- hook is colocated with its provider
export const usePlayerStatus = () => useContext(StatusContext);

// eslint-disable-next-line react/only-export-components -- hook is colocated with its provider
export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error('usePlayer must be used within a PlayerProvider');
  return ctx;
}
