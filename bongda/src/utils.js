import { MAX_GOALS, POINTS, TEAMS } from './data';

export const getTeamName = (id) => {
  const team = TEAMS.find((t) => t.id === id);
  return team ? team.name : '';
};

export const getResult = (match) => {
  if (match.homeGoals > match.awayGoals) return 'home';
  if (match.homeGoals < match.awayGoals) return 'away';
  return 'draw';
};

export const isValidGoals = (n) =>
  typeof n === 'number' && Number.isInteger(n) && n >= 0 && n <= MAX_GOALS;

export const calcStandings = (matches) => {
  const map = new Map(
    TEAMS.map((team) => [
      team.id,
      {
        id: team.id,
        name: team.name,
        played: 0,
        won: 0,
        drawn: 0,
        lost: 0,
        gf: 0,
        ga: 0,
        diff: 0,
        points: 0,
      },
    ])
  );

  matches.forEach((match) => {
    const home = map.get(match.home);
    const away = map.get(match.away);
    if (!home || !away) return;

    home.played += 1;
    away.played += 1;
    home.gf += match.homeGoals;
    home.ga += match.awayGoals;
    away.gf += match.awayGoals;
    away.ga += match.homeGoals;

    const result = getResult(match);
    if (result === 'home') {
      home.won += 1;
      home.points += POINTS.win;
      away.lost += 1;
      away.points += POINTS.loss;
    } else if (result === 'away') {
      away.won += 1;
      away.points += POINTS.win;
      home.lost += 1;
      home.points += POINTS.loss;
    } else {
      home.drawn += 1;
      away.drawn += 1;
      home.points += POINTS.draw;
      away.points += POINTS.draw;
    }
  });

  const rows = Array.from(map.values()).map((row) => ({
    ...row,
    diff: row.gf - row.ga,
  }));

  // Sắp xếp trên bản sao mới: Điểm ↓, Hiệu số ↓, Bàn thắng ↓, Tên A–Z (vi)
  return [...rows].sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.diff !== a.diff) return b.diff - a.diff;
    if (b.gf !== a.gf) return b.gf - a.gf;
    return a.name.localeCompare(b.name, 'vi');
  });
};

export const calcMatchStats = (matches) => {
  const counts = { home: 0, draw: 0, away: 0 };
  let goals = 0;

  matches.forEach((match) => {
    goals += match.homeGoals + match.awayGoals;
    const result = getResult(match);
    counts[result] += 1;
  });

  const count = matches.length;
  const average = count === 0 ? 0 : Math.round((goals / count) * 100) / 100;

  return { count, goals, average, counts };
};