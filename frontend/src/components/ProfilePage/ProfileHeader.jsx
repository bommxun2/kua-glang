import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Profile.css'

export default function ProfileHeader() {
  const [user, setUser] = useState(null);
  const userId = localStorage.getItem('userId');
  const navigate = useNavigate();

  const handleEditClick = () => {
    navigate('/edit-profile');  // เปลี่ยนไปหน้าแก้ไขข้อมูล
  };

  useEffect(() => {
    fetch(`https://8i2v8q86ld.execute-api.us-east-1.amazonaws.com/kua-api/profile/${userId}`)
      .then(response => {
        if (!response.ok) throw new Error('เกิดข้อผิดพลาดในการโหลดข้อมูล');
        return response.json();
      })
      .then(data => setUser(data))
      .catch(error => console.error(error));

    //const mockUser = {
    //  username: "ประภาพร ใจดี",
    //  bio: "ฉันรักการกินและเกลียดการทิ้งอาหารดีๆ",
    //  line_id: "neon2548",
    //  profile_url: "/assets/ProfilePage/demoprofile.jpg", // 🔁 รูป mock
    //};
    //setUser(mockUser);
  }, []);

  if (!user) return <div>กำลังโหลด...</div>;

  return (
    <div className="profile-header">
      <h2 className="profile-title">โปรไฟล์</h2>
      <img src={user.profile_url} alt="profile" className="profile-img" />
      <div className="profile-name">{user.username}</div>
      <div className="profile-bio">{user.bio}</div>
      <div className="line-info">
        <span className="line-id">LINE: {user.line_id}</span>
        <button className="edit-btn" onClick={handleEditClick}>edit</button>
      </div>
    </div>
  );
}
