import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiSearch, FiX, FiPlus, FiMinus } from "react-icons/fi";
import "./AddShareItem.css"; // เราจะใช้ CSS ไฟล์นี้
//ยังไม่เสร็จ
// --- ข้อมูลจำลอง (ควรมาจาก API หรือ State จริง) ---
/*
const initialUserInventoryData = [
  { id: 'inv1', name: 'มะเขือเทศลูกโตๆ', expiryDate: '08 ม.ค. 2025', image: 'https://via.placeholder.com/150/FF6347/FFFFFF?Text=มะเขือเทศ', availableQuantity: 6, unit: 'ลูก', category: 'ผัก' },
  { id: 'inv2', name: 'เส้นสปาเก็ตตี้', expiryDate: '15 ธ.ค. 2025', image: 'https://via.placeholder.com/150/FFD700/000000?Text=เส้น', availableQuantity: 4, unit: 'ห่อ', category: 'อาหารแห้ง' },
  { id: 'inv3', name: 'หมูชิ้นหมัก', expiryDate: '09 ม.ค. 2025', image: 'https://via.placeholder.com/150/8B4513/FFFFFF?Text=หมู', availableQuantity: 2, unit: 'กก.', category: 'เนื้อสัตว์' },
  { id: 'inv4', name: 'หัวหอมใหญ่', expiryDate: '20 ก.พ. 2025', image: 'https://via.placeholder.com/150/D2B48C/000000?Text=หอมใหญ่', availableQuantity: 3, unit: 'ลูก', category: 'ผัก' },
  { id: 'inv5', name: 'นมจืด UHT', expiryDate: '01 มิ.ย. 2025', image: 'https://via.placeholder.com/150/ADD8E6/000000?Text=นม', availableQuantity: 1, unit: 'แพ็ค', category: 'เครื่องดื่ม' },
  { id: 'inv6', name: 'คุกกี้ช็อกโกแลต', expiryDate: '10 มี.ค. 2025', image: 'https://via.placeholder.com/150/A52A2A/FFFFFF?Text=คุกกี้', availableQuantity: 1, unit: 'กล่อง', category: 'ของหวาน' },
];
*/

const currentUser = {
  name: "ผู้ใช้ปัจจุบัน",
  avatar: "https://via.placeholder.com/40/7B1FA2/FFFFFF?Text=Me",
};
const FILTER_CATEGORIES = [
  "ทั้งหมด",
  "ผัก",
  "เนื้อสัตว์",
  "อาหารแห้ง",
  "เครื่องดื่ม",
  "ของหวาน",
];
// --- สิ้นสุดข้อมูลจำลอง ---

function AddShareItemScreen({ onAddItemToMyShares }) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("ทั้งหมด");
  const [selectedItem, setSelectedItem] = useState(null);
  const [quantityToShare, setQuantityToShare] = useState(1);
  const [userInventory, setUserInventory] = useState([]);
  
  const userId = localStorage.getItem("userId") || "RPZ3" ; 

  const [folderId, setFolderId] = useState(null);
