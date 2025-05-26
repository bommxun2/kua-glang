import React from "react";
import colors from "../../styles/colors";

function QuestModal({ onClose, quests, setQuests, userId, loadScore }) {
  const handleClaim = (questIndex) => {
    const claimedQuest = quests[questIndex];

    if (claimedQuest.claimed || claimedQuest.status !== "สำเร็จ") return;

    const updatedQuests = [...quests];
    updatedQuests[questIndex] = {
      ...claimedQuest,
      claimed: true,
    };
    setQuests(updatedQuests);

    fetch(`https://8i2v8q86ld.execute-api.us-east-1.amazonaws.com/kua-api/ranking/point/${userId}/${claimedQuest.qId}`, {
      method: "POST",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("🎉 รับเควสสำเร็จ:", data.message);
        loadScore();
      })
      .catch((err) => console.error("❌ รับเควสไม่สำเร็จ", err));
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
          width: "65%",
          maxWidth: "360px",
          fontFamily: "'Bai Jamjuree', sans-serif",
        }}
      >
        <h2 style={{ marginBottom: "16px", color: colors.primary }}>
          🎯 เควสประจำวัน
        </h2>

        {quests.length === 0 && <p>ไม่มีเควสในตอนนี้</p>}
        
        {quests.slice(0, 3).map((quest, index) => { //อยากได้ 3 ค่า {quests.map((quest, index) =>{ ของเดิม
          const isClaimed = quest.claimed;
          const isCompleted = quest.status === "สำเร็จ";

          return (
            <div
              key={quest.qId}
              style={{
                marginBottom: "16px",
                padding: "16px",
                border: `1px solid ${colors.secondary}`,
                borderRadius: "12px",
                boxShadow: "0 2px 6px rgba(0, 0, 0, 0.05)",
                backgroundColor: isClaimed ? "#f3f4f6" : "#fff",
                opacity: isClaimed ? 0.7 : 1,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "8px",
                  alignItems: "center",
                }}
              >
                <span style={{ fontWeight: "bold", fontSize: "14px" }}>
                  🍽 {quest.title}
                </span>
                <span
                  style={{
                    fontSize: "12px",
                    color: isClaimed
                      ? "#6b7280"
                      : isCompleted
                      ? colors.primary
                      : "#9ca3af",
                  }}
                >
                  {isClaimed
                    ? "✅ รับแล้ว"
                    : isCompleted
                    ? "🎉 สำเร็จ"
                    : "🕓 ยังไม่สำเร็จ"}
                </span>
              </div>

              <p
                style={{
                  fontWeight: "bold",
                  color: colors.primary,
                  marginBottom: "8px",
                }}
              >
                +{quest.reward_point} คะแนน
              </p>

              <button
                disabled={!isCompleted || isClaimed}
                onClick={() => handleClaim(index)}
                style={{
                  width: "100%",
                  padding: "8px",
                  backgroundColor:
                    !isCompleted || isClaimed
                      ? "#e5e7eb"
                      : colors.primary,
                  color:
                    !isCompleted || isClaimed ? "#6b7280" : "#fff",
                  border: "none",
                  borderRadius: "8px",
                  cursor:
                    isCompleted && !isClaimed ? "pointer" : "not-allowed",
                  fontWeight: "bold",
                  transition: "all 0.2s ease-in-out",
                }}
              >
                {isClaimed
                  ? "รับแล้ว"
                  : !isCompleted
                  ? "ยังไม่สำเร็จ"
                  : "🎁 รับรางวัล"}
              </button>
            </div>
          );
        })}

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
