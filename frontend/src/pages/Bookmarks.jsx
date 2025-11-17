import React, { useEffect, useState, useContext } from "react";

import axiosInstance from "../axiosInstance";
import ScholarshipCard from "../components/ScholarshipCard";
import { UserContext } from "../UserContext";

const Bookmarks = () => {
  const [cards, setCards] = useState([]);
  const { token } = useContext(UserContext);

   const reload = async () => {
    try {
      const res = await axiosInstance.get("/api/bookmarks");
      setCards(res.data);
    } catch (err) {
      console.log(err);
    }
  };


  useEffect(() => {
    if (token) reload();
  }, [token]);


  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">ทุนที่ Bookmark ไว้</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
         {/* ถ้ายังไม่มีทุนที่ bookmark */}
        {cards.length === 0 ? (
          <p>ยังไม่มีทุนที่ bookmark ไว้</p>
        ) : (
          /* ถ้ามีทุนที่ bookmark cards.map สร้าง card ตามจำนวนทุน*/
          cards.map((scholarship) => (
            <ScholarshipCard
              key={scholarship.scholarship_id} /* ให้มี key เพื่อไม่ให้เกิด err */
              scholarship={scholarship}
              bookmarked={true}
              /* bookmarked={cards.some(c => c.scholarship_id === scholarship.scholarship_id)} //ให่แสดงทุนที่ bookmark ไว้ */
              onBookmark={reload} 
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Bookmarks;
