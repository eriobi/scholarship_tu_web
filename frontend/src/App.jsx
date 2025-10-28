import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import News from "./pages/News";
import Scholarships from "./pages/Scholarships";
import Footer from "./components/Footer";
import ProtectedRoute from "./ProtectedRoute";
import Profile from "./pages/Profile";
import Bookmarks from "./pages/Bookmarks"
import DashboardStd from "./pages/DashboardStd"
import Noti from "./pages/Noti"
import NewsManagement from "./pages/NewsManagement";
import ScholarshipsManagement from "./pages/ScholarshipsManagement"
import StudentManagement from "./pages/StudentManagement"
import DashboardAdmin from "./pages/DashboardAdmin"


function App() {
  return (
    <>
      <div>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/news" element={<News />} />
          <Route path="/scholarships" element={<Scholarships />} />

          <Route element={<ProtectedRoute/>}>
            <Route path="/noti" element={<Noti />} />
          </Route>

          
          {/* route ของ user */}
          <Route element={<ProtectedRoute roleRequired={'student'} />}>
            <Route path="/user/profile" element={<Profile />} />
            <Route path="/user/bookmarks" element={<Bookmarks />} />
            <Route path="/user/dashboard" element={<DashboardStd />} />
          </Route>

           {/* route ของ admin */}
          <Route element={<ProtectedRoute roleRequired={'admin'} />}>
            <Route path="/admin/news" element={<NewsManagement />} />
            <Route path="/admin/scholarship" element={<ScholarshipsManagement />} />
            <Route path="/admin/student" element={<StudentManagement />} />
            <Route path="/admin/dashboard" element={<DashboardAdmin />} />
          </Route>

        </Routes>
        <Footer />
      </div>
    </>
  );
}

export default App;
