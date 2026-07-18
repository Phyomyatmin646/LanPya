import { useState, useEffect, useRef } from 'react';
import { Send, PlusCircle, Trash2, MessageSquare, Loader2, Bot, User, ThumbsUp, ThumbsDown } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '@/api/axios';

export default function ChatComponent() {
  const [sessions, setSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Fetch sessions on mount
  useEffect(() => {
    fetchSessions();
  }, []);

  // Fetch history when active session changes
  useEffect(() => {
    if (activeSessionId) {
      fetchHistory(activeSessionId);
    } else {
      setMessages([]);
    }
  }, [activeSessionId]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const fetchSessions = async () => {
    try {
      const res = await api.get('/chat/sessions');
      if (res.data) {
        setSessions(res.data.data || []);
        if (res.data.data?.length > 0 && !activeSessionId) {
          setActiveSessionId(res.data.data[0]._id);
        }
      }
    } catch (error) {
      console.error("Failed to fetch sessions", error);
    }
  };

  const fetchHistory = async (sessionId) => {
    try {
      const res = await api.get(`/chat/sessions/${sessionId}/history`);
      if (res.data) {
        const history = res.data.data || [];
        const formatted = [];
        history.forEach(h => {
          formatted.push({ id: `user-${h._id}`, role: 'user', content: h.user_message });
          formatted.push({ id: `ai-${h._id}`, role: 'ai', content: h.ai_response });
        });
        setMessages(formatted);
      }
    } catch (error) {
      console.error("Failed to fetch history", error);
    }
  };

  const handleCreateSession = async () => {
    try {
      const res = await api.post('/chat/sessions', { title: "New Chat" });
      if (res.data) {
        setSessions([res.data.data, ...sessions]);
        setActiveSessionId(res.data.data._id);
      }
    } catch (error) {
      toast.error("Failed to create chat session");
    }
  };

  const handleDeleteSession = async (sessionId) => {
    try {
      const res = await api.delete(`/chat/sessions/${sessionId}`);
      if (res.data) {
        setSessions(sessions.filter(s => s._id !== sessionId));
        if (activeSessionId === sessionId) {
          setActiveSessionId(null);
        }
      }
    } catch (error) {
      toast.error("Failed to delete chat session");
    }
  };

  const handleFeedback = async (messageId, rating) => {
    // messageId comes in as "ai-64a..." or just the raw id if it was just sent
    const rawId = messageId.replace('ai-', '').replace('-ai', '');
    try {
      await api.post(`/chat/history/${rawId}/feedback`, { feedback_rating: rating });
      toast.success("Thanks for your feedback!");
      // Optionally update local state to highlight the selected button
      setMessages(prev => prev.map(m => m.id === messageId ? { ...m, feedback_rating: rating } : m));
    } catch (error) {
      toast.error("Failed to submit feedback");
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || !activeSessionId) return;

    const currentMsg = inputValue;
    setInputValue('');
    
    // Add user message
    setMessages(prev => [...prev, { id: Date.now().toString(), role: 'user', content: currentMsg }]);
    
    // Create AI placeholder for streaming
    const aiMessageId = Date.now().toString() + "-ai";
    setMessages(prev => [...prev, { id: aiMessageId, role: 'ai', content: "" }]);
    
    setIsLoading(true);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001/api/v1';
      // Have to use native fetch for stream parsing
      const res = await fetch(`${apiUrl}/chat/sessions/${activeSessionId}/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('lanpya_token')}`
        },
        body: JSON.stringify({ message: currentMsg })
      });
      
      if (!res.ok) throw new Error("Failed to connect");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let aiFullResponse = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunkStr = decoder.decode(value, { stream: true });
        const lines = chunkStr.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const dataStr = line.replace('data: ', '').trim();
            if (!dataStr) continue;
            
            try {
              const data = JSON.parse(dataStr);
              if (data.error) {
                toast.error(data.error);
              } else if (data.done && data.chat) {
                setMessages(prev => prev.map(m => m.id === aiMessageId ? { ...m, id: data.chat._id } : m));
                if (data.title) {
                  setSessions(prev => prev.map(s => s._id === activeSessionId ? { ...s, title: data.title } : s));
                }
              } else if (data.content) {
                aiFullResponse += data.content;
                setMessages(prev => prev.map(m => m.id === aiMessageId ? { ...m, content: aiFullResponse } : m));
              }
            } catch (err) {
              // ignore partial parse errors
            }
          }
        }
      }
    } catch (error) {
      toast.error("Error sending message");
      setMessages(prev => prev.map(m => m.id === aiMessageId ? { ...m, content: "Sorry, I encountered an error. Please try again." } : m));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-full w-full bg-white text-[#24292f] overflow-hidden rounded-xl border border-[#D0D7DE]">
      {/* Sidebar - Sessions */}
      <div className="w-64 border-r border-[#D0D7DE] bg-[#F6F8FA] flex flex-col hidden md:flex">
        <div className="p-4 border-b border-[#D0D7DE]">
          <button 
            onClick={handleCreateSession}
            className="w-full flex items-center justify-center gap-2 bg-[#2DA44E] text-white py-2 px-4 rounded-md font-medium hover:bg-[#2C974B] transition-colors"
          >
            <PlusCircle className="w-4 h-4" /> New Chat
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {sessions.length === 0 && (
            <div className="text-center text-sm text-[#57606A] p-4">No chats yet</div>
          )}
          {sessions.map(session => (
            <div 
              key={session._id}
              onClick={() => setActiveSessionId(session._id)}
              className={`group flex items-center justify-between p-3 rounded-md cursor-pointer transition-colors ${
                activeSessionId === session._id ? 'bg-[#DDE2E7]' : 'hover:bg-[#EBEEF1]'
              }`}
            >
              <div className="flex items-center gap-2 overflow-hidden">
                <MessageSquare className="w-4 h-4 text-[#57606A] shrink-0" />
                <span className="text-sm truncate text-[#24292f] font-medium">{session.title}</span>
              </div>
              <button 
                onClick={(e) => { e.stopPropagation(); handleDeleteSession(session._id); }}
                className="text-[#57606A] hover:text-[#CF222E] opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-white">
        {!activeSessionId ? (
          <div className="flex-1 flex flex-col items-center justify-center text-[#57606A] px-4">
            <Bot className="w-16 h-16 mb-4 text-[#D0D7DE]" />
            <h2 className="text-xl font-semibold text-[#24292f] mb-2">LanPya AI</h2>
            <p className="text-center mb-6">Select a chat or start a new one to begin</p>
            
            <div className="w-full max-w-2xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mb-6">
              <button onClick={() => { handleCreateSession().then(() => setInputValue('ကျွန်တော် ဘာ course တွေ တက်နေလဲ?')) }} className="text-left text-sm p-3 rounded-lg border border-[#D0D7DE] hover:border-[#0969DA] hover:bg-[#F6F8FA] transition-colors">
                <span className="font-medium text-[#24292f] block mb-1">My Progress</span>
                <span className="text-xs text-[#57606A] line-clamp-2">ကျွန်တော် ဘာ course တွေ တက်နေလဲ?</span>
              </button>
              <button onClick={() => { handleCreateSession().then(() => setInputValue('Web Development roadmap တွေ ဘာရှိလဲရှာပေးပါ')) }} className="text-left text-sm p-3 rounded-lg border border-[#D0D7DE] hover:border-[#0969DA] hover:bg-[#F6F8FA] transition-colors">
                <span className="font-medium text-[#24292f] block mb-1">Search Roadmaps</span>
                <span className="text-xs text-[#57606A] line-clamp-2">Web Development roadmap တွေ ဘာရှိလဲရှာပေးပါ</span>
              </button>
              <button onClick={() => { handleCreateSession().then(() => setInputValue('ကျွန်တော် မှတ်ထားတဲ့ lesson တွေ ပြပေးပါ')) }} className="text-left text-sm p-3 rounded-lg border border-[#D0D7DE] hover:border-[#0969DA] hover:bg-[#F6F8FA] transition-colors">
                <span className="font-medium text-[#24292f] block mb-1">Bookmarks</span>
                <span className="text-xs text-[#57606A] line-clamp-2">ကျွန်တော် မှတ်ထားတဲ့ lesson တွေ ပြပေးပါ</span>
              </button>
              <button onClick={() => { handleCreateSession().then(() => setInputValue('နောက်တက်ရမယ့်သင်ခန်းစာ အကြံပေးပါ')) }} className="text-left text-sm p-3 rounded-lg border border-[#D0D7DE] hover:border-[#0969DA] hover:bg-[#F6F8FA] transition-colors">
                <span className="font-medium text-[#24292f] block mb-1">Suggest Lesson</span>
                <span className="text-xs text-[#57606A] line-clamp-2">နောက်တက်ရမယ့်သင်ခန်းစာ အကြံပေးပါ</span>
              </button>
              <button onClick={() => { handleCreateSession().then(() => setInputValue('ဒီ Website ကို ဘယ်လိုအသုံးပြုရမလဲ?')) }} className="text-left text-sm p-3 rounded-lg border border-[#D0D7DE] hover:border-[#0969DA] hover:bg-[#F6F8FA] transition-colors">
                <span className="font-medium text-[#24292f] block mb-1">Platform FAQ</span>
                <span className="text-xs text-[#57606A] line-clamp-2">ဒီ Website ကို ဘယ်လိုအသုံးပြုရမလဲ?</span>
              </button>
            </div>

            <button 
              onClick={handleCreateSession}
              className="md:hidden flex items-center gap-2 bg-[#2DA44E] text-white py-2 px-4 rounded-md"
            >
              <PlusCircle className="w-4 h-4" /> New Chat
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
              {messages.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-[#57606A] px-4">
                  <Bot className="w-12 h-12 mb-4 text-[#D0D7DE]" />
                  <p className="mb-6">Ask me anything about your learning roadmaps!</p>
                  
                  <div className="w-full max-w-2xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    <button onClick={(e) => { e.preventDefault(); setInputValue('ကျွန်တော် ဘာ course တွေ တက်နေလဲ?'); }} className="text-left text-sm p-3 rounded-lg border border-[#D0D7DE] hover:border-[#0969DA] hover:bg-[#F6F8FA] transition-colors">
                      <span className="font-medium text-[#24292f] block mb-1">My Progress</span>
                      <span className="text-xs text-[#57606A] line-clamp-2">ကျွန်တော် ဘာ course တွေ တက်နေလဲ?</span>
                    </button>
                    <button onClick={(e) => { e.preventDefault(); setInputValue('Web Development roadmap တွေ ဘာရှိလဲရှာပေးပါ'); }} className="text-left text-sm p-3 rounded-lg border border-[#D0D7DE] hover:border-[#0969DA] hover:bg-[#F6F8FA] transition-colors">
                      <span className="font-medium text-[#24292f] block mb-1">Search Roadmaps</span>
                      <span className="text-xs text-[#57606A] line-clamp-2">Web Development roadmap တွေ ဘာရှိလဲရှာပေးပါ</span>
                    </button>
                    <button onClick={(e) => { e.preventDefault(); setInputValue('ကျွန်တော် မှတ်ထားတဲ့ lesson တွေ ပြပေးပါ'); }} className="text-left text-sm p-3 rounded-lg border border-[#D0D7DE] hover:border-[#0969DA] hover:bg-[#F6F8FA] transition-colors">
                      <span className="font-medium text-[#24292f] block mb-1">Bookmarks</span>
                      <span className="text-xs text-[#57606A] line-clamp-2">ကျွန်တော် မှတ်ထားတဲ့ lesson တွေ ပြပေးပါ</span>
                    </button>
                    <button onClick={(e) => { e.preventDefault(); setInputValue('နောက်တက်ရမယ့်သင်ခန်းစာ အကြံပေးပါ'); }} className="text-left text-sm p-3 rounded-lg border border-[#D0D7DE] hover:border-[#0969DA] hover:bg-[#F6F8FA] transition-colors">
                      <span className="font-medium text-[#24292f] block mb-1">Suggest Lesson</span>
                      <span className="text-xs text-[#57606A] line-clamp-2">နောက်တက်ရမယ့်သင်ခန်းစာ အကြံပေးပါ</span>
                    </button>
                    <button onClick={(e) => { e.preventDefault(); setInputValue('ဒီ Website ကို ဘယ်လိုအသုံးပြုရမလဲ?'); }} className="text-left text-sm p-3 rounded-lg border border-[#D0D7DE] hover:border-[#0969DA] hover:bg-[#F6F8FA] transition-colors">
                      <span className="font-medium text-[#24292f] block mb-1">Platform FAQ</span>
                      <span className="text-xs text-[#57606A] line-clamp-2">ဒီ Website ကို ဘယ်လိုအသုံးပြုရမလဲ?</span>
                    </button>
                  </div>
                </div>
              )}
              {messages.map(msg => (
                <div key={msg.id} className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.role === 'ai' && (
                    <div className="w-8 h-8 rounded-full bg-[#0969DA] text-white flex items-center justify-center shrink-0">
                      <Bot className="w-5 h-5" />
                    </div>
                  )}
                  <div className={`flex flex-col gap-1 max-w-[80%] md:max-w-[70%]`}>
                    <div 
                      className={`p-4 rounded-2xl text-sm shadow-sm ${
                        msg.role === 'user' 
                          ? 'bg-[#F6F8FA] border border-[#D0D7DE] text-[#24292f] rounded-tr-sm' 
                          : 'bg-white border border-[#D0D7DE] text-[#24292f] rounded-tl-sm'
                      }`}
                    >
                      <div className="whitespace-pre-wrap leading-relaxed">{msg.content}</div>
                    </div>
                    {msg.role === 'ai' && !msg.id.includes('-ai') && (
                      <div className="flex items-center gap-2 mt-1 ml-1">
                        <button 
                          onClick={() => handleFeedback(msg.id, 1)}
                          className={`p-1 rounded hover:bg-gray-100 transition-colors ${msg.feedback_rating === 1 ? 'text-green-600' : 'text-gray-400'}`}
                          title="Good response"
                        >
                          <ThumbsUp className="w-3 h-3" />
                        </button>
                        <button 
                          onClick={() => handleFeedback(msg.id, -1)}
                          className={`p-1 rounded hover:bg-gray-100 transition-colors ${msg.feedback_rating === -1 ? 'text-red-600' : 'text-gray-400'}`}
                          title="Bad response"
                        >
                          <ThumbsDown className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                  {msg.role === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-[#E8EAED] text-[#24292f] flex items-center justify-center shrink-0">
                      <User className="w-5 h-5" />
                    </div>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-4 justify-start">
                  <div className="w-8 h-8 rounded-full bg-[#0969DA] text-white flex items-center justify-center shrink-0">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div className="p-4 rounded-2xl bg-white border border-[#D0D7DE] rounded-tl-sm flex items-center">
                    <Loader2 className="w-5 h-5 animate-spin text-[#0969DA]" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-[#D0D7DE]">
              <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto relative">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask LanPya AI..."
                  className="w-full bg-[#F6F8FA] border border-[#D0D7DE] rounded-full py-3 px-6 pr-12 focus:outline-none focus:border-[#0969DA] focus:ring-1 focus:ring-[#0969DA] transition-shadow text-sm"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim() || isLoading}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-[#0969DA] text-white rounded-full hover:bg-[#0353A4] disabled:opacity-50 disabled:hover:bg-[#0969DA] transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
