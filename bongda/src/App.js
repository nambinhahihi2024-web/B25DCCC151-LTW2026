import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AddMatchForm from './components/AddMatchForm';
import GoalPlanner from './components/GoalPlanner';
import MatchRow from './components/MatchRow';
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
import { useDebounce } from './hooks/useDebounce';
import { useFetch } from './hooks/useFetch';
import { useLocalStorage } from './hooks/useLocalStorage';
import { hasSaved } from './store';
import { calcMatchStats, calcStandings, getTeamName } from './utils';

const App = () => {
  const { data, loading, error } = useFetch('/data/matches.json');
  const matches = useSelector(selectMatches);
  const dispatch = useDispatch();
  const { theme, toggleTheme } = useTheme();
  const showNotice = useNotice();

  const [roundFilter, setRoundFilter] = useLocalStorage('ltw_bongda_round', 'all');
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);

  const searchRef = useRef(null);
  const loadedSampleRef = useRef(false);

  useEffect(() => {
    if (!hasSaved && data && !loadedSampleRef.current) {
      dispatch(setMatches(data));
      loadedSampleRef.current = true;
    }
  }, [data, dispatch]);

  useEffect(() => {
    const handleKey = (e) => {
      const active = document.activeElement;
      const tag = active?.tagName;
      const isField =
        tag === 'INPUT' ||
        tag === 'SELECT' ||
        tag === 'TEXTAREA' ||
        active?.isContentEditable;

      if (e.key === '/' && !isField) {
        e.preventDefault();
        searchRef.current?.focus();
      } else if (e.key === 'Escape' && active === searchRef.current) {
        setSearch('');
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  const standings = useMemo(() => calcStandings(matches), [matches]);

  const roundMatches = useMemo(() => {
    if (roundFilter === 'all') return matches;
    const targetRound = Number(roundFilter);
    return matches.filter((m) => m.round === targetRound);
  }, [matches, roundFilter]);

  const visibleMatches = useMemo(() => {
    const query = debouncedSearch.trim().toLowerCase();
    if (!query) return roundMatches;
    return roundMatches.filter((m) => {
      const homeName = getTeamName(m.home).toLowerCase();
      const awayName = getTeamName(m.away).toLowerCase();
      return homeName.includes(query) || awayName.includes(query);
    });
  }, [roundMatches, debouncedSearch]);

  const stats = useMemo(() => calcMatchStats(roundMatches), [roundMatches]);

  const leader = useMemo(
    () => (matches.length > 0 ? standings[0] : null),
    [matches.length, standings]
  );

  useEffect(() => {
    document.title = leader
      ? `${leader.name} dẫn đầu – Giải bóng đá khoa`
      : 'Giải bóng đá khoa';
  }, [leader]);

  const handleTeamShift = (e) => {
    setSearch(e.target.value);
  };

  const handleGoals = useCallback(
    (id, homeGoals, awayGoals) => {
      dispatch(setGoals({ id, homeGoals, awayGoals }));
    },
    [dispatch]
  );

  const handleRemove = useCallback(
    (match) => {
      dispatch(removeMatch(match.id));
      showNotice(`Đã xóa trận ${getTeamName(match.home)} - ${getTeamName(match.away)}`);
    },
    [dispatch, showNotice]
  );

  const handleResetSample = () => {
    if (!data) return;
    dispatch(setMatches(data));
    showNotice('Đã đặt lại dữ liệu mẫu');
  };

  if (!hasSaved && loading) {
    return (
      <div className={`app ${theme}`}>
        <h1>Giải bóng đá khoa</h1>
        <p>Đang tải lịch thi đấu...</p>
      </div>
    );
  }

  if (!hasSaved && error) {
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

        <h3>Phân bố kết quả</h3>
        <ul>
          {Object.entries(RESULT_LABELS).map(([key, label]) => {
            const count = stats.counts[key];
            return (
              <li key={key}>
                {`${label}: ${count}`}
                <span className="bar" style={{ width: `${count * 24}px` }} />
              </li>
            );
          })}
        </ul>
      </section>

      <section>
        <h2>Lịch thi đấu</h2>
        <div className="controls-row">
          <div>
            <label htmlFor="round-filter">Xem vòng</label>{' '}
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

          <div>
            <label htmlFor="team-search">Tìm đội</label>{' '}
            <input
              id="team-search"
              ref={searchRef}
              type="text"
              value={search}
              onChange={handleTeamShift}
            />
          </div>
        </div>

        <p>{`Tìm thấy ${visibleMatches.length} trận`}</p>

        {visibleMatches.length === 0 ? (
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
                <th>Số lần render</th>
                <th>Xóa</th>
              </tr>
            </thead>
            <tbody>
              {visibleMatches.map((match) => (
                <MatchRow
                  key={match.id}
                  match={match}
                  onGoals={handleGoals}
                  onRemove={handleRemove}
                />
              ))}
            </tbody>
          </table>
        )}

        <button type="button" onClick={handleResetSample}>
          Đặt lại dữ liệu mẫu
        </button>
      </section>

      <AddMatchForm />
      <GoalPlanner standings={standings} />
    </div>
  );
};

export default App;