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
      setStudent(res.data);
      console.log(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <div>
        <h2>จัดการนักศึกษา</h2>
      </div>
      
      <tr>
        <td>
          <SocialButton action="line">ส่งข้อความผ่าน </SocialButton>
        </td>
        <td>
          <SocialButton action="gmail">ส่งข้อความผ่าน </SocialButton>
        </td>
      </tr>

      <div className="flex justify-center items-center min-w-screen h-auto">
        <StudentTable
          StudentTable={student}
        />
      </div>
      
    </div>
  )
}

export default StudentManagement
