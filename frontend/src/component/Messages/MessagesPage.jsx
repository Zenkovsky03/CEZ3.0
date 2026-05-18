import React, { useState } from 'react';
import Header from '../Header';
import './MessagesPage.scss';

const STATIC_CONVERSATIONS = [
    {
        id: 'c1',
        type: 'Inquiry',
        status: 'AwaitingTeacherResponse',
        other: { name: 'dr Anna Nowak', avatar: 'AN', role: 'Teacher' },
        lastMessage: 'Dzień dobry, chciałam zapytać o termin oddania projektu...',
        lastMessageAt: '2026-05-18T14:22:00',
        unread: 1,
    },
    {
        id: 'c2',
        type: 'Direct',
        status: 'Open',
        other: { name: 'Marek Wiśniewski', avatar: 'MW', role: 'Student' },
        lastMessage: 'Cześć! Zrobiłeś już zadanie na jutro?',
        lastMessageAt: '2026-05-18T11:05:00',
        unread: 0,
    },
    {
        id: 'c3',
        type: 'Inquiry',
        status: 'Closed',
        other: { name: 'dr hab. Piotr Zieliński', avatar: 'PZ', role: 'Teacher' },
        lastMessage: 'Oczywiście, proszę oddać do piątku.',
        lastMessageAt: '2026-05-15T09:30:00',
        unread: 0,
    },
    {
        id: 'c4',
        type: 'Direct',
        status: 'Open',
        other: { name: 'Zofia Nowak', avatar: 'ZN', role: 'Student' },
        lastMessage: 'Możemy się spotkać w bibliotece o 15:00?',
        lastMessageAt: '2026-05-17T18:50:00',
        unread: 2,
    },
];

const MESSAGES_BY_CONV = {
    c1: [
        { id: 'm1', sender: 'other', text: 'Dzień dobry, chciałam zapytać o termin oddania projektu z modułu 3.', sentAt: '2026-05-18T14:20:00' },
        { id: 'm2', sender: 'me', text: 'Dzień dobry! Termin to 25 maja do godziny 23:59.', sentAt: '2026-05-18T14:21:00' },
        { id: 'm3', sender: 'other', text: 'Dzień dobry, chciałam zapytać o termin oddania projektu...', sentAt: '2026-05-18T14:22:00' },
    ],
    c2: [
        { id: 'm1', sender: 'other', text: 'Hej, jak idzie Ci quiz z Pythona?', sentAt: '2026-05-18T10:55:00' },
        { id: 'm2', sender: 'me', text: 'Całkiem nieźle, pytanie 4 było podchwytliwe!', sentAt: '2026-05-18T11:00:00' },
        { id: 'm3', sender: 'other', text: 'Cześć! Zrobiłeś już zadanie na jutro?', sentAt: '2026-05-18T11:05:00' },
    ],
    c3: [
        { id: 'm1', sender: 'me', text: 'Dzień dobry, czy mogę oddać pracę w poniedziałek?', sentAt: '2026-05-14T16:00:00' },
        { id: 'm2', sender: 'other', text: 'Oczywiście, proszę oddać do piątku.', sentAt: '2026-05-15T09:30:00' },
    ],
    c4: [
        { id: 'm1', sender: 'other', text: 'Hej Zofia! Idziemy na wykład o 12?', sentAt: '2026-05-17T17:30:00' },
        { id: 'm2', sender: 'me', text: 'Jasne, do zobaczenia!', sentAt: '2026-05-17T17:45:00' },
        { id: 'm3', sender: 'other', text: 'Możemy się spotkać w bibliotece o 15:00?', sentAt: '2026-05-17T18:50:00' },
    ],
};

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

const MessagesPage = () => {
    const [activeConv, setActiveConv] = useState('c1');
    const [newMessage, setNewMessage] = useState('');

    const conv = STATIC_CONVERSATIONS.find(c => c.id === activeConv);
    const messages = MESSAGES_BY_CONV[activeConv] || [];

    const handleSend = (e) => {
        e.preventDefault();
        setNewMessage('');
    };

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
                        {STATIC_CONVERSATIONS.map(c => {
                            const st = STATUS_LABELS[c.status];
                            return (
                                <button
                                    key={c.id}
                                    className={`conv-item ${activeConv === c.id ? 'active' : ''}`}
                                    onClick={() => setActiveConv(c.id)}
                                >
                                    <div className="conv-avatar">{c.other.avatar}</div>
                                    <div className="conv-info">
                                        <div className="conv-name-row">
                                            <span className="conv-name">{c.other.name}</span>
                                            <span className="conv-time">{formatDate(c.lastMessageAt)}</span>
                                        </div>
                                        <div className="conv-preview-row">
                                            <span className="conv-preview">{c.lastMessage}</span>
                                            {c.unread > 0 && <span className="unread-dot">{c.unread}</span>}
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </aside>

                {/* Chat area */}
                <div className="chat-area">
                    {conv && (
                        <>
                            <div className="chat-header">
                                <div className="chat-header-info">
                                    <div className="chat-avatar">{conv.other.avatar}</div>
                                    <div>
                                        <p className="chat-name">{conv.other.name}</p>
                                        <span className={`chat-status ${STATUS_LABELS[conv.status].cls}`}>
                                            {STATUS_LABELS[conv.status].label}
                                            {conv.type === 'Inquiry' ? ' · Zapytanie' : ' · Bezpośrednia'}
                                        </span>
                                    </div>
                                </div>
                                {conv.type === 'Inquiry' && conv.status !== 'Closed' && (
                                    <button className="btn-close-conv">
                                        <span className="material-symbols-outlined">lock</span>
                                        Zamknij rozmowę
                                    </button>
                                )}
                            </div>

                            <div className="messages-list">
                                {messages.map(m => (
                                    <div key={m.id} className={`message-bubble ${m.sender === 'me' ? 'mine' : 'theirs'}`}>
                                        <div className="bubble-text">{m.text}</div>
                                        <div className="bubble-time">{formatTime(m.sentAt)}</div>
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
