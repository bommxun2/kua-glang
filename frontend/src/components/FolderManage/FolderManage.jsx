import React, { useState } from 'react';
import './FolderManage.css';
import { FaSearch, FaTimes, FaPlus, FaBell } from 'react-icons/fa';

const FolderManage = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  return (
    <div className="folder-manage">
      {/* Header */}
      <div className="header">
        <h1>ครัวกลาง</h1>
        <FaBell className="notification-icon" />
      </div>

      {/* Search Bar */}
      <div className="search-container">
        <FaSearch className="search-icon" />
        <input
          type="text"
          className="search-bar"
          placeholder="ค้นหา"
          value={searchQuery}
          onChange={handleSearchChange}
        />
        {searchQuery && <FaTimes className="clear-icon" onClick={handleClearSearch} />}
      </div>

      {/* Categories */}
      <div className="categories">
        <button className="category add-category"><FaPlus /></button>
        <button className="category active">ทั้งหมด</button>
        <button className="category">เครื่องดื่ม</button>
        <button className="category">ของหวาน</button>
        <button className="category">อาหารแช่แข็ง</button>
      </div>

      {/* Item Card */}
      <div className="item-card">
        <img
          src="https://via.placeholder.com/150"
          alt="สตรอว์เบอร์รี่"
          className="item-image"
        />
        <div className="item-details">
          <h3 className="item-name">สตรอว์เบอร์รี่</h3>
          <p className="item-expiry">18 พฤษภาคม 2025</p>
          <p className="item-quantity">12 ลูก</p>
        </div>
      </div>
    </div>
  );
};

export default FolderManage;