
import React from 'react';
import { User, Role } from '../types';

interface LayoutProps {
  user: User;
  onLogout: () => void;
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ user, onLogout, children }) => {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r-2 border-black flex flex-col">
        <div className="p-6 border-b-2 border-black">
          <h1 className="text-2xl font-black tracking-tighter uppercase italic">EduPort</h1>
          <p className="text-xs font-medium text-gray-500 mt-1">Portfolio System</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <div className="px-4 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Main</div>
          <a href="#" className="block px-4 py-3 bg-black text-white font-bold rounded-lg neubrutalism-card flex items-center space-x-3">
            <span className="w-5 h-5 bg-white rounded-full flex items-center justify-center text-black text-[10px]">DB</span>
            <span>Dashboard</span>
          </a>
          {user.role === Role.ADMIN && (
            <a href="#" className="block px-4 py-3 text-black font-bold hover:bg-gray-100 rounded-lg flex items-center space-x-3">
              <span className="w-5 h-5 bg-black rounded-full flex items-center justify-center text-white text-[10px]">T</span>
              <span>Teachers</span>
            </a>
          )}
          <a href="#" className="block px-4 py-3 text-black font-bold hover:bg-gray-100 rounded-lg flex items-center space-x-3">
            <span className="w-5 h-5 bg-black rounded-full flex items-center justify-center text-white text-[10px]">S</span>
            <span>Settings</span>
          </a>
        </nav>

        <div className="p-4 mt-auto">
          <div className="p-4 neubrutalism-card rounded-lg bg-gray-50 mb-4">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-8 h-8 rounded-full bg-black border-2 border-white"></div>
              <div>
                <div className="text-sm font-black truncate max-w-[120px]">{user.name}</div>
                <div className="text-[10px] font-bold text-gray-400">{user.role}</div>
              </div>
            </div>
            <button 
              onClick={onLogout}
              className="w-full py-2 text-xs font-bold text-red-600 border border-red-200 rounded hover:bg-red-50 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-[#fafafa]">
        <header className="h-20 bg-white border-b-2 border-black flex items-center justify-between px-8 sticky top-0 z-20">
          <div className="text-lg font-black">{user.role === Role.ADMIN ? 'Admin Overview' : 'Teacher Workspace'}</div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search resources..." 
                className="pl-4 pr-10 py-2 bg-gray-100 border-2 border-black rounded-full text-sm focus:outline-none focus:ring-0 w-64"
              />
              <span className="absolute right-4 top-2.5">🔍</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-black border-2 border-white flex items-center justify-center text-white text-xs font-bold">
              {user.name.charAt(0)}
            </div>
          </div>
        </header>

        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
};
