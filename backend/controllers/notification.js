// backend/controllers/notification.js
import pool from "../pool.js";

// GET /api/notifications
export const getNotifications = async (req, res) => {
  try {
    const userId = req.user.user_id;   // จาก token

    const [rows] = await pool.execute(
      `SELECT 
          n.std_noti_id AS id,
          n.student_id,
          n.std_noti_type,
          n.is_read,
          n.created_at
       FROM std_notification n
       JOIN student s 
         ON n.student_id = s.std_id
       WHERE s.user_id = ?
       ORDER BY n.created_at DESC`,
      [userId]
    );

    res.json(rows);
  } catch (err) {
    console.error("getNotifications error:", err);
    res.status(500).json({
      message: err.message || "Error fetching notifications",
    });
  }
};

// GET /api/notifications/unread-count
export const getUnreadCount = async (req, res) => {
  try {
    const userId = req.user.user_id;

    const [rows] = await pool.execute(
      `SELECT COUNT(*) AS cnt
       FROM std_notification n
       JOIN student s 
         ON n.student_id = s.std_id
       WHERE s.user_id = ?
         AND n.is_read = 0`,
      [userId]
    );

    res.json({ count: rows[0]?.cnt ?? 0 });
  } catch (err) {
    console.error("getUnreadCount error:", err);
    res.status(500).json({
      message: err.message || "Error counting notifications",
    });
  }
};

// PATCH /api/notifications/:id/read
export const markNotificationRead = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const id = req.params.id;

    // update เฉพาะ notification ที่เป็นของ user คนนี้จริง ๆ
    const [result] = await pool.execute(
      `UPDATE std_notification n
       JOIN student s 
         ON n.student_id = s.std_id
       SET n.is_read = 1
       WHERE n.std_noti_id = ?
         AND s.user_id = ?`,
      [id, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.json({ success: true });
  } catch (err) {
    console.error("markNotificationRead error:", err);
    res.status(500).json({
      message: err.message || "Error marking as read",
    });
  }
};
