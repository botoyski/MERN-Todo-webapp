import { useState, useEffect } from 'react';
import { Menu, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';

const NavbarModern = ({ onMenuClick, onSearchChange, searchValue }) => {
  const [time, setTime] = useState('');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    update();
    const iv = setInterval(update, 60000);
    return () => clearInterval(iv);
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 shadow-sm z-50">
      <div className="flex items-center justify-between h-full px-4 lg:px-6">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Menu size={24} className="text-gray-700" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg overflow-hidden">
              <img src="/logo.png" alt="Logo" className="w-full h-full object-cover" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 hidden sm:block">Move it!</h1>
          </div>
        </div>

        {/* Center Section removed - search moved to Dashboard header */}

        {/* Right Section */}
        <div className="flex items-center gap-6">
          <div className="text-sm text-gray-600 font-medium hidden sm:block">{time}</div>
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative">
            <Bell size={20} className="text-gray-700" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          
          <Link to="/profile" className="flex items-center gap-3 pl-4 border-l border-gray-200 hover:bg-gray-50 rounded-lg transition-colors">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-gray-900">Juan Dela Cruz</p>
              <p className="text-xs text-gray-500">Productivity</p>
            </div>
            <img 
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop"
              alt="Profile"
              className="w-9 h-9 rounded-full object-cover hover:ring-2 hover:ring-blue-400 transition-all"
            />
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default NavbarModern;
