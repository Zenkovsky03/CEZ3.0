import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import Header from '../Header';
import { getThread, createReply, closeThread } from '../../services/forumService';
import './ForumThread.scss';

const formatDateTime = (iso) =>
    new Intl.DateTimeFormat('pl-PL', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(iso));

const ForumThread = () => {
    const { id } = useParams();
    const [thread, setThread] = useState(null);
    const [replyText, setReplyText] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(true);

    const loadThread = async () => {
        try {
            const data = await getThread(id);
            setThread(data);
        } catch {
            // failed to load
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadThread();
    }, [id]);

    const handleReply = async (e) => {
        e.preventDefault();
        if (!replyText.trim()) return;
        try {
            await createReply(id, replyText.trim());
            setSubmitted(true);
            setReplyText('');
            await loadThread();
        } catch {
            alert('Nie udało się dodać odpowiedzi.');
        }
    };

    const handleClose = async () => {
        if (!window.confirm('Czy na pewno chcesz zamknąć ten wątek?')) return;
        try {
            await closeThread(id);
            await loadThread();
        } catch {
            alert('Nie udało się zamknąć wątku.');
        }
    };

    if (loading) {
        return (
            <div className="page-wrapper-forum-thread">
                <Header variant="dashboard" />
                <div className="main-content">
                    <p>Ładowanie...</p>
                </div>
            </div>
        );
    }

    if (!thread) {
        return (
            <div className="page-wrapper-forum-thread">
                <Header variant="dashboard" />
                <div className="main-content">
                    <Link to="/forum" className="back-link">
                        <span className="material-symbols-outlined">arrow_back</span>
                        Forum
                    </Link>
                    <p>Nie znaleziono wątku.</p>
                </div>
            </div>
        );
    }

    const authorName = thread.author
        ? `${thread.author.firstName || ''} ${thread.author.lastName || ''}`.trim()
        : 'Nieznany';
    const authorInitials = authorName.split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase();
    const replies = thread.replies?.items || thread.replies || [];

    return (
        <div className="page-wrapper-forum-thread">
            <Header variant="dashboard" />
            <div className="main-content">
                <Link to="/forum" className="back-link">
                    <span className="material-symbols-outlined">arrow_back</span>
                    Forum
                </Link>

                {/* Thread body */}
                <div className="thread-card main-thread">
                    <div className="thread-card-header">
                        <div className="thread-meta-row">
                            {!thread.isOpen && <span className="tag-closed">Zamknięty</span>}
                        </div>
                        <h1 className="thread-title">{thread.title}</h1>
                        <div className="thread-author-row">
                            <div className="author-avatar">{authorInitials}</div>
                            <div>
                                <span className="author-name">{authorName}</span>
                                <span className="post-date"> · {formatDateTime(thread.createdAt)}</span>
                            </div>
                        </div>
                    </div>
                    <div className="thread-content">
                        {thread.content?.split('\n\n').map((para, i) => (
                            <p key={i}>{para}</p>
                        ))}
                    </div>
                    <div className="thread-actions">
                        {thread.isOpen && (
                            <button className="action-btn action-btn-close" onClick={handleClose}>
                                <span className="material-symbols-outlined">lock</span>
                                Zamknij wątek
                            </button>
                        )}
                    </div>
                </div>

                {/* Replies */}
                <div className="replies-section">
                    <h2 className="replies-title">
                        Odpowiedzi
                        <span className="reply-count">{replies.length}</span>
                    </h2>

                    <div className="replies-list">
                        {replies.map(r => {
                            const rName = r.authorName || 'Nieznany';
                            const rInitials = rName.split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase();
                            return (
                                <div key={r.id} className="reply-card">
                                    <div className="reply-header">
                                        <div className="reply-avatar">{rInitials}</div>
                                        <div>
                                            <span className="reply-author">{rName}</span>
                                            <span className="reply-date"> · {formatDateTime(r.createdAt)}</span>
                                        </div>
                                    </div>
                                    <div className="reply-content">
                                        {r.content?.split('\n\n').map((p, i) => <p key={i}>{p}</p>)}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Reply form */}
                {thread.isOpen && (
                    <div className="reply-form-card">
                        <h3 className="reply-form-title">Napisz odpowiedź</h3>
                        {submitted && (
                            <div className="reply-success">
                                <span className="material-symbols-outlined">check_circle</span>
                                Odpowiedź została dodana!
                            </div>
                        )}
                        <form onSubmit={handleReply}>
                            <textarea
                                className="reply-textarea"
                                placeholder="Napisz swoją odpowiedź... Możesz użyć formatowania Markdown."
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                rows={5}
                            />
                            <div className="reply-form-footer">
                                <p className="reply-form-hint">
                                    <span className="material-symbols-outlined">info</span>
                                    Bądź uprzejmy i na temat. Forum służy do nauki i wzajemnej pomocy.
                                </p>
                                <button
                                    type="submit"
                                    className="btn-reply"
                                    disabled={!replyText.trim()}
                                >
                                    <span className="material-symbols-outlined">send</span>
                                    Wyślij odpowiedź
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
