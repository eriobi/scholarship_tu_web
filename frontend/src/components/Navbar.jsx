import React , { useState , useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import axiosInstance from "../axiosInstance.jsx";

import Logo from "../assets/image.png";

function Navbar() {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const navigate = useNavigate()

  /*  */
  const [ message , setMessage ] = useState('Loading...')

  /* ตรวจสอบ token ของจริงไหม/หมดอายุ/ถูกแก้ไขไหม ซึ่งตรวจจาก server */
  useEffect(() => {
      async function fetchData() {
        if(!token)  return
      try{
      const response = await axiosInstance.get('/')
      console.log(response.data);
    }catch(err){
        console.log("Authorization Error")
     }

      }
      
      fetchData()

    },[navigate])

    /* log out */
  const handleLogout = async (e)=> {
        e.preventDefault();
    try{
      const response = await axiosInstance.get('/logout')
      console.log(response.data);
    }catch(err){
      console.log("Logout Error")
    }finally{
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      navigate("/");
    }
  };


  return (
    <nav className="bg-[#FF8000]">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <Link to="/">
          <img src={Logo} className="w-15 h-auto" alt="" />
        </Link>

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
              <Link to="/user/noti">Noti</Link>
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
            <button onClick={handleLogout} className="btn btn-danger">
              Log out
            </button>
          </>
        )}

        {token && role === "admin" && (
          <>
          <li>
              <Link to="/admin/noti">noti</Link>
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
      </div>
    </nav>
  );
}

export default Navbar;
