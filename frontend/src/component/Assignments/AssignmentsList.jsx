import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import AuthContext from '../../context/AuthContext';
import Header from '../Header';
import Spinner from '../Spinner';
import { getNearestAssignments } from '../../services/assignmentService';
import { getCourses } from '../../services/courseService';
import './AssignmentsList.scss';

const TYPE_ICONS = { Quiz: 'quiz', Test: 'assignment', Homework: 'edit_document' };

const formatDate = (iso) => {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return '';
    return new Intl.DateTimeFormat(undefined, { day: '2-digit', month: '2-digit', year: 'numeric' }).format(d);
};

const AssignmentsList = () => {
    const { t } = useTranslation();
    const { user } = useContext(AuthContext);
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeFilter, setActiveFilter] = useState('all');

    useEffect(() => {
        let mounted = true;

        const load = async () => {
            setLoading(true);
            try {
                const [nearest, courses] = await Promise.allSettled([
                    getNearestAssignments(),
                    getCourses()
                ]);

                if (!mounted) return;

                const items = [];
                if (nearest.status === 'fulfilled') {
                    const data = nearest.value;
                    const list = data?.items || data?.Items || (Array.isArray(data) ? data : []);
                    items.push(...list.map(a => ({
                        id: a.id || a.assignmentId,
                        title: a.title || a.assignmentTitle,
                        type: a.taskType || 'Quiz',
                        course: a.courseName || '',
                        dueDate: a.dueDate || a.deadline,
                        status: a.status || 'active',
                        score: a.score
                    })));
                }

                if (items.length === 0 && courses.status === 'fulfilled') {
                    const courseList = courses.value?.items || courses.value?.Items || (Array.isArray(courses.value) ? courses.value : []);
                    courseList.forEach(c => {
                        if (c.name) {
                            items.push({
                                id: `course-${c.id}`,
                                title: c.name,
                                type: 'Homework',
                                course: c.name,
                                dueDate: c.endDate,
                                status: 'active'
                            });
                        }
                    });
                }

                setAssignments(items);
            } catch (err) {
                if (!mounted) return;
                setError(err.message || t('error.load_assignments'));
            } finally {
                if (mounted) setLoading(false);
            }
        };

        load();
        return () => { mounted = false; };
    }, [t]);

    const filtered = assignments.filter(a =>
        activeFilter === 'all' || a.type === activeFilter
    );

    if (loading) return (
        <div className="page-wrapper-assignments">
            <Header variant="dashboard" />
            <div className="main-content"><Spinner size="lg" /></div>
        </div>
    );

    if (error) return (
        <div className="page-wrapper-assignments">
            <Header variant="dashboard" />
            <div className="main-content"><p className="error-message">{error}</p></div>
        </div>
    );

    return (
        <div className="page-wrapper-assignments">
            <Header variant="dashboard" />
            <div className="main-content">
                <div className="page-header">
                    <div className="page-header-text">
                        <h1 className="page-title">{t('assignment.title')}</h1>
                        <p className="page-subtitle">{t('assignment.active_completed')}</p>
                    </div>
                    {user?.role !== 'Student' && (
                        <>
                            <Link to="/assignments/create" className="btn-primary">
                                <span className="material-symbols-outlined">add</span>
                                {t('assignment.new')}
                            </Link>
                            <Link to="/assignments/ungraded" className="btn-secondary">
                                <span className="material-symbols-outlined">grading</span>
                                {t('assignment.to_grade')}
                            </Link>
                        </>
                    )}
                </div>

                <div className="filter-tabs">
                    {['all', 'Quiz', 'Test', 'Homework'].map(f => (
                        <button key={f} className={`filter-tab ${activeFilter === f ? 'active' : ''}`} onClick={() => setActiveFilter(f)}>
                            {f === 'all' ? t('common.all') : t(`assignment.type_${f.toLowerCase()}`)}
                        </button>
                    ))}
                </div>

                <div className="assignments-list">
                    {filtered.length === 0 && <p>{t('assignment.no_tasks')}</p>}
                    {filtered.map(a => (
                        <div key={a.id} className="assignment-card">
                            <div className={`assignment-icon type-${(a.type || 'quiz').toLowerCase()}`}>
                                <span className="material-symbols-outlined">{TYPE_ICONS[a.type] || 'assignment'}</span>
                            </div>
                            <div className="assignment-info">
                                <h3 className="assignment-title">{a.title}</h3>
                                <div className="assignment-meta">
                                    <span className="type-chip">{t(`assignment.type_${(a.type || 'quiz').toLowerCase()}`)}</span>
                                    {a.course && <><span>{a.course}</span><span>·</span></>}
                                    {a.dueDate && <span>{t('assignment.due')}: {formatDate(a.dueDate)}</span>}
                                </div>
                            </div>
                            <div className="assignment-right">
                                <span className={`status-badge ${a.status === 'active' ? 'status-active' : 'status-done'}`}>
                                    {a.status === 'active' ? t('assignment.in_progress') : t('assignment.completed')}{a.score ? ` · ${a.score}` : ''}
                                </span>
                                {user?.role !== 'Student' ? (
                                    <Link to={`/assignments/${a.id}/results`} className="btn-start">{t('assignment.results')}</Link>
                                ) : a.status === 'active' ? (
                                    <Link to={`/assignments/${a.id}/quiz`} className="btn-start">{t('assignment.start')}</Link>
                                ) : null}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AssignmentsList;
