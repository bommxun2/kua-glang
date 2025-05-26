import { useState,useEffect } from 'react';
import axios from 'axios';
import './HomePage.css';
import { FaSignOutAlt, FaSearch, FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import '@fontsource/bai-jamjuree';
import MenuBar from '../MenuBar/MenuBar.jsx';

const URL = "https://8i2v8q86ld.execute-api.us-east-1.amazonaws.com/kua-api";

const HomePage = () => {
  const [selectedLocation, setSelectedLocation] = useState("Accom park");
  const [searchQuery, setSearchQuery] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem("userId") || "RPZ3" ;


    if (!userId) {
      setUsername("Joonbom");
      setRecipes([
        {
          folderId: '1',
          folderName: 'ข้าวผัดหมู',
          img_url: 'https://insanelygoodrecipes.com/wp-content/uploads/2024/09/pork-fried-rice-skillet.jpg',
          quantity: '3',
          created_at: '2024-12-01T00:00:00.000Z',
          description: 'อาหารจานด่วน ทำง่าย อร่อย'
        },
        {
          folderId: '2',
          folderName: 'ต้มยำกุ้ง',
          img_url: 'https://i.pinimg.com/736x/b0/0c/b5/b00cb5d505446f4c3d86c0cc4a19bbde.jpg',
          quantity: '5',
          created_at: '2024-11-21T00:00:00.000Z',
          description: 'เมนูรสจัดจ้าน แบบไทยแท้'
        }
      ]);
      return;
    }


    axios.get(`${URL}/profile/${userId}`)
      .then((res) => setUsername(res.data.username))
      .catch((err) => {
        console.error("Profile fetch error:", err);
        setUsername("Joonbom"); 
      });

    axios.get(`${URL}/folder/${userId}`)
      .then((res) => setRecipes(Array.isArray(res.data) ? res.data : []))
      .catch((err) => {
        console.error("Recipes fetch error:", err);
        setRecipes([]); 
      });
  }, []);


  const handleLocationChange = (e) => setSelectedLocation(e.target.value);
  const handleSearchChange = (e) => setSearchQuery(e.target.value);
  const handleClearSearch = () => setSearchQuery("");
  const handleLogout = () => {
    alert("คุณได้ทำการล็อกเอาท์แล้ว");
    localStorage.removeItem("userId");
    navigate("/login");
  };
  const handleAddFolder = (id) => navigate(`/add-folder/${id}`);
  const handleRecipeClick = (id) => navigate(`/recipe/${id}`);

  const filteredRecipes = recipes.filter((recipe) =>
    recipe.folderName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="App">
      <header className="header-homepage">
        <div className="user-name">{username}</div>
        <div className="location">
          <span className="location-label">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px', color: 'var(--primary)' }}>
              <circle cx="12" cy="10" r="3" />
              <path d="M12 2C7.03 2 2.5 6.03 2.5 11.5c0 5.47 9.5 10.5 9.5 10.5s9.5-5.03 9.5-10.5C21.5 6.03 16.97 2 12 2z" />
            </svg>
            {selectedLocation}
          </span>
          <select
            value={selectedLocation}
            onChange={handleLocationChange}
            className="location-dropdown"
            style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
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

      <div className="input-group">
        <div className="search-section">
          <div className="search-box">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="ค้นหารายการอาหาร"
              value={searchQuery}
              onChange={handleSearchChange}
            />
            {searchQuery && (
              <FaTimes className="clear-icon" onClick={handleClearSearch} />
            )}
          </div>
          <button
            className="add-new-btn"
            onClick={handleAddFolder}>
            เพิ่มรายการใหม่</button>
        </div>
      </div>

      <div className="recipe-container">
        {filteredRecipes.map((recipe) => (
          <div key={recipe.id} className="recipe-item" onClick={() => handleRecipeClick(recipe.id)}>
            <div className="recipe-img-wrapper">
              <img src={recipe.img_url} alt={recipe.folderName} className="recipe-img" />
            </div>
            <div className="recipe-details">
              <h3 className="recipe-name-wrapper">
                <span className="recipe-name">{recipe.folderName}</span>
                <span className="recipe-quantity">
                  {recipe.quantity?.padStart(2, '0')}
                </span>
              </h3>
              <p className="recipe-date">สร้างเมื่อ {recipe.created_at ? new Date(recipe.created_at).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: '2-digit' }) : ''}</p>
              <p className="recipe-description">{recipe.description}</p>
            </div>
          </div>
        ))}
      </div>
      <MenuBar />
    </div>
  );
};

export default HomePage;
