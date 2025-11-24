<<<<<<< Updated upstream
import React from 'react'
import axios from 'axios'

import CSTU from '../assets/CSTU.png'
=======
// src/pages/Home.jsx
import React, { useEffect, useState, useContext } from "react";
import axiosInstance from "../axiosInstance";

import CSTU from "../assets/CSTU.png";
import ScholarshipCard from "../components/ScholarshipCard";
import NewsCard from "../components/NewsCard";
import Calender from "../components/Calender";
import LineConnectBox from "../components/LineConnectBox";
import { UserContext } from "../UserContext";
>>>>>>> Stashed changes

const Home = () => {

<<<<<<< Updated upstream

  return (
    <div>
      <img src={CSTU} className='relative w-full min-w-[1100px] bg-center  bg-cover'  alt=''/>
      <ul>
        <li>ปฏิทิน</li>
        <li>กระดานข่าว</li>
      </ul>
=======
  // ดึง user + role จาก Context
  const { user, role: contextRole } = useContext(UserContext);

  // กันกรณี contextRole ยังเป็น null/undefined แต่ localStorage มี role อยู่แล้ว
  const role = contextRole ?? localStorage.getItem("role") ?? null;

  console.log("HOME CONTEXT:", { user, role });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axiosInstance.get("/api/scholarships");
        setScholarships(res.data);

        try {
          const resBookmarks = await axiosInstance.get("/api/bookmarks");
          setBookmarks(resBookmarks.data.map((b) => b.scho_id));
        } catch (err) {
          console.log("โหลด bookmarks ไม่ได้ (อาจยังไม่ล็อกอิน):", err);
        }
      } catch (err) {
        console.log("โหลดทุนการศึกษาไม่สำเร็จ:", err);
      }
    };

    fetchData();
  }, []);

  const handleBookmark = async (id) => {
    try {
      await axiosInstance.post(`/api/scholarships/${id}/bookmark`);

      const resBookmarks = await axiosInstance.get("/api/bookmarks");
      setBookmarks(resBookmarks.data.map((b) => b.scho_id));

      const resCards = await axiosInstance.get("/api/scholarships");
      setScholarships(resCards.data);
    } catch (err) {
      console.log("bookmark error:", err);
    }
  };

  const handleEnroll = (id) => {
    console.log("Enroll success:", id);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* รูป banner ด้านบน */}
      <img
        src={CSTU}
        className="w-full min-w-[1100px] bg-center bg-cover"
        alt="CSTU banner"
      />

      <main className="max-w-5xl mx-auto px-4 py-6">
        {/* DEBUG ชั่วคราว ถ้าไม่อยากให้โชว์ก็ลบได้ */}
        {/* <div className="mb-4 p-2 bg-yellow-100">
          <p>DEBUG role: {String(role)}</p>
          <p>DEBUG user: {user ? JSON.stringify(user) : "no user"}</p>
        </div> */}

        {/* กล่องเชื่อม LINE แสดงเฉพาะฝั่งนักศึกษา */}
        {role === "student" && <LineConnectBox />}

        {/* รายการทุนการศึกษา */}
        <section className="mt-4 space-y-4">
          {scholarships.map((s) => (
            <ScholarshipCard
              key={s.scholarship_id}
              scholarship={s}
              bookmarked={bookmarks.includes(s.scholarship_id)}
              onBookmark={handleBookmark}
              onEnroll={handleEnroll}
            />
          ))}
        </section>

        {/* ปฏิทิน + ข่าวประชาสัมพันธ์ */}
        <section className="mt-8 flex flex-col md:flex-row gap-4">
          <Calender />
          <NewsCard />
        </section>
      </main>
>>>>>>> Stashed changes
    </div>
  )
}

export default Home
