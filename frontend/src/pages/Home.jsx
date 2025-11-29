import React, { useEffect, useState, useContext } from "react";
import { Swiper, SwiperSlide } from "swiper/react";

/* slide */
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Pagination, Navigation } from "swiper/modules";

import axiosInstance from "../axiosInstance";
import CSTU from "../assets/CSTU.png";
import ScholarshipCard from "../components/Scholarship/ScholarshipCard";
import NewsCard from "../components/NewsCard";
import Calendar from "../components/Calendar";
import { UserContext } from "../UserContext";

function Home() {
  const [scholarships, setScholarships] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const { token } = useContext(UserContext);
  const [card, setCards] = useState([]);

  const API_URL = "/api/scholarships";

  /* get ข้อมูลทุน */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const resCards = await axiosInstance.get(API_URL); //เก็บข้อมูลทุน
        setCards(resCards.data);

        const resBookmarks = await axiosInstance.get("/api/bookmarks");
        setBookmarks(resBookmarks.data.map((b) => b.scho_id)); //เก็บทุนที่มีการ bookmark ไว้ ลง setBookmarks
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, []);

  /* กด bookmark */
  const handleBookmark = async (id) => {
    try {
      if (!token) {
        alert("กรุณาเข้าสู่ระบบก่อน");
      }
      /* update bookmark */
      const res = await axiosInstance.get("/api/bookmarks");
      setBookmarks(res.data.map((b) => b.scho_id));

      const cardsRes = await axiosInstance.get(API_URL);
      setCards(cardsRes.data);

      console.log("bookmark sucecss", id);
    } catch (err) {
      console.log(err);
    }
  };

  const handleEnroll = (id) => {
    console.log("Enroll success:", id);
  };

  return (
    <div className="bg-gray-50">
      <img
        src={CSTU}
        className="relative w-full min-w-[1100px] bg-center  bg-cover "
        alt=""
      />
      <div className="bg-gray-50 -mt-40 mx-25 ">
        <Swiper
          key={bookmarks.length}
          slidesPerView={4}
          spaceBetween={100}
          pagination={false} //เส้นขอบบ่งบอกตำแหน่ง
          navigation={true} //ลูกศร
          modules={[Pagination, Navigation]}
          breakpoints={{
            0: { slidesPerView: 1 }, // mobile
            640: { slidesPerView: 1.5 }, // small tablet
            768: { slidesPerView: 2 }, // tablet
            1024: { slidesPerView: 3 }, // laptop
            1280: { slidesPerView: 4 }, // desktop
          }}
          className="mySwiper"
        >
          {card.map((scholarship) => (
            <SwiperSlide key={scholarship.scholarship_id}>
              <ScholarshipCard
                key={scholarship.scholarship_id}
                scholarship={scholarship}
                bookmarked={bookmarks.includes(scholarship.scholarship_id)}
                onBookmark={handleBookmark}
                onEnroll={handleEnroll}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 mt-8 px-8 pb-6">
        <div className="basis-[35%] ">
          <Calendar />
        </div>

        <div className="basis-[65%]">
          <h2 className="text-lg font-semibold  px-2 pt-6 text-gray-900">
            ข่าวประชาสัมพันธ์
          </h2>
          <NewsCard />
        </div>
      </div>
    </div>
  );
}

export default Home;
