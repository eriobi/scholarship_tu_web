import React, { useEffect, useState } from "react";

import axiosInstance from "../axiosInstance";

function Calender() {
  const [scholarships, setScholarships] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date()); //เก็บเดือนปัจจุบัน ไว้เพื่อกดเปลี่ยนเดือน

  /* get ทุน */
  useEffect(() => {
    const fatchData = async () => {
      try {
        const res = await axiosInstance.get("api/scholarships");
        setScholarships(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fatchData();
  }, []);

  const monthNames = [
    "มกราคม",
    "กุมภาพันธ์",
    "มีนาคม",
    "เมษายน",
    "พฤษภาคม",
    "มิถุนายน",
    "กรกฎาคม",
    "สิงหาคม",
    "กันยายน",
    "ตุลาคม",
    "พฤศจิกายน",
    "ธันวาคม",
  ];

  /* สร้างวัน */
  const generateDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const first = new Date(year, month, 1); //หาวันที่ 1 ของเดือน
    const last = new Date(year, month + 1, 0); //หาวันสุดท้ายของเดือน

    const days = [];

    /* สร้างช่อง null ก่อนวันแรก */
    for (let i = 0; i < first.getDay(); i++) {
      days.push(null);
    }

    /* เติมวันจริงลงช่อง โดยเริ่มจากวันที่ 1 ถึง 30 */
    for (let day = 1; day <= last.getDate(); day++) {
      days.push(new Date(year, month, day));
    }

    /* สร้างช่องให้เต็มเดือน */
    const totalCells = days.length; //วันทังหมด
    const remainder = totalCells % 7; 

    if (remainder !== 0) {
      const empty = 7 - remainder;  //วันที่เหลือ - 7 เพื่อที่จะให้รู้ว่าต้องสร้างกี่ช่อง
      for (let i = 0; i < empty; i++) {
        days.push(null);
      }
    }

    return days;
  };

  /* ทุนมีวันไหน */
  const scholarshipsOnDate = (date) => {
    if (!date) return [];

    const d = date.toISOString().split("T")[0]; //แปลงเป็น str แล้วเอาแค่ วันที่

    return scholarships.filter((s) => {
      const matchDate = d >= s.start_date && d <= s.end_date; //ช่วงเวลาของทุน

      return matchDate;
    });
  };

  const days = generateDays();

  /* สีทุนตาม type */
  const colorType = (type) => {
    if (type === "ทุนเหมาจ่าย")
      return "bg-green-100 text-green-800  dark:bg-green-900 dark:text-green-300 w-25";
    if (type === "ทุนระยะยาว")
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 w-25";
    return "bg-gray-200 text-gray-700";
  };

  return (
    <section className="relative bg-stone-50 py-24">
      <div className="w-full max-w-7xl mx-auto px-6 lg:px-8 overflow-x-auto">
        {/* header */}
        <div className="flex flex-col md:flex-row max-md:gap-3 items-center justify-between mb-5">
          <div className="flex items-center gap-4">
            <h6 className="text-xl font-semibold text-gray-900">
                {/* แสดงชื่อเดือน , 543 = พศ */}
              {monthNames[currentMonth.getMonth()]}{" "} 
              {currentMonth.getFullYear() + 543}
            </h6>
          </div>

          {/* ปุ่มเปลี่ยนเดือน */}
          <div className="flex items-center gap-3">
            <button
              className="py-2 px-4 bg-gray-200 rounded-lg"
              onClick={() =>
                setCurrentMonth(
                  new Date(
                    currentMonth.getFullYear(),
                    /* กดปุ่มแล้วจะขึ้นเดือนเก่า */
                    currentMonth.getMonth() - 1
                  )
                )
              }
            >
              ← เดือนก่อน
            </button>

            <button
              className="py-2 px-4 bg-gray-200 rounded-lg"
              onClick={() =>
                setCurrentMonth(
                  new Date(
                    currentMonth.getFullYear(),
                    /* กดปุ่มแล้วจะขึ้นเดือนใหม่ */
                    currentMonth.getMonth() + 1
                  )
                )
              }
            >
              เดือนถัดไป →
            </button>
          </div>
        </div>

        {/* header days */}
        <div className="grid grid-cols-7 border-t border-gray-200 bg-white sticky top-0">
          {["อา", "จ", "อ", "พ", "พฤ", "ศ", "ส"].map((d) => (
            <div
              key={d}
              className="p-3.5 flex items-center justify-center text-sm font-medium text-gray-900"
            >
              {d}
            </div>
          ))}
        </div>

        {/* date */}
        <div className="grid grid-cols-7 w-full">
          {days.map((day, i) => {
            const events = scholarshipsOnDate(day);

            return (
              <div
                key={i}
                className={`h-28 p-2 border border-gray-200 relative transition-all 
                ${events.length ? "bg-purple-50" : "hover:bg-gray-100"}`}
              >
                {day && (
                  <>
                    <span className="text-xs font-semibold text-gray-700">
                      {day.getDate()}
                    </span>

                    {/* ทุนที่อยู่ในวันนั้นๆ */}
                    <div className="flex flex-col gap-1 mt-1 overflow-auto max-h-16">
                        {/* ทุนมีการซ้อนกันให้แสดงซ้อน */}
                      {events.map((e) => (
                        <div
                          key={e.scholarship_id}
                          /* ให้แสดงสีจาม type */
                          className={`text-[10px] rounded px-1 py-0.5 truncate border ${colorType(
                            e.scho_type
                          )}`}
                        >
                          {e.scho_name}
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Calender;
