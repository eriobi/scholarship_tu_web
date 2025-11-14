import React from 'react'

function StudentTable({studentData}) {

  /* แปลง obj เป็น arr เพื่อให้ใช้ map ได้*/
  const isArr = Array.isArray(studentData) ? studentData : [studentData]

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg ">

      {/* หัวตาราง */}
       <table className="text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          {/* col */}
          <tr>
          
              <td scope="col" className="px-6 py-3">
                    ชื่อ
                </td>

                <td scope="col" className="px-6 py-3">
                    นามสกุล
                </td>

                <td scope="col" className="px-6 py-3">
                    รหัสนักศึกษา
                </td>

                <td scope="col" className="px-6 py-3">
                    ชั้นปีที่
                </td>

                <td scope="col" className="px-6 py-3">
                    เกรดเฉลี่ย
                </td>

                <td scope="col" className="px-6 py-3">
                    สถานะ
                </td>
          </tr>
        </thead>
        
        {/* row */}
        <tbody>
          {isArr?.map(e => (
            <tr key={e.user_id} /* onClick={() => onEditClick(e)} */ className="cursor-pointer bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">
              <td scope="row" /* onClick={() => onEditClick(e)} */ className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                   {e.std_name}
              </td>

              <td scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                   {e.std_lastname}
              </td>

              <td scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                   {e.std_id}
              </td>

              <td scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                   {e.std_year}
              </td>

              <td scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    {e.std_gpa}
              </td>

              <td scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                   {e.is_active === 1 ? "ใช้งาน" : "ไม่มีสิทธิเข้าใช้งาน"}
              </td>

          </tr>
          ))}
          

        </tbody>


       </table>
        
      
    </div>
  )
}

export default StudentTable
