const DEFAULT_MAX = 12;
const MAX_LIMIT = 20;
const SPOTIFY_TOKEN_BUFFER_MS = 60 * 1000;

let spotifyTokenCache = {
  token: '',
  expiresAt: 0
};

function clampNumber(value, min, max, fallback) {
  if (!Number.isFinite(value)) {
    return fallback;
  }
  return Math.min(Math.max(value, min), max);
}

function decodeEntities(value) {
  if (!value) {
    return '';
  }

  return value
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function formatDuration(totalSeconds) {
  if (!Number.isFinite(totalSeconds) || totalSeconds <= 0) {
    return '--:--';
  }

  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function extractEntries(feedText) {
  if (!feedText) {
    return [];
  }

  return feedText
    .split('<entry>')
    .slice(1)
    .map((chunk) => chunk.split('</entry>')[0]);
}

function extractTagValue(entry, tagName) {
  const regex = new RegExp(`<${tagName}[^>]*>([\\s\\S]*?)</${tagName}>`);
  const match = entry.match(regex);
  return match ? decodeEntities(match[1].trim()) : '';
}

function extractTagAttribute(entry, tagName, attributeName) {
  const regex = new RegExp(`<${tagName}[^>]*\\b${attributeName}="([^"]+)"`);
  const match = entry.match(regex);
  return match ? match[1] : '';
}

function extractAlternateLink(entry) {
  const alternateMatch = entry.match(/<link[^>]*rel="alternate"[^>]*href="([^"]+)"/);
  if (alternateMatch) {
    return alternateMatch[1];
  }

  const anyMatch = entry.match(/<link[^>]*href="([^"]+)"/);
  return anyMatch ? anyMatch[1] : '';
}

function parseYouTubeFeed(feedText, limit) {
  const entries = extractEntries(feedText);
  if (!entries.length) {
    return [];
  }

  return entries.slice(0, limit).map((entry, index) => {
    const title = extractTagValue(entry, 'title') || 'Untitled';
    const artist = extractTagValue(entry, 'name') || '';
    const videoId = extractTagValue(entry, 'yt:videoId');
    const thumbnail = extractTagAttribute(entry, 'media:thumbnail', 'url');
    const link = extractAlternateLink(entry) || (videoId ? `https://www.youtube.com/watch?v=${videoId}` : '');

    const durationSeconds = parseInt(
      extractTagAttribute(entry, 'yt:duration', 'seconds') ||
        extractTagAttribute(entry, 'media:content', 'duration') ||
        '0',
      10
    );

    return {
      id: videoId || `yt-${index + 1}`,
      title: title,
      artist: artist,
      duration: durationSeconds ? formatDuration(durationSeconds) : '--:--',
      artwork: thumbnail,
      youtube: link
    };
  });
}

async function fetchYouTubeFeed(channelId, limit) {
  const feedUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
  const response = await fetch(feedUrl);
  if (!response.ok) {
    throw new Error('YouTube feed request failed');
  }

  const feedText = await response.text();
  return parseYouTubeFeed(feedText, limit);
}

async function fetchSpotifyToken() {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return '';
  }

  if (spotifyTokenCache.token && Date.now() < spotifyTokenCache.expiresAt - SPOTIFY_TOKEN_BUFFER_MS) {
    return spotifyTokenCache.token;
  }

  const authHeader = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${authHeader}`
    },
    body: 'grant_type=client_credentials'
  });

  if (!response.ok) {
    throw new Error('Spotify token request failed');
  }

  const data = await response.json();
  if (!data.access_token || !data.expires_in) {
    return '';
  }

  spotifyTokenCache = {
    token: data.access_token,
    expiresAt: Date.now() + data.expires_in * 1000
  };

  return spotifyTokenCache.token;
}

async function fetchSpotifyTopTracks(artistId, market) {
  const token = await fetchSpotifyToken();
  if (!token) {
    return [];
  }

  const url = `https://api.spotify.com/v1/artists/${artistId}/top-tracks?market=${encodeURIComponent(
    market
  )}`;
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!response.ok) {
    throw new Error('Spotify top tracks request failed');
  }

  const data = await response.json();
  const tracks = Array.isArray(data.tracks) ? data.tracks : [];

  return tracks.map((track, index) => ({
    id: track.id || `spotify-${index + 1}`,
    title: track.name || 'Untitled',
    artist: Array.isArray(track.artists) && track.artists[0] ? track.artists[0].name : '',
    duration: track.duration_ms || 0,
    artwork: Array.isArray(track.album?.images) && track.album.images[0] ? track.album.images[0].url : '',
    spotify: track.external_urls?.spotify || ''
  }));
}

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json',
    'Cache-Control': 'public, max-age=900'
  };

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers,
      body: ''
    };
  }

  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  const params = event.queryStringParameters || {};
  const channelId = (params.channelId || '').trim();
  const spotifyArtistId = (params.spotifyArtistId || '').trim();
  const market = (params.market || 'TR').trim().toUpperCase();
  const maxItems = clampNumber(parseInt(params.max, 10), 1, MAX_LIMIT, DEFAULT_MAX);

  const responsePayload = {
    tracks: [],
    spotifyTracks: [],
    warnings: []
  };

  if (channelId) {
    try {
      responsePayload.tracks = await fetchYouTubeFeed(channelId, maxItems);
    } catch (error) {
      responsePayload.warnings.push('youtube');
    }
  }

  if (spotifyArtistId) {
    try {
      responsePayload.spotifyTracks = await fetchSpotifyTopTracks(spotifyArtistId, market);
    } catch (error) {
      responsePayload.warnings.push('spotify');
    }
  }

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify(responsePayload)
  };
};
