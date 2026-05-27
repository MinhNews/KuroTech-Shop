// src/components/AIChatbot.jsx
import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';

const AIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Xin chào! Tôi là trợ lý ảo của KuroTech. Tôi có thể giúp gì cho bạn?", isBot: true }
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
      const response = await axiosClient.post('/chatbot', { message: userMessage });
      const data = response.data.response;
      
      if (typeof data === 'object' && data !== null) {
        setMessages(prev => [...prev, { text: data.text || "...", suggestedProducts: data.suggestedProducts || [], isBot: true }]);
      } else {
        setMessages(prev => [...prev, { text: data, isBot: true }]);
      }
    } catch (error) {
      console.error("Lỗi gọi Chatbot API:", error);
      setMessages(prev => [...prev, { text: "Xin lỗi, hệ thống đang bận. Vui lòng thử lại sau.", isBot: true }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Nút bấm mở chat */}
      <button 
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 p-4 bg-slate-900 text-white rounded-full shadow-xl hover:bg-slate-800 hover:scale-105 transition-all z-50 ${isOpen ? 'scale-0 opacity-0 pointer-events-none' : 'scale-100 opacity-100'}`}
      >
        <MessageSquare size={24} />
      </button>

      {/* Cửa sổ chat */}
      <div 
        className={`fixed bottom-6 right-6 w-[350px] sm:w-[400px] h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden z-50 border border-slate-100 transition-all origin-bottom-right ${isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'}`}
      >
        {/* Header */}
        <div className="bg-slate-900 text-white p-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Bot size={24} className="text-primary" />
            <h3 className="font-medium">Trợ lý KuroTech</h3>
          </div>
          <button onClick={() => setIsOpen(false)} className="text-slate-300 hover:text-white transition-colors p-1">
            <X size={20} />
          </button>
        </div>

        {/* Khu vực tin nhắn */}
        <div className="flex-1 overflow-y-auto p-4 bg-slate-50 flex flex-col gap-4">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex gap-3 max-w-[85%] ${msg.isBot ? 'self-start' : 'self-end flex-row-reverse'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.isBot ? 'bg-slate-200 text-slate-700' : 'bg-primary text-white'}`}>
                {msg.isBot ? <Bot size={16} /> : <User size={16} />}
              </div>
              <div className={`p-3 rounded-2xl text-sm ${msg.isBot ? 'bg-white border border-slate-100 text-slate-700 rounded-tl-none' : 'bg-slate-900 text-white rounded-tr-none'}`}>
                <div dangerouslySetInnerHTML={{ __html: msg.text.replace(/\n/g, '<br/>') }} />
                {msg.suggestedProducts && msg.suggestedProducts.length > 0 && (
                  <div className="mt-4 flex flex-col gap-3">
                    {msg.suggestedProducts.map(p => (
                      <div key={p._id} className="flex gap-3 p-3 border border-slate-200 rounded-xl bg-slate-50 items-center shadow-sm">
                        <img src={p.image || 'https://via.placeholder.com/150'} alt={p.name} className="w-14 h-14 object-cover rounded-lg bg-white" />
                        <div className="flex flex-col flex-1">
                          <span className="text-xs font-bold line-clamp-2 text-slate-800 leading-tight">{p.name}</span>
                          <span className="text-xs text-red-500 font-semibold mt-1">{p.price?.toLocaleString('vi-VN')} ₫</span>
                        </div>
                        <Link to={`/product/${p._id}`} className="text-[11px] font-medium bg-primary text-white px-3 py-1.5 rounded-lg hover:bg-primaryHover transition-all shadow-sm">
                          Xem chi tiết
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-3 max-w-[85%] self-start">
              <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center flex-shrink-0">
                <Bot size={16} />
              </div>
              <div className="p-3 bg-white border border-slate-100 text-slate-500 rounded-2xl rounded-tl-none text-sm flex gap-1 items-center">
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Khu vực nhập input */}
        <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-100 flex gap-2">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Nhập tin nhắn..." 
            className="flex-1 bg-slate-100 border-none rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
          />
          <button 
            type="submit" 
            disabled={!input.trim() || isLoading}
            className="w-10 h-10 bg-slate-900 text-white rounded-full flex items-center justify-center hover:bg-slate-800 transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed"
          >
            <Send size={16} className="ml-1" />
          </button>
        </form>
      </div>
    </>
  );
};

export default AIChatbot;
