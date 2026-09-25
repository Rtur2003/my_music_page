import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

// One player for the whole page: start a record anywhere and it keeps playing
// while you scroll. It renders Spotify's plain embed, so no third-party script
// runs on the page and the CSP stays strict.
const PlayerContext = createContext(null);

export function PlayerProvider({ children }) {
  const [release, setRelease] = useState(null);
  const play = useCallback((next) => setRelease(next), []);
  const close = useCallback(() => setRelease(null), []);
  const value = useMemo(() => ({ release, play, close }), [release, play, close]);
  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>;
}

// eslint-disable-next-line react/only-export-components -- hook is colocated with its provider
export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error('usePlayer must be used within a PlayerProvider');
  return ctx;
}
