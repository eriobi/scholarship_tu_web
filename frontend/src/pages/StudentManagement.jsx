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
    <div>
      <div>
        <h2>จัดการนักศึกษา</h2>
      </div>
      
      <div>
        <td>
          <SocialButton action="line">ส่งข้อความผ่าน </SocialButton>
        </td>
        <td>
          <SocialButton action="gmail">ส่งข้อความผ่าน </SocialButton>
        </td>
      </div>

      <div className="flex justify-center items-center min-w-screen h-auto">
        <StudentTable
          studentData={student}
        />
      </div>
      
    </div>
  )
}

export default StudentManagement
