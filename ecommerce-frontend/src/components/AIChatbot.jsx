import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { motion, AnimatePresence } from 'framer-motion';

const AIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Xin chào! Tôi là AI thế hệ mới của KuroTech. Tôi có thể giúp gì cho bạn hôm nay?", isBot: true }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { text: userMessage, isBot: false }]);
    setInput("");
    setIsLoading(true);

    try {
      const history = messages.map(m => ({ 
        role: m.isBot ? 'model' : 'user', 
        content: m.text 
      }));

      const response = await axiosClient.post('/chatbot', { 
        message: userMessage,
        history: history
      });
      const data = response.data.response;
      
      if (typeof data === 'object' && data !== null) {
        setMessages(prev => [...prev, { text: data.text || "...", suggestedProducts: data.suggestedProducts || [], isBot: true }]);
      } else {
        setMessages(prev => [...prev, { text: data, isBot: true }]);
      }
    } catch (error) {
      console.error("Lỗi gọi Chatbot API:", error);
      setMessages(prev => [...prev, { text: "Xin lỗi, đường truyền AI đang bận. Vui lòng thử lại sau.", isBot: true }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Nút bấm mở chat (KuroTech Style) */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button 
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 p-4 bg-slate-900 text-white rounded-full shadow-[0_10px_40px_rgba(15,23,42,0.4)] border border-slate-700/50 z-50 flex items-center justify-center group transition-all"
          >
            <Bot size={26} className="text-slate-100 group-hover:text-emerald-400 transition-colors duration-300" />
            <span className="absolute 0 right-0 top-0 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-slate-900"></span>
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Cửa sổ chat */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9, originX: 1, originY: 1 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed bottom-6 right-6 w-[350px] sm:w-[420px] h-[550px] bg-white rounded-3xl shadow-[0_20px_60px_rgb(0,0,0,0.15)] flex flex-col overflow-hidden z-50 border border-slate-200/50"
          >
            {/* Header */}
            <div className="bg-slate-900 text-white p-5 flex justify-between items-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900"></div>
              <div className="flex items-center gap-3 relative z-10">
                <div className="bg-emerald-500/10 border border-emerald-500/20 p-2.5 rounded-xl backdrop-blur-sm">
                  <Bot size={24} className="text-emerald-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg tracking-tight text-white">KuroAI Assistant</h3>
                  <p className="text-xs text-emerald-400/90 flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
                    Hệ thống trực tuyến
                  </p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white hover:bg-white/10 transition-all p-2 rounded-full relative z-10">
                <X size={18} />
              </button>
            </div>

            {/* Khu vực tin nhắn */}
            <div className="flex-1 overflow-y-auto p-5 bg-[#f8fafc] flex flex-col gap-5">
              <AnimatePresence>
                {messages.map((msg, idx) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ type: "spring", damping: 20 }}
                    key={idx} 
                    className={`flex gap-3 max-w-[88%] ${msg.isBot ? 'self-start' : 'self-end flex-row-reverse'}`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ${msg.isBot ? 'bg-white text-blue-600 border border-blue-100' : 'bg-gradient-to-br from-slate-800 to-slate-900 text-white'}`}>
                      {msg.isBot ? <Bot size={16} /> : <User size={16} />}
                    </div>
                    <div className={`p-4 rounded-3xl text-sm leading-relaxed shadow-sm ${msg.isBot ? 'bg-white border border-slate-100 text-slate-700 rounded-tl-sm' : 'bg-slate-900 text-white rounded-tr-sm'}`}>
                      <div dangerouslySetInnerHTML={{ __html: msg.text.replace(/\n/g, '<br/>') }} />
                      {msg.suggestedProducts && msg.suggestedProducts.length > 0 && (
                        <div className="mt-4 flex flex-col gap-3">
                          {msg.suggestedProducts.map((p, i) => (
                            <motion.div 
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.1 }}
                              key={p._id} 
                              className="flex gap-3 p-3 border border-slate-100 rounded-2xl bg-[#f8fafc] items-center hover:bg-white hover:shadow-md transition-all group"
                            >
                              <img src={p.image || 'https://via.placeholder.com/150'} alt={p.name} className="w-14 h-14 object-cover rounded-xl bg-white shadow-sm" />
                              <div className="flex flex-col flex-1">
                                <span className="text-[13px] font-semibold line-clamp-2 text-slate-800 leading-tight group-hover:text-blue-600 transition-colors">{p.name}</span>
                                <span className="text-[13px] text-emerald-600 font-bold mt-1">{p.price?.toLocaleString('vi-VN')} ₫</span>
                              </div>
                              <Link to={`/product/${p._id}`} className="text-[11px] font-semibold bg-white border border-slate-200 text-slate-700 px-3 py-2 rounded-xl hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all shadow-sm">
                                Xem
                              </Link>
                            </motion.div>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {isLoading && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-3 max-w-[85%] self-start"
                >
                  <div className="w-8 h-8 rounded-full bg-white text-blue-600 border border-blue-100 flex items-center justify-center flex-shrink-0 shadow-sm">
                    <Bot size={16} />
                  </div>
                  <div className="p-4 bg-white border border-slate-100 text-slate-500 rounded-3xl rounded-tl-sm text-sm flex gap-1.5 items-center shadow-sm">
                    <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                    <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Khu vực nhập input */}
            <form onSubmit={handleSend} className="p-4 bg-white border-t border-slate-100 flex gap-3 relative">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Hỏi AI bất cứ điều gì..." 
                className="flex-1 bg-slate-50 border border-slate-200 rounded-full pl-5 pr-12 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
              />
              <button 
                type="submit" 
                disabled={!input.trim() || isLoading}
                className="absolute right-6 top-1/2 -translate-y-1/2 w-9 h-9 bg-slate-900 text-white rounded-full flex items-center justify-center hover:bg-blue-600 transition-all disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed hover:scale-105"
              >
                <Send size={15} className="ml-0.5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIChatbot;
