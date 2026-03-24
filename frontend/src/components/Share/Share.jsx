import API_BASE_URL from '../../config';
import React, { useState, useEffect } from 'react'; // เพิ่ม useEffect ถ้าต้องการ set active tab
import { FaSearch, FaTimes, FaPlus } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom'; // เพิ่ม useLocation
import MainTabsBar from "../Community/MainTabsBar/MainTabsBar.jsx"
import './Share.css';
import MenuBar from '../MenuBar/MenuBar.jsx';
import axios from "axios";

const dummyRequests = { // ข้อมูลจำลองสำหรับผู้สนใจ
  'my-item1-carrot': [
    { id: 'req1', user: { name: 'แพทย์ อ๋งอ๋ง', avatar: 'https://via.placeholder.com/40/FF0000/FFFFFF?Text=P' }, timeAgo: '17 นาที' },
    { id: 'req2', user: { name: 'ทุงทุงทุง', avatar: 'https://via.placeholder.com/40/00FF00/FFFFFF?Text=T' }, timeAgo: '20 นาที' },
  ],
  'my-item2-salmon-dish': [
    { id: 'req3', user: { name: 'นันทเทพซ่า บ้าบอ007', avatar: 'https://via.placeholder.com/40/0000FF/FFFFFF?Text=N' }, timeAgo: '20 นาที' },
  ]
};

// --- Component ย่อย ---

const FloatingActionButton = ({ onClick }) => (
  <button className="fab" onClick={onClick}>
    <FaPlus size={24} />
  </button>
);

const ShareItemCard = ({ item, onInterested }) => {
  const [isRequested, setIsRequested] = useState(false);
  const userId = localStorage.getItem("userId") || "RPZ3";
  const handleRequestClick = async () => {
    if (!isRequested) {
      setIsRequested(true);
      onInterested(item.shareId);
      // ใช้ shareId เป็น identifier
      await axios.post(
        `${API_BASE_URL}/share/${item.shareId}/interest/${userId}`
      );
    }
  };

  return (
    <div className="share-item-card">
      <div className="sharer-info">
        <img src={item.profile_url} alt={item.username} className="avatar" />
        <div className="sharer-details">
          <span className="sharer-name">{item.username}</span>
          <span className="time-ago">
            หมดอายุ: {new Date(item.expired_at).toLocaleDateString()}
          </span>
        </div>
        <span className="free-tag">ฟรี</span>
      </div>

      <div className="item-content">
        <img src={item.img_url} alt={item.foodName} className="item-image" />
        <div className="item-details">
          <h3 className="item-name">{item.foodName}</h3>
          <p className="item-quantity">จำนวน x{item.quantity}</p>
          <p className="item-expiry">
            พร้อมแบ่งปันตั้งแต่ {new Date(item.available_time).toLocaleString()}
          </p>
          {/* ถ้ามี note สามารถเพิ่มได้ เช่น item.note && <p>หมายเหตุ: ...</p> */}
        </div>
      </div>

      <button
        className={`action-button ${isRequested ? "requested-button" : "interested-button"}`}
        onClick={handleRequestClick}
        disabled={isRequested}
      >
        {isRequested ? "ส่งคำขอแล้ว" : "สนใจรับ"}
      </button>
    </div>
  );
};

const RequestList = ({ shareId }) => {

  const userId = localStorage.getItem("userId") || "RPZ3";
  let request = []
  async function fetchData() {
    const res = await axios.get(
      `${API_BASE_URL}/share/${shareId}/interest/${userId}`
    );
    request = res.data
  }
  fetchData();

  if (!request || request.length === 0) {
    return <p className="no-requests">ยังไม่มีผู้สนใจรายการนี้</p>;
  }
  return (
    <div className="request-list-section">
      <h4>รายการผู้ที่สนใจ</h4>
      {request.map(request => (
        <div key={request.id} className="request-item">
          <img src={request.user.avatar} alt={request.user.name} className="avatar" />
          <div className="request-user-info">
            <span className="sharer-name">{request.user.name}</span>
            <span className="time-ago">เมื่อ {request.timeAgo} ที่แล้ว</span>
          </div>
          <div className="request-actions">
            <button className="action-button approve-button" onClick={() => onApproveShare(itemId, request)}>อนุมัติ</button>
            <button className="action-button contact-button">ติดต่อพูดคุย</button>
          </div>
        </div>
      ))}
    </div>
  );
};

const MyShareItemCard = ({ item, onViewRequests }) => (
  <div className="share-item-card my-share-item-card">
    <div className="sharer-info">
      <img src={item.sharer.avatar} alt={item.sharer.name} className="avatar" />
      <div className="sharer-details">
        <span className="sharer-name">{item.sharer.name}</span>
        <span className="time-ago">เมื่อ {item.timeAgo} ที่แล้ว</span>
      </div>
    </div>
    <div className="item-content">
      <img src={item.image} alt={item.name} className="item-image" />
      <div className="item-details">
        <h3 className="item-name">{item.name}</h3>
        <p className="item-quantity">จำนวน x{item.quantity}</p>
        <p className="item-expiry">อาหารหมดอายุวันที่ {item.expiryDate}</p>
      </div>
    </div>
    <button className="action-button view-requests-button" onClick={() => onViewRequests(item.id)}>
      ดูคำขอ
    </button>
  </div>
);

