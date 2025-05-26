import { useState, useEffect, useRef } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import './Editfood.css';
import MenuBar from '../MenuBar/MenuBar.jsx';
import axios from 'axios';

const EditFood = () => {
  const { folderId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [foodId, setFoodId] = useState(null);

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
  const takePhotoInputRef = useRef();
  const popupRef = useRef();

  useEffect(() => {
    const item = location.state?.previousData;
    if (item) {
      setFoodId(item.foodId);
      setFormData({
        name: item.foodName || '',
        category: item.category || '',
        expired_at: item.expired_at ? item.expired_at.slice(0, 10) : '',
        quantity: item.quantity || '',
        unit: item.unit || '',
        image_url: null,
      });
      if (item.img_url) {
        setImagePreview(item.img_url);
      }
    }
  }, [location.state]);

  console.log(formData)
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
      setFormData({
        ...formData,
        image_url: {
          fileName: file.name,
          contentType: file.type,
          Blob: file,
        },
      });
    }
    setShowOptions(false);
  };

  const handleTakePhoto = () => {
    takePhotoInputRef.current.click();
    setShowOptions(false);
  };

  const removeImage = () => {
    setImagePreview(null);
    setFormData({ ...formData, image_url: null });
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let uploadedImageUrl = imagePreview;

      if (formData.image_url && formData.image_url.Blob) {
        const img_inform = {
          fileName: formData.image_url.fileName,
          contentType: formData.image_url.contentType,
        };

        const { data } = await axios.post(
          `https://8i2v8q86ld.execute-api.us-east-1.amazonaws.com/kua-api/image/upload-url`,
          img_inform
        );

        await fetch(data.uploadUrl, {
          method: 'PUT',
          headers: {
            'Content-Type': formData.image_url.contentType,
          },
          body: formData.image_url.Blob,
        });

        uploadedImageUrl = data.fileUrl;
      }

      const payload = {
        foodName: formData.name,
        unit: formData.unit,
        expired_at: new Date(formData.expired_at).toISOString(),
        quantity: formData.quantity,
        category: formData.category,
        img_url: uploadedImageUrl || '',
      };

      await axios.put(
        `https://8i2v8q86ld.execute-api.us-east-1.amazonaws.com/kua-api/food/${folderId}/${foodId}`,
        payload
      );

      //alert('บันทึกอาหารสำเร็จ');
      navigate(-1);
    } catch (err) {
      console.error('เกิดข้อผิดพลาด:', err);
      alert('บันทึกไม่สำเร็จ');
    }
  };

    const handledeleteFolder = async () => {
    //const userId = localStorage.getItem('userId') || "RPZ3";
    try {
      await axios.delete(
        `https://8i2v8q86ld.execute-api.us-east-1.amazonaws.com/kua-api/food/${foodId}`
      );
      navigate('/');
    } catch (err) {
      console.error('เกิดข้อผิดพลาด', err);
      alert('บันทึกไม่สำเร็จ');
    }
  };

  return (
    <div className="header-create-recipe">
      <div className="header-folder">
        <div className="back-icon-folder" onClick={() => navigate(-1)} role="button" tabIndex={0}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
          </svg>
        </div>
        <h1>แก้ไขอาหาร</h1>
      </div>

      <div className="create-recipe-container">
        <form onSubmit={handleSubmit}>
          <label>ชื่อ*:
            <input type="text" name="name" value={formData.name} onChange={handleInputChange} required className="create-recipe-input" />
          </label>

          <label>วันหมดอายุ*:
            <input type="date" name="expired_at" value={formData.expired_at} onChange={handleInputChange} required className="create-recipe-input" />
          </label>

          <label>ปริมาณ:
            <input type="number" name="quantity" value={formData.quantity} onChange={handleInputChange} className="create-recipe-input" />
          </label>

          <label>หน่วย:
            <input type="text" name="unit" value={formData.unit} onChange={handleInputChange} className="create-recipe-input" />
          </label>

          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
            <label style={{ minWidth: 80, color: '#D34670', fontWeight: 400 }}>หมวดหมู่:</label>
            <select name="category" value={formData.category} onChange={handleInputChange} className="edit-ingredient-category-dropdown" required>
              <option value="" disabled>เลือกหมวดหมู่</option>
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>

          <div className="image-section">
            <button type="button" className="main-btn" onClick={() => setShowOptions(true)}>ถ่ายหรืออัปโหลดรูปภาพ</button>

            {showOptions && (
              <div className="popup" ref={popupRef}>
                <div className="popup-option" onClick={handleTakePhoto}>
                  <div className="icon-button">
                    📸
                    <input ref={takePhotoInputRef} type="file" accept="image/*" capture="environment" style={{ display: 'none' }} onChange={handleImageUpload} />
                  </div>
                  <span className="popup-label">ถ่ายรูป</span>
                </div>
                <label className="popup-option">
                  <div className="icon-button">🖼️
                    <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageUpload} />
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
            <button onClick={handledeleteFolder} className="save-recipe-button">ลบ</button>
            <button type="submit" className="save-recipe-button">บันทึกการแก้ไข</button>
          </div>
        </form>
      </div>
      <MenuBar />
    </div>
  );
};
export default EditFood;
