// Navbar.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import axiosInstance from "../axiosInstance.jsx";
//  import service ที่ใช้ดึงจำนวนแจ้งเตือนจาก backend
import { fetchUnreadCount } from "../services/notificationApi";

import Logo from "../assets/image.png";

function Navbar() {
  const token = localStorage.getItem("token"); // token ที่ได้ตอน login
  const role = localStorage.getItem("role");   // role = "student" หรือ "admin"

  const navigate = useNavigate();

  // state อันเก่าที่มีอยู่ (ตอนนี้ยังไม่ใช้ message จริง ๆ)
  const [message, setMessage] = useState("Loading...");

  // state ใหม่: จำนวนแจ้งเตือนที่ยังไม่อ่าน (ใช้แสดงจุดแดงบนกระดิ่ง)
  const [unreadCount, setUnreadCount] = useState(0);

  /* 
    useEffect 1: ตรวจสอบ token กับ server
    - ยิง GET '/' ไป backend เพื่อตรวจว่า token ยังใช้ได้ไหม
    - ใช้ axiosInstance ที่ตั้ง baseURL + header ไว้แล้ว
  */
//  useEffect(() => {
//    async function fetchData() {
//      if (!token) return; // ถ้ายังไม่ได้ login ก็ไม่ต้องเช็ค

//      try {
//        const response = await axiosInstance.get("/");
//        console.log(response.data);
//      } catch (err) {
//        console.log("Authorization Error");
        // TODO: ถ้าอยากให้หลุดออกจากระบบทันทีตอน token invalid
        // สามารถ navigate("/login") หรือ clear localStorage ได้
 //     }
 //   }

 //   fetchData();
 // }, [token, navigate]); // ผูกกับ token มากกว่ากับ navigate

  /*
    useEffect 2: ดึง "จำนวนแจ้งเตือนที่ยังไม่อ่าน" จาก backend
    - เรียก fetchUnreadCount() → GET /api/notifications/unread-count
    - controller ฝั่ง backend จะ query ตาราง std_notification
      แล้วส่ง { count: <number> } กลับมา
    - เราเก็บตัวเลขนี้ไว้ใน unreadCount เพื่อใช้แสดงจุดแดง
  */
  useEffect(() => {
    // ยังไม่ได้ login ก็ไม่ต้องดึงแจ้งเตือน
    if (!token) return;

    const loadUnread = async () => {
      try {
        const res = await fetchUnreadCount();
        // backend ส่ง { count: number }
        setUnreadCount(res.data.count || 0);
      } catch (err) {
        console.error("โหลดจำนวนแจ้งเตือนผิดพลาด:", err);
      }
    };

    loadUnread();
  }, [token]);

  /* log out */
  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.get("/logout");
      console.log(response.data);
    } catch (err) {
      console.log("Logout Error");
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      navigate("/");
    }
  };

  return (
    <nav className="bg-[#FF8000]">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        {/* โลโก้คลิกแล้วกลับหน้าแรก */}
        <Link to="/">
          <img src={Logo} className="w-15 h-auto" alt="" />
        </Link>

<<<<<<< Updated upstream
        <ul>
          <Link to="/news">
            <li>ข่าวประชาสัมพันธ์</li>
          </Link>
          <Link to="/scholarships">
            <li>ทุนการศึกษา</li>
          </Link>
        </ul>

        {token && role === "student" && (
          <>
            <li>
              <Link to="/user/profile">Profile</Link>
            </li>
            <li>
              <Link to="/user/dashboard">Dashboard</Link>
            </li>
            <li>
              <Link to="/user/bookmarks">Bookmarks</Link>
            </li>
            <button onClick={handleLogout} className="btn btn-danger">
              Log out
            </button>
          </>
        )}

        {token && role === "admin" && (
          <>
            <li>
              <Link to="/admin/dashboard">Dashboard</Link>
            </li>
            <li>
              <Link to="/admin/news">จัดการข่าว</Link>
            </li>
            <li>
              <Link to="/admin/scholarship">จัดการทุน</Link>
            </li>
            <li>
              <Link to="/admin/student">จัดการนักศึกษา</Link>
            </li>
            <button onClick={handleLogout} className="btn btn-danger cursor-pointer">
              Log out
            </button>
          </>
        )}

        {!token && (
          <>
            <li>
              <Link to="/login">เข้าสู่ระบบ</Link>
            </li>
            <li>
              <Link to="/register">ลงทะเบียน</Link>
            </li>
          </>
        )}
=======
        {/* เมนูทั่วไป (ข่าว / ทุน) */}
        <ul className="flex gap-4">
          <li>
            <Link to="/news">ข่าวประชาสัมพันธ์</Link>
          </li>
          <li>
            <Link to="/scholarships">ทุนการศึกษา</Link>
          </li>
        </ul>

        {/* เมนูฝั่งขวา: แสดงต่างกันตาม role */}
        <ul className="flex gap-4 items-center">
          {/* ================= ฝั่ง STUDENT ================= */}
          {token && role === "student" && (
            <>
              {/* ไอคอนกระดิ่งแจ้งเตือนของนักศึกษา */}
              <li className="relative">
                <Link to="/user/noti" className="relative inline-block">
                  {/* ตรงนี้จะเปลี่ยนเป็น icon bell ตามดีไซน์ของเธอก็ได้ */}
                  <span className="text-2xl">🔔</span>

                  {/* จุดแดง: แสดงเมื่อ unreadCount > 0 */}
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-red-500" />
                  )}
                </Link>
              </li>

              <li>
                <Link to="/user/profile">Profile</Link>
              </li>
              <li>
                <Link to="/user/dashboard">Dashboard</Link>
              </li>
              <li>
                <Link to="/user/bookmarks">Bookmarks</Link>
              </li>
              <li>
                <button onClick={handleLogout} className="btn btn-danger">
                  Log out
                </button>
              </li>
            </>
          )}

          {/* ================= ฝั่ง ADMIN ================= */}
          {token && role === "admin" && (
            <>
              {/* ไอคอนกระดิ่งแจ้งเตือนของ admin */}
              <li className="relative">
                <Link to="/admin/noti" className="relative inline-block">
                  <span className="text-2xl">🔔</span>
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-red-500" />
                  )}
                </Link>
              </li>

              <li>
                <Link to="/admin/dashboard">Dashboard</Link>
              </li>
              <li>
                <Link to="/admin/news">จัดการข่าว</Link>
              </li>
              <li>
                <Link to="/admin/scholarship">จัดการทุน</Link>
              </li>
              <li>
                <Link to="/admin/student">จัดการนักศึกษา</Link>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className="btn btn-danger cursor-pointer"
                >
                  Log out
                </button>
              </li>
            </>
          )}

          {/* ================= ยังไม่ได้ login ================= */}
          {!token && (
            <>
              <li>
                <Link to="/login">เข้าสู่ระบบ</Link>
              </li>
              <li>
                <Link to="/register">ลงทะเบียน</Link>
              </li>
            </>
          )}
        </ul>
>>>>>>> Stashed changes
      </div>
    </nav>
  );
}

export default Navbar;
