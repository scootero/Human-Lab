import { useMemo } from 'react';
import {
  getExperimentsByTier,
  getExperimentEmoji,
  categories,
} from '../utils/labHelpers';
import { StatusBar, StepDots } from '../components/shared';

function shortName(name) {
  return name.replace(/^The /, '');
}


function ExperimentPill({ exp, tier, onOpenDetail }) {
  const isLocked = tier === 3;
  const isMuted = tier === 2;

  return (
    <button
      type="button"
      className={[
        'pill',
        'pill-selectable',
        'experiment-list-pill',
        isMuted ? 'experiment-list-pill--muted' : '',
        isLocked ? 'experiment-list-pill--locked' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      onClick={() => !isLocked && onOpenDetail(exp.id)}
      disabled={isLocked}
      aria-disabled={isLocked}
    >
      {isLocked && <span className="experiment-list-pill__lock" aria-hidden>🔒 </span>}
      {getExperimentEmoji(exp)} {shortName(exp.name)}
    </button>
  );
}

function PillSection({ label, experiments, tier, onOpenDetail }) {
  if (!experiments.length) return null;

  return (
    <section className="experiments-page__section">
      {label && <p className="lbl category-lbl">{label}</p>}
      <div className="pill-row experiments-page__pills">
        {experiments.map((exp) => (
          <ExperimentPill
            key={exp.id}
            exp={exp}
            tier={tier}
            onOpenDetail={onOpenDetail}
          />
        ))}
      </div>
    </section>
  );
}

export default function ExperimentListScreen({ categoryId, onOpenDetail }) {
  const category = categories.find((c) => c.id === categoryId);
  const tiers = useMemo(() => getExperimentsByTier(categoryId), [categoryId]);
  const totalCount = tiers.tier1.length + tiers.tier2.length + tiers.tier3.length;
  const hasPremium = tiers.tier3.length > 0;
  const startableCount = tiers.tier1.length + tiers.tier2.length;

  return (
    <>
      <StatusBar />
      <div className="body-scroll page-body category-page experiments-page">
        <div className="experiments-page__top">
          <div className="category-page__header">
            <StepDots step={2} total={3} />
            <p className="lbl">Step 2 — Choose study</p>
            <h2 className="syne-title category-page__title">
              {category?.emoji} {category?.name}
            </h2>
            <p className="category-page__subtitle">
              {totalCount} experiments · {startableCount} ready to start
              {hasPremium ? ` · scroll for ${tiers.tier3.length} Lab Plus` : ''}
            </p>
          </div>

          <PillSection
            label={`Start here (${tiers.tier1.length})`}
            experiments={tiers.tier1}
            tier={1}
            onOpenDetail={onOpenDetail}
          />

          <PillSection
            label={tiers.tier2.length ? `More experiments (${tiers.tier2.length})` : null}
            experiments={tiers.tier2}
            tier={2}
            onOpenDetail={onOpenDetail}
          />
        </div>

        {hasPremium && <div className="experiments-page__scroll-spacer" aria-hidden />}

        {hasPremium && (
          <div className="experiments-page__premium">
            <PillSection
              label={`Lab Plus (${tiers.tier3.length})`}
              experiments={tiers.tier3}
              tier={3}
              onOpenDetail={onOpenDetail}
            />
            <p className="tier-lock-cta">Unlock Lab Plus to start these advanced experiments</p>
          </div>
        )}

        <div className="category-page__footer" />
      </div>
    </>
  );
}
