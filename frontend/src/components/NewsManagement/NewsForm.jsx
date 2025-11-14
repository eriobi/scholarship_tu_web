import React, { useState, useEffect } from "react";

import Input from "../input/InputBox";
import About from "../input/About";

function NewsForm({ onSubmit, onCancel, data = {} }) {
  const [formData, setFormData] = useState(
    data || {
      news_id: data?.id || "",
      news_title: "",
      news_content: "",
    }
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
    news_title: formData.news_title,
    news_content: formData.news_content
  });
  };

  useEffect(() => {
    if (data) {
      setFormData({
        news_id: data?.id || "",
        news_title: data.news_title || "", // ไม่มี data. จะ set ค่าว่างทุกครั้งที่ต้องการแก้ไข
        news_content: data.news_content || "",
      });
    }
  }, [data]);

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <Input
        id="ข่าว"
        label="ชื่อข่าวประชาสัมพันธ์"
        type="text"
        name="news_title"
        placeholder=""
        required
        value={formData.news_title}
        onChange={handleChange}
      />
      <About
        id="คำอธิบาย"
        label="คำอธิบาย"
        name="news_content"
        value={formData.news_content}
        onChange={handleChange}
      />

      <div className="form-buttons">
        <button type="submit">บันทึก</button>
        <button type="button" onClick={onCancel}>
          ยกเลิก
        </button>
      </div>
    </form>
  );
}

export default NewsForm;
