import React, { useContext, useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Header from '../Header';
import Spinner from '../Spinner';
import AuthContext from '../../context/AuthContext';
import { getResults } from '../../services/assignmentService';
import { getUsersByRole } from '../../services/userService';
import './AssignmentResults.scss';

const formatDate = (iso) => {
    if (!iso) return '-';
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return '-';
    return new Intl.DateTimeFormat(undefined, { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(d);
};

const AssignmentResults = () => {
    const { t } = useTranslation();
    const { user } = useContext(AuthContext);
    const { id } = useParams();
    const [results, setResults] = useState([]);
    const [usersMap, setUsersMap] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        let mounted = true;

        const load = async () => {
            try {
                const [resultsData, studentData] = await Promise.allSettled([
                    getResults(id),
                    getUsersByRole('Student'),
                ]);

                if (!mounted) return;

                if (resultsData.status === 'fulfilled') {
                    const list = Array.isArray(resultsData.value) ? resultsData.value : [];
                    setResults(list);
                }

                if (studentData.status === 'fulfilled') {
                    const students = Array.isArray(studentData.value) ? studentData.value : [];
                    const map = {};
                    students.forEach(s => { map[s.id] = s; });
                    setUsersMap(map);
                }
            } catch (err) {
                if (!mounted) return;
                setError(err.message || t('error.load_results'));
            } finally {
                if (mounted) setLoading(false);
            }
        };

        load();
        return () => { mounted = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    if (!user || (user.role !== 'Teacher' && user.role !== 'Admin')) {
        return (
            <div className="page-wrapper-assignment-results">
                <Header variant="dashboard" />
                <div className="main-content"><p>{t('common.no_permissions')}</p></div>
            </div>
        );
    }

    if (loading) return (
        <div className="page-wrapper-assignment-results">
            <Header variant="dashboard" />
            <div className="main-content"><Spinner size="lg" /></div>
        </div>
    );

    if (error) return (
        <div className="page-wrapper-assignment-results">
            <Header variant="dashboard" />
            <div className="main-content"><p className="error-message">{error}</p></div>
        </div>
    );

    return (
        <div className="page-wrapper-assignment-results">
            <Header variant="dashboard" />
            <div className="main-content">
                <Link to="/assignments" className="back-link">
                    <span className="material-symbols-outlined">arrow_back</span>
                    {t('assignment.back_to_assignments')}
                </Link>

                <div className="results-card">
                    <div className="results-header">
                        <span className="material-symbols-outlined results-icon">assignment</span>
                        <div>
                            <h1>{t('assignment.results')}</h1>
                            <p>ID: {id}</p>
                        </div>
                    </div>

                    {results.length === 0 ? (
                        <div className="empty-state">
                            <span className="material-symbols-outlined">hourglass_empty</span>
                            <p>{t('assignment.no_results')}</p>
                        </div>
                    ) : (
                        <div className="results-table-wrapper">
                            <table className="results-table">
                                <thead>
                                    <tr>
                                        <th>{t('common.student')}</th>
                                        <th>{t('common.email')}</th>
                                        <th>{t('grade.score')}</th>
                                        <th>{t('common.status')}</th>
                                        <th>{t('assignment.in_progress')}</th>
                                        <th>{t('assignment.completed')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {results.map(r => {
                                        const student = usersMap[r.studentId] || {};
                                        return (
                                            <tr key={r.attemptId}>
                                                <td className="student-cell">
                                                    <div className="student-avatar">
                                                        {((student.firstName?.[0] || student.username?.[0] || '?').toUpperCase())}
                                                    </div>
                                                    <span>{[student.firstName, student.lastName].filter(Boolean).join(' ') || student.username || t('common.unknown')}</span>
                                                </td>
                                                <td>{student.email || '-'}</td>
                                                <td className="score-cell">
                                                    <span className={`score-badge ${r.isCompleted ? 'score-done' : 'score-pending'}`}>
                                                        {r.isCompleted ? `${r.score ?? '-'} / ${r.maxPoints ?? '-'}` : '-'}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span className={`status-tag ${r.isCompleted ? 'status-completed' : 'status-in-progress'}`}>
                                                        {r.isCompleted ? t('assignment.completed') : t('assignment.in_progress')}
                                                    </span>
                                                </td>
                                                <td>{formatDate(r.startedAt)}</td>
                                                <td>{formatDate(r.finishedAt)}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AssignmentResults;
