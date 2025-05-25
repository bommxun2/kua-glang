  import React, { useEffect, useState } from "react";
  import shareIcon from '../../assets/ProfilePage/shareFood.png';
  import trashIcon from '../../assets/ProfilePage/foodtrash.png';
  import expireIcon from '../../assets/ProfilePage/eaticon.png';
  import './Profile.css';

  const ProfileStats = () => {
    const [stat, setStat] = useState(null);
    const userId = localStorage.getItem('userId')||'user003';

    useEffect(() => {
      fetch(`http://localhost:3000/profile/stat/${userId}`)
        .then((res) => {
          if (!res.ok) throw new Error('โหลดข้อมูลสถิติไม่สำเร็จ');
          return res.json();
        })
        .then((data) => {
          const parsed = {
            share_quantity: parseInt(data.share_quantity || "0", 10),
            reduce_foodwaste: parseInt(data.reduce_foodwaste || "0", 10),
            no_expired: parseInt(data.no_expired || "0", 10),
          };
          console.log("✅ parsed stat", parsed);
          setStat(parsed);
          })
        .catch((err) => console.error(err));

      //const mockStat = {
      //  share_quantity: 3,
      //  reduce_foodwaste: 25,
      //  no_expired: 10,
      //};
      //setStat(mockStat);
    }, []);

    if (!stat) return <div>กำลังโหลดข้อมูลสถิติ...</div>;

    return (
      <div className="profile-stats">
        <div className="stats-row">
          <div className="stat-card">
            <img src={shareIcon} alt="share" className="stat-icon" />
            <div className="stat-value">{stat.share_quantity ?? '-'}</div>
            <div className="stat-label">จำนวนครั้งที่แบ่งปันอาหาร</div>
          </div>
          <div className="stat-card">
            <img src={trashIcon} alt="trash" className="stat-icon" />
            <div className="stat-value">{stat.reduce_foodwaste ?? '-'}</div>
            <div className="stat-label">กิโลกรัมของขยะอาหารที่ลดไป</div>
          </div>
        </div>

        <div className="stat-card stat-full">
          <img src={expireIcon} alt="expire" className="stat-icon-large" />
          <div className="stat-value">{stat.no_expired ?? '-'}</div>
          <div className="stat-label">จำนวนครั้งที่กินอาหารก่อนหมดอายุ</div>
        </div>
      </div>
    );
  };

  export default ProfileStats;
