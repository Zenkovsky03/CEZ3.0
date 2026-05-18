import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../Header';
import './AssignmentsList.scss';

const STATIC_ASSIGNMENTS = [
    { id: '1', title: 'Quiz z Rozdziału 3: Kolory i typografia', type: 'Quiz', course: 'UX/UI Design', dueDate: '2026-05-25T23:59:00', status: 'active' },
    { id: '2', title: 'Test końcowy: Podstawy Pythona', type: 'Test', course: 'Wprowadzenie do Pythona', dueDate: '2026-06-01T23:59:00', status: 'active' },
    { id: '3', title: 'Praca domowa: Projekt makiety UX', type: 'Homework', course: 'UX/UI Design', dueDate: '2026-05-20T23:59:00', status: 'submitted' },
    { id: '4', title: 'Quiz z Rozdziału 1: Hello World', type: 'Quiz', course: 'Wprowadzenie do Pythona', dueDate: '2026-05-10T23:59:00', status: 'done', score: '8/10' },
    { id: '5', title: 'Praca domowa: Analiza przypadku biznesowego', type: 'Homework', course: 'UX/UI Design', dueDate: '2026-05-30T23:59:00', status: 'active' },
    { id: '6', title: 'Test z modułu 2: Listy i słowniki', type: 'Test', course: 'Wprowadzenie do Pythona', dueDate: '2026-05-15T23:59:00', status: 'done', score: '18/20' },
];

const TYPE_ICONS = { Quiz: 'quiz', Test: 'assignment', Homework: 'edit_document' };
const TYPE_LABELS = { Quiz: 'Quiz', Test: 'Test', Homework: 'Praca domowa' };
const STATUS_LABELS = { active: 'Aktywne', submitted: 'Oddana', done: 'Ukończone' };
const STATUS_CLASSES = { active: 'status-active', submitted: 'status-submitted', done: 'status-done' };

const formatDate = (iso) =>
    new Intl.DateTimeFormat('pl-PL', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(iso));

const FILTERS = ['Wszystkie', 'Quiz', 'Test', 'Praca domowa'];

const AssignmentsList = () => {
    const [activeFilter, setActiveFilter] = useState('Wszystkie');

    const filtered = STATIC_ASSIGNMENTS.filter(a =>
        activeFilter === 'Wszystkie' || TYPE_LABELS[a.type] === activeFilter
    );

    return (
        <div className="page-wrapper-assignments">
            <Header variant="dashboard" />
            <div className="main-content">
                <div className="page-header">
                    <div className="page-header-text">
                        <h1 className="page-title">Zadania</h1>
                        <p className="page-subtitle">Twoje aktywne i zakończone zadania</p>
                    </div>
                    <Link to="/assignments/ungraded" className="btn-secondary">
                        <span className="material-symbols-outlined">grading</span>
                        Do oceniania
                    </Link>
                </div>

                <div className="filter-tabs">
                    {FILTERS.map(f => (
                        <button
                            key={f}
                            className={`filter-tab ${activeFilter === f ? 'active' : ''}`}
                            onClick={() => setActiveFilter(f)}
                        >
                            {f}
                        </button>
                    ))}
                </div>

                <div className="assignments-list">
                    {filtered.map(a => (
                        <div key={a.id} className="assignment-card">
                            <div className={`assignment-icon type-${a.type.toLowerCase()}`}>
                                <span className="material-symbols-outlined">{TYPE_ICONS[a.type]}</span>
                            </div>
                            <div className="assignment-info">
                                <h3 className="assignment-title">{a.title}</h3>
                                <div className="assignment-meta">
                                    <span className="type-chip">{TYPE_LABELS[a.type]}</span>
                                    <span>{a.course}</span>
                                    <span>·</span>
                                    <span>Termin: {formatDate(a.dueDate)}</span>
                                </div>
                            </div>
                            <div className="assignment-right">
                                <span className={`status-badge ${STATUS_CLASSES[a.status]}`}>
                                    {STATUS_LABELS[a.status]}{a.score ? ` · ${a.score}` : ''}
                                </span>
                                {a.status === 'active' && (
                                    <Link
                                        to={a.type === 'Homework' ? `/assignments/${a.id}/homework` : `/assignments/${a.id}/quiz`}
                                        className="btn-start"
                                    >
                                        Rozpocznij
                                    </Link>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AssignmentsList;
