import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaTrash } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';
import './EditIngredient.css';
import MenuBar from '../MenuBar/MenuBar.jsx';

const EditIngredient = () => {
  const [formData, setFormData] = useState({
    foodName: '',
    category: '',
    expired_at: '',
    quntity: '',
    unit: '',
    img_url: '',
  });
  const [imagePreview, setImagePreview] = useState(null);
  const navigate = useNavigate();
  const { folderId, foodId } = useParams();

  useEffect(() => {
    if (folderId && foodId) {
      axios.get(`/food/${folderId}`)
        .then(res => {
          const food = res.data.find(f => f.foodId === foodId);
          if (food) {
            setFormData(food);
            setImagePreview(food.img_url);
          }
        })
        .catch(err => console.error('fetch error', err));
    }
  }, [folderId, foodId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData({ ...formData, img_url: reader.result });
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
      setFormData({ ...formData, img_url: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/foods/${folderId}/${foodId}`, formData);
      alert('บันทึกสำเร็จ!');
      navigate(-1);
    } catch (err) {
      console.error(err);
      alert('เกิดข้อผิดพลาดในการบันทึก');
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`/food/${foodId}`);
      alert('ลบวัตถุดิบเรียบร้อยแล้ว!');
      navigate(-1);
    } catch (err) {
      console.error(err);
      alert('เกิดข้อผิดพลาดในการลบ');
    }
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
      }}>แก้ไขวัตถุดิบ</h1>
      <div className="create-recipe-container">
        <form onSubmit={handleSubmit}>
          <label>
            ชื่อ*:
            <input
              type="text"
              name="foodName"
              value={formData.foodName}
              onChange={handleInputChange}
              required
              style={{ background: '#fff', color: '#333' }}
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
              style={{ background: '#fff', color: '#333' }}
            />
          </label>
          <label>
            ปริมาณ:
            <input
              type="number"
              name="quntity"
              value={formData.quntity}
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
              <option value="ผักและผลไม้">ผักและผลไม้</option>
              <option value="เนื้อสัตว์">เนื้อสัตว์</option>
              <option value="อาหารแห้ง">อาหารแห้ง</option>
              <option value="เครื่องปรุง">เครื่องปรุง</option>
              <option value="อาหารแช่แข็ง">อาหารแช่แข็ง</option>
              <option value="อื่นๆ">อื่นๆ</option>
            </select>
          </div>
          <label>
            รูปภาพ:
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
            <button type="button" onClick={handleDelete} className="delete-btn">
              <FaTrash />
            </button>
          </div>
        </form>
      </div>
      <MenuBar />
    </div>
  );
};

export default EditIngredient;
