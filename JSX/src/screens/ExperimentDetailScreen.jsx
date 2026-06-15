import {
  experimentById,
  getExperimentEmoji,
  buildHypothesis,
  buildProtocol,
  difficultyLabel,
  formatCost,
  formatTime,
  studyDays,
} from '../utils/labHelpers';
import { StatusBar, BackButton } from '../components/shared';

export default function ExperimentDetailScreen({ experimentId, onBack, onAccept }) {
  const exp = experimentById[experimentId];
  if (!exp) return null;

  const days = studyDays(exp.timeMinutes, exp.difficulty);
  const emoji = getExperimentEmoji(exp.id);

  return (
    <>
      <StatusBar />
      <div className="body-scroll page-body">
        <div
          style={{
            background: 'linear-gradient(160deg,#0f1f3d 0%,#1a1035 100%)',
            padding: '20px 20px 28px',
            borderBottom: '1px solid var(--lab-border)',
          }}
        >
          <BackButton onClick={onBack} />
          <div style={{ fontSize: 52, marginBottom: 12, marginTop: 16 }}>{emoji}</div>
          <div className="pill-row" style={{ marginBottom: 10 }}>
            <span className="pill pill-sm pill-teal">Observation Study</span>
            <span className="pill pill-sm pill-dim">{days} Days</span>
            <span className="pill pill-sm pill-blue">{formatCost(exp.cost)}</span>
            <span className="pill pill-sm pill-purple">{formatTime(exp.timeMinutes)}</span>
          </div>
          <h2 className="syne-title" style={{ fontSize: 24, marginBottom: 10 }}>
            {exp.name}
          </h2>
          <div
            style={{
              background: 'rgba(168,85,247,.08)',
              border: '1px solid rgba(168,85,247,.2)',
              borderRadius: 'var(--rm)',
              padding: '12px 14px',
            }}
          >
            <p className="lbl" style={{ color: 'var(--neon-purple)', marginBottom: 4 }}>
              HYPOTHESIS
            </p>
            <p style={{ fontSize: 13, color: 'var(--text-bright)', lineHeight: 1.55, fontStyle: 'italic' }}>
              {buildHypothesis(exp)}
            </p>
          </div>
        </div>

        <div style={{ padding: '16px 20px' }}>
          <div
            style={{
              background: 'var(--lab-panel)',
              borderRadius: 'var(--rm)',
              padding: 14,
              marginBottom: 14,
              border: '1px solid var(--lab-border)',
            }}
          >
            <p className="lbl" style={{ marginBottom: 6 }}>
              Protocol
            </p>
            <p style={{ fontSize: 13, color: 'var(--text-mid)', lineHeight: 1.65 }}>{buildProtocol(exp)}</p>
          </div>

          <p className="lbl" style={{ marginBottom: 10 }}>
            Tags
          </p>
          <div className="pill-row" style={{ marginBottom: 16 }}>
            {exp.linkedCategoryNames.map((name) => (
              <span key={name} className="pill pill-sm pill-blue">
                {name}
              </span>
            ))}
            <span className="pill pill-sm pill-dim">{difficultyLabel(exp.difficulty)}</span>
            <span className="pill pill-sm pill-teal">Fun {exp.funScore}/5</span>
            <span className="pill pill-sm pill-purple">Science {exp.scienceScore}</span>
          </div>

          <p className="lbl" style={{ marginBottom: 10 }}>
            What we measure daily
          </p>
          <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
            {exp.linkedCategoryNames.slice(0, 3).map((name, i) => (
              <div
                key={name}
                style={{
                  flex: 1,
                  background: 'var(--lab-panel)',
                  border: '1px solid var(--lab-border)',
                  borderRadius: 'var(--rm)',
                  padding: 12,
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: 20, marginBottom: 4 }}>
                  {['😌', '🧠', '😊', '⚡', '💪'][i] || '📊'}
                </div>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-bright)' }}>{name}</div>
              </div>
            ))}
          </div>

          <p className="lbl" style={{ marginBottom: 10 }}>
            Community data
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 20 }}>
            <div
              style={{
                background: 'rgba(6,214,160,.08)',
                border: '1px solid rgba(6,214,160,.2)',
                borderRadius: 'var(--rm)',
                padding: 14,
                textAlign: 'center',
              }}
            >
              <p className="mono" style={{ fontSize: 28, fontWeight: 800, color: 'var(--neon-teal)', letterSpacing: -1 }}>
                {Math.round(exp.scienceScore * 0.12)}%
              </p>
              <p style={{ fontSize: 11, fontWeight: 600, color: '#5eead4' }}>avg improvement</p>
            </div>
            <div
              style={{
                background: 'rgba(168,85,247,.08)',
                border: '1px solid rgba(168,85,247,.2)',
                borderRadius: 'var(--rm)',
                padding: 14,
                textAlign: 'center',
              }}
            >
              <p className="mono" style={{ fontSize: 28, fontWeight: 800, color: 'var(--neon-purple)', letterSpacing: -1 }}>
                {Math.min(95, exp.scienceScore - 5)}%
              </p>
              <p style={{ fontSize: 11, fontWeight: 600, color: '#d8b4fe' }}>worth retesting</p>
            </div>
          </div>
        </div>
        <div style={{ padding: '0 20px 32px' }}>
          <button type="button" className="btn btn-teal" onClick={onAccept} style={{ fontSize: 16 }}>
            Accept Experiment ⚗️
          </button>
        </div>
      </div>
    </>
  );
}
