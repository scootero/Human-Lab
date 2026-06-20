import { useEffect, useMemo, useRef, useState } from 'react';
import SectionTourGuide from '../components/SectionTourGuide';
import { StatusBar } from '../components/shared';
import { experimentById, getExperimentEmoji } from '../utils/labHelpers';
import { hasVisitedPage, markPageVisited } from '../utils/visitFlags';

const ACTIVE_PAGE_ID = 'active';

const ACTIVE_TOUR_STEPS = [
  {
    sectionKey: null,
    revealUpTo: -1,
    message: 'Velcome to ze Activity page! I vill walk you through each section — tap Continue ven you are ready.',
  },
  {
    sectionKey: 'header',
    revealUpTo: 0,
    message: 'Zis is your running experiment — always know vich study you are collecting data for.',
  },
  {
    sectionKey: 'progress',
    revealUpTo: 1,
    message: 'Your progress ring tracks days completed and data confidence. Stay on track for a stronger signal!',
  },
  {
    sectionKey: 'checkin',
    revealUpTo: 2,
    message: 'Log daily check-ins here — slide each metric worse or better, zen hit Save. Quick and painless, ja?',
  },
  {
    sectionKey: 'missed',
    revealUpTo: 3,
    message: 'Missed a day? No penalty — it only lowers confidence. Ve keep it honest, not guilt-trippy.',
  },
  {
    sectionKey: 'overall',
    revealUpTo: 4,
    message: 'Your overall levels roll up from saved check-ins — zis is ze big picture of how you are trending.',
  },
  {
    sectionKey: 'trend',
    revealUpTo: 5,
    message: 'Ze 7-day chart shows your trend over time. Red bars mean a missed data point. You are all set — happy experimenting!',
  },
];

const CHECK_IN_METRICS = [
  { key: 'stress', emoji: '😌', label: 'Stress', color: 'var(--neon-teal)' },
  { key: 'clarity', emoji: '🧠', label: 'Clarity', color: 'var(--neon-purple)' },
  { key: 'mood', emoji: '😊', label: 'Mood', color: 'var(--neon-blue)' },
];

const INITIAL_OVERALL = {
  stress: { value: '-8%', width: '40%' },
  clarity: { value: '+6%', width: '55%' },
  mood: { value: '+3%', width: '30%' },
};

function formatDelta(n) {
  if (n > 0) return `+${n}`;
  return String(n);
}

function formatPercent(n) {
  if (n > 0) return `+${n}%`;
  return `${n}%`;
}

function clampPercent(n) {
  return Math.max(-20, Math.min(20, n));
}

