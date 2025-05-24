import React, { useState } from "react";
import ProfileHeader from "../../components/ProfilePage/ProfileHeader";
import ProfileStat from "../../components/ProfilePage/ProfileStats";
import MenuBar from "../../components/MenuBar/MenuBar";
import ToggleButtons from "../../components/ProfilePage/togglebutton";
import './ProfilePage.css';

const ProfilePage = () => {
    const [selectedTab, setSelectedTab] = useState('stats');

    return (
        <div className='profile-page'>
            <ProfileHeader />
            <ToggleButtons selected={selectedTab} onSelect={setSelectedTab} />
            {selectedTab === 'stats' && (
                <>
                {/* <PeriodSelector /> */}
                <ProfileStat />
                <button className="share-btn">แชร์ให้เพื่อนของคุณเลย</button>
                </>
            )}

            <MenuBar />
        </div>
    );
};

export default ProfilePage;