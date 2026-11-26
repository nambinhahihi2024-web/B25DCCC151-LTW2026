import { createSlice } from '@reduxjs/toolkit';

const matchesSlice = createSlice({
  name: 'matches',
  initialState: [],
  reducers: {
    setMatches: (_state, action) => [...action.payload],
    addMatch: (state, action) => {
      const maxId = state.reduce((max, m) => (m.id > max ? m.id : max), 0);
      state.push({ ...action.payload, id: maxId + 1 });
    },
    removeMatch: (state, action) => state.filter((m) => m.id !== action.payload),
    setGoals: (state, action) => {
      const { id, homeGoals, awayGoals } = action.payload;
      const target = state.find((m) => m.id === id);
      if (target) {
        target.homeGoals = homeGoals;
        target.awayGoals = awayGoals;
      }
    },
  },
});

export const { setMatches, addMatch, removeMatch, setGoals } = matchesSlice.actions;
export const selectMatches = (state) => state.matches;
export default matchesSlice.reducer;