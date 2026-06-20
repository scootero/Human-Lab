import { useEffect, useState } from 'react';
import MadScientistArt from './MadScientistArt';

function useTypewriter(text, { startDelay = 400, charDelay = 32 } = {}) {
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

export default function DetailHypothesisScientist({ hypothesis }) {
  const { displayed, done } = useTypewriter(hypothesis);

  return (
    <div className="detail-hypothesis-scientist" aria-hidden>
      <div className="detail-hypothesis-scientist__bubble">
        <p className="detail-hypothesis-scientist__label">HYPOTHESIS</p>
        <p className="detail-hypothesis-scientist__message">
          <span className="detail-hypothesis-scientist__ghost">{hypothesis}</span>
          <span className="detail-hypothesis-scientist__visible">
            {displayed}
            {!done && <span className="corner-scientist__cursor" aria-hidden />}
          </span>
        </p>
      </div>
      <div className="detail-hypothesis-scientist__figure">
        <MadScientistArt variant="peek-left" />
      </div>
    </div>
  );
}
