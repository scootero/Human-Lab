import { useEffect, useId, useState } from 'react';

const CATEGORY_COLORS = {
  sleep: '#6366f1',
  energy: '#fbbf24',
  focus: '#3b82f6',
  mood: '#a855f7',
  fitness: '#f43f5e',
  weight_loss: '#06d6a0',
  stress: '#8b5cf6',
  relationships: '#ec4899',
  confidence: '#f97316',
  money: '#22c55e',
  learning: '#0ea5e9',
  longevity: '#14b8a6',
  productivity: '#eab308',
  nutrition: '#84cc16',
  curiosity: '#f59e0b',
  entrepreneurship: '#6366f1',
  kindness: '#d946ef',
  planet: '#10b981',
  creativity: '#f472b6',
  supplement_curiosity: '#64748b',
  adventure: '#eab308',
  better_human: '#d946ef',
  purchases_products: '#64748b',
};

const LEVEL_CONFIG = {
  0: { fillY: 88, fillH: 0, bubbles: 0, sparks: 0, dryIce: true, fizz: false, shake: false },
  1: { fillY: 80, fillH: 10, bubbles: 1, sparks: 0, dryIce: false, fizz: false, shake: false, drip: true },
  2: { fillY: 72, fillH: 18, bubbles: 2, sparks: 0, dryIce: false, fizz: false, shake: false },
  3: { fillY: 64, fillH: 26, bubbles: 3, sparks: 1, dryIce: false, fizz: true, shake: false },
  4: { fillY: 56, fillH: 34, bubbles: 3, sparks: 2, dryIce: false, fizz: true, shake: false },
  5: { fillY: 48, fillH: 42, bubbles: 4, sparks: 2, dryIce: false, fizz: true, shake: true },
  6: { fillY: 42, fillH: 48, bubbles: 5, sparks: 3, dryIce: false, fizz: true, shake: true },
};

const BUBBLE_DEFS = [
  { cx: 35, cy: 72, r: 2.5, color: 'rgba(6,214,160,.6)', dur: 2.2, begin: 0 },
  { cx: 50, cy: 78, r: 1.8, color: 'rgba(59,130,246,.7)', dur: 1.7, begin: 0.6 },
  { cx: 42, cy: 68, r: 1.4, color: 'rgba(168,85,247,.6)', dur: 2.8, begin: 1.1 },
  { cx: 38, cy: 74, r: 2, color: 'rgba(6,214,160,.5)', dur: 2, begin: 0.3 },
  { cx: 54, cy: 70, r: 1.6, color: 'rgba(59,130,246,.6)', dur: 1.9, begin: 0.8 },
];

function DryIceWisp({ d, dAlt, delay, opacity = 0.55 }) {
  return (
    <path
      d={d}
      fill="none"
      stroke={`rgba(200,230,255,${opacity})`}
      strokeWidth="2.5"
      strokeLinecap="round"
    >
      <animate attributeName="opacity" values={`0;${opacity};0`} dur="3s" repeatCount="indefinite" begin={`${delay}s`} />
      <animate attributeName="d" values={`${d};${dAlt};${d}`} dur="3s" repeatCount="indefinite" begin={`${delay}s`} />
    </path>
  );
}

