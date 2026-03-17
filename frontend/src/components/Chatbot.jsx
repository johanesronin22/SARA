import React, { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([{ text: "Hi! I'm SARA. Ask me anything about stocks, like 'What is a P/E ratio?' or 'Why is Tesla down today?'", sender: 'bot' }]);
  const [input, setInput] = useState('');

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    setMessages([...messages, { text: input, sender: 'user' }]);
    setInput('');
    
    // Mock SARA response
    setTimeout(() => {
      setMessages(prev => [...prev, { text: "I'm currently in demo mode, but I will be powered by Gemini to provide real-time market analysis!", sender: 'bot' }]);
    }, 1000);
  };

  return (
    <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 1000 }}>
      {isOpen && (
        <div className="glass-panel" style={{ 
          width: '350px', 
          height: '500px', 
          marginBottom: '1rem',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}>
          <div style={{ 
            padding: '1rem', 
            borderBottom: '1px solid var(--color-border)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 240, 255, 0.1)'
          }}>
            <h3 style={{ margin: 0, fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <MessageCircle size={18} className="neon-text" />
              SARA AI Assistant
            </h3>
            <button onClick={() => setIsOpen(false)} style={{ color: 'var(--color-text-muted)' }}>
              <X size={20} />
            </button>
          </div>
          
          <div style={{ flex: 1, padding: '1rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {messages.map((msg, idx) => (
              <div key={idx} style={{
                alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                backgroundColor: msg.sender === 'user' ? 'var(--color-accent-neon)' : 'var(--color-surface)',
                color: msg.sender === 'user' ? 'var(--color-bg-deep)' : 'var(--color-text-main)',
                padding: '0.75rem 1rem',
                borderRadius: '12px',
                borderBottomRightRadius: msg.sender === 'user' ? '2px' : '12px',
                borderBottomLeftRadius: msg.sender === 'bot' ? '2px' : '12px',
                maxWidth: '85%',
                fontSize: '0.875rem',
                lineHeight: 1.4
              }}>
                {msg.text}
              </div>
            ))}
          </div>

          <form onSubmit={handleSend} style={{ 
            padding: '1rem', 
            borderTop: '1px solid var(--color-border)',
            display: 'flex',
            gap: '0.5rem'
          }}>
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask SARA..." 
              style={{
                flex: 1,
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                padding: '0.5rem 1rem',
                color: 'var(--color-text-main)',
                outline: 'none'
              }}
            />
            <button type="submit" className="flex-center" style={{
              background: 'var(--color-accent-neon)',
              color: 'var(--color-bg-deep)',
              width: '40px',
              height: '40px',
              borderRadius: 'var(--radius-md)',
            }}>
              <Send size={18} />
            </button>
          </form>
        </div>
      )}

      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="flex-center"
          style={{
            width: '60px',
            height: '60px',
            borderRadius: 'var(--radius-full)',
            background: 'var(--color-bg-deep)',
            border: '2px solid var(--color-accent-neon)',
            boxShadow: '0 0 20px var(--color-accent-neon-glow)',
            color: 'var(--color-accent-neon)',
            cursor: 'pointer',
            transition: 'transform 0.3s'
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          <MessageCircle size={30} />
        </button>
      )}
    </div>
  );
};

export default Chatbot;
