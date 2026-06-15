import { useMemo, useState } from 'react';
import {
  getExperimentsForCategory,
  getExperimentEmoji,
  categories,
} from '../utils/labHelpers';
import { StatusBar, BackButton, DropdownPill } from '../components/shared';

const SORT_OPTIONS = [
  { value: 'science', label: 'Sort: Science score' },
  { value: 'time', label: 'Sort: Time' },
  { value: 'difficulty', label: 'Sort: Difficulty' },
  { value: 'name', label: 'Sort: A–Z' },
];

const COST_OPTIONS = [
  { value: 'all', label: 'Cost: All' },
  { value: 'free', label: 'Cost: Free' },
  { value: 'purchase', label: 'Cost: Purchase' },
];

const DIFF_OPTIONS = [
  { value: 'all', label: 'Difficulty: All' },
  { value: '1', label: 'Difficulty: Easy' },
  { value: '2', label: 'Difficulty: Moderate' },
  { value: '3', label: 'Difficulty: Hard' },
  { value: '4', label: 'Difficulty: Expert' },
];

function sortExperiments(list, sortBy) {
  const sorted = [...list];
  switch (sortBy) {
    case 'science':
      return sorted.sort((a, b) => b.scienceScore - a.scienceScore);
    case 'time':
      return sorted.sort((a, b) => a.timeMinutes - b.timeMinutes);
    case 'difficulty':
      return sorted.sort((a, b) => a.difficulty - b.difficulty);
    case 'name':
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    default:
      return sorted;
  }
}

export default function ExperimentListScreen({
  categoryId,
  onOpenDetail,
  onBack,
}) {
  const [sortBy, setSortBy] = useState('science');
  const [costFilter, setCostFilter] = useState('all');
  const [diffFilter, setDiffFilter] = useState('all');

  const category = categories.find((c) => c.id === categoryId);
  const allExperiments = useMemo(() => getExperimentsForCategory(categoryId), [categoryId]);

  const filtered = useMemo(() => {
    let list = allExperiments;
    if (costFilter !== 'all') {
      list = list.filter((e) => e.cost.costType === costFilter);
    }
    if (diffFilter !== 'all') {
      list = list.filter((e) => String(e.difficulty) === diffFilter);
    }
    return sortExperiments(list, sortBy);
  }, [allExperiments, sortBy, costFilter, diffFilter]);

  return (
    <>
      <StatusBar />
      <div className="body-scroll page-body" style={{ padding: '0 20px 28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '4px 0 14px' }}>
          <BackButton onClick={onBack} />
          <div>
            <p className="lbl" style={{ marginBottom: 2 }}>
              Step 2 — Choose study
            </p>
            <h2 className="syne-title" style={{ fontSize: 20 }}>
              {category?.emoji} {category?.name} Experiments
            </h2>
          </div>
        </div>

        <div className="filter-bar">
          <DropdownPill label="Sort" value={sortBy} onChange={setSortBy} options={SORT_OPTIONS} />
          <DropdownPill label="Cost" value={costFilter} onChange={setCostFilter} options={COST_OPTIONS} />
          <DropdownPill label="Difficulty" value={diffFilter} onChange={setDiffFilter} options={DIFF_OPTIONS} />
        </div>

        {filtered.length === 0 ? (
          <p style={{ fontSize: 13, color: 'var(--text-mid)', textAlign: 'center', padding: 24 }}>
            No experiments match those filters. Try adjusting ze dropdowns!
          </p>
        ) : (
          <div className="pill-row" style={{ marginBottom: 20 }}>
            {filtered.map((exp) => (
              <button
                key={exp.id}
                type="button"
                className="pill pill-selectable"
                onClick={() => onOpenDetail(exp.id)}
              >
                {getExperimentEmoji(exp.id)} {exp.name}
              </button>
            ))}
          </div>
        )}

      </div>
    </>
  );
}
