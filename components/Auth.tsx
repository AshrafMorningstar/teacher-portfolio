
import React, { useState } from 'react';
import { Role, User } from '../types';

interface AuthProps {
  onLogin: (user: User) => void;
}

export const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role>(Role.TEACHER);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate authentication
    if (email === 'admin@edu.com') {
      onLogin({
        id: 'admin-1',
        name: 'Super Admin',
        email: 'admin@edu.com',
        role: Role.ADMIN
      });
    } else {
      onLogin({
        id: 't-' + Math.random().toString(36).substr(2, 9),
        name: email.split('@')[0].toUpperCase(),
        email: email,
        role: selectedRole
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md neubrutalism-card bg-white p-10 animate-in zoom-in duration-300">
        <div className="text-center mb-10">
          <div className="inline-block px-4 py-1 bg-black text-white text-[10px] font-black uppercase tracking-[0.2em] mb-4">Welcome to</div>
          <h1 className="text-5xl font-black italic tracking-tighter uppercase leading-none">EduPort</h1>
          <p className="text-sm font-medium text-gray-500 mt-2">Professional Teacher Portfolio Ecosystem</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest mb-2">Work Email</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border-2 border-black p-4 rounded-xl font-bold placeholder:text-gray-300 focus:outline-none transition-all focus:bg-gray-50"
              placeholder="e.g. sarah@university.edu"
            />
          </div>
          
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest mb-2">Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border-2 border-black p-4 rounded-xl font-bold placeholder:text-gray-300 focus:outline-none transition-all focus:bg-gray-50"
              placeholder="••••••••"
            />
          </div>

          <div className="flex items-center space-x-4 mb-6">
            <button 
              type="button"
              onClick={() => setSelectedRole(Role.TEACHER)}
              className={`flex-1 py-3 border-2 border-black font-black text-xs uppercase transition-all ${selectedRole === Role.TEACHER ? 'bg-black text-white shadow-none' : 'bg-white text-black shadow-[4px_4px_0px_black]'}`}
            >
              Teacher
            </button>
            <button 
              type="button"
              onClick={() => setSelectedRole(Role.ADMIN)}
              className={`flex-1 py-3 border-2 border-black font-black text-xs uppercase transition-all ${selectedRole === Role.ADMIN ? 'bg-black text-white shadow-none' : 'bg-white text-black shadow-[4px_4px_0px_black]'}`}
            >
              Admin
            </button>
          </div>

          <button 
            type="submit" 
            className="w-full py-4 bg-black text-white font-black uppercase tracking-widest rounded-xl neubrutalism-button shadow-none active:translate-y-1"
          >
            {isRegistering ? 'Create Account' : 'Secure Sign In'}
          </button>
        </form>

        <div className="mt-10 pt-10 border-t-2 border-gray-50 text-center">
          <p className="text-xs font-bold text-gray-400 mb-4">
            {isRegistering ? 'Already have an account?' : 'Need an institution account?'}
          </p>
          <button 
            onClick={() => setIsRegistering(!isRegistering)}
            className="text-xs font-black uppercase tracking-widest text-black border-b-2 border-black pb-1"
          >
            {isRegistering ? 'Switch to Login' : 'Register Institution'}
          </button>
        </div>

        <div className="mt-8 text-[10px] text-gray-300 font-bold uppercase tracking-widest text-center">
          Try admin@edu.com for admin preview
        </div>
      </div>
    </div>
  );
};
