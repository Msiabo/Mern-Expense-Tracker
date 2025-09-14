import React, { useState } from 'react';
import { HiOutlineMenu, HiOutlineX } from 'react-icons/hi';
import SidebarMenu from './SidebarMenu';

const Navbar = ({ activeMenu }) => {
  const [openSidebarMenu, setOpenSidebarMenu] = useState(false);

  return (
    <>
      {/* Navbar */}
      <div className='flex gap-5 bg-white border-b border-gray-100 p-4 backdrop-blur-[2px] px-7 sticky top-0 z-30'>
        <button
          className='block lg:hidden text-black'
          onClick={() => setOpenSidebarMenu(!openSidebarMenu)}
        >
          {openSidebarMenu ? <HiOutlineX className='text-2xl' /> : <HiOutlineMenu className='text-2xl' />}
        </button>

        <h2 className='text-xl font-bold text-gray-800'>Expense Tracker</h2>
      </div>

      {/* Sidebar outside navbar */}
      {openSidebarMenu && (
        <div className='lg:hidden'>
          <SidebarMenu activeMenu={activeMenu} />
        </div>
      )}
    </>
  );
};

export default Navbar;
