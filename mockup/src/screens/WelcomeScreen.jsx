import { StepDots } from '../components/shared';

export default function WelcomeScreen() {
  return (
    <div className="body-scroll" style={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
      <div style={{ padding: '48px 28px 0', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
          <span className="pill pill-sm pill-blue mono">HUMAN LAB</span>
          <span className="pill pill-sm pill-teal mono">BETA v0.1</span>
        </div>
        <h1 className="syne-title" style={{ fontSize: 38, lineHeight: 1.05, marginBottom: 10 }}>
          Stop guessing.
          <br />
          Start <span style={{ color: 'var(--neon-teal)' }}>testing.</span>
        </h1>
        <p style={{ fontSize: 15, color: 'var(--text-mid)', lineHeight: 1.6, marginBottom: 20 }}>
          Run short experiments on yourself. Discover what <em style={{ color: 'var(--text-bright)' }}>actually</em> works.
        </p>

        <div className="pill-row" style={{ marginBottom: 36 }}>
          <span className="pill pill-sm pill-dim">🧪 7–45 day studies</span>
          <span className="pill pill-sm pill-dim">📊 Real data</span>
          <span className="pill pill-sm pill-dim">🤖 AI scientist</span>
        </div>

        <StepDots step={0} total={3} />
      </div>
    </div>
  );
}
