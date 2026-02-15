import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Brain,
  Lock,
  ArrowRight,
  Activity,
  CheckCircle,
  Sparkles,
  ChevronRight,
  User,
  Stethoscope,
  Keyboard,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { Logo } from '../components/brand/Logo';
import { toast } from 'sonner';

// --- Loading Screen Component ---
const IntelligenceActivating = ({ onComplete }: { onComplete: () => void }) => {
  const [statusText, setStatusText] = useState("Initializing secure environment");
  
  useEffect(() => {
    const texts = [
      "Initializing secure environment",
      "Authenticating credentials",
      "Syncing clinical context",
      "Loading workspace"
    ];
    
    let index = 0;
    const interval = setInterval(() => {
      index = (index + 1) % texts.length;
      setStatusText(texts[index]);
    }, 1000);

    const completeTimer = setTimeout(() => {
      onComplete();
    }, 4000); // 4 seconds loading

    return () => {
      clearInterval(interval);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-slate-950 flex items-center justify-center overflow-hidden font-sans"
    >
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-teal-900/10 via-slate-950 to-slate-950" />
      <div className="absolute inset-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]" />
      
      <div className="w-full max-w-md mx-auto px-8 relative z-10 flex flex-col items-center">
        
        {/* Logo Container */}
        <motion.div 
           layoutId="logo-container"
           className="flex flex-col items-center mb-12"
        >
            <div className="flex items-center gap-3 mb-2">
                <motion.div 
                  animate={{ 
                    scale: [1, 1.1, 1],
                    boxShadow: ["0 0 20px rgba(20,184,166,0.2)", "0 0 40px rgba(20,184,166,0.4)", "0 0 20px rgba(20,184,166,0.2)"]
                  }}
                  transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                  className="w-16 h-16 rounded-2xl bg-teal-500 flex items-center justify-center shadow-[0_0_30px_rgba(20,184,166,0.3)] relative z-10"
                >
                    <Activity className="text-white" size={32} />
                </motion.div>
                
                <div className="flex flex-col items-start">
                  <span className="text-4xl font-bold text-white tracking-tight">Next<span className="text-teal-400">Med</span></span>
                </div>
            </div>
        </motion.div>

        {/* Loading Visuals */}
        <div className="w-full space-y-8">
            {/* Segmented Loader */}
            <div className="flex justify-center gap-2 h-1.5 w-full max-w-[200px] mx-auto">
                {[...Array(3)].map((_, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0.2, backgroundColor: "#334155" }}
                    animate={{ 
                    opacity: [0.2, 1, 0.2],
                    backgroundColor: ["#334155", "#2dd4bf", "#334155"],
                    scaleX: [1, 1.5, 1]
                    }}
                    transition={{ 
                    repeat: Infinity, 
                    duration: 1.5, 
                    delay: i * 0.3,
                    ease: "easeInOut" 
                    }}
                    className="flex-1 h-full rounded-full origin-center"
                />
                ))}
            </div>

            {/* Status Text */}
            <div className="h-8 relative flex justify-center w-full">
                <AnimatePresence mode='wait'>
                    <motion.p 
                        key={statusText}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        transition={{ duration: 0.3 }}
                        className="text-sm font-medium text-slate-400 tracking-wider uppercase text-center absolute w-full"
                    >
                        {statusText}
                    </motion.p>
                </AnimatePresence>
            </div>
        </div>
      </div>
    </motion.div>
  );
};

