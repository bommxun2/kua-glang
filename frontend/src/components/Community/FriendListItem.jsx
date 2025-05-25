// src/components/FriendList/FriendListItem.jsx
import React from 'react';
import { UserPlus, UserX } from 'lucide-react';
import './FriendListItem.css'; // <--- Import ไฟล์ CSS ที่สร้างขึ้น

export default function FriendListItem({
    user,
    isAlreadyFriend,
    isSuggestion = false,
    onToggleFriendship
}) {
    if (!user) return null;

    // กำหนด class สำหรับปุ่มแบบ dynamic
    const buttonClasses = `friendship-toggle-button ${
        isAlreadyFriend ? 'unfollow-button' : 'follow-button'
    }`;

    return (
        <div className="friend-list-item-container">
            <div className="user-info-section">
                <img
                    src={user.avatar || '/user-avatar-placeholder.png'} // ควรมี placeholder image ที่ public
                    alt={user.name || 'User Avatar'}
                    className="user-avatar"
                />
                <div className="user-details">
                    <p className="user-name">{user.name || 'Unknown User'}</p>
                    {isSuggestion && !isAlreadyFriend && (
                        <p className="suggestion-text">แนะนำสำหรับคุณ</p>
                    )}
                </div>
            </div>

            <button
                onClick={() => onToggleFriendship(user.id)}
                className={buttonClasses}
            >
                {isAlreadyFriend ? <UserX /> : <UserPlus />}
                {isAlreadyFriend ? 'เลิกติดตาม' : 'ติดตาม'}
            </button>
        </div>
    );
}