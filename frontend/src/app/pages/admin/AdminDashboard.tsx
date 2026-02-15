import React from 'react';
import { User, Shield, Lock, MoreHorizontal } from 'lucide-react';

const MOCK_USERS_LIST = [
  { id: 1, name: 'Sarah Chen', email: 'sarah.c@medicode.ai', role: 'CODER', status: 'Active', lastActive: '2 mins ago' },
  { id: 2, name: 'Dr. Marcus Reynolds', email: 'm.reynolds@medicode.ai', role: 'SUPERVISOR', status: 'Active', lastActive: '1 hour ago' },
  { id: 3, name: 'System Admin', email: 'admin@medicode.ai', role: 'ADMIN', status: 'Active', lastActive: 'Now' },
  { id: 4, name: 'Jessica Wu', email: 'j.wu@medicode.ai', role: 'CODER', status: 'Inactive', lastActive: '2 days ago' },
];

export const AdminDashboard = () => {
  return (
    <div className="space-y-6">
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl shadow-sm border border-slate-700/50 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-white">User Management</h2>
          <button className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-700 transition-colors flex items-center gap-2">
             <User size={16} />
             Add User
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-700/30 border-b border-slate-700/50">
              <tr>
                <th className="px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Last Active</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {MOCK_USERS_LIST.map((user) => (
                <tr key={user.id} className="hover:bg-slate-700/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-slate-400 text-xs font-bold ring-2 ring-slate-800">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium text-white">{user.name}</div>
                        <div className="text-xs text-slate-400">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                     <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold 
                       ${user.role === 'ADMIN' ? 'bg-slate-700 text-white' : 
                         user.role === 'SUPERVISOR' ? 'bg-teal-100 text-teal-800' : 
                         'bg-emerald-100 text-emerald-800'}`}>
                       {user.role}
                     </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 text-sm font-medium
                      ${user.status === 'Active' ? 'text-emerald-600' : 'text-slate-500'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${user.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-600'}`} />
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-400">{user.lastActive}</td>
                  <td className="px-6 py-4">
                    <button className="text-slate-500 hover:text-slate-400 p-1">
                      <MoreHorizontal size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl shadow-sm border border-slate-700/50 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-teal-50 text-teal-600 rounded-lg">
              <Shield size={20} />
            </div>
            <h3 className="font-semibold text-white">Security Policies</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
               <span className="text-sm font-medium text-slate-300">Two-Factor Authentication</span>
               <div className="w-10 h-5 bg-teal-600 rounded-full relative cursor-pointer">
                 <div className="absolute right-1 top-1 w-3 h-3 bg-slate-800/50 backdrop-blur-sm rounded-full shadow-sm" />
               </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
               <span className="text-sm font-medium text-slate-300">Session Timeout (15m)</span>
               <div className="w-10 h-5 bg-teal-600 rounded-full relative cursor-pointer">
                 <div className="absolute right-1 top-1 w-3 h-3 bg-slate-800/50 backdrop-blur-sm rounded-full shadow-sm" />
               </div>
            </div>
             <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
               <span className="text-sm font-medium text-slate-300">IP Whitelisting</span>
               <div className="w-10 h-5 bg-slate-600 rounded-full relative cursor-pointer">
                 <div className="absolute left-1 top-1 w-3 h-3 bg-slate-800/50 backdrop-blur-sm rounded-full shadow-sm" />
               </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl shadow-sm border border-slate-700/50 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-amber-100 text-amber-600 rounded-lg">
              <Lock size={20} />
            </div>
            <h3 className="font-semibold text-white">System Configuration</h3>
          </div>
          <div className="space-y-4">
            <div className="border border-slate-700/50 rounded-lg p-4">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">AI Confidence Threshold</label>
              <div className="flex items-center gap-4">
                <input type="range" className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-teal-600" min="0" max="100" defaultValue="85" />
                <span className="text-sm font-bold text-white">85%</span>
              </div>
              <p className="text-xs text-slate-400 mt-2">Codes below this score require manual review.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
