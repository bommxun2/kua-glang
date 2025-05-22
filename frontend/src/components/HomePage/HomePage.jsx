import React, { useState } from 'react';
import './HomePage.css';
import { FaSignOutAlt, FaSearch, FaTimes } from 'react-icons/fa'; // ไอคอนจาก React Icons
import { useNavigate } from 'react-router-dom'; // เพิ่ม useNavigate
import '@fontsource/bai-jamjuree'; // Add Bai Jamjuree font import

const HomePage = () => {
  const [selectedLocation, setSelectedLocation] = useState("Accom park");
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate(); // ใช้ useNavigate สำหรับการนำทาง

  const recipes = [
    { id: 1, name: "สปาเก็ตตี้สูตรเหล่ากง", img: "https://via.placeholder.com/150", date: "07 มกราคม 2025", quantity: "8" },
    { id: 2, name: "ซาลาเปากลมๆ", img: "https://via.placeholder.com/150", date: "14 มกราคม 2025", quantity: "4" },
    { id: 3, name: "อาหารไหว้เจ้าแต่เรากิน", img: "https://via.placeholder.com/150", date: "14 มกราคม 2025", quantity: "12" },
  ];

  const handleLocationChange = (e) => {
    setSelectedLocation(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value); // Update searchQuery when typing
  };

  const handleClearSearch = () => {
    setSearchQuery(""); // Clear search query
  };

  const handleLogout = () => {
    alert("คุณได้ทำการล็อกเอาท์แล้ว");
  };

  const handleRecipeClick = (id) => {
    navigate(`/recipe/${id}`); // นำทางไปยังหน้า RecipeDetail พร้อม id
  };

  // Filter recipes based on searchQuery
  const filteredRecipes = recipes.filter((recipe) =>
    recipe.name.toLowerCase().includes(searchQuery.toLowerCase()) // กรองข้อมูลตาม query
  );

  return (
    <div className="App">
      {/* Header Section */}
      <header className="app-header">
        <div className="user-name">Joonbom</div>
        {/* Dropdown for location */}
        <div className="location">
          <select 
            value={selectedLocation}
            onChange={handleLocationChange}
            className="location-dropdown"
          >
            <option value="Accom park">Accom park</option>
            <option value="Park Central">Park Central</option>
            <option value="City Square">City Square</option>
          </select>
        </div>
        {/* Logout Button with Icon */}
        <button className="logout-btn" onClick={handleLogout}>
          <FaSignOutAlt /> 
        </button>
      </header>

      {/* Search Bar */}
      <div className="search-container" onClick={() => console.log('Search container clicked!')}>
        <FaSearch className="search-icon" />
        <input 
          type="text" 
          className="search-bar" 
          placeholder="ค้นหา" 
          value={searchQuery} 
          onChange={handleSearchChange}
        />
        {searchQuery && <FaTimes className="clear-icon" onClick={handleClearSearch} />} {/* ไอคอนกากบาทถ้ามีการค้นหา */}
      </div>

      {/* Add Item Button */}
      <div className="add-item">
        <button className="add-item-btn">เพิ่มรายการใหม่</button>
      </div>

      {/* Recipe List Section */}
      <div className="recipe-container">
        {filteredRecipes.map((recipe) => (
          <div key={recipe.id} className="recipe-item" onClick={() => handleRecipeClick(recipe.id)}>
            <div className="recipe-img-wrapper">
              <img src={recipe.img} alt={recipe.name} className="recipe-img" />
            </div>
            <div className="recipe-details">
              <h3 className="recipe-name">{recipe.name}</h3>
              <p className="recipe-date">
                {recipe.date} <span className="recipe-quantity">จำนวน: {recipe.quantity}</span>
              </p>
              <p className="recipe-description">คำอธิบาย: อาหารจานโปรดของคุณ</p> {/* คำอธิบายใต้วันที่ */}
            </div>
            <div className="arrow">
              <span>→</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;