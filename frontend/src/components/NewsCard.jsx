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

  const closeModal = () =>{
    setSelectedNews(null);
    setIsModalOpen(false);
  }

return (
    <div className="p-6 space-y-3">
      <h1 className="text-xl font-bold mb-4">ข่าวประชาสัมพันธ์</h1>

      {/* แทบ */}
      {news.map((content) => (
        <div
          key={content.news_id}
          onClick={() => openModal(content)}
          className="w-full cursor-pointer relative flex flex-col my-6 bg-white shadow-sm border border-slate-200 rounded-lg"
        >
          <h2 className="p-4 font-semibold text-gray-800">
            {content.news_title}
          </h2>
        </div>
      ))}

      {/* Modal แสดงเนื้อหาข่าว */}
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        {selectedNews && (
          <div>
            <h2 className="mb-2 text-slate-800 text-xl font-semibold">{selectedNews.news_title}</h2>

            <p className="text-gray-700 whitespace-pre-line leading-relaxed">
              {selectedNews.news_content}
            </p>

            <p className="mt-4 text-xs text-gray-400">
              วันที่ประกาศ: {" "}
              {new Date(selectedNews.created_at).toLocaleString("th-TH")}
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default NewsCard;
