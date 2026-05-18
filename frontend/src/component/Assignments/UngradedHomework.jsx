import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../Header';
import './UngradedHomework.scss';

const STATIC_SUBMISSIONS = [
    {
        id: 's1',
        student: { name: 'Anna Kowalska', avatar: 'AK' },
        assignment: 'Praca domowa: Projekt makiety UX',
        course: 'UX/UI Design',
        submittedAt: '2026-05-18T14:30:00',
        submissionText: 'Stworzyłam makietę w Figmie. Link poniżej. Skupiłam się na prostocie nawigacji.',
        attachmentUrl: 'https://figma.com/file/example-ux-project',
    },
    {
        id: 's2',
        student: { name: 'Marek Wiśniewski', avatar: 'MW' },
        assignment: 'Praca domowa: Projekt makiety UX',
        course: 'UX/UI Design',
        submittedAt: '2026-05-18T09:15:00',
        submissionText: 'Projekt oparłem na wzorcach Material Design. Plik PDF zawiera 12 ekranów.',
        attachmentUrl: 'https://drive.google.com/file/example-pdf',
    },
    {
        id: 's3',
        student: { name: 'Zofia Nowak', avatar: 'ZN' },
        assignment: 'Praca domowa: Analiza przypadku biznesowego',
        course: 'UX/UI Design',
        submittedAt: '2026-05-17T22:45:00',
        submissionText: 'Analiza dotyczy serwisu e-commerce z branży modowej. Zidentyfikowałam 5 kluczowych problemów UX.',
        attachmentUrl: 'https://docs.google.com/document/example-analysis',
    },
    {
        id: 's4',
        student: { name: 'Piotr Jabłoński', avatar: 'PJ' },
        assignment: 'Praca domowa: Projekt makiety UX',
        course: 'UX/UI Design',
        submittedAt: '2026-05-19T11:00:00',
        submissionText: '',
        attachmentUrl: 'https://xd.adobe.com/view/example-xd-project',
    },
];

const GRADES = ['2', '3', '3+', '4', '4+', '5', '5!'];

const formatDate = (iso) =>
    new Intl.DateTimeFormat('pl-PL', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }).format(new Date(iso));

const UngradedHomework = () => {
    const [grading, setGrading] = useState({});
    const [saved, setSaved] = useState({});

    const handleGradeChange = (id, field, value) => {
        setGrading(prev => ({ ...prev, [id]: { ...prev[id], [field]: value } }));
    };

    const handleSave = (id) => {
        setSaved(prev => ({ ...prev, [id]: true }));
    };

    return (
        <div className="page-wrapper-ungraded">
            <Header variant="dashboard" />
            <div className="main-content">
                <div className="page-header">
                    <div className="page-header-text">
                        <Link to="/assignments" className="back-link">
                            <span className="material-symbols-outlined">arrow_back</span>
                            Zadania
                        </Link>
                        <h1 className="page-title">Prace do oceniania</h1>
                        <p className="page-subtitle">
                            <span className="count-badge">{STATIC_SUBMISSIONS.length}</span>
                            nieoce­nionych prac
                        </p>
                    </div>
                </div>

                <div className="submissions-list">
                    {STATIC_SUBMISSIONS.map(sub => (
                        <div key={sub.id} className={`submission-card ${saved[sub.id] ? 'graded' : ''}`}>
                            {saved[sub.id] && (
                                <div className="graded-banner">
                                    <span className="material-symbols-outlined">check_circle</span>
                                    Oceniono pomyślnie
                                </div>
                            )}
                            <div className="submission-header">
                                <div className="student-info">
                                    <div className="student-avatar">{sub.student.avatar}</div>
                                    <div>
                                        <p className="student-name">{sub.student.name}</p>
                                        <p className="submission-meta">
                                            {sub.assignment} · {sub.course}
                                        </p>
                                    </div>
                                </div>
                                <div className="submission-date">
                                    <span className="material-symbols-outlined">schedule</span>
                                    {formatDate(sub.submittedAt)}
                                </div>
                            </div>

                            {sub.submissionText && (
                                <div className="submission-text">
                                    <p className="submission-text-label">Komentarz studenta</p>
                                    <p>{sub.submissionText}</p>
                                </div>
                            )}

                            <a
                                href={sub.attachmentUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="attachment-link"
                            >
                                <span className="material-symbols-outlined">open_in_new</span>
                                Otwórz pracę
                            </a>

                            <div className="grading-form">
                                <div className="grade-group">
                                    <label className="grade-label">Ocena</label>
                                    <div className="grade-buttons">
                                        {GRADES.map(g => (
                                            <button
                                                key={g}
                                                className={`grade-btn ${grading[sub.id]?.grade === g ? 'selected' : ''}`}
                                                onClick={() => handleGradeChange(sub.id, 'grade', g)}
                                            >
                                                {g}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="feedback-group">
                                    <label className="grade-label">Komentarz zwrotny</label>
                                    <textarea
                                        className="feedback-textarea"
                                        placeholder="Napisz informację zwrotną dla studenta..."
                                        rows={3}
                                        value={grading[sub.id]?.feedback || ''}
                                        onChange={(e) => handleGradeChange(sub.id, 'feedback', e.target.value)}
                                    />
                                </div>
                                <button
                                    className="btn-save"
                                    onClick={() => handleSave(sub.id)}
                                    disabled={!grading[sub.id]?.grade || saved[sub.id]}
                                >
                                    <span className="material-symbols-outlined">save</span>
                                    {saved[sub.id] ? 'Zapisano' : 'Zapisz ocenę'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default UngradedHomework;
