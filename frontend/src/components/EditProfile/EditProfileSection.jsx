import React from 'react';
import { useNavigate } from 'react-router-dom';
import './EditProfileSection.css';

export default function EditProfileSection() {
  const navigate = useNavigate();
  return (
    <div className="edit-options-box">
      <button className="edit-option-btn" onClick={() => navigate('/edit/username')}>ชื่อผู้ใช้</button>
      <button className="edit-option-btn" onClick={() => navigate('/edit/profile_url')}>แก้ไขรูปโปรไฟล์</button>
      <button className="edit-option-btn" onClick={() => navigate('/edit/email')}>อีเมล</button>
      <button className="edit-option-btn" onClick={() => navigate('/edit/line_id')}>LineID</button>
      <button className="edit-option-btn" onClick={() => navigate('/edit/phone_num')}>เบอร์โทรศัพท์</button>
      <button className="edit-option-btn" onClick={() => navigate('/edit/bio')}>Bio</button>
    </div>
  );
}
