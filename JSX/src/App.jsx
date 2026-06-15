import { useCallback, useMemo, useRef, useState } from 'react';
import { ConfettiCanvas } from './components/Confetti';
import CornerScientist, { getEinsteinMessage } from './components/CornerScientist';
import OnboardingFlask from './components/OnboardingFlask';
import { DevNav } from './components/shared';
import WelcomeScreen from './screens/WelcomeScreen';
import CategoryScreen from './screens/CategoryScreen';
import ExperimentListScreen from './screens/ExperimentListScreen';
import ExperimentDetailScreen from './screens/ExperimentDetailScreen';
import ActiveDashboardScreen from './screens/ActiveDashboardScreen';
import CheckInScreen from './screens/CheckInScreen';
import ResultsScreen from './screens/ResultsScreen';

const SCREENS = [
  { id: 'welcome', label: 'Welcome' },
  { id: 'category', label: 'Category' },
  { id: 'experiments', label: 'Experiments' },
  { id: 'detail', label: 'Detail' },
  { id: 'active', label: 'Active' },
  { id: 'checkin', label: 'Check-in' },
  { id: 'results', label: 'Results' },
];

export default function App() {
  const [screen, setScreen] = useState('welcome');
  const [categoryId, setCategoryId] = useState(null);
  const [experimentId, setExperimentId] = useState(null);
  const [flaskLevel, setFlaskLevel] = useState(0);
  const [flaskPulse, setFlaskPulse] = useState(0);
  const scrollRefs = useRef({});

  const go = useCallback((id) => {
    setScreen(id);
    requestAnimationFrame(() => {
      const el = scrollRefs.current[id];
      if (el) el.scrollTop = 0;
    });
  }, []);

  const bumpFlask = useCallback((level) => {
    setFlaskLevel((prev) => Math.max(prev, level));
    setFlaskPulse((prev) => prev + 1);
  }, []);

  const handleEnterLab = useCallback(() => {
    bumpFlask(1);
    go('category');
  }, [bumpFlask, go]);

  const handleSelectCategory = useCallback(
    (id) => {
      setCategoryId(id);
      bumpFlask(2);
    },
    [bumpFlask]
  );

  const handleOpenExperiment = useCallback(
    (id) => {
      setExperimentId(id);
      bumpFlask(3);
      go('detail');
    },
    [bumpFlask, go]
  );

  const handleAcceptExperiment = useCallback(() => {
    bumpFlask(5);
    go('active');
  }, [bumpFlask, go]);

  const handleNav = (tab) => {
    if (tab === 'lab') go('category');
    else if (tab === 'active') go('active');
    else if (tab === 'results') go('results');
  };

  const einsteinMessage = useMemo(
    () => getEinsteinMessage(screen, { categoryId, experimentId }),
    [screen, categoryId, experimentId]
  );

  const einsteinDock = useMemo(() => {
    if (screen !== 'category') return { dockBottom: 172 };

    if (categoryId) {
      return { dockTop: 196 };
    }

    return { dockBottom: 300 };
  }, [screen, categoryId]);

  return (
    <>
      <div className="phone" id="app">
        <ConfettiCanvas active={screen === 'results'} />
        <OnboardingFlask
          screen={screen}
          flaskLevel={flaskLevel}
          categoryId={categoryId}
          pulseKey={flaskPulse}
        />
        <CornerScientist
          key={`${screen}-${einsteinMessage}`}
          screen={screen}
          message={einsteinMessage}
          dockBottom={einsteinDock.dockBottom}
          dockTop={einsteinDock.dockTop}
        />

        <div className={`screen ${screen === 'welcome' ? 'on' : ''}`} id="welcome">
          <WelcomeScreen onNext={handleEnterLab} onSkip={() => go('active')} />
        </div>

        <div className={`screen ${screen === 'category' ? 'on' : ''}`} id="category">
          <CategoryScreen
            selectedCategory={categoryId}
            onSelectCategory={handleSelectCategory}
            onNext={() => go('experiments')}
            onBack={() => go('welcome')}
            onOpenDetail={handleOpenExperiment}
          />
        </div>

        <div className={`screen ${screen === 'experiments' ? 'on' : ''}`} id="experiments">
          <ExperimentListScreen
            categoryId={categoryId}
            onOpenDetail={handleOpenExperiment}
            onBack={() => go('category')}
          />
        </div>

        <div className={`screen ${screen === 'detail' ? 'on' : ''}`} id="detail">
          {experimentId && (
            <ExperimentDetailScreen
              experimentId={experimentId}
              onBack={() => go('experiments')}
              onAccept={handleAcceptExperiment}
            />
          )}
        </div>

        <div className={`screen ${screen === 'active' ? 'on' : ''}`} id="active">
          <ActiveDashboardScreen
            experimentId={experimentId || 'journaling'}
            onLogData={() => go('checkin')}
            onNavigate={handleNav}
          />
        </div>

        <div className={`screen ${screen === 'checkin' ? 'on' : ''}`} id="checkin">
          <CheckInScreen
            experimentId={experimentId || 'journaling'}
            onBack={() => go('active')}
            onSubmit={() => go('active')}
          />
        </div>

        <div className={`screen ${screen === 'results' ? 'on' : ''}`} id="results">
          <ResultsScreen
            experimentId={experimentId || 'journaling'}
            onRestart={() => go('category')}
          />
        </div>
      </div>

      <DevNav screens={SCREENS} current={screen} onGo={go} />
    </>
  );
}
