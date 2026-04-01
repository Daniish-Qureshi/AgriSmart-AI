import { useState, useRef, useEffect } from 'react';

export default function AgriBot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([{ sender: 'bot', text: 'Namaste! 👋 Main Agri-Bot hu. Aap apni kheti, mitti, ya mausam ke baare mein kuch bhi puch sakte hain!' }]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const sendMessage = async () => {
        if (!input.trim()) return;
        const userMessage = input.trim();
        setMessages(prev => [...prev, { sender: 'user', text: userMessage }]);
        setInput('');
        setLoading(true);

        const token = localStorage.getItem('token');

        try {
           const res = await fetch(`${import.meta.env.VITE_API_URL}/api/ai/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ message: userMessage })
            });
            const data = await res.json();

            if (res.ok) {
                setMessages(prev => [...prev, { sender: 'bot', text: data.reply }]);
            } else {
                setMessages(prev => [...prev, { sender: 'bot', text: 'Error: ' + (data.error || 'Server connection failed.') }]);
            }
        } catch (err) {
            setMessages(prev => [...prev, { sender: 'bot', text: 'Network issue. Kuch der connection check karein.' }]);
        }
        setLoading(false);
    };

    return (
        <>
            {/* Floating Toggle Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    style={{
                        position: 'fixed', bottom: 30, right: 30, zIndex: 9999,
                        width: 60, height: 60, borderRadius: '50%',
                        background: 'linear-gradient(135deg, #2d7a4f, #e8b84b)',
                        border: 'none', cursor: 'pointer',
                        boxShadow: '0 10px 25px rgba(232,184,75,0.4)',
                        fontSize: '1.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'transform 0.3s'
                    }}
                    onMouseOver={e => e.currentTarget.style.transform = 'scale(1.1)'}
                    onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                >
                    🤖
                </button>
            )}

            {/* Chat Window */}
            {isOpen && (
                <div style={{
                    position: 'fixed', bottom: 30, right: 30, zIndex: 9999,
                    width: 360, height: 500, background: 'rgba(13,40,24,0.98)',
                    border: '1px solid rgba(76,175,114,0.3)', borderRadius: 20,
                    boxShadow: '0 15px 40px rgba(0,0,0,0.5)', display: 'flex', flexDirection: 'column',
                    fontFamily: "'DM Sans', sans-serif", color: '#fff'
                }}>
                    {/* Header */}
                    <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(76,175,114,0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(232,184,75,0.05)', borderRadius: '20px 20px 0 0' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div style={{ width: 34, height: 34, background: '#e8b84b', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>🤖</div>
                            <div>
                                <div style={{ fontWeight: 700, fontFamily: "'Playfair Display', serif", fontSize: '1.1rem' }}>Agri-Bot</div>
                                <div style={{ fontSize: '0.7rem', color: '#4caf72', display: 'flex', alignItems: 'center', gap: 4 }}>
                                    <div style={{ width: 6, height: 6, background: '#4caf72', borderRadius: '50%' }} /> Active
                                </div>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: '#a8c4b0', fontSize: '1.4rem', cursor: 'pointer' }}>×</button>
                    </div>

                    {/* Messages Gallery */}
                    <div style={{ flex: 1, padding: 20, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
                        {messages.map((m, i) => (
                            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: m.sender === 'user' ? 'flex-end' : 'flex-start' }}>
                                <div style={{
                                    maxWidth: '85%', padding: '12px 16px', borderRadius: 16, fontSize: '0.88rem', lineHeight: 1.5,
                                    background: m.sender === 'user' ? '#e8b84b' : 'rgba(76,175,114,0.15)',
                                    color: m.sender === 'user' ? '#0d2818' : '#e0e0e0',
                                    borderBottomRightRadius: m.sender === 'user' ? 4 : 16,
                                    borderBottomLeftRadius: m.sender === 'bot' ? 4 : 16,
                                    whiteSpace: 'pre-line' // To respect Gemini bullet points formatting
                                }}>
                                    {m.text}
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div style={{ background: 'rgba(76,175,114,0.15)', padding: '12px 16px', borderRadius: '16px 16px 16px 4px', fontSize: '0.85rem', color: '#a8c4b0', width: 'max-content' }}>
                                Agri-Bot soch raha hai...
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div style={{ padding: 16, borderTop: '1px solid rgba(76,175,114,0.2)' }}>
                        <div style={{ display: 'flex', gap: 10 }}>
                            <input
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                onKeyPress={e => e.key === 'Enter' && sendMessage()}
                                placeholder="🌾 Apne sawal likhein..."
                                style={{ flex: 1, padding: '12px 16px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(76,175,114,0.2)', borderRadius: 12, color: '#fff', fontSize: '0.88rem', outline: 'none' }}
                            />
                            <button
                                onClick={sendMessage}
                                disabled={loading || !input.trim()}
                                style={{ width: 44, height: 44, background: '#4caf72', border: 'none', borderRadius: 12, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: input.trim() ? 'pointer' : 'not-allowed', opacity: input.trim() ? 1 : 0.5, transition: 'all 0.3s' }}
                            >
                                ➥
                            </button>
                        </div>
                        <div style={{ textAlign: 'center', fontSize: '0.65rem', color: '#a8c4b0', marginTop: 10 }}>
                            Powered by AgriSmart-AI ✨
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
