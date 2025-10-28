import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import Logo from "../assets/CSLogo-Square-White.png";

import InputBox from "../components/input/InputBox";
import Button from "../components/button/ButtonSummit";

function Register() {
  const [inputData, setInputData] = useState({
    firstName: "",
    lastName: "",
    year: "",
    StdId: "",
    gpa: "",
    income: "",
    lineId: "",
    email: "",
    password: "",
  });

  const [message,setMessage] = useState('')
  const navigate = useNavigate()

  const handleSummit = async (e) =>{
    e.preventDefault();
    try{
      const response = await axios.post('http://localhost:5000/register',inputData)
      setMessage(response.data.message)
      navigate('/login')
    }catch(err){
      if (err.response && err.response.data) {
        setMessage(err.response.data.message);
    } else {
        setMessage("Server error or cannot reach API");
    }
    }
  }


  return (
    <div className="min-h-full min-w-full bg-gradient-to-tr from-amber-200 via-amber-200 to-red-400 flex items-center justify-center px-6 py-12 ">
      <div className="flex w-200 h-max flex-col justify-center px-6 py-12 lg:px-8 bg-white rounded-xl shadow-xl">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img src={Logo} alt="" className="mx-auto h-20 w-auto" />
          <h2 className="mt-7 text-center text-2xl/9 font-bold tracking-tight text-black">
            ลงทะเบียน
          </h2>
        </div>

        <form onSubmit={handleSummit} className="space-y-6 space-x-6">
          <div className="grid gap-6 mt-4 md:grid-cols-2">
            <InputBox
              id="firstName"
              label="ชื่อ"
              type="text"
              name="firstName"
              placeholder="สมศรี"
              required
              autoComplete="given-name"
              maxLength={15}
              pattern="text"
              value={inputData.firstName}
              onChange={(e) =>
                setInputData({ ...inputData, firstName: e.target.value })
              }
            />
            <InputBox
              id="lastName"
              label="นามสกุล"
              type="text"
              name="lastName"
              placeholder="กวางทอง"
              required
              autoComplete="family-name"
              maxLength={20}
              pattern="text"
              value={inputData.lastName}
              onChange={(e) =>
                setInputData({ ...inputData, lastName: e.target.value })
              }
            />
            <InputBox
              id="StdId"
              label="รหัสนักศึกษา"
              type="text"
              name="StdId"
              placeholder=""
              required
              autoComplete="off"
              maxLength={10}
              pattern="number"
              value={inputData.StdId}
              onChange={(e) =>
                setInputData({ ...inputData, StdId: e.target.value })
              }
            />
            <InputBox
              id="year"
              label="ชั้นปีที่"
              type="number"
              name="year"
              placeholder=""
              required
              autoComplete="off"
              options={["1", "2", "3", "4"]}
              value={inputData.year}
              onChange={(e) =>
                setInputData({ ...inputData, year: e.target.value })
              }
            />
            <InputBox
              id="gpa"
              label="gpa"
              type="decimal"
              name="gpa"
              placeholder="3.00"
              required
              autoComplete="off"
              maxLength={4}
              pattern="decimal"
              value={inputData.gpa}
              onChange={(e) =>
                setInputData({ ...inputData, gpa: e.target.value })
              }
            />
            <InputBox
              id="income"
              label="รายได้ต่อปี"
              type="text"
              name="income"
              placeholder=""
              autoComplete="off"
              options={["1", "2", "3", "4"]}
              value={inputData.income}
              onChange={(e) =>
                setInputData({ ...inputData, income: e.target.value })
              }
            />
            <InputBox
              id="lineId"
              label="Line Id"
              type="text"
              name="lineId"
              placeholder="ras7897"
              autoComplete="off"
              maxLength={20}
              pattern=""
              value={inputData.lineId}
              onChange={(e) =>
                setInputData({ ...inputData, lineId: e.target.value })
              }
            />
            <InputBox
              id="email"
              label="Email"
              type="text"
              name="email"
              placeholder="somsri.mon@dome.tu.ac.th"
              required
              autoComplete="email"
              maxLength={40}
              pattern=""
              value={inputData.email}
              onChange={(e) =>
                setInputData({ ...inputData, email: e.target.value })
              }
            />
          </div>

          <div className="mb-6">
            <InputBox
              id="password"
              label="รหัสผ่าน"
              type="password"
              name="password"
              placeholder=""
              required
              maxLength={10}
              pattern=""
              value={inputData.password}
              onChange={(e) =>
                setInputData({ ...inputData, password: e.target.value })
              }
            />
            {/* <InputBox
              id="confirmPassword"
              label="ยืนยันรหัสผ่าน"
              type="password"
              name="confirmPassword"
              placeholder=""
              required
              maxLength={10}
              pattern=""
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            /> */}
          </div>

           <div className="mt-9">
              <Button type = 'submit' primary={true}>ลงทะเบียน</Button>
            </div>

        </form>

        <p className="mt-5 text-center text-sm/6 text-gray-400">
          <Link to="/" className="text-[#FF8000] hover:text-[#FFA300]">
            กลับหน้าแรก
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
