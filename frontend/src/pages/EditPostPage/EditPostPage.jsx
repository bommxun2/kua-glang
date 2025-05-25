// src/pages/EditPostPage/EditPostPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { X, Image as ImageIcon, BarChart2, MapPin, Globe, List } from 'lucide-react';

import { getPostsFromStorage, savePostsToStorage } from '../../utils/storage';
import { MOCK_CURRENT_USER_ID, MOCK_CURRENT_USER_AVATAR } from '../../data/mockData';

import './EditPostPage.css'; // Ensure you have this CSS file or shared one

export default function EditPostPage() {
    const navigate = useNavigate();
    const params = useParams();
    const postId = params.postId ? parseInt(params.postId, 10) : null;

    const [content, setContent] = useState('');
    const [imagePreview, setImagePreview] = useState(null); // Can be existing image URL or new base64
    const [imageFile, setImageFile] = useState(null);     // Only for new file selection
    const [name, setName] = useState('');
    const [location, setLocation] = useState('');
    const [originalPostData, setOriginalPostData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const MAX_CHARS = 280;

    useEffect(() => {
        setIsLoading(true);
        if (postId === null || isNaN(postId)) {
            alert('ID ของโพสต์ไม่ถูกต้อง');
            navigate('/community', { replace: true });
            setIsLoading(false);
            return;
        }
        const posts = getPostsFromStorage();
        const postToEdit = posts.find(p => p.id === postId);
        if (postToEdit) {
            if (postToEdit.authorId !== MOCK_CURRENT_USER_ID) {
                alert('คุณไม่มีสิทธิ์แก้ไขโพสต์นี้');
                navigate('/community', { replace: true });
                setIsLoading(false);
                return;
            }
            setOriginalPostData(postToEdit);
            setName(postToEdit.name || '');
            setLocation(postToEdit.location || '');
            setContent(postToEdit.content || '');
            setImagePreview(postToEdit.image || null); // Show existing image
            setImageFile(null); // Reset any new file selection
        } else {
            alert('ไม่พบโพสต์ที่ต้องการแก้ไข');
            navigate('/community', { replace: true });
        }
        setIsLoading(false);
    }, [postId, navigate]);

    const handleContentChange = (e) => setContent(e.target.value);
    const handleNameChange = (e) => setName(e.target.value);
    const handleLocationChange = (e) => setLocation(e.target.value);

    const handleImageFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file); // A new file is selected
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result); // Update preview to new file
            reader.readAsDataURL(file);
        } else { // User cancelled file selection
            setImageFile(null);
            // Revert preview to the original image if it exists
            setImagePreview(originalPostData ? originalPostData.image : null);
        }
    };

    const removeImage = () => {
        setImageFile(null);     // Clear any new file selection
        setImagePreview(null);  // Clear the preview (image will be removed on save)
        const fileInput = document.getElementById('imageFileEditPageInput');
        if (fileInput) fileInput.value = "";
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Enable submit if there is content OR if there is an image preview (either original or newly selected)
        const hasContentOrImage = !!content.trim() || !!imagePreview;

        if (!hasContentOrImage) {
            alert('กรุณาใส่ข้อความหรือเลือกรูปภาพ');
            return;
        }
        if (!originalPostData || originalPostData.authorId !== MOCK_CURRENT_USER_ID) {
            alert('ข้อมูลไม่ถูกต้อง หรือคุณไม่มีสิทธิ์บันทึก');
            return;
        }

        const postsFromStorage = getPostsFromStorage();
        // imagePreview will be the new base64 if a new file was chosen,
        // or the original image URL/base64 if not changed,
        // or null if the image was removed.
        const imageToSave = imagePreview;

        const updatedPosts = postsFromStorage.map(p =>
            p.id === postId
                ? {
                    ...p,
                    name: name.trim(),
                    location: location.trim(),
                    content: content.trim(),
                    image: imageToSave,
                    time: 'แก้ไขเมื่อสักครู่'
                  }
                : p
        );
        savePostsToStorage(updatedPosts);
        console.log('[EditPostPage] Navigating to /community with state refresh.');
        navigate('/community', { state: { refresh: true, timestamp: Date.now(), from: 'edit' } });
    };

    if (isLoading) { /* ... (Loading JSX) ... */ }
    if (!originalPostData && !isLoading) { /* ... (Error JSX) ... */ }

    // Submit button is disabled if there's no text content AND no image previewed (old or new)
    const isSubmitDisabled = !content.trim() && !imagePreview;


    return (
        <div className="create-post-page-wrapper"> {/* Assuming shared CSS classes */}
            <div className="create-post-page-container">
                <div className="create-post-header">
                    <button onClick={() => navigate(-1)} className="header-back-button" aria-label="ย้อนกลับ"><X /></button>
                    <h2 className="header-title">แก้ไขโพสต์</h2>
                    <button onClick={handleSubmit} disabled={isSubmitDisabled} className="header-submit-button">บันทึก</button>
                </div>
                <div className="create-post-content-area">
                    <img src={originalPostData?.avatar || MOCK_CURRENT_USER_AVATAR} alt="รูปโปรไฟล์" className="user-avatar-post-create" />
                    <div className="post-form-fields">
                        <input type="text" placeholder="ชื่อผู้โพสต์" value={name} onChange={handleNameChange} className="user-name-input" />
                        <input type="text" placeholder="เพิ่มสถานที่ (ถ้ามี)" value={location} onChange={handleLocationChange} className="location-input" />
                        <textarea value={content} onChange={handleContentChange} placeholder="มีอะไรเกิดขึ้นบ้าง?" className="content-textarea" rows="5" />
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
                    <label htmlFor="imageFileEditPageInput" className="toolbar-label-button" title="เพิ่มรูปภาพ"><ImageIcon /><input type="file" id="imageFileEditPageInput" accept="image/*" onChange={handleImageFileChange} className="hidden-file-input" /></label>
                    <button className="toolbar-button" title="GIF" disabled><span className="gif-text">GIF</span></button>
                    <button className="toolbar-button" title="โพล" disabled><BarChart2 /></button>
                    <button className="toolbar-button" title="อีโมจิ" disabled>
                        <svg viewBox="0 0 24 24" aria-hidden="true" className="emoji-icon"><g><path d="M8 9.5C8 8.119 8.992 7 10.227 7h3.546C15.008 7 16 8.119 16 9.5S15.008 12 13.773 12h-3.546C8.992 12 8 10.881 8 9.5zm6.227 5.5H9.773C8.246 15 7 13.881 7 12.5S8.246 10 9.773 10h4.454C15.754 10 17 11.119 17 12.5S15.754 15 14.227 15zM12 22.75C6.072 22.75 1.25 17.928 1.25 12S6.072 1.25 12 1.25 22.75 6.072 22.75 12 17.928 22.75 12 22.75zm0-20C6.9 2.75 2.75 6.9 2.75 12S6.9 21.25 12 21.25s9.25-4.15 9.25-9.25S17.1 2.75 12 2.75z"></path></g></svg>
                    </button>
                    <button className="toolbar-button" title="กำหนดเวลา" disabled><List /></button>
                    <button className="toolbar-button" title="ตำแหน่ง" disabled><MapPin /></button>
                </div>
            </div>
        </div>
    );
}