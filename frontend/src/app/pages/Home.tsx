import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  Activity,
  Users,
  Stethoscope,
  Keyboard,
  ArrowRight,
  Zap,
  Shield,
  Clock,
  TrendingUp,
  CheckCircle
} from 'lucide-react';

export const Home = () => {
  const navigate = useNavigate();

  const features = [
    { icon: Zap, label: 'AI-Powered', desc: 'Intelligent medical coding' },
    { icon: Clock, label: 'Real-time', desc: 'Instant coding suggestions' },
    { icon: Shield, label: 'Secure', desc: 'HIPAA compliant platform' },
    { icon: TrendingUp, label: 'Analytics', desc: 'Track performance metrics' }
  ];

  const roles = [
    {
      title: 'Doctor',
      desc: 'Manage patients and clinical notes',
      icon: Stethoscope,
      color: 'from-blue-500 to-cyan-500',
      path: '/doctor/dashboard',
      button: 'Enter as Doctor'
    },
    {
      title: 'Medical Coder',
      desc: 'Code patient records with AI support',
      icon: Keyboard,
      color: 'from-indigo-500 to-purple-500',
      path: '/coder/dashboard',
      button: 'Enter as Coder'
    },
    {
      title: 'Patient',
      desc: 'View your medical records and health',
      icon: Users,
      color: 'from-emerald-500 to-teal-500',
      path: '/patient/dashboard',
      button: 'Enter as Patient'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-hidden">
      {/* Navigation */}
      <nav className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2"
          >
            <div className="w-10 h-10 rounded-lg bg-teal-600 flex items-center justify-center">
              <Activity className="text-white" size={24} />
            </div>
            <span className="text-2xl font-bold">Next<span className="text-teal-400">Med</span></span>
          </motion.div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 px-6">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
              Medical Intelligence
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-cyan-400 to-emerald-400">
                Reimagined
              </span>
            </h1>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-12">
              A unified platform for doctors, coders, and patients. Streamline clinical workflows with AI-powered medical coding and intelligent patient management.
            </p>

            {/* Feature Pills */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
              {features.map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-4 text-center"
                >
                  <feature.icon className="text-teal-400 mx-auto mb-2" size={20} />
                  <p className="text-sm font-bold text-slate-200">{feature.label}</p>
                  <p className="text-xs text-slate-500">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Role Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-20">
            {roles.map((role, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="bg-slate-800/40 backdrop-blur border border-slate-700 rounded-xl p-8 hover:border-slate-600 transition-all hover:shadow-2xl hover:shadow-teal-500/10 group cursor-pointer"
                onClick={() => navigate(role.path)}
              >
                <div className={`w-16 h-16 rounded-lg bg-gradient-to-br ${role.color} p-3.5 mb-6 group-hover:scale-110 transition-transform`}>
                  <role.icon className="w-full h-full text-white" />
                </div>

                <h3 className="text-2xl font-bold mb-2">{role.title}</h3>
                <p className="text-slate-400 mb-8">{role.desc}</p>

                <motion.button
                  whileHover={{ scale: 1.05, x: 5 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full bg-teal-600 hover:bg-teal-500 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-all"
                >
                  {role.button}
                  <ArrowRight size={18} />
                </motion.button>
              </motion.div>
            ))}
          </div>

          {/* Stats Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gradient-to-r from-slate-800 to-slate-900 border border-slate-700 rounded-xl p-12 mb-16"
          >
            <div className="grid md:grid-cols-4 gap-8 text-center">
              <div>
                <p className="text-4xl font-bold text-teal-400 mb-2">6</p>
                <p className="text-slate-400">Patient Records</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-cyan-400 mb-2">3</p>
                <p className="text-slate-400">User Roles</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-emerald-400 mb-2">98%</p>
                <p className="text-slate-400">Accuracy Rate</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-indigo-400 mb-2">24/7</p>
                <p className="text-slate-400">AI Support</p>
              </div>
            </div>
          </motion.div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-center"
          >
            <p className="text-slate-400 mb-6">Ready to transform your clinical workflows?</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/doctor/dashboard')}
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white font-bold rounded-lg shadow-lg shadow-teal-500/30 transition-all"
            >
              <CheckCircle size={20} />
              Get Started Now
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-900/50 backdrop-blur py-12 px-6">
        <div className="max-w-7xl mx-auto text-center text-slate-500">
          <p>© 2024 NextMed. Intelligent Healthcare Technology.</p>
          <p className="text-sm mt-2">HIPAA Compliant | Secure | Privacy Protected</p>
        </div>
      </footer>
    </div>
  );
};
