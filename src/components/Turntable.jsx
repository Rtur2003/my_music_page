import { useEffect, useRef } from 'react';
import * as engine from '../player/engine';
import styles from './Turntable.module.css';

// The hero record as an instrument. It turns at 33⅓ rpm while the deck plays and
// coasts down when it stops; you can push it by hand. Its grooves light up with the
// live spectrum of the preview: bass on the outer rings, air near the label.
// At rest a CSS animation keeps a slow drift on the compositor, and this loop sleeps:
// it only runs while something plays, a hand is on the record, or it is still coasting.
const PLAY_SPEED = 200; // degrees per second, 33⅓ rpm
const RINGS = 34;
const LIGHT = '241, 241, 239';

function drawGrooves(ctx, size, levels) {
  ctx.clearRect(0, 0, size, size);
  const centre = size / 2;
  const inner = size * 0.19;
  const outer = size * 0.485;
  ctx.globalCompositeOperation = 'lighter';
  ctx.lineCap = 'round';
  ctx.lineWidth = Math.max(1, size * 0.0034);
  for (let i = 0; i < RINGS; i++) {
    const level = levels[i];
    if (level < 0.03) continue;
    const radius = outer - (i / (RINGS - 1)) * (outer - inner);
    const sweep = 0.35 + level * 1.5;
    ctx.strokeStyle = `rgba(${LIGHT}, ${Math.min(0.92, level * level * 1.6 + 0.05)})`;
    for (let k = 0; k < 3; k++) {
      const start = i * 2.39996 + (k * Math.PI * 2) / 3;
      ctx.beginPath();
      ctx.arc(centre, centre, radius, start, start + sweep);
      ctx.stroke();
    }
  }
}

export default function Turntable({ onTap, beatTarget, children }) {
  const platterRef = useRef(null);
  const canvasRef = useRef(null);
  const tapRef = useRef(onTap);
  tapRef.current = onTap;

  useEffect(() => {
    const platter = platterRef.current;
    const canvas = canvasRef.current;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      // No spinning or light show, but the record still works as a play button.
      const onClick = () => tapRef.current?.();
      platter.addEventListener('click', onClick);
      return () => platter.removeEventListener('click', onClick);
    }

    const ctx = canvas.getContext('2d');
    const bands = new Float32Array(RINGS);
    const levels = new Float32Array(RINGS);
    let size = 0;
    let angle = -16;
    let speed = 0;
    let beat = 0;
    let lit = false;
    let visible = true;
    let frame = 0;
    let last = 0;
    let drag = null;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      size = platter.clientWidth;
      canvas.width = canvas.height = Math.round(size * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const tick = (now) => {
      frame = 0;
      const dt = last ? Math.min((now - last) / 1000, 0.05) : 0;
      last = now;
      const playing = engine.readBands(bands);
      if (!drag) {
        const target = playing ? PLAY_SPEED : 0;
        // Motor: ~1 s to reach speed; a stopped platter coasts for about two.
        speed += (target - speed) * (1 - Math.exp(-dt * (playing ? 2.2 : 0.8)));
        angle += speed * dt;
      }
      platter.style.transform = `rotate(${angle}deg)`;

      // Fast attack, slow release: the grooves breathe with the music.
      let peak = 0;
      for (let i = 0; i < RINGS; i++) {
        levels[i] = Math.max(bands[i], levels[i] * 0.9);
        peak = Math.max(peak, levels[i]);
      }
      if (peak > 0.01 || lit) {
        drawGrooves(ctx, size, levels);
        lit = peak > 0.01;
      }
      const bass = (bands[0] + bands[1] + bands[2] + bands[3]) / 4;
      beat = Math.max(bass * bass, beat * 0.86);
      beatTarget?.current?.style.setProperty('--beat', beat.toFixed(3));

      const busy = playing || drag || Math.abs(speed) > 0.5 || lit || beat > 0.001;
      if (visible && busy) frame = requestAnimationFrame(tick);
    };
    const run = () => {
      if (!frame) {
        last = 0;
        frame = requestAnimationFrame(tick);
      }
    };

    // Push the record by hand: the angle follows the pointer around the spindle,
    // and letting go keeps the spin you gave it.
    const pointerAngle = (event) => {
      const box = platter.getBoundingClientRect();
      return (Math.atan2(event.clientY - box.top - box.height / 2, event.clientX - box.left - box.width / 2) * 180) / Math.PI;
    };
    const onDown = (event) => {
      if (event.button !== 0) return;
      platter.setPointerCapture(event.pointerId);
      drag = { at: pointerAngle(event), t: performance.now(), x: event.clientX, y: event.clientY, moved: 0, started: performance.now() };
      run();
    };
    const onMove = (event) => {
      if (!drag) return;
      const at = pointerAngle(event);
      const delta = ((at - drag.at + 540) % 360) - 180;
      const t = performance.now();
      angle += delta;
      speed = (delta / Math.max(t - drag.t, 8)) * 1000;
      drag.at = at;
      drag.t = t;
      drag.moved = Math.max(drag.moved, Math.hypot(event.clientX - drag.x, event.clientY - drag.y));
    };
    const onUp = () => {
      if (!drag) return;
      const tap = drag.moved < 6 && performance.now() - drag.started < 350;
      drag = null;
      if (tap) tapRef.current?.();
    };
    // The browser took the gesture over for scrolling: never a tap.
    const onCancel = () => { drag = null; };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(platter);
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) run();
    });
    io.observe(platter);
    platter.addEventListener('pointerdown', onDown);
    platter.addEventListener('pointermove', onMove);
    platter.addEventListener('pointerup', onUp);
    platter.addEventListener('pointercancel', onCancel);
    // Wake up when playback starts or stops anywhere on the page.
    const unsubscribe = engine.subscribe(run);

    return () => {
      cancelAnimationFrame(frame);
      unsubscribe();
      observer.disconnect();
      io.disconnect();
      platter.removeEventListener('pointerdown', onDown);
      platter.removeEventListener('pointermove', onMove);
      platter.removeEventListener('pointerup', onUp);
      platter.removeEventListener('pointercancel', onCancel);
    };
  }, [beatTarget]);

  return (
    <div ref={platterRef} className={styles.platter}>
      <canvas ref={canvasRef} className={styles.grooves} />
      {children}
    </div>
  );
}
