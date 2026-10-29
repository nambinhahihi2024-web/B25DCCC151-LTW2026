import React from 'react';
import { NavLink } from 'react-router-dom';

const NavBar = () => {
  const getNavStyle = ({ isActive }) => ({
    color: isActive ? 'red' : 'inherit',
    fontWeight: isActive ? 'bold' : 'normal',
    marginRight: '15px',
    textDecoration: 'none'
  });

  return (
    <nav className="navbar">
      <NavLink to="/" end style={getNavStyle}>
        Trang chủ
      </NavLink>
      <NavLink to="/questions" style={getNavStyle}>
        Ngân hàng câu hỏi
      </NavLink>
      <NavLink to="/history" style={getNavStyle}>
        Lịch sử
      </NavLink>
    </nav>
  );
};

export default NavBar;