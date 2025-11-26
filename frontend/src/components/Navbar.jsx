import React, { useState, useEffect, useContext, useRef } from "react";
import Logo from "../assets/image.png";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../UserContext";
import axiosInstance from "../axiosInstance";
import { IoNotificationsOutline } from "react-icons/io5";
import { IoIosNotifications } from "react-icons/io";
import Avatar from "../components/Avatar";

function NavbarTest() {
  const { user, token, setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [openDropdown, setOpenDropdown] = useState(false);
  const hoverTimer = useRef(null); //delay

  useEffect(() => {
    async function fetchData() {
      if (!token) return;
      try {
        const res = await axiosInstance.get("/navbar");
        console.log(res.data);
        setUser(res.data.user);
      } catch (err) {
        console.log("Authorization Error", err);
      }
    }

    fetchData();
  }, [token, setUser]);

  let displayName = "";
  if (user?.role === "admin") {
    displayName = `${user?.adm_name} ${user?.adm_lastname}`;
  } else if (user?.role === "student") {
    displayName = `${user?.std_name} ${user?.std_lastname}`;
  }

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post("/logout");
      console.log(response.data);
    } catch (err) {
      console.log("Logout Error");
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      navigate("/");
    }
  };

  const handleMouseEnter = () => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    setOpenDropdown(true);
  };

  const handleMouseLeave = () => {
    hoverTimer.current = setTimeout(() => {
      setOpenDropdown(false);
    }, 200); // ดีเลย์ 200ms
  };

  const notiRoute = user?.role === "admin" ? "/admin/noti" : "/user/noti";

  return (
    <div>
      <nav className="fixed w-full bg-[#FF8000] dark:bg-gray-900 z-50 ">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          {/* Logo */}
          <Link to="/">
            <img src={Logo} className="w-15 h-auto" alt="" />
          </Link>

          <div className="flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
            {!token && (
              <div className="flex space-x-3">
                <Link
                  to="/login"
                  className="px-4 py-2 border border-white text-white rounded-lg hover:bg-white hover:text-black transition"
                >
                  เข้าสู่ระบบ
                </Link>

                <Link
                  to="/register"
                  className="px-4 py-2 bg-[#4C1F7A] text-white rounded-lg hover:bg-white hover:text-black transition"
                >
                  ลงทะเบียน
                </Link>
              </div>
            )}
            
            {token && (
              <>
            <Link to={notiRoute}>
              <IoNotificationsOutline size={20} className="text-[#4C1F7A]" />
            </Link>

            <div
              className="relative"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <button
                type="button"
                className="flex items-center  px-4 py-2 text-white hover:text-[#7c3f01]"
              >
                <Avatar name={displayName} size={35} />
                <span className="font-medium px-2">{displayName}</span>
              </button>

              {/* dropdown */}
              <div
                className={`absolute right-0 mt-2 w-48 z-60 bg-white rounded-lg shadow divide-y divide-gray-100 transition 
              ${openDropdown ? "opacity-100 visible" : "opacity-0 invisible"}`}
              >
                <ul className="py-2">
                  {user?.role === "admin" && (
                    <>
                     
                      <li>
                        <Link
                          to="/admin/dashboard"
                          className="block px-4 py-2 hover:bg-gray-100"
                        >
                          Dashboard
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/admin/student"
                          className="block px-4 py-2 hover:bg-gray-100"
                        >
                          จัดการนักศึกษา
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/admin/news"
                          className="block px-4 py-2 hover:bg-gray-100"
                        >
                          จัดการข่าวประชาสัมพันธ์
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/admin/scholarship"
                          className="block px-4 py-2 hover:bg-gray-100"
                        >
                          จัดการทุนการศึกษา
                        </Link>
                      </li>
                      <li>
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                        >
                          ออกจากระบบ
                        </button>
                      </li>
                    </>
                  )}

                  {user?.role === "student" && (
                    <>
                      
                      <li>
                        <Link
                          to="/user/profile"
                          className="block px-4 py-2 hover:bg-gray-100"
                        >
                          โปรไฟล์
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/user/bookmarks"
                          className="block px-4 py-2 hover:bg-gray-100"
                        >
                          บุ๊กมาร์ก
                        </Link>
                      </li>
                      <li>
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                        >
                          ออกจากระบบ
                        </button>
                      </li>
                    </>
                  )}
                </ul>
              </div>
            </div>
            </>
          )}

            {/* Mobile button */}
            <button
              data-collapse-toggle="navbar-user"
              type="button"
              className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
            >
              <span className="sr-only">{displayName}</span>
            </button>
          </div>

          {/* Main Menu */}
          <div
            className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1"
            id="navbar-user"
          >
            <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border rounded-lg bg-[#FF8000] md:flex-row md:space-x-8 md:mt-0 md:border-0">
              <li>
                <Link
                  to="/"
                  className="block py-2 px-3 text-white hover:text-[#7c3f01]"
                >
                  หน้าหลัก
                </Link>
              </li>
              <li>
                <Link
                  to="/news"
                  className="block py-2 px-3 text-white hover:text-[#7c3f01]"
                >
                  ข่าวประชาสัมพันธ์
                </Link>
              </li>
              <li>
                <Link
                  to="/scholarships"
                  className="block py-2 px-3 text-white hover:text-[#7c3f01]"
                >
                  ทุนการศึกษา
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default NavbarTest;