export default function ActiveDashboardScreen({ experimentId, onTourActiveChange }) {
  const exp = experimentById[experimentId];
  const name = exp?.name || 'Your Experiment';
  const emoji = exp ? getExperimentEmoji(exp) : '🧪';

  const scrollRef = useRef(null);
  const sectionRefs = useRef({});
  const [showTour, setShowTour] = useState(() => !hasVisitedPage(ACTIVE_PAGE_ID));
  const [tourStep, setTourStep] = useState(0);

  const [savedCheckIn, setSavedCheckIn] = useState({ stress: 0, clarity: 0, mood: 0 });
  const [draftCheckIn, setDraftCheckIn] = useState({ stress: 0, clarity: 0, mood: 0 });
  const [overallLevels, setOverallLevels] = useState(INITIAL_OVERALL);
  const [saveState, setSaveState] = useState('idle');

  const hasChanges = useMemo(
    () => CHECK_IN_METRICS.some(({ key }) => draftCheckIn[key] !== savedCheckIn[key]),
    [draftCheckIn, savedCheckIn]
  );

  const handleSliderChange = (key, value) => {
    setDraftCheckIn((prev) => ({ ...prev, [key]: value }));
    if (saveState === 'saved') setSaveState('idle');
  };

  const currentTourStep = ACTIVE_TOUR_STEPS[tourStep];
  const revealedUpTo = currentTourStep?.revealUpTo ?? -1;

  useEffect(() => {
    onTourActiveChange?.(showTour);
    return () => onTourActiveChange?.(false);
  }, [showTour, onTourActiveChange]);

  const sectionVisible = (index) => !showTour || revealedUpTo >= index;

  const handleTourContinue = () => {
    if (tourStep >= ACTIVE_TOUR_STEPS.length - 1) {
      markPageVisited(ACTIVE_PAGE_ID);
      setShowTour(false);
      return;
    }
    setTourStep((prev) => prev + 1);
  };

  const handleSaveCheckIn = () => {
    setSavedCheckIn({ ...draftCheckIn });
    setOverallLevels((prev) => {
      const next = { ...prev };
      CHECK_IN_METRICS.forEach(({ key }) => {
        const delta = draftCheckIn[key] - savedCheckIn[key];
        if (delta === 0) return;
        const current = parseInt(prev[key].value, 10) || 0;
        const updated = clampPercent(current + delta);
        next[key] = {
          value: formatPercent(updated),
          width: `${Math.min(100, Math.abs(updated) * 5)}%`,
        };
      });
      return next;
    });
    setSaveState('saved');
    setTimeout(() => setSaveState('idle'), 1800);
  };

  return (
    <>
      <StatusBar />
      <div
        ref={scrollRef}
        className={`body-scroll page-body${showTour ? ' page-body--tour' : ''}`}
        style={{ padding: '0 20px 20px' }}
      >
        <div
          ref={(el) => {
            sectionRefs.current.header = el;
          }}
          className={`tour-section${sectionVisible(0) ? ' tour-section--visible' : ''}`}
          style={{ margin: '4px 0 16px' }}
        >
          <p className="lbl" style={{ color: 'var(--neon-teal)', marginBottom: 4 }}>
            ▶ ACTIVE EXPERIMENT
          </p>
          <h2 className="syne-title" style={{ fontSize: 20 }}>
            {name} {emoji}
          </h2>
        </div>

        <div
          ref={(el) => {
            sectionRefs.current.progress = el;
          }}
          className={`tour-section${sectionVisible(1) ? ' tour-section--visible' : ''}`}
          style={{
            background: 'linear-gradient(135deg,rgba(59,130,246,.1),rgba(168,85,247,.08))',
            border: '1px solid var(--lab-border)',
            borderRadius: 18,
            padding: 20,
            marginBottom: 14,
            display: 'flex',
            gap: 18,
            alignItems: 'center',
          }}
        >
          <div style={{ position: 'relative', width: 88, height: 88, flexShrink: 0 }}>
            <svg width="88" height="88" viewBox="0 0 88 88">
              <circle cx="44" cy="44" r="36" fill="none" stroke="var(--lab-border)" strokeWidth="7" />
              <circle
                cx="44"
                cy="44"
                r="36"
                fill="none"
                stroke="url(#pg)"
                strokeWidth="7"
                strokeLinecap="round"
                strokeDasharray="226"
                strokeDashoffset="113"
                transform="rotate(-90 44 44)"
              />
              <defs>
                <linearGradient id="pg" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0" stopColor="#3b82f6" />
                  <stop offset="1" stopColor="#a855f7" />
                </linearGradient>
              </defs>
            </svg>
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <span className="mono" style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-bright)' }}>
                7
              </span>
              <span style={{ fontSize: 10, color: 'var(--text-dim)' }}>of 14</span>
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 12, color: 'var(--text-mid)', marginBottom: 10 }}>
              Day 7 · 50% complete · <span style={{ color: 'var(--neon-teal)' }}>On track</span>
            </p>
            <p className="lbl" style={{ marginBottom: 5 }}>
              Data confidence
            </p>
            <div className="xp-bar-wrap" style={{ marginBottom: 4 }}>
              <div className="xp-bar-fill" style={{ width: '50%' }} />
            </div>
            <p style={{ fontSize: 11, color: 'var(--text-dim)' }}>Moderate — 7 more days builds a strong signal</p>
          </div>
        </div>

        <div
          ref={(el) => {
            sectionRefs.current.checkin = el;
          }}
          className={`check-in-panel tour-section${sectionVisible(2) ? ' tour-section--visible' : ''}`}
        >
          <p className="lbl check-in-title">Check-in</p>
          {CHECK_IN_METRICS.map(({ key, emoji, label, color }) => (
            <CheckInRow
              key={key}
              emoji={emoji}
              label={label}
              color={color}
              value={draftCheckIn[key]}
              onChange={(v) => handleSliderChange(key, v)}
            />
          ))}
          <div className="check-in-footer">
            <button
              type="button"
              className={`check-in-save-btn ${saveState === 'saved' ? 'saved' : ''}`}
              disabled={!hasChanges || saveState === 'saved'}
              onClick={handleSaveCheckIn}
            >
              {saveState === 'saved' ? '✓ Saved' : 'Save'}
            </button>
          </div>
        </div>

        <div
          ref={(el) => {
            sectionRefs.current.missed = el;
          }}
          className={`tour-section${sectionVisible(3) ? ' tour-section--visible' : ''}`}
          style={{
            background: 'rgba(251,191,36,.08)',
            border: '1px solid rgba(251,191,36,.25)',
            borderRadius: 'var(--rm)',
            padding: '11px 14px',
            display: 'flex',
            gap: 10,
            alignItems: 'center',
            margin: '0 0 14px',
          }}
        >
          <span style={{ fontSize: 18 }}>⚠️</span>
          <div>
            <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--neon-yellow)' }}>Data point missed — Day 5</p>
            <p style={{ fontSize: 11, color: 'var(--text-mid)', marginTop: 1 }}>
              No penalty. Missing days reduce data confidence only.
            </p>
          </div>
        </div>

        <div
          ref={(el) => {
            sectionRefs.current.overall = el;
          }}
          className={`tour-section${sectionVisible(4) ? ' tour-section--visible' : ''}`}
        >
          <p className="lbl" style={{ marginBottom: 8 }}>
            Your current overall levels
          </p>
          {CHECK_IN_METRICS.map(({ key, emoji, label, color }) => (
            <MetricRow
              key={key}
              emoji={emoji}
              label={label}
              color={color}
              width={overallLevels[key].width}
              value={overallLevels[key].value}
            />
          ))}
        </div>

        <div
          ref={(el) => {
            sectionRefs.current.trend = el;
          }}
          className={`tour-section${sectionVisible(5) ? ' tour-section--visible' : ''}`}
        >
          <p className="lbl" style={{ marginBottom: 8, marginTop: 8 }}>
            7-day trend
          </p>
          <TrendChart />
        </div>

        {showTour && (
          <SectionTourGuide
            step={currentTourStep}
            stepIndex={tourStep}
            stepCount={ACTIVE_TOUR_STEPS.length}
            sectionRef={
              currentTourStep.sectionKey ? { current: sectionRefs.current[currentTourStep.sectionKey] } : null
            }
            scrollRootRef={scrollRef}
            onContinue={handleTourContinue}
          />
        )}
      </div>
    </>
  );
}

