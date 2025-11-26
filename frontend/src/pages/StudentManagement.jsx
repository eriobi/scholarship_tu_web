import React , { useState , useEffect } from 'react'

import StudentTable from '../components/StudentManagement/StudentTable'
import SocialButton from '../components/button/SocialButton'


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

  return (
    <div className='bg-gray-50 min-h-screen flex flex-col'>
      <h2 className="text-lg font-semibold text-center  text-gray-900 p-8">
        จัดการนักศึกษา
      </h2>

      

      <div className="flex justify-center w-full max-w-full h-auto">
        <div className="w-[80%] mx-auto">
          <div className="justify-end flex gap-2 mb-1 items-center">
            <SocialButton action="line">ส่งข้อความผ่าน </SocialButton>
          </div>
          <StudentTable
          studentData={student}
        />

        </div>
      </div>
      
    </div>
  )
}

export default StudentManagement
