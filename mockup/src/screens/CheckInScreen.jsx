import { useEffect, useState } from 'react';
import { experimentById } from '../utils/labHelpers';
import { StatusBar, BackButton, DropdownPill } from '../components/shared';

const MOOD_OPTIONS = [
  { value: 'great', label: 'Mood tag: Great' },
  { value: 'good', label: 'Mood tag: Good' },
  { value: 'okay', label: 'Mood tag: Okay' },
  { value: 'rough', label: 'Mood tag: Rough' },
];

export default function CheckInScreen({ experimentId, onBack, onSubmit, submitRef }) {
  const exp = experimentById[experimentId];
  const [stress, setStress] = useState(4);
  const [energy, setEnergy] = useState(7);
  const [mood, setMood] = useState(7);
  const [completed, setCompleted] = useState(true);
  const [moodTag, setMoodTag] = useState('good');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = () => {
    setSubmitting(true);
    setTimeout(() => {
      onSubmit();
      setSubmitting(false);
    }, 1200);
  };

  useEffect(() => {
    if (!submitRef) return undefined;
    submitRef.current = handleSubmit;
    return () => {
      submitRef.current = null;
    };
  });

  return (
    <>
      <StatusBar />
      <div className="body-scroll page-body" style={{ padding: '0 20px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '4px 0 18px' }}>
          <BackButton onClick={onBack} />
          <div>
            <p className="mono" style={{ fontSize: 11, color: 'var(--text-dim)' }}>
              {exp?.name || 'Experiment'} · Day 8
            </p>
            <h2 className="syne-title" style={{ fontSize: 20 }}>
              Daily Observation
            </h2>
          </div>
        </div>

        <div
          style={{
            background: 'rgba(6,214,160,.08)',
            border: '1px solid rgba(6,214,160,.2)',
            borderRadius: 'var(--rm)',
            padding: '10px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginBottom: 16,
          }}
        >
          <span style={{ fontSize: 18 }}>⚡</span>
          <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--neon-teal)' }}>
            Under 30 seconds · Just slide and submit
          </p>
        </div>

        <div className="filter-bar">
          <DropdownPill label="Mood tag" value={moodTag} onChange={setMoodTag} options={MOOD_OPTIONS} />
        </div>

        <div
          style={{
            background: 'var(--lab-panel)',
            border: '1px solid var(--lab-border)',
            borderRadius: 'var(--r)',
            padding: 18,
            marginBottom: 14,
          }}
        >
          <SliderRow label="😌 Stress level" value={stress} onChange={setStress} color="var(--neon-blue)" minLabel="Very calm" maxLabel="Very stressed" />
          <SliderRow label="⚡ Energy" value={energy} onChange={setEnergy} color="var(--neon-teal)" borderTop />
          <SliderRow label="😊 Mood" value={mood} onChange={setMood} color="var(--neon-purple)" borderTop />
        </div>

        <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-bright)', marginBottom: 10 }}>
          Did you complete today&apos;s experiment?
        </p>
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          <button
            type="button"
            className={`toggle-btn ${completed ? 'yes' : ''}`}
            onClick={() => setCompleted(true)}
          >
            ✓ Yes
          </button>
          <button
            type="button"
            className={`toggle-btn ${!completed ? 'no' : ''}`}
            onClick={() => setCompleted(false)}
          >
            Not today
          </button>
        </div>

        <textarea
          style={{
            width: '100%',
            background: 'var(--lab-panel)',
            border: '1px solid var(--lab-border)',
            borderRadius: 'var(--rm)',
            padding: '12px 14px',
            fontSize: 13,
            fontFamily: "'DM Sans', sans-serif",
            color: 'var(--text-mid)',
            resize: 'none',
            outline: 'none',
          }}
          rows={3}
          placeholder="Optional: any notes or observations today…"
        />

      </div>
    </>
  );
}

function SliderRow({ label, value, onChange, color, minLabel, maxLabel, borderTop }) {
  return (
    <div style={{ marginBottom: borderTop ? 0 : 20, paddingTop: borderTop ? 16 : 0, borderTop: borderTop ? '1px solid var(--lab-border)' : undefined }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
        <label style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-bright)' }}>{label}</label>
        <span className="mono" style={{ fontSize: 15, fontWeight: 800, color }}>
          {value}
        </span>
      </div>
      <input type="range" min="1" max="10" value={value} step="1" onChange={(e) => onChange(Number(e.target.value))} />
      {minLabel && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 5 }}>
          <span style={{ fontSize: 10, color: 'var(--text-dim)' }}>{minLabel}</span>
          <span style={{ fontSize: 10, color: 'var(--text-dim)' }}>{maxLabel}</span>
        </div>
      )}
    </div>
  );
}
