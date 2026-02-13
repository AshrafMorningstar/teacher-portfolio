
import React, { useState } from 'react';
import { User, Practice, Seminar, Role } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

interface AdminDashboardProps {
  teachers: User[];
  practices: Practice[];
  seminars: Seminar[];
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ teachers, practices, seminars }) => {
  const [selectedTeacherId, setSelectedTeacherId] = useState<string | null>(null);

  const stats = [
    { label: 'Total Teachers', value: teachers.length, icon: '👥' },
    { label: 'Practices Filed', value: practices.length, icon: '📚' },
    { label: 'Seminars Logged', value: seminars.length, icon: '🎤' },
    { label: 'PDF Proofs', value: [...practices, ...seminars].filter(i => i.proof).length, icon: '📎' },
  ];

  const pieData = [
    { name: 'Practices', value: practices.length },
    { name: 'Seminars', value: seminars.length },
  ];
  const COLORS = ['#000000', '#888888'];

  const selectedTeacher = teachers.find(t => t.id === selectedTeacherId);
  const teacherPractices = practices.filter(p => p.teacherId === selectedTeacherId);
  const teacherSeminars = seminars.filter(s => s.teacherId === selectedTeacherId);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Stats Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="neubrutalism-card p-6 bg-white flex items-center justify-between">
            <div>
              <div className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">{stat.label}</div>
              <div className="text-3xl font-black">{stat.value}</div>
            </div>
            <div className="text-3xl grayscale opacity-50">{stat.icon}</div>
          </div>
        ))}
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: List of Teachers */}
        <section className="lg:col-span-1 space-y-4">
          <div className="neubrutalism-card p-6 bg-white">
            <h3 className="text-lg font-black mb-6">Teacher Directory</h3>
            <div className="space-y-3">
              {teachers.map(teacher => (
                <button
                  key={teacher.id}
                  onClick={() => setSelectedTeacherId(teacher.id)}
                  className={`w-full p-4 flex items-center justify-between rounded-xl border-2 transition-all ${selectedTeacherId === teacher.id ? 'border-black bg-gray-50' : 'border-transparent hover:border-gray-200'}`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center text-white font-bold text-xs">
                      {teacher.name.charAt(0)}
                    </div>
                    <div className="text-left">
                      <div className="text-sm font-black">{teacher.name}</div>
                      <div className="text-[10px] text-gray-500">{teacher.email}</div>
                    </div>
                  </div>
                  <div className="text-[10px] font-black bg-black text-white px-2 py-1 rounded">
                    {practices.filter(p => p.teacherId === teacher.id).length + seminars.filter(s => s.teacherId === teacher.id).length}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="neubrutalism-card p-6 bg-white h-64">
            <h3 className="text-xs font-black uppercase mb-4">Content Split</h3>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} innerRadius={40} outerRadius={60} paddingAngle={5} dataKey="value">
                  {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ border: '2px solid black', borderRadius: '0', boxShadow: '4px 4px 0px black' }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: 'bold' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Right Column: Detailed View */}
        <section className="lg:col-span-2">
          {selectedTeacher ? (
            <div className="neubrutalism-card p-8 bg-white min-h-[600px] animate-in slide-in-from-right-4 duration-300">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h2 className="text-2xl font-black mb-2">{selectedTeacher.name}</h2>
                  <p className="text-sm font-medium text-gray-500">{selectedTeacher.email}</p>
                </div>
                <button className="px-4 py-2 border-2 border-black text-xs font-black uppercase hover:bg-black hover:text-white transition-all">Generate Report</button>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="text-[10px] font-black text-gray-400 uppercase mb-1">Qualifications</div>
                  <div className="text-sm italic">{selectedTeacher.qualifications || 'No qualifications provided.'}</div>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="text-[10px] font-black text-gray-400 uppercase mb-1">Contact</div>
                  <div className="text-sm">{selectedTeacher.contactInfo || 'No contact info provided.'}</div>
                </div>
              </div>

              <h3 className="font-black border-b-2 border-black pb-2 mb-6">Activity Timeline</h3>
              
              <div className="space-y-6">
                {[...teacherPractices, ...teacherSeminars]
                  .sort((a, b) => {
                    const dateA = 'date' in a ? a.date : a.fromDate;
                    const dateB = 'date' in b ? b.date : b.fromDate;
                    return new Date(dateB).getTime() - new Date(dateA).getTime();
                  })
                  .map((item, idx) => (
                    <div key={idx} className="flex space-x-4 relative">
                      <div className="flex flex-col items-center">
                        <div className={`w-3 h-3 rounded-full mt-1.5 border-2 border-white ring-2 ring-black ${'date' in item ? 'bg-gray-400' : 'bg-black'}`}></div>
                        {idx !== (teacherPractices.length + teacherSeminars.length - 1) && <div className="w-0.5 flex-1 bg-black/10 my-1"></div>}
                      </div>
                      <div className="flex-1 pb-6">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-black text-gray-400">{'date' in item ? 'PRACTICE' : 'SEMINAR'} • {'date' in item ? item.date : `${item.fromDate} - ${item.toDate}`}</span>
                        </div>
                        <h4 className="font-bold mb-2">{item.title}</h4>
                        {item.proof?.extractedInfo && (
                          <div className="p-3 bg-white border-2 border-dashed border-gray-200 rounded text-xs leading-relaxed text-gray-600 italic">
                            <div className="text-[10px] font-black text-black uppercase mb-1 not-italic">AI Summary of PDF</div>
                            {item.proof.extractedInfo}
                          </div>
                        )}
                        <div className="mt-3 flex space-x-3">
                          <button className="text-[10px] font-black uppercase text-black hover:underline">View Proof</button>
                          <button className="text-[10px] font-black uppercase text-red-500 hover:underline">Flag Submission</button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>

              {(teacherPractices.length === 0 && teacherSeminars.length === 0) && (
                <div className="py-20 text-center text-gray-300 font-bold italic">No activity records found for this teacher.</div>
              )}
            </div>
          ) : (
            <div className="neubrutalism-card p-8 bg-white h-full flex flex-col items-center justify-center border-dashed border-gray-300 text-gray-300">
              <div className="text-6xl mb-4">👈</div>
              <div className="font-black text-xl italic uppercase">Select a teacher to view details</div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};
