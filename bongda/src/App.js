import { useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { RESULT_LABELS, ROUNDS, TEAMS, formatDiff } from './data';
import { useFetch } from './hooks/useFetch';
import { matchesReducer } from './matchesReducer';
import {
  calcMatchStats,
  calcStandings,
  getResult,
  getTeamName,
  isValidGoals,
} from './utils';

const App = () => {
  const { data, loading, error } = useFetch('/data/matches.json');
  const [matches, dispatch] = useReducer(matchesReducer, []);
  const [roundFilter, setRoundFilter] = useState('all');

  const [round, setRound] = useState('1');
  const [home, setHome] = useState('');
  const [away, setAway] = useState('');
  const [homeGoals, setHomeGoals] = useState('');
  const [awayGoals, setAwayGoals] = useState('');
  const [errors, setErrors] = useState({});

  const homeRef = useRef(null);

  useEffect(() => {
    if (data) {
      dispatch({ type: 'LOAD', payload: data });
    }
  }, [data]);

  const standings = useMemo(() => calcStandings(matches), [matches]);

  const filteredMatches = useMemo(() => {
    if (roundFilter === 'all') return matches;
    const targetRound = Number(roundFilter);
    return matches.filter((m) => m.round === targetRound);
  }, [matches, roundFilter]);

  const stats = useMemo(() => calcMatchStats(filteredMatches), [filteredMatches]);

  const leader = useMemo(
    () => (matches.length > 0 ? standings[0] : null),
    [matches.length, standings]
  );

  const handleGoalsChange = (match, field, value) => {
    if (!isValidGoals(value)) return;
    dispatch({
      type: 'SET_GOALS',
      payload: {
        id: match.id,
        homeGoals: field === 'home' ? value : match.homeGoals,
        awayGoals: field === 'away' ? value : match.awayGoals,
      },
    });
  };

  const handleRemove = (id) => {
    dispatch({ type: 'REMOVE', payload: id });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const nextErrors = {};

    if (!home) {
      nextErrors.home = 'Hãy chọn đội nhà';
    }

    if (!away) {
      nextErrors.away = 'Hãy chọn đội khách';
    } else if (home && away === home) {
      nextErrors.away = 'Hai đội phải khác nhau';
    } else if (home) {
      const homeId = Number(home);
      const awayId = Number(away);
      const alreadyPlayed = matches.some(
        (m) =>
          (m.home === homeId && m.away === awayId) ||
          (m.home === awayId && m.away === homeId)
      );
      if (alreadyPlayed) {
        nextErrors.away = 'Hai đội đã đá với nhau rồi';
      }
    }

    const parsedHomeGoals = homeGoals.trim() === '' ? NaN : Number(homeGoals);
    if (!isValidGoals(parsedHomeGoals)) {
      nextErrors.homeGoals = 'Số bàn thắng phải là số nguyên từ 0 đến 20';
    }

    const parsedAwayGoals = awayGoals.trim() === '' ? NaN : Number(awayGoals);
    if (!isValidGoals(parsedAwayGoals)) {
      nextErrors.awayGoals = 'Số bàn thắng phải là số nguyên từ 0 đến 20';
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    dispatch({
      type: 'ADD',
      payload: {
        round: Number(round),
        home: Number(home),
        away: Number(away),
        homeGoals: parsedHomeGoals,
        awayGoals: parsedAwayGoals,
      },
    });

    setRound('1');
    setHome('');
    setAway('');
    setHomeGoals('');
    setAwayGoals('');
    setErrors({});
    homeRef.current?.focus();
  };

  if (loading) {
    return (
      <div className="app">
        <h1>Giải bóng đá khoa</h1>
        <p>Đang tải lịch thi đấu...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app">
        <h1>Giải bóng đá khoa</h1>
        <p>Không tải được lịch thi đấu</p>
      </div>
    );
  }

  return (
    <div className="app">
      <h1>Giải bóng đá khoa</h1>

      <section>
        <h2>Bảng xếp hạng</h2>
        <table>
          <thead>
            <tr>
              <th>Hạng</th>
              <th>Đội</th>
              <th>Trận</th>
              <th>Thắng</th>
              <th>Hòa</th>
              <th>Thua</th>
              <th>BT</th>
              <th>BB</th>
              <th>HS</th>
              <th>Điểm</th>
            </tr>
          </thead>
          <tbody>
            {standings.map((row, index) => (
              <tr
                key={row.id}
                style={index === standings.length - 1 ? { color: '#c62828' } : undefined}
              >
                <td>{index + 1}</td>
                <td>{row.name}</td>
                <td>{row.played}</td>
                <td>{row.won}</td>
                <td>{row.drawn}</td>
                <td>{row.lost}</td>
                <td>{row.gf}</td>
                <td>{row.ga}</td>
                <td>{formatDiff(row.diff)}</td>
                <td>{row.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section>
        <h2>Thống kê</h2>
        <p>{`Số trận: ${stats.count}`}</p>
        <p>{`Tổng số bàn thắng: ${stats.goals}`}</p>
        <p>{`Bàn thắng mỗi trận: ${stats.average.toFixed(2)}`}</p>
        <p>
          {leader
            ? `Đội dẫn đầu: ${leader.name} (${leader.points} điểm)`
            : 'Đội dẫn đầu: —'}
        </p>
      </section>

      <section>
        <h2>Lịch thi đấu</h2>
        <div>
          <label htmlFor="round-filter">Xem vòng</label>
          <select
            id="round-filter"
            value={roundFilter}
            onChange={(e) => setRoundFilter(e.target.value)}
          >
            <option value="all">Tất cả</option>
            {ROUNDS.map((r) => (
              <option key={r} value={String(r)}>
                {`Vòng ${r}`}
              </option>
            ))}
          </select>
        </div>

        {filteredMatches.length === 0 ? (
          <p>Chưa có trận đấu nào</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Vòng</th>
                <th>Đội nhà</th>
                <th>BT nhà</th>
                <th>BT khách</th>
                <th>Đội khách</th>
                <th>Kết quả</th>
                <th>Xóa</th>
              </tr>
            </thead>
            <tbody>
              {filteredMatches.map((match) => {
                const homeName = getTeamName(match.home);
                const awayName = getTeamName(match.away);
                const result = getResult(match);
                return (
                  <tr
                    key={match.id}
                    style={
                      result === 'draw'
                        ? { backgroundColor: 'rgba(255, 193, 7, 0.25)' }
                        : undefined
                    }
                  >
                    <td>{match.round}</td>
                    <td>{homeName}</td>
                    <td>
                      <input
                        type="number"
                        min="0"
                        max="20"
                        aria-label={`Bàn thắng nhà ${homeName} - ${awayName}`}
                        value={match.homeGoals}
                        onChange={(e) =>
                          handleGoalsChange(match, 'home', e.target.valueAsNumber)
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        min="0"
                        max="20"
                        aria-label={`Bàn thắng khách ${homeName} - ${awayName}`}
                        value={match.awayGoals}
                        onChange={(e) =>
                          handleGoalsChange(match, 'away', e.target.valueAsNumber)
                        }
                      />
                    </td>
                    <td>{awayName}</td>
                    <td>{RESULT_LABELS[result]}</td>
                    <td>
                      <button type="button" onClick={() => handleRemove(match.id)}>
                        Xóa
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </section>

      <section>
        <h2>Thêm trận đấu</h2>
        <form onSubmit={handleSubmit} noValidate>
          <div>
            <label htmlFor="match-round">Vòng</label>
            <select
              id="match-round"
              value={round}
              onChange={(e) => setRound(e.target.value)}
            >
              {ROUNDS.map((r) => (
                <option key={r} value={String(r)}>
                  {`Vòng ${r}`}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="match-home">Đội nhà</label>
            <select
              id="match-home"
              ref={homeRef}
              value={home}
              onChange={(e) => setHome(e.target.value)}
            >
              <option value="">-- Chọn đội --</option>
              {TEAMS.map((team) => (
                <option key={team.id} value={String(team.id)}>
                  {team.name}
                </option>
              ))}
            </select>
            {errors.home && <p role="alert">{errors.home}</p>}
          </div>

          <div>
            <label htmlFor="match-away">Đội khách</label>
            <select
              id="match-away"
              value={away}
              onChange={(e) => setAway(e.target.value)}
            >
              <option value="">-- Chọn đội --</option>
              {TEAMS.map((team) => (
                <option key={team.id} value={String(team.id)}>
                  {team.name}
                </option>
              ))}
            </select>
            {errors.away && <p role="alert">{errors.away}</p>}
          </div>

          <div>
            <label htmlFor="match-home-goals">Bàn thắng đội nhà</label>
            <input
              id="match-home-goals"
              type="number"
              min="0"
              max="20"
              value={homeGoals}
              onChange={(e) => setHomeGoals(e.target.value)}
            />
            {errors.homeGoals && <p role="alert">{errors.homeGoals}</p>}
          </div>

          <div>
            <label htmlFor="match-away-goals">Bàn thắng đội khách</label>
            <input
              id="match-away-goals"
              type="number"
              min="0"
              max="20"
              value={awayGoals}
              onChange={(e) => setAwayGoals(e.target.value)}
            />
            {errors.awayGoals && <p role="alert">{errors.awayGoals}</p>}
          </div>

          <button type="submit">Thêm trận</button>
        </form>
      </section>
    </div>
  );
};

export default App;