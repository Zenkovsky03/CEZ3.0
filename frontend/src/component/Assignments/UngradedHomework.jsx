import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Header from '../Header';
import Spinner from '../Spinner';
import { getUngradedHomeworks, gradeHomework } from '../../services/assignmentService';
import './UngradedHomework.scss';

const GRADES = ['2', '3', '3+', '4', '4+', '5', '5!'];

const formatDate = (iso) => {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return '';
    return new Intl.DateTimeFormat(undefined, { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }).format(d);
};

const UngradedHomework = () => {
    const { t } = useTranslation();
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
                setError(err.message || t('error.load_ungraded'));
            } finally {
                if (mounted) setLoading(false);
            }
        };

        load();
        return () => { mounted = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleGradeChange = (id, field, value) => {
        setGrading(prev => ({ ...prev, [id]: { ...prev[id], [field]: value } }));
    };

    const handleSave = async (submission) => {
        const gradeData = grading[submission.attemptId];
        if (!gradeData?.grade) return;

        setSaving(prev => ({ ...prev, [submission.attemptId]: true }));

        const gradeValue = gradeData.grade;
        const numericPoints = parseInt(gradeValue, 10) || 0;

        try {
            await gradeHomework(submission.attemptId, {
                StudentId: submission.studentId,
                Points: numericPoints,
                Mark: gradeValue,
                Feedback: gradeData.feedback || ''
            });
            setSubmissions(prev => prev.filter(s => s.attemptId !== submission.attemptId));
        } catch (err) {
            setError(err.message || t('error.grade_save'));
        } finally {
            setSaving(prev => ({ ...prev, [submission.attemptId]: false }));
        }
    };

    if (loading) return (
        <div className="page-wrapper-ungraded">
            <Header variant="dashboard" />
            <div className="main-content"><Spinner size="lg" /></div>
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
                            {t('assignment.title')}
                        </Link>
                        <h1 className="page-title">{t('assignment.ungraded')}</h1>
                        <p className="page-subtitle">
                            <span className="count-badge">{submissions.length}</span>
                            {t('assignment.ungraded')}
                        </p>
                    </div>
                </div>

                {submissions.length === 0 && <p>{t('assignment.no_ungraded')}</p>}

                <div className="submissions-list">
                    {submissions.map(sub => (
                        <div key={sub.attemptId} className="submission-card">
                            <div className="submission-header">
                                <div className="student-info">
                                    <div className="student-avatar">
                                        {sub.studentId?.toString?.()?.[0]?.toUpperCase() || '??'}
                                    </div>
                                    <div>
                                        <p className="student-name">
                                            {sub.studentId ? `${t('common.student')} #${sub.studentId.toString().slice(-4)}` : t('common.unknown')}
                                        </p>
                                        <p className="submission-meta">
                                            {sub.assignmentTitle} · {sub.courseTitle || ''}
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
                                    <p className="submission-text-label">{t('assignment.student_comment')}</p>
                                    <p>{sub.submissionText}</p>
                                </div>
                            )}

                            <div className="grading-form">
                                <div className="grade-group">
                                    <label className="grade-label">{t('grade.mark')}</label>
                                    <div className="grade-buttons">
                                        {GRADES.map(g => (
                                            <button
                                                key={g}
                                                className={`grade-btn ${grading[sub.attemptId]?.grade === g ? 'selected' : ''}`}
                                                onClick={() => handleGradeChange(sub.attemptId, 'grade', g)}
                                            >
                                                {g}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="feedback-group">
                                    <label className="grade-label">{t('grade.comment')}</label>
                                    <textarea
                                        className="feedback-textarea"
                                        placeholder={t('assignment.grade_feedback_placeholder')}
                                        rows={3}
                                        value={grading[sub.attemptId]?.feedback || ''}
                                        onChange={(e) => handleGradeChange(sub.attemptId, 'feedback', e.target.value)}
                                    />
                                </div>
                                <button
                                    className="btn-save"
                                    onClick={() => handleSave(sub)}
                                    disabled={!grading[sub.attemptId]?.grade || saving[sub.attemptId]}
                                >
                                    <span className="material-symbols-outlined">save</span>
                                    {saving[sub.attemptId] ? t('common.saving') : t('common.save')}
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
