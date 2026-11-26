export const matchesReducer = (state, action) => {
  switch (action.type) {
    case 'LOAD':
      return [...action.payload];
    case 'ADD': {
      const maxId = state.reduce((max, item) => (item.id > max ? item.id : max), 0);
      return [...state, { ...action.payload, id: maxId + 1 }];
    }
    case 'REMOVE':
      return state.filter((item) => item.id !== action.payload);
    case 'SET_GOALS': {
      const { id, homeGoals, awayGoals } = action.payload;
      return state.map((item) =>
        item.id === id ? { ...item, homeGoals, awayGoals } : item
      );
    }
    default:
      return state;
  }
};