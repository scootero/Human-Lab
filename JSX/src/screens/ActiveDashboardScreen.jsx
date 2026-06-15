import { experimentById, getExperimentEmoji } from '../utils/labHelpers';
import { StatusBar, NavBar } from '../components/shared';

export default function ActiveDashboardScreen({ experimentId, onLogData, onNavigate }) {
  const exp = experimentById[experimentId];
  const name = exp?.name || 'Your Experiment';
  const emoji = exp ? getExperimentEmoji(exp.id) : '🧪';

  return (
    <>
      <StatusBar />
      <div className="body-scroll page-body" style={{ padding: '0 20px 20px' }}>
        <div style={{ margin: '4px 0 16px' }}>
          <p className="lbl" style={{ color: 'var(--neon-teal)', marginBottom: 4 }}>
            ▶ ACTIVE EXPERIMENT
          </p>
          <h2 className="syne-title" style={{ fontSize: 20 }}>
            {name} {emoji}
          </h2>
        </div>

        <div
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

        <p className="lbl" style={{ marginBottom: 8 }}>
          Early findings
        </p>
        <MetricRow emoji="😌" label="Stress" color="var(--neon-teal)" width="40%" value="-8%" />
        <MetricRow emoji="🧠" label="Clarity" color="var(--neon-purple)" width="55%" value="+6%" />
        <MetricRow emoji="😊" label="Mood" color="var(--neon-blue)" width="30%" value="+3%" />

        <div
          style={{
            background: 'rgba(251,191,36,.08)',
            border: '1px solid rgba(251,191,36,.25)',
            borderRadius: 'var(--rm)',
            padding: '11px 14px',
            display: 'flex',
            gap: 10,
            alignItems: 'center',
            margin: '14px 0',
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

        <p className="lbl" style={{ marginBottom: 8 }}>
          7-day trend
        </p>
        <TrendChart />

        <button type="button" className="btn btn-primary" onClick={onLogData} style={{ marginTop: 14 }}>
          Log Today&apos;s Data →
        </button>

      </div>
      <NavBar active="active" onNavigate={onNavigate} />
    </>
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
