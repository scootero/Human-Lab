import { useEffect, useLayoutEffect, useState } from 'react';
import MadScientistArt from './MadScientistArt';

function useTypewriter(text, { startDelay = 350, charDelay = 28 } = {}) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!text) {
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
  }, [text, startDelay, charDelay]);

  return { displayed, done };
}

export default function SectionTourGuide({
  step,
  stepIndex,
  stepCount,
  sectionRef,
  scrollRootRef,
  onContinue,
  continueLabel = 'Continue →',
}) {
  const { displayed, done } = useTypewriter(step.message);
  const [anchor, setAnchor] = useState({ top: 140, placement: 'below' });

  useLayoutEffect(() => {
    const scrollEl = scrollRootRef?.current;
    const sectionEl = sectionRef?.current;

    if (!sectionEl || !scrollEl) {
      setAnchor({ top: 160, placement: 'below' });
      return;
    }

    const scrollRect = scrollEl.getBoundingClientRect();
    const sectionRect = sectionEl.getBoundingClientRect();
    const relativeTop = sectionRect.top - scrollRect.top + scrollEl.scrollTop;
    const sectionBottom = relativeTop + sectionRect.height;
    const guideHeight = 130;
    const fitsBelow = sectionBottom + guideHeight + 12 < scrollEl.scrollHeight;

    setAnchor({
      top: fitsBelow ? sectionBottom + 8 : Math.max(8, relativeTop - guideHeight - 8),
      placement: fitsBelow ? 'below' : 'above',
    });

    scrollEl.scrollTo({
      top: Math.max(0, relativeTop - 24),
      behavior: 'smooth',
    });
  }, [stepIndex, sectionRef, scrollRootRef, step.sectionKey]);

  return (
    <div className="section-tour" role="dialog" aria-live="polite" aria-label="Page tour">
      <div className="section-tour__veil" aria-hidden />
      <div
        className={`section-tour__guide section-tour__guide--${anchor.placement} section-tour__guide--enter`}
        style={{ top: anchor.top }}
      >
        <div className="section-tour__dialog">
          <div className="section-tour__bubble">
            <p className="section-tour__label">{step.label || 'DR. EINSTEIN'}</p>
            <p className="section-tour__message">
              <span className="section-tour__ghost" aria-hidden="true">
                {step.message}
              </span>
              <span className="section-tour__visible">
                {displayed}
                {!done && <span className="section-tour__cursor" aria-hidden />}
              </span>
            </p>
          </div>
          {done && (
            <button type="button" className="btn btn-teal section-tour__continue" onClick={onContinue}>
              {stepIndex >= stepCount - 1 ? 'Got it!' : continueLabel}
            </button>
          )}
        </div>
        <div className={`section-tour__figure ${!done ? 'section-tour__figure--wiggle' : ''}`}>
          <MadScientistArt variant="peek-left" />
        </div>
      </div>
      <div className="section-tour__progress" aria-hidden>
        {Array.from({ length: stepCount }, (_, i) => (
          <span key={i} className={`section-tour__dot ${i <= stepIndex ? 'section-tour__dot--on' : ''}`} />
        ))}
      </div>
    </div>
  );
}
