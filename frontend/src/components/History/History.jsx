import React, { useState, useEffect } from 'react';
import './History.css'; // Import the CSS file
import MenuBar from '../MenuBar/MenuBar.jsx';

 
// import { FaSearch, FaTimes, FaBell, FaFolderOpen } from 'react-icons/fa';
const SearchIcon = () => <span className="search-icon">🔍</span>; // หรือ <FaSearch />
const ClearIcon = ({ onClick }) => <span className="clear-icon" onClick={onClick}>✕</span>; // หรือ <FaTimes />
const NotificationIcon = () => <span className="notification-icon">🔔</span>; // หรือ <FaBell />
const EmptyStateIcon = () => <span className="empty-state-icon">📂</span>; // หรือ <FaFolderOpen />
 
const TABS = {
  FOOD_ITEMS: 'รายการอาหาร',
  SHARED: 'แบ่งปัน',
  RECEIVED: 'ได้รับ',
};
 
const PLACEHOLDERS = {
  [TABS.FOOD_ITEMS]: 'ค้นหารายการอาหาร',
  [TABS.SHARED]: 'ค้นหาประวัติการแบ่งปัน',
  [TABS.RECEIVED]: 'ค้นหาประวัติการได้รับ',
};
 
// --- Component สำหรับแสดงรายการในประวัติการแบ่งปัน ---
const SharedHistoryItemCard = ({ item }) => {
  const formatShareTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    // ... (logic formatShareTime เดิม หรือปรับปรุงตามต้องการ) ...
    // ตัวอย่างง่ายๆ สำหรับ "เมื่อสักครู่" หรือ format อื่น
    const diffMinutes = Math.floor(Math.abs(now - date) / (1000 * 60));
    if (diffMinutes < 1) return 'เมื่อสักครู่';
    if (diffMinutes < 60) return `${diffMinutes} นาทีที่แล้ว`;
    // เพิ่ม logic อื่นๆ
    return date.toLocaleDateString('th-TH', { day: 'numeric', month: 'short' }); // เช่น "25 พ.ค."
  };
 
  let statusBadgeClass = 'status-default-grey'; // สีเทาเป็น default
  let statusText = item.status || 'ดำเนินการแล้ว';
 
  if (statusText.includes('สำเร็จ') || statusText.includes('แบ่งปันแล้ว') || statusText.includes('ดำเนินการแล้ว')) {
    statusBadgeClass = 'status-completed-green-new'; // สีเขียวตามรูป
    statusText = 'ดำเนินการสำเร็จ'; // ปรับข้อความให้ตรงรูป
  } else if (statusText.includes('ยกเลิก')) {
    statusBadgeClass = 'status-cancelled-red-new';
  }
  // เพิ่มเงื่อนไขสำหรับสถานะอื่นๆ
 
  return (
    <div className="history-card-new"> {/* Class ใหม่สำหรับการ์ด */}
      <img src={item.image} alt={item.name} className="history-card-image-new" />
      <div className="history-card-details-new">
        <div className="history-card-row-1">
          <h3 className="history-card-name-new">
            {item.name} {item.quantity > 1 ? `(x${item.quantity})` : ''}
          </h3>
          <span className="history-card-time-new">{formatShareTime(item.timestamp)}</span>
        </div>
        <div className="history-card-row-2">
          <img src={item.sharer.avatar} alt={item.sharer.name} className="history-card-avatar-new" />
          <span className="history-card-sharer-name-new">{item.sharer.name}</span>
        </div>
        {item.approvedTo && (
          <div className="history-card-row-3">
            <span className="history-card-recipient-new">ถึง: {item.approvedTo.name}</span>
          </div>
        )}
        <span className={`history-card-status-badge-new ${statusBadgeClass}`}>
          {statusText}
        </span>
      </div>
    </div>
  );
};
 
function HistoryScreen({ sharedHistoryData}) {
  const [activeTab, setActiveTab] = useState(TABS.FOOD_ITEMS);
  const [searchTerm, setSearchTerm] = useState('');
  const [historyItems, setHistoryItems] = useState([]);
  const userId = 'user007';
 
  useEffect(() => {
    const fetchData = async () => {
        let url = 'http://localhost:3000/history';
        if (activeTab === TABS.FOOD_ITEMS) url = `/history/${userId}`;
        else if (activeTab === TABS.SHARED) url = `/history/share/${userId}`;
        else if (activeTab === TABS.RECEIVED) url = `/history/receive/${userId}`;
 
        try {
        const res = await fetch(url);
        const data = await res.json();
        setHistoryItems(data);
        }  catch (err) {
        console.error('Failed to fetch history:', err);
        setHistoryItems([]);
        }
    };
 
    fetchData();
    }, [activeTab]);
 
 
  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
    setSearchTerm('');
  };
 
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };
 
  const clearSearch = () => {
    setSearchTerm('');
  };
 
  const renderContent = () => {
    // Placeholder data (คุณจะต้องส่ง data จริงๆ มาจาก App.jsx สำหรับทุกแท็บ)
    const foodItemsHistoryData = [];
    const receivedHistoryData = [];
 
    if (activeTab === TABS.SHARED) {
      if (!sharedHistoryData || sharedHistoryData.length === 0) {
        return (
          <div className="content-area empty">
            <EmptyStateIcon />
            <p className="empty-state-message">ยังไม่มีประวัติการแบ่งปันของคุณ</p>
          </div>
        );
      }
      // Filter sharedHistoryData based on searchTerm if needed
      const filteredSharedHistory = sharedHistoryData.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.approvedTo.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
 
      return (
        <div className="content-area history-list">
          {filteredSharedHistory.map(item => (
            <SharedHistoryItemCard key={item.id} item={item} />
          ))}
        </div>
      );
    }
    // ... (Logic for TABS.FOOD_ITEMS and TABS.RECEIVED) ...
    // Default empty state for other tabs for now
    return (
      <div className="content-area empty">
        <EmptyStateIcon />
        <p className="empty-state-message">ยังไม่มีประวัติ{activeTab}ของคุณ</p>
      </div>
    );
  };
 
  return (
    <div className="history-screen-container">
      <header className="header">
        <h1 className="header-title">ประวัติ</h1>
        <NotificationIcon />
      </header>
 
      <div className="search-bar-container">
        <div className="search-bar">
          <SearchIcon />
          <input
            type="text"
            placeholder={PLACEHOLDERS[activeTab]}
            value={searchTerm}
            onChange={handleSearchChange}
          />
          {searchTerm && <ClearIcon onClick={clearSearch} />}
        </div>
      </div>
 
      <nav className="tabs-container">
        {Object.values(TABS).map((tabName) => (
          <button
            key={tabName}
            className={`tab-button ${activeTab === tabName ? 'active' : ''}`}
            onClick={() => handleTabClick(tabName)}
          >
            {tabName}
          </button>
        ))}
      </nav>
 
      {renderContent()}
      <MenuBar />
    </div>
  );
}
 
export default HistoryScreen;
 