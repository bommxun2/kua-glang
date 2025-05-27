/* 

  Create Recipe From Folder

*/
import { useState, useEffect, useRef } from 'react';
import './CreateRecipe.css';
import MenuBar from '../MenuBar/MenuBar.jsx';
import { useLocation, useNavigate } from 'react-router-dom';

const CreateRecipe = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [previousData, setPreviousData] = useState({
    folderName: '',
    description: '',
    foodList: [],
  });

  useEffect(() => {
    if (location.state?.previousData) {
      setPreviousData(location.state.previousData);
    }
  }, [location.state]);


  const [formData, setFormData] = useState({
    name: '',
    category: '',
    expired_at: '',
    quantity: '',
    unit: '',
    image_url: null,
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [showOptions, setShowOptions] = useState(false);


  const categories = [
    { label: 'อาหารคาว', value: 'savory' },
    { label: 'ของหวาน', value: 'dessert' },
    { label: 'เครื่องดื่ม', value: 'drink' },
    { label: 'อาหารแช่แข็ง', value: 'frozen' },
    { label: 'ของว่าง', value: 'snack' },
    { label: 'ผักและผลไม้', value: 'vegetable-fruit' },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file); 
      setImagePreview(previewUrl); 

      setFormData((prevFormData) => ({
        ...prevFormData,
        image_url: {
          fileName: file.name,
          contentType: file.type,
          Blob: file,
        },
      }));
    }
    setShowOptions(false);
  };



  const takePhotoInputRef = useRef();

  const handleTakePhoto = () => {
    takePhotoInputRef.current.click();
    setShowOptions(false);
  };


  const removeImage = () => {
    setImagePreview(null);
  };

  const popupRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setShowOptions(false);
      }
    };

    if (showOptions) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showOptions]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const userId = localStorage.getItem('userId');

    const newFoodItem = {
      foodName: formData.name,
      unit: formData.unit,
      expired_at: new Date(formData.expired_at).toISOString(),
      quantity: formData.quantity,
      category: formData.category,
      img_url: formData.image_url || '',
      status: 'ยังไม่ใช้',
    };

    const previousData = location.state?.previousData || {
      folderName: '',
      description: '',
      foodList: [],
    };

    const updatedFoodList = [...(previousData.foodList || []), newFoodItem];

    navigate(`/add-folder/${userId}`, {
      state: {
        foodItem: newFoodItem,
        foodList: updatedFoodList,
        foodList: [...(previousData.foodList || []), newFoodItem], // ✅ ส่งออกมาโดยตรง
        previousData: {
          folderName: previousData.folderName,
          description: previousData.description,
        },
      },
    });

  };

  return (
    <div className="header-create-recipe">
      <div className="header-folder">
        <div className="back-icon-folder" onClick={() => navigate(-1)} role="button" tabIndex={0}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
          </svg>
        </div>
        <h1>เพิ่มอาหาร</h1>
      </div>
      <div className="create-recipe-container">
        <form onSubmit={handleSubmit}>
          <label>
            ชื่อ*:
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className='create-recipe-input'
            />
          </label>
          <label>
            วันหมดอายุ*:
            <input
              type="date"
              name="expired_at"
              value={formData.expired_at}
              onChange={handleInputChange}
              required
              className='create-recipe-input'
            />
          </label>
          <label>
            ปริมาณ:
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleInputChange}
              className='create-recipe-input'
            />
          </label>
          <label>
            หน่วย:
            <input
              type="text"
              name="unit"
              value={formData.unit}
              onChange={handleInputChange}
              className='create-recipe-input'
            />
          </label>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
            <label style={{ marginBottom: 0, minWidth: 80, color: '#D34670', fontWeight: 400 }}>หมวดหมู่:</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="edit-ingredient-category-dropdown"
              required
            >
              <option value="" disabled>เลือกหมวดหมู่</option>
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}

            </select>
          </div>
          <div className="image-section">
            <button type="button" className="main-btn" onClick={() => setShowOptions(true)}>
              ถ่ายหรืออัปโหลดรูปภาพ
            </button>
            {showOptions && (
              <div className="popup" ref={popupRef}>
                <div className="popup-option" onClick={handleTakePhoto}>
                  <div className="icon-button">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="#ffffff" class="size-6">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                      <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
                    </svg>

                    <input
                      ref={takePhotoInputRef}
                      type="file"
                      accept="image/*"
                      capture="environment"
                      style={{ display: 'none' }}
                      onChange={handleImageUpload}
                    />
                  </div>
                  <span className="popup-label">ถ่ายรูป</span>
                </div>

                <label className="popup-option">
                  <div className="icon-button">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="#ffffff" class="size-6">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                    </svg>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      style={{ display: 'none' }}
                    />
                  </div>
                  <span className="popup-label">อัปโหลด</span>
                </label>
              </div>
            )}
            {imagePreview && (
              <div className="image-preview">
                <img src={imagePreview} alt="Preview" />
                <button onClick={removeImage}>ลบรูปภาพ</button>
              </div>
            )}
          </div>

          <div className="form-actions">
            <button type="submit" className="save-recipe-button">บันทึก</button>
          </div>
        </form>
      </div >
      <MenuBar />
    </div >
  );
};

export default CreateRecipe;