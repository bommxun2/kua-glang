import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiSearch, FiX, FiPlus, FiMinus } from "react-icons/fi";
import "./AddShareItem.css"; // เราจะใช้ CSS ไฟล์นี้
import axios from "axios";


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

  const userId = localStorage.getItem("userId") || "RPZ3";

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
    console.log(item)
    setQuantityToShare(1); 
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

  const handleSubmitShare = async() => {
    if (selectedItem && quantityToShare > 0) {
      const newItemToShare = {
        quantity: quantityToShare,
        latitude:"0",
        longtitude:"0",
        available_time: new Date().toISOString(),
      };
      const res = await axios.post(
        `https://8i2v8q86ld.execute-api.us-east-1.amazonaws.com/kua-api/share/user/${userId}/${selectedItem.foodId}`,
        newItemToShare
      );

      navigate("/share", { state: { openMySharesTab: true } });
    } else {
      alert("กรุณาเลือกสินค้าและระบุจำนวน");
    }
  };

  const filteredInventory = useMemo(() => {
    return userInventory.filter((item) => {
      const folderName = item.folderName || '';
      const matchesSearchTerm = folderName
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
      <div className="header-folder">
        <div className="back-icon-folder" onClick={() => navigate(-1)} role="button" tabIndex={0}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
          </svg>
        </div>
        <h1>เลือกอาหารที่จะแบ่งปัน</h1>
      </div>

      {/* --- ส่วนค้นหาและฟิลเตอร์ --- */}
      <div className="controls-container">

        <div className="filter-tabs-wrapper">
          {FILTER_CATEGORIES.map((category) => (
            <button
              key={category}
              className={`filter-tab ${activeFilter === category ? "active" : ""
                }`}
              onClick={() => setActiveFilter(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* --- ส่วนแสดงรายการสินค้า 
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
      </main>--- */}
      {/* Items */}
      <div className="items-list">
        {filteredInventory.length > 0 ? (
          filteredInventory.map((item) => (
            <div className="item-card" onClick={() => handleSelectItem(item)}>
              <img src={item.img_url} alt={item.foodName} className="item-img" />
              <div className="item-info">
                <h3 className="item-name">{item.foodName}</h3>
                <p className="item-expiry">
                  {item.expired_at
                    ? new Date(item.expired_at).toLocaleDateString('th-TH', {
                      year: 'numeric',
                      month: 'long',
                      day: '2-digit',
                    })
                    : ''}
                </p>
                <div className="item-bottom-row">
                  <p className="item-quantity">{item.quantity} {item.unit}</p>
                  <div className="update-food-status" onClick={(e) => e.stopPropagation()}>
                  </div>
                </div>
              </div>
            </div>

          ))
        ) : (
          <p className="no-items-message">ไม่มีรายการอาหารในโฟลเดอร์นี้</p>
        )}
      </div>

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
