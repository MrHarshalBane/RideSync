import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Send, X, AlertOctagon } from 'lucide-react';

export default function ChatDrawer({ rideCode, socket, user, isOpen, onClose, onTriggerSOS }) {
  const [messages, setMessages] = useState([
    {
      id: 'msg_welcome',
      userName: 'System',
      role: 'leader',
      text: `Welcome to RideSync chat session for code ${rideCode}. Safe riding!`,
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (msg) => {
      setMessages((prev) => [...prev, msg]);
    };

    socket.on('new_chat_message', handleNewMessage);

    return () => {
      socket.off('new_chat_message', handleNewMessage);
    };
  }, [socket]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim() || !socket) return;

    socket.emit('send_chat_message', {
      rideCode,
      text: inputText.trim()
    });

    setInputText('');
  };

  if (!isOpen) return null;

  return (
    <div className="glass-panel" style={{ position: 'fixed', bottom: '1.5rem', right: '1.5rem', width: '360px', height: '480px', zIndex: 1100, display: 'flex', flexDirection: 'column', border: '1px solid var(--border-highlight)', borderRadius: '16px', overflow: 'hidden' }}>
      
      {/* Drawer Header */}
      <div style={{ padding: '0.85rem 1rem', background: 'rgba(10,15,26,0.9)', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <MessageSquare size={18} color="var(--accent-orange)" />
          <span style={{ fontFamily: 'Outfit', fontWeight: '700', fontSize: '1rem' }}>In-Ride Group Chat</span>
        </div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
          <X size={18} />
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div style={{ flex: 1, padding: '1rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {messages.map((m) => {
          const isSelf = m.userId === user?.id || m.userId === user?._id;
          return (
            <div key={m.id} style={{ alignSelf: isSelf ? 'flex-end' : 'flex-start', maxWidth: '85%' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '2px', textAlign: isSelf ? 'right' : 'left' }}>
                {m.userName} ({m.role})
              </div>
              <div style={{ background: isSelf ? 'var(--accent-orange)' : 'rgba(255,255,255,0.08)', color: '#fff', padding: '0.6rem 0.85rem', borderRadius: isSelf ? '12px 12px 2px 12px' : '12px 12px 12px 2px', fontSize: '0.85rem', lineHeight: '1.4' }}>
                {m.text}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Emergency SOS & Message Form */}
      <div style={{ padding: '0.75rem', background: 'rgba(10,15,26,0.95)', borderTop: '1px solid var(--border-color)' }}>
        
        {/* Quick SOS Trigger Button */}
        <button onClick={onTriggerSOS} className="btn-danger" style={{ width: '100%', marginBottom: '0.6rem', padding: '0.4rem', fontSize: '0.8rem', justifyContent: 'center' }}>
          <AlertOctagon size={16} /> BROADCAST SOS EMERGENCY
        </button>

        <form onSubmit={handleSend} style={{ display: 'flex', gap: '0.5rem' }}>
          <input
            type="text"
            className="form-control"
            placeholder="Type message..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            style={{ flex: 1, padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}
          />
          <button type="submit" className="btn-primary" style={{ padding: '0.5rem 0.75rem' }}>
            <Send size={16} />
          </button>
        </form>
      </div>

    </div>
  );
}
