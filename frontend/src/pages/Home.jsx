import React, { useEffect, useState } from "react";
import axiosInstance from "../axiosInstance";

import CSTU from "../assets/CSTU.png";
import ScholarshipCard from "../components/ScholarshipCard";
import NewsCard from "../components/NewsCard";
import Calender from "../components/Calender";

function Home() {
  const [scholarships, setScholarships] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axiosInstance.get("/api/scholarships");
        setScholarships(res.data);

        const resBookmarks = await axiosInstance.get("/api/bookmarks");
        setBookmarks(resBookmarks.data.map((b) => b.scho_id));
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, []);

  /* กด bookmark */
  const handleBookmark = async (id) => {
    await axiosInstance.post(`/api/scholarships/${id}/bookmark`);

    const resBookmarks = await axiosInstance.get("/api/bookmarks");
    setBookmarks(resBookmarks.data.map((b) => b.scho_id));

    const resCards = await axiosInstance.get("/api/scholarships");
    setScholarships(resCards.data);
  };

  /* กด สมัครรับทุน */
  const handleEnroll = (id) => {
    console.log("Enroll success:", id);
  };

  return (
    <div>
      <img
        src={CSTU}
        className="relative w-full min-w-[1100px] bg-center  bg-cover"
        alt=""
      />
      <div>
        {scholarships.map((s) => (
          <ScholarshipCard
            key={s.scholarship_id}
            scholarship={s}
            bookmarked={bookmarks.includes(s.scholarship_id)}
            onBookmark={handleBookmark}
            onEnroll={handleEnroll}
          />
        ))}
      </div>
      <span>
        <Calender />
        <NewsCard />
      </span>
    </div>
  );
}

export default Home;
