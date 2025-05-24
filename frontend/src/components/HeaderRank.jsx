import { FaBell } from "react-icons/fa";

function HeaderRank() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "20px",
      }}
    >
      <h1
        style={{
          fontFamily: "'Bai Jamjuree', sans-serif",
        }}
      >
        แข่งขัน
      </h1>
      <FaBell />
    </div>
  );
}

export default HeaderRank;
