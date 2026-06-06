import React, { useContext, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Header from '../Header';
import AuthContext from '../../context/AuthContext';
import { getThreadById, createReply, closeThread } from '../../services/forumService';
import './ForumThread.scss';

const formatDateTime = (iso) => {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return '';
    return new Intl.DateTimeFormat('pl-PL', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(d);
};

const ForumThread = () => {
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
                setThread(data?.thread || data?.Thread || data);
                const replyList = data?.thread?.replies?.items || data?.thread?.Replies?.items || data?.replies || data?.Replies || [];
                setReplies(Array.isArray(replyList) ? replyList : []);
            } catch (err) {
                if (!mounted) return;
                setError(err.message || 'Nie udało się pobrać wątku');
            } finally {
                if (mounted) setLoading(false);
            }
        };

        load();
        return () => { mounted = false; };
    }, [id]);

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
            setSuccessMessage('Odpowiedź została dodana!');
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err) {
            setError(err.message || 'Nie udało się dodać odpowiedzi');
        } finally {
            setSending(false);
        }
    };

    const handleClose = async () => {
        try {
            await closeThread(id);
            setThread(prev => ({ ...prev, isClosed: true }));
        } catch (err) {
            setError(err.message || 'Nie udało się zamknąć wątku');
        }
    };

    if (loading) return (
        <div className="page-wrapper-forum-thread">
            <Header variant="dashboard" />
            <div className="main-content"><p>Ładowanie wątku...</p></div>
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
                    Forum
                </Link>

                <div className="thread-card main-thread">
                    <div className="thread-card-header">
                        <div className="thread-meta-row">
                            {thread.courseName && <span className="tag-course">{thread.courseName}</span>}
                            {isClosed && <span className="tag-closed">Zamknięty</span>}
                        </div>
                        <h1 className="thread-title">{thread.title}</h1>
                        <div className="thread-author-row">
                            <div className="author-avatar">
                                {(thread.authorName?.[0] || '?').toUpperCase()}
                            </div>
                            <div>
                                <span className="author-name">{thread.authorName || 'Nieznany'}</span>
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
                                Zamknij wątek
                            </button>
                        )}
                    </div>
                </div>

                <div className="replies-section">
                    <h2 className="replies-title">
                        Odpowiedzi
                        <span className="reply-count">{replies.length}</span>
                    </h2>

                    <div className="replies-list">
                        {replies.length === 0 && <p>Brak odpowiedzi. Bądź pierwszy!</p>}
                        {replies.map(r => (
                            <div key={r.id} className={`reply-card ${r.author?.isTeacher ? 'teacher-reply' : ''}`}>
                                {r.author?.isTeacher && (
                                    <div className="teacher-badge">
                                        <span className="material-symbols-outlined">school</span>
                                        Odpowiedź prowadzącego
                                    </div>
                                )}
                                <div className="reply-header">
                                    <div className={`reply-avatar ${r.author?.isTeacher ? 'teacher-avatar' : ''}`}>
                                        {(r.authorName?.[0] || r.author?.name?.[0] || '?').toUpperCase()}
                                    </div>
                                    <div>
                                        <span className="reply-author">{r.authorName || r.author?.name || 'Nieznany'}</span>
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
                        <h3 className="reply-form-title">Napisz odpowiedź</h3>
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
                                placeholder="Napisz swoją odpowiedź..."
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                rows={5}
                            />
                            <div className="reply-form-footer">
                                <p className="reply-form-hint">
                                    <span className="material-symbols-outlined">info</span>
                                    Bądź uprzejmy i na temat.
                                </p>
                                <button type="submit" className="btn-reply" disabled={!replyText.trim() || sending}>
                                    <span className="material-symbols-outlined">send</span>
                                    {sending ? 'Wysyłanie...' : 'Wyślij odpowiedź'}
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
