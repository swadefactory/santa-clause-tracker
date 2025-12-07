import React, { useState } from 'react';
import { Note, Role } from '../types';
import { GraduationCap, Send, BookOpen } from 'lucide-react';

interface TeacherDashboardProps {
  onAddNote: (note: Note) => void;
}

const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ onAddNote }) => {
  const [studentName, setStudentName] = useState('Timmy'); // Mock selection
  const [noteContent, setNoteContent] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteContent.trim()) return;

    onAddNote({
      id: Date.now().toString(),
      author: Role.TEACHER,
      content: noteContent,
      type: 'ACADEMIC',
      timestamp: Date.now()
    });

    setNoteContent('');
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-t-4 border-elf-green">
        <div className="p-8 bg-slate-50 border-b border-gray-100">
          <div className="flex items-center gap-3 mb-2">
            <GraduationCap className="text-elf-green" size={32} />
            <h1 className="text-2xl font-bold text-gray-800">Teacher Portal</h1>
          </div>
          <p className="text-gray-600">Send academic updates directly to the North Pole.</p>
        </div>

        <div className="p-8 grid md:grid-cols-2 gap-8">
          
          {/* Form */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Student</label>
            <select 
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              className="w-full p-3 bg-white border border-gray-300 rounded-lg mb-4"
            >
              <option value="Timmy">Timmy Turner</option>
              <option value="Sally">Sally Johnson</option>
              <option value="Billy">Billy Bob</option>
            </select>

            <label className="block text-sm font-bold text-gray-700 mb-2">Message for Santa</label>
            <p className="text-xs text-gray-500 mb-2">Focus on efforts, achievements, or gentle reminders.</p>
            <textarea
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              className="w-full h-40 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-elf-green outline-none"
              placeholder="e.g. Timmy has been working very hard on his multiplication tables..."
            />
            
            <button
              onClick={handleSubmit}
              disabled={!noteContent.trim()}
              className="mt-4 w-full bg-elf-green text-white py-3 rounded-lg font-bold hover:bg-green-800 transition-colors flex items-center justify-center gap-2"
            >
              <Send size={18} /> Send to North Pole
            </button>
            
            {submitted && (
              <div className="mt-4 p-3 bg-green-50 text-green-700 rounded-lg text-center animate-pulse">
                Sent successfully! Santa has received your note.
              </div>
            )}
          </div>

          {/* Guidelines */}
          <div className="bg-yellow-50 p-6 rounded-xl border border-yellow-100">
            <h3 className="font-bold text-yellow-800 mb-4 flex items-center gap-2">
              <BookOpen size={20} /> Guidelines
            </h3>
            <ul className="space-y-3 text-sm text-yellow-900">
              <li className="flex gap-2">
                <span className="font-bold">•</span>
                <span>Keep notes positive and constructive.</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold">•</span>
                <span>Santa will use this to encourage the student during their chats.</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold">•</span>
                <span>Do not include sensitive private information.</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold">•</span>
                <span>Examples: "Great sharing," "Improved reading," "Needs to focus in class."</span>
              </li>
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;