/**
 * Builds human_lab_experiments_v2.json and JSX/src/data/labData.json
 * from canvas experiment definitions with curated displayTier assignments.
 */
import { writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

const CATEGORIES = [
  { id: 'stress', name: 'Stress', emoji: '😌', description: 'Reduce tension, anxiety, and mental overload.' },
  { id: 'sleep', name: 'Sleep', emoji: '\uD83D\uDE34', description: 'Improve sleep quality, consistency, and recovery.' },
  { id: 'energy', name: 'Energy', emoji: '⚡', description: 'Feel more alert, energized, and physically ready.' },
  { id: 'mood', name: 'Mood', emoji: '😊', description: 'Feel happier, more positive, and emotionally steady.' },
  { id: 'focus', name: 'Focus', emoji: '🧠', description: 'Improve concentration, clarity, and attention.' },
  { id: 'productivity', name: 'Productivity', emoji: '🎯', description: 'Execute better, plan smarter, and finish what matters.' },
  { id: 'weight_loss', name: 'Weight Loss', emoji: '⚖️', description: 'Support fat loss, appetite control, and healthier habits.' },
  { id: 'fitness', name: 'Fitness', emoji: '🏋️', description: 'Build strength, endurance, and physical capability.' },
  { id: 'nutrition', name: 'Nutrition', emoji: '🥗', description: 'Eat better with simple, sustainable food experiments.' },
  { id: 'relationships', name: 'Relationships', emoji: '❤️', description: 'Improve connection with friends, family, and partners.' },
  { id: 'confidence', name: 'Confidence', emoji: '🔥', description: 'Build social courage, self-belief, and comfort in action.' },
  { id: 'money', name: 'Money', emoji: '💰', description: 'Improve financial habits, awareness, and discipline.' },
  { id: 'learning', name: 'Learning', emoji: '📚', description: 'Learn faster, retain more, and build useful skills.' },
  { id: 'longevity', name: 'Longevity', emoji: '🌱', description: 'Support long-term healthspan and disease prevention.' },
  { id: 'curiosity', name: 'Curiosity Lab', emoji: '🚀', description: 'Add novelty, exploration, and memorable experiences.' },
  { id: 'entrepreneurship', name: 'Entrepreneurship', emoji: '🧪', description: 'Test ideas, build courage, and talk to customers.' },
  { id: 'kindness', name: 'Kindness', emoji: '🤝', description: 'Practice kindness, purpose, and good deeds daily.' },
  { id: 'planet', name: 'Planet Saver', emoji: '🌎', description: 'Reduce environmental impact through small daily actions.' },
  { id: 'creativity', name: 'Creativity', emoji: '🎨', description: 'Spark ideas, play, and creative output.' },
  { id: 'supplement_curiosity', name: 'Supplement Curiosity', emoji: '🧬', description: 'Curiosity experiments — use carefully, not medical advice.' },
];

function slugify(name) {
  return name
    .replace(/^The /, '')
    .replace(/\$5/g, '5_dollar')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_|_$/g, '');
}

function parseDuration(d) {
  const s = d.replace(/\s/g, '').toLowerCase();
  const range = s.match(/(\d+)[–-](\d+)d/);
  if (range) return { min: +range[1], max: +range[2] };
  const single = s.match(/(\d+)d/);
  if (single) return { min: +single[1], max: +single[1] };
  return { min: 14, max: 14 };
}

function inferClaimStrength(refs) {
  if (!refs || refs.length === 0) return 'curiosity_only';
  const strengths = {
    direct_trial: 4,
    systematic_review: 3,
    adjacent_evidence: 2,
    curiosity_only: 1,
  };
  const studyStrength = {
    S1: 'direct_trial', S2: 'adjacent_evidence', S3: 'direct_trial', S4: 'direct_trial',
    S5: 'systematic_review', S6: 'systematic_review', S7: 'direct_trial', S8: 'direct_trial',
    S9: 'systematic_review', S10: 'direct_trial', S11: 'direct_trial', S12: 'adjacent_evidence',
    S13: 'adjacent_evidence', S14: 'direct_trial', S15: 'direct_trial', S16: 'direct_trial',
    S17: 'direct_trial', S18: 'adjacent_evidence', S19: 'adjacent_evidence', S20: 'adjacent_evidence',
    S21: 'direct_trial', S22: 'direct_trial', S23: 'systematic_review', S24: 'direct_trial',
    S25: 'systematic_review', S26: 'direct_trial', S27: 'systematic_review', S28: 'direct_trial',
    S29: 'systematic_review', S30: 'adjacent_evidence', S31: 'direct_trial', S32: 'direct_trial',
    S33: 'systematic_review', S34: 'systematic_review', S35: 'direct_trial', S36: 'systematic_review',
  };
  let best = 'curiosity_only';
  let bestScore = 0;
  for (const ref of refs) {
    const cs = studyStrength[ref] || 'curiosity_only';
    if (strengths[cs] > bestScore) {
      bestScore = strengths[cs];
      best = cs;
    }
  }
  return best;
}

