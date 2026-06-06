import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../Header';
import { getMyGrades } from '../../services/gradeService';
import './Grades.scss';

const formatDate = (iso) => {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return '';
    return new Intl.DateTimeFormat('pl-PL', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(d);
};

const GRADE_COLORS = {
    A: '#16a34a', B: '#2563eb', C: '#ca8a04',
    D: '#f97316', E: '#dc2626', F: '#dc2626'
};

const GradesPage = () => {
    const [grades, setGrades] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        let mounted = true;

        const load = async () => {
            try {
                const data = await getMyGrades();
                if (!mounted) return;
                const list = Array.isArray(data) ? data : data?.items || data?.Items || [];
                setGrades(list);
            } catch (err) {
                if (!mounted) return;
                setError(err.message || 'Nie udało się pobrać ocen');
            } finally {
                if (mounted) setLoading(false);
            }
        };

        load();
        return () => { mounted = false; };
    }, []);

    const grouped = grades.reduce((acc, g) => {
        if (!acc[g.courseName]) acc[g.courseName] = [];
        acc[g.courseName].push(g);
        return acc;
    }, {});

    if (loading) return (
        <div className="page-wrapper-grades">
            <Header variant="dashboard" />
            <div className="main-content"><p>Ładowanie ocen...</p></div>
        </div>
    );

    if (error) return (
        <div className="page-wrapper-grades">
            <Header variant="dashboard" />
            <div className="main-content"><p className="error-message">{error}</p></div>
        </div>
    );

    return (
        <div className="page-wrapper-grades">
            <Header variant="dashboard" />
            <div className="main-content">
                <div className="page-header">
                    <div>
                        <h1 className="page-title">Moje oceny</h1>
                        <p className="page-subtitle">Historia twoich ocen z wszystkich kursów</p>
                    </div>
                </div>

                {grades.length === 0 && (
                    <div className="empty-state">
                        <span className="material-symbols-outlined empty-icon">grade</span>
                        <p>Nie masz jeszcze żadnych ocen.</p>
                    </div>
                )}

                {Object.entries(grouped).map(([courseName, courseGrades]) => (
                    <div key={courseName} className="grade-group">
                        <h2 className="course-group-title">{courseName}</h2>
                        <div className="grade-table">
                            <div className="grade-table-header">
                                <span className="col-assignment">Zadanie</span>
                                <span className="col-score">Wynik</span>
                                <span className="col-mark">Ocena</span>
                                <span className="col-date">Data</span>
                                <span className="col-feedback">Komentarz</span>
                            </div>
                            {courseGrades.map(g => (
                                <div key={g.id} className="grade-row">
                                    <span className="col-assignment">{g.assignmentTitle}</span>
                                    <span className="col-score">{g.pointsRecieved}/{g.maxPoints}</span>
                                    <span className="col-mark">
                                        <span className="grade-badge" style={{ background: GRADE_COLORS[g.mark] || '#6b7280' }}>
                                            {g.mark || '—'}
                                        </span>
                                    </span>
                                    <span className="col-date">{formatDate(g.createdAt)}</span>
                                    <span className="col-feedback">{g.feedback || '—'}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GradesPage;
