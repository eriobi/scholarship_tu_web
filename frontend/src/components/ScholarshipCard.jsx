import React, { useContext, useState, useEffect } from "react";
import { IoIosSchool } from "react-icons/io";
import { FaRegBookmark, FaBookmark } from "react-icons/fa";
import { BiSolidSchool } from "react-icons/bi";
import imageTU from "../assets/Emblem_of_Thammasat_University.svg.webp";

import axiosInstance from "../axiosInstance.jsx";
import { UserContext } from "../UserContext";

// services
import {
  fetchEligibility,
  subscribeScholarship,
} from "../services/scholarshipApi";

function ScholarshipCard({ scholarship, bookmarked, onBookmark, onEnroll }) {
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

  // ---------- รูปแบบเวลา ----------
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // ---------- รูปภาพตามแหล่งที่มา ----------
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

  const imageStyles = image[scho_source] || image.default;

  // tag ประเภททุน
  const typeTag = {
    ทุนเหมาจ่าย:
      "bg-green-100 text-green-800  dark:bg-green-900 dark:text-green-300 w-25",
    ทุนระยะยาว:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 w-25",
  };

  // tag แหล่งที่มา
  const sourceTag = {
    ทุนภายใน:
      "bg-purple-100 text-purple-800  dark:bg-purple-900 dark:text-purple-300 w-20",
    ทุนภายนอก:
      "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300 w-20",
  };

  // ---------- Bookmark ----------
  const handleBookmark = async (id) => {
    if (!token) {
      alert("กรุณาล็อกอินก่อน");
      return;
    }

    try {
<<<<<<< Updated upstream
      const res = await axiosInstance.post(`${API_URL}/${id}/bookmark`);
      console.log("Bookmark success", res.data);
      onBookmark?.(scholarship_id); //? ถ้า onBookmark เป็น null ฟังก์ชั้นจะไม่ทำงาน
=======
      const res = await axiosInstance.post(`/api/scholarships/${id}/bookmark`);
      console.log("Bookmark success", res.data);
      onBookmark?.(id);
>>>>>>> Stashed changes
    } catch (err) {
      console.log(err);
    }
  };

  // ---------- สมัครรับข้อมูล + เช็คสิทธิ์ ----------
  const [errMessage, setErrMessage] = useState("");
  const [loadingElig, setLoadingElig] = useState(true);
  const [eligible, setEligible] = useState(false);
  const [reasons, setReasons] = useState([]);
  const [subscribed, setSubscribed] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // โหลดสิทธิ์ตอนเปิด card
  useEffect(() => {
    let isMounted = true;

    const loadEligibility = async () => {
      if (!token) {
        setLoadingElig(false);
        setEligible(false);
        setReasons(["กรุณาล็อกอินเพื่อสมัครรับข้อมูลทุน"]);
        return;
      }

      try {
        setLoadingElig(true);
        const res = await fetchEligibility(scholarship_id);
        if (!isMounted) return;

        setEligible(res.data.eligible);
        setReasons(res.data.reasons || []);
        // ถ้าอยากให้รู้ว่าเคย subscribe แล้วจาก backend ค่อยมาใช้ res.data.alreadySubscribed
        setSubscribed(res.data.alreadySubscribed || false);
        setErrMessage("");
      } catch (err) {
        console.error("load eligibility error:", err);
        if (isMounted) {
          setEligible(false);
          setReasons(["ไม่สามารถตรวจสอบสิทธิ์ได้"]);
        }
      } finally {
        if (isMounted) setLoadingElig(false);
      }
    };

    loadEligibility();
    return () => {
      isMounted = false;
    };
  }, [scholarship_id, token]);

  const handleSubscribe = async (id) => {
    if (!token) {
      alert("กรุณาล็อกอินก่อน");
      return;
    }

    if (!eligible || submitting) return;

    try {
      setSubmitting(true);
      const res = await subscribeScholarship(id);
      console.log("Subscribe success", res.data);

      // ครั้งแรกจะถือว่าสมัครรับข้อมูล
      setSubscribed(true);
      setErrMessage("");

      if (res.data?.message) {
        alert(res.data.message);
      }

      onEnroll?.(id);
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.reasons?.[0] ||
        "ไม่สามารถสมัครรับข้อมูลได้";
      console.log("Subscribe error:", msg);
      setErrMessage(msg);
    } finally {
      setSubmitting(false);
    }
  };

  // เงื่อนไขปุ่ม (เอา subscribed ออก เพื่อให้กดส่งอีกครั้งได้)
  const disabled =
    !token || loadingElig || submitting || !eligible;

  let buttonText = "สมัครรับข้อมูล";
  if (!token) buttonText = "ล็อกอินเพื่อสมัคร";
  else if (loadingElig) buttonText = "กำลังตรวจสอบสิทธิ์...";
  else if (!eligible) buttonText = "ไม่เข้าเกณฑ์";
  else if (subscribed) buttonText = "ส่งรายละเอียดอีกครั้ง";
  else if (submitting) buttonText = "กำลังสมัคร...";

  const baseButtonClass =
    "inline-flex items-center px-4 py-2 ms-2 text-sm font-medium text-center text-white rounded-lg focus:ring-0 focus:outline-none";
  const enabledClass = "bg-blue-700 hover:bg-blue-800";
  const disabledClass = "bg-gray-400 cursor-not-allowed";

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

        {/* รายละเอียดทุน */}
        <div className="col-span-1 md:col-span-3 flex flex-col justify-between text-left mx-auto w-fit">
          <h5 className="card-title mb-2.5 text-center">{scho_name}</h5>
          <p className="mb-2">ปีการศึกษา {scho_year}</p>

          <div className="mb-2">
            <p>
              ประเภท{" "}
              <span
                className={`text-center text-xs font-medium me-2 px-2.5 py-0.5 rounded-full ${typeTag[scho_type]}`}
              >
                {scho_type}
              </span>
            </p>
            <p>
              แหล่งที่มา{" "}
              <span
                className={`text-center text-xs font-medium me-2 px-2.5 py-0.5 rounded-full ${sourceTag[scho_source]}`}
              >
                {scho_source}
              </span>
            </p>
            <p>
              เกรดเฉลี่ยขั้นต่ำ <span>{std_gpa}</span>
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

          {/* ปุ่ม bookmark + สมัครรับข้อมูล */}
          <div className="flex mt-4 md:mt-6">
            <button
              onClick={() => handleBookmark?.(scholarship_id)}
              className="py-2 px-4 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-0 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
            >
              {bookmarked ? <FaBookmark /> : <FaRegBookmark />}
            </button>

            <button
              onClick={() => handleSubscribe?.(scholarship_id)}
              disabled={disabled}
              className={`${baseButtonClass} ${
                disabled ? disabledClass : enabledClass
              }`}
            >
              {buttonText}
            </button>
          </div>

          {/* error จาก subscribe */}
          {errMessage && (
            <p className="text-red-600 text-sm mt-2">{errMessage}</p>
          )}

          {/* เหตุผลไม่เข้าเกณฑ์ */}
          {!loadingElig && !eligible && reasons.length > 0 && (
            <p className="text-red-600 text-xs mt-1">* {reasons[0]}</p>
          )}
        </div>
      </div>
    </section>
  );
}

export default ScholarshipCard;
