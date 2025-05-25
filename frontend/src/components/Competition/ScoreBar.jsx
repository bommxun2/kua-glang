import colors from "../../styles/colors";

function ScoreBar({ score, maxScore = 100 }) {
  const currentRoundScore = score % maxScore;
  const progressPercent = (currentRoundScore / maxScore) * 100;
  const remaining = maxScore - currentRoundScore;

  return (
    <div style={{ margin: "24px" }}>
      <p style={{ marginBottom: "8px", fontFamily: "'Bai Jamjuree', sans-serif" }}>
        คะแนนของคุณ: {currentRoundScore}/{maxScore} คะแนน
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
            transition: "width 0.3s",
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
        {remaining > 0
          ? `เหลืออีก ${remaining} คะแนนจะได้อัปแรงค์ใหม่!`
          : "ยอดเยี่ยม! คุณอาจได้อัปแรงค์แล้ว 🎉"}
      </small>
    </div>
  );
}

export default ScoreBar;