function inferNoticeDays(action, durationMax) {
  const a = action.toLowerCase();
  if (a.includes('breath') || a.includes('caffeine') || a.includes('news')) return { min: 3, max: 7 };
  if (a.includes('sleep') || a.includes('bed') || a.includes('screen')) return { min: 7, max: 14 };
  if (a.includes('walk') || a.includes('exercise') || a.includes('train')) return { min: 7, max: 14 };
  if (a.includes('ask') || a.includes('reject') || a.includes('discount')) return { min: 1, max: 7 };
  if (durationMax >= 21) return { min: 14, max: 21 };
  return { min: 5, max: 10 };
}

function inferTimeMinutes(action) {
  const a = action.toLowerCase();
  if (a.includes('60 minute') || a.includes('60-minute')) return 60;
  if (a.includes('30 minute')) return 30;
  if (a.includes('25 minute')) return 25;
  if (a.includes('20 minute')) return 20;
  if (a.includes('10 minute')) return 10;
  if (a.includes('5 minute')) return 5;
  if (a.includes('3 minute')) return 3;
  if (a.includes('2 minute')) return 2;
  if (a.includes('1 minute')) return 1;
  if (a.includes('hour')) return 60;
  if (a.includes('steps') || a.includes('no ') || a.includes('avoid')) return 5;
  return 10;
}

function inferDifficulty(tier, action) {
  const a = action.toLowerCase();
  if (tier === 3) return 4;
  if (a.includes('ask') || a.includes('reject') || a.includes('neighbor') || a.includes('sell')) return 3;
  if (a.includes('21') || a.includes('30') || a.includes('3x')) return 3;
  if (tier === 1) return 1;
  return 2;
}

function inferCost(action, name) {
  const a = (action + name).toLowerCase();
  if (a.includes('magnesium') || a.includes('electrolyte') || a.includes('mushroom coffee') || a.includes('flowers')) {
    return { costType: 'purchase', costTier: 'low', estimatedCostUsd: 15 };
  }
  return { costType: 'free', costTier: 'free', estimatedCostUsd: 0 };
}

const EMOJI = {
  brain_dump_study: '📝', forest_reset: '🌲', '5_minute_breathing_lab': '🫁', no_news_window: '📰',
  evening_walk_downshift: '🚶', stretch_signal: '🤸', phone_free_morning: '📵',
  sunrise_switch: '☀️', digital_sunset: '🌅', same_time_sleep_lab: '🛏️', cool_room_trial: '❄️',
  magnesium_check: '💊', book_instead: '📖', caffeine_curfew: '☕',
  water_before_coffee_test: '💧', morning_walk_charge: '🚶', protein_start: '🥚', movement_snack: '⚡',
  caffeine_reset: '☕', electrolyte_check: '🧂', sleep_energy_link: '😴',
  three_good_things_lab: '📔', compliment_spark: '⭐', music_lift: '🎵', outdoor_mood_loop: '🌿',
  friend_ping: '💬', tiny_declutter: '🧹', joy_audit: '✨',
  phone_vault: '🔒', one_task_lab: '🎯', tomato_timer: '🍅', '20_20_20_eye_reset': '👁️',
  clean_desk_study: '🗂️', priority_card: '📋', study_before_scroll: '📱',
  top_three_test: '3️⃣', tomorrow_tonight_lab: '🌙', ten_minute_reset: '⏱️', no_phone_first_hour: '📵',
  one_project_rule: '📁', start_before_scroll: '💼', work_sprint: '🏃',
  '8k_step_study': '👟', protein_breakfast_test: '🥩', no_sugary_drink_trial: '🚫', food_photo_log: '📸',
  dinner_walk: '🌆', fiber_boost: '🥦', ultra_processed_pause: '🍽️',
  '10_min_mobility_lab': '🤸', core_check: '💪', push_up_alarm: '🏋️', chair_stand_test: '🪑',
  zone_2_trial: '❤️‍🔥', strength_3x_study: '🏋️', recovery_day_experiment: '😌',
  veggie_add_on: '🥗', protein_every_meal_test: '🍳', beans_are_back_lab: '🫘', mindful_bite: '🧘',
  whole_breakfast: '🌾', no_fast_food_trial: '🍔', mediterranean_plate: '🫒',
  appreciation_text: '💌', better_question: '❓', phone_down_dinner: '🍽️', forgotten_call: '📞',
  flowers_experiment: '💐', letter_lab: '✉️', listen_without_fixing_trial: '👂',
  discount_ask: '💰', rejection_rep: '🎯', speak_up_once: '🗣️', brave_action: '🦁',
  presence_posture: '🧍', self_compliment_lab: '💫', try_something_new_study: '🆕',
  no_spend_day: '🛑', receipt_reality_check: '🧾', '24_hour_cart_freeze': '⏳', subscription_hunt: '✂️',
  weekly_money_date: '📊', grocery_budget_study: '🛒', auto_save_trial: '🏦',
  one_page_rule: '📚', '10_min_audio_lab': '🎧', teach_the_wall_test: '🗣️', retrieval_rep: '🧠',
  one_new_word_study: '📝', skill_block: '🎯', write_one_thing_lab: '✍️',
  hourly_stand_up: '🧍', flamingo_balance_test: '🦩', daily_walk_baseline: '🚶', stretch_two_minute_lab: '🤸',
  hydration_baseline: '💧', no_alcohol_check: '🍷', wellness_stack_test: '🌟',
  tiny_adventure: '🗺️', tourist_day: '📸', opposite_opinion: '📰', random_route: '🛤️',
  no_complaint_day: '🤐', smile_first_study: '😊', question_collector: '❓',
  '5_dollar_sale': '💵', offer_test: '📋', problem_interview: '🎤', cold_ask: '📧',
  price_confidence_lab: '💲', landing_page_hypothesis: '📝', customer_language_hunt: '🔍',
  make_someone_smile_lab: '😊', good_job_signal: '👏', neighbor_knock: '🚪', helping_hand: '🤲',
  animal_shelter_hour: '🐾', good_deed_data_point: '🎁', positive_review_drop: '⭐',
  beans_not_beef_swap: '🫘', meatless_monday_lab: '🥬', fish_instead_study: '🐟', trash_ten: '🗑️',
  reusable_cup_trial: '♻️', recycle_right_check: '♻️', low_waste_lunch: '🥪',
  walking_ideas_lab: '💡', bad_ideas_sprint: '🌀', terrible_poem: '📜', pocket_sketch: '✏️',
  song_memory_lab: '🎶', constraint_game: '🎲', idea_walk: '🚶',
  mushroom_coffee_check: '☕', no_caffeine_trial: '🚫☕', no_added_salt_awareness_lab: '🧂',
  nutritional_yeast_add_on: '🥄', turmeric_food_test: '🟡', grounding_curiosity_check: '🌍',
};

