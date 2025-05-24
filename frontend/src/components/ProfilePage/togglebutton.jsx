import React from "react";
import './Profile.css';

export default function ToggleButtons({ selected, onSelect }) {
    return (
        <div className="toggle-container">
            <button
              className={`toggle-btn ${selected === 'post' ? 'active' : ''}`}
              onClick={() => onSelect('post')}
            >
              โพสต์
            </button>
            <button
              className={`toggle-btn ${selected === 'stats' ? 'active' : ''}`}
              onClick={() => onSelect('stats')}
            >
              สถิติ
            </button>
        </div>
    );
}