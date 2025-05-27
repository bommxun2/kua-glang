import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export default function EditProfileImage() {
  const [previewUrl, setPreviewUrl] = useState('');
  const [fileInfo, setFileInfo] = useState(null);
  const [message, setMessage] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId') || 'RPZ3';

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPreviewUrl(URL.createObjectURL(file));
    setFileInfo({
      fileName: file.name,
      contentType: file.type,
      Blob: file,
    });
    setMessage('');
  };

  const handleUpload = async () => {
    if (!fileInfo) return;
    setIsUploading(true);
    setMessage('');

    try {
      // 1️⃣ ขอ upload URL จาก backend
      const res = await fetch(
        'https://8i2v8q86ld.execute-api.us-east-1.amazonaws.com/kua-api/image/upload-url',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fileName: fileInfo.fileName,
            contentType: fileInfo.contentType,
          }),
        }
      );

      const { uploadUrl, fileUrl } = await res.json();

      // 2️⃣ PUT รูปไป S3
      await fetch(uploadUrl, {
        method: 'PUT',
        headers: { 'Content-Type': fileInfo.contentType },
        body: fileInfo.Blob,
      });

      // 3️⃣ อัปเดต profile_url ไปยัง DynamoDB
      await fetch(
        `https://8i2v8q86ld.execute-api.us-east-1.amazonaws.com/kua-api/profile/stat/${userId}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ profile_url: fileUrl }),
        }
      );

      setMessage('✅ อัปโหลดและอัปเดตสำเร็จ!');
    } catch (err) {
      console.error(err);
      setMessage('❌ อัปโหลดไม่สำเร็จ');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div style={{
      backgroundColor: '#D34670',
      minHeight: '100vh',
      padding: '40px',
      color: 'white',
      textAlign: 'center'
    }}>
      <button
        onClick={() => navigate('/edit-profile')}
        style={{
          background: 'none',
          border: 'none',
          color: 'white',
          fontSize: '1rem',
          cursor: 'pointer',
          marginBottom: '20px'
        }}
      >
        ⬅ กลับ
      </button>

      <h2>แก้ไขรูปโปรไฟล์</h2>

      {/* กล่องอัปโหลด */}
      <div
        onClick={() => fileInputRef.current.click()}
        style={{
          width: '280px',
          height: '180px',
          margin: '0 auto',
          backgroundColor: '#F7EBEB',
          border: '2px dashed white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          borderRadius: '12px',
          color: '#D34670',
          fontWeight: 'bold',
          fontSize: '16px',
        }}
      >
        คลิกเพื่อเลือกไฟล์รูปภาพ
      </div>

      {/* ซ่อน input จริง */}
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        ref={fileInputRef}
        style={{ display: 'none' }}
      />

      {/* แสดงรูป preview */}
      {previewUrl && (
        <div style={{ marginTop: '20px' }}>
          <img
            src={previewUrl}
            alt="preview"
            style={{
              width: '200px',
              borderRadius: '10px',
              border: '2px solid white',
              marginBottom: '12px'
            }}
          />
          <br />
          <button
            onClick={handleUpload}
            disabled={isUploading}
            style={{
              background: 'white',
              color: '#D34670',
              border: 'none',
              borderRadius: '20px',
              padding: '10px 20px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            📤 อัปโหลด
          </button>
        </div>
      )}

      {isUploading && <p style={{ marginTop: '20px' }}>⏳ กำลังอัปโหลด...</p>}
      {message && <p style={{ marginTop: '20px' }}>{message}</p>}
    </div>
  );
}
