import React, { useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import './AddFolder.css';

const AddFolder = () => {
  const [folderName, setFolderName] = useState('');
  const [description, setDescription] = useState('');

  const handleAddFolder = () => {
    alert(`Folder "${folderName}" added with description: "${description}"`);
    setFolderName('');
    setDescription('');
  };

  return (
    <>
      <div className="header">
        <h1>เพิ่มอาหารใหม่</h1>
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
        <label>
          เพิ่มอาหารหรือวัตถุดิบ:
          <button className="add-item-button">
            <FaPlus />
          </button>
        </label>
        <div className="form-actions">
          <button className="cancel-button">ย้อนกลับ</button>
          <button onClick={handleAddFolder} className="save-button">บันทึก</button>
        </div>
      </div>
    </>
  );
};

export default AddFolder;