// [name, action, duration, refs[], tier, tagline, emoji override optional]
const CATEGORY_EXPERIMENTS = {
  stress: [
    ['The Brain Dump Study', 'Write every worry in your head for 5 minutes before bed.', '7–14d', ['S2'], 1, 'before bed'],
    ['The 5-Minute Breathing Lab', 'Do 5 minutes of slow nasal breathing.', '7d', ['S12'], 1, 'slow breath'],
    ['The Forest Reset', 'Take a 10–20 minute walk outside with no phone audio.', '7–14d', ['S4', 'S5'], 1, 'nature walk'],
    ['The Evening Walk Downshift', 'Walk for 10 minutes after dinner.', '14d', ['S6'], 2, 'after dinner'],
    ['The Stretch Signal', 'Stretch for 3 minutes before bed.', '14d', ['S6'], 2, 'before bed'],
    ['The Phone-Free Morning', 'No phone for the first 30 minutes after waking.', '14d', ['S2', 'S3'], 2, 'no phone'],
    ['The No-News Window', 'Avoid news for the first 2 hours after waking.', '14d', ['S12'], 3, 'no news'],
  ],
  sleep: [
    ['The Sunrise Switch', 'Get outdoor light within 30 minutes of waking.', '14d', ['S9'], 1, 'morning light'],
    ['The Digital Sunset', 'No screens 60 minutes before bed.', '14d', ['S10'], 1, 'no screens'],
    ['The Caffeine Curfew', 'No caffeine after noon.', '14d', ['S9'], 1, 'no caffeine'],
    ['The Book Instead', 'Read a physical book for 10 minutes before bed.', '14d', ['S10', 'S9'], 2, 'read book'],
    ['The Cool Room Trial', 'Lower bedroom temperature / keep room cool for sleep.', '7d', ['S9'], 2, 'cool room'],
    ['The Same-Time Sleep Lab', 'Keep bedtime and wake time within a 30-minute window.', '21d', ['S9'], 2, 'consistent'],
    ['The Magnesium Check', 'Take magnesium only if safe for you, then track sleep.', '21d', ['S11'], 2, 'supplement'],
  ],
  energy: [
    ['The Water Before Coffee Test', 'Drink one full glass of water before caffeine.', '7d', ['S3'], 1, 'hydrate first'],
    ['The Morning Walk Charge', 'Walk 10 minutes in the morning.', '14d', ['S6'], 1, 'morning walk'],
    ['The Movement Snack', 'Every 2–3 hours, do 1 minute of movement.', '7d', ['S26'], 1, 'move often'],
    ['The Protein Start', 'Eat a protein-forward breakfast.', '14d', ['S7'], 2, 'protein AM'],
    ['The Caffeine Reset', 'Delay caffeine 60–90 minutes after waking.', '14d', ['S9'], 2, 'delay coffee'],
    ['The Sleep-Energy Link', 'Sleep 8 hours in bed and compare next-day energy.', '14d', ['S9'], 2, '8 hours'],
    ['The Electrolyte Check', 'Add electrolytes only when sweating heavily; track energy.', '7d', ['S3'], 3, 'electrolytes'],
  ],
  mood: [
    ['The Three Good Things Lab', 'Write 3 good things that happened today.', '14d', ['S1'], 1, 'gratitude'],
    ['The Compliment Spark', 'Give one genuine compliment daily.', '7d', ['S13', 'S16'], 1, 'compliment'],
    ['The Music Lift', 'Listen to one mood-boosting song intentionally.', '7d', ['S12'], 1, 'one song'],
    ['The Outdoor Mood Loop', 'Spend 10 minutes outside daily.', '14d', ['S4'], 2, 'outside'],
    ['The Tiny Declutter', 'Clear one small visible area.', '7d', ['S2'], 2, 'declutter'],
    ['The Joy Audit', 'Track one thing that gave you energy or joy.', '14d', ['S12'], 2, 'track joy'],
    ['The Friend Ping', 'Text or call one friend daily.', '14d', ['S15'], 3, 'daily call'],
  ],
  focus: [
    ['The Tomato Timer', '25 minutes focused work + 5 minute break.', '14d', ['S35'], 1, 'pomodoro'],
    ['The Phone Vault', 'Put phone in another room for 60 minutes.', '7d', ['S35'], 1, 'phone away'],
    ['The 20-20-20 Eye Reset', 'Every 20 minutes, look 20 feet away for 20 seconds.', '7d', ['S36'], 1, 'eye rest'],
    ['The One-Task Lab', 'Work on one task without task-switching.', '7d', ['S35'], 2, 'single task'],
    ['The Clean Desk Study', 'Clear your work surface before one work block.', '7d', ['S2'], 2, 'clear desk'],
    ['The Priority Card', 'Write the single most important task before starting.', '14d', ['S2'], 2, 'one priority'],
    ['The Study Before Scroll', 'Do 10 minutes of learning before social media.', '14d', ['S3'], 3, 'learn first'],
  ],
  productivity: [
    ['The Top Three Test', 'Write only 3 important tasks for the day.', '14d', ['S2'], 1, 'top three'],
    ['The Tomorrow Tonight Lab', 'Plan tomorrow before going to bed.', '14d', ['S2'], 1, 'plan ahead'],
    ['The Ten-Minute Reset', 'Set a 10-minute timer and reset your space/workflow.', '7d', ['S3'], 1, 'quick reset'],
    ['The Start Before Scroll', 'Do 5 minutes of work before checking feeds.', '14d', ['S3'], 2, 'work first'],
    ['The No-Phone First Hour', 'Avoid phone for first hour of the workday.', '14d', ['S35'], 2, 'no phone'],
    ['The Work Sprint', 'One 60-minute focused work block.', '14d', ['S35'], 2, 'deep work'],
    ['The One-Project Rule', 'Pick one project to advance before any new ideas.', '21d', ['S2'], 3, 'one project'],
  ],
  weight_loss: [
    ['The No-Sugary-Drink Trial', 'Replace sugary drinks with water/zero-calorie options.', '14d', ['S7'], 1, 'no soda'],
    ['The Protein Breakfast Test', 'Eat protein at breakfast.', '14d', ['S7'], 1, 'protein AM'],
    ['The 8K Step Study', 'Walk 8,000 steps daily.', '14d', ['S6'], 1, '8000 steps'],
    ['The Food Photo Log', 'Photograph meals before eating.', '7d', ['S34'], 2, 'photo log'],
    ['The Fiber Boost', 'Add beans, lentils, vegetables, or oats once daily.', '14d', ['S8'], 2, 'more fiber'],
    ['The Dinner Walk', 'Walk 20 minutes after dinner.', '21d', ['S6'], 2, 'after dinner'],
    ['The Ultra-Processed Pause', 'Avoid ultra-processed foods for one meal daily.', '14–30d', ['S7'], 3, 'skip UPF'],
  ],
  fitness: [
    ['The 10-Min Mobility Lab', 'Do 10 minutes of mobility daily.', '14d', ['S6'], 1, 'mobility'],
    ['The Core Check', 'Do one short core set daily.', '7d', ['S6'], 1, 'core daily'],
    ['The Daily Walk Baseline', 'Walk 20 minutes daily.', '14d', ['S6'], 1, '20 min walk'],
    ['The Push-Up Alarm', 'At 10, 12, and 2, do max clean pushups or a scaled version.', '7d', ['S29'], 2, 'pushups'],
    ['The Zone 2 Trial', 'Do conversational-pace cardio 3x/week.', '21d', ['S6'], 2, 'zone 2'],
    ['The Strength 3x Study', 'Strength train 3 times per week.', '21d', ['S6'], 2, '3x week'],
    ['The Chair Stand Test', 'Count chair stands in 30 seconds.', '7d', ['S27'], 3, 'chair test'],
  ],
  nutrition: [
    ['The Veggie Add-On', 'Add vegetables to 2 meals daily.', '14d', ['S8'], 1, 'more veggies'],
    ['The Mindful Bite', 'Eat one meal without screens.', '7d', ['S34'], 1, 'no screens'],
    ['The Beans Are Back Lab', 'Eat beans/lentils/chickpeas once daily.', '14d', ['S8', 'S31'], 1, 'daily beans'],
    ['The Protein Every Meal Test', 'Include a protein source at each meal.', '14–21d', ['S7'], 2, 'each meal'],
    ['The Whole Breakfast', 'Eat minimally processed breakfast.', '21d', ['S7'], 2, 'whole food'],
    ['The No Fast Food Trial', 'Avoid fast food for 7–21 days.', '7–21d', ['S7'], 2, 'no fast food'],
    ['The Mediterranean Plate', 'Build one Mediterranean-style meal daily.', '30d', ['S8'], 3, '30 days'],
  ],
  relationships: [
    ['The Appreciation Text', 'Send one genuine appreciation text daily.', '7–14d', ['S16'], 1, 'thank you'],
    ['The Better Question', 'Ask one deeper follow-up question in a conversation.', '7d', ['S15'], 1, 'go deeper'],
    ['The Phone-Down Dinner', 'No phone during dinner or one shared meal.', '14d', ['S15'], 1, 'present'],
    ['The Forgotten Call', 'Call a parent, grandparent, or old friend.', '7d', ['S15'], 2, 'reach out'],
    ['The Letter Lab', 'Write and send a real letter.', '1–7d', ['S16'], 2, 'real letter'],
    ['The Listen-Without-Fixing Trial', 'Listen for 10 minutes without advice unless asked.', '14d', ['S15'], 2, 'just listen'],
    ['The Flowers Experiment', 'Give flowers or a small thoughtful gift.', '1–7d', ['S13'], 3, 'small gift'],
  ],
  confidence: [
    ['The Self-Compliment Lab', 'Write one thing you did well today.', '7d', ['S19'], 1, 'self praise'],
    ['The Speak-Up Once', 'Say one thing you\'d normally keep quiet.', '14d', ['S19'], 1, 'speak up'],
    ['The Try-Something-New Study', 'Try one new thing daily, tiny allowed.', '14d', ['S19'], 1, 'try new'],
    ['The Presence Posture', 'Practice upright posture before a social moment.', '7d', ['S17'], 2, 'posture'],
    ['The Brave Action', 'Do one small socially uncomfortable action.', '14d', ['S18'], 2, 'be brave'],
    ['The Discount Ask', 'Ask for a small discount at a coffee shop or store.', '1–7d', ['S18', 'S19'], 3, 'ask discount'],
    ['The Rejection Rep', 'Collect one harmless rejection on purpose.', '1–7d', ['S18'], 3, 'get rejected'],
  ],
  money: [
    ['The No-Spend Day', 'Buy nothing nonessential for one day.', '7d', ['S20', 'S21'], 1, 'no spend'],
    ['The 24-Hour Cart Freeze', 'Wait 24 hours before nonessential purchases.', '14d', ['S2'], 1, 'wait 24h'],
    ['The Subscription Hunt', 'Cancel or downgrade one unused subscription.', '7d', ['S20'], 1, 'cut subs'],
    ['The Receipt Reality Check', 'Track every purchase for 7–14 days.', '7–14d', ['S20'], 2, 'track all'],
    ['The Grocery Budget Study', 'Set a grocery budget before shopping.', '21d', ['S2'], 2, 'budget'],
    ['The Auto-Save Trial', 'Automate a small savings transfer.', '30d', ['S20'], 2, 'auto save'],
    ['The Weekly Money Date', 'Review spending once per week.', '30d', ['S21'], 3, 'weekly review'],
  ],
  learning: [
    ['The One-Page Rule', 'Read at least one page daily.', '14d', ['S3'], 1, 'one page'],
    ['The Retrieval Rep', 'Quiz yourself after learning instead of rereading.', '14d', ['S22', 'S23'], 1, 'self quiz'],
    ['The Write-One-Thing Lab', 'Write one thing you learned today.', '14d', ['S22'], 1, 'reflect'],
    ['The 10-Min Audio Lab', 'Listen to 10 minutes of educational audio.', '14d', ['S3'], 2, 'audio learn'],
    ['The Teach-the-Wall Test', 'Learn for 10 minutes, then explain it out loud.', '7–14d', ['S22'], 2, 'teach back'],
    ['The One-New-Word Study', 'Learn and use one new word daily.', '7d', ['S23'], 2, 'new word'],
    ['The Skill Block', 'Practice one skill for 30 minutes.', '21d', ['S23'], 3, '30 min'],
  ],
  longevity: [
    ['The Hydration Baseline', 'Drink water first thing in the morning.', '14d', ['S3'], 1, 'morning water'],
    ['The Daily Walk Baseline', 'Walk 20 minutes daily.', '14d', ['S6'], 1, 'daily walk'],
    ['The Hourly Stand-Up', 'Stand up once every hour.', '7d', ['S27', 'S28'], 1, 'stand up'],
    ['The Stretch Two-Minute Lab', 'Stretch for 2 minutes daily.', '14d', ['S3'], 2, '2 min'],
    ['The No-Alcohol Check', 'Avoid alcohol and track sleep/energy.', '14–30d', ['S9'], 2, 'no alcohol'],
    ['The No-Caffeine Trial', 'Avoid caffeine and track sleep, anxiety, and energy.', '7–14d', ['S9'], 2, 'no caffeine'],
    ['The Wellness Stack Test', 'Combine sunlight + walk + bedtime consistency.', '21–30d', ['S4', 'S9'], 3, 'multi habit'],
    ['The Flamingo Balance Test', 'Stand on one leg while brushing teeth.', '7d', ['S27'], 3, 'balance'],
  ],
  curiosity: [
    ['The Tiny Adventure', 'Visit a place nearby you\'ve never entered.', '1–7d', ['S24', 'S12'], 1, 'explore'],
    ['The Random Route', 'Take a different route somewhere routine.', '1–7d', ['S24'], 1, 'new route'],
    ['The Question Collector', 'Ask one person an interesting question.', '7d', ['S15'], 1, 'ask more'],
    ['The Opposite Opinion', 'Read one thoughtful argument you disagree with.', '7d', ['S23'], 2, 'new view'],
    ['The No-Complaint Day', 'Go one day without complaining; mark slips as data points.', '7d', ['S2'], 2, 'no complain'],
    ['The Tourist Day', 'Act like a tourist in your own town for one hour.', '1d', ['S12'], 2, 'tourist mode'],
    ['The Smile First Study', 'Smile first at 10 people.', '1–7d', ['S13'], 3, 'smile x10'],
  ],
  entrepreneurship: [
    ['The Landing Page Hypothesis', 'Write one sentence: who it helps, what pain, what result.', '1–7d', ['S2'], 1, 'one sentence'],
    ['The Problem Interview', 'Ask 3 people what frustrates them about a problem space.', '7d', ['S23'], 1, '3 interviews'],
    ['The Offer Test', 'Ask 10 people whether they would pay for a simple offer.', '7d', ['S2'], 1, 'validate'],
    ['The Customer Language Hunt', 'Collect 10 exact phrases customers use about the problem.', '7d', ['S23'], 2, 'their words'],
    ['The Price Confidence Lab', 'Say your price out loud to one real person.', '1–7d', ['S19'], 2, 'say price'],
    ['The Cold Ask', 'Send one respectful ask to someone ahead of you.', '1–7d', ['S18', 'S19'], 2, 'cold ask'],
    ['The $5 Sale', 'Sell anything legal for at least $5.', '1–7d', ['S19', 'S18'], 3, 'first sale'],
  ],
  kindness: [
    ['The Make-Someone-Smile Lab', 'Do one small thing to make someone smile.', '7d', ['S13'], 1, 'make smile'],
    ['The Good Job Signal', 'Tell someone specifically what they did well.', '7d', ['S16'], 1, 'good job'],
    ['The Good Deed Data Point', 'Do one anonymous good deed.', '7d', ['S13'], 1, 'anonymous'],
    ['The Positive Review Drop', 'Leave a sincere positive review for a local business.', '1d', ['S13'], 2, 'review'],
    ['The Helping Hand', 'Help an older person or neighbor with a small task.', '1–7d', ['S13', 'S14'], 2, 'help out'],
    ['The Animal Shelter Hour', 'Volunteer at a local animal shelter or similar nonprofit.', '1–30d', ['S14'], 2, 'volunteer'],
    ['The Neighbor Knock', 'Introduce yourself to a nearby neighbor.', '1–7d', ['S15'], 3, 'knock door'],
  ],
  planet: [
    ['The Beans-Not-Beef Swap', 'Replace one beef meal with beans/lentils.', '1–14d', ['S31', 'S32'], 1, 'swap protein'],
    ['The Meatless Monday Lab', 'Eat vegetarian for one day.', '1–7d', ['S31'], 1, 'meatless'],
    ['The Trash Ten', 'Pick up 10 pieces of litter during a walk.', '1–7d', ['S33'], 1, 'pick up 10'],
    ['The Reusable Cup Trial', 'Use no disposable cups/bottles for one day.', '1–7d', ['S33'], 2, 'reusable'],
    ['The Low-Waste Lunch', 'Pack or choose one low-packaging meal.', '7d', ['S33'], 2, 'low waste'],
    ['The Recycle Right Check', 'Correctly recycle or remove contamination from recycling once daily.', '7d', ['S33'], 2, 'recycle'],
    ['The Fish Instead Study', 'Choose lower-impact protein like fish or legumes instead of beef.', '1–14d', ['S31'], 3, 'lower impact'],
  ],
  creativity: [
    ['The Walking Ideas Lab', 'Walk for 10 minutes, then write 10 ideas.', '7d', ['S24'], 1, 'walk ideas'],
    ['The Idea Walk', 'Bring one problem on a walk and capture solutions after.', '7d', ['S24'], 1, 'problem walk'],
    ['The Bad Ideas Sprint', 'Write 10 terrible ideas on purpose.', '7d', ['S25'], 1, 'bad ideas'],
    ['The Pocket Sketch', 'Draw anything in under 60 seconds.', '7d', ['S25'], 2, '60 sec draw'],
    ['The Constraint Game', 'Create something with one weird rule or limitation.', '7d', ['S25'], 2, 'one rule'],
    ['The Song Memory Lab', 'Listen to an old song and write what it brings up.', '7d', ['S12'], 2, 'old song'],
    ['The Terrible Poem', 'Write a deliberately bad poem in 2 minutes.', '7d', ['S25'], 3, 'bad poem'],
  ],
  supplement_curiosity: [
    ['The No-Caffeine Trial', 'Avoid caffeine and track sleep, anxiety, and energy.', '7–14d', ['S9'], 2, 'no caffeine'],
    ['The Mushroom Coffee Check', 'Swap normal coffee for mushroom coffee and track focus/anxiety.', '7d', [], 3, 'mushroom'],
    ['The No-Added-Salt Awareness Lab', 'Avoid adding salt at the table and track meals.', '7d', [], 3, 'no salt'],
    ['The Nutritional Yeast Add-On', 'Add nutritional yeast to one meal for B-vitamin/plant-food experiment.', '7d', [], 3, 'nooch'],
    ['The Turmeric Food Test', 'Add turmeric-containing food and track subjective soreness.', '7d', [], 3, 'turmeric'],
    ['The Grounding Curiosity Check', 'Stand barefoot outside and track mood/stress only.', '7d', [], 3, 'grounding'],
  ],
};

