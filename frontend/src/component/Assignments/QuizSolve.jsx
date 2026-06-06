import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Header from '../Header';
import { startAssignment, getQuizQuestions, saveSelection, finishAttempt } from '../../services/assignmentService';
import './QuizSolve.scss';

const QuizSolve = () => {
    const { id } = useParams();
    const [attemptId, setAttemptId] = useState(null);
    const [quiz, setQuiz] = useState(null);
    const [current, setCurrent] = useState(0);
    const [selected, setSelected] = useState({});
    const [finished, setFinished] = useState(false);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        let mounted = true;

        const init = async () => {
            try {
                const attempt = await startAssignment(id);
                const aid = attempt?.attemptId || attempt?.id;
                if (!aid) throw new Error('Nie udało się rozpocząć quizu');
                if (!mounted) return;
                setAttemptId(aid);

                const quizData = await getQuizQuestions(aid);
                if (!mounted) return;
                setQuiz(quizData);
            } catch (err) {
                if (!mounted) return;
                setError(err.message || 'Nie udało się załadować quizu');
            } finally {
                if (mounted) setLoading(false);
            }
        };

        init();
        return () => { mounted = false; };
    }, [id]);

    const questions = quiz?.questions || [];
    const q = questions[current];
    const total = questions.length;

    const handleSelect = async (answerId) => {
        const newSelected = { ...selected, [q.id]: answerId };
        setSelected(newSelected);

        try {
            await saveSelection({
                AttemptId: attemptId,
                QuestionId: q.id,
                SelectedAnswerIds: [answerId]
            });
        } catch (err) {
            console.error('Failed to save selection:', err);
        }
    };

    const handleNext = async () => {
        if (current < total - 1) {
            setCurrent(prev => prev + 1);
        } else {
            try {
                setLoading(true);
                const finishResult = await finishAttempt(attemptId);
                setResult(finishResult);
                setFinished(true);
            } catch (err) {
                setError(err.message || 'Nie udało się zakończyć quizu');
            } finally {
                setLoading(false);
            }
        }
    };

    const handlePrev = () => {
        if (current > 0) setCurrent(prev => prev - 1);
    };

    if (error) return (
        <div className="page-wrapper-quiz">
            <Header variant="dashboard" />
            <div className="main-content"><p className="error-message">{error}</p></div>
        </div>
    );

    if (loading && !quiz) return (
        <div className="page-wrapper-quiz">
            <Header variant="dashboard" />
            <div className="main-content"><p>Ładowanie quizu...</p></div>
        </div>
    );

    if (finished) {
        return (
            <div className="page-wrapper-quiz">
                <Header variant="dashboard" />
                <div className="main-content">
                    <div className="quiz-result-card">
                        <span className="material-symbols-outlined result-icon">check_circle</span>
                        <h2 className="result-title">Quiz ukończony!</h2>
                        {result && (
                            <div className="result-stats">
                                <div className="stat-item">
                                    <span className="stat-value">{result.score || 0}</span>
                                    <span className="stat-label">Zdobyte punkty</span>
                                </div>
                                <div className="stat-divider" />
                                <div className="stat-item">
                                    <span className="stat-value">{result.maxPoints || total}</span>
                                    <span className="stat-label">Maksymalnie</span>
                                </div>
                            </div>
                        )}
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
                        <h1 className="quiz-title">{quiz?.title || 'Quiz'}</h1>
                        {quiz?.description && <p className="quiz-course">{quiz.description}</p>}
                    </div>
                </div>

                <div className="progress-wrapper">
                    <div className="progress-track">
                        <div className="progress-fill" style={{ width: `${((current + 1) / total) * 100}%` }} />
                    </div>
                    <span className="progress-label">Pytanie {current + 1} z {total}</span>
                </div>

                <div className="question-card">
                    <p className="question-counter">Pytanie {current + 1} / {total}</p>
                    <h2 className="question-text">{q?.text}</h2>

                    <div className="answers-grid">
                        {q?.answers?.map((answer, idx) => (
                            <button
                                key={answer.id || idx}
                                className={`answer-btn ${selected[q.id] === answer.id ? 'selected' : ''}`}
                                onClick={() => handleSelect(answer.id)}
                            >
                                <span className="answer-letter">{String.fromCharCode(65 + idx)}</span>
                                <span className="answer-text">{answer.text}</span>
                            </button>
                        ))}
                    </div>

                    <div className="quiz-nav">
                        <button className="btn-nav" onClick={handlePrev} disabled={current === 0}>
                            <span className="material-symbols-outlined">arrow_back</span>
                            Poprzednie
                        </button>
                        <div className="answered-count">
                            {Object.keys(selected).length} / {total} odpowiedzi
                        </div>
                        <button className="btn-primary" onClick={handleNext} disabled={!q || selected[q.id] === undefined}>
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
