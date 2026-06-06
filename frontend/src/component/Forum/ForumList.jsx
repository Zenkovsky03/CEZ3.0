import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../Header';
import { getThreads } from '../../services/forumService';
import './ForumList.scss';

const formatDate = (iso) => {
    const d = new Date(iso);
    const today = new Date();
    const diff = Math.floor((today - d) / 86400000);
    if (diff === 0) return 'dzisiaj';
    if (diff === 1) return 'wczoraj';
    if (diff < 7) return `${diff} dni temu`;
    return new Intl.DateTimeFormat('pl-PL', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(d);
};

const ForumList = () => {
    const [threads, setThreads] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getThreads()
            .then(data => setThreads(Array.isArray(data) ? data : []))
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    const filtered = threads
        .filter(t => !search || t.title.toLowerCase().includes(search.toLowerCase()))
        .sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0));

    return (
        <div className="page-wrapper-forum">
            <Header variant="dashboard" />
            <div className="main-content">
                <div className="page-header">
                    <div className="page-header-text">
                        <h1 className="page-title">Forum</h1>
                        <p className="page-subtitle">Zadaj pytanie lub podziel się wiedzą</p>
                    </div>
                    <Link to="/forum/create" className="btn-primary">
                        <span className="material-symbols-outlined">add</span>
                        Nowy wątek
                    </Link>
                </div>

                <div className="forum-search-bar">
                    <span className="material-symbols-outlined search-icon">search</span>
                    <input
                        type="text"
                        className="forum-search-input"
                        placeholder="Szukaj wątków..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div className="threads-list">
                    {loading && (
                        <div className="empty-state">
                            <p>Ładowanie wątków...</p>
                        </div>
                    )}
                    {!loading && filtered.length === 0 && (
                        <div className="empty-state">
                            <span className="material-symbols-outlined empty-icon">forum</span>
                            <p>Nie znaleziono wątków pasujących do wyszukiwania.</p>
                        </div>
                    )}
                    {filtered.map(t => {
                        const authorName = t.author
                            ? `${t.author.firstName || ''} ${t.author.lastName || ''}`.trim()
                            : t.authorName || 'Nieznany';
                        const initials = authorName.split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase();
                        return (
                            <Link to={`/forum/${t.id}`} key={t.id} className="thread-card">
                                <div className="thread-left">
                                    <div className="thread-author-avatar">{initials}</div>
                                    <div className="thread-info">
                                        <div className="thread-tags">
                                            {t.isPinned && (
                                                <span className="tag tag-pinned">
                                                    <span className="material-symbols-outlined">push_pin</span>
                                                    Przypięty
                                                </span>
                                            )}
                                            {!t.isOpen && <span className="tag tag-closed">Zamknięty</span>}
                                        </div>
                                        <h3 className="thread-title">{t.title}</h3>
                                        <p className="thread-preview">{t.content?.slice(0, 120)}{t.content?.length > 120 ? '...' : ''}</p>
                                        <p className="thread-meta">
                                            {authorName} · {formatDate(t.createdAt)}
                                        </p>
                                    </div>
                                </div>
                                <div className="thread-right">
                                    <div className="reply-count">
                                        <span className="material-symbols-outlined">forum</span>
                                        <span>{t.totalReplies ?? 0}</span>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default ForumList;
