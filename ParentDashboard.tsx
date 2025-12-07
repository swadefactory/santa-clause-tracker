import React, { useState, useEffect } from 'react';
import { Wish, Note, Role, RetailResult } from '../types';
import { Check, X, Search, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { searchRetailersForGift } from '../services/geminiService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface ParentDashboardProps {
  wishes: Wish[];
  notes: Note[];
  onUpdateWishStatus: (id: string, status: Wish['status']) => void;
  onAddNote: (note: Note) => void;
  onDeleteNote: (id: string) => void;
}

const ParentDashboard: React.FC<ParentDashboardProps> = ({ 
  wishes, 
  notes, 
  onUpdateWishStatus, 
  onAddNote,
  onDeleteNote 
}) => {
  const [activeTab, setActiveTab] = useState<'wishes' | 'behavior' | 'stats'>('wishes');
  const [newNote, setNewNote] = useState('');
  const [noteType, setNoteType] = useState<Note['type']>('BEHAVIOR');
  const [retailCache, setRetailCache] = useState<Record<string, RetailResult[]>>({});
  const [loadingRetail, setLoadingRetail] = useState<string | null>(null);

  // Fetch retail data when a wish is expanded/viewed (simplified here to load on demand)
  const handleLoadRetail = async (wishItem: string) => {
    if (retailCache[wishItem]) return;
    setLoadingRetail(wishItem);
    const results = await searchRetailersForGift(wishItem);
    setRetailCache(prev => ({ ...prev, [wishItem]: results }));
    setLoadingRetail(null);
  };

  const handleAddNote = () => {
    if (!newNote.trim()) return;
    onAddNote({
      id: Date.now().toString(),
      author: Role.PARENT,
      content: newNote,
      type: noteType,
      timestamp: Date.now()
    });
    setNewNote('');
  };

  // Stats Data
  const statsData = [
    { name: 'Behavior', value: notes.filter(n => n.type === 'BEHAVIOR').length, color: '#165B33' },
    { name: 'Academic', value: notes.filter(n => n.type === 'ACADEMIC').length, color: '#D42426' },
    { name: 'Wishes', value: wishes.length, color: '#F8B229' },
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Parent Dashboard</h1>
        <p className="text-gray-500">Manage wishes, monitor behavior, and guide Santa.</p>
      </header>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-gray-200 pb-2">
        <button 
          onClick={() => setActiveTab('wishes')}
          className={`px-4 py-2 font-semibold rounded-t-lg transition-colors ${activeTab === 'wishes' ? 'bg-santa-red text-white' : 'text-gray-600 hover:bg-gray-100'}`}
        >
          Wish List ({wishes.length})
        </button>
        <button 
          onClick={() => setActiveTab('behavior')}
          className={`px-4 py-2 font-semibold rounded-t-lg transition-colors ${activeTab === 'behavior' ? 'bg-santa-red text-white' : 'text-gray-600 hover:bg-gray-100'}`}
        >
          Behavior Notes
        </button>
        <button 
          onClick={() => setActiveTab('stats')}
          className={`px-4 py-2 font-semibold rounded-t-lg transition-colors ${activeTab === 'stats' ? 'bg-santa-red text-white' : 'text-gray-600 hover:bg-gray-100'}`}
        >
          Insights
        </button>
      </div>

      {/* Content */}
      <div className="bg-white rounded-2xl shadow-lg p-6 min-h-[500px]">
        
        {/* WISHES TAB */}
        {activeTab === 'wishes' && (
          <div className="space-y-6">
             {wishes.length === 0 ? (
               <div className="text-center py-20 text-gray-400">
                 <p>No wishes yet. Encourage your child to chat with Santa!</p>
               </div>
             ) : (
               wishes.map(wish => (
                 <div key={wish.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                   <div className="flex justify-between items-start mb-4">
                     <div>
                       <h3 className="text-xl font-bold text-gray-800">{wish.item}</h3>
                       <p className="text-sm text-gray-500">Requested: {new Date(wish.timestamp).toLocaleDateString()}</p>
                       <span className={`inline-block mt-2 px-2 py-1 text-xs font-bold rounded-full ${
                         wish.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                         wish.status === 'DENIED' ? 'bg-red-100 text-red-700' :
                         'bg-yellow-100 text-yellow-700'
                       }`}>
                         {wish.status}
                       </span>
                     </div>
                     <div className="flex gap-2">
                       <button onClick={() => onUpdateWishStatus(wish.id, 'APPROVED')} className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100" title="Approve">
                         <Check size={20} />
                       </button>
                       <button onClick={() => onUpdateWishStatus(wish.id, 'DENIED')} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100" title="Deny">
                         <X size={20} />
                       </button>
                     </div>
                   </div>

                   {/* Retail Search Section */}
                   <div className="bg-gray-50 rounded-lg p-4">
                     <div className="flex justify-between items-center mb-3">
                        <h4 className="font-semibold text-gray-700 flex items-center gap-2">
                          <ShoppingBag size={16} /> Retail Options
                        </h4>
                        {!retailCache[wish.item] && (
                          <button 
                            onClick={() => handleLoadRetail(wish.item)}
                            className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                            disabled={loadingRetail === wish.item}
                          >
                            {loadingRetail === wish.item ? 'Scanning Elves...' : 'Find Prices'}
                          </button>
                        )}
                     </div>
                     
                     {retailCache[wish.item] ? (
                       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                         {retailCache[wish.item].map((result, idx) => (
                           <div key={idx} className="bg-white p-3 rounded border border-gray-200 text-sm">
                             <img src={result.image} alt={result.title} className="w-full h-32 object-cover rounded mb-2 bg-gray-200" />
                             <div className="font-bold text-gray-800 truncate">{result.title}</div>
                             <div className="flex justify-between mt-1">
                               <span className="text-santa-red font-bold">{result.price}</span>
                               <span className="text-gray-500">{result.store}</span>
                             </div>
                           </div>
                         ))}
                       </div>
                     ) : (
                       <p className="text-xs text-gray-400 italic">Click 'Find Prices' to ask the retail elves.</p>
                     )}
                   </div>
                 </div>
               ))
             )}
          </div>
        )}

        {/* BEHAVIOR TAB */}
        {activeTab === 'behavior' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4">Add Note for Santa</h3>
              <div className="bg-gray-50 p-4 rounded-xl space-y-3">
                <select 
                  value={noteType} 
                  onChange={(e) => setNoteType(e.target.value as any)}
                  className="w-full p-2 rounded-lg border border-gray-300"
                >
                  <option value="BEHAVIOR">Behavioral (Good/Needs Work)</option>
                  <option value="ACADEMIC">Academic/School</option>
                  <option value="ACHIEVEMENT">Achievement/Milestone</option>
                </select>
                <textarea 
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="e.g., Timmy shared his toys with his sister today..."
                  className="w-full p-3 rounded-lg border border-gray-300 h-32"
                />
                <button 
                  onClick={handleAddNote}
                  className="w-full bg-santa-red text-white py-2 rounded-lg font-bold hover:bg-santa-dark-red transition-colors flex items-center justify-center gap-2"
                >
                  <Plus size={18} /> Add to Santa's File
                </button>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-4">Current Notes</h3>
              <div className="space-y-3 max-h-[500px] overflow-y-auto">
                {notes.map(note => (
                  <div key={note.id} className="bg-white border border-gray-100 p-4 rounded-xl shadow-sm flex justify-between group">
                    <div>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded uppercase ${
                        note.type === 'BEHAVIOR' ? 'bg-purple-100 text-purple-700' :
                        note.type === 'ACADEMIC' ? 'bg-blue-100 text-blue-700' : 'bg-gold/20 text-orange-700'
                      }`}>
                        {note.type}
                      </span>
                      <p className="text-gray-700 mt-2">{note.content}</p>
                      <p className="text-xs text-gray-400 mt-1">By {note.author} • {new Date(note.timestamp).toLocaleDateString()}</p>
                    </div>
                    <button 
                      onClick={() => onDeleteNote(note.id)}
                      className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
                {notes.length === 0 && <p className="text-gray-400 italic">No notes added yet.</p>}
              </div>
            </div>
          </div>
        )}

        {/* STATS TAB */}
        {activeTab === 'stats' && (
          <div className="h-96 w-full">
            <h3 className="text-lg font-bold mb-6 text-center">North Pole Activity Report</h3>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="value" radius={[10, 10, 0, 0]}>
                  {statsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
};

export default ParentDashboard;