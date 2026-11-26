import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TEAMS } from '../data';
import {
  selectGoal,
  setRemaining,
  setTarget,
  setTeamId,
} from '../features/goalSlice';
import { calcNeeded } from '../utils';

const GoalPlanner = ({ standings }) => {
  const { teamId, target, remaining } = useSelector(selectGoal);
  const dispatch = useDispatch();

  const resultText = useMemo(
    () => calcNeeded(standings, teamId, target, remaining),
    [standings, teamId, target, remaining]
  );

  return (
    <section>
      <h2>Mục tiêu điểm</h2>
      <div className="controls-row">
        <div>
          <label htmlFor="goal-team">Đội của bạn</label>
          <select
            id="goal-team"
            value={teamId}
            onChange={(e) => dispatch(setTeamId(e.target.value))}
          >
            {TEAMS.map((team) => (
              <option key={team.id} value={String(team.id)}>
                {team.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="goal-target">Số điểm mục tiêu</label>
          <input
            id="goal-target"
            type="number"
            value={target}
            onChange={(e) => dispatch(setTarget(e.target.value))}
          />
        </div>

        <div>
          <label htmlFor="goal-remaining">Số trận còn lại</label>
          <input
            id="goal-remaining"
            type="number"
            value={remaining}
            onChange={(e) => dispatch(setRemaining(e.target.value))}
          />
        </div>
      </div>
      <p>{resultText}</p>
    </section>
  );
};

export default GoalPlanner;