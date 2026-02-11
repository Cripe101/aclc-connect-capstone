import React, { useContext } from 'react'
import { UserContext } from '../../../context/userContext'
import SideMenu from './SideMenu'
import Navbar from './Navbar'

const DashboardLayout = ({children, activeMenu}) => {
  const {user} = useContext(UserContext)

  return (
    <div className=''>
      <Navbar activeMenu={activeMenu} />

      {user && (
        <div className='flex'>
          <div className='max-[1080px]:hidden'>
            <SideMenu activeMenu={activeMenu} setOpenSideMenu={() => {}} />
          </div>

          <div className='grow mx-5'>{children}</div>
        </div>
      )}

      <footer className="text-center text-sm text-gray-500 py-8">
          <span>© {new Date().getFullYear()} ACLC — All rights reserved.</span>
        </footer>
    </div>
  )
}

export default DashboardLayout