import React from 'react';
import { Link } from 'react-router-dom';
import './MenuBar.css';
import { FaHome, FaShareAlt, FaStore, FaHistory, FaUser } from 'react-icons/fa';

const MenuBar = () => {
  return (
    <div className="menu-bar">
      <Link to="/" className="menu-item">
        <FaHome className="menu-icon" /> หน้าหลัก
      </Link>
      <Link to="/share" className="menu-item">
        <FaShareAlt className="menu-icon" /> แบ่งปัน
      </Link>
      <Link to="/store" className="menu-item">
        <FaStore className="menu-icon" /> ร้านค้า
      </Link>
      <Link to="/history" className="menu-item">
        <FaHistory className="menu-icon" /> ประวัติ
      </Link>
      <Link to="/profile" className="menu-item">
        <FaUser className="menu-icon" /> โปรไฟล์
      </Link>
    </div>
  );
};

export default MenuBar;