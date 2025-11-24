// frontend/src/components/LineConnectBox.jsx
import React, { useContext } from "react";
import { UserContext } from "../UserContext";

const LINE_OA_URL = "https://line.me/R/ti/p/@138vdzim"; // TODO: ใส่ของจริง

function LineConnectBox() {
  const { user } = useContext(UserContext);

  // สมมติ backend ส่ง line_id ติดมากับ user ด้วย
  const isLinked = !!user?.line_id;
  const studentCode = user?.std_id || "6507xxxxxx";

  return (
    <div className="w-full max-w-3xl mx-auto mb-4 p-4 rounded-lg border border-green-200 bg-green-50">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        {/* ฝั่งข้อความหลัก */}
        <div>
          <h3 className="text-base font-semibold text-green-900 mb-1">
            เชื่อมต่อ LINE เพื่อรับแจ้งเตือนทุนการศึกษา
          </h3>

          {isLinked ? (
            <>
              <p className="text-sm text-green-800">
                บัญชีของคุณเชื่อมต่อกับ LINE แล้ว ✅
              </p>
              <p className="text-xs text-green-800 mt-1">
                คุณจะได้รับแจ้งเตือนทุนใหม่ ๆ และการอัปเดตต่าง ๆ ผ่าน LINE OA โดยอัตโนมัติ
              </p>
            </>
          ) : (
            <>
              <p className="text-sm text-gray-800">
                ขั้นตอนการเชื่อมต่อ (ทำครั้งเดียว):
              </p>
              <ol className="list-decimal list-inside text-xs text-gray-800 mt-1 space-y-0.5">
                <li>
                  กดปุ่ม{" "}
                  <a
                    href={LINE_OA_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="text-green-700 underline font-semibold"
                  >
                    เพิ่มเพื่อน LINE OA
                  </a>
                </li>
                <li>
                  พิมพ์ข้อความ{" "}
                  <span className="font-mono bg-white px-1 py-0.5 rounded border border-gray-300">
                    ลงทะเบียน {studentCode}
                  </span>{" "}
                  ส่งในห้องแชทกับ OA
                </li>
                <li>ระบบจะตอบกลับยืนยันว่าเชื่อมต่อสำเร็จ</li>
              </ol>
            </>
          )}
        </div>

        {/* ฝั่งสถานะ / badge */}
        <div className="flex flex-col items-start md:items-end gap-2">
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
              isLinked
                ? "bg-green-600 text-white"
                : "bg-yellow-100 text-yellow-800"
            }`}
          >
            {isLinked ? "เชื่อมต่อแล้ว" : "ยังไม่ได้เชื่อมต่อ"}
          </span>

          {!isLinked && (
            <a
              href={LINE_OA_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md bg-green-600 text-white hover:bg-green-700"
            >
              เพิ่มเพื่อน LINE OA
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default LineConnectBox;
