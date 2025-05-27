import React, { useState } from 'react';
import './RecipeDetail.css';
import { FaSearch, FaTimes, FaBell, FaArrowLeft } from 'react-icons/fa';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import MenuBar from '../MenuBar/MenuBar.jsx';
import { useEffect } from 'react';
import axios from 'axios';

const categories = [
  { label: 'ทั้งหมด', value: '' },
  { label: 'อาหารคาว', value: 'savory' },
  { label: 'ของหวาน', value: 'dessert' },
  { label: 'เครื่องดื่ม', value: 'drink' },
  { label: 'อาหารแช่แข็ง', value: 'frozen' },
  { label: 'ของว่าง', value: 'snack' },
  { label: 'ผักและผลไม้', value: 'vegetable-fruit' },
];

const RecipeDetail = () => {

  const { folderId } = useParams();
  const location = useLocation();
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState('');
  const navigate = useNavigate();

  const [folderName, setFolderName] = useState(location.state?.folderName || "ไม่มีชื่อโฟลเดอร์");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const id = folderId || '1';
        const response = await axios.get(`https://8i2v8q86ld.execute-api.us-east-1.amazonaws.com/kua-api/food/folder/${id}`);
        const filtered = response.data.filter(item => item.status === 'ยังไม่ใช้');
        setItems(filtered);
      } catch (error) {
        console.error('Error fetching food items:', error);
      }
    };
    fetchData();
  }, [folderId]);


  const handleSearchChange = (e) => setSearchQuery(e.target.value);
  const handleClearSearch = () => setSearchQuery("");
  const handleAddItem = () => navigate(`/create-food/${folderId}`);
  const handleEditFolder = () => {
    navigate(`/edit-folder/${folderId}`, {
      state: { folderName },
    });
  };

  const handleEditFood = (item) => {
    navigate(`/edit-food/${folderId}`, {
      state: { previousData: item },
    });
  };

  const handleFoodStatus = async (id) => {
    try {
      const res = await axios.put(
        `https://8i2v8q86ld.execute-api.us-east-1.amazonaws.com/kua-api/food/${id}`
      );
      if (res.message == 'update food success') {
        navigate(`/recipe/${folderId}`);
      }

    } catch (err) {
      console.error('เกิดข้อผิดพลาด', err);
      alert('บันทึกไม่สำเร็จ');
    }
  };


  const filteredItems = items.filter((item) =>
    item.foodName.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (selectedCategory === '' || item.category === selectedCategory)
  );


  return (
    <div className="recipe-detail">
      {/* Header */}
      <div className="header">
        <div className="back-icon" onClick={() => navigate('/')}>
          <FaArrowLeft />
        </div>
        <h1>{folderName}</h1>
        <div className='edit-food-button'>
          <svg
            onClick={handleEditFolder}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}      // เส้นหนาขึ้น
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ height: "20px" }}  // ปรับให้เตี้ยลง
          >
            <path d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
          </svg>
        </div>
      </div>

      {/* Add Button */}
      <div className="add-item-recipedetail">
        <button className="add-item-btn" onClick={handleAddItem}>+ เพิ่ม</button>
      </div>

      {/* Search */}
      <div className="search-box-detail">
        <FaSearch className="search-icon" />
        <input
          type="text"
          placeholder="ค้นหา"
          value={searchQuery}
          onChange={handleSearchChange}
        />
        {searchQuery && <FaTimes className="clear-icon" onClick={handleClearSearch} />}
      </div>

      {/* Category Filter */}
      <div className="category-filter">
        {categories.map((cat) => (
          <button
            key={cat.value}
            className={`category-btn${selectedCategory === cat.value ? ' selected' : ''}`}
            onClick={() => setSelectedCategory(cat.value)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Items */}
      <div className="items-list">
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <div className="item-card" onClick={() => handleEditFood(item)}>
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
                    <input
                      type="radio"
                      onClick={() => handleFoodStatus(item.foodId)}
                    />
                    <p>หมดแล้ว</p>
                  </div>
                </div>
              </div>
            </div>

          ))
        ) : (
          <p className="no-items-message">ไม่มีรายการอาหารในโฟลเดอร์นี้</p>
        )}
      </div>

      <MenuBar />
    </div>
  );
};

export default RecipeDetail;
