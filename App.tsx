import React, { useState } from 'react';
import { HashRouter, Routes, Route, Link, useLocation, Navigate, Outlet } from 'react-router-dom';
import { Role, Wish, Note } from './types';
import SantaChat from './components/SantaChat';
import ParentDashboard from './components/ParentDashboard';
import TeacherDashboard from './components/TeacherDashboard';
import LandingPage from './components/LandingPage';
import AuthPage from './components/AuthPage';
import { Gift, Users, GraduationCap, Menu, X, LogOut } from 'lucide-react';

// --- Navbar Component ---
const Navbar = ({ role, setRole, onLogout }: { role: Role, setRole: (r: Role) => void, onLogout: () => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { to: '/app/chat', label: 'Santa Chat', icon: <Gift size={20} />, role: Role.KID },
    { to: '/app/parent', label: 'Parents', icon: <Users size={20} />, role: Role.PARENT },
    { to: '/app/teacher', label: 'Teachers', icon: <GraduationCap size={20} />, role: Role.TEACHER },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/app/chat" className="font-santa text-3xl text-santa-red font-bold flex items-center gap-2">
              <span className="text-4xl">🎄</span> Santa Clause™
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex space-x-8 items-center">
             {/* Role Switcher for Demo */}
             <div className="flex bg-gray-100 rounded-full p-1 mr-4">
               {Object.values(Role).map((r) => (
                 <button
                  key={r}
                  onClick={() => setRole(r)}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${role === r ? 'bg-santa-red text-white shadow-md' : 'text-gray-500 hover:text-gray-900'}`}
                 >
                   {r}
                 </button>
               ))}
             </div>

            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === link.to
                    ? 'text-santa-red bg-red-50'
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {link.icon}
                {link.label}
              </Link>
            ))}

            <button 
              onClick={onLogout}
              className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-gray-500 hover:text-red-600 hover:bg-red-50"
            >
              <LogOut size={18} />
              Sign Out
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-500 hover:text-gray-900">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <div className="pt-2 pb-3 space-y-1 px-4">
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-2">Select Role (Demo)</p>
            <div className="flex gap-2 mb-4">
              {Object.values(Role).map((r) => (
                 <button
                  key={r}
                  onClick={() => { setRole(r); setIsOpen(false); }}
                  className={`flex-1 py-2 rounded text-xs font-bold border ${role === r ? 'bg-santa-red text-white border-santa-red' : 'bg-white text-gray-600 border-gray-200'}`}
                 >
                   {r}
                 </button>
               ))}
            </div>
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-3 py-3 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-santa-red"
              >
                {link.icon}
                {link.label}
              </Link>
            ))}
            <button 
              onClick={() => { onLogout(); setIsOpen(false); }}
              className="w-full text-left flex items-center gap-3 px-3 py-3 rounded-md text-base font-medium text-gray-500 hover:text-red-600 hover:bg-red-50"
            >
              <LogOut size={20} />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

// --- App Layout Wrapper ---
const AppLayout = ({ role, setRole, onLogout }: { role: Role, setRole: (r: Role) => void, onLogout: () => void }) => {
  return (
    <div className="min-h-screen bg-snow font-sans text-gray-900">
      <Navbar role={role} setRole={setRole} onLogout={onLogout} />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
};

// --- Main App ---
const App: React.FC = () => {
  const [currentRole, setCurrentRole] = useState<Role>(Role.KID);
  
  // Mock Data Store (Lifted State)
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [notes, setNotes] = useState<Note[]>([
    { id: '1', author: Role.PARENT, content: "Timmy ate all his vegetables this week!", type: 'BEHAVIOR', timestamp: Date.now() - 1000000 },
    { id: '2', author: Role.TEACHER, content: "Needs to focus more during math class.", type: 'ACADEMIC', timestamp: Date.now() - 500000 }
  ]);
  const [santaImage, setSantaImage] = useState<string | null>(null);
  const [santaStyle, setSantaStyle] = useState<string>('Classic');

  const handleWishDetected = (newWish: Wish) => {
    setWishes(prev => {
      if (prev.find(w => w.item.toLowerCase() === newWish.item.toLowerCase())) return prev;
      return [newWish, ...prev];
    });
  };

  const updateWishStatus = (id: string, status: Wish['status']) => {
    setWishes(prev => prev.map(w => w.id === id ? { ...w, status } : w));
  };

  const addNote = (note: Note) => {
    setNotes(prev => [note, ...prev]);
  };

  const deleteNote = (id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id));
  };
  
  const handleLogout = () => {
    // In a real app, clear auth tokens here
    // We will rely on router navigation in the Navbar
    window.location.hash = '/'; // Simple redirect to landing
  };

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<AuthPage onLogin={setCurrentRole} />} />
        
        {/* Protected App Routes */}
        <Route path="/app" element={<AppLayout role={currentRole} setRole={setCurrentRole} onLogout={handleLogout} />}>
          <Route path="chat" element={
            <SantaChat 
              notes={notes} 
              onWishDetected={handleWishDetected}
              santaImage={santaImage}
              onSetSantaImage={setSantaImage}
              santaStyle={santaStyle}
              onSetSantaStyle={setSantaStyle}
            />
          } />
          <Route path="parent" element={
            <ParentDashboard 
              wishes={wishes} 
              notes={notes} 
              onUpdateWishStatus={updateWishStatus}
              onAddNote={addNote}
              onDeleteNote={deleteNote}
            />
          } />
          <Route path="teacher" element={
            <TeacherDashboard onAddNote={addNote} />
          } />
          {/* Default redirect inside app */}
          <Route index element={<Navigate to="/app/chat" replace />} />
        </Route>
      </Routes>
    </HashRouter>
  );
};

export default App;