const experimentMap = new Map();
/** @type {Map<string, Map<string, number>>} */
const tierByCategory = new Map();

for (const [categoryId, rows] of Object.entries(CATEGORY_EXPERIMENTS)) {
  for (const row of rows) {
    const [name, action, duration, refs, tier, tagline] = row;
    const id = slugify(name);
    const { min: durationDaysMin, max: durationDaysMax } = parseDuration(duration);
    const notice = inferNoticeDays(action, durationDaysMax);
    const timeMinutes = inferTimeMinutes(action);
    const difficulty = inferDifficulty(tier, action);
    const cost = inferCost(action, name);
    const claimStrength = inferClaimStrength(refs);

    if (!tierByCategory.has(id)) tierByCategory.set(id, new Map());
    tierByCategory.get(id).set(categoryId, tier);

    if (!experimentMap.has(id)) {
      experimentMap.set(id, {
        id,
        name,
        tagline,
        action,
        categories: [categoryId],
        primaryCategory: categoryId,
        displayTier: tier,
        durationDaysMin,
        durationDaysMax,
        noticeDaysMin: notice.min,
        noticeDaysMax: notice.max,
        timeMinutes,
        difficulty,
        cost,
        scienceRefs: refs,
        claimStrength,
        emoji: EMOJI[id] || '🧪',
        primaryMetric: categoryId,
        secondaryMetrics: [],
      });
    } else {
      const exp = experimentMap.get(id);
      if (!exp.categories.includes(categoryId)) exp.categories.push(categoryId);
      exp.displayTier = Math.min(exp.displayTier, tier);
    }
  }
}

