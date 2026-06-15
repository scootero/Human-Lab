import { experimentById, getExperimentEmoji } from '../utils/labHelpers';
export default function ResultsScreen({ experimentId, onRestart }) {
  const exp = experimentById[experimentId];
  const name = exp?.name || 'Your Experiment';
  const emoji = exp ? getExperimentEmoji(exp.id) : '🏆';

  return (
    <>
      <div className="sb" style={{ background: 'transparent', position: 'absolute', width: '100%', zIndex: 10 }}>
        <span style={{ color: 'var(--neon-teal)' }}>HUM_LAB</span>
        <span>9:41</span>
      </div>
      <div className="body-scroll page-body">
        <div
          style={{
            background: 'linear-gradient(160deg,#0a0e1a 0%,#0f1f3d 50%,#1a1035 100%)',
            padding: '60px 24px 36px',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: 54, marginBottom: 12, animation: 'pop .5s cubic-bezier(.34,1.56,.64,1) both' }}>
            🏆
          </div>
          <p className="lbl" style={{ letterSpacing: 2, marginBottom: 8 }}>
            Experiment Complete
          </p>
          <h2 className="syne-title" style={{ fontSize: 26, marginBottom: 6 }}>
            {name} {emoji}
          </h2>
          <p className="mono" style={{ fontSize: 12, color: 'var(--text-dim)', marginBottom: 20 }}>
            14 days · Jun 7 2026
          </p>
          <span className="pill pill-teal" style={{ padding: '10px 20px', fontSize: 14 }}>
            ✅ Hypothesis Supported
          </span>
        </div>

        <div style={{ padding: 20 }}>
          <p className="lbl" style={{ marginBottom: 10 }}>
            Final data
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 8 }}>
            <StatBox value="-18%" label="Stress" color="var(--neon-teal)" bg="rgba(6,214,160,.08)" border="rgba(6,214,160,.2)" textColor="#5eead4" />
            <StatBox value="+14%" label="Clarity" color="var(--neon-purple)" bg="rgba(168,85,247,.08)" border="rgba(168,85,247,.2)" textColor="#d8b4fe" />
          </div>
          <StatBox value="+9%" label="Mood" color="var(--neon-blue)" bg="rgba(59,130,246,.08)" border="rgba(59,130,246,.2)" textColor="#93c5fd" wide />

          <div
            style={{
              background: 'rgba(6,214,160,.07)',
              border: '1.5px solid rgba(6,214,160,.25)',
              borderRadius: 'var(--r)',
              padding: 16,
              margin: '18px 0 14px',
              display: 'flex',
              gap: 12,
              alignItems: 'center',
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                background: 'var(--neon-teal)',
                borderRadius: 12,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                fontSize: 22,
              }}
            >
              ✅
            </div>
            <div>
              <p style={{ fontSize: 16, fontWeight: 800, color: 'var(--neon-teal)' }}>Supported</p>
              <p style={{ fontSize: 12, color: 'var(--text-mid)', marginTop: 2 }}>
                Your data exceeded the community average. This works for you.
              </p>
            </div>
          </div>

          <div
            style={{
              background: 'rgba(251,191,36,.08)',
              border: '1px solid rgba(251,191,36,.25)',
              borderRadius: 'var(--rm)',
              padding: 14,
              display: 'flex',
              gap: 12,
              alignItems: 'center',
              marginBottom: 14,
            }}
          >
            <span style={{ fontSize: 32 }}>🏅</span>
            <div>
              <p className="lbl" style={{ color: 'var(--neon-yellow)', textTransform: 'uppercase', letterSpacing: 1 }}>
                Discovery Badge
              </p>
              <p style={{ fontSize: 15, fontWeight: 800, color: 'var(--text-bright)' }}>Unexpected Success</p>
              <p style={{ fontSize: 11, color: 'var(--text-dim)', marginTop: 2 }}>
                You beat 83% of scientists who ran this study
              </p>
            </div>
          </div>

        </div>

        <div style={{ padding: '0 20px 36px' }}>
          <button type="button" className="btn btn-primary" onClick={onRestart}>
            Start Next Experiment →
          </button>
        </div>
      </div>
    </>
  );
}

function StatBox({ value, label, color, bg, border, textColor, wide }) {
  return (
    <div
      style={{
        background: bg,
        border: `1px solid ${border}`,
        borderRadius: 'var(--rm)',
        padding: wide ? 14 : 16,
        textAlign: 'center',
        marginBottom: wide ? 18 : 0,
        gridColumn: wide ? '1 / -1' : undefined,
      }}
    >
      <p className="mono" style={{ fontSize: wide ? 32 : 28, fontWeight: 800, color, letterSpacing: -1 }}>
        {value}
      </p>
      <p style={{ fontSize: 11, fontWeight: 700, color: textColor }}>{label}</p>
    </div>
  );
}
