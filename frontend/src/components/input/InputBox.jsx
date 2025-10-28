import React, { useState } from "react";
import clsx from "clsx";

function InputBox({
  id,
  label,
  type,
  name,
  placeholder,
  required = false,
  autoComplete,
  maxLength,
  pattern,
  options,
  value,
  onChange
}) {

  const [touched, setTouched] = useState(false);
  const hasError = required && touched && String(value || "").trim() === ""; //เช็คว่ากรอกข้อมูลหรือยัง

  const regex =
    pattern === "number"
      ? /^\d*$/
      : pattern === "text"
      ? /^[A-Za-zก-๙\s]*$/
      : pattern === "decimal"
      ? /^\d+(\.\d{0,2})?$/
      : /.*/;

  const setPattern = (e) => {
    /* e.target.value ค่าที่ input เข้ามา */
    const valPatter = e.target.value;
    /* .test('') เข็คว่าตรงกับค่าใน () หรือไม่*/
    if (regex.test(valPatter)) {
      /* return ค่ากลับ */
      onChange(e);
    }
  };

  return (
    /* หัวข้อ */
    <div className="mt-1">
      <label
        htmlFor={id}
        className="block text-sm/6 font-medium text-black mb-2"
      >
        {label}
      </label>

      {/* input แบบ option */}
      {options ? (
        <>
          <select
            id={id}
            name={name}
            
            value={value ?? ""} 
            onChange={setPattern} 
            className={clsx(
              "block w-full rounded-md px-3 py-2 text-base text-black bg-gray-50",
              hasError
                ? "outline-1 -outline-offset-1 outline-red-400 focus:outline-2 focus:-outline-offset-2 focus:outline-red-500 sm:text-sm/6 "
                : "outline-1 -outline-offset-1 outline-[#C2C2C2] placeholder:text-[#D2D2D2] focus:outline-2 focus:-outline-offset-2 focus:outline-[#BEBEBE] sm:text-sm/6"
            )}
          >
            <option value="" className="text-sm/6 font-medium text-[#C2C2C2]">
              เลือก{label}
            </option>
            {options.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          {hasError && (
            <p className="text-red-500 text-sm mt-1">กรุณากรอก {label}</p>
          )}
        </>
      ) : (
        /* input ปกติ */
        <>
          <input
            id={id}
            type={type}
            name={name}
            placeholder={placeholder}
            autoComplete={autoComplete}
            value={value ?? "" }
            maxLength={maxLength}
            onChange={setPattern}
            onBlur={() => setTouched(true)}
            className={clsx(
              "block w-full rounded-md px-3 py-2 text-base text-black bg-gray-50",
              hasError
                ? "outline-1 -outline-offset-1 outline-red-400 focus:outline-2 focus:-outline-offset-2 focus:outline-red-500 sm:text-sm/6"
                : "outline-1 -outline-offset-1 outline-[#C2C2C2] placeholder:text-[#D2D2D2] focus:outline-2 focus:-outline-offset-2 focus:outline-[#BEBEBE] sm:text-sm/6"
            )}
          />
          {hasError && (
            <p className="text-red-500 text-sm mt-1">กรุณากรอก {label}</p>
          )}
        </>
      )}
    </div>
  );
}

export default InputBox;