const CATEGORY_SIGNALS = {
  stress: /\b(stress|worry|breath|breathing|news|anxiety|calm|downshift|stretch|ruminat)\b/i,
  sleep: /\b(sleep|bed|screen|caffeine|light|magnesium|wake|book instead|digital sunset|curfew|bedtime)\b/i,
  energy: /\b(energy|coffee|caffeine|walk|protein|movement|hydrat|electrolyte|alert|charge|snack)\b/i,
  mood: /\b(mood|gratitude|compliment|music|friend|joy|declutter|good things|outside|smile)\b/i,
  focus: /\b(focus|phone vault|task|pomodoro|tomato|desk|priority|scroll|eye reset|single.?task)\b/i,
  productivity: /\b(plan|tomorrow|reset|project|work sprint|top three|scroll|workday|phone first hour)\b/i,
  weight_loss: /\b(step|protein|sugar|food photo|fiber|ultra.?processed|dinner walk|calorie|weight)\b/i,
  fitness: /\b(mobility|core|push.?up|cardio|strength|recovery|chair stand|zone 2|walk|exercise)\b/i,
  nutrition: /\b(veggie|protein|beans|mindful|breakfast|fast food|mediterranean|meal|fiber|lentil)\b/i,
  relationships: /\b(appreciation|question|dinner|call|flowers|letter|listen|friend|spouse|partner)\b/i,
  confidence: /\b(confident|discount|rejection|speak|brave|posture|compliment yourself|new thing|social)\b/i,
  money: /\b(spend|purchase|receipt|cart|subscription|budget|save|money|grocery)\b/i,
  learning: /\b(read|audio|teach|quiz|retrieval|word|skill|learn|page)\b/i,
  longevity: /\b(stand|balance|walk|stretch|hydrat|alcohol|wellness stack|health|hourly)\b/i,
  curiosity: /\b(adventure|tourist|route|opinion|complaint|question|explore|novel)\b/i,
  entrepreneurship: /\b(sale|offer|interview|cold ask|price|landing|customer|entrepreneur)\b/i,
  kindness: /\b(kind|smile|good job|deed|neighbor|help|volunteer|review|anonymous)\b/i,
  planet: /\b(beef|meatless|fish|litter|reusable|recycle|waste|packaging|planet|beans.?not)\b/i,
  creativity: /\b(ideas|poem|sketch|song|constraint|creative|walk.*idea|bad ideas)\b/i,
  supplement_curiosity: /\b(magnesium|mushroom|salt|yeast|turmeric|grounding|supplement|no.?caffeine trial)\b/i,
};

