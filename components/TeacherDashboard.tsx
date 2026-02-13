
import React, { useState } from 'react';
import { User, Practice, Seminar, Proof } from '../types';
import { extractPdfContent } from '../services/gemini';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

interface TeacherDashboardProps {
  user: User;
  practices: Practice[];
  seminars: Seminar[];
  onUpdateProfile: (updates: Partial<User>) => void;
  onAddPractice: (practice: Practice) => void;
  onDeletePractice: (id: string) => void;
  onAddSeminar: (seminar: Seminar) => void;
  onDeleteSeminar: (id: string) => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ 
  user, practices, seminars, onUpdateProfile, onAddPractice, onDeletePractice, onAddSeminar, onDeleteSeminar 
}) => {
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [activeTab, setActiveTab] = useState<'practices' | 'seminars'>('practices');
  const [isUploading, setIsUploading] = useState(false);

  // Stats for charts
  const chartData = [
    { name: 'Mon', activities: 1 },
    { name: 'Tue', activities: 4 },
    { name: 'Wed', activities: practices.length },
    { name: 'Thu', activities: seminars.length },
    { name: 'Fri', activities: 2 },
    { name: 'Sat', activities: 0 },
    { name: 'Sun', activities: 1 },
  ];

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, type: 'practice' | 'seminar') => {
    const file = event.target.files?.[0];
    if (!file || file.type !== 'application/pdf') {
      alert('Please upload a PDF file only.');
      return;
    }

    setIsUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64 = (e.target?.result as string).split(',')[1];
        const extracted = await extractPdfContent(base64);
        
        const proof: Proof = {
          fileName: file.name,
          mimeType: file.type,
          data: base64,
          extractedInfo: extracted
        };

        if (type === 'practice') {
          onAddPractice({
            id: Date.now().toString(),
            teacherId: user.id,
            title: `Practice - ${file.name}`,
            description: 'Uploaded via proof document',
            date: new Date().toISOString().split('T')[0],
            proof
          });
        } else {
          onAddSeminar({
            id: Date.now().toString(),
            teacherId: user.id,
            title: `Seminar - ${file.name}`,
            description: 'Uploaded via proof document',
            fromDate: new Date().toISOString().split('T')[0],
            toDate: new Date().toISOString().split('T')[0],
            proof
          });
        }
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error(err);
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Profile Section */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 neubrutalism-card p-6 bg-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gray-50 -mr-8 -mt-8 rounded-full border-2 border-black -z-0 opacity-50"></div>
          <div className="relative z-10">
            <div className="w-20 h-20 bg-black border-4 border-white shadow-lg rounded-xl mb-4 flex items-center justify-center text-white text-3xl font-black">
              {user.name.charAt(0)}
            </div>
            {isEditingProfile ? (
              <form onSubmit={(e) => { e.preventDefault(); setIsEditingProfile(false); }} className="space-y-3">
                <input 
                  type="text" 
                  value={user.name} 
                  onChange={(e) => onUpdateProfile({ name: e.target.value })}
                  className="w-full border-2 border-black p-2 rounded text-sm font-bold"
                />
                <input 
                  type="text" 
                  placeholder="Contact Info"
                  value={user.contactInfo || ''} 
                  onChange={(e) => onUpdateProfile({ contactInfo: e.target.value })}
                  className="w-full border-2 border-black p-2 rounded text-sm"
                />
                <textarea 
                  placeholder="Qualifications"
                  value={user.qualifications || ''} 
                  onChange={(e) => onUpdateProfile({ qualifications: e.target.value })}
                  className="w-full border-2 border-black p-2 rounded text-sm h-24"
                />
                <button type="submit" className="w-full bg-black text-white py-2 rounded font-bold text-sm">Save Profile</button>
              </form>
            ) : (
              <>
                <h2 className="text-xl font-black mb-1">{user.name}</h2>
                <p className="text-sm text-gray-500 mb-4">{user.email}</p>
                <div className="space-y-2 mb-6">
                  <div className="text-xs font-bold uppercase text-gray-400">Qualifications</div>
                  <div className="text-sm italic">{user.qualifications || 'No qualifications listed.'}</div>
                  <div className="text-xs font-bold uppercase text-gray-400 mt-4">Contact</div>
                  <div className="text-sm">{user.contactInfo || 'No contact info listed.'}</div>
                </div>
                <button 
                  onClick={() => setIsEditingProfile(true)}
                  className="px-4 py-2 border-2 border-black text-xs font-black uppercase tracking-tighter hover:bg-black hover:text-white transition-all"
                >
                  Edit Profile
                </button>
              </>
            )}
          </div>
        </div>

        {/* Chart Section */}
        <div className="lg:col-span-2 neubrutalism-card p-6 bg-white flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-black text-lg">Activity Analytics</h3>
            <div className="flex space-x-2">
              <span className="w-3 h-3 bg-black rounded-full"></span>
              <span className="text-[10px] font-bold uppercase">Weekly Submissions</span>
            </div>
          </div>
          <div className="flex-1 min-h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorAct" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#000" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#000" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700 }} />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ border: '2px solid black', borderRadius: '0', boxShadow: '4px 4px 0px black' }}
                  itemStyle={{ color: 'black', fontWeight: 800 }}
                />
                <Area type="monotone" dataKey="activities" stroke="#000" strokeWidth={3} fillOpacity={1} fill="url(#colorAct)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* Activities Management */}
      <section className="neubrutalism-card bg-white p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex space-x-6">
            <button 
              onClick={() => setActiveTab('practices')}
              className={`text-xl font-black pb-2 border-b-4 transition-all ${activeTab === 'practices' ? 'border-black' : 'border-transparent text-gray-300'}`}
            >
              Practices
            </button>
            <button 
              onClick={() => setActiveTab('seminars')}
              className={`text-xl font-black pb-2 border-b-4 transition-all ${activeTab === 'seminars' ? 'border-black' : 'border-transparent text-gray-300'}`}
            >
              Seminars
            </button>
          </div>
          
          <div className="flex items-center space-x-2">
            <label className={`cursor-pointer bg-black text-white px-6 py-3 rounded-lg font-black text-xs uppercase tracking-widest shadow-[4px_4px_0px_rgba(0,0,0,0.2)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
              {isUploading ? 'Analyzing PDF...' : `Add ${activeTab === 'practices' ? 'Practice' : 'Seminar'} (PDF)`}
              <input 
                type="file" 
                accept=".pdf" 
                onChange={(e) => handleFileUpload(e, activeTab === 'practices' ? 'practice' : 'seminar')} 
                className="hidden" 
                disabled={isUploading}
              />
            </label>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeTab === 'practices' ? (
            practices.length === 0 ? (
              <div className="col-span-full py-20 text-center border-2 border-dashed border-gray-200 rounded-xl text-gray-400 font-bold italic">
                No practices uploaded yet.
              </div>
            ) : (
              practices.map(p => (
                <div key={p.id} className="neubrutalism-card p-6 border-black hover:bg-gray-50 group">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-xl">📄</div>
                    <button onClick={() => onDeletePractice(p.id)} className="text-gray-300 hover:text-red-500 font-black">✕</button>
                  </div>
                  <h4 className="font-black text-lg mb-2 truncate" title={p.title}>{p.title}</h4>
                  <p className="text-xs text-gray-500 mb-4 font-bold">{p.date}</p>
                  <div className="bg-white border border-gray-100 p-3 rounded text-[11px] leading-relaxed mb-4 line-clamp-3">
                    {p.proof?.extractedInfo || 'No extraction available.'}
                  </div>
                  <button className="text-[10px] font-black uppercase tracking-widest border-b-2 border-black">View Document</button>
                </div>
              ))
            )
          ) : (
            seminars.length === 0 ? (
              <div className="col-span-full py-20 text-center border-2 border-dashed border-gray-200 rounded-xl text-gray-400 font-bold italic">
                No seminars recorded yet.
              </div>
            ) : (
              seminars.map(s => (
                <div key={s.id} className="neubrutalism-card p-6 border-black hover:bg-gray-50 group">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-10 h-10 bg-black text-white rounded-lg flex items-center justify-center text-xl">🗓️</div>
                    <button onClick={() => onDeleteSeminar(s.id)} className="text-gray-300 hover:text-red-500 font-black">✕</button>
                  </div>
                  <h4 className="font-black text-lg mb-2 truncate" title={s.title}>{s.title}</h4>
                  <div className="flex items-center space-x-2 text-[10px] font-bold text-gray-400 mb-4">
                    <span>{s.fromDate}</span>
                    <span>→</span>
                    <span>{s.toDate}</span>
                  </div>
                  <div className="bg-white border border-gray-100 p-3 rounded text-[11px] leading-relaxed mb-4 line-clamp-3">
                    {s.proof?.extractedInfo || 'No extraction available.'}
                  </div>
                  <button className="text-[10px] font-black uppercase tracking-widest border-b-2 border-black">View Document</button>
                </div>
              ))
            )
          )}
        </div>
      </section>
    </div>
  );
};