useEffect(() => {
  fetch(`https://8i2v8q86ld.execute-api.us-east-1.amazonaws.com/kua-api/folder/${userId}`)
    .then((res) => res.json())
    .then((data) => {
      if (data.length > 0) {
        const folderId = data[0].folderId;
        console.log("📁 folderId ตัวแรก:", folderId);

        // >>> ตัวอย่าง: ใช้ fetch รายการอาหารใน folder นี้
        fetch(`https://8i2v8q86ld.execute-api.us-east-1.amazonaws.com/kua-api/food/folder/${folderId}`)
          .then((res) => res.json())
          .then((foods) => {
            if (Array.isArray(foods)) {
              setUserInventory(foods); // 👈 ไม่กรอง status
              console.log(JSON.stringify(foods, null, 2));

            }
          });
      }
    })
    .catch((err) => console.error("❌ โหลดโฟลเดอร์ไม่สำเร็จ", err));
}, []);

  const handleSelectItem = (item) => {
    setSelectedItem(item);
    setQuantityToShare(1); // รีเซ็ตจำนวนเป็น 1 เมื่อเลือกไอเทมใหม่
  };

  const incrementQuantity = () => {
    if (selectedItem && quantityToShare < parseInt(selectedItem.quantity)) {
      setQuantityToShare((prev) => prev + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantityToShare > 1) {
      setQuantityToShare((prev) => prev - 1);
    }
  };

  const handleSubmitShare = () => {
    if (selectedItem && quantityToShare > 0) {
      const newItemToShare = {
        id: `myshare-${Date.now()}`,
        sharer: currentUser,
        timeAgo: "เมื่อสักครู่",
        image: selectedItem.img_url,
        name: selectedItem.folderName,
        quantity: quantityToShare,
        expiryDate: selectedItem.created_at,
      };
      onAddItemToMyShares(newItemToShare);
      navigate("/share", { state: { openMySharesTab: true } });
    } else {
      alert("กรุณาเลือกสินค้าและระบุจำนวน");
    }
  };

  const filteredInventory = useMemo(() => {
    return userInventory.filter((item) => {
      const matchesSearchTerm = item.folderName
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesFilter =
        activeFilter === "ทั้งหมด" || item.category === activeFilter;
      return matchesSearchTerm && matchesFilter;
    });
  }, [searchTerm, activeFilter, userInventory]);

  return (
    <div
      className={`add-share-page ${selectedItem ? "item-selected-layout" : ""}`}
    >
      {/* --- ส่วน Header --- */}
      <header className="simple-header">
        <button onClick={() => navigate(-1)} className="header-back-button">
          <FiArrowLeft size={22} />
        </button>
        <h1>เลือกของแบ่งปัน</h1>
        <div style={{ width: "40px" }}></div> {/* For spacing */}
      </header>

      {/* --- ส่วนค้นหาและฟิลเตอร์ --- */}
      <div className="controls-container">
        <div className="search-bar-wrapper">
          <FiSearch className="search-icon" />
          <div className="inner-input-wrapper">
            <input
              type="text"
              placeholder="ค้นหารายการ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <FiX className="clear-icon" onClick={() => setSearchTerm("")} />
            )}
          </div>
        </div>

        <div className="filter-tabs-wrapper">
          {FILTER_CATEGORIES.map((category) => (
            <button
              key={category}
              className={`filter-tab ${
                activeFilter === category ? "active" : ""
              }`}
              onClick={() => setActiveFilter(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* --- ส่วนแสดงรายการสินค้า --- */}
      <main className="inventory-grid-container">
        {filteredInventory.length > 0 ? (
          filteredInventory.map((item) => (
            <div
              key={item.folderId}
              className={`inventory-item ${
                selectedItem?.folderId === item.folderI ? "selected" : ""
              }`}
              onClick={() => handleSelectItem(item.folderName)}
            >
              <img src={item.img_url} alt={item.name} className="item-image" />
              <div className="item-info">
                <p className="item-name">{item.folderName}</p>
                <p className="item-expiry">สร้างเมื่อ: {item.created_at}</p>
                <p className="item-available">มี: {item.quantity}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="empty-message">ไม่พบรายการสินค้าที่ตรงกัน</p>
        )}
      </main>

      {/* --- ส่วนยืนยัน (ปรากฏเมื่อเลือกสินค้า) --- */}
      {selectedItem && (
        <footer className="confirm-footer">
          <div className="selected-item-summary">
            <img src={selectedItem.image} alt={selectedItem.name} />
            <p>
              แบ่งปัน: <strong>{selectedItem.name}</strong>
            </p>
          </div>
          <div className="quantity-adjuster">
            <button onClick={decrementQuantity} disabled={quantityToShare <= 1}>
              <FiMinus />
            </button>
            <span>{quantityToShare}</span>
            <button
              onClick={incrementQuantity}
              disabled={quantityToShare >= parseInt(selectedItem.quantity)}
            >
              <FiPlus />
            </button>
          </div>
          <button onClick={handleSubmitShare} className="submit-button">
            ยืนยันการแบ่งปัน ({quantityToShare})
          </button>
        </footer>
      )}
    </div>
  );
}

export default AddShareItemScreen;