const MANUAL_CROSS_LINKS = {
  sunrise_switch: { energy: 2, mood: 2, longevity: 2 },
  digital_sunset: { focus: 2, stress: 2, energy: 2 },
  caffeine_curfew: { energy: 2, focus: 2, stress: 2 },
  forest_reset: { mood: 2, energy: 2, longevity: 2 },
  '5_minute_breathing_lab': { sleep: 2, focus: 2 },
  brain_dump_study: { sleep: 2 },
  phone_free_morning: { focus: 2, productivity: 2, mood: 2 },
  evening_walk_downshift: { sleep: 2, mood: 2, fitness: 2 },
  morning_walk_charge: { fitness: 2, mood: 2, longevity: 2, weight_loss: 2 },
  movement_snack: { focus: 2, productivity: 2, longevity: 2 },
  three_good_things_lab: { kindness: 2, stress: 2 },
  compliment_spark: { relationships: 2, confidence: 2, kindness: 2 },
  outdoor_mood_loop: { stress: 2, energy: 2, longevity: 2 },
  friend_ping: { relationships: 2, kindness: 2 },
  tomato_timer: { productivity: 2 },
  phone_vault: { productivity: 2, stress: 2 },
  dinner_walk: { fitness: 2, sleep: 2, longevity: 2 },
  '8k_step_study': { fitness: 2, energy: 2, longevity: 2 },
  beans_are_back_lab: { planet: 2, weight_loss: 2 },
  beans_not_beef_swap: { nutrition: 2, weight_loss: 2 },
  meatless_monday_lab: { nutrition: 2, weight_loss: 2 },
  appreciation_text: { kindness: 2, mood: 2 },
  make_someone_smile_lab: { mood: 2, relationships: 2 },
  walking_ideas_lab: { productivity: 2, curiosity: 2 },
  idea_walk: { productivity: 2, curiosity: 2 },
  no_spend_day: { stress: 2 },
  hourly_stand_up: { focus: 2, energy: 2, fitness: 2 },
  daily_walk_baseline: { weight_loss: 2, mood: 2, energy: 2 },
  hydration_baseline: { energy: 2, nutrition: 2 },
  no_caffeine_trial: { sleep: 2, energy: 2, stress: 2, focus: 2 },
  magnesium_check: { stress: 2, supplement_curiosity: 2 },
};

