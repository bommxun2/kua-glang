import { useEffect, useState } from "react";
import "./Leaderboard.css";
import defaultAvatar from "../../../assets/profilerank.png";

function Leaderboard({ currentMode, viewScope, userId }) {
  const [users, setUsers] = useState([]);
  const [myData, setMyData] = useState(null);
  const [myUsername, setMyUsername] = useState("");

  const modeToType = {
    trash: { api: "reduce_foodwaste", key: "food_waste" },
    share: { api: "share_quantity", key: "share" },
    eatfast: { api: "no_expired", key: "eat_expried" },
  };

  const scoreLabels = {
    trash: "ลดขยะอาหาร",
    share: "แชร์อาหารแล้ว",
    eatfast: "กินก่อนหมดอายุ",
  };

  const fetchProfile = async () => {
    const res = await fetch(
      `https://8i2v8q86ld.execute-api.us-east-1.amazonaws.com/kua-api/profile/${userId}`
    );
    const data = await res.json();
    setMyUsername(data.username);
  };

  const fetchLeaderboard = async () => {
    const { api, key } = modeToType[currentMode];
    const endpoint =
      viewScope === "friend"
        ? `https://8i2v8q86ld.execute-api.us-east-1.amazonaws.com/kua-api/ranking/friend/${userId}?rankingType=${api}`
        : `https://8i2v8q86ld.execute-api.us-east-1.amazonaws.com/kua-api/ranking/${userId}?rankingType=${api}&number=10`;

    const res = await fetch(endpoint);
    const data = await res.json();
    const entries = data[key] || [];
    setUsers(entries);

    const me = entries.find((u) => u.username === myUsername);
    if (me) {
      setMyData(me);
    } else {
      const profileRes = await fetch(
        `https://8i2v8q86ld.execute-api.us-east-1.amazonaws.com/kua-api/profile/${userId}`
      );
      const profileData = await profileRes.json();
      setMyData({
        position: "-",
        username: profileData.username,
        profile_img: profileData.profile_url,
        quantity: "0",
        unit: "",
      });
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [userId]);

  useEffect(() => {
    if (myUsername) {
      fetchLeaderboard();
    }
  }, [currentMode, viewScope, myUsername]);

  const scoreLabel = scoreLabels[currentMode] || "";

  return (
    <div className="leaderboard-container">
      <table className="leaderboard-table">
        <thead>
          <tr className="leaderboard-head-row">
            <th>อันดับ</th>
            <th>ผู้ใช้</th>
            <th>{scoreLabel}</th>
          </tr>
        </thead>
      </table>

      <div className="leaderboard-scroll">
        <table className="leaderboard-table">
          <tbody>
            {users.map((user, index) => (
              <tr key={`${user.username}-${index}`} className="leaderboard-row">
                <td>{user.position}</td>
                <td>
                  <div className="user-cell">
                    <img
                      src={user.profile_img || defaultAvatar}
                      alt="avatar"
                      className="avatar-img"
                    />
                    <span>{user.username}</span>
                  </div>
                </td>
                <td>
                  {user.quantity} {user.unit}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {myData && (
        <div className="leaderboard-footer-bar">
          <span className="leaderboard-footer-rank">
            อันดับของคุณ: <strong>{myData.position}</strong>
          </span>
          <div className="user-cell">
            <img
              src={myData.profile_img || defaultAvatar}
              alt="avatar"
              className="avatar-img"
            />
            {myData.username}
          </div>
        </div>
      )}
    </div>
  );
}

export default Leaderboard;
