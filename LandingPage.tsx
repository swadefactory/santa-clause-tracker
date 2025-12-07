import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Users, MessageCircle, Heart, ArrowRight, Lock } from 'lucide-react';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-snow font-sans text-gray-900">
      {/* Hero Section */}
      <div className="relative bg-slate-900 text-white overflow-hidden">
        {/* Background Image Overlay */}
        <div className="absolute inset-0 opacity-40">
           {/* Placeholder for the user's specific hero image */}
           <img 
            src="https://images.unsplash.com/photo-1545629177-49a60e90db72?q=80&w=2548&auto=format&fit=crop" 
            alt="Magical Santas" 
            className="w-full h-full object-cover"
           />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 flex flex-col items-center text-center">
          <div className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm">
            <Sparkles className="text-gold" size={20} />
            <span className="text-sm font-bold tracking-wide uppercase">The AI North Pole Experience</span>
          </div>
          
          <h1 className="font-santa text-6xl md:text-8xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white via-gold to-white drop-shadow-lg">
            Believe in Magic
          </h1>
          
          <p className="max-w-2xl text-xl md:text-2xl text-blue-100 mb-10 leading-relaxed">
            A personalized, safe, and interactive Santa Claus experience powered by advanced AI. 
            Connects kids, parents, and teachers in a heartwarming holiday loop.
          </p>
          
          <button 
            onClick={() => navigate('/login')}
            className="group relative px-8 py-4 bg-santa-red hover:bg-santa-dark-red text-white font-bold text-xl rounded-full shadow-2xl transition-all transform hover:scale-105 flex items-center gap-3"
          >
            <span>Sign In to North Pole</span>
            <ArrowRight className="group-hover:translate-x-1 transition-transform" />
          </button>

          <p className="mt-6 text-sm text-gray-400">Secure Parent & Teacher Authentication Required</p>
        </div>
      </div>

      {/* Instructions Section */}
      <div className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-santa text-5xl text-santa-red font-bold mb-4">How It Works</h2>
          <p className="text-gray-600 text-lg">A simple journey to bring joy and good habits to your home.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Step 1 */}
          <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 relative group hover:-translate-y-2 transition-transform">
            <div className="absolute -top-6 left-8 w-12 h-12 bg-elf-green text-white rounded-2xl flex items-center justify-center font-bold text-2xl shadow-lg">1</div>
            <div className="mt-6 mb-4 text-santa-red">
               <Lock size={40} />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-gray-800">Secure Sign In</h3>
            <p className="text-gray-600 leading-relaxed">
              Parents create a secure account to manage the experience. We protect your child's privacy with strict safety guardrails and authenticated access only.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 relative group hover:-translate-y-2 transition-transform">
            <div className="absolute -top-6 left-8 w-12 h-12 bg-santa-red text-white rounded-2xl flex items-center justify-center font-bold text-2xl shadow-lg">2</div>
            <div className="mt-6 mb-4 text-gold">
               <Users size={40} />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-gray-800">Customize Your Santa</h3>
            <p className="text-gray-600 leading-relaxed">
              Every family is unique. Create a Santa that looks and sounds like he belongs in your home. Choose ethnicity, voice, and personality styles.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 relative group hover:-translate-y-2 transition-transform">
            <div className="absolute -top-6 left-8 w-12 h-12 bg-blue-500 text-white rounded-2xl flex items-center justify-center font-bold text-2xl shadow-lg">3</div>
            <div className="mt-6 mb-4 text-blue-500">
               <MessageCircle size={40} />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-gray-800">Magic Conversations</h3>
            <p className="text-gray-600 leading-relaxed">
              Kids can chat via voice or text. Santa knows their achievements (thanks to teachers!) and gently guides behavior (thanks to parents!).
            </p>
          </div>
        </div>
      </div>

      {/* Feature Highlight */}
      <div className="bg-slate-50 py-20 border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1">
             <div className="inline-block px-4 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-bold mb-4">Teacher Integration</div>
             <h2 className="font-santa text-4xl font-bold text-gray-900 mb-6">It Takes a Village</h2>
             <p className="text-lg text-gray-600 mb-6">
               Teachers can submit "Nice List" notes directly to the North Pole. Santa reinforces academic efforts and good classroom behavior during his chats.
             </p>
             <ul className="space-y-3">
               <li className="flex items-center gap-3 text-gray-700">
                 <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center"><Heart size={14} /></div>
                 <span>Encourages reading and math</span>
               </li>
               <li className="flex items-center gap-3 text-gray-700">
                 <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center"><Heart size={14} /></div>
                 <span>Reinforces kindness and sharing</span>
               </li>
               <li className="flex items-center gap-3 text-gray-700">
                 <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center"><Heart size={14} /></div>
                 <span>Safe, one-way teacher input (no direct messaging)</span>
               </li>
             </ul>
          </div>
          <div className="flex-1 relative">
            <div className="absolute inset-0 bg-gold blur-3xl opacity-20 rounded-full"></div>
            <img 
              src="https://images.unsplash.com/photo-1576919228236-a097c32a58be?q=80&w=2070&auto=format&fit=crop" 
              alt="Teacher using tablet" 
              className="relative rounded-3xl shadow-2xl border-4 border-white transform rotate-2"
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-santa text-3xl mb-4">Santa Clause™</h2>
          <p className="text-gray-400 mb-8">Making spirits bright with responsible AI.</p>
          <div className="flex justify-center gap-6 text-sm text-gray-500">
            <a href="#" className="hover:text-white">Privacy Policy</a>
            <a href="#" className="hover:text-white">Terms of Service</a>
            <a href="#" className="hover:text-white">Safety Guidelines</a>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-xs text-gray-600">
            © 2024 AI North Pole Experience. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;