import { useEffect, useState } from "react";
import colors from "../../styles/colors";
import "./Leaderboard.css";

function Leaderboard({ currentMode, viewScope, userId }) {
  const [users, setUsers] = useState([]);
  const [myData, setMyData] = useState(null);

  const modeToType = {
    trash: "food_waste",
    share: "share",
    eatfast: "eat_expried",
  };

  const scoreLabels = {
    trash: "ลดขยะอาหาร",
    share: "แชร์อาหารแล้ว",
    eatfast: "กินก่อนหมดอายุ",
  };

  const fetchLeaderboard = async () => {
    const type = modeToType[currentMode];
    const endpoint =
      viewScope === "friend"
        ? `http://localhost:3000/ranking/friend/${userId}?rankingType=${type}`
        : `http://localhost:3000/ranking/${userId}?rankingType=${type}&number=10`;

    try {
      const res = await fetch(endpoint);
      const data = await res.json();
      const entries = data[type] || [];
      setUsers(entries);
      const me = entries.find((u) => u.username === "ฉัน");
      if (me) setMyData(me);
    } catch (err) {
      console.error("โหลดอันดับไม่สำเร็จ", err);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, [currentMode, viewScope]);

  const scoreLabel = scoreLabels[currentMode] || "";

  return (
    <div className="leaderboard-container">
      <table className="leaderboard-table">
        <colgroup>
          <col style={{ width: "20%" }} />
          <col style={{ width: "40%" }} />
          <col style={{ width: "40%" }} />
        </colgroup>
        <thead className="leaderboard-head">
          <tr>
            <th>อันดับ</th>
            <th>ผู้ใช้</th>
            <th>{scoreLabel}</th>
          </tr>
        </thead>
      </table>

      <div className="leaderboard-scroll">
        <table className="leaderboard-table">
          <colgroup>
            <col style={{ width: "20%" }} />
            <col style={{ width: "60%" }} />
            <col style={{ width: "20%" }} />
          </colgroup>
          <tbody>
            {users.map((user, index) => (
              <tr
                key={`${user.username}-${index}`}
                className="leaderboard-row"
                style={{
                  backgroundColor:
                    index % 2 === 0 ? colors.secondary : colors.background,
                }}
              >
                <td>{user.position}</td>
                <td className="user-cell">
                  <img
                    src={user.profile_img || "https://via.placeholder.com/30"}
                    alt="avatar"
                    className="avatar-img"
                  />
                  {user.username}
                </td>
                <td>
                  {user.quantity} {user.unit}
                </td>
              </tr>
            ))}
            {Array.from({ length: Math.max(0, 9 - users.length) }).map(
              (_, i) => (
                <tr
                  key={`blank-${i}`}
                  className="leaderboard-row"
                  style={{
                    backgroundColor:
                      (users.length + i) % 2 === 0
                        ? colors.secondary
                        : colors.background,
                  }}
                >
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>

      {myData && (
        <table className="leaderboard-table">
          <colgroup>
            <col style={{ width: "20%" }} />
            <col style={{ width: "60%" }} />
            <col style={{ width: "20%" }} />
          </colgroup>
          <tbody>
            <tr className="leaderboard-footer">
              <td>{myData.position}</td>
              <td className="user-cell">
                <img
                  src={myData.profile_img || "https://via.placeholder.com/30"}
                  alt="avatar"
                  className="avatar-img"
                />
                {myData.username}
              </td>
              <td>
                {myData.quantity} {myData.unit}
              </td>
            </tr>
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Leaderboard;
