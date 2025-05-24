import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './RecipeDetail.css';
import { FaSearch, FaTimes, FaBell, FaArrowLeft, FaShareAlt } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';
import MenuBar from '../MenuBar/MenuBar.jsx';

const categories = [
  { label: 'ทั้งหมด', value: 'all' },
  { label: 'เครื่องดื่ม', value: 'drink' },
  { label: 'ของหวาน', value: 'dessert' },
  { label: 'อาหารแช่แข็ง', value: 'frozen' },
];

const RecipeDetail = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [items, setItems] = useState([]);
  const navigate = useNavigate();
  const { folderId } = useParams(); // สมมติ route เป็น /recipe/:folderId

  useEffect(() => {
    // ถ้าไม่มี folderId ใน url ให้ fallback เป็น 1
    const id = folderId || 1;
    axios.get(`/food/${id}`)
      .then(res => {
        // filter เฉพาะ status 'ยังไม่ใช้'
        const filtered = res.data.filter(item => item.status === 'ยังไม่ใช้');
        setItems(filtered);
      })
      .catch(err => console.error('fetch error', err));
  }, [folderId]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  const handleAddItem = () => {
    navigate('/create-recipe');
  };

  const handleIngredientClick = (ingredientId) => {
    navigate(`/edit-ingredient/${ingredientId}`); // Navigate to EditIngredient page with ingredient ID
  };

  return (
    <div className="recipe-detail">
      {/* Header */}
      <div className="header">
        <div className="back-icon" onClick={() => navigate('/')}> {/* Navigate to HomePage */}
          <FaArrowLeft />
        </div>
        <h1>ครัวกลาง</h1>
        <FaBell className="notification-icon large-icon" />
      </div>

      {/* Search Bar */}
      <div className="search-container">
        <FaSearch className="search-icon-recipedetail" />
        <input
          type="text"
          className="search-bar-recipedetail"
          placeholder="ค้นหา"
          value={searchQuery}
          onChange={handleSearchChange}
          style={{ background: '#fff', color: '#333' }}
        />
        {searchQuery && <FaTimes className="clear-icon" onClick={handleClearSearch} />}
      </div>

      {/* Add Button */}
      <div className="add-item-recipedetail">
        <button className="add-item-btn" onClick={handleAddItem}>+ เพิ่ม</button>
        <FaShareAlt className="share-icon" style={{ marginLeft: '15px', color: 'var(--primary)' }} /> {/* Adjusted to align to the right of the button */}
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

      {/* Items List */}
      <div className="items-list">
        {items
          .filter((item) => item.foodName.includes(searchQuery))
          .map((item) => (
            <div
              key={item.foodId}
              className="item-card"
              onClick={() => handleIngredientClick(item.foodId)}
            >
              <img src={item.img_url} alt={item.foodName} className="item-img" />
              <div className="item-info">
                <h3 className="item-name">{item.foodName}</h3>
                <p className="item-expiry">{item.expired_at ? new Date(item.expired_at).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: '2-digit' }) : ''}</p>
                <p className="item-quantity">{item.quntity} {item.unit}</p>
              </div>
            </div>
          ))}
      </div>
      <MenuBar />
    </div>
  );
};

export default RecipeDetail;