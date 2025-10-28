import React from 'react'
import axios from 'axios'

import CSTU from '../assets/CSTU.png'

const Home = () => {


  return (
    <div>
      <img src={CSTU} className='relative w-full min-w-[1100px] bg-center  bg-cover'  alt=''/>
      <ul>
        <li>ปฏิทิน</li>
        <li>กระดานข่าว</li>
      </ul>
    </div>
  )
}

export default Home
