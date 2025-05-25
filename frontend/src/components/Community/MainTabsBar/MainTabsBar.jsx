// src/components/Community/MainTabsBar/MainTabsBar.jsx
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Bell } from 'lucide-react';
import './MainTabsBar.css'; // <--- Import ไฟล์ CSS ที่สร้างขึ้น

const defaultMainTabs = [
    { name: 'สำหรับคุณ', path: '/community' },
    { name: 'กำลังติดตาม', path: '/community/following' },
    { name: 'แบ่งปัน', path: '/community/share' },
    { name: 'ของที่ได้รับ', path: '/community/received' }
];

export default function MainTabsBar({
    tabs = defaultMainTabs,
}) {
    const navigate = useNavigate();
    const location = useLocation();
    const activePathToCheck = location.pathname;

    return (
        <div className="main-tabs-bar-container">
            {/* Header หลัก "ชุมชน" และ Bell Icon */}
            <div className="main-tabs-header">
                <h1 className="main-tabs-title">ชุมชน</h1>
                <button aria-label="Notifications" className="notifications-button">
                    <Bell strokeWidth={2} /> {/* SVG styles จะถูกควบคุมโดย CSS */}
                </button>
            </div>

            {/* Main Tabs */}
            <div className="tabs-list-container">
                {tabs.map((tab) => {
                    let isActive = activePathToCheck === tab.path;
                    // Logic การจัดการ active tab (เหมือนเดิม หรือปรับปรุงตามความเหมาะสม)
                    if (tab.path === '/community') {
                        isActive = activePathToCheck === '/community' ||
                                   activePathToCheck === '/community/' ||
                                   (activePathToCheck.startsWith('/community/') &&
                                    !tabs.slice(1).some(otherTab => activePathToCheck.startsWith(otherTab.path) && otherTab.path !== '/community'));
                    } else {
                        isActive = activePathToCheck.startsWith(tab.path);
                    }

                    return (
                        <button
                            key={tab.name}
                            onClick={() => navigate(tab.path)}
                            // เพิ่ม class 'active' เมื่อ tab นั้น active
                            className={`tab-button ${isActive ? 'active' : ''}`}
                        >
                            {tab.name}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}