import React, { useContext, useState, useEffect } from "react";
import { IoIosSchool } from "react-icons/io";
import { FaRegBookmark, FaBookmark } from "react-icons/fa";
import { BiSolidSchool } from "react-icons/bi";
import imageTU from "../assets/Emblem_of_Thammasat_University.svg.webp";

import axiosInstance from "../axiosInstance";
import { UserContext } from "../UserContext";

function ScholarshipCard({ scholarship, bookmarked, onBookmark, onEnroll }) {
  const API_URL = "/api/scholarships";
  const { user, token } = useContext(UserContext);

  const {
    scholarship_id,
    scho_name,
    scho_year,
    scho_type,
    scho_source,
    std_year,
    std_gpa,
    std_income,
    start_date,
    end_date,
  } = scholarship;

  /* รูปแบบเวลา */
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`; //รูปแบบ
  };

  /* รูปแบบภาพ */
  const image = {
    ทุนภายใน: {
      type: "img",
      src: imageTU,
    },
    ทุนภายนอก: {
      type: "icon",
      component: <BiSolidSchool className="w-20 h-20 object-cover" />,
    },
    default: {
      type: "icon",
      component: <IoIosSchool className="w-20 h-20 object-cover" />,
    },
  };

  /* รูปแบบ tag(ประเภททุน) */
  const typeTag = {
    ทุนเหมาจ่าย:
      "bg-green-100 text-green-800  dark:bg-green-900 dark:text-green-300 w-25",
    ทุนระยะยาว:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 w-25",
  };

  /* รูปแบบ tag(ประเภทแหล่งที่มา) */
  const sourceTag = {
    ทุนภายใน:
      "bg-purple-100 text-purple-800  dark:bg-purple-900 dark:text-purple-300 w-20",
    ทุนภายนอก:
      "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300 w-20",
  };

  const imageStyles = image[scho_source] || image.default;

  /* bookmark */
  const handleBookmark = async (id) => {
    /*  เช็คว่า log in หรือยัง */
    if (!token) {
      alert("กรุณาล็อกอินก่อน");
      return;
    }

    try {
      const res = await axiosInstance.post(`${API_URL}/${id}/bookmark`);
      console.log("Bookmark success", res.data);
      onBookmark?.(scholarship_id); //? ถ้า onBookmark เป็น null ฟังก์ชั้นจะไม่ทำงาน
    } catch (err) {
      console.log(err);
    }
  };

  /* สมัครรับทุน */
  const[errMessage,setErrMessage] = useState('') //รอรับ meg จาก enroll.js

  const handleEnroll = async (id) => {
    if (!token) {
      alert("กรุณาล็อกอินก่อน");
      return;
    }

    try {
      const res = await axiosInstance.post(`${API_URL}/${id}/enroll`);
      console.log(res.data);

      /* สมัครสำเร็จ ล้าง meg err */
      setErrMessage('')

      onEnroll?.(id);
    } catch (err) {
      const msg = err.response?.data?.message || "ไม่ตรงเงื่อนไข";
      console.log("Enroll error:", msg);

      setErrMessage(msg);
    }
  };

  return (
    <section>
      <div className="hover:shadow-sm sm:max-w-sm rounded-md">
        {/* ภาพ */}
        <div className="col-span-1 md:col-span-2 h-40 md:h-full overflow-hidden flex items-center justify-center">
          {imageStyles.type === "img" ? (
            <img
              src={imageStyles.src}
              alt={scho_source}
              className="w-20 h-20 object-cover"
            />
          ) : (
            imageStyles.component
          )}
        </div>

        {/* รายละเอียด */}
        <div className="col-span-1 md:col-span-3 flex flex-col justify-between text-left mx-auto w-fit">
          {/* ชื่อ */}
          <h5 className="card-title mb-2.5 text-center">{scho_name}</h5>
          {/* ปีการศึกษา */}
          <p className="mb-2"> ปีการศึกษา {scho_year} </p>
          {/*  ประเภท */}
          <div className="mb-2">
            <p>
              ประเภท{" "}
              <span
                className={`text-center text-xs font-medium me-2 px-2.5 py-0.5 rounded-full  ${typeTag[scho_type]}`}
              >
                {scho_type}
              </span>
            </p>
            <p>
              แหล่งที่มา{" "}
              <span
                className={`text-center text-xs font-medium me-2 px-2.5 py-0.5 rounded-full  ${sourceTag[scho_source]}`}
              >
                {scho_source}
              </span>
            </p>
            <p>
              เกรดเฉลี่ยที่ขั้นต่ำ <span>{std_gpa}</span>
            </p>
            <p>
              ชั้นปีที่ <span>{std_year}</span>
            </p>
            <p>
              รายได้ขั้นต่ำ <span>{std_income}</span>
            </p>
            <p>
              เปิดรับ <span>{formatDate(start_date)}</span>
            </p>
            <p>
              ปิดรับ <span>{formatDate(end_date)}</span>
            </p>
          </div>

          {/* bookmark */}
          <div className="flex mt-4 md:mt-6">
            <button
              onClick={() => handleBookmark?.(scholarship_id)}
              className="py-2 px-4 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-0 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
            >
              {bookmarked ? <FaBookmark /> : <FaRegBookmark />} 
            </button>

            {/* enroll */}
            <button
              onClick={() => handleEnroll?.(scholarship_id)} //ใส่ () => เพื่อกันการเรียกใช้งานทันที ป้องกัน err
              className="inline-flex items-center px-4 py-2 ms-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-0 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              สมัครรับข้อมูล
            </button>
          </div>

          {/* ข้อความ message */}
          {errMessage && (
            <p className="text-red-600 text-sm mt-2">{errMessage}</p>
          )}
        </div>
      </div>
    </section>
  );
}

export default ScholarshipCard;
