import React from 'react';
import './EditProfileSection.css';

export default function EditProfileSection({ onSelect }) {
  return (
    <div className="edit-options-box">
      <button className="edit-option-btn" onClick={() => onSelect('name')}>ชื่อ - สกุล</button>
      <button className="edit-option-btn" onClick={() => onSelect('username')}>ชื่อผู้ใช้</button>
      <button className="edit-option-btn" onClick={() => onSelect('profile_url')}>แก้ไขรูปโปรไฟล์</button>
      <button className="edit-option-btn" onClick={() => onSelect('email')}>อีเมล</button>
      <button className="edit-option-btn" onClick={() => onSelect('line_id')}>LineID</button>
    </div>
  );
}
