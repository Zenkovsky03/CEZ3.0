import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Header from '../Header';
import Spinner from '../Spinner';
import AuthContext from '../../context/AuthContext';
import { getThreadHeaders } from '../../services/forumService';
import CreateThreadModal from './CreateThreadModal';
import './ForumList.scss';

const formatDate = (iso) => {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return '';
    const now = new Date();
    const diff = Math.floor((now - d) / 86400000);
    if (diff === 0) return 'dzisiaj';
    if (diff === 1) return 'wczoraj';
    if (diff < 7) return `${diff} dni temu`;
    return new Intl.DateTimeFormat(undefined, { day: '2-digit', month: '2-digit', year: 'numeric' }).format(d);
};

const ForumList = () => {
    const { t } = useTranslation();
    const { user } = useContext(AuthContext);
    const [threads, setThreads] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);

    useEffect(() => {
        let mounted = true;

        const load = async () => {
            try {
                const data = await getThreadHeaders(1, 50);
                if (!mounted) return;
                const raw = data?.threads || data?.Threads || data?.items || data?.Items || (Array.isArray(data) ? data : []);
                const list = (Array.isArray(raw) ? raw : []).map(t => ({
                    ...t,
                    isClosed: t.isClosed ?? !t.isOpen,
                    replyCount: t.replyCount || t.totalReplies || t.replies?.length || 0
                }));
                setThreads(list);
            } catch (err) {
                if (!mounted) return;
                setError(err.message || t('error.load_threads'));
            } finally {
                if (mounted) setLoading(false);
            }
        };

        load();
        return () => { mounted = false; };
    }, [t]);

    const filtered = threads
        .filter(t => !search || ((t.title || '').toLowerCase().includes(search.toLowerCase())))
        .sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0));

    if (loading) return (
        <div className="page-wrapper-forum">
            <Header variant="dashboard" />
            <div className="main-content"><Spinner size="lg" /></div>
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
                        <h1 className="page-title">{t('forum.title')}</h1>
                        <p className="page-subtitle">{t('forum.subtitle')}</p>
                    </div>
                    {user && (
                        <button className="btn-primary" onClick={() => setShowCreateModal(true)}>
                            <span className="material-symbols-outlined">add</span>
                            {t('forum.new_thread')}
                        </button>
                    )}
                </div>

                <div className="forum-search-bar">
                    <span className="material-symbols-outlined search-icon">search</span>
                    <input type="text" className="forum-search-input" placeholder={t('forum.search')} value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>

                <div className="threads-list">
                    {filtered.length === 0 && (
                        <div className="empty-state">
                            <span className="material-symbols-outlined empty-icon">forum</span>
                            <p>{t('forum.no_threads')}</p>
                        </div>
                    )}
                    {filtered.map(th => (
                        <Link to={`/forum/${th.id}`} key={th.id} className="thread-card">
                            <div className="thread-left">
                                <div className="thread-author-avatar">
                                    {((th.author?.firstName?.[0] || th.authorName?.[0] || '?').toUpperCase())}
                                </div>
                                <div className="thread-info">
                                    <div className="thread-tags">
                                        {th.isPinned && (
                                            <span className="tag tag-pinned">
                                                <span className="material-symbols-outlined">push_pin</span>
                                                {t('forum.pinned')}
                                            </span>
                                        )}
                                        {th.isClosed && <span className="tag tag-closed">{t('forum.closed')}</span>}
                                        {th.courseName && <span className="tag tag-course">{th.courseName}</span>}
                                    </div>
                                    <h3 className="thread-title">{th.title}</h3>
                                    {th.content && <p className="thread-preview">{th.content.substring(0, 120)}</p>}
                                    <p className="thread-meta">
                                        {th.authorName || t('common.unknown')} · {formatDate(th.createdAt)}
                                    </p>
                                </div>
                            </div>
                            <div className="thread-right">
                                <div className="reply-count">
                                    <span className="material-symbols-outlined">forum</span>
                                    <span>{th.replyCount || th.replies?.length || 0}</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
            <CreateThreadModal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} />
        </div>
    );
};

export default ForumList;
