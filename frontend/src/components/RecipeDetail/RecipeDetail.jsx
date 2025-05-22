import React, { useState } from 'react';
import './RecipeDetail.css';
import { FaSearch, FaTimes, FaBell, FaArrowLeft, FaShareAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const RecipeDetail = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const items = [
    { id: 1, name: "มะเขือเทศลูกโตๆ", category: "ทั้งหมด", quantity: "6 ลูก", expiry: "08 มกราคม 2025", img: "https://via.placeholder.com/150" },
    { id: 2, name: "เส้นสปาเก็ตตี้", category: "ทั้งหมด", quantity: "4 กรัม", expiry: "08 มกราคม 2025", img: "https://via.placeholder.com/150" },
    { id: 3, name: "หมูชิ้นๆ", category: "ทั้งหมด", quantity: "2 กิโลกรัม", expiry: "09 มกราคม 2025", img: "https://via.placeholder.com/150" },
    { id: 4, name: "หัวหอมแต่หอมไม่สู้แก้มเธอ", category: "ทั้งหมด", quantity: "3 ลูก", expiry: "09 มกราคม 2025", img: "https://via.placeholder.com/150" },
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
      <div className="search-container" onClick={() => console.log('Search container clicked!')}>
        <FaSearch className="search-icon-recipedetail" />
        <input
          type="text"
          className="search-bar-recipedetail"
          placeholder="ค้นหา"
          value={searchQuery}
          onChange={handleSearchChange}
        />
        {searchQuery && <FaTimes className="clear-icon" onClick={handleClearSearch} />}
      </div>

      {/* Add Button */}
      <div className="add-item-recipedetail">
        <button className="add-item-btn" onClick={handleAddItem}>+ เพิ่ม</button>
        <FaShareAlt className="share-icon" style={{ marginLeft: '15px' }} /> {/* Adjusted to align to the right of the button */}
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
    </div>
  );
};

export default RecipeDetail;