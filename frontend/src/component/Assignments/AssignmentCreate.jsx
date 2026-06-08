import React, { useEffect, useState, useContext } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Header from '../Header';
import AuthContext from '../../context/AuthContext';
import { getCourses } from '../../services/courseService';
import { createAssignment } from '../../services/assignmentService';
import './AssignmentCreate.scss';

const TASK_TYPES = [
    { value: 'Quiz', labelKey: 'assignment.type_quiz' },
    { value: 'Test', labelKey: 'assignment.type_test' },
    { value: 'Homework', labelKey: 'assignment.type_homework' },
];

const QUESTION_TYPES = [
    { value: 'SingleChoice', labelKey: 'assignment.type_single_choice' },
    { value: 'MultipleChoice', labelKey: 'assignment.type_multiple_choice' },
];

const initQuestion = () => ({
    text: '',
    type: 'SingleChoice',
    points: 1,
    answers: [{ text: '', isCorrect: false }, { text: '', isCorrect: false }],
});

const AssignmentCreate = () => {
    const { t } = useTranslation();
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [courses, setCourses] = useState([]);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const [form, setForm] = useState({
        courseId: searchParams.get('courseId') || '',
        title: '',
        description: '',
        taskType: 'Quiz',
        questions: [initQuestion()],
    });

    const sectionId = searchParams.get('sectionId');

    useEffect(() => {
        getCourses()
            .then(data => {
                const list = Array.isArray(data) ? data : data?.items || data?.courses || [];
                setCourses(Array.isArray(list) ? list : []);
            })
            .catch(() => setCourses([]));
    }, []);

    const handleChange = (e) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
        if (e.target.name === 'taskType' && e.target.value === 'Homework') {
            setForm(prev => ({ ...prev, taskType: 'Homework', questions: [] }));
        }
        if (e.target.name === 'taskType' && e.target.value !== 'Homework') {
            setForm(prev => ({ ...prev, taskType: e.target.value, questions: [initQuestion()] }));
        }
    };

    const handleQuestionChange = (i, field, value) => {
        setForm(prev => {
            const qs = [...prev.questions];
            qs[i] = { ...qs[i], [field]: value };
            return { ...prev, questions: qs };
        });
    };

    const handleAnswerChange = (qIdx, aIdx, field, value) => {
        setForm(prev => {
            const qs = [...prev.questions];
            const answers = [...qs[qIdx].answers];
            if (field === 'isCorrect' && qs[qIdx].type === 'SingleChoice') {
                answers.forEach((a, idx) => a.isCorrect = idx === aIdx);
            } else {
                answers[aIdx] = { ...answers[aIdx], [field]: value };
            }
            qs[qIdx] = { ...qs[qIdx], answers };
            return { ...prev, questions: qs };
        });
    };

    const addQuestion = () => setForm(prev => ({ ...prev, questions: [...prev.questions, initQuestion()] }));
    const removeQuestion = (i) => setForm(prev => ({ ...prev, questions: prev.questions.filter((_, idx) => idx !== i) }));

    const addAnswer = (qIdx) => {
        setForm(prev => {
            const qs = [...prev.questions];
            qs[qIdx] = { ...qs[qIdx], answers: [...qs[qIdx].answers, { text: '', isCorrect: false }] };
            return { ...prev, questions: qs };
        });
    };

    const removeAnswer = (qIdx, aIdx) => {
        setForm(prev => {
            const qs = [...prev.questions];
            qs[qIdx] = { ...qs[qIdx], answers: qs[qIdx].answers.filter((_, idx) => idx !== aIdx) };
            return { ...prev, questions: qs };
        });
    };

    const isValid = form.courseId && form.title.trim() && (
        form.taskType === 'Homework' ||
        (form.questions.length > 0 && form.questions.every(q =>
            q.text.trim() && q.answers.length >= 2 && q.answers.every(a => a.text.trim())
        ))
    );

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isValid || saving) return;
        setSaving(true);
        setError('');

        const payload = {
            courseId: form.courseId,
            title: form.title.trim(),
            description: form.description.trim(),
            taskType: form.taskType,
            sectionId: sectionId || undefined,
            questions: form.taskType === 'Homework' ? [] : form.questions.map(q => ({
                text: q.text.trim(),
                type: q.type,
                points: Number(q.points) || 1,
                answers: q.answers.map(a => ({
                    text: a.text.trim(),
                    isCorrect: a.isCorrect,
                })),
            })),
        };

        try {
            await createAssignment(payload);
            setSubmitted(true);
        } catch (err) {
            setError(err.message || t('assignment.create_error'));
        } finally {
            setSaving(false);
        }
    };

    if (!user || (user.role !== 'Teacher' && user.role !== 'Admin')) {
        return (
            <div className="page-wrapper-assignment-create">
                <Header variant="dashboard" />
                <div className="main-content"><p>{t('common.no_permissions')}</p></div>
            </div>
        );
    }

    if (submitted) {
        return (
            <div className="page-wrapper-assignment-create">
                <Header variant="dashboard" />
                <div className="main-content">
                    <div className="success-card">
                        <span className="material-symbols-outlined success-icon">check_circle</span>
                        <h2>{t('assignment.created_title')}</h2>
                        <p>{t('assignment.created')}</p>
                        <div className="form-actions" style={{ justifyContent: 'center', marginTop: '1.5rem' }}>
                            <button className="btn-secondary" onClick={() => navigate('/assignments')}>
                                {t('assignment.back_to_list')}
                            </button>
                            <button className="btn-primary" onClick={() => { setSubmitted(false); setForm({ courseId: searchParams.get('courseId') || '', title: '', description: '', taskType: 'Quiz', questions: [initQuestion()] }); }}>
                                <span className="material-symbols-outlined">add</span>
                                {t('assignment.add_another')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="page-wrapper-assignment-create">
            <Header variant="dashboard" />
            <div className="main-content">
                <div className="back-link" onClick={() => navigate(-1)}>
                    <span className="material-symbols-outlined">arrow_back</span>
                    {t('common.back')}
                </div>

                <div className="form-card">
                    <div className="form-card-header">
                        <span className="form-card-icon material-symbols-outlined">assignment_add</span>
                        <div>
                            <h1>{t('assignment.new')}</h1>
                            <p>{t('assignment.create')}</p>
                        </div>
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="form-row">
                            <div className="form-group flex-1">
                                <label htmlFor="courseId" className="form-label">{t('assignment.course_select')}</label>
                                <select id="courseId" name="courseId" className="form-input" value={form.courseId} onChange={handleChange} required>
                                    <option value="">{t('assignment.course_placeholder')}</option>
                                    {courses.map(c => (
                                        <option key={c.id} value={c.id}>{c.name || c.title}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group flex-1">
                                <label htmlFor="taskType" className="form-label">{t('assignment.type_label')}</label>
                                <select id="taskType" name="taskType" className="form-input" value={form.taskType} onChange={handleChange} required>
                                    {TASK_TYPES.map(tt => (
                                        <option key={tt.value} value={tt.value}>{t(tt.labelKey)}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="title" className="form-label">{t('assignment.title_required')}</label>
                            <input id="title" name="title" type="text" className="form-input" placeholder={t('assignment.title_placeholder')} value={form.title} onChange={handleChange} required />
                        </div>

                        <div className="form-group">
                            <label htmlFor="description" className="form-label">{t('assignment.description')}</label>
                            <textarea id="description" name="description" className="form-textarea" placeholder={t('assignment.description_placeholder')} value={form.description} onChange={handleChange} rows={3} />
                        </div>

                        {form.taskType !== 'Homework' && (
                            <div className="questions-section">
                                <div className="section-header">
                                    <h2>{t('assignment.questions')}</h2>
                                    <button type="button" className="btn-add-question" onClick={addQuestion}>
                                        <span className="material-symbols-outlined">add</span>
                                        {t('assignment.add_question')}
                                    </button>
                                </div>

                                {form.questions.map((q, qIdx) => (
                                    <div key={qIdx} className="question-card">
                                        <div className="question-header">
                                            <span className="question-number">{t('assignment.question_number', { number: qIdx + 1 })}</span>
                                            {form.questions.length > 1 && (
                                                <button type="button" className="btn-remove-question" onClick={() => removeQuestion(qIdx)}>
                                                    <span className="material-symbols-outlined">close</span>
                                                </button>
                                            )}
                                        </div>

                                        <div className="form-row">
                                            <div className="form-group flex-3">
                                                <label className="form-label">{t('assignment.question_content')}</label>
                                                <input type="text" className="form-input" placeholder={t('assignment.question_placeholder')} value={q.text} onChange={(e) => handleQuestionChange(qIdx, 'text', e.target.value)} required />
                                            </div>
                                            <div className="form-group flex-1">
                                                <label className="form-label">{t('assignment.points')}</label>
                                                <input type="number" className="form-input" min="1" value={q.points} onChange={(e) => handleQuestionChange(qIdx, 'points', e.target.value)} />
                                            </div>
                                            <div className="form-group flex-1">
                                                <label className="form-label">{t('assignment.answer_type')}</label>
                                                <select className="form-input" value={q.type} onChange={(e) => handleQuestionChange(qIdx, 'type', e.target.value)}>
                                                    {QUESTION_TYPES.map(qt => (
                                                        <option key={qt.value} value={qt.value}>{t(qt.labelKey)}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>

                                        <div className="answers-section">
                                            <label className="form-label">{t('assignment.answers')}</label>
                                            {q.answers.map((a, aIdx) => (
                                                <div key={aIdx} className="answer-row">
                                                    <input
                                                        type="text"
                                                        className="form-input answer-input"
                                                        placeholder={t('assignment.answer_placeholder', { number: aIdx + 1 })}
                                                        value={a.text}
                                                        onChange={(e) => handleAnswerChange(qIdx, aIdx, 'text', e.target.value)}
                                                        required
                                                    />
                                                    <label className="correct-label">
                                                        <input
                                                            type={q.type === 'SingleChoice' ? 'radio' : 'checkbox'}
                                                            name={`correct-${qIdx}`}
                                                            checked={a.isCorrect}
                                                            onChange={(e) => handleAnswerChange(qIdx, aIdx, 'isCorrect', e.target.checked)}
                                                        />
                                                        {t('assignment.correct')}
                                                    </label>
                                                    {q.answers.length > 2 && (
                                                        <button type="button" className="btn-remove-answer" onClick={() => removeAnswer(qIdx, aIdx)}>
                                                            <span className="material-symbols-outlined">remove</span>
                                                        </button>
                                                    )}
                                                </div>
                                            ))}
                                            <button type="button" className="btn-add-answer" onClick={() => addAnswer(qIdx)}>
                                                <span className="material-symbols-outlined">add</span>
                                                {t('assignment.add_answer')}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="form-actions">
                            <button type="button" className="btn-secondary" onClick={() => navigate(-1)}>{t('common.cancel')}</button>
                            <button type="submit" className="btn-primary" disabled={!isValid || saving}>
                                <span className="material-symbols-outlined">send</span>
                                {saving ? t('assignment.creating') : t('assignment.create_btn')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AssignmentCreate;
