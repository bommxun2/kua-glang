import React from "react";
import colors from "../styles/colors";

function QuestModal({ onClose, quests, setQuests, userId, loadScore, updateScore }) {
  const handleClaim = (questIndex) => {
    const claimedQuest = quests[questIndex];

    // ป้องกันการเคลมซ้ำ
    if (claimedQuest.claimed) return;

    const updatedQuests = [...quests];
    updatedQuests[questIndex] = {
      ...claimedQuest,
      claimed: true,
    };
    setQuests(updatedQuests);

    const reward = claimedQuest.reward_point;

    // ✅ คำนวณคะแนนใหม่แล้วอัปเดต
    const newScore = reward + (claimedQuest.currentScore || 0); // หากมี currentScore แทรกมา
    updateScore(userId, reward + claimedQuest.currentScore || 0);

    // ✅ หรือโหลดคะแนนใหม่จาก backend
    loadScore();
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0,0,0,0.4)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: "#fff",
          padding: "24px",
          borderRadius: "12px",
          width: "90%",
          maxWidth: "400px",
          fontFamily: "'Bai Jamjuree', sans-serif",
        }}
      >
        <h2 style={{ marginBottom: "16px", color: colors.primary }}>
          🎯 เควสประจำวัน
        </h2>
        {quests.length === 0 && <p>ไม่มีเควสในตอนนี้</p>}

        {quests.map((quest, index) => (
          <div
            key={index}
            style={{
              marginBottom: "16px",
              padding: "12px",
              border: `1px solid ${colors.secondary}`,
              borderRadius: "8px",
            }}
          >
            <p style={{ marginBottom: "8px" }}>{quest.description}</p>
            <p style={{ fontWeight: "bold", color: colors.primary }}>
              +{quest.reward_point} คะแนน
            </p>
            <button
              disabled={quest.claimed}
              onClick={() => handleClaim(index)}
              style={{
                marginTop: "8px",
                padding: "6px 12px",
                backgroundColor: quest.claimed ? "#ccc" : colors.primary,
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                cursor: quest.claimed ? "not-allowed" : "pointer",
              }}
            >
              {quest.claimed ? "รับแล้ว" : "รับรางวัล"}
            </button>
          </div>
        ))}

        <button
          onClick={onClose}
          style={{
            marginTop: "12px",
            backgroundColor: "transparent",
            border: `1px solid ${colors.primary}`,
            color: colors.primary,
            padding: "8px 16px",
            borderRadius: "6px",
            cursor: "pointer",
            width: "100%",
          }}
        >
          ปิดหน้าต่าง
        </button>
      </div>
    </div>
  );
}

export default QuestModal;
