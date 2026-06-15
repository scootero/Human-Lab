import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { categories, getExperimentsForCategory, getExperimentEmoji } from '../utils/labHelpers';
import { StatusBar, StepDots } from '../components/shared';

const SLIDE_LEFT_MS = 420;
const SLIDE_UP_MS = 480;

export default function CategoryScreen({ selectedCategory, onSelectCategory, onNext, onBack, onOpenDetail }) {
  const [showHint, setShowHint] = useState(!selectedCategory);
  const [viewMode, setViewMode] = useState(() => (selectedCategory ? 'focused' : 'grid'));
  const [animPhase, setAnimPhase] = useState(null);
  const timersRef = useRef([]);

  const clearAnimTimers = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  }, []);

  const startFocusAnimation = useCallback(() => {
    clearAnimTimers();
    setViewMode('animating');
    setAnimPhase('slide-left');
    timersRef.current.push(
      setTimeout(() => setAnimPhase('slide-up'), SLIDE_LEFT_MS),
      setTimeout(() => {
        setAnimPhase(null);
        setViewMode('focused');
      }, SLIDE_LEFT_MS + SLIDE_UP_MS)
    );
  }, [clearAnimTimers]);

  const handleCategoryClick = useCallback(
    (id) => {
      setShowHint(false);

      if (viewMode === 'focused' && selectedCategory === id) {
        clearAnimTimers();
        setViewMode('grid');
        setAnimPhase(null);
        return;
      }

      if (viewMode === 'focused' && selectedCategory !== id) {
        onSelectCategory(id);
        return;
      }

      onSelectCategory(id);
      startFocusAnimation();
    },
    [viewMode, selectedCategory, onSelectCategory, startFocusAnimation, clearAnimTimers]
  );

  useEffect(() => () => clearAnimTimers(), [clearAnimTimers]);

  useEffect(() => {
    if (!selectedCategory) {
      clearAnimTimers();
      setViewMode('grid');
      setAnimPhase(null);
    }
  }, [selectedCategory, clearAnimTimers]);

  const selectedCat = categories.find((c) => c.id === selectedCategory);
  const experiments = useMemo(
    () => (selectedCategory ? getExperimentsForCategory(selectedCategory) : []),
    [selectedCategory]
  );

  const isFocused = viewMode === 'focused';
  const isAnimating = viewMode === 'animating';
  const showExperiments =
    selectedCat &&
    experiments.length > 0 &&
    (isFocused || (isAnimating && animPhase === 'slide-up'));

  const stageClass = [
    'category-stage',
    viewMode !== 'grid' ? `category-stage--${viewMode}` : '',
    animPhase ? `category-stage--${animPhase}` : '',
  ]
    .filter(Boolean)
    .join(' ');

  const pageClass = [
    'body-scroll',
    'page-body',
    'category-page',
    selectedCategory ? 'category-page--focused' : '',
    showExperiments ? 'category-page--has-experiments' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <>
      <StatusBar />
      <div className={pageClass}>
        <div className="category-page__top">
          <div className="category-page__header">
            <StepDots step={1} total={3} />
            <p className="lbl">Step 1 — Pick your focus</p>
            <h2 className="syne-title category-page__title">What are we testing?</h2>
            <p className="category-page__subtitle">
              {isFocused
                ? 'Tap your category to browse others, or pick an experiment below.'
                : 'Tap a category pill — matching experiments appear below.'}
            </p>
          </div>

          <p className={`lbl category-lbl ${isFocused ? 'category-lbl--compact' : ''}`}>
            {isFocused ? 'Your focus' : 'Categories'}
          </p>
          <div className={stageClass}>
            <div className="category-track">
              {categories.map((cat, i) => (
                <button
                  key={cat.id}
                  type="button"
                  className={`pill pill-selectable category-pill ${selectedCategory === cat.id ? 'selected' : ''}`}
                  style={{ '--pill-i': i }}
                  onClick={() => handleCategoryClick(cat.id)}
                >
                  {cat.emoji} {cat.name}
                  <span className="category-pill-count">({cat.experimentCount})</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {selectedCategory ? (
          <div className="category-page__einstein-slot" aria-hidden />
        ) : (
          <div className="category-page__spacer" aria-hidden />
        )}

        {showExperiments && (
          <div
            className={`category-page__experiments experiments-reveal ${isAnimating ? 'experiments-reveal--during-anim' : 'experiments-reveal--settled'}`}
          >
            <p className="lbl">Experiments</p>
            <div className="pill-row">
              {experiments.map((exp, i) => (
                <button
                  key={exp.id}
                  type="button"
                  className="pill pill-selectable experiment-pill-item"
                  style={{ '--exp-i': i }}
                  onClick={() => onOpenDetail(exp.id)}
                >
                  {getExperimentEmoji(exp.id)} {exp.name}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="category-page__footer">
          {showHint && !selectedCategory && (
            <p className="category-page__hint">Select at least one category to continue</p>
          )}

          <div className="category-page__actions">
            <button type="button" className="btn btn-ghost category-page__back" onClick={onBack}>
              ←
            </button>
            <button
              type="button"
              className="btn btn-primary"
              disabled={!selectedCategory}
              onClick={onNext}
              style={{ flex: 1 }}
            >
              See Experiments →
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
