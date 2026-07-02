import { useCallback, useEffect, useRef, useState } from 'react';
import { categories } from '../utils/labHelpers';
import { StatusBar, StepDots } from '../components/shared';

const SLIDE_LEFT_MS = 420;
const SLIDE_UP_MS = 480;
const ANIM_TOTAL_MS = SLIDE_LEFT_MS + SLIDE_UP_MS;

export default function CategoryScreen({ selectedCategory, onCategoryChosen }) {
  const [showHint, setShowHint] = useState(!selectedCategory);
  const [viewMode, setViewMode] = useState('grid');
  const [animPhase, setAnimPhase] = useState(null);
  const timersRef = useRef([]);
  const pendingCategoryRef = useRef(null);

  const clearAnimTimers = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  }, []);

  const startFocusAnimation = useCallback(
    (categoryId) => {
      clearAnimTimers();
      pendingCategoryRef.current = categoryId;
      setViewMode('animating');
      setAnimPhase('slide-left');
      timersRef.current.push(
        setTimeout(() => setAnimPhase('slide-up'), SLIDE_LEFT_MS),
        setTimeout(() => {
          setAnimPhase(null);
          setViewMode('grid');
          const id = pendingCategoryRef.current;
          pendingCategoryRef.current = null;
          if (id) onCategoryChosen(id);
        }, ANIM_TOTAL_MS)
      );
    },
    [clearAnimTimers, onCategoryChosen]
  );

  const handleCategoryClick = useCallback(
    (id) => {
      setShowHint(false);
      startFocusAnimation(id);
    },
    [startFocusAnimation]
  );

  useEffect(() => () => clearAnimTimers(), [clearAnimTimers]);

  const isAnimating = viewMode === 'animating';

  const stageClass = [
    'category-stage',
    viewMode !== 'grid' ? `category-stage--${viewMode}` : '',
    animPhase ? `category-stage--${animPhase}` : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <>
      <StatusBar />
      <div className="body-scroll page-body category-page">
        <div className="category-page__top">
          <div className="category-page__header">
            <StepDots step={1} total={3} />
            <p className="lbl">Step 1 — Pick your focus</p>
            <h2 className="syne-title category-page__title">What are we testing?</h2>
            <p className="category-page__subtitle">
              Tap a category — we will show you matching experiments.
            </p>
          </div>

          <p className="lbl category-lbl">Categories</p>
          <div className={stageClass}>
            <div className="category-track">
              {categories.map((cat, i) => (
                <button
                  key={cat.id}
                  type="button"
                  className={`pill pill-selectable category-pill ${selectedCategory === cat.id ? 'selected' : ''}`}
                  style={{ '--pill-i': i }}
                  onClick={() => handleCategoryClick(cat.id)}
                  disabled={isAnimating}
                >
                  {cat.emoji} {cat.name}
                  <span className="category-pill-count">({cat.experimentCount})</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="category-page__footer">
          {showHint && (
            <p className="category-page__hint">Select a category to see experiments</p>
          )}
        </div>
      </div>
    </>
  );
}
