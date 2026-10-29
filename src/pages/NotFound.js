import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div style={{ textAlign: 'center', padding: '40px 0' }}>
      <h2>404 - Không tìm thấy trang</h2>
      <Link to="/">Về trang chủ</Link>
    </div>
  );
};

export default NotFound;