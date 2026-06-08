import React, { useContext, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Header from '../Header';
import Spinner from '../Spinner';
import AuthContext from '../../context/AuthContext';
import { getThreadById, createReply, closeThread } from '../../services/forumService';
import './ForumThread.scss';

const formatDateTime = (iso) => {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return '';
    return new Intl.DateTimeFormat(undefined, { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(d);
};

const ForumThread = () => {
    const { t } = useTranslation();
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const [thread, setThread] = useState(null);
    const [replies, setReplies] = useState([]);
    const [replyText, setReplyText] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [sending, setSending] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        let mounted = true;

        const load = async () => {
            try {
                const data = await getThreadById(id);
                if (!mounted) return;
                const t = data?.thread || data?.Thread || data;
                if (t) {
                    const authorName = t.author
                        ? [t.author.firstName, t.author.lastName].filter(Boolean).join(' ') || t('common.unknown')
                        : t.authorName || t('common.unknown');
                    setThread({ ...t, authorName, isClosed: t.isClosed ?? !t.isOpen });
                }
                const replyList = data?.thread?.replies?.items || data?.thread?.Replies?.items || data?.replies || data?.Replies || [];
                setReplies(Array.isArray(replyList) ? replyList : []);
            } catch (err) {
                if (!mounted) return;
                setError(err.message || t('error.load_thread'));
            } finally {
                if (mounted) setLoading(false);
            }
        };

        load();
        return () => { mounted = false; };
    }, [id, t]);

    const handleReply = async (e) => {
        e.preventDefault();
        if (!replyText.trim()) return;

        setSending(true);
        setError('');

        try {
            const result = await createReply({
                ThreadId: id,
                Content: replyText.trim()
            });

            const newReply = {
                id: result?.threadReplayId || result?.id,
                author: { name: user?.firstName + ' ' + user?.lastName, avatar: (user?.firstName?.[0] || '') + (user?.lastName?.[0] || ''), isTeacher: user?.role === 'Teacher' || user?.role === 'Admin' },
                createdAt: new Date().toISOString(),
                content: replyText.trim()
            };

            setReplies(prev => [...prev, newReply]);
            setReplyText('');
            setSuccessMessage(t('forum.reply_added'));
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err) {
            setError(err.message || t('forum.reply_error'));
        } finally {
            setSending(false);
        }
    };

    const handleClose = async () => {
        try {
            await closeThread(id);
            setThread(prev => ({ ...prev, isClosed: true }));
        } catch (err) {
            setError(err.message || t('forum.close_error'));
        }
    };

    if (loading) return (
        <div className="page-wrapper-forum-thread">
            <Header variant="dashboard" />
            <div className="main-content"><Spinner size="lg" /></div>
        </div>
    );

    if (error && !thread) return (
        <div className="page-wrapper-forum-thread">
            <Header variant="dashboard" />
            <div className="main-content"><p className="error-message">{error}</p></div>
        </div>
    );

    if (!thread) return null;

    const isClosed = thread.isClosed;

    return (
        <div className="page-wrapper-forum-thread">
            <Header variant="dashboard" />
            <div className="main-content">
                <Link to="/forum" className="back-link">
                    <span className="material-symbols-outlined">arrow_back</span>
                    {t('forum.title')}
                </Link>

                <div className="thread-card main-thread">
                    <div className="thread-card-header">
                        <div className="thread-meta-row">
                            {thread.courseName && <span className="tag-course">{thread.courseName}</span>}
                            {isClosed && <span className="tag-closed">{t('forum.closed')}</span>}
                        </div>
                        <h1 className="thread-title">{thread.title}</h1>
                        <div className="thread-author-row">
                            <div className="author-avatar">
                                {(thread.authorName?.[0] || '?').toUpperCase()}
                            </div>
                            <div>
                                <span className="author-name">{thread.authorName || t('common.unknown')}</span>
                                <span className="post-date"> · {formatDateTime(thread.createdAt)}</span>
                            </div>
                        </div>
                    </div>
                    <div className="thread-content">
                        {(thread.content || '').split('\n\n').map((para, i) => (
                            <p key={i}>{para}</p>
                        ))}
                    </div>
                    <div className="thread-actions">
                        {!isClosed && (user?.role === 'Teacher' || user?.role === 'Admin') && (
                            <button className="action-btn action-btn-close" onClick={handleClose}>
                                <span className="material-symbols-outlined">lock</span>
                                {t('forum.close_thread')}
                            </button>
                        )}
                    </div>
                </div>

                <div className="replies-section">
                    <h2 className="replies-title">
                        {t('forum.replies')}
                        <span className="reply-count">{replies.length}</span>
                    </h2>

                    <div className="replies-list">
                        {replies.length === 0 && <p>{t('forum.no_replies')}</p>}
                        {replies.map(r => (
                            <div key={r.id} className={`reply-card ${r.author?.isTeacher ? 'teacher-reply' : ''}`}>
                                {r.author?.isTeacher && (
                                    <div className="teacher-badge">
                                        <span className="material-symbols-outlined">school</span>
                                        {t('forum.teacher_reply')}
                                    </div>
                                )}
                                <div className="reply-header">
                                    <div className={`reply-avatar ${r.author?.isTeacher ? 'teacher-avatar' : ''}`}>
                                        {(r.authorName?.[0] || r.author?.name?.[0] || '?').toUpperCase()}
                                    </div>
                                    <div>
                                        <span className="reply-author">{r.authorName || r.author?.name || t('common.unknown')}</span>
                                        <span className="reply-date"> · {formatDateTime(r.createdAt)}</span>
                                    </div>
                                </div>
                                <div className="reply-content">
                                    {(r.content || '').split('\n\n').map((p, i) => <p key={i}>{p}</p>)}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {!isClosed && (
                    <div className="reply-form-card">
                        <h3 className="reply-form-title">{t('forum.write_reply')}</h3>
                        {successMessage && (
                            <div className="reply-success">
                                <span className="material-symbols-outlined">check_circle</span>
                                {successMessage}
                            </div>
                        )}
                        {error && <div className="error-message">{error}</div>}
                        <form onSubmit={handleReply}>
                            <textarea
                                className="reply-textarea"
                                placeholder={t('forum.reply_placeholder')}
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                rows={5}
                            />
                            <div className="reply-form-footer">
                                <p className="reply-form-hint">
                                    <span className="material-symbols-outlined">info</span>
                                    {t('forum.be_respectful')}
                                </p>
                                <button type="submit" className="btn-reply" disabled={!replyText.trim() || sending}>
                                    <span className="material-symbols-outlined">send</span>
                                    {sending ? t('common.sending') : t('forum.send_reply')}
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ForumThread;
