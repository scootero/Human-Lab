import { useEffect, useState } from 'react';
import {
  categories,
  CATEGORY_EINSTEIN,
  experimentById,
  getExperimentsByTier,
  getExperimentsForCategory,
  buildHypothesis,
} from '../utils/labHelpers';
import MadScientistArt from './MadScientistArt';

export const CORNER_MESSAGES = {
  welcome: 'Welcome to ze lab! Ready to run your first experiment?',
  category: 'Pick a focus area — I am very curious vich one you choose!',
  experiments: 'Ah, excellent! Tap a study pill to see ze details.',
  detail: 'Read ze hypothesis — zen ve begin collecting data!',
  active: 'Ze experiment is live! Log daily for ze best signal.',
  checkin: 'Quick observation — just slide and submit, ja?',
  results: 'Wunderbar! Your data tells a real story.',
};

function stripQuotes(text) {
  return text.replace(/^"|"$/g, '').trim();
}

export function getEinsteinMessage(screen, { categoryId, experimentId } = {}) {
  switch (screen) {
    case 'welcome':
      return CORNER_MESSAGES.welcome;
    case 'category':
      if (categoryId) {
        return CATEGORY_EINSTEIN[categoryId] || CORNER_MESSAGES.category;
      }
      return 'Hmm… vich area of life shall ve investigate first? Pick a pill above — zen ve reveal ze matching experiments!';
    case 'experiments': {
      if (!categoryId) return CORNER_MESSAGES.experiments;
      const category = categories.find((c) => c.id === categoryId);
      const all = getExperimentsForCategory(categoryId);
      const { tier1 } = getExperimentsByTier(categoryId);
      return category
        ? `${all.length} experiments for ${category.name} — ${tier1.length} best starters at ze top, many more below!`
        : CORNER_MESSAGES.experiments;
    }
    case 'detail': {
      const exp = experimentById[experimentId];
      if (!exp) return CORNER_MESSAGES.detail;
      return stripQuotes(buildHypothesis(exp));
    }
    case 'active':
      return CORNER_MESSAGES.active;
    case 'checkin':
      return CORNER_MESSAGES.checkin;
    case 'results': {
      const exp = experimentById[experimentId];
      const name = exp?.name?.toLowerCase() || 'your experiment';
      return `Wunderbar! Your results for ${name} exceeded ze community average — zis is ze personal discovery effect I love to see! Magnificent data, ja!`;
    }
    default:
      return '';
  }
}

function useTypewriter(text, { startDelay = 600, charDelay = 32, enabled = true } = {}) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!enabled || !text) {
      setDisplayed('');
      setDone(false);
      return undefined;
    }

    setDisplayed('');
    setDone(false);
    let charIndex = 0;
    let charTimer;
    const startTimer = setTimeout(() => {
      const typeNext = () => {
        charIndex += 1;
        setDisplayed(text.slice(0, charIndex));
        if (charIndex < text.length) {
          charTimer = setTimeout(typeNext, charDelay);
        } else {
          setDone(true);
        }
      };
      typeNext();
    }, startDelay);

    return () => {
      clearTimeout(startTimer);
      clearTimeout(charTimer);
    };
  }, [text, startDelay, charDelay, enabled]);

  return { displayed, done };
}

function useScrollBlur(screen) {
  const [blur, setBlur] = useState(0);

  useEffect(() => {
    const el = document.querySelector('.screen.on .body-scroll');
    if (!el) {
      setBlur(0);
      return undefined;
    }

    const onScroll = () => {
      const amount = Math.min(14, el.scrollTop * 0.06);
      setBlur(amount);
    };

    onScroll();
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, [screen]);

  return blur;
}

export default function CornerScientist({
  screen,
  message,
  primaryAction,
  secondaryAction,
  detailLabel,
  hidden = false,
}) {
  const text = message || getEinsteinMessage(screen) || '';
  const { displayed, done } = useTypewriter(text, { enabled: Boolean(text) && !hidden });
  const scrollBlur = useScrollBlur(screen);

  if (!text || hidden) return null;

  const showActions = done && (primaryAction || secondaryAction);

  return (
    <div
      className="scientist-dock scientist-dock--enter"
      style={{ '--dock-blur': `${scrollBlur}px` }}
      role="region"
      aria-label="Dr. Einstein"
    >
      <div className="scientist-dock__backdrop" aria-hidden />
      <div className="scientist-dock__inner">
        <div className="scientist-dock__dialog">
          <div className="scientist-dock__bubble">
            <p className="scientist-dock__label">{detailLabel || 'DR. EINSTEIN'}</p>
            <p className="scientist-dock__message">
              <span className="scientist-dock__message-ghost" aria-hidden="true">
                {text}
              </span>
              <span className="scientist-dock__message-visible">
                {displayed}
                {!done && <span className="scientist-dock__cursor" aria-hidden />}
              </span>
            </p>
          </div>
          {showActions && (
            <div className="scientist-dock__actions">
              {primaryAction && (
                <button
                  type="button"
                  className={`btn scientist-dock__btn ${primaryAction.variant ? `btn-${primaryAction.variant}` : 'btn-primary'}`}
                  onClick={primaryAction.onClick}
                  disabled={primaryAction.disabled}
                >
                  {primaryAction.label}
                </button>
              )}
              {secondaryAction && (
                <button
                  type="button"
                  className={`btn scientist-dock__btn ${secondaryAction.variant ? `btn-${secondaryAction.variant}` : 'btn-ghost'}`}
                  onClick={secondaryAction.onClick}
                  disabled={secondaryAction.disabled}
                >
                  {secondaryAction.label}
                </button>
              )}
            </div>
          )}
        </div>
        <div className={`scientist-dock__figure ${!done ? 'scientist-dock__figure--wiggle' : ''}`}>
          <MadScientistArt variant="peek-right" />
        </div>
      </div>
    </div>
  );
}
