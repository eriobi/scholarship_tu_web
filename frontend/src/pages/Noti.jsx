// frontend/src/pages/Noti.jsx
import { useEffect, useState } from "react";
import {
  fetchNotifications,
  markNotificationRead,
} from "../services/notificationApi";

// แปลง type จาก DB → ข้อความภาษาไทย
const getMessageFromType = (type) => {
  switch (type) {
    case "NEW_SCHOLARSHIP":
      return "มีทุนการศึกษาใหม่ที่คุณมีสิทธิ์สมัคร";
    case "NEWS":
      return "มีข่าวประชาสัมพันธ์ใหม่";
    default:
      return type || "แจ้งเตือนจากระบบ";
  }
};

// แปลงวันที่ ISO → วันที่/เวลาแบบไทย
const formatDateTime = (isoString) => {
  const d = new Date(isoString);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleString("th-TH", {
    dateStyle: "short",
    timeStyle: "short",
  });
};

const Noti = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const res = await fetchNotifications();
      setNotifications(res.data || []);
    } catch (err) {
      console.error("โหลดแจ้งเตือนผิดพลาด:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const handleClickNotification = async (noti) => {
    // ถ้าอ่านแล้วไม่ต้องยิง PATCH ซ้ำ
    if (noti.is_read === 1) return;

    try {
      await markNotificationRead(noti.id);

      // อัปเดต state ฝั่ง frontend
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === noti.id ? { ...n, is_read: 1 } : n
        )
      );
    } catch (err) {
      console.error("mark read error:", err);
    }
  };

  return (
    <div style={{ padding: "24px" }}>
      <h2 style={{ marginBottom: "16px" }}>รายการแจ้งเตือน</h2>

      {loading ? (
        <p>กำลังโหลด...</p>
      ) : notifications.length === 0 ? (
        <p>ยังไม่มีการแจ้งเตือน</p>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}
        >
          {notifications.map((noti) => (
            <div
              key={noti.id}
              onClick={() => handleClickNotification(noti)}
              style={{
                cursor: "pointer",
                padding: "12px 16px",
                borderRadius: "8px",
                border: "1px solid #ddd",
                backgroundColor: noti.is_read ? "#f5f5f5" : "#fff8e1",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <div style={{ fontWeight: noti.is_read ? "normal" : "bold" }}>
                  {getMessageFromType(noti.std_noti_type)}
                </div>
                <div
                  style={{
                    fontSize: "12px",
                    color: "#666",
                    marginTop: "4px",
                  }}
                >
                  {formatDateTime(noti.created_at)}
                </div>
              </div>

              {!noti.is_read && (
                <span
                  style={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    backgroundColor: "#ff5252",
                  }}
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Noti;