function CheckInRow({ emoji, label, color, value, onChange }) {
  const nudge = (delta) => onChange(Math.max(-5, Math.min(5, value + delta)));

  return (
    <div className="check-in-row">
      <div className="check-in-row-label">
        <span className="check-in-emoji">{emoji}</span>
        <span>{label}</span>
      </div>
      <div className="check-in-row-control">
        <div className="check-in-track-labels">
          <span className="check-in-pole worse">worse</span>
          <span className="check-in-pole better">better</span>
        </div>
        <div className="check-in-control-line">
          <button type="button" className="check-in-step" disabled={value <= -5} onClick={() => nudge(-1)} aria-label={`${label} worse`}>
            −
          </button>
          <div className="check-in-track" role="slider" aria-valuemin={-5} aria-valuemax={5} aria-valuenow={value}>
            <div className="check-in-track-center" />
            <div
              className="check-in-track-fill"
              style={{
                left: value < 0 ? `${50 + (value / 5) * 50}%` : '50%',
                width: `${(Math.abs(value) / 5) * 50}%`,
                background: value < 0 ? 'var(--neon-red)' : 'var(--neon-teal)',
              }}
            />
            <div className="check-in-track-dot" style={{ left: `${((value + 5) / 10) * 100}%`, background: color }} />
          </div>
          <button type="button" className="check-in-step" disabled={value >= 5} onClick={() => nudge(1)} aria-label={`${label} better`}>
            +
          </button>
        </div>
        <span className="check-in-value mono" style={{ color }}>
          {formatDelta(value)}
        </span>
      </div>
    </div>
  );
}

function MetricRow({ emoji, label, color, width, value }) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'var(--lab-panel)',
        borderRadius: 'var(--rm)',
        padding: '10px 14px',
        border: '1px solid var(--lab-border)',
        marginBottom: 6,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 16 }}>{emoji}</span>
        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-bright)' }}>{label}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 60, height: 4, background: 'var(--lab-border)', borderRadius: 2, overflow: 'hidden' }}>
          <div style={{ height: '100%', width, background: color, borderRadius: 2 }} />
        </div>
        <span className="mono" style={{ fontSize: 13, fontWeight: 800, color }}>
          {value}
        </span>
      </div>
    </div>
  );
}

function TrendChart() {
  const bars = [
    { h: '42%', c: 'rgba(59,130,246,.45)', label: 'D1' },
    { h: '50%', c: 'rgba(59,130,246,.55)', label: 'D2' },
    { h: '57%', c: 'rgba(59,130,246,.65)', label: 'D3' },
    { h: '62%', c: 'rgba(59,130,246,.72)', label: 'D4' },
    { h: '18%', c: 'var(--lab-border)', label: 'D5', miss: true },
    { h: '70%', c: 'rgba(59,130,246,.82)', label: 'D6' },
    { h: '76%', c: 'var(--neon-blue)', label: 'D7', today: true },
  ];
  return (
    <div
      style={{
        background: 'var(--lab-panel)',
        border: '1px solid var(--lab-border)',
        borderRadius: 'var(--r)',
        padding: 14,
        marginBottom: 14,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 64 }}>
        {bars.map((b) => (
          <div
            key={b.label}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 3,
              height: '100%',
              justifyContent: 'flex-end',
            }}
          >
            <div style={{ width: '100%', borderRadius: '3px 3px 0 0', background: b.c, height: b.h }} />
            <span
              className="mono"
              style={{
                fontSize: 9,
                color: b.miss ? 'var(--neon-red)' : b.today ? 'var(--neon-blue)' : 'var(--text-dim)',
              }}
            >
              {b.label}
            </span>
          </div>
        ))}
      </div>
      <p className="mono" style={{ fontSize: 10, color: 'var(--text-dim)', marginTop: 8, textAlign: 'center' }}>
        Stress reduction trend · Red = missed data point
      </p>
    </div>
  );
}
