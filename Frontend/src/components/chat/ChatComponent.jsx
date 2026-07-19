import { useState, useEffect, useRef } from 'react';
import { Send, PlusCircle, Trash2, MessageSquare, Loader2, Bot, User, ThumbsUp, ThumbsDown, Search, MoreVertical, ChevronRight, BarChart3, Bookmark, Lightbulb, HelpCircle, Paperclip, Star, Share2, Pencil, Sparkles } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '@/api/axios';
import mascot from '../../../assets/mascot.png';

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
                setMessages(prev => prev.map(m => m.id === aiMessageId ? { ...m, id: data.chat._id, content: data.chat.ai_response || aiFullResponse } : m));
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

  const quickActions = [
    { title: 'My Progress', text: 'ကျွန်တော် ဘာ course တွေ တက်နေလဲ?', icon: BarChart3, color: 'text-violet-400' },
    { title: 'Search Roadmaps', text: 'Web Development roadmap တွေ ဘာရှိလဲရှာပေးပါ', icon: Search, color: 'text-violet-400' },
    { title: 'Bookmarks', text: 'ကျွန်တော် မှတ်ထားတဲ့ lesson တွေ ပြပေးပါ', icon: Bookmark, color: 'text-lime-300' },
    { title: 'Suggest Lesson', text: 'နောက်တက်ရမယ့်သင်ခန်းစာ အကြံပေးပါ', icon: Lightbulb, color: 'text-violet-300' },
    { title: 'Platform FAQ', text: 'ဒီ Website ကို ဘယ်လိုအသုံးပြုရမလဲ?', icon: HelpCircle, color: 'text-violet-300' },
  ];

  const startWith = (text) => {
    if (!activeSessionId) {
      handleCreateSession().then(() => setInputValue(text));
    } else {
      setInputValue(text);
    }
  };

  return (
    <div className="lp-chat-shell flex h-full w-full overflow-hidden rounded-[18px] border border-[#25205a] bg-[#07051b] text-white shadow-[0_0_50px_rgba(79,35,180,.12)]">
      <aside className="lp-chat-sidebar hidden w-[262px] shrink-0 flex-col border-r border-[#221c50] bg-[#09071d] md:flex">
        <div className="border-b border-[#221c50] p-5">
          <span className="mb-4 inline-flex rounded-full bg-[#171044] px-2.5 py-1 text-[10px] font-medium text-[#a978ff]">Beta</span>
          <button onClick={handleCreateSession} className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#6724ed] to-[#8338ff] py-3 text-sm font-semibold shadow-[0_7px_20px_rgba(111,36,238,.3)] transition hover:brightness-110">
            <PlusCircle className="h-4 w-4" /> New Chat
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-3 py-4">
          <p className="mb-3 px-2 text-[11px] font-medium text-white/35">Recent Chats</p>
          {sessions.length === 0 && <div className="px-2 text-xs text-white/35">No chats yet</div>}
          {sessions.map((session) => (
            <div key={session._id} onClick={() => setActiveSessionId(session._id)} className={`group mb-1 flex cursor-pointer items-start gap-2 rounded-xl px-3 py-2.5 transition ${activeSessionId === session._id ? 'border border-[#6d37e3]/60 bg-[#24134d] text-white shadow-[0_0_18px_rgba(99,45,205,.12)]' : 'text-white/75 hover:bg-white/5'}`}>
              <MessageSquare className={`mt-0.5 h-4 w-4 shrink-0 ${activeSessionId === session._id ? 'text-[#a86eff]' : 'text-white/25'}`} />
              <span className="min-w-0 flex-1 text-xs leading-5">{session.title}</span>
              <button onClick={(e) => { e.stopPropagation(); handleDeleteSession(session._id); }} className="opacity-0 transition group-hover:opacity-100"><MoreVertical className="h-4 w-4 text-white/40 hover:text-white" /></button>
            </div>
          ))}
        </div>
        <div className="border-t border-[#221c50] p-4">
          <button className="flex w-full items-center justify-between rounded-lg border border-[#211b4b] px-3 py-3 text-xs text-[#a978ff] transition hover:border-[#7940e8]">View all chats <ChevronRight className="h-4 w-4" /></button>
        </div>
      </aside>

      <main className="relative flex min-w-0 flex-1 flex-col overflow-hidden bg-[radial-gradient(circle_at_75%_35%,rgba(56,23,134,.14),transparent_38%),#08051f]">
        {activeSessionId && (
          <div className="flex items-center justify-between border-b border-[#1c1644] px-5 py-3.5 sm:px-7">
            <div className="flex items-center gap-2"><span className="text-sm font-semibold">{sessions.find(s => s._id === activeSessionId)?.title || 'LanPya AI Chat'}</span><Pencil className="h-3.5 w-3.5 text-white/40" /></div>
            <div className="flex gap-2"><button className="rounded-lg border border-[#352b65] p-2 text-white/55 hover:text-white"><Star className="h-4 w-4" /></button><button className="rounded-lg border border-[#352b65] p-2 text-white/55 hover:text-white"><Share2 className="h-4 w-4" /></button><button className="rounded-lg border border-[#352b65] p-2 text-white/55 hover:text-white"><MoreVertical className="h-4 w-4" /></button></div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-4 py-5 sm:px-8 md:px-10">
          {!activeSessionId || messages.length === 0 ? (
            <div className="relative flex min-h-full flex-col items-center justify-center py-6">
              <div className="pointer-events-none absolute right-0 top-2 hidden h-[280px] w-[300px] lg:block xl:right-8"><div className="absolute inset-12 rounded-full bg-[#742dff]/25 blur-3xl" /><img src={mascot} alt="LanPya AI" className="relative h-full w-full object-contain" /><span className="absolute left-0 top-12 rounded-xl border border-[#39256e] bg-[#16103b]/90 px-4 py-3 text-xs text-white/90 shadow-xl">How can I<br /><span className="text-[#a56bff]">help you today?</span></span></div>
              <div className="mb-4 block h-20 w-20 lg:hidden"><img src={mascot} alt="LanPya AI" className="h-full w-full object-contain" /></div>
              <h1 className="text-center text-3xl font-semibold tracking-tight sm:text-4xl">Hi! I’m <span className="bg-gradient-to-r from-[#a45cff] to-[#7132f4] bg-clip-text text-transparent">LanPya AI</span></h1>
              <p className="mt-1 text-sm text-white/55 sm:text-base">Your AI learning companion</p><div className="mt-3 h-px w-24 bg-gradient-to-r from-transparent via-[#a247ff] to-transparent" />
              <div className="mt-12 grid w-full max-w-[900px] grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {quickActions.map(({ title, text, icon: Icon, color }) => <button key={title} onClick={() => startWith(text)} className="lp-quick-card group flex min-h-[118px] items-start gap-4 rounded-xl border border-[#282257] bg-[#100b32]/80 p-5 text-left transition hover:-translate-y-0.5 hover:border-[#7242df] hover:bg-[#171045]"><span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#2a145f] ${color}`}><Icon className="h-6 w-6" /></span><span className="min-w-0 flex-1"><span className="block text-sm font-semibold text-white">{title}</span><span className="mt-1 block text-xs leading-5 text-white/60">{text}</span></span><span className="self-end rounded-full border border-[#3b326c] p-1.5 text-white/40 transition group-hover:border-[#9251ff] group-hover:text-[#b277ff]"><ChevronRight className="h-3.5 w-3.5" /></span></button>)}
              </div>
            </div>
          ) : (
            <div className="mx-auto max-w-4xl space-y-7">
              {messages.filter(msg => !(msg.role === 'ai' && !msg.content && isLoading)).map(msg => <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'ai' && <img src={mascot} alt="AI" className="h-10 w-10 shrink-0 rounded-full border border-[#6035bd] bg-[#190a4b] object-cover object-top" />}
                <div className={`max-w-[82%] ${msg.role === 'user' ? 'order-first' : ''}`}><div className={`rounded-2xl border px-4 py-3 text-sm leading-6 ${msg.role === 'user' ? 'rounded-tr-sm border-[#8140f4] bg-gradient-to-br from-[#6d2be7] to-[#5420bd]' : 'rounded-tl-sm border-[#30265e] bg-[#171332]'}`}><div className="whitespace-pre-wrap">{msg.content}</div></div>{msg.role === 'ai' && !msg.id.includes('-ai') && <div className="mt-1 flex gap-1 text-white/35"><button onClick={() => handleFeedback(msg.id, 1)} className="p-1 hover:text-emerald-300"><ThumbsUp className="h-3 w-3" /></button><button onClick={() => handleFeedback(msg.id, -1)} className="p-1 hover:text-red-300"><ThumbsDown className="h-3 w-3" /></button></div>}</div>
                {msg.role === 'user' && <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#a993ff] text-[#22134d]"><User className="h-5 w-5" /></div>}
              </div>)}
              {isLoading && <div className="flex gap-3"><img src={mascot} alt="AI" className="h-10 w-10 rounded-full border border-[#6035bd] bg-[#190a4b] object-cover object-top" /><div className="rounded-2xl border border-[#30265e] bg-[#171332] p-4"><Loader2 className="h-5 w-5 animate-spin text-[#a75bff]" /></div></div>}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        <div className="relative px-4 pb-4 pt-2 sm:px-8 sm:pb-7">
          <form onSubmit={handleSendMessage} className="mx-auto flex max-w-[940px] items-center gap-2 rounded-2xl border border-[#382477] bg-[#100b2d] px-3 py-2 shadow-[0_0_25px_rgba(112,42,231,.18)] focus-within:border-[#8f4cff]">
            <button type="button" className="p-2 text-white/50 hover:text-white"><Paperclip className="h-5 w-5" /></button><input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} placeholder="Ask LanPya AI anything..." disabled={isLoading} className="min-w-0 flex-1 bg-transparent px-2 py-2 text-sm text-white outline-none placeholder:text-white/35" /><button type="submit" disabled={!inputValue.trim() || isLoading} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#a14cff] to-[#6825ee] text-white shadow-[0_0_18px_rgba(135,48,255,.45)] transition hover:scale-105 disabled:opacity-40"><Send className="h-5 w-5" /></button>
          </form>
        </div>
      </main>
    </div>
  );
}
