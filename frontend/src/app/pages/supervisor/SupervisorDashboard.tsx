import React from 'react';
import { useData } from '../../context/DataContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Users, CheckCircle, Clock, AlertTriangle } from 'lucide-react';

const TEAM_PERFORMANCE_DATA = [
  { name: 'Mon', coded: 45, accuracy: 98 },
  { name: 'Tue', coded: 52, accuracy: 97 },
  { name: 'Wed', coded: 49, accuracy: 99 },
  { name: 'Thu', coded: 60, accuracy: 96 },
  { name: 'Fri', coded: 55, accuracy: 98 },
];

export const SupervisorDashboard = () => {
  const { records, auditLogs } = useData();

  const flaggedCount = records.filter(r => r.status === 'FLAGGED').length;
  const inReviewCount = records.filter(r => r.status === 'IN_REVIEW').length;

  const StatCard = ({ title, value, icon: Icon, color }: any) => (
    <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl shadow-sm border border-slate-200">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-slate-500 text-sm font-medium">{title}</h3>
        <div className={`p-2 rounded-lg ${color} bg-opacity-10`}>
          <Icon className={color.replace('bg-', 'text-')} size={18} />
        </div>
      </div>
      <p className="text-2xl font-bold text-slate-900">{value}</p>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard title="Team Accuracy" value="97.8%" icon={CheckCircle} color="bg-emerald-500" />
        <StatCard title="Review Backlog" value={inReviewCount} icon={Clock} color="bg-blue-500" />
        <StatCard title="Flagged Cases" value={flaggedCount} icon={AlertTriangle} color="bg-red-500" />
        <StatCard title="Active Coders" value="12" icon={Users} color="bg-indigo-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Productivity Chart */}
        <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="font-semibold text-slate-900 mb-6">Weekly Coding Volume</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={TEAM_PERFORMANCE_DATA}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                  cursor={{fill: '#f1f5f9'}}
                  contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                />
                <Bar dataKey="coded" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Accuracy Trend */}
        <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="font-semibold text-slate-900 mb-6">Accuracy Trend</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={TEAM_PERFORMANCE_DATA}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                <YAxis domain={[90, 100]} axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                   contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                />
                <Line type="monotone" dataKey="accuracy" stroke="#10b981" strokeWidth={3} dot={{r: 4, fill: '#10b981'}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Audits Table */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200">
          <h3 className="font-semibold text-slate-900">Recent System Activity</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Timestamp</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">User</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Role</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Action</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {auditLogs.slice(0, 5).map((log) => (
                <tr key={log.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 text-sm text-slate-600 font-mono">{log.timestamp}</td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-900">{log.user}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-600">
                      {log.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{log.action}</td>
                  <td className="px-6 py-4 text-sm text-slate-500 truncate max-w-xs">{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
