// src/UserContext.jsx
import React, { createContext, useState, useEffect } from "react";
import axiosInstance from "./axiosInstance";

// ใส่ default value ให้ครบทุกตัว (กัน useContext แล้วเป็น undefined)
export const UserContext = createContext({
  user: null,
  token: null,
  role: null,
  loading: true,
  setUser: () => {},
  setToken: () => {},
  setRole: () => {},
  logout: () => {},
});

function UserProvider({ children }) {
  const [user, setUser] = useState(null);     // เก็บข้อมูล user
  const [token, setToken] = useState(null);   // เก็บ token
  const [role, setRole] = useState(null);     // เก็บ role
  const [loading, setLoading] = useState(true); // ใช้ verify token ตอนเปิดเว็บ

  /* โหลด token/role จาก localStorage ครั้งแรก */
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedRole = localStorage.getItem("role");

    if (storedToken) {
      setToken(storedToken);
      setRole(storedRole);      // <<–– สำคัญมาก ตรงนี้ทำให้ role ไม่เป็น undefined
      verifyToken(storedToken);
    } else {
      setLoading(false);
    }
  }, []);

  /* ตรวจ token จาก server */
  const verifyToken = async (jwtToken) => {
    try {
      const res = await axiosInstance.get("/", {
        headers: { Authorization: `Bearer ${jwtToken}` },
      });

      // สมมติ backend ส่ง user object กลับมา
      setUser(res.data.user);
    } catch (err) {
      console.error("Authorization Error", err);
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      setUser(null);
      setToken(null);
      setRole(null);
    } finally {
      setLoading(false);
    }
  };

  /* log out */
  const logout = async () => {
    try {
      const res = await axiosInstance.get("/logout");
      console.log(res.data);
    } catch (err) {
      console.log("Logout error:", err);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      setUser(null);
      setToken(null);
      setRole(null);
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        token,
        role,
        loading,
        setUser,
        setToken,
        setRole,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export default UserProvider;
