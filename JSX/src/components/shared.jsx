export function EinsteinBubble({ message, label = "⚗️ Dr. Einstein's recommendation", dock = false }) {
  return (
    <div className={`einstein-wrap einstein-wrap--solo${dock ? ' einstein-wrap--dock' : ''}`}>
      <div className="einstein-bubble">
        <p>{message}</p>
        {label && <p className="fact-label">{label}</p>}
      </div>
    </div>
  );
}

export function StatusBar() {
  return (
    <div className="sb">
      <span style={{ color: 'var(--neon-teal)' }}>HUM_LAB</span>
      <span>9:41</span>
    </div>
  );
}

export function BackButton({ onClick }) {
  return (
    <div className="back" onClick={onClick} role="button" tabIndex={0}>
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="var(--text-mid)" strokeWidth="2" strokeLinecap="round">
        <path d="M11 3L5 9l6 6" />
      </svg>
    </div>
  );
}

export function BeakerLogo() {
  return (
    <div className="beaker-wrap">
      <svg width="90" height="100" viewBox="0 0 90 100" style={{ overflow: 'visible' }}>
        <path d="M28 20 L20 80 Q20 88 28 88 L62 88 Q70 88 70 80 L62 20 Z" fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinejoin="round" />
        <rect x="28" y="10" width="34" height="14" rx="3" fill="none" stroke="#3b82f6" strokeWidth="2.5" />
        <clipPath id="bc">
          <path d="M28 20 L20 80 Q20 88 28 88 L62 88 Q70 88 70 80 L62 20 Z" />
        </clipPath>
        <rect x="18" y="56" width="56" height="34" fill="rgba(6,214,160,.25)" clipPath="url(#bc)">
          <animate attributeName="y" values="56;52;56" dur="3s" repeatCount="indefinite" />
        </rect>
        <circle cx="35" cy="72" r="2.5" fill="rgba(6,214,160,.6)">
          <animate attributeName="cy" values="75;55" dur="2.2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0;1;0" dur="2.2s" repeatCount="indefinite" />
        </circle>
        <circle cx="50" cy="78" r="1.8" fill="rgba(59,130,246,.7)">
          <animate attributeName="cy" values="80;58" dur="1.7s" repeatCount="indefinite" begin="0.6s" />
          <animate attributeName="opacity" values="0;1;0" dur="1.7s" repeatCount="indefinite" begin="0.6s" />
        </circle>
        <circle cx="42" cy="68" r="1.4" fill="rgba(168,85,247,.6)">
          <animate attributeName="cy" values="72;52" dur="2.8s" repeatCount="indefinite" begin="1.1s" />
          <animate attributeName="opacity" values="0;1;0" dur="2.8s" repeatCount="indefinite" begin="1.1s" />
        </circle>
        <text x="68" y="30" fontSize="14" fill="#fbbf24">
          ✦
        </text>
        <text x="10" y="50" fontSize="10" fill="#a855f7">
          ✦
        </text>
      </svg>
    </div>
  );
}

export function StepDots({ step, total = 3 }) {
  return (
    <div className="step-dots">
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          className={`step-dot ${i < step ? 'done' : ''} ${i === step ? 'active' : ''}`}
        />
      ))}
    </div>
  );
}

export function DropdownPill({ label, value, onChange, options }) {
  return (
    <div className="dropdown-pill">
      <select value={value} onChange={(e) => onChange(e.target.value)} aria-label={label}>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export function NavBar({ active, onNavigate, className = '' }) {
  return (
    <div className={`nb ${className}`.trim()}>
      <button type="button" className={`ni ${active === 'lab' ? 'a' : ''}`} onClick={() => onNavigate('onboard')}>
        <svg viewBox="0 0 24 24">
          <path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18" />
        </svg>
        <span>Lab</span>
      </button>
      <button type="button" className={`ni ${active === 'active' ? 'a' : ''}`} onClick={() => onNavigate('active')}>
        <svg viewBox="0 0 24 24">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
        <span>Active</span>
      </button>
      <button type="button" className={`ni ${active === 'results' ? 'a' : ''}`} onClick={() => onNavigate('results')}>
        <svg viewBox="0 0 24 24">
          <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
          <polyline points="17 6 23 6 23 12" />
        </svg>
        <span>Results</span>
      </button>
    </div>
  );
}

export function DevNav({ screens, current, onGo }) {
  return (
    <div className="dev-nav">
      {screens.map((s) => (
        <button key={s.id} type="button" onClick={() => onGo(s.id)}>
          {s.label}
        </button>
      ))}
    </div>
  );
}
