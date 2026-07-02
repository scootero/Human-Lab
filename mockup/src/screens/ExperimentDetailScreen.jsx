import { useState } from 'react';
import {
  experimentById,
  getExperimentEmoji,
  buildProtocol,
  difficultyLabel,
  formatCost,
  formatTime,
  formatDurationNotice,
  getLinkedCategoryNames,
  resolveScienceSources,
  CLAIM_STRENGTH_LABELS,
} from '../utils/labHelpers';
import { StatusBar, BackButton } from '../components/shared';

const METRIC_LABELS = {
  stress: 'stress',
  mood: 'mood',
  energy: 'energy',
  sleep: 'sleep',
  focus: 'focus',
  fitness: 'fitness',
  confidence: 'confidence',
  relationships: 'connection',
  creativity: 'creativity',
  learning: 'learning',
  productivity: 'productivity',
  nutrition: 'nutrition',
  weight_loss: 'weight',
  money: 'financial habits',
  kindness: 'kindness',
  planet: 'sustainability',
  longevity: 'vitality',
  entrepreneurship: 'momentum',
  curiosity: 'curiosity',
  supplement_curiosity: 'curiosity',
};

const FAKE_PARTICIPANTS = [
  { name: 'Sam', effect: 12 },
  { name: 'Jordan', effect: 8 },
  { name: 'Riley', effect: 15 },
  { name: 'Casey', effect: 6 },
  { name: 'Taylor', effect: 10 },
];

function formatEffect(value) {
  return value > 0 ? `+${value}%` : `${value}%`;
}

function ParticipantCell({ name, effect, isYou = false }) {
  return (
    <div className={`community-stats__cell${isYou ? ' community-stats__cell--you' : ''}`}>
      <span className="community-stats__avatar" aria-hidden>
        {isYou ? '★' : name[0]}
      </span>
      <span className="community-stats__name">{isYou ? 'You' : name}</span>
      {!isYou && <span className="community-stats__effect">{formatEffect(effect)}</span>}
    </div>
  );
}

export default function ExperimentDetailScreen({ experimentId, categoryId, onBack }) {
  const [sourcesOpen, setSourcesOpen] = useState(true);
  const exp = experimentById[experimentId];
  if (!exp) return null;

  const emoji = getExperimentEmoji(exp);
  const linkedNames = getLinkedCategoryNames(exp);
  const sources = resolveScienceSources(exp.scienceRefs);
  const claimLabel = CLAIM_STRENGTH_LABELS[exp.claimStrength] || 'Science-backed';
  const metricLabel = METRIC_LABELS[exp.primaryMetric] || 'wellbeing';
  const avgEffect = Math.round(
    FAKE_PARTICIPANTS.reduce((sum, p) => sum + p.effect, 0) / FAKE_PARTICIPANTS.length
  );

  return (
    <>
      <StatusBar />
      <div className="body-scroll page-body experiment-detail-page">
        <header className="experiment-detail-page__header">
          <BackButton onClick={onBack} />
          <div className="experiment-detail-page__title-row">
            <span className="experiment-detail-page__emoji">{emoji}</span>
            <div className="experiment-detail-page__title-block">
              <h2 className="syne-title experiment-detail-page__title">{exp.name}</h2>
              <div className="pill-row experiment-detail-page__meta">
                <span className="pill pill-sm pill-teal">{claimLabel}</span>
                <span className="pill pill-sm pill-dim">{formatCost(exp.cost)}</span>
                <span className="pill pill-sm pill-purple">{formatTime(exp.timeMinutes)}</span>
              </div>
            </div>
          </div>
        </header>

        <div className="experiment-detail-page__body">
          <div className="detail-card detail-card--blue">
            <p className="lbl detail-card__label">Protocol</p>
            <p className="detail-card__text">{buildProtocol(exp)}</p>
          </div>

          <div className="detail-card detail-card--teal">
            <p className="lbl detail-card__label">Duration</p>
            <p className="detail-card__text">{formatDurationNotice(exp)}</p>
          </div>

          {sources.length > 0 && (
            <div className="detail-card detail-card--purple detail-card--sources">
              <button
                type="button"
                className="science-sources-toggle detail-card__sources-toggle"
                onClick={() => setSourcesOpen((o) => !o)}
                aria-expanded={sourcesOpen}
              >
                <span className="pill pill-sm pill-teal">Science-backed</span>
                <span className="detail-card__sources-hint">
                  {sources.length} source{sources.length > 1 ? 's' : ''} {sourcesOpen ? '▲' : '▼'}
                </span>
              </button>
              {sourcesOpen && (
                <ul className="science-sources-list">
                  {sources.map((s) => (
                    <li key={s.ref}>
                      <a href={s.url} target="_blank" rel="noopener noreferrer">
                        {s.authors} — {s.title}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {exp.claimStrength === 'curiosity_only' && (
            <p className="experiment-detail-page__disclaimer">
              Curiosity experiment — not medical advice. Track what you notice.
            </p>
          )}

          <div className="pill-row experiment-detail-page__tags">
            {linkedNames.slice(0, 4).map((name) => (
              <span key={name} className="pill pill-sm pill-blue">
                {name}
              </span>
            ))}
            <span className="pill pill-sm pill-dim">{difficultyLabel(exp.difficulty)}</span>
          </div>

          <div className="detail-card detail-card--amber community-stats">
            <p className="lbl detail-card__label">Community lab</p>
            <p className="community-stats__headline">6 people running this experiment</p>

            <div className="community-stats__grid">
              <ParticipantCell {...FAKE_PARTICIPANTS[0]} />
              <ParticipantCell {...FAKE_PARTICIPANTS[1]} />
              <ParticipantCell {...FAKE_PARTICIPANTS[2]} />
              <ParticipantCell {...FAKE_PARTICIPANTS[3]} />
              <ParticipantCell isYou />
              <ParticipantCell {...FAKE_PARTICIPANTS[4]} />
            </div>

            <div className="community-stats__summary">
              <div className="community-stats__stat">
                <span className="community-stats__stat-value">{formatEffect(avgEffect)}</span>
                <span className="community-stats__stat-label">avg effect on {metricLabel}</span>
              </div>
              <div className="community-stats__stat">
                <span className="community-stats__stat-value">80%</span>
                <span className="community-stats__stat-label">report a positive change</span>
              </div>
            </div>

            <p className="community-stats__note">Preview data — real community stats coming soon</p>
          </div>
        </div>
      </div>
    </>
  );
}
