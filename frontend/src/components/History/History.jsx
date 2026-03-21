import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './History.css';
import { FaSearch } from 'react-icons/fa';
import MenuBar from '../MenuBar/MenuBar.jsx';
import axios from 'axios';



const SearchIcon = () => <span className="search-icon"> <FaSearch className="search-icon" /></span>;
const ClearIcon = ({ onClick }) => <span className="clear-icon" onClick={onClick}>✕</span>;
const EmptyStateIcon = () => <span className="empty-state-icon">📂</span>;

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
const SharedHistoryItemCard = ({ item }) => {
  const formatShareTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMinutes = Math.floor(Math.abs(now - date) / (1000 * 60));
    if (diffMinutes < 1) return 'เมื่อสักครู่';
    if (diffMinutes < 60) return `${diffMinutes} นาทีที่แล้ว`;
    return date.toLocaleDateString('th-TH', { day: 'numeric', month: 'short' });
  };

  let statusBadgeClass = 'status-default-grey';
  let statusText = item.status || 'ดำเนินการแล้ว';
  if (statusText.includes('ใช้ไปแล้ว')) {
    statusBadgeClass = 'status-completed-green-new';
    statusText = 'ใช้ไปแล้ว';
  }

  return (
    <div className="history-card-new">
      <img src={item.img_url} alt={item.foodName} className="history-card-image-new" />
      <div className="history-card-details-new">
        <div className="history-card-row-1">
          <p className="history-card-name-new">{item.foodName}</p>
          <span className="history-card-time-new">{formatShareTime(item.use_at)}</span>
        </div>

        <div className="history-card-row-2">
          <span className="history-card-sharer-name-new">
            {item.username || 'ไม่ระบุผู้ใช้'}
          </span>
        </div>

          <span className={`history-card-status-badge-new ${statusBadgeClass}`}>
            {statusText}
          </span>
      </div>
    </div>
  );
};



function HistoryScreen({ sharedHistoryData }) {
  const [activeTab, setActiveTab] = useState(TABS.FOOD_ITEMS);
  const [searchTerm, setSearchTerm] = useState('');
  const [historyItems, setHistoryItems] = useState([]);
  const userId = localStorage.getItem('userId');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const BASE_URL = 'https://8i2v8q86ld.execute-api.us-east-1.amazonaws.com/kua-api';
      let url = `${BASE_URL}/history/${userId}`;
      if (activeTab === TABS.SHARED) url = `${BASE_URL}/history/share/${userId}`;
      else if (activeTab === TABS.RECEIVED) url = `${BASE_URL}/history/receive/${userId}`;

      try {
        const res = await axios.get(url);
        setHistoryItems(res.data);
      } catch (err) {
        console.error('Failed to fetch history with axios:', err);
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
    const filteredItems = historyItems.filter(item =>
      (item.foodName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.username || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (!historyItems || historyItems.length === 0) {
      return (
        <div className="content-area empty">
          <EmptyStateIcon />
          <p className="empty-state-message">ยังไม่มีประวัติ{activeTab}ของคุณ</p>
        </div>
      );
    }

    return (
      <div className="content-area history-list">
        {filteredItems.map(item => (
          <SharedHistoryItemCard key={item.foodName + item.created_at} item={item} />
        ))}
      </div>
    );
  };


  return (
    <div className="header-create-recipe">
      <div className="header-folder">
        <div className="back-icon-folder" onClick={() => navigate(-1)} role="button" tabIndex={0}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
          </svg>
        </div>
        <h1>ประวัติ</h1>
      </div>
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
