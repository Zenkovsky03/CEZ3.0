import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../Header';
import { getThreadHeaders } from '../../services/forumService';
import './ForumList.scss';

const formatDate = (iso) => {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return '';
    const now = new Date();
    const diff = Math.floor((now - d) / 86400000);
    if (diff === 0) return 'dzisiaj';
    if (diff === 1) return 'wczoraj';
    if (diff < 7) return `${diff} dni temu`;
    return new Intl.DateTimeFormat('pl-PL', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(d);
};

const ForumList = () => {
    const [threads, setThreads] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        let mounted = true;

        const load = async () => {
            try {
                const data = await getThreadHeaders(1, 50);
                if (!mounted) return;
                const list = data?.threads || data?.Threads || data?.items || data?.Items || (Array.isArray(data) ? data : []);
                setThreads(list);
            } catch (err) {
                if (!mounted) return;
                setError(err.message || 'Nie udało się pobrać wątków');
            } finally {
                if (mounted) setLoading(false);
            }
        };

        load();
        return () => { mounted = false; };
    }, []);

    const filtered = threads
        .filter(t => !search || ((t.title || '').toLowerCase().includes(search.toLowerCase())))
        .sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0));

    if (loading) return (
        <div className="page-wrapper-forum">
            <Header variant="dashboard" />
            <div className="main-content"><p>Ładowanie forum...</p></div>
        </div>
    );

    if (error) return (
        <div className="page-wrapper-forum">
            <Header variant="dashboard" />
            <div className="main-content"><p className="error-message">{error}</p></div>
        </div>
    );

    return (
        <div className="page-wrapper-forum">
            <Header variant="dashboard" />
            <div className="main-content">
                <div className="page-header">
                    <div className="page-header-text">
                        <h1 className="page-title">Forum</h1>
                        <p className="page-subtitle">Zadaj pytanie lub podziel się wiedzą</p>
                    </div>
                </div>

                <div className="forum-search-bar">
                    <span className="material-symbols-outlined search-icon">search</span>
                    <input type="text" className="forum-search-input" placeholder="Szukaj wątków..." value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>

                <div className="threads-list">
                    {filtered.length === 0 && (
                        <div className="empty-state">
                            <span className="material-symbols-outlined empty-icon">forum</span>
                            <p>Nie znaleziono wątków.</p>
                        </div>
                    )}
                    {filtered.map(t => (
                        <Link to={`/forum/${t.id}`} key={t.id} className="thread-card">
                            <div className="thread-left">
                                <div className="thread-author-avatar">
                                    {((t.author?.firstName?.[0] || t.authorName?.[0] || '?').toUpperCase())}
                                </div>
                                <div className="thread-info">
                                    <div className="thread-tags">
                                        {t.isPinned && (
                                            <span className="tag tag-pinned">
                                                <span className="material-symbols-outlined">push_pin</span>
                                                Przypięty
                                            </span>
                                        )}
                                        {t.isClosed && <span className="tag tag-closed">Zamknięty</span>}
                                        {t.courseName && <span className="tag tag-course">{t.courseName}</span>}
                                    </div>
                                    <h3 className="thread-title">{t.title}</h3>
                                    {t.content && <p className="thread-preview">{t.content.substring(0, 120)}</p>}
                                    <p className="thread-meta">
                                        {t.authorName || 'Nieznany'} · {formatDate(t.createdAt)}
                                    </p>
                                </div>
                            </div>
                            <div className="thread-right">
                                <div className="reply-count">
                                    <span className="material-symbols-outlined">forum</span>
                                    <span>{t.replyCount || t.replies?.length || 0}</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ForumList;