function addCategoryLink(id, categoryId, tier) {
  const exp = experimentMap.get(id);
  if (!exp) return;
  if (!exp.categories.includes(categoryId)) exp.categories.push(categoryId);
  const tiers = tierByCategory.get(id);
  const existing = tiers.get(categoryId);
  if (existing == null || tier < existing) tiers.set(categoryId, tier);
}

for (const exp of experimentMap.values()) {
  const text = `${exp.name} ${exp.action}`;
  for (const [catId, pattern] of Object.entries(CATEGORY_SIGNALS)) {
    if (exp.primaryCategory === catId) continue;
    if (exp.categories.includes(catId)) continue;
    if (pattern.test(text)) addCategoryLink(exp.id, catId, 2);
  }
  const manual = MANUAL_CROSS_LINKS[exp.id];
  if (manual) {
    for (const [catId, tier] of Object.entries(manual)) {
      addCategoryLink(exp.id, catId, tier);
    }
  }
}

function tierInCategory(id, categoryId) {
  return tierByCategory.get(id)?.get(categoryId) ?? experimentMap.get(id)?.displayTier ?? 2;
}

const experiments = Array.from(experimentMap.values())
  .map((exp) => ({
    ...exp,
    categoryTiers: Object.fromEntries(tierByCategory.get(exp.id) ?? []),
  }))
  .sort((a, b) => a.id.localeCompare(b.id));

const categories = CATEGORIES.map((cat) => {
  const experimentIds = experiments
    .filter((e) => e.categories.includes(cat.id))
    .sort((a, b) => {
      const tierA = tierInCategory(a.id, cat.id);
      const tierB = tierInCategory(b.id, cat.id);
      if (tierA !== tierB) return tierA - tierB;
      return a.name.localeCompare(b.name);
    })
    .map((e) => e.id);

  return {
    ...cat,
    experimentCount: experimentIds.length,
    experimentIds,
  };
});

const catalog = {
  schemaVersion: '2.0',
  app: 'Human Lab',
  notes: 'Science-backed experiment catalog from human_lab_science_backed_experiment_canvas.md. displayTier: 1=featured, 2=more experiments, 3=Lab Plus locked.',
  categories,
  experiments,
};

const outPaths = [
  join(root, 'human_lab_experiments_v2.json'),
  join(root, 'JSX/src/data/labData.json'),
];

for (const p of outPaths) {
  writeFileSync(p, JSON.stringify(catalog, null, 2) + '\n');
  console.log('Wrote', p, `(${experiments.length} experiments, ${categories.length} categories)`);
}
