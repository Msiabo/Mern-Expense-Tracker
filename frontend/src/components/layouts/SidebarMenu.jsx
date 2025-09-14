import React, { useContext } from 'react';
import { SIDEBAR_MENU_DATA} from '../../utils/data';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';
import {API_BASE_URL,API_PATHS} from '../../utils/apiPaths'
import axios from 'axios';

const SidebarMenu = ({ activeMenu }) => {
  const { user, clearUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // Optional: call backend to invalidate session
      await axios.post(`${API_BASE_URL}${API_PATHS.AUTH.LOGOUT}`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      localStorage.removeItem('token'); // remove token
      clearUser(); // clear user from context
      navigate('/login'); // redirect to login page
    }
  };

  const handleClick = (route) => {
    if (route === '/logout') {
      handleLogout();
    } else {
      navigate(route);
    }
  };

  return (
    <div className="w-64 h-[calc(100vh-61px)] bg-white border-r border-gray-200 p-5 sticky top-[61px]">
      <div className="flex flex-col items-center justify-center gap-3 mb-3">
        {user?.profileImageUrl && (
          <img
            src={user.profileImageUrl}
            alt="Profile"
            className="w-16 h-16 rounded-full bg-slate-400"
          />
        )}
        <h5 className="mt-2 text-lg text-gray-900 leading-6 font-medium">
          {user?.fullName || ''}
        </h5>
      </div>

      {SIDEBAR_MENU_DATA.map((item, index) => (
        <button
          key={`menu_${index}`}
          className={`w-full flex items-center gap-3 text-[15px] py-3 px-6 rounded-lg mb-3 ${
            activeMenu === item.name
              ? 'text-purple-700 font-semibold'
              : 'text-gray-600 hover:text-purple-700'
          }`}
          onClick={() => handleClick(item.path)}
        >
          <item.icon className="w-5 h-5" />
          {item.name}
        </button>
      ))}
    </div>
  );
};

export default SidebarMenu;
