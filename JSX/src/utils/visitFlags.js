const STORAGE_KEY = 'human_lab_visited_pages';

function readFlags() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  } catch {
    return {};
  }
}

function writeFlags(flags) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(flags));
  } catch {
    // ignore quota / private mode
  }
}

export function hasVisitedPage(pageId) {
  return Boolean(readFlags()[pageId]);
}

export function markPageVisited(pageId) {
  const flags = readFlags();
  flags[pageId] = true;
  writeFlags(flags);
}
