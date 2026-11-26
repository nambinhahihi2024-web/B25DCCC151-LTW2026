const STORAGE_KEY = 'ltw_bongda_matches';

export const loadSaved = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === null) return null;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
};

export const saveMatches = (matches) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(matches));
  } catch {
    // Bỏ qua lỗi ghi localStorage
  }
};