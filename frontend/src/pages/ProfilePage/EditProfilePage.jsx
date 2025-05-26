import React, { useEffect, useState } from 'react';
import EditProfileSection from '../../components/EditProfile/EditProfileSection.jsx';
import { useNavigate } from 'react-router-dom';
import './EditProfilePage.css'; // ใช้สี #D34670 เป็นธีมหลัก

export default function EditProfilePage() {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId') || 'RPZ3'; // หรือจาก context
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

  fetch(`https://8i2v8q86ld.execute-api.us-east-1.amazonaws.com/kua-api/profile/${userId}`)
    .then(res => res.json())
    .then(data => setUserData(data))
    .catch(err => {
      console.error('โหลดข้อมูลผู้ใช้ล้มเหลว', err);
      //setUserData(mockData); // fallback เมื่อโหลดไม่ได้
    });
}, [userId]);
  
if (!userData) return <div>กำลังโหลด...</div>;

const handleBack = () => {
  navigate('/profile'); // หรือจะใช้ scroll กลับลงก็ได้
};

const handleSelect = (field) => {
  console.log('เลือกแก้ไข:', field);
// คุณสามารถต่อยอดให้เปิดฟอร์มตาม field ที่เลือกได้ที่นี่
};

return (
    <div className="edit-profile-page">
      <button className="edit-back-btn" onClick={handleBack}>⬆ ย้อนกลับ</button>

      <div className="edit-profile-header">
        <img className="edit-profile-img" src={userData.profile_url} alt="Profile" />
        <div className="edit-profile-displayname">{userData.username}</div>
      </div>
      <EditProfileSection onSelect={handleSelect} />
    </div>
  );
}
