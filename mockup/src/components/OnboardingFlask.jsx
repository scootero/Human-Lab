import ExperimentFlask from './ExperimentFlask';

const SCREEN_MIN_LEVEL = {
  welcome: 0,
  category: 1,
  experiments: 1,
  detail: 3,
  active: 4,
  checkin: 4,
  results: 5,
};

export function getFlaskLevelForScreen(screen, flaskLevel) {
  const floor = SCREEN_MIN_LEVEL[screen] ?? 0;
  return Math.max(flaskLevel, floor);
}

export default function OnboardingFlask({ screen, flaskLevel, categoryId, pulseKey }) {
  const displayLevel = getFlaskLevelForScreen(screen, flaskLevel);

  return (
    <div className="corner-beaker" aria-hidden>
      <ExperimentFlask level={displayLevel} categoryId={categoryId} pulseKey={pulseKey} />
    </div>
  );
}
