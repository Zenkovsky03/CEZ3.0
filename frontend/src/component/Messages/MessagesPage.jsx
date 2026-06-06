import React, { useState, useEffect } from 'react';
import Header from '../Header';
import { getConversations, getConversation, sendMessage } from '../../services/conversationService';
import './MessagesPage.scss';

const STATUS_LABELS = {
    Open: { label: 'Otwarta', cls: 'status-open' },
    AwaitingTeacherResponse: { label: 'Oczekuje', cls: 'status-waiting' },
    AwaitingStudentResponse: { label: 'Oczekuje', cls: 'status-waiting' },
    Closed: { label: 'Zamknięta', cls: 'status-closed' },
};

const formatTime = (iso) =>
    new Intl.DateTimeFormat('pl-PL', { hour: '2-digit', minute: '2-digit' }).format(new Date(iso));

const formatDate = (iso) => {
    const d = new Date(iso);
    const today = new Date();
    if (d.toDateString() === today.toDateString()) return formatTime(iso);
    return new Intl.DateTimeFormat('pl-PL', { day: '2-digit', month: '2-digit' }).format(d);
};

const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase();
};

const MessagesPage = () => {
    const [conversations, setConversations] = useState([]);
    const [activeConv, setActiveConv] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getConversations()
            .then(data => {
                const list = Array.isArray(data) ? data : [];
                setConversations(list);
                if (list.length > 0) handleSelectConv(list[0]);
            })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    const handleSelectConv = async (conv) => {
        setActiveConv(conv);
        try {
            const full = await getConversation(conv.id);
            setMessages(Array.isArray(full?.messages) ? full.messages : []);
        } catch {
            setMessages([]);
        }
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !activeConv) return;
        try {
            await sendMessage(activeConv.id, newMessage.trim());
            setNewMessage('');
            const full = await getConversation(activeConv.id);
            setMessages(Array.isArray(full?.messages) ? full.messages : []);
        } catch {
            // silently fail — message wasn't sent
        }
    };

    const conv = activeConv;
    const statusInfo = conv ? (STATUS_LABELS[conv.status] || { label: conv.status, cls: 'status-open' }) : null;

    return (
        <div className="page-wrapper-messages">
            <Header variant="dashboard" />
            <div className="messages-layout">
                {/* Sidebar */}
                <aside className="conversations-sidebar">
                    <div className="sidebar-header">
                        <h2 className="sidebar-title">Wiadomości</h2>
                        <button className="btn-new-conv" title="Nowa rozmowa">
                            <span className="material-symbols-outlined">edit_square</span>
                        </button>
                    </div>
                    <div className="conv-list">
                        {loading && <p style={{ padding: '1rem', color: 'var(--color-text-muted)' }}>Ładowanie...</p>}
                        {!loading && conversations.length === 0 && (
                            <p style={{ padding: '1rem', color: 'var(--color-text-muted)' }}>Brak konwersacji.</p>
                        )}
                        {conversations.map(c => {
                            const st = STATUS_LABELS[c.status] || { label: c.status, cls: 'status-open' };
                            const otherName = c.recipientName || c.creatorName || 'Nieznany';
                            return (
                                <button
                                    key={c.id}
                                    className={`conv-item ${activeConv?.id === c.id ? 'active' : ''}`}
                                    onClick={() => handleSelectConv(c)}
                                >
                                    <div className="conv-avatar">{getInitials(otherName)}</div>
                                    <div className="conv-info">
                                        <div className="conv-name-row">
                                            <span className="conv-name">{otherName}</span>
                                            <span className="conv-time">{c.updatedAt ? formatDate(c.updatedAt) : ''}</span>
                                        </div>
                                        <div className="conv-preview-row">
                                            <span className="conv-preview">{c.title}</span>
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </aside>

                {/* Chat area */}
                <div className="chat-area">
                    {conv && statusInfo && (
                        <>
                            <div className="chat-header">
                                <div className="chat-header-info">
                                    <div className="chat-avatar">{getInitials(conv.recipientName || conv.creatorName)}</div>
                                    <div>
                                        <p className="chat-name">{conv.recipientName || conv.creatorName || 'Nieznany'}</p>
                                        <span className={`chat-status ${statusInfo.cls}`}>
                                            {statusInfo.label}
                                            {conv.type === 'Inquiry' ? ' · Zapytanie' : ' · Bezpośrednia'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="messages-list">
                                {messages.map(m => (
                                    <div key={m.id} className={`message-bubble ${m.isOwn ? 'mine' : 'theirs'}`}>
                                        <div className="bubble-text">{m.content}</div>
                                        <div className="bubble-time">{m.sentAt ? formatTime(m.sentAt) : ''}</div>
                                    </div>
                                ))}
                            </div>

                            <form className="message-input-row" onSubmit={handleSend}>
                                {conv.status === 'Closed' ? (
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
                    )}
                </div>
            </div>
        </div>
    );
};

export default MessagesPage;
