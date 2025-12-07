import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, Volume2, Sparkles, Image as ImageIcon, Wand2, Paintbrush } from 'lucide-react';
import { chatWithSanta, extractWishFromText, speakAsSanta, playAudioBuffer, generateSantaAvatar } from '../services/geminiService';
import { ChatMessage, Note, Wish } from '../types';

interface SantaChatProps {
  notes: Note[];
  onWishDetected: (wish: Wish) => void;
  santaImage: string | null;
  onSetSantaImage: (img: string) => void;
  santaStyle: string;
  onSetSantaStyle: (style: string) => void;
}

const SantaChat: React.FC<SantaChatProps> = ({ 
  notes, 
  onWishDetected, 
  santaImage, 
  onSetSantaImage,
  santaStyle,
  onSetSantaStyle
}) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', role: 'model', text: "Ho ho ho! Hello there! I'm checking my list... how are you doing today?" }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  // Customization State
  const [isGeneratingSanta, setIsGeneratingSanta] = useState(false);
  
  // Local state for the selection screen before confirming
  const [selectedStyleId, setSelectedStyleId] = useState(santaStyle || 'Classic');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const styles = [
    { id: 'Classic', label: 'Classic White', desc: 'Traditional Santa' },
    { id: 'African American', label: 'African American', desc: 'Warm & Soulful' },
    { id: 'Asian', label: 'Asian', desc: 'Wise & Kind' },
    { id: 'Hispanic', label: 'Hispanic/Latino', desc: 'Festive & Joyful' },
    { id: 'African', label: 'African', desc: 'Regal & Magical' },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (santaImage) {
      scrollToBottom();
    }
  }, [messages, santaImage]);

  const handleCreateSanta = async () => {
    setIsGeneratingSanta(true);
    // Persist the style
    onSetSantaStyle(selectedStyleId);
    
    const img = await generateSantaAvatar(selectedStyleId);
    if (img) {
      onSetSantaImage(img);
    }
    setIsGeneratingSanta(false);
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    // 1. Check for Wish (Parallel)
    extractWishFromText(userMsg.text).then(wishData => {
      if (wishData) {
        onWishDetected({
          id: Date.now().toString(),
          item: wishData.item,
          priceEstimate: wishData.priceEstimate,
          status: 'PENDING',
          timestamp: Date.now()
        });
      }
    });

    // 2. Chat with Santa
    const history = messages.map(m => ({
      role: m.role,
      parts: [{ text: m.text }]
    }));

    // Pass the active santaStyle to the chat service
    const responseText = await chatWithSanta(history, userMsg.text, notes, santaStyle);

    const modelMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      text: responseText
    };

    setMessages(prev => [...prev, modelMsg]);
    setIsLoading(false);

    // 3. Auto-play TTS
    handleSpeak(responseText);
  };

  const handleSpeak = async (text: string) => {
    setIsSpeaking(true);
    // Pass the active santaStyle to the TTS service
    const buffer = await speakAsSanta(text, santaStyle);
    if (buffer) {
      playAudioBuffer(buffer);
    }
    setIsSpeaking(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // --- RENDER: Customization Screen ---
  if (!santaImage) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[600px] bg-slate-900 rounded-3xl p-8 border-4 border-gold relative overflow-hidden">
        {/* Background FX */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
        
        <div className="z-10 text-center max-w-lg w-full">
          <div className="w-24 h-24 bg-santa-red rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg border-4 border-white">
            <Wand2 className="text-white" size={40} />
          </div>
          
          <h2 className="font-santa text-4xl font-bold text-white mb-2">Create Your Santa</h2>
          <p className="text-blue-200 mb-8">Santa works magic in many forms. How should he look and sound for you?</p>
          
          <div className="grid grid-cols-1 gap-3 mb-8">
            {styles.map((style) => (
              <button
                key={style.id}
                onClick={() => setSelectedStyleId(style.id)}
                className={`p-4 rounded-xl border-2 transition-all flex items-center justify-between group ${
                  selectedStyleId === style.id 
                    ? 'bg-santa-red border-gold text-white shadow-xl scale-105' 
                    : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                }`}
              >
                <div className="flex items-center gap-3">
                   <div className={`w-4 h-4 rounded-full border ${selectedStyleId === style.id ? 'bg-white border-white' : 'border-white'}`}></div>
                   <span className="font-bold text-lg">{style.label}</span>
                </div>
                <span className={`text-xs opacity-70 ${selectedStyleId === style.id ? 'text-white' : 'text-gray-300'}`}>{style.desc}</span>
              </button>
            ))}
          </div>

          <button
            onClick={handleCreateSanta}
            disabled={isGeneratingSanta}
            className="w-full py-4 bg-gold hover:bg-yellow-400 text-santa-dark-red font-bold text-xl rounded-full shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isGeneratingSanta ? (
              <>
                <Sparkles className="animate-spin" /> Casting Magic...
              </>
            ) : (
              <>
                <Sparkles /> Meet Santa
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  // --- RENDER: Chat Interface ---
  return (
    <div className="flex flex-col h-[calc(100vh-100px)] bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border-4 border-santa-red relative">
      {/* Decorative Snow */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-10 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
      
      {/* Header */}
      <div className="bg-santa-red p-4 flex items-center justify-between text-white shadow-md z-10">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img 
              src={santaImage} 
              alt="Santa" 
              className="w-14 h-14 rounded-full border-2 border-gold object-cover bg-white"
            />
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-santa-red"></span>
          </div>
          <div>
            <h2 className="font-santa text-2xl font-bold leading-none">Santa Claus</h2>
            <div className="text-xs text-blue-100 opacity-90">Live from North Pole Workshop</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
            <button onClick={() => { onSetSantaImage(''); }} className="text-xs bg-black/20 hover:bg-black/30 px-2 py-1 rounded text-white/80 transition-colors">
              Change Santa
            </button>
            <div className="bg-elf-green px-3 py-1 rounded-full text-xs font-bold border border-gold hidden sm:block">
            NICE LIST VERIFIED
            </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-slate-50 relative">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-end gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role === 'model' && (
              <img src={santaImage} className="w-8 h-8 rounded-full border border-gray-200 shadow-sm object-cover bg-white mb-1" alt="Santa" />
            )}
            
            <div
              className={`max-w-[80%] rounded-2xl p-4 shadow-sm relative group ${
                msg.role === 'user'
                  ? 'bg-blue-600 text-white rounded-tr-none'
                  : 'bg-white text-gray-800 border-2 border-red-100 rounded-tl-none'
              }`}
            >
              <p className="whitespace-pre-wrap text-lg font-sans leading-relaxed">{msg.text}</p>
              
              {msg.role === 'model' && (
                 <button 
                  onClick={() => handleSpeak(msg.text)}
                  className="absolute -right-10 top-2 p-2 bg-white rounded-full shadow-sm text-gray-400 hover:text-santa-red opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Read Aloud"
                 >
                   <Volume2 size={16} />
                 </button>
              )}
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start items-center gap-3">
             <img src={santaImage} className="w-8 h-8 rounded-full border border-gray-200 shadow-sm object-cover bg-white mb-1" alt="Santa" />
            <div className="bg-white p-4 rounded-2xl rounded-tl-none border-2 border-red-100 shadow-sm flex items-center gap-2">
              <Sparkles className="animate-spin text-gold" size={20} />
              <span className="text-gray-500 font-santa text-lg">Thinking...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white p-4 border-t border-gray-200 z-10">
        <div className="relative flex items-end gap-2 max-w-4xl mx-auto">
           <button className="p-3 text-gray-400 hover:text-santa-red transition-colors bg-gray-100 rounded-full hidden sm:block">
            <ImageIcon size={24} />
          </button>

          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Tell Santa your wish..."
            className="flex-1 bg-gray-100 border-0 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-santa-red resize-none text-gray-800 font-sans text-lg max-h-32"
            rows={1}
          />
          
          <button 
            onClick={handleSendMessage}
            disabled={isLoading || !input.trim()}
            className="p-3 bg-santa-red hover:bg-santa-dark-red text-white rounded-full shadow-lg transition-transform hover:scale-105 disabled:opacity-50 disabled:scale-100"
          >
            <Send size={24} />
          </button>

           <button className="p-3 bg-elf-green hover:bg-green-700 text-white rounded-full shadow-lg transition-transform hover:scale-105 hidden sm:block">
            <Mic size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SantaChat;