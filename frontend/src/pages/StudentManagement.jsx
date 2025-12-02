import React, { useState, useEffect } from "react";

import StudentTable from "../components/StudentManagement/StudentTable";
import SocialButton from "../components/button/SocialButton";

import axiosInstance from "../axiosInstance";

const StudentManagement = () => {
  const API_URL = "/admin/student";
  const [student, setStudent] = useState([]);

  /* get ทุน */
  useEffect(() => {
    fetchStudent();
  }, []);

  const fetchStudent = async () => {
    try {
      const res = await axiosInstance.get(API_URL);
      setStudent(res.data.students); //students = arr
      console.log(res.data.students);
    } catch (err) {
      console.log(err);
    }
  };

  /* filter */
  const [filterInterest, setFilterInterest] = useState("");
  let display = student.slice(); //copy arr std
  if (filterInterest === "desc") {
    display.sort((a, b) => b.scholarship_interest - a.scholarship_interest);
  }
  if (filterInterest === "asc") {
    display.sort((a, b) => a.scholarship_interest - b.scholarship_interest);
  }

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <h2 className="text-lg font-semibold text-center  text-gray-900 p-8">
        จัดการนักศึกษา
      </h2>

      <div className="w-full max-w-[80%] mx-auto flex gap-4 py-4 justify-end">
        <select
        className="w-80 shadow border border-gray-200
               focus:outline-none focus:ring-2 focus:ring-purple-700
               text-gray-700 rounded-lg"
        value={filterInterest}
        onChange={(e) => setFilterInterest(e.target.value)}
      >
        <option value="">เรียงลำดับความสนใจทุน</option>
        <option value="desc">สนใจสมัครทุนมากที่สุด</option>
        <option value="asc">สนใจสมัครทุนน้อยที่สุด</option>
      </select>

      </div>
      

      <div className="flex justify-center w-full max-w-full h-auto">
        <div className="w-[80%] mx-auto">
          <StudentTable studentData={display} />
        </div>
      </div>
    </div>
  );
};

export default StudentManagement;
