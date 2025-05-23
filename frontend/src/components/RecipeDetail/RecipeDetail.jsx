import React, { useState } from 'react';
import './RecipeDetail.css';
import { FaSearch, FaTimes, FaBell, FaArrowLeft, FaShareAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import MenuBar from '../MenuBar/MenuBar.jsx';
import onionImg from '../../assets/onion.png';
import tomatoImg from '../../assets/tomato.png';
import porkImg from '../../assets/pork.png';
import senspaghettiImg from '../../assets/senspaghetti.png';

const categories = [
  { label: 'ทั้งหมด', value: 'all' },
  { label: 'เครื่องดื่ม', value: 'drink' },
  { label: 'ของหวาน', value: 'dessert' },
  { label: 'อาหารแช่แข็ง', value: 'frozen' },
];

const RecipeDetail = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState('all');
  const navigate = useNavigate();

  const items = [
    { id: 1, name: "มะเขือเทศลูกโตๆ", category: "ทั้งหมด", quantity: "6 ลูก", expiry: "08 มกราคม 2025", img: tomatoImg },
    { id: 2, name: "เส้นสปาเก็ตตี้", category: "ทั้งหมด", quantity: "4 กรัม", expiry: "08 มกราคม 2025", img: senspaghettiImg },
    { id: 3, name: "หมูชิ้นๆ", category: "ทั้งหมด", quantity: "2 กิโลกรัม", expiry: "09 มกราคม 2025", img: porkImg },
    { id: 4, name: "หัวหอมแต่หอมไม่สู้แก้มเธอ", category: "ทั้งหมด", quantity: "3 ลูก", expiry: "09 มกราคม 2025", img: onionImg },
  ];

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  const handleAddItem = () => {
    navigate('/create-recipe');
  };

  const handleGoBack = () => {
    navigate('/');
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
          .filter((item) => item.name.includes(searchQuery))
          .map((item) => (
            <div
              key={item.id}
              className="item-card"
              onClick={() => handleIngredientClick(item.id)} // Add click handler
            >
              <img src={item.img} alt={item.name} className="item-img" />
              <div className="item-info">
                <h3 className="item-name">{item.name}</h3>
                <p className="item-expiry">{item.expiry}</p>
                <p className="item-quantity">{item.quantity}</p>
              </div>
            </div>
          ))}
      </div>
      <MenuBar />
    </div>
  );
};

export default RecipeDetail;