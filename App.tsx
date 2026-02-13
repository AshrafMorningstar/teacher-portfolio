
import React, { useState, useEffect, useCallback } from 'react';
import { User, Role, Practice, Seminar, SystemState } from './types';
import { Auth } from './components/Auth';
import { Layout } from './components/Layout';
import { TeacherDashboard } from './components/TeacherDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { ThreeBackground } from './components/ThreeBackground';

// Initial Mock Data
const INITIAL_TEACHERS: User[] = [
  { id: 't1', name: 'Dr. Sarah Smith', email: 'sarah@edu.com', role: Role.TEACHER, contactInfo: '555-0101', qualifications: 'PhD in Computer Science' },
  { id: 't2', name: 'Prof. James Wilson', email: 'james@edu.com', role: Role.TEACHER, contactInfo: '555-0102', qualifications: 'MSc in Mathematics' },
];

const App: React.FC = () => {
  const [state, setState] = useState<SystemState>(() => {
    const saved = localStorage.getItem('teacher_portfolio_state');
    if (saved) return JSON.parse(saved);
    return {
      currentUser: null,
      teachers: INITIAL_TEACHERS,
      practices: [],
      seminars: [],
    };
  });

  useEffect(() => {
    localStorage.setItem('teacher_portfolio_state', JSON.stringify(state));
  }, [state]);

  const handleLogin = (user: User) => {
    setState(prev => ({ ...prev, currentUser: user }));
  };

  const handleLogout = () => {
    setState(prev => ({ ...prev, currentUser: null }));
  };

  const handleUpdateProfile = (updates: Partial<User>) => {
    setState(prev => {
      const updatedTeachers = prev.teachers.map(t => 
        t.id === prev.currentUser?.id ? { ...t, ...updates } : t
      );
      return {
        ...prev,
        teachers: updatedTeachers,
        currentUser: prev.currentUser ? { ...prev.currentUser, ...updates } : null
      };
    });
  };

  const handleAddPractice = (practice: Practice) => {
    setState(prev => ({ ...prev, practices: [...prev.practices, practice] }));
  };

  const handleDeletePractice = (id: string) => {
    setState(prev => ({ ...prev, practices: prev.practices.filter(p => p.id !== id) }));
  };

  const handleAddSeminar = (seminar: Seminar) => {
    setState(prev => ({ ...prev, seminars: [...prev.seminars, seminar] }));
  };

  const handleDeleteSeminar = (id: string) => {
    setState(prev => ({ ...prev, seminars: prev.seminars.filter(s => s.id !== id) }));
  };

  if (!state.currentUser) {
    return (
      <>
        <ThreeBackground />
        <Auth onLogin={handleLogin} />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-[#fcfcfc]">
      <ThreeBackground />
      <Layout user={state.currentUser} onLogout={handleLogout}>
        {state.currentUser.role === Role.TEACHER ? (
          <TeacherDashboard 
            user={state.currentUser} 
            practices={state.practices.filter(p => p.teacherId === state.currentUser?.id)}
            seminars={state.seminars.filter(s => s.teacherId === state.currentUser?.id)}
            onUpdateProfile={handleUpdateProfile}
            onAddPractice={handleAddPractice}
            onDeletePractice={handleDeletePractice}
            onAddSeminar={handleAddSeminar}
            onDeleteSeminar={handleDeleteSeminar}
          />
        ) : (
          <AdminDashboard 
            teachers={state.teachers}
            practices={state.practices}
            seminars={state.seminars}
          />
        )}
      </Layout>
    </div>
  );
};

export default App;
