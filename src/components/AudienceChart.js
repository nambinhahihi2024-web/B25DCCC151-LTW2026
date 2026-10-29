import React from 'react';
import { LETTERS } from '../data';

const AudienceChart = ({ votes }) => {
  return (
    <div style={{ marginTop: '15px', padding: '10px', border: '1px dashed #007bff', borderRadius: '5px' }}>
      <h4>Kết quả trợ giúp từ khán giả:</h4>
      {LETTERS.map((letter, idx) => {
        const percent = votes ? votes[idx] || 0 : 0;
        return (
          <div key={idx} style={{ display: 'flex', alignItems: 'center', margin: '5px 0' }}>
            <span style={{ width: '30px', fontWeight: 'bold' }}>{letter}:</span>
            <div style={{ flex: 1, backgroundColor: '#e0e0e0', borderRadius: '4px', height: '20px', overflow: 'hidden' }}>
              <div
                style={{
                  width: `${percent}%`,
                  backgroundColor: '#28a745',
                  height: '100%',
                  transition: 'width 0.5s ease-in-out'
                }}
              ></div>
            </div>
            <span style={{ width: '50px', textAlign: 'right', marginLeft: '10px' }}>{percent}%</span>
          </div>
        );
      })}
    </div>
  );
};

export default AudienceChart;