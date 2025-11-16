import React , { useState, useEffect } from 'react'

import axiosInstance from "../axiosInstance";

import ActionButton from '../components/button/ActionButton'
import SocialButton from '../components/button/SocialButton'
import NewsTable from '../components/NewsManagement/NewsTable'
import NewsForm from '../components/NewsManagement/NewsForm';
import Modal from "../components/Modal";

const NewsManagement= () => {

  const[news,setNews] = useState([])

    /* pop up สำหรับแก้และเพิ่ม */
    const [isModalOpen, setIsModalOpen] = useState(false);
    /* pop up ลบ */
    const [deleteModel, setDeleteModel] = useState(false)
  
    const [updateNews, setUpdateNews] = useState(null);
  
    const [selectedId, setSelectedId] = useState([]);

    const API_URL = "/admin/news";
    const handleCloseModal = () => setIsModalOpen(false);

    const handleStatus = (id, newStatus) => {
    setNews((currentState) =>
      currentState.map((n) =>
        n.news_id === id ? { ...n, is_active: newStatus } : n
        )
      );
    };


  /* get ข่าว */
  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const res = await axiosInstance.get(API_URL);
      setNews(res.data);
      console.log(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  /* เพิ่ม */
  const handleAddClick = () => setIsModalOpen(true);
  const handleAdd = async (formData) => {
    try {
      console.log(formData);
      await axiosInstance.post(API_URL, formData);

      /* โหลดใหม่ให้แสดงผล */
      fetchNews();
      setIsModalOpen(false);
    } catch (err) {
      console.log(err);
    }
  };

    /* แก้ไข */
  const handleUpdateClick = (news) => {
    setUpdateNews(news);
    setIsModalOpen(true);
  };

  const handleUpdate = async (formData) => {
    const id = updateNews?.news_id;
    if (!id) return;

    /* object ที่เก็บช้อมูลที่จะส่งไป backend  */
    const payload = {
      ...formData,
      is_active:
        formData.is_active !== undefined //มีการ update ไหม
          ? Number(formData.is_active) // แปลง is_active เป็น number เพราะ react เก็บเป็น string แต่ backend ต้องการ number
          : undefined,
    };

    try {
      /* Content-Type เป็น JSON เพื่อให้ backend อ่าน req.body  */
      const res = await axiosInstance.patch(`${API_URL}/${id}`, payload, {
        headers: { "Content-Type": "application/json" },
      });

      fetchNews(); //โหลดตารางใหม่
      setIsModalOpen(false); //ปิด popup
      setUpdateNews(null); //reset form
    } catch (err) {
      console.log(err);
    }
  };

  /* ลบ */
  const handleDelete = async () => {
    try {
      console.log("Deleting IDs:", selectedId);
      await axiosInstance.delete(`${API_URL}`, { data: { ids: selectedId } }); //ส่งเป็น object แทน id เพราะมีหลายตัว
      setDeleteModel(false)
      setSelectedId([])
      fetchNews();
    } catch (err) {
      console.log(err);
    }
  };


  return (
    <div>
      <h1>จัดการข่าวประชาสัมพันธ์</h1>

      <tr>
        <td>
          <SocialButton action="line">ส่งข้อความผ่าน </SocialButton>
        </td>
        <td>
          <SocialButton action="gmail">ส่งข้อความผ่าน </SocialButton>
        </td>
      </tr>

       <tr>
        <td>
          <ActionButton action="delete" onClick={() => {
              if (selectedId.length === 0){//ไว้เลือกทุนที่จะลบ
                alert("กรุณาเลือกข่าวที่ต้องการลบ");
                return
              } 
              setDeleteModel(true)
          }}>ลบ</ActionButton>
        </td>

        <td>
          <ActionButton action="add" onClick={handleAddClick}>
            เพิ่ม
          </ActionButton>
        </td>
      </tr>

     <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <NewsForm
          onSubmit={(data) => {
            if (updateNews) {
              handleUpdate({ ...data, id: updateNews.news_id });
            } else {
              handleAdd(data);
            }
          }}
          onCancel={handleCloseModal}
          data={updateNews}
        />
      </Modal>

      <div className="flex justify-center items-center min-w-screen h-auto">
        <NewsTable
          news={news}
          onEditClick={handleUpdateClick}
          onStatusChange={handleStatus}
          selectedId={selectedId}
          setSelectedId={setSelectedId}
        />
      </div>

      {/* ยืนยันก่อนลบ */}
      <Modal isOpen={deleteModel} onClose={() => setDeleteModel(false)}>
         <h3 className="text-lg font-semibold text-gray-900 mb-4">
              ยืนยันการลบข้อมูล
            </h3>
        <p className="text-gray-600 mb-6">
              คุณต้องการลบ {selectedId.length} นี้หรือไม่?
        </p>
           <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteModel(false)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                ลบ
              </button>
            </div>
      </Modal>
      
    </div>
  )
}

export default NewsManagement
