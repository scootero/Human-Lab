import { useEffect, useState } from 'react';
import {
  categories,
  CATEGORY_EINSTEIN,
  experimentById,
  getExperimentsForCategory,
  buildScienceFact,
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
      const count = getExperimentsForCategory(categoryId).length;
      const plural = count !== 1 ? 's' : '';
      return category
        ? `${category.name} — ${count} experiment${plural} ready. Tap a pill to see ze details!`
        : CORNER_MESSAGES.experiments;
    }
    case 'detail': {
      const exp = experimentById[experimentId];
      if (!exp) return CORNER_MESSAGES.detail;
      return stripQuotes(buildScienceFact(exp));
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

function useTypewriter(text, { startDelay = 1200, charDelay = 38, enabled = true } = {}) {
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

/** Fixed dock — same side and size on every screen; position varies by screen */
const DOCK = { side: 'left', defaultBottom: 172 };

export default function CornerScientist({ screen, message, dockBottom, dockTop }) {
  const text = message || getEinsteinMessage(screen) || '';
  const { displayed, done } = useTypewriter(text, { enabled: Boolean(text) });

  if (!text) return null;

  const variant = DOCK.side === 'left' ? 'peek-left' : 'peek-right';
  const useTop = dockTop != null;
  const positionStyle = useTop
    ? { top: dockTop, bottom: 'auto' }
    : { bottom: dockBottom ?? DOCK.defaultBottom };

  return (
    <div
      className={[
        'corner-scientist',
        'corner-scientist--enter',
        `corner-scientist--${DOCK.side}`,
        useTop ? 'corner-scientist--top' : 'corner-scientist--bottom',
      ].join(' ')}
      style={positionStyle}
      aria-hidden
    >
      <div className={`corner-scientist__bubble corner-scientist__bubble--${DOCK.side}`}>
        <p className="corner-scientist__message">
          <span className="corner-scientist__message-ghost" aria-hidden="true">
            {text}
          </span>
          <span className="corner-scientist__message-visible">
            {displayed}
            {!done && <span className="corner-scientist__cursor" aria-hidden />}
          </span>
        </p>
      </div>
      <div className={`corner-scientist__figure corner-scientist__figure--${DOCK.side}`}>
        <MadScientistArt variant={variant} />
      </div>
    </div>
  );
}
