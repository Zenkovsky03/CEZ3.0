import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../Header';
import './ForumList.scss';

const STATIC_THREADS = [
    {
        id: 't1',
        title: 'Jak zrozumieć różnicę między wireframe a prototype?',
        author: { name: 'Anna Kowalska', avatar: 'AK' },
        course: 'UX/UI Design',
        createdAt: '2026-05-17T10:30:00',
        replyCount: 8,
        isClosed: false,
        isPinned: true,
        preview: 'Mam problem ze zrozumieniem kiedy używamy wireframe a kiedy prototypu...',
    },
    {
        id: 't2',
        title: 'Błąd TypeError przy imporcie modułu os w Pythonie',
        author: { name: 'Piotr Jabłoński', avatar: 'PJ' },
        course: 'Wprowadzenie do Pythona',
        createdAt: '2026-05-18T08:15:00',
        replyCount: 3,
        isClosed: false,
        isPinned: false,
        preview: 'Kiedy próbuję zaimportować moduł os, pojawia się nieoczekiwany błąd...',
    },
    {
        id: 't3',
        title: 'Zasoby do nauki Figmy – polecane kursy i tutoriale',
        author: { name: 'dr Anna Nowak', avatar: 'AN' },
        course: 'UX/UI Design',
        createdAt: '2026-05-10T12:00:00',
        replyCount: 15,
        isClosed: false,
        isPinned: true,
        preview: 'Zebrałam listę najlepszych materiałów do nauki projektowania w Figmie...',
    },
    {
        id: 't4',
        title: 'Pytanie o różnicę między list a tuple w Pythonie',
        author: { name: 'Marek Wiśniewski', avatar: 'MW' },
        course: 'Wprowadzenie do Pythona',
        createdAt: '2026-05-14T16:45:00',
        replyCount: 6,
        isClosed: true,
        isPinned: false,
        preview: 'Kiedy powinno się używać list, a kiedy tuple? Czy wydajność ma znaczenie?',
    },
    {
        id: 't5',
        title: 'Terminarz zaliczeń – ważne daty i wymagania',
        author: { name: 'dr hab. Piotr Zieliński', avatar: 'PZ' },
        course: 'Wprowadzenie do Pythona',
        createdAt: '2026-05-01T09:00:00',
        replyCount: 2,
        isClosed: false,
        isPinned: true,
        preview: 'Informacje o terminach zaliczeń i wymaganiach do zaliczenia kursu...',
    },
];

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
    const [search, setSearch] = useState('');

    const filtered = STATIC_THREADS
        .filter(t => !search || t.title.toLowerCase().includes(search.toLowerCase()))
        .sort((a, b) => b.isPinned - a.isPinned);

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
                    {filtered.length === 0 && (
                        <div className="empty-state">
                            <span className="material-symbols-outlined empty-icon">forum</span>
                            <p>Nie znaleziono wątków pasujących do wyszukiwania.</p>
                        </div>
                    )}
                    {filtered.map(t => (
                        <Link to={`/forum/${t.id}`} key={t.id} className="thread-card">
                            <div className="thread-left">
                                <div className="thread-author-avatar">{t.author.avatar}</div>
                                <div className="thread-info">
                                    <div className="thread-tags">
                                        {t.isPinned && (
                                            <span className="tag tag-pinned">
                                                <span className="material-symbols-outlined">push_pin</span>
                                                Przypięty
                                            </span>
                                        )}
                                        {t.isClosed && <span className="tag tag-closed">Zamknięty</span>}
                                        <span className="tag tag-course">{t.course}</span>
                                    </div>
                                    <h3 className="thread-title">{t.title}</h3>
                                    <p className="thread-preview">{t.preview}</p>
                                    <p className="thread-meta">
                                        {t.author.name} · {formatDate(t.createdAt)}
                                    </p>
                                </div>
                            </div>
                            <div className="thread-right">
                                <div className="reply-count">
                                    <span className="material-symbols-outlined">forum</span>
                                    <span>{t.replyCount}</span>
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
