import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Header from '../Header';
import './QuizSolve.scss';

const STATIC_QUIZ = {
    title: 'Quiz z Rozdziału 3: Kolory i typografia',
    course: 'UX/UI Design',
    questions: [
        {
            id: '1',
            text: 'Która teoria kolorów jest najczęściej stosowana w projektowaniu UI?',
            answers: ['Teoria Munsella', 'Koło barw RYB', 'Model barw HSL/HSB', 'System Pantone'],
        },
        {
            id: '2',
            text: 'Co oznacza termin "typograficzna hierarchia"?',
            answers: [
                'Kolejność instalowania fontów',
                'Wizualne zróżnicowanie tekstu wskazujące na jego ważność',
                'Rodzaj układu strony z wieloma kolumnami',
                'Standard nazewnictwa krojów pisma',
            ],
        },
        {
            id: '3',
            text: 'Który format pliku najlepiej nadaje się do grafiki wektorowej w internecie?',
            answers: ['PNG', 'JPEG', 'SVG', 'BMP'],
        },
        {
            id: '4',
            text: 'Jaki jest zalecany minimalny kontrast tekstu wg standardów WCAG AA?',
            answers: ['3:1', '4.5:1', '7:1', '2:1'],
        },
        {
            id: '5',
            text: 'Co to jest "kerning" w typografii?',
            answers: [
                'Grubość kreski w literze',
                'Odstęp między wierszami tekstu',
                'Regulacja odstępów między parami liter',
                'Styl nagłówkowy fontu',
            ],
        },
    ],
};

const QuizSolve = () => {
    const { id } = useParams();
    const [current, setCurrent] = useState(0);
    const [selected, setSelected] = useState({});
    const [finished, setFinished] = useState(false);

    const questions = STATIC_QUIZ.questions;
    const q = questions[current];
    const total = questions.length;
    const progress = ((current + 1) / total) * 100;
    const answered = Object.keys(selected).length;

    const handleSelect = (idx) => setSelected(prev => ({ ...prev, [q.id]: idx }));

    const handleNext = () => {
        if (current < total - 1) setCurrent(prev => prev + 1);
        else setFinished(true);
    };

    const handlePrev = () => {
        if (current > 0) setCurrent(prev => prev - 1);
    };

    if (finished) {
        return (
            <div className="page-wrapper-quiz">
                <Header variant="dashboard" />
                <div className="main-content">
                    <div className="quiz-result-card">
                        <span className="material-symbols-outlined result-icon">check_circle</span>
                        <h2 className="result-title">Quiz ukończony!</h2>
                        <p className="result-subtitle">
                            Twoje odpowiedzi zostały zapisane i czekają na ocenę.
                        </p>
                        <div className="result-stats">
                            <div className="stat-item">
                                <span className="stat-value">{answered}</span>
                                <span className="stat-label">Udzielonych odpowiedzi</span>
                            </div>
                            <div className="stat-divider" />
                            <div className="stat-item">
                                <span className="stat-value">{total}</span>
                                <span className="stat-label">Łącznie pytań</span>
                            </div>
                        </div>
                        <Link to="/assignments" className="btn-primary">
                            <span className="material-symbols-outlined">arrow_back</span>
                            Powrót do zadań
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="page-wrapper-quiz">
            <Header variant="dashboard" />
            <div className="main-content">
                <div className="quiz-top">
                    <Link to="/assignments" className="back-link">
                        <span className="material-symbols-outlined">arrow_back</span>
                        Powrót
                    </Link>
                    <div className="quiz-title-block">
                        <h1 className="quiz-title">{STATIC_QUIZ.title}</h1>
                        <p className="quiz-course">{STATIC_QUIZ.course}</p>
                    </div>
                </div>

                <div className="progress-wrapper">
                    <div className="progress-track">
                        <div className="progress-fill" style={{ width: `${progress}%` }} />
                    </div>
                    <span className="progress-label">Pytanie {current + 1} z {total}</span>
                </div>

                <div className="question-card">
                    <p className="question-counter">Pytanie {current + 1} / {total}</p>
                    <h2 className="question-text">{q.text}</h2>

                    <div className="answers-grid">
                        {q.answers.map((answer, idx) => (
                            <button
                                key={idx}
                                className={`answer-btn ${selected[q.id] === idx ? 'selected' : ''}`}
                                onClick={() => handleSelect(idx)}
                            >
                                <span className="answer-letter">{String.fromCharCode(65 + idx)}</span>
                                <span className="answer-text">{answer}</span>
                            </button>
                        ))}
                    </div>

                    <div className="quiz-nav">
                        <button className="btn-nav" onClick={handlePrev} disabled={current === 0}>
                            <span className="material-symbols-outlined">arrow_back</span>
                            Poprzednie
                        </button>
                        <div className="answered-count">
                            {answered} / {total} odpowiedzi
                        </div>
                        <button
                            className="btn-primary"
                            onClick={handleNext}
                            disabled={selected[q.id] === undefined}
                        >
                            {current === total - 1 ? 'Zakończ quiz' : 'Następne'}
                            <span className="material-symbols-outlined">arrow_forward</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuizSolve;
