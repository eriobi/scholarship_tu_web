import React from 'react'
import { FaLine } from "react-icons/fa";
import { SiGmail } from "react-icons/si";


function SocialButton({action = '' , onClick, children}) {

  const iconSocial = {
    line: <FaLine className="w-6 h-5 me-2  ml-1 text-[#21B94E]"/>,
    gmail: <SiGmail className="w-6 h-5 me-2  ml-1 text-[#EA4335]"/>
  }

  const icon = iconSocial[action]

  const buttonClass = 'text-gray-900 bg-white hover:bg-gray-100 border border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-600 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700 me-2 mb-2'

  return (
    <button type="button" onClick={onClick} className={buttonClass}>
      {children}
      {icon}
    </button>
  )
}

export default SocialButton
