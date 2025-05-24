import colors from "../styles/colors";

function ScoreBar({ score, maxScore = 100 }) {
  const progressPercent = Math.min((score / maxScore) * 100, 100);
  const remaining = Math.max(maxScore - score, 0);

  return (
    <div style={{ margin: "24px" }}>
      <p style={{ marginBottom: "8px", fontFamily: "'Bai Jamjuree', sans-serif" }}>
        คะแนนของคุณ: {score} คะแนน
      </p>

      <div
        style={{
          backgroundColor: colors.secondary,
          height: "10px",
          borderRadius: "8px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            backgroundColor: colors.primary,
            width: `${progressPercent}%`,
            height: "10px",
          }}
        ></div>
      </div>

      <small
        style={{
          display: "block",
          marginTop: "4px",
          fontFamily: "'Bai Jamjuree', sans-serif",
        }}
      >
        {score < maxScore
          ? `เหลืออีก ${remaining} คะแนนจะได้อัปแรงค์ใหม่!`
          : "ยอดเยี่ยม! คุณอาจได้อัปแรงค์แล้ว 🎉"}
      </small>
    </div>
  );
}

export default ScoreBar;
