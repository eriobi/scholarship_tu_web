import React from "react";

const colors = [
  "#EF5350", // red
  "#AB47BC", // purple
  "#5C6BC0", // indigo
  "#29B6F6", // blue
  "#26A69A", // teal
  "#66BB6A", // green
  "#FFCA28", // yellow
  "#FF7043", // orange
];

function getColorFromName(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

// รองรับภาษาไทย
function getInitial(name) {
  if (!name) return "?";

  const cleaned = name.trim().normalize("NFC");

  for (const char of cleaned) {
    // ถ้าไม่ใช่ตัวผสม (สระลอย)
    if (!/[\u0E31-\u0E4E]/.test(char)) {
      return char.toUpperCase();
    }
  }
  return "?";
}

export default function Avatar({ name = "", size = 120 }) {
  const initial = getInitial(name);
  const bg = getColorFromName(name);

  return (
    <div
      className="rounded-full flex items-center justify-center text-white font-semibold"
      style={{
        width: size,
        height: size,
        backgroundColor: bg,
        fontSize: size * 0.45,
      }}
    >
      {initial}
    </div>
  );
}