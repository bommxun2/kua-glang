import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './MenuBar.css';
import { FaHome, FaUsers, FaAward, FaHistory, FaUser } from 'react-icons/fa';

const menuItems = [
  { to: '/', label: 'หน้าหลัก', icon: FaHome, match: /^\/?$/ },
  { to: '/community', label: 'ชุมชน', icon: FaUsers },
  { to: '/competition', label: 'แข่งขัน', icon: FaAward },
  { to: '/history', label: 'ประวัติ', icon: FaHistory },
  { to: '/profile', label: 'โปรไฟล์', icon: FaUser },
];

const MenuBar = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div className="menu-bar">
      {menuItems.map(({ to, label, icon, match }) => {
        const isActive = match ? match.test(currentPath) : currentPath.startsWith(to);
        const Icon = icon;
        return (
          <Link
            key={to}
            to={to}
            className={`menu-item${isActive ? ' active' : ''}`}
          >
            <Icon className={`menu-icon${isActive ? ' active' : ' inactive'}`} />
            <span className={`menu-label${isActive ? ' active' : ' inactive'}`}>{label}</span>
          </Link>
        );
      })}
    </div>
  );
};

export default MenuBar;