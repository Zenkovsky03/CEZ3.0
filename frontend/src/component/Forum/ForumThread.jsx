import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Header from '../Header';
import './ForumThread.scss';

const STATIC_THREAD = {
    id: 't1',
    title: 'Jak zrozumieć różnicę między wireframe a prototype?',
    author: { name: 'Anna Kowalska', avatar: 'AK' },
    course: 'UX/UI Design',
    createdAt: '2026-05-17T10:30:00',
    isClosed: false,
    content: `Cześć wszystkim!

Uczę się projektowania UX i mam problem ze zrozumieniem kiedy powinnam używać wireframe, a kiedy prototypu. 

Z tego co rozumiem:
- **Wireframe** to szkic struktury strony, bez szczegółów wizualnych
- **Prototype** to interaktywna wersja projektu

Ale nie jestem pewna gdzie jest granica. Czy low-fidelity prototype to to samo co wireframe? I czy każdy wireframe powinien zostać prototypem?

Będę wdzięczna za pomoc! 🙏`,
    replies: [
        {
            id: 'r1',
            author: { name: 'dr Anna Nowak', avatar: 'AN', isTeacher: true },
            createdAt: '2026-05-17T11:15:00',
            content: `Świetne pytanie! Różnica jest kluczowa w pracy projektanta.

**Wireframe** to statyczny schemat pokazujący układ elementów na stronie – bez kolorów, szczegółowej typografii czy interakcji. Służy do planowania architektury informacji.

**Prototype** to już coś z interakcją – klikalny model pozwalający testować przepływy użytkownika. Może być low-fi (papierowy, Balsamiq) lub high-fi (Figma z animacjami).

Low-fidelity prototype i wireframe to blisko spokrewnione pojęcia, ale wireframe to raczej dokument, a prototype to narzędzie do testowania.`,
        },
        {
            id: 'r2',
            author: { name: 'Marek Wiśniewski', avatar: 'MW', isTeacher: false },
            createdAt: '2026-05-17T14:00:00',
            content: 'Ja to zapamiętałem tak: wireframe odpowiada na "co tu jest?", a prototype na "jak to działa?". Pomogło mi to :)',
        },
        {
            id: 'r3',
            author: { name: 'Zofia Nowak', avatar: 'ZN', isTeacher: false },
            createdAt: '2026-05-18T09:20:00',
            content: 'Polecam też obejrzeć tutoriale na Nielsen Norman Group – mają świetne wyjaśnienie z przykładami.',
        },
    ],
};

const formatDateTime = (iso) =>
    new Intl.DateTimeFormat('pl-PL', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(iso));

const ForumThread = () => {
    const { id } = useParams();
    const [replyText, setReplyText] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleReply = (e) => {
        e.preventDefault();
        setSubmitted(true);
        setReplyText('');
    };

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
                            <span className="tag-course">{STATIC_THREAD.course}</span>
                            {STATIC_THREAD.isClosed && <span className="tag-closed">Zamknięty</span>}
                        </div>
                        <h1 className="thread-title">{STATIC_THREAD.title}</h1>
                        <div className="thread-author-row">
                            <div className="author-avatar">{STATIC_THREAD.author.avatar}</div>
                            <div>
                                <span className="author-name">{STATIC_THREAD.author.name}</span>
                                <span className="post-date"> · {formatDateTime(STATIC_THREAD.createdAt)}</span>
                            </div>
                        </div>
                    </div>
                    <div className="thread-content">
                        {STATIC_THREAD.content.split('\n\n').map((para, i) => (
                            <p key={i}>{para}</p>
                        ))}
                    </div>
                    <div className="thread-actions">
                        <button className="action-btn">
                            <span className="material-symbols-outlined">thumb_up</span>
                            Pomocne
                        </button>
                        <button className="action-btn">
                            <span className="material-symbols-outlined">share</span>
                            Udostępnij
                        </button>
                        <button className="action-btn action-btn-close">
                            <span className="material-symbols-outlined">lock</span>
                            Zamknij wątek
                        </button>
                    </div>
                </div>

                {/* Replies */}
                <div className="replies-section">
                    <h2 className="replies-title">
                        Odpowiedzi
                        <span className="reply-count">{STATIC_THREAD.replies.length}</span>
                    </h2>

                    <div className="replies-list">
                        {STATIC_THREAD.replies.map(r => (
                            <div key={r.id} className={`reply-card ${r.author.isTeacher ? 'teacher-reply' : ''}`}>
                                {r.author.isTeacher && (
                                    <div className="teacher-badge">
                                        <span className="material-symbols-outlined">school</span>
                                        Odpowiedź prowadzącego
                                    </div>
                                )}
                                <div className="reply-header">
                                    <div className={`reply-avatar ${r.author.isTeacher ? 'teacher-avatar' : ''}`}>
                                        {r.author.avatar}
                                    </div>
                                    <div>
                                        <span className="reply-author">{r.author.name}</span>
                                        <span className="reply-date"> · {formatDateTime(r.createdAt)}</span>
                                    </div>
                                </div>
                                <div className="reply-content">
                                    {r.content.split('\n\n').map((p, i) => <p key={i}>{p}</p>)}
                                </div>
                                <div className="reply-actions">
                                    <button className="action-btn-sm">
                                        <span className="material-symbols-outlined">thumb_up</span>
                                        Pomocne
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Reply form */}
                {!STATIC_THREAD.isClosed && (
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
