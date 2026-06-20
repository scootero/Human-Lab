import { useCallback, useMemo, useRef, useState } from 'react';
import { ConfettiCanvas } from './components/Confetti';
import CornerScientist, { getEinsteinMessage } from './components/CornerScientist';
import { experimentById, getTierForCategory } from './utils/labHelpers';
import OnboardingFlask from './components/OnboardingFlask';
import { DevNav, NavBar } from './components/shared';
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
  const [activeTourRunning, setActiveTourRunning] = useState(false);
  const scrollRefs = useRef({});
  const checkInSubmitRef = useRef(null);

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

  const handleCategoryChosen = useCallback(
    (id) => {
      setCategoryId(id);
      bumpFlask(2);
      go('experiments');
    },
    [bumpFlask, go]
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

  const detailLocked = useMemo(() => {
    if (screen !== 'detail' || !experimentId) return false;
    const exp = experimentById[experimentId];
    if (!exp) return false;
    const tier = categoryId ? getTierForCategory(exp, categoryId) : exp.displayTier;
    return tier === 3;
  }, [screen, experimentId, categoryId]);

  const dockActions = useMemo(() => {
    switch (screen) {
      case 'welcome':
        return {
          primary: { label: 'Enter the Lab →', onClick: handleEnterLab },
          secondary: { label: 'Already have a study running', onClick: () => go('active'), variant: 'ghost' },
        };
      case 'category':
        return {
          primary: { label: '← Back', onClick: () => go('welcome'), variant: 'ghost' },
        };
      case 'experiments':
        return {
          primary: { label: '← Back', onClick: () => go('category'), variant: 'ghost' },
        };
      case 'detail':
        return detailLocked
          ? {
              primary: {
                label: 'Lab Plus required to start',
                onClick: () => {},
                variant: 'ghost',
                disabled: true,
              },
            }
          : {
              primary: { label: 'Accept Experiment ⚗️', onClick: handleAcceptExperiment, variant: 'teal' },
            };
      case 'active':
        return {};
      case 'checkin':
        return {
          primary: {
            label: 'Submit Observation →',
            onClick: () => checkInSubmitRef.current?.(),
            variant: 'teal',
          },
        };
      case 'results':
        return {
          primary: { label: 'Start Next Experiment →', onClick: () => go('category') },
        };
      default:
        return {};
    }
  }, [
    screen,
    detailLocked,
    handleEnterLab,
    handleAcceptExperiment,
    go,
  ]);

  const dockDetailLabel = screen === 'detail' ? 'HYPOTHESIS' : undefined;

  return (
    <>
      <div className={`phone${screen === 'active' ? ' phone--with-nav' : ''}`} id="app">
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
          primaryAction={dockActions.primary}
          secondaryAction={dockActions.secondary}
          detailLabel={dockDetailLabel}
          hidden={screen === 'active' && activeTourRunning}
        />

        <div className={`screen ${screen === 'welcome' ? 'on' : ''}`} id="welcome">
          <WelcomeScreen />
        </div>

        <div className={`screen ${screen === 'category' ? 'on' : ''}`} id="category">
          <CategoryScreen
            selectedCategory={categoryId}
            onCategoryChosen={handleCategoryChosen}
          />
        </div>

        <div className={`screen ${screen === 'experiments' ? 'on' : ''}`} id="experiments">
          <ExperimentListScreen
            categoryId={categoryId}
            onOpenDetail={handleOpenExperiment}
          />
        </div>

        <div className={`screen ${screen === 'detail' ? 'on' : ''}`} id="detail">
          {experimentId && (
            <ExperimentDetailScreen
              experimentId={experimentId}
              categoryId={categoryId}
              onBack={() => go('experiments')}
            />
          )}
        </div>

        <div className={`screen ${screen === 'active' ? 'on' : ''}`} id="active">
          <ActiveDashboardScreen
            experimentId={experimentId || 'three_good_things_lab'}
            onTourActiveChange={setActiveTourRunning}
          />
        </div>

        <div className={`screen ${screen === 'checkin' ? 'on' : ''}`} id="checkin">
          <CheckInScreen
            experimentId={experimentId || 'three_good_things_lab'}
            onBack={() => go('active')}
            onSubmit={() => go('active')}
            submitRef={checkInSubmitRef}
          />
        </div>

        <div className={`screen ${screen === 'results' ? 'on' : ''}`} id="results">
          <ResultsScreen experimentId={experimentId || 'three_good_things_lab'} />
        </div>

        {screen === 'active' && (
          <NavBar active="active" onNavigate={handleNav} className="nb--screen-bottom" />
        )}
      </div>

      <DevNav screens={SCREENS} current={screen} onGo={go} />
    </>
  );
}
