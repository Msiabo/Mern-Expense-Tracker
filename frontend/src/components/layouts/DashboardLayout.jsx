import React, { useContext } from 'react';
import SidebarMenu from './SidebarMenu';
import Navbar from './Navbar';
import { UserContext } from '../../context/UserContext';

const DashboardLayout = ({ children, activeMenu }) => {
  const { user } = useContext(UserContext); // ✅ fixed

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar activeMenu={activeMenu} />

      {user && (
        <div className="flex">
          {/* Sidebar hidden on screens smaller than 1000px */}
          <div className="hidden lg:block">
            <SidebarMenu activeMenu={activeMenu} />
          </div>

          {/* Main content */}
          <div className="flex-1 mx-5">{children}</div>
        </div>
      )}
    </div>
  );
};

export default DashboardLayout;