const AllSharesTab = ({ items }) => {
  if (!items || items.length === 0) {
    return <p className="empty-state-message">ไม่มีรายการแบ่งปันในขณะนี้</p>;
  }
  const handleInterested = (itemId) => console.log(`Interested in item ${itemId}`);
  return (
    <div className="tab-content">
      {items.map(item => (
        <ShareItemCard key={item.id} item={item} onInterested={handleInterested} />
      ))}
    </div>
  );
};

const MySharesTab = ({ onAddNewShare }) => {
  const [myShares, setMyShares] = useState([]);
const [openRequests, setOpenRequests] = useState(null);

  useEffect(() => {
    const userId = localStorage.getItem("userId") || "RPZ3";
    async function fetchData() {
      const res = await axios.get(
        `${API_BASE_URL}/share/user/${userId}`
      );
      setMyShares(res.data);
    }
    fetchData();
  }, []);

  if (!myShares || myShares.length === 0) {
    return (
      <div className="tab-content empty-my-shares">
        <p className="empty-state-message larger-empty-message">
          ไม่มีรายการแบ่งปันของคุณ
        </p>
        <FloatingActionButton onClick={onAddNewShare} />
      </div>
    );
  }

  return (
    <div className="tab-content my-shares">
      {myShares.map((item) => (
        <div key={item.id} className="share-item-card">
          <div className="sharer-info">
            <img src={item.profile_url} alt={item.username} className="avatar" />
            <div className="sharer-details">
              <span className="sharer-name">{item.username}</span>
              <span className="time-ago">
                หมดอายุ: {new Date(item.expired_at).toLocaleDateString()}
              </span>
            </div>
            <span className="free-tag">ฟรี</span>
          </div>

          <div className="item-content">
            <img src={item.img_url} alt={item.foodName} className="item-image" />
            <div className="item-details">
              <h3 className="item-name">{item.foodName}</h3>
              <p className="item-quantity">จำนวน x{item.quantity}</p>
              <p className="item-expiry">
                พร้อมแบ่งปันตั้งแต่ {new Date(item.available_time).toLocaleString()}
              </p>
              {item.note && <p className="item-note">หมายเหตุ: {item.note}</p>}
            </div>
          </div>

          <button
            className="action-button interested-button"
            onClick={() =>
              setOpenRequests((prev) => (prev === item.shareId ? null : item.shareId))
            }
          >
            {openRequests === item.shareId ? "ซ่อนคำขอ" : "ดูคำขอ"}
          </button>

          {openRequests === item.shareId && (
            <RequestList shareId={item.shareId} />
          )}
        </div>
      ))}
    </div>
  );
};

const SUB_TABS = {
  ALL: 'ทั้งหมด',
  MY_SHARES: 'การแบ่งปันของฉัน',
};

function ShareScreen({ mySharesData, onApproveShare }) { // รับ mySharesData จาก props
  const [activeMainTab, setActiveMainTab] = useState('แบ่งปัน');
  const [activeSubTab, setActiveSubTab] = useState(SUB_TABS.ALL);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const location = useLocation(); // สำหรับอ่าน state จาก navigation

  const shareTabs = [
    { name: 'สำหรับคุณ', path: '/community' },
    { name: 'กำลังติดตาม', path: '/community/following' },
    { name: 'แบ่งปัน', path: '/share' },
  ];

  useEffect(() => {
    // ถ้ามีการส่ง state 'openMySharesTab' มาจากการ navigate
    // (เช่น หลังจากเพิ่ม item ใหม่) ให้เปิดแท็บ "การแบ่งปันของฉัน"
    if (location.state?.openMySharesTab) {
      setActiveSubTab(SUB_TABS.MY_SHARES);
      // ล้าง state เพื่อไม่ให้เปิดแท็บนี้อีกเมื่อ refresh หรือ navigate ไปมา
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  const [shares, setShares] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`${API_BASE_URL}/share`);
      const data = await res.json();
      const allSharesData = Array.isArray(data) ? data : [];
      setShares(allSharesData);
      //console.log(allSharesData)
    };

    fetchData();
  }, []);


  const handleAddNewShare = () => {
    navigate('/add-share-item');
  };

  const mainTabs = [];

  return (
    <div className="share-screen-container">
      <MainTabsBar tabs={shareTabs} />
      {mainTabs.map(tab => (
        <button
          key={tab}
          className={`main-tab-button ${activeMainTab === tab ? 'active' : ''}`}
          onClick={() => setActiveMainTab(tab)}
        >
          {tab}
        </button>
      ))}


      <div className="sub-tabs-toggle-container">
        <button
          className={`sub-tab-toggle-button ${activeSubTab === SUB_TABS.ALL ? 'active' : ''}`}
          onClick={() => setActiveSubTab(SUB_TABS.ALL)}
        >
          {SUB_TABS.ALL}
        </button>
        <button
          className={`sub-tab-toggle-button ${activeSubTab === SUB_TABS.MY_SHARES ? 'active' : ''}`}
          onClick={() => setActiveSubTab(SUB_TABS.MY_SHARES)}
        >
          {SUB_TABS.MY_SHARES}
        </button>
      </div>

      {activeSubTab === SUB_TABS.ALL && <AllSharesTab items={shares} />}
      {activeSubTab === SUB_TABS.MY_SHARES && (
        <MySharesTab items={mySharesData} onAddNewShare={handleAddNewShare} onApproveShare={onApproveShare} />
      )}
      <MenuBar />
    </div>
  );
}

export default ShareScreen;