import { Routes, Route,useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import News from "./pages/News";
import Scholarships from "./pages/Scholarships";
import Footer from "./components/Footer";
import ProtectedRoute from "./ProtectedRoute";
import Profile from "./pages/Profile";
import Bookmarks from "./pages/Bookmarks";
import NotiStudent from "./pages/NotiStudent";
import NotiAdmin from "./pages/NotiAdmin"
import NewsManagement from "./pages/NewsManagement";
import ScholarshipsManagement from "./pages/ScholarshipsManagement";
import StudentManagement from "./pages/StudentManagement";
import DashboardAdmin from "./pages/DashboardAdmin";
import Sidebar from "./components/Sidebar";

function App() {
   const location = useLocation();
   const showSidebar = location.pathname.startsWith("/admin") && location.pathname !== "/admin/noti";
  return (
    <>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex pt-24">{showSidebar && <Sidebar />}</div>
        
        <div className={`${showSidebar ? "ml-64" : ""} flex-grow`}>
          <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/news" element={<News />} />
          <Route path="/scholarships" element={<Scholarships />} />
          
          {/* route ของ user */}
          <Route element={<ProtectedRoute roleRequired={"student"} />}>
            <Route path="/user/noti" element={<NotiStudent />} />
            <Route path="/user/profile" element={<Profile />} />
            <Route path="/user/bookmarks" element={<Bookmarks />} />
          </Route>

          {/* route ของ admin */}
          <Route element={<ProtectedRoute roleRequired={"admin"} />}>
            <Route path="/admin/noti" element={<NotiAdmin />} />
            <Route path="/admin/news" element={<NewsManagement />} />
            <Route path="/admin/scholarship" element={<ScholarshipsManagement />} />
            <Route path="/admin/student" element={<StudentManagement />} />
            <Route path="/admin/dashboard" element={<DashboardAdmin />} />
          </Route>
        </Routes>
        </div>
         <Footer />

        
      </div>
    </>
  );
}

export default App;
