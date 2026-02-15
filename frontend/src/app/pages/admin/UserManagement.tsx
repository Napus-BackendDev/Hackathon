import React, { useState } from 'react';
import { 
  User, 
  Search, 
  Filter, 
  MoreVertical, 
  Plus, 
  Shield, 
  Mail, 
  Clock, 
  CheckCircle, 
  XCircle,
  Edit2,
  Trash2
} from 'lucide-react';
import { toast } from 'sonner';

interface UserData {
  id: number;
  name: string;
  email: string;
  role: 'ADMIN' | 'SUPERVISOR' | 'CODER' | 'DOCTOR';
  status: 'Active' | 'Inactive' | 'Suspended';
  lastActive: string;
  department: string;
}

const MOCK_USERS: UserData[] = [
  { id: 1, name: 'Sarah Chen', email: 'sarah.c@medicode.ai', role: 'CODER', status: 'Active', lastActive: '2 mins ago', department: 'Cardiology Coding' },
  { id: 2, name: 'Dr. Marcus Reynolds', email: 'm.reynolds@medicode.ai', role: 'SUPERVISOR', status: 'Active', lastActive: '1 hour ago', department: 'Audit & Compliance' },
  { id: 3, name: 'System Admin', email: 'admin@medicode.ai', role: 'ADMIN', status: 'Active', lastActive: 'Now', department: 'IT Operations' },
  { id: 4, name: 'Jessica Wu', email: 'j.wu@medicode.ai', role: 'CODER', status: 'Inactive', lastActive: '2 days ago', department: 'Pediatrics Coding' },
  { id: 5, name: 'Dr. James Wilson', email: 'j.wilson@hospital.org', role: 'DOCTOR', status: 'Active', lastActive: '5 hours ago', department: 'Emergency Medicine' },
  { id: 6, name: 'Emily Davis', email: 'e.davis@medicode.ai', role: 'CODER', status: 'Suspended', lastActive: '1 week ago', department: 'Orthopedics' },
];

export const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<string>('All');
  const [users, setUsers] = useState(MOCK_USERS);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'All' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'bg-slate-700 text-white border-gray-700';
      case 'SUPERVISOR': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'CODER': return 'bg-teal-100 text-teal-700 border-teal-200';
      case 'DOCTOR': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-slate-700/50 text-slate-300 border-slate-700/50';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'text-emerald-600 bg-emerald-50 border-emerald-100';
      case 'Inactive': return 'text-slate-400 bg-slate-700/30 border-slate-700/50';
      case 'Suspended': return 'text-red-600 bg-red-50 border-red-100';
      default: return 'text-slate-400';
    }
  };

  const handleAddUser = () => {
    toast.success('Add User modal would open here');
  };

  const handleDeleteUser = (id: number) => {
    if (window.confirm('Are you sure you want to deactivate this user?')) {
      setUsers(users.map(u => u.id === id ? { ...u, status: 'Inactive' } : u));
      toast.success('User deactivated successfully');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">User Management</h1>
          <p className="text-slate-400 text-sm mt-1">Manage access, roles, and permissions for the organization.</p>
        </div>
        <button 
          onClick={handleAddUser}
          className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 shadow-sm transition-colors"
        >
          <Plus size={18} />
          <span>Add New User</span>
        </button>
      </div>

      {/* Filters & Search */}
      <div className="bg-slate-800/50 backdrop-blur-sm p-4 rounded-xl shadow-sm border border-slate-700/50 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500" size={18} />
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full pl-10 pr-4 py-2 border border-slate-700/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
          />
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto">
          <Filter size={16} className="text-slate-500 flex-shrink-0" />
          <span className="text-sm font-medium text-slate-400 mr-2">Role:</span>
          {['All', 'ADMIN', 'SUPERVISOR', 'CODER', 'DOCTOR'].map((role) => (
            <button
              key={role}
              onClick={() => setFilterRole(role)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors border ${
                filterRole === role 
                  ? 'bg-teal-50 text-teal-700 border-teal-200' 
                  : 'bg-slate-800/50 backdrop-blur-sm text-slate-400 border-slate-700/50 hover:bg-slate-700/30'
              }`}
            >
              {role === 'All' ? 'All Users' : role.charAt(0) + role.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl shadow-sm border border-slate-700/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-700/30 border-b border-slate-700/50">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">User Identity</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Role & Dept</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Last Active</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-700/30/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-slate-400 font-bold ring-2 ring-slate-800 shadow-sm">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-semibold text-white">{user.name}</div>
                          <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5">
                            <Mail size={12} />
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col items-start gap-1">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold border ${getRoleBadgeColor(user.role)}`}>
                          {user.role}
                        </span>
                        <span className="text-xs text-slate-400">{user.department}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(user.status)}`}>
                        {user.status === 'Active' ? <CheckCircle size={12} /> : user.status === 'Inactive' ? <Clock size={12} /> : <XCircle size={12} />}
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-slate-400">{user.lastActive}</div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-1.5 text-slate-500 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors" title="Edit User">
                          <Edit2 size={16} />
                        </button>
                        <button 
                          className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" 
                          title="Deactivate User"
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          <Trash2 size={16} />
                        </button>
                        <button className="p-1.5 text-slate-500 hover:text-slate-400 hover:bg-slate-700/50 rounded-lg transition-colors">
                          <MoreVertical size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center">
                      <Search size={32} className="text-slate-400 mb-2" />
                      <p className="text-sm">No users found matching your search.</p>
                      <button 
                        onClick={() => { setSearchTerm(''); setFilterRole('All'); }}
                        className="mt-2 text-teal-600 text-sm font-medium hover:underline"
                      >
                        Clear filters
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Footer */}
        <div className="bg-slate-700/30 px-6 py-4 border-t border-slate-700/50 flex items-center justify-between">
           <span className="text-sm text-slate-400">Showing <span className="font-medium text-white">{filteredUsers.length}</span> users</span>
           <div className="flex gap-2">
             <button className="px-3 py-1 text-sm bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded text-slate-500 cursor-not-allowed">Previous</button>
             <button className="px-3 py-1 text-sm bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded text-slate-400 hover:bg-slate-700/30">Next</button>
           </div>
        </div>
      </div>
    </div>
  );
};
