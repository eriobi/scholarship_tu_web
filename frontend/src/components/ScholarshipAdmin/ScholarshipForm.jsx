import React, { useState , useEffect } from "react";

import Input from "../input/InputBox";
import Datepicker from "../input/DateSelect";
import About from "../input/About";
import ActionButton from '../button/ActionButton'

function ScholarshipForm({ onSubmit, onCancel, data = {} }) {
  const [formData, setFormData] = useState(
    data || {
      id: data?.id || "", //ถ้ามี id จะใช้งาน update แต่ถ้าไม่มีจะเป็นการ add
      schoName: "",
      schoYear: "",
      type: "",
      source: "",
      std_year: "",
      std_gpa: "",
      std_income: "",
      endDate: "",
      desp: "",
      is_active: "1"
    }
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

useEffect(() => {
    if (data) {
      setFormData({
        id: data?.id || "",
        schoName: data.scho_name || '',
        schoYear: data.scho_year || '' ,
        type: data.scho_type|| '' ,
        source: data.scho_source|| '' ,
        std_year: data.std_year || "",
        std_gpa: data.std_gpa || "",
        std_income: data.std_income || "",
        startDate: data.start_date ? new Date(data.start_date) : null,
        endDate: data.end_date ? new Date(data.end_date) : null,
        desp: data.scho_desp || "",
        is_active: data.is_active?.toString() || "1"
      });
    }
  }, [data]);

console.log("ScholarshipForm data:", data);
console.log("formData:", formData);

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <Input
        id="ทุน"
        label="ชื่อทุนการศึกษา"
        type="text"
        name="schoName"
        placeholder=""
        required
        pattern="text"
        value={formData.schoName}
        onChange={handleChange}
      />
      <Input
        id="ปี"
        label="ปีการศึกษา"
        type="text"
        name="schoYear"
        placeholder=""
        required
        pattern="number"
        value={formData.schoYear}
        onChange={handleChange}
      />

      <Input
        id="ประเภททุน"
        label="ประเภททุน"
        type="text"
        name="type"
        placeholder=""
        required
        options={["ทุนเหมาจ่าย", "ทุนระยะยาว"]}
        value={formData.type}
        onChange={handleChange}
      />

      <Input
        id="แหล่งทุน"
        label="แหล่งทุน"
        type="text"
        name="source"
        placeholder=""
        required
        options={["ทุนภายใน", "ทุนภายนอก"]}
        value={formData.source}
        onChange={handleChange}
      />

      <Input
        id="รับนักศึกษาปีที่"
        label="รับนักศึกษาปีที่"
        type="text"
        name="std_year"
        placeholder=""
        required
        options={["1-4", "2-4"]}
        value={formData.std_year}
        onChange={handleChange}
      />

      <Input
        id="เกรดเฉลี่ยขั้นต่ำ"
        label="เกรดเฉลี่ยขั้นต่ำ"
        type="number"
        name="std_gpa"
        placeholder=""
        required
        pattern="decimal"
        value={formData.std_gpa}
        onChange={handleChange}
      />

      <Input
        id="รายได้ขั้นต่ำ"
        label="รายได้ขั้นต่ำ"
        type="number"
        name="std_income"
        placeholder=""
        required
        options={["0", "0-100,000 บาท"]}
        value={formData.std_income}
        onChange={handleChange}
      />

      <Datepicker
        id="เริ่มต้นโครงการ"
        label="เริ่มต้นโครงการ"
        name="start_date"
        value={formData.startDate}
        onChange={(dateString) =>
          setFormData({ ...formData, startDate: dateString })
        }
      />

      <Datepicker
        id="สิ้นสุดโครงการ"
        label="สิ้นสุดโครงการ"
        name="endDate"
        value={formData.endDate}
        onChange={(dateString) =>
          setFormData({ ...formData, endDate: dateString })
        }
      />

      <About
        id="คำอธิบาย"
        label="คำอธิบาย"
        name="desp"
        value={formData.desp}
        onChange={handleChange}
      />

      <div className="form-buttons">
        <button type="submit" >บันทึก</button>
        <button type="button" onClick={onCancel}>
          ยกเลิก
        </button>
      </div>
    </form>
  );
}

export default ScholarshipForm;