export const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('dr.smith@nextmed.ai');
  const [password, setPassword] = useState('password123');
  const [isTyping, setIsTyping] = useState(true);
  const [showIntelligence, setShowIntelligence] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'DOCTOR' | 'CODER' | 'PATIENT' | null>(null);

  // --- Animation Sequence for Left Side ---
  useEffect(() => {
    const typingDuration = 2000;
    const processingDelay = 500;

    const timer1 = setTimeout(() => {
      setIsTyping(false);
    }, typingDuration);

    const timer2 = setTimeout(() => {
      setShowIntelligence(true);
    }, typingDuration + processingDelay);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  const handleLogin = (role: 'DOCTOR' | 'CODER' | 'PATIENT') => {
    setIsLoading(true);
    setSelectedRole(role);
    // Simulate loading for visual effect
    setTimeout(() => {
      navigate(`/${role.toLowerCase()}/dashboard`);
    }, 2000);
  };

  const handleLoadingComplete = () => {
    if (selectedRole) {
      navigate(`/${selectedRole.toLowerCase()}/dashboard`);
    }
  };

  // --- Components ---

  const AiIntelligenceCard = ({ code, desc, confidence, delay }: { code: string, desc: string, confidence: number, delay: number }) => (
    <motion.div
      initial={{ opacity: 0, x: 20, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{ delay, duration: 0.5, type: "spring", stiffness: 100 }}
      className="bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-lg p-3 mb-2 shadow-sm relative overflow-hidden group hover:bg-slate-800/80 transition-all"
    >
      <div className="flex justify-between items-center mb-1">
        <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-teal-400 shadow-[0_0_5px_#2dd4bf]"></div>
            <span className="font-mono text-teal-300 font-bold text-xs tracking-wider">{code}</span>
        </div>
        <span className="text-[9px] font-bold text-slate-400 border border-slate-700 px-1.5 py-0.5 rounded">
          {confidence}%
        </span>
      </div>
      <p className="text-slate-300 text-[10px] font-medium leading-tight truncate">{desc}</p>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-slate-950 flex font-sans overflow-hidden relative selection:bg-teal-500/30">
      
      <AnimatePresence>
        {isLoading && (
          <IntelligenceActivating onComplete={handleLoadingComplete} />
        )}
      </AnimatePresence>

      {/* --- Left Side: AI Visual Story (60%) --- */}
      <motion.div 
        animate={isLoading ? { opacity: 0, scale: 0.98 } : { opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="hidden lg:flex flex-col w-[55%] relative bg-slate-900 p-12 overflow-hidden items-center justify-center border-r border-slate-800/50"
      >
        
        {/* Background Grid/Effects */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(15,23,42,0.95),rgba(15,23,42,0.95)),url('https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-50" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-teal-500/10 via-slate-900/0 to-slate-900/0" />
        
        <div className="relative z-10 w-full max-w-xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-12"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-[10px] font-bold tracking-wider uppercase mb-6 shadow-[0_0_15px_rgba(20,184,166,0.1)]">
              <Sparkles size={10} />
              <span>Clinical Intelligence Platform</span>
            </div>
            <h1 className="text-5xl font-extrabold text-white tracking-tight leading-tight mb-6">
              From notes to <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400">
                structured insight.
              </span>
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed max-w-md">
                Experience the next generation of medical coding assistance. Real-time NLP analysis at the point of care.
            </p>
          </motion.div>

          {/* Interactive Demo Interface */}
          <div className="relative w-full aspect-[16/9] max-w-lg bg-slate-950 rounded-xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col">
            {/* Window Header */}
            <div className="h-8 bg-slate-900 border-b border-slate-800 flex items-center px-3 gap-2">
                <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-700"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-700"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-700"></div>
                </div>
            </div>

            {/* Window Body */}
            <div className="flex-1 flex overflow-hidden">
                {/* Editor Area */}
                <div className="flex-1 p-5 relative font-mono text-xs leading-relaxed text-slate-400">
                    <p>
                        <span className="text-slate-600 mr-2">1</span>
                        Patient presents with
                    </p>
                    <p>
                        <span className="text-slate-600 mr-2">2</span>
                        severe <span className={showIntelligence ? "text-teal-300 bg-teal-500/10 px-0.5 rounded transition-colors duration-700" : ""}>chest pain</span>
                    </p>
                    <p>
                        <span className="text-slate-600 mr-2">3</span>
                        radiating to arm.
                    </p>
                    <p className="mt-2">
                         <span className="text-slate-600 mr-2">4</span>
                         History of <span className={showIntelligence ? "text-indigo-300 bg-indigo-500/10 px-0.5 rounded transition-colors duration-700" : ""}>HTN</span>.
                    </p>
                    
                    {isTyping && (
                        <motion.div 
                            className="w-1.5 h-3 bg-teal-500 inline-block ml-1"
                            animate={{ opacity: [1, 0] }}
                            transition={{ repeat: Infinity, duration: 0.8 }}
                        />
                    )}

                    {/* Scanning Beam */}
                    <AnimatePresence>
                        {showIntelligence && (
                            <motion.div 
                                initial={{ top: 0, opacity: 0 }}
                                animate={{ top: "100%", opacity: [0, 1, 1, 0] }}
                                transition={{ duration: 2.5, ease: "linear", repeat: Infinity, repeatDelay: 1 }}
                                className="absolute left-0 right-0 h-8 bg-gradient-to-b from-teal-500/0 via-teal-500/10 to-teal-500/0 pointer-events-none border-b border-teal-500/20"
                            />
                        )}
                    </AnimatePresence>
                </div>

                {/* Sidebar Intelligence */}
                <div className="w-40 bg-slate-900 border-l border-slate-800 p-3 flex flex-col gap-2">
                    <div className="text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                        <Zap size={10} className="text-teal-500" />
                        Analysis
                    </div>
                    
                    <AnimatePresence>
                        {showIntelligence ? (
                            <>
                                <AiIntelligenceCard code="R07.9" desc="Chest pain" confidence={98} delay={0.2} />
                                <AiIntelligenceCard code="I10" desc="Essential HTN" confidence={95} delay={0.6} />
                            </>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center opacity-30">
                                <div className="w-8 h-8 rounded-full border-2 border-slate-700 border-t-slate-500 animate-spin mb-2"></div>
                                <span className="text-[9px]">Idle</span>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* --- Right Side: Login Panel (45%) --- */}
      <motion.div 
        animate={isLoading ? { opacity: 0, x: 50 } : { opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full lg:w-[45%] bg-slate-950 relative flex flex-col items-center justify-center p-8 lg:p-24"
      >
        
        <div className="w-full max-w-[400px] relative z-10">
          
          {/* Logo */}
          <div className="mb-10 text-center lg:text-left">
            <motion.div
                layoutId="logo-container"
                className="inline-flex items-center gap-3 mb-3"
            >
                <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center shadow-lg shadow-teal-500/20">
                    <Activity className="text-white" size={20} />
                </div>
                <span className="text-2xl font-bold text-white tracking-tight">Next<span className="text-teal-400">Med</span></span>
            </motion.div>
            <p className="text-slate-400 text-sm font-medium">Choose your role to continue.</p>
          </div>

          {/* Form */}
          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Work Email</label>
              <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User size={16} className="text-slate-500 group-focus-within:text-teal-400 transition-colors" />
                  </div>
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 text-slate-200 text-sm rounded-xl pl-10 pr-4 py-3.5 focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500 transition-all placeholder-slate-700"
                    placeholder="name@hospital.org"
                  />
              </div>
            </div>
            
            <div className="space-y-1.5">
              <div className="flex justify-between items-center ml-1">
                 <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Password</label>
                 <a href="#" className="text-xs font-bold text-teal-500 hover:text-teal-400 transition-colors">Forgot Password?</a>
              </div>
              <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock size={16} className="text-slate-500 group-focus-within:text-teal-400 transition-colors" />
                  </div>
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 text-slate-200 text-sm rounded-xl pl-10 pr-4 py-3.5 focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500 transition-all placeholder-slate-700"
                    placeholder="••••••••"
                  />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => handleLogin('DOCTOR')}
              className="w-full bg-teal-600 hover:bg-teal-500 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-teal-900/20 flex items-center justify-center gap-2 group transition-all mt-4"
            >
              <span>Sign In as Doctor</span>
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </form>

          {/* Role Quick Links (For Demo) */}
          <div className="mt-10 pt-8 border-t border-slate-800/50">
            <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest text-center mb-4">Quick Access</p>
            <div className="grid grid-cols-2 gap-3">
               <button
                onClick={() => handleLogin('CODER')}
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg border border-slate-800 hover:border-indigo-500/50 hover:bg-indigo-500/5 text-slate-400 hover:text-indigo-400 text-xs font-bold transition-all"
               >
                 <Keyboard size={14} /> Med Code
               </button>
               <button
                onClick={() => handleLogin('PATIENT')}
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg border border-slate-800 hover:border-blue-500/50 hover:bg-blue-500/5 text-slate-400 hover:text-blue-400 text-xs font-bold transition-all"
               >
                 <User size={14} /> Patient
               </button>
            </div>
          </div>
          
          <div className="mt-8 text-center flex items-center justify-center gap-2 text-xs text-slate-600">
             <ShieldCheck size={14} />
             <span>HIPAA Compliant & Secure</span>
          </div>

        </div>
      </motion.div>

    </div>
  );
};
