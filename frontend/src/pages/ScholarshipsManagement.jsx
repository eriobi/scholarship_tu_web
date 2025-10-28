import React, { useState, useEffect } from "react";

import axiosInstance from "../axiosInstance";

import ScholarshipTable from "../components/ScholarshipAdmin/ScholarshipTable";
import ActionButton from "../components/button/ActionButton";
import SocialButton from "../components/button/SocialButton";
import ScholarshipForm from "../components/ScholarshipAdmin/ScholarshipForm";
import Modal from "../components/Modal";

const ScholarshipsManagement = () => {
  const [scholarships, setScholarships] = useState([]);

  /* pop up สำหรับแก้และเพิ่ม */
  const [isModalOpen, setIsModalOpen] = useState(false);
  /* pop up ลบ */
  const [deleteModel, setDeleteModel] = useState(false)

  const [updateSch, setUpdateSch] = useState(null);

  const [selectedId, setSelectedId] = useState([]);

  const API_URL = "/admin/scholarship";

  const handleCloseModal = () => setIsModalOpen(false);

  /* Callback function  ส่งไป ft อื่น เพื่อให้เรียกใช้ภายหลัง */
  const handleStatus = (id, newStatus) => {
    setScholarships((currentState) =>
      currentState.map((s) =>
        s.scholarship_id === id ? { ...s, is_active: newStatus } : s
      )
    );
  };

  /* get ทุน */
  useEffect(() => {
    fetchScholarships();
  }, []);

  const fetchScholarships = async () => {
    try {
      const res = await axiosInstance.get(API_URL);
      setScholarships(res.data);
      console.log(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  /* เพิ่มทุน */

  const handleAddClick = () => setIsModalOpen(true);

  const handleAdd = async (formData) => {
    try {
      console.log(formData);
      await axiosInstance.post(API_URL, formData);

      /* โหลดทุนใหม่ให้แสดงผล */
      fetchScholarships();
      setIsModalOpen(false);
    } catch (err) {
      console.log(err);
    }
  };

  /* แก้ไขทุน */
  const handleUpdateClick = (scholarship) => {
    setUpdateSch(scholarship);
    setIsModalOpen(true);
  };

  const handleUpdate = async (formData) => {
    const id = updateSch?.scholarship_id;
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

      fetchScholarships(); //โหลดตารางใหม่
      setIsModalOpen(false); //ปิด popup
      setUpdateSch(null); //reset form
    } catch (err) {
      console.log(err);
    }
  };

  /* ลบทุน */
  const handleDelete = async () => {
    try {
      console.log("Deleting IDs:", selectedId);
      await axiosInstance.delete(`${API_URL}`, { data: { ids: selectedId } }); //ส่งเป็น object แทน id เพราะมีหลายตัว
      setDeleteModel(false)
      setSelectedId([])
      fetchScholarships()
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <div>
        <h2>จัดการทุนการศึกษา</h2>
      </div>

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
                alert("กรุณาเลือกทุนที่ต้องการลบ");
                return
              } 
              setDeleteModel(true)
          }}>ลบ</ActionButton>
        </td>
        {/*         <td>
          <ActionButton action="edit">แก้ไข</ActionButton>
        </td> */}
        <td>
          <ActionButton action="add" onClick={handleAddClick}>
            เพิ่ม
          </ActionButton>
        </td>
      </tr>

      {/* add and edit */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <ScholarshipForm
          onSubmit={(data) => {
            if (updateSch) {
              handleUpdate({ ...data, id: updateSch.scholarship_id });
            } else {
              handleAdd(data);
            }
          }}
          onCancel={handleCloseModal}
          data={updateSch}
        />
      </Modal>

      <div className="flex justify-center items-center min-w-screen h-auto">
        <ScholarshipTable
          scholarships={scholarships}
          onEditClick={handleUpdateClick}
          /* Callback function  ส่งไป ft อื่น เพื่อให้เรียกใช้ภายหลัง */
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
              คุณต้องการลบทุน {selectedId.length} ทุนนี้หรือไม่?
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
  );
};

export default ScholarshipsManagement;
