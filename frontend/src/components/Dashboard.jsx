import React, { useState } from 'react';

export default function Dashboard() {
  const [date, setDate] = useState('');
  const [session, setSession] = useState('Session A (09.00 AM to 12.00 Noon)');
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!date) return alert('Please select an examination date.');
    setLoading(true);
    setError('');
    
    try {
      const res = await fetch('[https://nith-backend.onrender.com/api/assign](https://nith-backend.onrender.com/api/assign)', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date, session })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to generate schedule');
      
      setSchedule(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f7f6] font-sans text-gray-900" style={{ colorScheme: 'light' }}>
      
      {/* Official NITH Header */}
      <header className="bg-[#0f2c59] text-white shadow-lg border-b-4 border-orange-500">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col md:flex-row items-center md:items-start gap-4">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-[#0f2c59] font-black text-2xl shadow-inner border-2 border-gray-200">
            NIT
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-2xl md:text-3xl font-bold tracking-wide">National Institute of Technology Hamirpur</h1>
            <p className="text-blue-200 text-sm md:text-base font-medium mt-1">Office of Dean (Academic) | End-Semester Invigilation System</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        
        <div className="mb-6 border-b border-gray-300 pb-4">
          <h2 className="text-3xl font-extrabold text-[#0f2c59]">Duty Assignment Scheduler</h2>
          <p className="text-gray-600 mt-2 font-medium">Automatically assign I1, I2, and I3 staff to examination rooms without conflicts.</p>
        </div>

        {/* Control Panel Card */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mb-8">
          <div className="flex flex-col md:flex-row gap-6 items-end">
            <div className="flex-1 w-full">
              <label className="block text-sm font-bold text-[#0f2c59] mb-2 uppercase tracking-wide">Examination Date</label>
              <input 
                type="date" 
                className="w-full border-2 border-gray-300 rounded p-3 text-gray-800 font-medium focus:border-[#0f2c59] focus:ring-0 outline-none transition-colors bg-gray-50"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            
            <div className="flex-1 w-full">
              <label className="block text-sm font-bold text-[#0f2c59] mb-2 uppercase tracking-wide">Examination Session</label>
              <select 
                className="w-full border-2 border-gray-300 rounded p-3 text-gray-800 font-medium focus:border-[#0f2c59] focus:ring-0 outline-none transition-colors bg-gray-50"
                value={session}
                onChange={(e) => setSession(e.target.value)}
              >
                <option>Session A (09.00 AM to 12.00 Noon)</option>
                <option>Session B (01.30 PM to 04.30 PM)</option>
              </select>
            </div>
            
            <button 
              onClick={handleGenerate}
              disabled={loading}
              className="bg-[#0f2c59] hover:bg-blue-900 text-white font-bold py-3 px-8 rounded shadow-md transition-colors w-full md:w-auto disabled:opacity-70 text-lg"
            >
              {loading ? 'Processing...' : 'Generate Duty Chart'}
            </button>
          </div>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="bg-red-100 border-l-4 border-red-600 p-4 rounded mb-8 shadow-sm">
            <h3 className="text-red-900 font-bold text-lg">Generation Failed</h3>
            <p className="text-red-800 font-medium">{error}</p>
          </div>
        )}

        {/* Results Table Card */}
        {schedule.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
            
            {/* Table Header / Export Bar */}
            <div className="bg-[#e9eff7] px-6 py-4 border-b border-gray-300 flex flex-col md:flex-row justify-between items-center gap-4">
              <div>
                <h3 className="text-xl font-black text-[#0f2c59]">Official Duty Chart</h3>
                <p className="text-md text-[#0f2c59] font-semibold opacity-80">{date} | {session}</p>
              </div>
              <button 
                onClick={() => window.print()}
                className="bg-white border-2 border-[#0f2c59] text-[#0f2c59] hover:bg-[#0f2c59] hover:text-white font-bold py-2 px-6 rounded transition-colors"
              >
                🖨️ Print / Save PDF
              </button>
            </div>

            {/* The Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-100 text-[#0f2c59] border-b-2 border-gray-300">
                    <th className="p-4 font-bold text-lg">Room No.</th>
                    <th className="p-4 font-bold text-lg">Type & Capacity</th>
                    <th className="p-4 font-bold text-lg">Assigned Invigilator</th>
                    <th className="p-4 font-bold text-lg">Faculty Type</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {schedule.map((task) => (
                    <tr key={task._id} className="hover:bg-blue-50 transition-colors">
                      <td className="p-4 font-black text-[#0f2c59] text-lg">{task.room.name}</td>
                      <td className="p-4">
                        {task.room.isBigHall ? 
                          <span className="bg-purple-100 text-purple-900 px-3 py-1.5 rounded text-sm font-bold border border-purple-300 shadow-sm">
                            Big Hall ({task.room.capacity})
                          </span> : 
                          <span className="bg-green-100 text-green-900 px-3 py-1.5 rounded text-sm font-bold border border-green-300 shadow-sm">
                            Standard ({task.room.capacity})
                          </span>
                        }
                      </td>
                      <td className="p-4 font-bold text-gray-800 text-md">
                        {task.invigilators.map(inv => inv.name).join(', ')}
                      </td>
                      <td className="p-4">
                        {task.invigilators.map(inv => (
                          <span 
                            key={inv._id} 
                            className={`inline-block px-3 py-1.5 rounded shadow-sm text-sm font-bold border ${
                              inv.type === 'I3' ? 'bg-indigo-600 text-white border-indigo-700' : 
                              inv.type === 'I2' ? 'bg-blue-600 text-white border-blue-700' : 
                              'bg-teal-600 text-white border-teal-700'
                            }`}
                          >
                            {inv.type}
                          </span>
                        ))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}