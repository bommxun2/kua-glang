import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CreateRecipe.css';
import MenuBar from '../MenuBar/MenuBar.jsx';

const CreateRecipe = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    expirationDate: '',
    quantity: '',
    unit: '',
    image: null,
  });
  const [imagePreview, setImagePreview] = useState(null); // State for image preview

  // หมวดหมู่เดียวกับหน้า RecipeDetail
  const categories = [
    'ผักและผลไม้',
    'เนื้อสัตว์',
    'อาหารแห้ง',
    'เครื่องปรุง',
    'อาหารแช่แข็ง',
    'อื่นๆ'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, image: file });
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result); // Set preview URL
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null); // Clear preview if no file
    }
  };

  const handleTakePhoto = () => {
    alert('ฟังก์ชันถ่ายภาพยังไม่พร้อมใช้งานในขณะนี้');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Data:', formData);
    alert('สูตรอาหารถูกบันทึกเรียบร้อยแล้ว!');
  };

  const handleGoBack = () => {
    navigate(-1); // กลับไปหน้าก่อนหน้า (เช่น recipe)
  };

  return (
    <div className="edit-ingredient">
      <h1 style={{
        color: '#D34670',
        fontFamily: 'Bai Jamjuree',
        fontWeight: 700,
        fontSize: 48,
        textAlign: 'center',
        marginTop: 32,
        marginBottom: 0,
        textShadow: '2px 2px 6px #e6b4b5'
      }}>เพิ่มอาหารใหม่</h1>
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
              style={{ background: '#fff', color: '#333' }}
            />
          </label>
          <label>
            วันหมดอายุ*:
            <input
              type="date"
              name="expirationDate"
              value={formData.expirationDate}
              onChange={handleInputChange}
              required
              style={{ background: '#fff', color: '#333' }}
            />
          </label>
          <label>
            ปริมาณ:
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleInputChange}
              style={{ background: '#fff', color: '#333' }}
            />
          </label>
          <label>
            หน่วย:
            <input
              type="text"
              name="unit"
              value={formData.unit}
              onChange={handleInputChange}
              style={{ background: '#fff', color: '#333' }}
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
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <label>
            รูปภาพ:
            <button type="button" className="upload-label" onClick={handleTakePhoto}>ถ่ายภาพ</button>
            <label className="upload-label">
              อัปโหลดรูปภาพจากเครื่อง
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
              />
            </label>
          </label>
          {imagePreview && (
            <div className="image-preview">
              <img src={imagePreview} alt="Preview" className="preview-img" />
            </div>
          )}
          <div className="form-actions">
            <button type="button" onClick={handleGoBack} className="cancel-btn">ย้อนกลับ</button>
            <button type="submit" className="save-btn">บันทึก</button>
          </div>
        </form>
      </div>
      <MenuBar />
    </div>
  );
};

export default CreateRecipe;