import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminLayout from '../../Layout/AdminLayout';
import { getStudentUsers } from '../../../../services/adminApi';
import '../AdminQuizzesPageNew.scss';

const StudentGradesDetailsPage = () => {
        const navigate = useNavigate();
        const { studentId } = useParams();
        const [token, setToken] = useState(localStorage.getItem('token') || '');
        const [students, setStudents] = useState([]);
        const [loading, setLoading] = useState(false);
        const [error, setError] = useState(null);
        const [searchQuery, setSearchQuery] = useState('');
        const [semester, setSemester] = useState('all');

        useEffect(() => {
                if (!token) {
                        return;
                }

                const fetchStudents = async () => {
                        try {
                                setLoading(true);
                                setError(null);

                                const data = await getStudentUsers();
                                setStudents(data.items || []);
                        } catch (err) {
                                setError(err.message || 'Nie udalo sie pobrac danych studenta');
                        } finally {
                                setLoading(false);
                        }
                };

                fetchStudents();
        }, [token]);

        const student = useMemo(() => {
                return students.find((item) => item.id === studentId) || null;
        }, [studentId, students]);

        const derivedSemester = useMemo(() => {
                if (!student?.createdAt) {
                        return 'Semestr 1';
                }

                const createdDate = new Date(student.createdAt);
                const now = new Date();
                const yearsDiff = Math.max(0, now.getFullYear() - createdDate.getFullYear());
                const semesterNumber = Math.min(7, yearsDiff * 2 + 1);
                return `Semestr ${semesterNumber}`;
        }, [student]);

        const handleLogout = () => {
                setToken('');
                localStorage.removeItem('token');
                navigate('/admin');
        };

        if (!token) {
                return null;
        }

        if (loading) {
                return (
                        <AdminLayout onLogout={handleLogout}>
                                <div className="admin-student-grades__state">Ladowanie danych studenta...</div>
                        </AdminLayout>
                );
        }

        if (error) {
                return (
                        <AdminLayout onLogout={handleLogout}>
                                <div className="admin-student-grades__state admin-student-grades__state--error">{error}</div>
                        </AdminLayout>
                );
        }

        if (!student) {
                return (
                        <AdminLayout onLogout={handleLogout}>
                                <div className="admin-student-grades__state">Nie znaleziono studenta.</div>
                        </AdminLayout>
                );
        }

        return (
                <AdminLayout onLogout={handleLogout}>
                        <div className="admin-student-grades">
                                <section className="admin-student-grades__header">
                                        <div>
                                                <div className="admin-student-grades__header-actions">
                                                        <button 
                                                                type="button" 
                                                                onClick={() => navigate('/admin/quizzes/student-grades')}
                                                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#2563eb', fontWeight: '600', fontSize: '1rem' }}
                                                        >
                                                                ← Powrot
                                                        </button>
                                                </div>
                                                <h1>{student.firstName} {student.lastName}</h1>
                                                <p>{student.email} • {derivedSemester}</p>
                                        </div>

                                        <div className="admin-student-grades__profile">
                                                <div className="admin-student-grades__avatar">
                                                        {(student.firstName?.[0] || '?')}{(student.lastName?.[0] || '?')}
                                                </div>
                                        </div>
                                </section>

                                <section className="admin-student-grades__filters">
                                        <div className="admin-student-grades__search">
                                                <span className="material-symbols-outlined">search</span>
                                                <input
                                                        type="text"
                                                        placeholder="Szukaj kursu..."
                                                        value={searchQuery}
                                                        onChange={(event) => setSearchQuery(event.target.value)}
                                                />
                                        </div>
                                        <select value={semester} onChange={(event) => setSemester(event.target.value)}>
                                                <option value="all">Wszystkie semestry</option>
                                                <option value={derivedSemester}>{derivedSemester}</option>
                                        </select>
                                </section>

                                <div className="admin-student-grades__courses">
                                        <p style={{ textAlign: 'center', color: '#6b7280', padding: '2rem' }}>
                                                Wyniki ocen i notatki z kursów będą wyświetlane tutaj gdy dane będą dostępne w systemie.
                                        </p>
                                </div>
                        </div>
                </AdminLayout>
        );
};

export default StudentGradesDetailsPage;
