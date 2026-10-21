import { useMemo, useRef, useState } from 'react';
import styles from './Timeline.module.css';

// Every release on one time axis: a mark per record at its release date, its
// height the number of tracks. The pointer (or arrow keys) finds the nearest
// record; a click or Enter plays it. The archive below is the full table view.
const DAY = 86400000;

export default function Timeline({ releases, current, playing, onPlay, en }) {
  const plotRef = useRef(null);
  const [active, setActive] = useState(null);

  const model = useMemo(() => {
    const dated = releases
      .filter((r) => r.date)
      .map((r) => ({ release: r, t: Date.parse(r.date) }))
      .sort((a, b) => a.t - b.t);
    if (dated.length < 2) return null;
    const firstYear = new Date(dated[0].t).getUTCFullYear();
    const lastYear = new Date(dated[dated.length - 1].t).getUTCFullYear();
    const start = Date.UTC(firstYear, 0, 1);
    const end = Date.UTC(lastYear + 1, 0, 1);
    const maxTracks = Math.max(...dated.map((d) => d.release.tracks ?? 1), 2);
    let previous = -Infinity;
    const marks = dated.map((d) => {
      // Same-day releases sit side by side instead of on top of each other.
      const t = d.t - previous < DAY ? previous + DAY * 2 : d.t;
      previous = t;
      return {
        ...d,
        x: Math.min(((t - start) / (end - start)) * 100, 100),
        h: ((d.release.tracks ?? 1) - 1) / (maxTracks - 1),
      };
    });
    const years = [];
    for (let y = firstYear; y <= lastYear; y++) years.push({ y, x: ((Date.UTC(y, 0, 1) - start) / (end - start)) * 100 });
    return { marks, years, maxTracks };
  }, [releases]);

  if (!model) return null;
  const { marks, years, maxTracks } = model;
  const playingIndex = marks.findIndex((m) => m.release.id === current?.id);
  const shown = active ?? (playing && playingIndex >= 0 ? playingIndex : null);
  const focus = shown == null ? null : marks[shown];

  const dateLabel = (release) => new Intl.DateTimeFormat(en ? 'en-GB' : 'tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(release.date));
  const tracksLabel = (n) => (en ? `${n} ${n === 1 ? 'track' : 'tracks'}` : `${n} parça`);

  const nearest = (clientX) => {
    const box = plotRef.current.getBoundingClientRect();
    const x = ((clientX - box.left) / box.width) * 100;
    let best = 0;
    for (let i = 1; i < marks.length; i++) if (Math.abs(marks[i].x - x) < Math.abs(marks[best].x - x)) best = i;
    return best;
  };

  const onKeyDown = (event) => {
    const last = marks.length - 1;
    const from = active ?? last;
    const next = { ArrowLeft: from - 1, ArrowRight: from + 1, Home: 0, End: last }[event.key];
    if (next !== undefined) {
      event.preventDefault();
      setActive(Math.min(Math.max(next, 0), last));
    } else if ((event.key === 'Enter' || event.key === ' ') && active != null) {
      event.preventDefault();
      onPlay(marks[active].release);
    }
  };

  return (
    <figure className={styles.timeline}>
      <figcaption className={styles.caption}>
        <span>{en ? 'Release timeline' : 'Yayın takvimi'}</span>
        <span className={styles.key}>
          {en ? `Each line is a release; its height, the track count (1–${maxTracks}).` : `Her çizgi bir kayıt; yüksekliği parça sayısı (1–${maxTracks}).`}
        </span>
      </figcaption>
      <div
        ref={plotRef}
        className={styles.plot}
        tabIndex={0}
        role="group"
        aria-label={en
          ? `Release timeline, ${marks.length} releases. Arrow keys browse, Enter plays.`
          : `Yayın takvimi, ${marks.length} kayıt. Ok tuşlarıyla gezin, Enter ile çal.`}
        onPointerMove={(event) => setActive(nearest(event.clientX))}
        onPointerLeave={() => setActive(null)}
        onBlur={() => setActive(null)}
        onClick={(event) => onPlay(marks[nearest(event.clientX)].release)}
        onKeyDown={onKeyDown}
      >
        {years.map(({ y, x }) => (
          <span key={y} className={styles.year} style={{ left: `${x}%` }} aria-hidden="true">{y}</span>
        ))}
        {marks.map((m, i) => (
          <span
            key={m.release.id}
            className={styles.mark}
            style={{ left: `${m.x}%`, '--h': m.h }}
            data-active={i === shown ? '' : undefined}
            data-playing={i === playingIndex && playing ? '' : undefined}
            aria-hidden="true"
          />
        ))}
        {focus && (
          <span className={styles.crosshair} style={{ left: `${focus.x}%` }} aria-hidden="true" />
        )}
        {focus && (
          <span className={styles.tip} style={{ left: `${focus.x}%`, '--x': focus.x }} aria-hidden="true">
            <strong>
              {shown === playingIndex && playing && <i className="live-dot" />}
              {focus.release.title}
            </strong>
            <span>{dateLabel(focus.release)} · {tracksLabel(focus.release.tracks ?? 1)}</span>
          </span>
        )}
      </div>
      <p className="sr-only" aria-live="polite">
        {active != null ? `${marks[active].release.title}, ${dateLabel(marks[active].release)}` : ''}
      </p>
    </figure>
  );
}
