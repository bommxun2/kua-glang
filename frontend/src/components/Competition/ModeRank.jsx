import { useState } from "react";
import colors from "../../styles/colors";
function ModeRank({ currentMode, onChangeMode }) {
  
  const buttonGroupStyle = {
    display: "flex",
    border: "2px solid #E6B4B5",
    borderRadius: "8px",
    overflow: "hidden",
    margin: "24px",
    
    
  };

const getButtonStyle = (mode, isFirst, isLast) => ({
  flex: 1,
  minWidth: "120px", // ✅ ป้องกันปุ่มเล็กเกิน
  padding: "12px 16px",
  display: "flex",                  // ✅ ใช้ flex
  alignItems: "center",            // ✅ กลางแนวตั้ง
  justifyContent: "center",        // ✅ กลางแนวนอน
  whiteSpace: "nowrap",            // ✅ ไม่ตัดคำ
  border: "none",
  cursor: "pointer",
  backgroundColor: currentMode === mode ? colors.primary : colors.background,
  color: currentMode === mode ? "#ffffff" : "#000",
  borderRight: !isLast ? "1px solid #e5e7eb" : "none",
  borderRadius: isFirst ? "8px 0 0 8px" : isLast ? "0 8px 8px 0" : "0",
  outline: currentMode === mode ? "2px solid #D34670" : "none",
});

  return (
    <div style={buttonGroupStyle}>
      <button
        style={getButtonStyle("trash", true, false)}
        onClick={() => onChangeMode("trash")}
      >
        ลดอาหารขยะ
      </button>
      <button
        style={getButtonStyle("share", false, false)}
        onClick={() => onChangeMode("share")}
      >
        แชร์ให้เพื่อนบ้าน
      </button>
      <button
        style={getButtonStyle("eatfast", false, true)}
        onClick={() => onChangeMode("eatfast")}
      >
        กินก่อนหมดอายุ
      </button>
    </div>
  );
}

export default ModeRank;
