import React from 'react'

function StudentTable({studentData}) {
  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg ">

      {/* หัวตาราง */}
       <table className="text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          {/* col */}
          <tr>
            {/* checkbox */}
            <th scope="col" className="p-4">
                    <div className="flex items-center">
                        <input id="checkbox-all-search" type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                        <label htmlFor="checkbox-all-search" className="sr-only">checkbox</label>
                    </div>
              </th>
              <th scope="col" className="px-6 py-3">
                    ชื่อ
                </th>

                <th scope="col" className="px-6 py-3">
                    นามสกุล
                </th>

                <th scope="col" className="px-6 py-3">
                    รหัสนักศึกษา
                </th>

                <th scope="col" className="px-6 py-3">
                    ชั้นปีที่
                </th>

                <th scope="col" className="px-6 py-3">
                    เกรดเฉลี่ย
                </th>

                <th scope="col" className="px-6 py-3">
                    สถานะ
                </th>
          </tr>
        </thead>
        
        {/* row */}
        <tbody>
          {studentData.map((e) => (

            <tr key={e.user_id} /* onClick={() => onEditClick(e)} */ className="cursor-pointer bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">
            {/* checkbox */}
             <td className="w-4 p-4">
                    <div className="flex items-center">
                        <input id="checkbox-table-search-1" type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                        <label for="checkbox-table-search-1" className="sr-only">checkbox</label>
                    </div>
              </td>
              <th scope="row" /* onClick={() => onEditClick(e)} */ className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                   {e.std_name}
              </th>

              <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                   {e.std_lastname}
              </th>

              <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                   {e.std_id}
              </th>

              <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                   {e.std_year}
              </th>

              <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    {e.std_gpa}
              </th>

              <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                   {e.is_active === 1 ? "คงอยู่" : "ไม่มีสิทธิเข้าใช้งาน"}
              </th>

          </tr>
          ))}
          

        </tbody>


       </table>
        
      
    </div>
  )
}

export default StudentTable
