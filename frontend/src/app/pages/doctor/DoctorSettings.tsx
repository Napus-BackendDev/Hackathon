import React, { useState } from 'react';
import { 
  Bell, 
  Lock, 
  User, 
  Monitor, 
  Moon, 
  Globe, 
  Shield, 
  Smartphone,
  Check
} from 'lucide-react';
import { toast } from 'sonner';

export const DoctorSettings = () => {
  const [activeTab, setActiveTab] = useState('account');
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    weeklyDigest: false,
    urgentAlerts: true
  });

  const handleSave = () => {
    toast.success("Settings saved successfully");
  };

  const TabButton = ({ id, label, icon: Icon }: { id: string, label: string, icon: any }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
        activeTab === id 
          ? 'bg-teal-500/10 text-teal-400 border border-teal-500/20' 
          : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
      }`}
    >
      <Icon size={18} />
      {label}
    </button>
  );

  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Settings</h1>
          <p className="text-slate-400 text-sm">Manage your account preferences and system configurations.</p>
        </div>
        <button 
          onClick={handleSave}
          className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white text-sm font-bold rounded-lg shadow-lg shadow-teal-900/20 transition-all flex items-center gap-2"
        >
          <Check size={16} />
          Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar Tabs */}
        <div className="col-span-1 space-y-2">
          <TabButton id="account" label="Account" icon={User} />
          <TabButton id="notifications" label="Notifications" icon={Bell} />
          <TabButton id="security" label="Security" icon={Shield} />
          <TabButton id="appearance" label="Appearance" icon={Monitor} />
        </div>

        {/* Content Area */}
        <div className="col-span-3 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 min-h-[500px]">
          {activeTab === 'account' && (
            <div className="space-y-8">
              <div className="flex items-center gap-6">
                 <div className="relative">
                    <img 
                      src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=2340&auto=format&fit=crop" 
                      alt="Profile" 
                      className="w-24 h-24 rounded-full object-cover ring-4 ring-slate-700"
                    />
                    <button className="absolute bottom-0 right-0 p-2 bg-slate-800 border border-slate-600 rounded-full text-white hover:bg-slate-700 transition-colors">
                      <User size={14} />
                    </button>
                 </div>
                 <div>
                    <h3 className="text-xl font-bold text-white">Dr. Sarah Jenkins</h3>
                    <p className="text-slate-400 text-sm mb-2">Chief of Cardiology</p>
                    <div className="flex gap-2">
                       <span className="px-2 py-1 bg-teal-500/10 text-teal-400 text-xs font-bold rounded border border-teal-500/20">Provider ID: 882910</span>
                       <span className="px-2 py-1 bg-slate-700 text-slate-300 text-xs font-bold rounded border border-slate-600">NPI: 10938472</span>
                    </div>
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                   <label className="text-xs font-bold text-slate-500 uppercase">Full Name</label>
                   <input type="text" defaultValue="Sarah Jenkins" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white text-sm focus:ring-2 focus:ring-teal-500/50 outline-none" />
                </div>
                <div className="space-y-2">
                   <label className="text-xs font-bold text-slate-500 uppercase">Email Address</label>
                   <input type="email" defaultValue="sarah.jenkins@nextmed.org" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white text-sm focus:ring-2 focus:ring-teal-500/50 outline-none" />
                </div>
                <div className="space-y-2">
                   <label className="text-xs font-bold text-slate-500 uppercase">Phone Number</label>
                   <input type="tel" defaultValue="+1 (555) 123-4567" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white text-sm focus:ring-2 focus:ring-teal-500/50 outline-none" />
                </div>
                <div className="space-y-2">
                   <label className="text-xs font-bold text-slate-500 uppercase">Department</label>
                   <input type="text" defaultValue="Cardiology" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white text-sm focus:ring-2 focus:ring-teal-500/50 outline-none" />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6">
               <h3 className="text-lg font-bold text-white mb-4">Notification Preferences</h3>
               
               <div className="space-y-4">
                  {[
                    { id: 'email', label: 'Email Notifications', desc: 'Receive daily summaries and critical alerts via email.' },
                    { id: 'push', label: 'Push Notifications', desc: 'Real-time alerts on your mobile device and desktop.' },
                    { id: 'urgentAlerts', label: 'Urgent Clinical Alerts', desc: 'Immediate notification for high-priority patient updates.' },
                    { id: 'weeklyDigest', label: 'Weekly Analytics Digest', desc: 'A summary of your coding efficiency and performance.' }
                  ].map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
                       <div>
                          <h4 className="text-sm font-bold text-white">{item.label}</h4>
                          <p className="text-xs text-slate-500">{item.desc}</p>
                       </div>
                       <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" checked={notifications[item.id as keyof typeof notifications]} onChange={() => setNotifications({...notifications, [item.id]: !notifications[item.id as keyof typeof notifications]})} />
                          <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-teal-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-slate-800 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-800/50 backdrop-blur-sm after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-500"></div>
                       </label>
                    </div>
                  ))}
               </div>
            </div>
          )}

          {activeTab === 'appearance' && (
             <div className="space-y-6">
                <h3 className="text-lg font-bold text-white mb-4">Interface Customization</h3>
                
                <div className="grid grid-cols-3 gap-4">
                   <div className="p-4 rounded-xl border-2 border-teal-500 bg-slate-800 relative cursor-pointer">
                      <div className="absolute top-2 right-2 text-teal-500"><Check size={16} /></div>
                      <Moon className="text-teal-400 mb-2" size={24} />
                      <h4 className="text-sm font-bold text-white">Dark Mode</h4>
                      <p className="text-xs text-slate-400 mt-1">High contrast dark theme (Active)</p>
                   </div>
                   <div className="p-4 rounded-xl border border-slate-700 bg-slate-900 opacity-50 cursor-not-allowed">
                      <Globe className="text-slate-500 mb-2" size={24} />
                      <h4 className="text-sm font-bold text-slate-400">Light Mode</h4>
                      <p className="text-xs text-slate-500 mt-1">Classic brightness</p>
                   </div>
                   <div className="p-4 rounded-xl border border-slate-700 bg-slate-900 opacity-50 cursor-not-allowed">
                      <Monitor className="text-slate-500 mb-2" size={24} />
                      <h4 className="text-sm font-bold text-slate-400">System Sync</h4>
                      <p className="text-xs text-slate-500 mt-1">Match OS settings</p>
                   </div>
                </div>

                <div className="mt-8">
                   <h4 className="text-sm font-bold text-white mb-3">Density</h4>
                   <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                         <input type="radio" name="density" className="text-teal-500 focus:ring-teal-500" defaultChecked />
                         <span className="text-sm text-slate-300">Comfortable</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                         <input type="radio" name="density" className="text-teal-500 focus:ring-teal-500" />
                         <span className="text-sm text-slate-300">Compact</span>
                      </label>
                   </div>
                </div>
             </div>
          )}

          {activeTab === 'security' && (
             <div className="space-y-6">
                <h3 className="text-lg font-bold text-white mb-4">Security & Privacy</h3>
                
                <div className="p-4 bg-teal-500/5 border border-teal-500/20 rounded-xl flex items-start gap-3">
                   <Shield className="text-teal-400 shrink-0 mt-0.5" size={20} />
                   <div>
                      <h4 className="text-sm font-bold text-teal-100">HIPAA Compliance Active</h4>
                      <p className="text-xs text-teal-200/70 mt-1">Your session is encrypted and audited. Last audit: Today, 10:42 AM</p>
                   </div>
                </div>

                <div className="mt-6 space-y-4">
                   <button className="w-full flex items-center justify-between p-4 bg-slate-900/50 hover:bg-slate-900 border border-slate-700 rounded-xl transition-colors text-left group">
                      <div>
                         <h4 className="text-sm font-bold text-white group-hover:text-teal-400 transition-colors">Change Password</h4>
                         <p className="text-xs text-slate-500">Last changed 30 days ago</p>
                      </div>
                      <Lock size={16} className="text-slate-500 group-hover:text-teal-400" />
                   </button>
                   
                   <button className="w-full flex items-center justify-between p-4 bg-slate-900/50 hover:bg-slate-900 border border-slate-700 rounded-xl transition-colors text-left group">
                      <div>
                         <h4 className="text-sm font-bold text-white group-hover:text-teal-400 transition-colors">Two-Factor Authentication</h4>
                         <p className="text-xs text-slate-500">Enabled (SMS + Authenticator)</p>
                      </div>
                      <Smartphone size={16} className="text-slate-500 group-hover:text-teal-400" />
                   </button>
                </div>
             </div>
          )}

        </div>
      </div>
    </div>
  );
};
