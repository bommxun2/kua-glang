import React, { useEffect, useState } from 'react';
import EditProfileSection from '../../components/EditProfile/EditProfileSection.jsx';
import './EditProfilePage.css'; // ใช้สี #D34670 เป็นธีมหลัก

export default function EditProfilePage() {
  const [userData, setUserData] = useState(null);
  const userId = localStorage.getItem('userId'); // หรือจาก context
  
  //const mockData = {
  //username: 'mock_user',
  //profile_url: '../../assets/ProfilePage/demoprofile.jpg',
  //email: 'mock@example.com',
  //phone_num: '0123456789',
  //line_id: 'mockline',
  //bio: 'Hello! This is a mock bio.',
  //};


useEffect(() => {
  //if (!userId) {
  //  setUserData(mockData); // fallback เมื่อไม่มี userId
  //  return;
  //}

  fetch(`/profile/stat/${userId}`)
    .then(res => res.json())
    .then(data => setUserData(data))
    .catch(err => {
      console.error('โหลดข้อมูลผู้ใช้ล้มเหลว', err);
      setUserData(mockData); // fallback เมื่อโหลดไม่ได้
    });
}, [userId]);
  //if (!userData) return <div>กำลังโหลด...</div>;
  const handleBack = () => {
    window.history.back(); // หรือจะใช้ scroll กลับลงก็ได้
  };

  const handleSelect = (field) => {
    console.log('เลือกแก้ไข:', field);
  // คุณสามารถต่อยอดให้เปิดฟอร์มตาม field ที่เลือกได้ที่นี่
  };

return (
    <div className="edit-profile-page">
      <button className="edit-back-btn" onClick={handleBack}>⬆ แก้ไข</button>

      <div className="edit-profile-header">
        <div className="edit-profile-img" />
        <div className="edit-profile-names">
          <div className="edit-profile-displayname">{userData.username}</div>
          <div className="edit-profile-realname">{userData.name || 'Prapaporn Jaidee'}</div>
        </div>
      </div>

      <EditProfileSection onSelect={handleSelect} />
    </div>
  );
}
