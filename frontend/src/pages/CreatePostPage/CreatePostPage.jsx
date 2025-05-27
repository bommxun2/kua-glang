import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Image as ImageIcon, BarChart2, MapPin, Globe, List } from 'lucide-react';

import { createPost } from '../../services/postService';
import { useAuth } from '../../contexts/AuthContext';

import './CreatePostPage.css';

export default function CreatePostPage() {
  const navigate = useNavigate();
  const { userId, username = "ผู้ใช้" } = useAuth();

  const [content, setContent] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [location, setLocation] = useState('');

  const MAX_CHARS = 280;

  const handleContentChange = (e) => setContent(e.target.value);
  const handleLocationChange = (e) => setLocation(e.target.value);

  const handleImageFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      try {
        const reader = new FileReader();
        reader.onloadend = () => setImagePreview(reader.result);
        reader.readAsDataURL(file);
      } catch (err) {
        console.error("Error reading file:", err);
        setImageFile(null);
        setImagePreview(null);
      }
    } else {
      setImageFile(null);
      setImagePreview(null);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    const fileInput = document.getElementById('imageFileCreatePageInput');
    if (fileInput) fileInput.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId) {
      alert("กรุณาเข้าสู่ระบบก่อนโพสต์");
      return;
    }

    if (!content.trim() && !imagePreview) {
      alert('กรุณาใส่ข้อความหรือเลือกรูปภาพ');
      return;
    }

    try {
      const postData = {
        caption: content.trim(),
        img_url: imagePreview || "",
        location: location.trim() || ""
      };

      console.log('>> ส่ง postData:', postData);
      const response = await createPost(userId, postData);
      console.log('[CreatePostPage] โพสต์สำเร็จ:', response);

      navigate('/community', {
        state: { refresh: true, timestamp: Date.now(), from: 'create' },
      });
    } catch (error) {
      console.error('เกิดข้อผิดพลาดในการโพสต์:', error);
      alert('ไม่สามารถโพสต์ได้ กรุณาลองใหม่');
    }
  };

  const isSubmitDisabled = !content.trim() && !imageFile;

  return (
    <div className="create-post-page-wrapper">
      <div className="create-post-page-container">
        <div className="create-post-header">
          <button onClick={() => navigate(-1)} className="header-back-button" aria-label="ย้อนกลับ"><X /></button>
          <h2 className="header-title">สร้างโพสต์</h2>
          <button onClick={handleSubmit} disabled={isSubmitDisabled} className="header-submit-button">โพสต์</button>
        </div>

        <div className="create-post-content-area">
          <div className="user-avatar-post-create" />
          <div className="post-form-fields">
            <p className="post-user-name">{username}</p>
            <input
              type="text"
              placeholder="เพิ่มสถานที่ (ถ้ามี)"
              value={location}
              onChange={handleLocationChange}
              className="location-input"
            />
            <textarea
              value={content}
              onChange={handleContentChange}
              placeholder="มีอะไรเกิดขึ้นบ้าง?"
              className="content-textarea"
              rows="5"
            />
            {imagePreview && (
              <div className="image-preview-container">
                <img src={imagePreview} alt="รูปภาพที่เลือก" className="image-preview" />
                <button onClick={removeImage} className="remove-image-button" aria-label="ลบรูปภาพ"><X /></button>
              </div>
            )}
          </div>
        </div>

        <div className="post-meta-toolbar">
          <button className="reply-permission-button"><Globe /> ทุกคนสามารถตอบกลับได้</button>
          <div className="char-counter">{content.length} / {MAX_CHARS}</div>
        </div>

        <div className="actions-toolbar">
          <label htmlFor="imageFileCreatePageInput" className="toolbar-label-button" title="เพิ่มรูปภาพ">
            <ImageIcon />
            <input
              type="file"
              id="imageFileCreatePageInput"
              accept="image/*"
              onChange={handleImageFileChange}
              className="hidden-file-input"
            />
          </label>
          <button className="toolbar-button" title="GIF" disabled><span className="gif-text">GIF</span></button>
          <button className="toolbar-button" title="โพล" disabled><BarChart2 /></button>
          <button className="toolbar-button" title="อีโมจิ" disabled>
            <svg viewBox="0 0 24 24" aria-hidden="true" className="emoji-icon">
              <g><path d="M8 9.5C8 8.119 8.992 7 10.227 7h3.546C15.008 7 16 8.119 16 9.5S15.008 12 13.773 12h-3.546C8.992 12 8 10.881 8 9.5zm6.227 5.5H9.773C8.246 15 7 13.881 7 12.5S8.246 10 9.773 10h4.454C15.754 10 17 11.119 17 12.5S15.754 15 14.227 15zM12 22.75C6.072 22.75 1.25 17.928 1.25 12S6.072 1.25 12 1.25 22.75 6.072 22.75 12 17.928 22.75 12 22.75zm0-20C6.9 2.75 2.75 6.9 2.75 12S6.9 21.25 12 21.25s9.25-4.15 9.25-9.25S17.1 2.75 12 2.75z"></path></g>
            </svg>
          </button>
          <button className="toolbar-button" title="กำหนดเวลา" disabled><List /></button>
          <button className="toolbar-button" title="ตำแหน่ง" disabled><MapPin /></button>
        </div>
      </div>
    </div>
  );
}
