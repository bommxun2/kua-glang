import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function EditFieldPage() {
  const { field } = useParams();
  const navigate = useNavigate();
  const [value, setValue] = useState('');
  const [userData, setUserData] = useState(null);
  const userId = localStorage.getItem('userId') || 'user003'; // ใช้จริงใส่ localStorage

  useEffect(() => {
    fetch(`http://localhost:3000/profile/${userId}`)
      .then(res => res.json())
      .then(data => {
        setUserData(data);
        setValue(data[field] || '');
      })
      .catch(() => navigate('/edit-profile')); // ถ้า error ให้กลับ
  }, [field]);

  const handleSave = async () => {
    try {
      const res = await fetch(`http://localhost:3000/profile/stat/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: value }),
      });

      if (!res.ok) throw new Error('อัปเดตไม่สำเร็จ');
      alert('✅ อัปเดตสำเร็จ');
      navigate('/edit-profile');
    } catch (err) {
      alert('❌ เกิดข้อผิดพลาด');
    }
  };

  if (!userData) return <div>กำลังโหลด...</div>;

  return (
    <div style={{ backgroundColor: '#D34670', minHeight: '100vh', padding: '20px', color: 'white' }}>
      <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: 'white' }}>⬅ กลับ</button>
      <h2>แก้ไข {field}</h2>
      <input
        value={value}
        onChange={e => setValue(e.target.value)}
        style={{backgroundColor: '#F7EBEB',color: 'black', padding: '10px', width: '100%', borderRadius: '8px', marginTop: '12px' }}
      />
      <button onClick={handleSave} style={{
        marginTop: '16px',
        backgroundColor: 'white',
        color: '#D34670',
        border: 'none',
        padding: '10px 16px',
        borderRadius: '8px',
        cursor: 'pointer'
      }}>บันทึก</button>
    </div>
  );
}
