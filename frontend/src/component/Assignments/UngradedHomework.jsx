import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../Header';
import { getUngradedHomeworks, gradeHomework } from '../../services/assignmentService';
import './UngradedHomework.scss';

const GRADES = ['2', '3', '3+', '4', '4+', '5', '5!'];

const formatDate = (iso) => {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return '';
    return new Intl.DateTimeFormat('pl-PL', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }).format(d);
};

const UngradedHomework = () => {
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [grading, setGrading] = useState({});
    const [saving, setSaving] = useState({});

    useEffect(() => {
        let mounted = true;

        const load = async () => {
            try {
                const data = await getUngradedHomeworks();
                if (!mounted) return;
                const list = data?.items || data?.Items || (Array.isArray(data) ? data : []);
                setSubmissions(list);
            } catch (err) {
                if (!mounted) return;
                setError(err.message || 'Nie udało się pobrać nieocenionych prac');
            } finally {
                if (mounted) setLoading(false);
            }
        };

        load();
        return () => { mounted = false; };
    }, []);

    const handleGradeChange = (id, field, value) => {
        setGrading(prev => ({ ...prev, [id]: { ...prev[id], [field]: value } }));
    };

    const handleSave = async (submission) => {
        const gradeData = grading[submission.id];
        if (!gradeData?.grade) return;

        setSaving(prev => ({ ...prev, [submission.id]: true }));

        try {
            await gradeHomework(submission.attemptId || submission.id, {
                StudentId: submission.studentId || submission.userId,
                Points: Number(gradeData.grade) || 0,
                Feedback: gradeData.feedback || ''
            });
            setSubmissions(prev => prev.filter(s => s.id !== submission.id));
        } catch (err) {
            setError(err.message || 'Nie udało się zapisać oceny');
        } finally {
            setSaving(prev => ({ ...prev, [submission.id]: false }));
        }
    };

    if (loading) return (
        <div className="page-wrapper-ungraded">
            <Header variant="dashboard" />
            <div className="main-content"><p>Ładowanie nieocenionych prac...</p></div>
        </div>
    );

    if (error) return (
        <div className="page-wrapper-ungraded">
            <Header variant="dashboard" />
            <div className="main-content"><p className="error-message">{error}</p></div>
        </div>
    );

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
                            <span className="count-badge">{submissions.length}</span>
                            nieocenionych prac
                        </p>
                    </div>
                </div>

                {submissions.length === 0 && <p>Brak nieocenionych prac.</p>}

                <div className="submissions-list">
                    {submissions.map(sub => (
                        <div key={sub.id} className="submission-card">
                            <div className="submission-header">
                                <div className="student-info">
                                    <div className="student-avatar">
                                        {(sub.student?.firstName?.[0] || '') + (sub.student?.lastName?.[0] || '') || '??'}
                                    </div>
                                    <div>
                                        <p className="student-name">
                                            {sub.student?.firstName || ''} {sub.student?.lastName || ''}
                                        </p>
                                        <p className="submission-meta">
                                            {sub.assignmentTitle || sub.title} · {sub.courseName || ''}
                                        </p>
                                    </div>
                                </div>
                                <div className="submission-date">
                                    <span className="material-symbols-outlined">schedule</span>
                                    {formatDate(sub.submittedAt || sub.createdAt)}
                                </div>
                            </div>

                            {sub.submissionText && (
                                <div className="submission-text">
                                    <p className="submission-text-label">Komentarz studenta</p>
                                    <p>{sub.submissionText}</p>
                                </div>
                            )}

                            {sub.attachmentUrl && (
                                <a href={sub.attachmentUrl} target="_blank" rel="noopener noreferrer" className="attachment-link">
                                    <span className="material-symbols-outlined">open_in_new</span>
                                    Otwórz pracę
                                </a>
                            )}

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
                                    onClick={() => handleSave(sub)}
                                    disabled={!grading[sub.id]?.grade || saving[sub.id]}
                                >
                                    <span className="material-symbols-outlined">save</span>
                                    {saving[sub.id] ? 'Zapisywanie...' : 'Zapisz ocenę'}
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
