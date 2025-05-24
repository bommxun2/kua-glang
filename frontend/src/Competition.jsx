import { useState, useEffect } from "react";
import colors from "./styles/colors";
import HeaderRank from "./components/HeaderRank";
import ScoreBar from "./components/ScoreBar";
import ModeRank from "./components/ModeRank";
import FilterBar from "./components/FilterBar";
import Leaderboard from "./components/Leaderboard/Leaderboard";
import MenuBar from "./components/MenuBar";
import QuestModal from "./components/QuestModal";

function Competition() {
  const userId = "user003"; // ✅ เปลี่ยนเป็น userId จริงจากระบบ login
  const maxScore = 100; // ✅ สามารถปรับได้ถ้ามีหลายระดับ
  const [mode, setMode] = useState("trash");
  const [viewScope, setViewScope] = useState("all");
  const [showQuest, setShowQuest] = useState(false);
  const [quests, setQuests] = useState([]);
  const [score, setScore] = useState(0);

  // ✅ โหลดคะแนนรวมจาก backend
  const loadScore = () => {
    fetch(`http://kua-backend:3000/ranking/score/${userId}`, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => {
        setScore(Number(data.score || 0));
      })
      .catch((err) => console.error("โหลดคะแนนไม่สำเร็จ", err));
  };

  // ✅ ส่งคะแนนใหม่กลับ backend
  const updateScore = (userId, newScore) => {
    fetch(`http://kua-backend:3000/ranking/score/${userId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        score: newScore,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("อัปเดตคะแนนสำเร็จ", data);
        setScore(newScore); // อัปเดตคะแนนใน frontend ทันที
      })
      .catch((err) => console.error("อัปเดตคะแนนไม่สำเร็จ", err));
  };

  // ✅ โหลดเควสจาก backend ตอน mount
  useEffect(() => {
    fetch(`http://kua-backend:3000/ranking/quest/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        const normalized = Array.isArray(data)
          ? data.map((q) => ({
              ...q,
              reward_point: Number(q.reward_point),
              claimed: false,
            }))
          : [];
        setQuests(normalized);
      })
      .catch((err) => console.error("โหลดเควสไม่สำเร็จ", err));

    loadScore(); // โหลดคะแนนเมื่อเปิดหน้า
  }, [userId]);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: colors.background }}>
      <HeaderRank />
      <ScoreBar score={score} maxScore={maxScore} />
      <ModeRank currentMode={mode} onChangeMode={setMode} />
      <FilterBar
        viewScope={viewScope}
        onChangeViewScope={setViewScope}
        onOpenQuest={() => setShowQuest(true)}
      />
      <Leaderboard currentMode={mode} viewScope={viewScope} userId={userId} />

      {showQuest && (
        <QuestModal
          onClose={() => setShowQuest(false)}
          quests={quests}
          setQuests={setQuests}
          userId={userId}
          loadScore={loadScore}
          updateScore={updateScore} // ✅ ส่งไปให้ QuestModal เรียกใช้
        />
      )}

      <MenuBar />
    </div>
  );
}

export default Competition;
