import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AddMatchForm from './components/AddMatchForm';
import GoalPlanner from './components/GoalPlanner';
import StandingsTable from './components/StandingsTable';
import { useNotice } from './context/NoticeContext';
import { useTheme } from './context/ThemeContext';
import { RESULT_LABELS, ROUNDS } from './data';
import {
  removeMatch,
  selectMatches,
  setGoals,
  setMatches,
} from './features/matchesSlice';
import { useFetch } from './hooks/useFetch';
import {
  calcMatchStats,
  calcStandings,
  getResult,
  getTeamName,
  isValidGoals,
} from './utils';

const App = () => {
  const { data, loading, error } = useFetch('/data/matches.json');
  const matches = useSelector(selectMatches);
  const dispatch = useDispatch();
  const { theme, toggleTheme } = useTheme();
  const showNotice = useNotice();
  const [roundFilter, setRoundFilter] = useState('all');

  useEffect(() => {
    if (data) {
      dispatch(setMatches(data));
    }
  }, [data, dispatch]);

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
    dispatch(
      setGoals({
        id: match.id,
        homeGoals: field === 'home' ? value : match.homeGoals,
        awayGoals: field === 'away' ? value : match.awayGoals,
      })
    );
  };

  const handleRemove = (match) => {
    dispatch(removeMatch(match.id));
    showNotice(`Đã xóa trận ${getTeamName(match.home)} - ${getTeamName(match.away)}`);
  };

  if (loading) {
    return (
      <div className={`app ${theme}`}>
        <h1>Giải bóng đá khoa</h1>
        <p>Đang tải lịch thi đấu...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`app ${theme}`}>
        <h1>Giải bóng đá khoa</h1>
        <p>Không tải được lịch thi đấu</p>
      </div>
    );
  }

  return (
    <div className={`app ${theme}`}>
      <h1>Giải bóng đá khoa</h1>
      <button type="button" onClick={toggleTheme}>
        {theme === 'light' ? 'Chế độ tối' : 'Chế độ sáng'}
      </button>

      <StandingsTable standings={standings} />

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
        <div className="controls-row">
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
                    className={result === 'draw' ? 'draw-row' : undefined}
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
                      <button type="button" onClick={() => handleRemove(match)}>
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

      <AddMatchForm />
      <GoalPlanner standings={standings} />
    </div>
  );
};

export default App;