import React, { useState } from 'react';
import './HomePage.css';
import { FaSignOutAlt, FaSearch, FaTimes } from 'react-icons/fa'; // ไอคอนจาก React Icons
import { useNavigate } from 'react-router-dom'; // เพิ่ม useNavigate
import '@fontsource/bai-jamjuree'; // Add Bai Jamjuree font import
import MenuBar from '../MenuBar/MenuBar.jsx';
import spaghettiImg from '../../assets/spaghetti.png';
import salapaoImg from '../../assets/salapao.png';
import chinesetableImg from '../../assets/chinesetable.png';

const HomePage = () => {
  const [selectedLocation, setSelectedLocation] = useState("Accom park");
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate(); // ใช้ useNavigate สำหรับการนำทาง

<<<<<<< HEAD
  useEffect(() => {
    // TODO: เปลี่ยน userId ให้เหมาะสม (mock เป็น 1)
    const userId = 1;
    axios.get(`/folder/${userId}`)
      .then(res => setRecipes(Array.isArray(res.data) ? res.data : []))
      .catch(err => console.error('fetch error', err));
  }, []);
=======
  const recipes = [
    { id: 1, name: "สปาเก็ตตี้สูตรเหล่ากง", img: spaghettiImg, date: "07 มกราคม 2025", quantity: "8", description: "วัตถุดิบสำหรับทำสปาเก็ตตี้ซอสมะเขือเทศ🍅" },
    { id: 2, name: "ซาลาเปากลมๆ", img: salapaoImg, date: "14 มีนาคม 2025", quantity: "4", description: "ติ่มซำสูตรโบราณจากอาม่า" },
    { id: 3, name: "อาหารไหว้เจ้าแต่เรากิน", img: chinesetableImg, date: "14 มีนาคม 2025", quantity: "12", description: "แม่หิ้วมาจากบ้านอาม่าแช่ตู้เย็นในทัปเปอร์แวร์" },
  ];
>>>>>>> 73d5cc3 (rank)

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
      <header className="header-homepage">
        <div className="user-name">Joonbom</div>
        <div className="location">
          <span className="location-label">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '6px', color: 'var(--primary)'}}><circle cx="12" cy="10" r="3"/><path d="M12 2C7.03 2 2.5 6.03 2.5 11.5c0 5.47 9.5 10.5 9.5 10.5s9.5-5.03 9.5-10.5C21.5 6.03 16.97 2 12 2z"/></svg>
            {selectedLocation}
          </span>
          <select 
            value={selectedLocation}
            onChange={handleLocationChange}
            className="location-dropdown"
            style={{position: 'absolute', left: 0, top: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer'}}
          >
            <option value="Accom park">Accom park</option>
            <option value="Park Central">Park Central</option>
            <option value="City Square">City Square</option>
          </select>
        </div>
        <button className="logout-btn" onClick={handleLogout}>
          <FaSignOutAlt />
        </button>
      </header>
      <hr className="header-divider" />

      {/* Search Bar */}
      <div className="search-container">
        <FaSearch className="search-icon" />
        <input
          type="text"
          className="search-bar"
          placeholder="ค้นหา"
          value={searchQuery}
          onChange={handleSearchChange}
          style={{ background: '#fff', color: '#333' }}
        />
        {searchQuery && <FaTimes className="clear-icon" onClick={handleClearSearch} />}
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
              <h3 className="recipe-name">{recipe.name} <span style={{float:'right',fontWeight:400}}>{recipe.quantity.padStart(2,'0')}</span></h3>
              <p className="recipe-date" style={{color:'#888',margin:'4px 0 0 0',fontWeight:400,fontSize:'1rem'}}>สร้างเมื่อ {recipe.date}</p>
              <p className="recipe-description" style={{ color: '#111', margin:'4px 0 0 0' }}>{recipe.description}</p>
            </div>
            <div className="arrow">
              <span>→</span>
            </div>
          </div>
        ))}
      </div>
      <MenuBar />
    </div>
  );
};

export default HomePage;