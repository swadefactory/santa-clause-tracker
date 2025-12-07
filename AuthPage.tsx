import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, ArrowRight, Wand2 } from 'lucide-react';
import { Role } from '../types';

interface AuthPageProps {
  onLogin: (role: Role) => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onLogin }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent, role: Role) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate network delay
    setTimeout(() => {
      onLogin(role);
      navigate('/app/chat'); // Default landing
    }, 800);
  };

  return (
    <div className="min-h-screen bg-snow flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-10 right-10 w-64 h-64 bg-santa-red opacity-5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-gold opacity-5 rounded-full blur-3xl"></div>
      </div>

      <div className="bg-white max-w-md w-full rounded-3xl shadow-2xl overflow-hidden relative z-10 border-4 border-gray-100">
        <div className="bg-santa-red p-8 text-center text-white">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
            <Lock size={32} className="text-white" />
          </div>
          <h1 className="font-santa text-4xl font-bold">North Pole Access</h1>
          <p className="text-blue-100 mt-2">Please verify your identity</p>
        </div>

        <div className="p-8">
          <form className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="parent@example.com"
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-santa-red focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-santa-red focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>

            <div className="pt-4">
              <p className="text-center text-xs text-gray-400 uppercase tracking-widest font-bold mb-4">Select Role to Demo</p>
              
              <div className="grid grid-cols-1 gap-3">
                <button 
                  onClick={(e) => handleLogin(e, Role.PARENT)}
                  disabled={isLoading}
                  className="w-full py-3 bg-santa-red hover:bg-santa-dark-red text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  {isLoading ? 'Verifying...' : 'Sign In as Parent'} <ArrowRight size={18} />
                </button>
                
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={(e) => handleLogin(e, Role.TEACHER)}
                    disabled={isLoading}
                    className="py-3 bg-elf-green hover:bg-green-800 text-white font-bold rounded-xl transition-colors text-sm"
                  >
                    Teacher Login
                  </button>
                  <button 
                    onClick={(e) => handleLogin(e, Role.KID)}
                    disabled={isLoading}
                    className="py-3 bg-gold hover:bg-yellow-500 text-white font-bold rounded-xl transition-colors text-sm"
                  >
                    Kid Access
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
        
        <div className="p-4 bg-gray-50 text-center text-xs text-gray-400">
          Protected by Elf-Grade Encryption™
        </div>
      </div>
    </div>
  );
};

export default AuthPage;