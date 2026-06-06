import React, { useCallback, useContext, useEffect, useState } from 'react';
import AuthContext from '../../context/AuthContext';
import Header from '../Header';
import { getConversations, getConversationById, sendMessage } from '../../services/conversationService';
import './MessagesPage.scss';

const STATUS_LABELS = {
    Open: { label: 'Otwarta', cls: 'status-open' },
    AwaitingTeacherResponse: { label: 'Oczekuje', cls: 'status-waiting' },
    AwaitingStudentResponse: { label: 'Oczekuje', cls: 'status-waiting' },
    Closed: { label: 'Zamknięta', cls: 'status-closed' },
};

const formatTime = (iso) => {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return '';
    return new Intl.DateTimeFormat('pl-PL', { hour: '2-digit', minute: '2-digit' }).format(d);
};

const formatDate = (iso) => {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return '';
    const now = new Date();
    if (d.toDateString() === now.toDateString()) return formatTime(iso);
    return new Intl.DateTimeFormat('pl-PL', { day: '2-digit', month: '2-digit' }).format(d);
};

const MessagesPage = () => {
    const { user } = useContext(AuthContext);
    const [conversations, setConversations] = useState([]);
    const [activeConvId, setActiveConvId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;

        const load = async () => {
            try {
                const data = await getConversations();
                if (!mounted) return;
                const list = Array.isArray(data) ? data : [];
                setConversations(list);
                if (list.length > 0) {
                    setActiveConvId(list[0].id);
                }
            } catch (err) {
                if (!mounted) return;
                console.error('Failed to load conversations:', err);
            } finally {
                if (mounted) setLoading(false);
            }
        };

        load();
        return () => { mounted = false; };
    }, []);

    const loadMessages = useCallback(async (convId) => {
        try {
            const data = await getConversationById(convId);
            const msgs = data?.messages || data?.Messages || [];
            setMessages(Array.isArray(msgs) ? msgs : []);
        } catch (err) {
            console.error('Failed to load messages:', err);
            setMessages([]);
        }
    }, []);

    useEffect(() => {
        if (activeConvId) {
            loadMessages(activeConvId);
        }
    }, [activeConvId, loadMessages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !activeConvId) return;

        const text = newMessage.trim();
        setNewMessage('');

        try {
            await sendMessage(activeConvId, { Body: text });

            setMessages(prev => [...prev, {
                id: `temp-${Date.now()}`,
                sender: 'me',
                text,
                sentAt: new Date().toISOString()
            }]);
        } catch (err) {
            console.error('Failed to send message:', err);
        }
    };

    const activeConv = conversations.find(c => c.id === activeConvId);

    if (loading) return (
        <div className="page-wrapper-messages">
            <Header variant="dashboard" />
            <div className="messages-layout"><p>Ładowanie wiadomości...</p></div>
        </div>
    );

    return (
        <div className="page-wrapper-messages">
            <Header variant="dashboard" />
            <div className="messages-layout">
                <aside className="conversations-sidebar">
                    <div className="sidebar-header">
                        <h2 className="sidebar-title">Wiadomości</h2>
                    </div>
                    <div className="conv-list">
                        {conversations.length === 0 && <p className="conv-empty">Brak konwersacji.</p>}
                        {conversations.map(c => (
                            <button
                                key={c.id}
                                className={`conv-item ${activeConvId === c.id ? 'active' : ''}`}
                                onClick={() => setActiveConvId(c.id)}
                            >
                                <div className="conv-avatar">
                                    {((c.otherPersonFirstName?.[0] || c.otherPerson?.firstName?.[0] || c.participantName?.[0] || '?').toUpperCase())}
                                </div>
                                <div className="conv-info">
                                    <div className="conv-name-row">
                                        <span className="conv-name">{[c.otherPersonFirstName, c.otherPersonLastName].filter(Boolean).join(' ') || [c.otherPerson?.firstName, c.otherPerson?.lastName].filter(Boolean).join(' ') || c.participantName || 'Nieznany'}</span>
                                        <span className="conv-time">{c.lastMessageAt ? formatDate(c.lastMessageAt) : ''}</span>
                                    </div>
                                    <div className="conv-preview-row">
                                        <span className="conv-preview">{c.lastMessage || ''}</span>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                </aside>

                <div className="chat-area">
                    {activeConv ? (
                        <>
                            <div className="chat-header">
                                <div className="chat-header-info">
                                    <div className="chat-avatar">
                                        {((activeConv.otherPersonFirstName?.[0] || activeConv.otherPerson?.firstName?.[0] || activeConv.participantName?.[0] || '?').toUpperCase())}
                                    </div>
                                    <div>
                                        <p className="chat-name">
                                            {[activeConv.otherPersonFirstName, activeConv.otherPersonLastName].filter(Boolean).join(' ') || [activeConv.otherPerson?.firstName, activeConv.otherPerson?.lastName].filter(Boolean).join(' ') || activeConv.participantName || 'Nieznany'}
                                        </p>
                                        <span className={`chat-status ${STATUS_LABELS[activeConv.status]?.cls || ''}`}>
                                            {STATUS_LABELS[activeConv.status]?.label || activeConv.status}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="messages-list">
                                {messages.length === 0 ? (
                                    <div className="messages-empty">
                                        <span className="material-symbols-outlined">chat</span>
                                        <p>Brak wiadomości. Rozpocznij rozmowę!</p>
                                    </div>
                                ) : messages.map(m => (
                                    <div key={m.id} className={`message-bubble ${m.sender === 'me' || m.senderId === user?.id ? 'mine' : 'theirs'}`}>
                                        {m.sender !== 'me' && m.senderId !== user?.id && m.senderName && (
                                            <div className="bubble-author">{m.senderName}</div>
                                        )}
                                        <div className="bubble-text">{m.body || m.text}</div>
                                        <div className="bubble-time">{formatTime(m.createdAt || m.sentAt)}</div>
                                    </div>
                                ))}
                            </div>

                            <form className="message-input-row" onSubmit={handleSend}>
                                {activeConv.status === 'Closed' ? (
                                    <div className="closed-notice">
                                        <span className="material-symbols-outlined">lock</span>
                                        Rozmowa jest zamknięta
                                    </div>
                                ) : (
                                    <>
                                        <input
                                            type="text"
                                            className="message-input"
                                            placeholder="Napisz wiadomość..."
                                            value={newMessage}
                                            onChange={(e) => setNewMessage(e.target.value)}
                                        />
                                        <button type="submit" className="btn-send" disabled={!newMessage.trim()}>
                                            <span className="material-symbols-outlined">send</span>
                                        </button>
                                    </>
                                )}
                            </form>
                        </>
                    ) : (
                        <div className="no-conv-selected">
                            <span className="material-symbols-outlined">chat</span>
                            <p>Wybierz rozmowę z listy</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MessagesPage;
