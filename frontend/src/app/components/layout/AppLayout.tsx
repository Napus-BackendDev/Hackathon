import React from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  CheckCircle,
  Users,
  Settings,
  LogOut,
  Search,
  Activity,
  ClipboardList,
  CreditCard,
  Calculator,
  Bell,
  Sparkles
} from 'lucide-react';
import { clsx } from 'clsx';
import { motion } from 'motion/react';
import { Logo } from '../brand/Logo';

export const AppLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Detect role from URL path
  const getRoleFromPath = (): 'CODER' | 'DOCTOR' | 'PATIENT' => {
    if (location.pathname.startsWith('/coder')) return 'CODER';
    if (location.pathname.startsWith('/doctor')) return 'DOCTOR';
    if (location.pathname.startsWith('/patient')) return 'PATIENT';
    return 'DOCTOR'; // Default
  };

  const role = getRoleFromPath();

  const getUserInfo = () => {
    switch (role) {
      case 'CODER':
        return { name: 'Medical Coder', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=coder', role: 'CODER' };
      case 'DOCTOR':
        return { name: 'Dr. Smith', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=doctor', role: 'DOCTOR' };
      case 'PATIENT':
        return { name: 'John Patient', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=patient', role: 'PATIENT' };
    }
  };

  const user = getUserInfo();

  const NavItem = ({ to, icon: Icon, label, highlight = false }: { to: string, icon: any, label: string, highlight?: boolean }) => {
    const isActive = location.pathname.startsWith(to);
    return (
      <button
        onClick={() => navigate(to)}
        className={clsx(
          "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 group relative overflow-hidden",
          isActive 
            ? "bg-teal-500/10 text-teal-400 border border-teal-500/20 shadow-[0_0_15px_rgba(20,184,166,0.1)]" 
            : highlight 
                ? "text-slate-300 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/30 hover:border-indigo-400/50" 
                : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 hover:border hover:border-slate-700 border border-transparent"
        )}
      >
        {isActive && (
          <motion.div
            layoutId="activeNavIndicator"
            className="absolute left-0 top-0 bottom-0 w-1 bg-teal-500 rounded-r-full shadow-[0_0_10px_#14b8a6]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        )}
        
        {highlight && !isActive && (
           <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 animate-pulse" />
        )}

        <Icon size={18} className={clsx("transition-colors duration-200 relative z-10", isActive ? "text-teal-400" : highlight ? "text-indigo-400" : "text-slate-500 group-hover:text-slate-300")} />
        <span className={clsx("relative z-10", highlight && !isActive && "text-indigo-300 font-bold")}>{label}</span>
      </button>
    );
  };

  const getNavItems = () => {
    switch (role) {
      case 'CODER':
        return (
          <>
            <div className="px-4 mb-2 text-xs font-bold text-slate-500 uppercase tracking-widest">Workspace</div>
            <NavItem to="/coder/dashboard" icon={LayoutDashboard} label="Dashboard" />
            <NavItem to="/coder/records" icon={FileText} label="Patient Records" />
            <NavItem to="/coder/calculation" icon={Calculator} label="Coding Calculator" />

            <div className="mt-8 px-4 mb-2 text-xs font-bold text-slate-500 uppercase tracking-widest">Administration</div>
            <NavItem to="/coder/admin/users" icon={Users} label="User Management" />
            <NavItem to="/coder/admin/config" icon={Settings} label="System Config" />
            <NavItem to="/coder/admin/logs" icon={Search} label="Security Logs" />
          </>
        );
      case 'DOCTOR':
        return (
          <>
            <div className="px-4 mb-2 text-xs font-bold text-slate-500 uppercase tracking-widest">Clinical</div>
            <NavItem to="/doctor/dashboard" icon={LayoutDashboard} label="Overview" />
            <NavItem to="/doctor/notes" icon={ClipboardList} label="My Notes" />
            <NavItem to="/doctor/patients" icon={Users} label="My Patients" />

            <div className="mt-8 px-4 mb-2 text-xs font-bold text-slate-500 uppercase tracking-widest">Account</div>
            <NavItem to="/doctor/settings" icon={Settings} label="Settings" />
          </>
        );
      case 'PATIENT':
        return (
          <>
            <div className="px-4 mb-2 text-xs font-bold text-slate-500 uppercase tracking-widest">My Health</div>
            <NavItem to="/patient/dashboard" icon={Activity} label="Overview" />
            <NavItem to="/patient/records" icon={FileText} label="Medical Records" />
            <NavItem to="/patient/billing" icon={CreditCard} label="Billing" />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-slate-900 font-sans overflow-hidden">
      {/* Sidebar - Slides in from left */}
      <motion.aside 
        initial={{ x: -300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-64 bg-slate-950 border-r border-slate-800 flex flex-col z-20 shadow-xl relative"
      >
        <div className="p-6 flex items-center gap-3 border-b border-slate-800/50 relative overflow-hidden group cursor-pointer" onClick={() => navigate('/')}>
          <motion.div
            initial={{ scale: 0.8, opacity: 0, rotate: -10 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            whileHover={{ rotate: 5, scale: 1.05 }}
            className="relative z-10"
          >
            <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center shadow-lg shadow-teal-900/20">
              <Activity className="text-teal-500" size={20} />
            </div>
          </motion.div>
          
          <div className="flex flex-col justify-center relative z-10">
            <motion.div 
              className="flex items-baseline leading-none"
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.4 }}
            >
              <span className="font-extrabold text-2xl text-white tracking-tight">Next</span>
              <span className="font-extrabold text-2xl text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400 tracking-tight">Med</span>
            </motion.div>
            
            <motion.div 
               className="flex items-center gap-1 mt-1"
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               transition={{ delay: 0.4 }}
            >
               <motion.div 
                 className="h-1 w-1 rounded-full bg-teal-400 shadow-[0_0_5px_#2dd4bf]"
                 animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                 transition={{ repeat: Infinity, duration: 2 }}
               />
               <span className="text-[10px] font-bold text-slate-500 tracking-widest uppercase">Intelligent</span>
            </motion.div>
          </div>
          
          {/* Animated Background Gradient Blob */}
          <motion.div 
            className="absolute -right-8 -top-8 w-24 h-24 bg-teal-500/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" 
            initial={false}
          />
        </div>

        <div className="flex-1 py-6 space-y-1 overflow-y-auto px-2 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
          {getNavItems()}
        </div>

        <div className="p-4 border-t border-slate-800 bg-slate-900/50 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-4 px-2 group">
            <div className="relative">
               <img src={user?.avatar} alt="User" className="w-9 h-9 rounded-full object-cover ring-2 ring-slate-700 shadow-sm transition-transform group-hover:scale-105" />
               <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-slate-900 rounded-full shadow-[0_0_5px_#10b981]"></div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-200 truncate group-hover:text-teal-400 transition-colors">{user?.name}</p>
              <p className="text-xs text-slate-500 truncate capitalize font-medium">{user?.role?.toLowerCase()}</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/')}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-bold text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all duration-200 border border-transparent hover:border-red-500/20"
          >
            <LogOut size={14} />
            Back to Login
          </button>
        </div>
      </motion.aside>

      {/* Main Content - Slides in with slight delay */}
      <motion.main 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
        className="flex-1 overflow-auto flex flex-col bg-slate-900 relative"
      >
        
        {/* Ambient Glows */}
        <div className="fixed top-0 left-64 w-[500px] h-[500px] bg-teal-500/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />

        <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800/50 sticky top-0 z-20 px-8 py-4 flex justify-between items-center shadow-sm">
           <div>
             <motion.h1 
               initial={{ opacity: 0, y: -5 }}
               animate={{ opacity: 1, y: 0 }}
               key={location.pathname}
               className="text-xl font-bold text-slate-100 capitalize tracking-tight"
             >
                {location.pathname.split('/').pop()?.replace('-', ' ') || 'Dashboard'}
             </motion.h1>
             <p className="text-sm text-slate-500 font-medium">
               {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
             </p>
           </div>
           
           <div className="flex items-center gap-4">
             <button className="p-2 text-slate-400 hover:text-teal-400 transition-colors relative">
                <Bell size={20} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-slate-900"></span>
             </button>
              <div className="px-3 py-1.5 rounded-full bg-teal-500/10 text-teal-400 text-xs font-bold border border-teal-500/20 uppercase tracking-wide shadow-[0_0_10px_rgba(20,184,166,0.1)] flex items-center gap-2">
               <div className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse shadow-[0_0_5px_#2dd4bf]"></div>
               {role === 'CODER' ? 'Admin Access' : role === 'DOCTOR' ? 'Provider Portal' : 'Patient Portal'}
             </div>
           </div>
        </header>

        <div className="p-8 flex-1 max-w-[1920px] mx-auto w-full relative z-10">
          <Outlet />
        </div>
      </motion.main>
    </div>
  );
};
