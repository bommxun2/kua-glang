import { useState } from "react";
import { FaRegClipboard } from "react-icons/fa";

function FilterBar({ viewScope, onChangeViewScope, onOpenQuest }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const buttonStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
    minWidth: "150px",
    height: "42px",
    padding: "8px 12px",
    borderRadius: "8px",
    border: "1px solid #d1d5db",
    backgroundColor: "#ffffff",
    fontWeight: "bold",
    fontSize: "14px",
    color: "#111827",
    cursor: "pointer",
    textAlign: "center",
    position: "relative",
  };

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const handleSelect = (value) => {
    onChangeViewScope(value);
    setDropdownOpen(false);
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", margin: "24px" }}>
      <div style={{ display: "flex", gap: "12px", position: "relative" }}>
        {/* ปุ่มเควส */}
        <button onClick={onOpenQuest} style={buttonStyle}>
          <FaRegClipboard size={16} />
          เควสประจำวัน
        </button>

        {/* ปุ่ม dropdown */}
        <div style={{ position: "relative" }}>
          <button
            onClick={toggleDropdown}
            style={{
              ...buttonStyle,
              flexDirection: "row",
              justifyContent: "center", // ⭐ ปรับข้อความให้อยู่ตรงกลาง
              minWidth: "200px",
              gap: "6px",
            }}
          >
            <span>
              ดูอันดับกับ: {viewScope === "friend" ? "เพื่อน" : "ทุกคน"}
            </span>
            <span style={{ fontSize: "10px" }}>▼</span>
          </button>

          {dropdownOpen && (
            <div
              style={{
                position: "absolute",
                top: "110%",
                left: "0",
                backgroundColor: "#ffffff",
                border: "1px solid #d1d5db",
                borderRadius: "8px",
                boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                zIndex: 10,
                width: "100%",
              }}
            >
              <div
                onClick={() => handleSelect("all")}
                style={{
                  padding: "8px 12px",
                  cursor: "pointer",
                  borderBottom: "1px solid #e5e7eb",
                }}
              >
                ทุกคน
              </div>
              <div
                onClick={() => handleSelect("friend")}
                style={{ padding: "8px 12px", cursor: "pointer" }}
              >
                เพื่อน
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default FilterBar;
