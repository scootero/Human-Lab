import labData from '../data/labData.json';

export const { categories, experiments } = labData;

export const experimentById = Object.fromEntries(
  experiments.map((e) => [e.id, e])
);

export const CATEGORY_EINSTEIN = {
  sleep: 'Sleep — ze foundation of EVERYTHING! Studies here often cascade into energy, mood, AND focus. Most exciting territory!',
  energy: 'Energy experiments are fascinating — you will FEEL ze data before you even log it. Very satisfying science!',
  focus: 'Focus is ze superpower of ze 21st century! Let us measure yours, ja!',
  mood: 'Mood studies reveal how surprisingly controllable our emotional baseline truly is. Shocking!',
  fitness: 'Physical experiments produce ze most visible data! Ze body does not lie.',
  weight_loss: 'We are discovering WHICH interventions move ze needle for YOUR biology — not counting calories.',
  stress: 'Stress studies produce ze fastest measurable results — your nervous system responds in 3–7 days!',
  relationships: 'Human connection has measurable effects on cortisol and longevity. Pioneering research!',
  confidence: 'Confidence is a SKILL with measurable inputs. Ze data often surprises people!',
  money: 'Behavioral economics meets personal science! Extraordinary territory.',
  learning: 'Ze brain is remarkably plastic at any age. Small daily inputs compound beautifully.',
  longevity: 'Long-term healthspan experiments — ze foundation that lifts everything else.',
  adventure: 'Ze Curiosity Lab! Zese experiments rewrite how you see ze world. Science should be fun!',
  better_human: 'Kindness, purpose, gratitude — ze most under-measured interventions in personal science.',
  purchases_products: 'Experiments requiring a purchase — we track ROI on ze investment, not just ze habit.',
};

export const EXPERIMENT_EMOJI = {
  morning_sunlight: '☀️',
  magnesium_glycinate: '💊',
  consistent_bedtime: '🛏️',
  no_screens_before_bed: '📵',
  cold_bedroom: '❄️',
  reading_before_bed: '📖',
  caffeine_delay: '☕',
  sleep_optimization: '🌙',
  watch_sunrise: '🌅',
  walk_8000_steps: '👟',
  electrolytes: '💧',
  hydration_goal: '🥤',
  protein_breakfast: '🥚',
  nature_walk: '🌿',
  resistance_training: '🏋️',
  daily_walk: '🚶',
  zone_2_cardio: '❤️‍🔥',
  fiber_goal: '🥦',
  intermittent_fasting: '⏱️',
  no_liquid_calories: '🚫',
  walking: '🚶‍♂️',
  mediterranean_diet: '🫒',
  creatine: '⚡',
  meditation: '🧘',
  deep_work_session: '🎯',
  pomodoro_method: '🍅',
  notification_detox: '🔕',
  single_tasking: '1️⃣',
  box_breathing: '🫁',
  read_10_pages: '📚',
  learn_language: '🗣️',
  active_recall: '🧠',
  spaced_repetition: '🔁',
  gratitude_journal: '📔',
  exercise: '💪',
  make_someone_smile: '😊',
  random_act_of_kindness: '💝',
  journaling: '✍️',
  protein_goal: '🥩',
  mobility_routine: '🤸',
  food_logging: '📝',
  buy_someone_flowers: '💐',
  surprise_someone_nice: '🎁',
  handwrite_letter: '✉️',
  call_parent_grandparent: '📞',
  tell_someone_good_job: '👏',
  date_night: '🌹',
  start_one_conversation: '💬',
  make_stranger_laugh: '😂',
  give_genuine_compliment: '⭐',
  attend_event_alone: '🎭',
  introduce_yourself_first: '🤝',
  track_expenses: '💳',
  no_spend_day: '🛑',
  budget_review: '📊',
  automatic_investing: '📈',
  savings_challenge: '🏦',
  teach_someone: '👨‍🏫',
  go_for_hike: '⛰️',
  try_new_restaurant_happy_hour: '🍽️',
  explore_new_area: '🗺️',
  take_day_trip: '🚗',
  volunteer: '🤲',
  help_without_recognition: '🕊️',
  reconnect_with_someone: '🔗',
  write_5_life_goals: '🎯',
  thankful_before_dinner: '🙏',
  make_old_person_laugh: '👴',
  blood_pressure_tracking: '🩺',
};

export function getExperimentEmoji(id) {
  return EXPERIMENT_EMOJI[id] || '🧪';
}

export function getExperimentsForCategory(categoryId) {
  const cat = categories.find((c) => c.id === categoryId);
  if (!cat) return [];
  return cat.experimentIds
    .map((id) => experimentById[id])
    .filter(Boolean);
}

export function formatTime(minutes) {
  if (minutes >= 45) return `${minutes} min/day`;
  return `${minutes} min`;
}

export function formatCost(cost) {
  if (cost.costType === 'free') return 'Free';
  return cost.costTier === 'varies' ? 'Purchase' : cost.costTier;
}

export function difficultyLabel(d) {
  return ['', 'Easy', 'Moderate', 'Hard', 'Expert'][d] || 'Moderate';
}

export function studyDays(timeMinutes, difficulty) {
  if (timeMinutes <= 5 && difficulty <= 2) return 7;
  if (timeMinutes >= 45 || difficulty >= 3) return 21;
  return 14;
}

export function buildHypothesis(exp) {
  return `"Consistent ${exp.name.toLowerCase()} for ${studyDays(exp.timeMinutes, exp.difficulty)} days will produce measurable improvements in ${exp.linkedCategoryNames.slice(0, 2).join(' and ')}."`;
}

export function buildProtocol(exp) {
  const mins = exp.timeMinutes;
  if (mins >= 45) {
    return `Dedicate ${mins} minutes daily to ${exp.name.toLowerCase()}. Log how you feel before and after. Stay consistent — ze data needs repetition to reveal patterns.`;
  }
  return `Spend ${mins} minutes on ${exp.name.toLowerCase()} each day. Same time if possible. Track daily — even small interventions compound over ${studyDays(exp.timeMinutes, exp.difficulty)} days.`;
}

export function buildScienceFact(exp) {
  const score = exp.scienceScore;
  if (score >= 90) {
    return `"${exp.name} has strong evidence behind it — science score ${score}/100! Ze effect size is well-documented in peer-reviewed literature. Excellent choice for a rigorous study, ja!"`;
  }
  if (score >= 80) {
    return `"Solid research supports ${exp.name.toLowerCase()} — ${score}/100 on ze science meter. Individual response varies, which is exactly why we run YOUR experiment!"`;
  }
  return `"${exp.name} scores ${score}/100 on evidence — but personal science matters! What works in studies may work differently for YOU. That is ze whole point of ze lab!"`;
}
