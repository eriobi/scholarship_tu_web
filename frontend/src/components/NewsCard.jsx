import React, { useState, useEffect } from "react";

import axiosInstance from "../axiosInstance";
import Modal from "./Modal";

function NewsCard() {
  const [news, setNews] = useState([]);
  const [selectedNews, setSelectedNews] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fatchNews = async () => {
      try {
        const res = await axiosInstance.get("/api/news");
        setNews(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fatchNews();
  }, []);

  const openModal = (content) => {
    setSelectedNews(content);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedNews(null);
    setIsModalOpen(false);
  };

  return (
    <div className="p-6 space-y-3">
      {/* แถบ */}
      {news.map((content) => (
        <div
          key={content.news_id}
          onClick={() => openModal(content)}
          className="w-full min-h-20 cursor-pointer relative flex items-center mt-2 mb-6 bg-white shadow-sm border border-slate-200 rounded-lg"
        >
          <h2 className="p-4 font-semibold text-gray-800 item-center text-base">
            {content.news_title}
          </h2>
        </div>
      ))}

      {/* Modal แสดงเนื้อหาข่าว */}
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        {selectedNews && (
          <div>
            <h2 className="mb-2 text-slate-800 text-xl font-semibold">
              {selectedNews.news_title}
            </h2>

            <p className="text-gray-700 whitespace-pre-line leading-relaxed">
              {selectedNews.news_content}
            </p>

            {/* ปุ่มโหลด PDF */}
            {selectedNews.news_file && (
              <a
                href={`http://localhost:5000/uploads/news/${selectedNews.news_file}`}
                target="_blank"
                rel="noreferrer"
                className="inline-block mt-4 px-4 py-2 rounded-lg bg-purple-700 text-white hover:bg-purple-900"
              >
                ดาวน์โหลดไฟล์ PDF
              </a>
            )}

            <p className="mt-4 text-xs text-gray-400">
              วันที่ประกาศ:{" "}
              {new Date(selectedNews.created_at).toLocaleString("th-TH")}
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default NewsCard;