export default function ExperimentFlask({ level = 0, categoryId, pulseKey = 0 }) {
  const uid = useId().replace(/:/g, '');
  const clipId = `bc-${uid}`;
  const [pouring, setPouring] = useState(false);

  const cfg = LEVEL_CONFIG[Math.min(level, 6)] || LEVEL_CONFIG[0];
  const accent = CATEGORY_COLORS[categoryId] || '#06d6a0';
  const liquidColor = level >= 2 ? `rgba(${hexToRgb(accent)},.35)` : 'rgba(6,214,160,.25)';

  useEffect(() => {
    if (pulseKey > 0 && level > 0) {
      setPouring(true);
      const t = setTimeout(() => setPouring(false), 900);
      return () => clearTimeout(t);
    }
  }, [pulseKey, level]);

  return (
    <div
      className={[
        'experiment-flask',
        `experiment-flask--level-${Math.min(level, 6)}`,
        pouring ? 'experiment-flask--pouring' : '',
        cfg.fizz ? 'experiment-flask--fizz' : '',
        cfg.shake ? 'experiment-flask--shake' : '',
        cfg.dryIce ? 'experiment-flask--dry-ice' : '',
      ].filter(Boolean).join(' ')}
      aria-hidden
      style={{ '--flask-accent': accent }}
    >
      <svg width="64" height="72" viewBox="0 0 90 100" style={{ overflow: 'visible' }}>
        <defs>
          <clipPath id={clipId}>
            <path d="M28 20 L20 80 Q20 88 28 88 L62 88 Q70 88 70 80 L62 20 Z" />
          </clipPath>
        </defs>

        {/* Dry-ice fog — welcome prep */}
        {cfg.dryIce && (
          <g className="experiment-flask__dry-ice">
            <ellipse cx="45" cy="92" rx="22" ry="6" fill="rgba(180,220,255,0.18)">
              <animate attributeName="opacity" values="0.1;0.35;0.1" dur="2.5s" repeatCount="indefinite" />
              <animate attributeName="rx" values="18;26;18" dur="2.5s" repeatCount="indefinite" />
            </ellipse>
            <DryIceWisp d="M38 14 Q32 4 36 -6" dAlt="M38 10 Q28 -2 34 -14" delay={0} />
            <DryIceWisp d="M45 12 Q48 0 44 -10" dAlt="M45 8 Q52 -6 46 -16" delay={0.5} opacity={0.7} />
            <DryIceWisp d="M52 14 Q58 2 54 -8" dAlt="M52 10 Q64 -4 56 -14" delay={1} />
            <DryIceWisp d="M42 18 Q36 8 40 -2" dAlt="M42 14 Q30 2 38 -8" delay={1.5} opacity={0.4} />
            <DryIceWisp d="M50 16 Q56 6 52 -4" dAlt="M50 12 Q60 0 54 -10" delay={2} opacity={0.45} />
            {/* frost inside glass */}
            <circle cx="32" cy="62" r="1.5" fill="rgba(220,240,255,0.5)" />
            <circle cx="56" cy="58" r="1.2" fill="rgba(220,240,255,0.4)" />
            <circle cx="40" cy="70" r="1" fill="rgba(220,240,255,0.35)" />
            <circle cx="52" cy="66" r="1.3" fill="rgba(220,240,255,0.45)" />
          </g>
        )}

        {/* Beaker body — original welcome design */}
        <path
          d="M28 20 L20 80 Q20 88 28 88 L62 88 Q70 88 70 80 L62 20 Z"
          fill="none"
          stroke="#3b82f6"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <rect x="28" y="10" width="34" height="14" rx="3" fill="none" stroke="#3b82f6" strokeWidth="2.5" />

        {/* Liquid fill */}
        {cfg.fillH > 0 && (
          <g clipPath={`url(#${clipId})`}>
            <rect
              className="experiment-flask__liquid"
              x="18"
              y={cfg.fillY}
              width="56"
              height={cfg.fillH}
              fill={liquidColor}
            >
              {cfg.fillH >= 20 && (
                <animate attributeName="y" values={`${cfg.fillY};${cfg.fillY - 2};${cfg.fillY}`} dur="3s" repeatCount="indefinite" />
              )}
            </rect>
            <ellipse
              cx="45"
              cy={cfg.fillY + 1}
              rx="24"
              ry="5"
              fill={accent}
              opacity="0.35"
            />
          </g>
        )}

        {/* Drip animation — first drop on category */}
        {(cfg.drip || pouring) && (
          <circle className="experiment-flask__drip" cx="45" cy="24" r="3" fill={accent} opacity="0.85">
            <animate attributeName="cy" values="24;78;24" dur="1.2s" repeatCount={pouring ? '1' : 'indefinite'} />
            <animate attributeName="opacity" values="0;0.9;0" dur="1.2s" repeatCount={pouring ? '1' : 'indefinite'} />
          </circle>
        )}

        {/* Rising bubbles — original welcome style */}
        {cfg.bubbles > 0 &&
          BUBBLE_DEFS.slice(0, cfg.bubbles).map((b, i) => (
            <circle key={i} cx={b.cx} cy={b.cy} r={b.r} fill={b.color}>
              <animate attributeName="cy" values={`${b.cy + 3};${cfg.fillY - 4}`} dur={`${b.dur}s`} repeatCount="indefinite" begin={`${b.begin}s`} />
              <animate attributeName="opacity" values="0;1;0" dur={`${b.dur}s`} repeatCount="indefinite" begin={`${b.begin}s`} />
            </circle>
          ))}

        {/* Fizz particles at higher levels */}
        {cfg.fizz &&
          [
            [36, 70], [48, 66], [42, 74], [52, 72],
          ].map(([x, y], i) => (
            <circle key={`f-${i}`} cx={x} cy={y} r="1.2" fill={i % 2 ? accent : '#a855f7'} opacity="0">
              <animate attributeName="cy" values={`${y};${y - 16}`} dur="0.5s" repeatCount="indefinite" begin={`${i * 0.15}s`} />
              <animate attributeName="opacity" values="0;1;0" dur="0.5s" repeatCount="indefinite" begin={`${i * 0.15}s`} />
            </circle>
          ))}

        {/* Sparkles — original welcome ✦ */}
        {cfg.sparks >= 1 && (
          <text x="68" y="30" fontSize="14" fill="#fbbf24">
            ✦
            {cfg.sparks >= 2 && (
              <animate attributeName="opacity" values="1;0.4;1" dur="1.5s" repeatCount="indefinite" />
            )}
          </text>
        )}
        {cfg.sparks >= 2 && (
          <text x="10" y="50" fontSize="10" fill="#a855f7">
            ✦
            <animate attributeName="opacity" values="0.4;1;0.4" dur="1.8s" repeatCount="indefinite" begin="0.4s" />
          </text>
        )}
        {cfg.sparks >= 3 && (
          <text x="72" y="55" fontSize="11" fill="#06d6a0">
            ✦
            <animateTransform
              attributeName="transform"
              type="rotate"
              values="0 72 55;180 72 55;360 72 55"
              dur="2s"
              repeatCount="indefinite"
            />
          </text>
        )}

        {/* Glass highlight */}
        <path d="M32 28 C30 48 29 66 31 78" stroke="rgba(255,255,255,0.15)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      </svg>
    </div>
  );
}

function hexToRgb(hex) {
  const h = hex.replace('#', '');
  const n = parseInt(h, 16);
  return `${(n >> 16) & 255},${(n >> 8) & 255},${n & 255}`;
}
