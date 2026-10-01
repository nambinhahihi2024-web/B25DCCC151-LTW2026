// App.js
import logo from './logo.svg';
import './App.css'; // 
import {useEffect , useState} from 'react';
const StudentItem = ({ student, onDelete }) => {
  const { id, name, score, class: cls } = student;
  return (
    <tr>
      <td>{id}</td><td>{name}</td><td>{score}</td><td>{cls}</td>
      <td><button onClick={() => onDelete(id)}>Xóa</button></td>
    </tr>
  );
};

const StudentTable = ({ students, onDelete }) => (
  <table border="1">
    <tbody>
      {students.map(s => <StudentItem key={s.id} student={s} onDelete={onDelete} />)}
    </tbody>
  </table>
);

const App = () => {
  const [list, setList] = useState([
    { id: 'B25DCCC151', name: 'Nguyễn Hải Nam', score: 9, class: 'D25' },
    { id: 'B25DCCC010', name: 'Trần Thị B', score: 4, class: 'D25' },
    { id: 'B25DCCC011', name: 'Lê Văn C', score: 7, class: 'D25' }
  ]);
  
  const [filter, setFilter] = useState('ALL');
  const [form, setForm] = useState({ name: '', score: '', class: '' });
  const { name, score, class: cls } = form; 

  const handleAdd = (e) => {
    e.preventDefault();
    if (!name || !score || !cls) return alert('Không được để trống!');
    if (score < 0 || score > 10) return alert('Điểm không hợp lệ!');
    
    setList([...list, { id: Date.now(), name, score: parseFloat(score), class: cls }]);
    setForm({ name: '', score: '', class: '' }); 
  };

  const displayed = list.filter(s => filter === 'G' ? s.score >= 8 : filter === 'T' ? s.score < 5 : true);
  const avg = list.length ? (list.reduce((sum, s) => sum + s.score, 0) / list.length).toFixed(1) : 0;

  return (
    <div>
      <form onSubmit={handleAdd}>
        <input value={name} placeholder="Họ tên" onChange={e => setForm({...form, name: e.target.value})} />
        <input value={score} type="number" placeholder="Điểm" onChange={e => setForm({...form, score: e.target.value})} />
        <input value={cls} placeholder="Lớp" onChange={e => setForm({...form, class: e.target.value})} />
        <button type="submit">Thêm</button>
      </form>
      
      <div style={{ margin: '10px 0' }}>
        <button onClick={() => setFilter('ALL')}>Tất cả</button>
        <button onClick={() => setFilter('G')}>Giỏi</button>
        <button onClick={() => setFilter('T')}>Trượt</button>
      </div>

      <p>{`Tổng SV: ${list.length} | Điểm TB cả lớp: ${avg}`}</p>
      
      <StudentTable students={displayed} onDelete={(id) => setList(list.filter(s => s.id !== id))} />
    </div>
  );
};
export default App;