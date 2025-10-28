import React from 'react'
import { MdAdd ,  MdDelete  } from "react-icons/md";
import { FaEdit } from "react-icons/fa";


function ActionButton({action = '' , onClick, children}) {
  /* import icon */
    const iconButton = {
        add: <MdAdd className="mr-2 text-white" />,
        edit: <FaEdit className="mr-2 text-white"/>,
        delete: <MdDelete className="text-white"/>
    }

    /* match */
    const icon = iconButton[action] || <FaPlus />;

    const buttonClass =  "px-5 py-2.5 text-sm font-medium text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 " 
    

  return (
    <button type="button" onClick={onClick} className={buttonClass}>
      {icon}
       {/* ข้อความ */}
      {children}
    </button>
  )
}

export default ActionButton
