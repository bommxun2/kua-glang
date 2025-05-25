import React, { useState } from 'react';
import './RecipeDetail.css';
import { FaSearch, FaTimes, FaBell, FaArrowLeft } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';
import MenuBar from '../MenuBar/MenuBar.jsx';


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
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState('');
  const navigate = useNavigate();

  const mockData = [
    {
      foodId: '1',
      foodName: 'เค้กจ้า',
      quantity: 4,
      unit: 'ชิ้น',
      expired_at: '2025-06-01',
      category:"dessert",
      img_url: 'https://i.pinimg.com/736x/75/a5/62/75a562db96c7f70fcd61b0d7cf37529c.jpg',
      status: 'ยังไม่ใช้'
    },
    {
      foodId: '2',
      foodName: 'มันฝรั่ง',
      quantity: 3,
      unit: 'หัว',
      expired_at: '2025-06-03',
      category:"vegetable-fruit",
      img_url: 'https://i.pinimg.com/736x/05/3c/4e/053c4e34dc5b10cdda768068cd19bbed.jpg',
      status: 'ยังไม่ใช้'
    },
    {
      foodId: '3',
      foodName: 'หอมใหญ่',
      quantity: 1,
      unit: 'หัว',
      expired_at: null,
      category:"vegetable-fruit",
      img_url: 'https://i.pinimg.com/736x/ac/71/0b/ac710bfaa12bb7b8f658a5da6c19aa56.jpg',
      status: 'ยังไม่ใช้'
    }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const id = folderId || '1';
        const response = await axios.get(`http://localhost:3000/food/folder/${id}`);
        const filtered = response.data.filter(item => item.status === 'ยังไม่ใช้');
        setItems(filtered.length > 0 ? filtered : mockData);
      } catch (error) {
        console.error('Error fetching food items:', error);
        setItems(mockData);
      }
    };
    fetchData();
  }, [folderId]);


  const handleSearchChange = (e) => setSearchQuery(e.target.value);
  const handleClearSearch = () => setSearchQuery("");
  const handleAddItem = () => navigate('/create-recipe');
  const handleIngredientClick = (id) => navigate(`/edit-ingredient/${id}`);


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
        <h1>ครัวกลาง</h1>
        <FaBell className="notification-icon large-icon" />
      </div>

      {/* Add Button */}
      <div className="add-item-recipedetail">
        <button className="add-item-btn" onClick={handleAddItem}>+ เพิ่ม</button>
        <button className="share-item-btn">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30">
            <path d="M 23 3 A 4 4 0 0 0 19 7 A 4 4 0 0 0 19.09375 7.8359375 L 10.011719 12.376953 A 4 4 0 0 0 7 11 A 4 4 0 0 0 3 15 A 4 4 0 0 0 7 19 A 4 4 0 0 0 10.013672 17.625 L 19.089844 22.164062 A 4 4 0 0 0 19 23 A 4 4 0 0 0 23 27 A 4 4 0 0 0 27 23 A 4 4 0 0 0 23 19 A 4 4 0 0 0 19.986328 20.375 L 10.910156 15.835938 A 4 4 0 0 0 11 15 A 4 4 0 0 0 10.90625 14.166016 L 19.988281 9.625 A 4 4 0 0 0 23 11 A 4 4 0 0 0 27 7 A 4 4 0 0 0 23 3 z" />
          </svg>
        </button>
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

        {filteredItems.map((item) => (
          <div key={item.foodId} className="item-card" onClick={() => handleIngredientClick(item.foodId)}>
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
              <p className="item-quantity">{item.quantity} {item.unit}</p>
            </div>
          </div>
        ))}
      </div>
      <MenuBar />
    </div>
  );
};

export default RecipeDetail;
