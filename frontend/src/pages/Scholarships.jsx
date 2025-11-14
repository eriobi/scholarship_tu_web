import React, { useState, useEffect } from "react";

import axiosInstance from "../axiosInstance";

import ScholarshipCard from "../components/ScholarshipCard.jsx";

const Scholarships = () => {
  const API_URL = "/api/scholarships";

  const [card, setCards] = useState([]);

  const [bookmarks, setBookmarks] = useState([]);

  /* get ข้อมูลทุน */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const resCards = await axiosInstance.get(API_URL) //เก็บข้อมูลทุน
        setCards(resCards.data)

        const resBookmarks = await axiosInstance.get("/api/bookmarks")
        setBookmarks(resBookmarks.data.map(b => b.scho_id)) //เก็บทุนที่มีการ bookmark ไว้ ลง setBookmarks
      } catch (err) {
        console.log(err)
      }
    }
    fetchData()
  }, [])

  /* กด bookmark */
  const handleBookmark = async (id) => {
    try {
      /* update bookmark */
      setBookmarks(prev => 
      //  prev = ทุนปัจจุบัน ถ้า bookmark ให้ เอา filter ออก(ยกเลิก bookmark)
      prev.includes(id)
        ? prev.filter(b => b !== id)
        : [...prev, id] //ถ้าไม่มี เพิ่ม id
    )
      console.log("bookmark sucecss", id);
    } catch (err) {
      console.log(err);
    }
  };
/* 
  const handleEnroll = async (id) => {
    try {
      const res = await axiosInstance.post(`${API_URL}/${id}/enroll`);
      console.log("Enroll success", res.data);
    } catch (err) {
      console.log(err);
    }
  }; */

/* get bookmark */
useEffect(() => {
  const fetchScholarships = async () => {
    try {
      const res = await axiosInstance.get(API_URL);
      setCards(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchBookmarks = async () => {
    try {
      const res = await axiosInstance.get('/api/bookmarks');
      setBookmarks(res.data.map(b => b.scho_id));
    } catch (err) {
      console.log(err);
    }
  };

  fetchScholarships();
  fetchBookmarks();
}, []);

  return (
    <div>
      <h1>Scholarships</h1>
      <span className="flex flex-col gap-6">
        {card.map((scholarship) => (
          <ScholarshipCard
            key={scholarship.scholarship_id}
            scholarship={scholarship}
            bookmarked={bookmarks.includes(scholarship.scholarship_id)}
            onBookmark={handleBookmark}
            /* onEnroll={handleEnroll} */
          />
        ))}
      </span>
    </div>
  );
};

export default Scholarships;
