import { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom'; // เพิ่ม useLocation
import './EditFolder.css';
import axios from 'axios';

const EditFolder = () => {
  const navigate = useNavigate();
  const { folderId } = useParams();
  const location = useLocation(); // รับค่าที่ส่งมาจากหน้าเดิม

  // ใช้ location.state.folderName เป็นค่าเริ่มต้น
  const [folderName, setFolderName] = useState(location.state?.folderName || '');
  const [description, setDescription] = useState('');

  const handleEditFolder = async () => {
    const userId = localStorage.getItem('userId') || "RPZ3";
    try {
      const payload = {
        folderName,
        description,
      };
      const res = await axios.put(
        `https://8i2v8q86ld.execute-api.us-east-1.amazonaws.com/kua-api/folder/${userId}/${folderId}`,
        payload
      );
      setFolderName('');
      setDescription('');
      navigate('/');
    } catch (err) {
      console.error('เกิดข้อผิดพลาด', err);
      alert('บันทึกไม่สำเร็จ');
    }
  };

  const handledeleteFolder = async () => {
    const userId = localStorage.getItem('userId') || "RPZ3";

    try {
      const respon = await axios.delete(
        `https://8i2v8q86ld.execute-api.us-east-1.amazonaws.com/kua-api/folder/${userId}/${folderId}`
      );
      setFolderName('');
      setDescription('');
      navigate('/');
    } catch (err) {
      console.error('เกิดข้อผิดพลาด', err);
      alert('บันทึกไม่สำเร็จ');
    }
  };

  return (
    <>
      <div className="header-folder">
        <div className="back-icon-folder" onClick={() => navigate(-1)} role="button" tabIndex={0}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
          </svg>
        </div>
        <h1>แก้ไขรายการอาหาร</h1>
      </div>

      <div className="add-folder-container">
        <label>
          ชื่อรายการ * :
          <input
            type="text"
            placeholder="ชื่อรายการ"
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
            className="folder-input"
          />
        </label>
        <label>
          คำอธิบาย * :
          <input
            type="text"
            placeholder="คำอธิบาย"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="folder-input"
          />
        </label>
        <div className="form-actions">
          <button onClick={handledeleteFolder} className="save-button">ลบรายการอาหาร</button>
          <button onClick={handleEditFolder} className="save-button">บันทึกการแก้ไข</button>
        </div>
      </div>
    </>
  );
};

export default EditFolder;
