import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './InformFood.css';

const InformFood = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    expirationDate: '',
    quantity: '',
    unit: '',
    image: null,
  });
  const [imagePreview, setImagePreview] = useState(null); // State for image preview

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

  const handleCancel = () => {
    navigate('/');
  };

  return (
    <div className="create-recipe-container">
      <h1>เพิ่มอาหารใหม่</h1>
      <form onSubmit={handleSubmit}>
        <label>
          ชื่อ*:
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </label>
        <label>
          ประเภท:
          <input
            type="text"
            name="type"
            value={formData.type}
            onChange={handleInputChange}
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
          />
        </label>
        <label>
          ปริมาณ:
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleInputChange}
          />
        </label>
        <label>
          หน่วย:
          <input
            type="text"
            name="unit"
            value={formData.unit}
            onChange={handleInputChange}
          />
        </label>
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
          <button type="button" onClick={handleCancel} className="cancel-btn">ย้อนกลับ</button>
          <button type="submit" className="save-btn">บันทึก</button>
        </div>
      </form>
    </div>
  );
};

export default InformFood;