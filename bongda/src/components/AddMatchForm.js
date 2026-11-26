import { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNotice } from '../context/NoticeContext';
import { ROUNDS, TEAMS } from '../data';
import { addMatch, selectMatches } from '../features/matchesSlice';
import { getTeamName, isValidGoals } from '../utils';

const AddMatchForm = () => {
  const matches = useSelector(selectMatches);
  const dispatch = useDispatch();
  const showNotice = useNotice();

  const [round, setRound] = useState('1');
  const [home, setHome] = useState('');
  const [away, setAway] = useState('');
  const [homeGoals, setHomeGoals] = useState('');
  const [awayGoals, setAwayGoals] = useState('');
  const [errors, setErrors] = useState({});

  const homeRef = useRef(null);

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

    const homeId = Number(home);
    const awayId = Number(away);

    dispatch(
      addMatch({
        round: Number(round),
        home: homeId,
        away: awayId,
        homeGoals: parsedHomeGoals,
        awayGoals: parsedAwayGoals,
      })
    );

    showNotice(`Đã thêm trận ${getTeamName(homeId)} - ${getTeamName(awayId)}`);

    setRound('1');
    setHome('');
    setAway('');
    setHomeGoals('');
    setAwayGoals('');
    setErrors({});
    homeRef.current?.focus();
  };

  return (
    <section>
      <h2>Thêm trận đấu</h2>
      <form onSubmit={handleSubmit} noValidate>
        <div className="form-field">
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

        <div className="form-field">
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
          {errors.home && (
            <p role="alert" className="error-text">
              {errors.home}
            </p>
          )}
        </div>

        <div className="form-field">
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
          {errors.away && (
            <p role="alert" className="error-text">
              {errors.away}
            </p>
          )}
        </div>

        <div className="form-field">
          <label htmlFor="match-home-goals">Bàn thắng đội nhà</label>
          <input
            id="match-home-goals"
            type="number"
            min="0"
            max="20"
            value={homeGoals}
            onChange={(e) => setHomeGoals(e.target.value)}
          />
          {errors.homeGoals && (
            <p role="alert" className="error-text">
              {errors.homeGoals}
            </p>
          )}
        </div>

        <div className="form-field">
          <label htmlFor="match-away-goals">Bàn thắng đội khách</label>
          <input
            id="match-away-goals"
            type="number"
            min="0"
            max="20"
            value={awayGoals}
            onChange={(e) => setAwayGoals(e.target.value)}
          />
          {errors.awayGoals && (
            <p role="alert" className="error-text">
              {errors.awayGoals}
            </p>
          )}
        </div>

        <button type="submit">Thêm trận</button>
      </form>
    </section>
  );
};

export default AddMatchForm;