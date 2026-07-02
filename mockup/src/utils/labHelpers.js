import labData from '../data/labData.json';
import studies from '../data/studies.json';

export const { categories, experiments } = labData;

export const experimentById = Object.fromEntries(
  experiments.map((e) => [e.id, e])
);

const categoryById = Object.fromEntries(categories.map((c) => [c.id, c]));

export const CATEGORY_EINSTEIN = {
  stress: 'Stress studies produce ze fastest measurable results — your nervous system responds in 3–7 days!',
  sleep: 'Sleep — ze foundation of EVERYTHING! Studies here often cascade into energy, mood, AND focus.',
  energy: 'Energy experiments are fascinating — you will FEEL ze data before you even log it. Very satisfying science!',
  mood: 'Mood studies reveal how surprisingly controllable our emotional baseline truly is. Shocking!',
  focus: 'Focus is ze superpower of ze 21st century! Let us measure yours, ja!',
  productivity: 'Execution experiments turn intentions into outcomes — small plans, big compounding effects!',
  weight_loss: 'We are discovering WHICH interventions move ze needle for YOUR biology — not counting calories.',
  fitness: 'Physical experiments produce ze most visible data! Ze body does not lie.',
  nutrition: 'Food experiments with real evidence — what you eat changes how you feel within days.',
  relationships: 'Human connection has measurable effects on cortisol and longevity. Pioneering research!',
  confidence: 'Confidence is a SKILL with measurable inputs. Ze data often surprises people!',
  money: 'Behavioral economics meets personal science! Extraordinary territory.',
  learning: 'Ze brain is remarkably plastic at any age. Small daily inputs compound beautifully.',
  longevity: 'Long-term healthspan experiments — ze foundation that lifts everything else.',
  curiosity: 'Ze Curiosity Lab! Zese experiments rewrite how you see ze world. Science should be fun!',
  entrepreneurship: 'Test ze market with real humans — zat is personal science for builders!',
  kindness: 'Kindness, purpose, gratitude — ze most under-measured interventions in personal science.',
  planet: 'Small daily choices add up to real planetary impact. Let us measure yours!',
  creativity: 'Creativity thrives under constraints — walk, sketch, bad ideas, repeat!',
  supplement_curiosity: 'Curiosity only! Zese are experiments, not medical advice. Proceed with healthy skepticism.',
};

export const CLAIM_STRENGTH_LABELS = {
  direct_trial: 'Direct trial',
  systematic_review: 'Systematic review',
  adjacent_evidence: 'Adjacent evidence',
  curiosity_only: 'Curiosity only',
};

export function getExperimentEmoji(expOrId) {
  if (typeof expOrId === 'string') {
    return experimentById[expOrId]?.emoji || '🧪';
  }
  return expOrId?.emoji || '🧪';
}

export function getLinkedCategoryNames(exp) {
  return (exp.categories || [])
    .map((id) => categoryById[id]?.name)
    .filter(Boolean);
}

export function getTierForCategory(exp, categoryId) {
  if (exp.categoryTiers?.[categoryId] != null) return exp.categoryTiers[categoryId];
  return exp.displayTier ?? 2;
}

export function getExperimentsForCategory(categoryId) {
  const cat = categories.find((c) => c.id === categoryId);
  if (!cat) return [];
  return cat.experimentIds
    .map((id) => experimentById[id])
    .filter(Boolean);
}

const START_HERE_TARGET = 15;
const START_HERE_MIN = 12;

export function getExperimentsByTier(categoryId) {
  const list = getExperimentsForCategory(categoryId);
  const tier3 = list.filter((e) => getTierForCategory(e, categoryId) === 3);
  const startable = list.filter((e) => getTierForCategory(e, categoryId) !== 3);

  let startHereCount = START_HERE_TARGET;
  if (startable.length < START_HERE_MIN) {
    startHereCount = startable.length;
  } else {
    startHereCount = Math.min(START_HERE_TARGET, startable.length);
  }

  return {
    tier1: startable.slice(0, startHereCount),
    tier2: startable.slice(startHereCount),
    tier3,
  };
}

export function resolveScienceSources(refs = []) {
  return refs
    .map((ref) => (studies[ref] ? { ref, ...studies[ref] } : null))
    .filter(Boolean);
}

export function formatTime(minutes) {
  if (minutes >= 45) return `${minutes} min/day`;
  return `${minutes} min`;
}

export function formatCost(cost) {
  if (!cost || cost.costType === 'free') return 'Free';
  return cost.costTier === 'varies' ? 'Purchase' : cost.costTier || 'Purchase';
}

export function difficultyLabel(d) {
  return ['', 'Easy', 'Moderate', 'Hard', 'Expert'][d] || 'Moderate';
}

export function studyDays(exp) {
  if (exp.durationDaysMax) return exp.durationDaysMax;
  if (exp.durationDaysMin) return exp.durationDaysMin;
  const timeMinutes = exp.timeMinutes ?? 10;
  const difficulty = exp.difficulty ?? 2;
  if (timeMinutes <= 5 && difficulty <= 2) return 7;
  if (timeMinutes >= 45 || difficulty >= 3) return 21;
  return 14;
}

export function formatNoticeWindow(exp) {
  const min = exp.noticeDaysMin ?? 5;
  const max = exp.noticeDaysMax ?? 10;
  if (min === max) return `${min} days`;
  return `${min}–${max} days`;
}

export function formatDurationNotice(exp) {
  const days = studyDays(exp);
  return `${days} days — notice shifts in ${formatNoticeWindow(exp)}`;
}

export function buildHypothesis(exp) {
  const names = getLinkedCategoryNames(exp);
  const days = studyDays(exp);
  return `"Consistent ${exp.name.toLowerCase()} for ${days} days will produce measurable improvements in ${names.slice(0, 2).join(' and ') || 'your focus area'}."`;
}

export function buildProtocol(exp) {
  if (exp.action) return exp.action;
  const mins = exp.timeMinutes ?? 10;
  const days = studyDays(exp);
  return `Spend ${mins} minutes on ${exp.name.toLowerCase()} each day. Same time if possible. Track daily — even small interventions compound over ${days} days.`;
}

export function buildScienceFact(exp) {
  const claim = CLAIM_STRENGTH_LABELS[exp.claimStrength] || 'Science-backed';
  const sources = resolveScienceSources(exp.scienceRefs);
  if (sources.length === 0) {
    return `"${exp.name} is a curiosity experiment — explore with an open mind and track what YOU notice. Personal science matters!"`;
  }
  if (exp.claimStrength === 'direct_trial' || exp.claimStrength === 'systematic_review') {
    return `"${exp.name} has ${claim.toLowerCase()} support — ${sources.length} source${sources.length > 1 ? 's' : ''} behind it. Excellent choice for a rigorous study, ja!"`;
  }
  return `"${exp.name} is backed by ${claim.toLowerCase()} — individual response varies, which is exactly why we run YOUR experiment!"`;
}

export { studies };
