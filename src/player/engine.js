// The page's own turntable: plays a release's 30-second Apple preview through
// Web Audio and exposes its live spectrum, so the visuals follow the actual
// recording instead of a fake loop. Browser-only; created on first play.
let audio = null;
let context = null;
let analyser = null;
let bins = null;
const listeners = new Set();

const emit = () => listeners.forEach((listener) => listener());

function element() {
  if (audio) return audio;
  audio = new Audio();
  // Apple's preview CDN answers with CORS; without this the analyser reads silence.
  audio.crossOrigin = 'anonymous';
  audio.preload = 'none';
  ['play', 'playing', 'pause', 'ended', 'waiting', 'timeupdate', 'durationchange', 'error'].forEach((type) =>
    audio.addEventListener(type, emit),
  );
  return audio;
}

// Must run inside the click that starts playback (autoplay policy).
function connect() {
  if (context) {
    if (context.state === 'suspended') context.resume();
    return;
  }
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;
  context = new AudioContext();
  analyser = context.createAnalyser();
  analyser.fftSize = 2048;
  analyser.smoothingTimeConstant = 0.8;
  context.createMediaElementSource(element()).connect(analyser);
  analyser.connect(context.destination);
  bins = new Uint8Array(analyser.frequencyBinCount);
}

export function start(url) {
  const el = element();
  connect();
  if (el.src !== url) el.src = url;
  return el.play();
}

export function toggle() {
  if (!audio?.src) return;
  if (audio.paused || audio.ended) audio.play().catch(() => {});
  else audio.pause();
}

export function stop() {
  if (!audio) return;
  audio.pause();
  audio.removeAttribute('src');
  audio.load();
  emit();
}

export function seek(seconds) {
  if (audio?.src && Number.isFinite(audio.duration)) audio.currentTime = Math.min(Math.max(seconds, 0), audio.duration);
}

export function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function status() {
  if (!audio?.src) return { playing: false, buffering: false, time: 0, duration: 30, failed: false };
  return {
    playing: !audio.paused && !audio.ended,
    buffering: !audio.paused && audio.readyState < 3,
    time: audio.currentTime,
    duration: Number.isFinite(audio.duration) ? audio.duration : 30,
    failed: Boolean(audio.error),
  };
}

export const isPlaying = () => Boolean(audio && audio.src && !audio.paused && !audio.ended);

// Log-spaced band energies (0–1) from ~40 Hz to ~14 kHz, written into `out`.
// Returns false while nothing is playing, so callers can let their visuals rest.
export function readBands(out) {
  if (!analyser || !isPlaying()) {
    out.fill(0);
    return false;
  }
  analyser.getByteFrequencyData(bins);
  const hzPerBin = context.sampleRate / analyser.fftSize;
  const n = out.length;
  for (let i = 0; i < n; i++) {
    const lo = Math.max(1, Math.floor((40 * Math.pow(350, i / n)) / hzPerBin));
    const hi = Math.max(lo + 1, Math.floor((40 * Math.pow(350, (i + 1) / n)) / hzPerBin));
    let sum = 0;
    for (let b = lo; b < hi; b++) sum += bins[b];
    out[i] = sum / ((hi - lo) * 255);
  }
  return true;
}
