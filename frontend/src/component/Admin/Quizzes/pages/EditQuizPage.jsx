import React, { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminLayout from '../../Layout/AdminLayout';
import '../AdminQuizzesPageNew.scss';

const quizDataMap = {
    'python-basics': {
        breadcrumb: 'Quiz: Wstep do Python',
        title: 'Szczegoly i Wyniki Quizu',
        subtitle: 'Lista studentow i ich osiagniecia w tym quizie',
        stats: [
            { label: 'Total Attempts', value: '124', delta: '+5%', icon: 'group', positive: true },
            { label: 'Average Score', value: '78%', delta: '+2%', icon: 'analytics', positive: true },
            { label: 'Pass Rate', value: '82%', delta: '-1%', icon: 'check_circle', positive: false },
            { label: 'Highest Score', value: '100%', delta: '0%', icon: 'star', neutral: true }
        ],
        students: [
            {
                id: 's1',
                name: 'Adam Kowalski',
                email: 'adam.k@cez30.pl',
                initials: 'AK',
                status: 'Ukonczone',
                scoreText: '92 / 100',
                scorePercent: 92,
                scoreColor: 'green',
                mark: '5.0',
                markClass: 'admin-quiz-details__mark--primary',
                submittedAt: '12.10.2023, 14:30',
                feedbackEnabled: true,
                actions: ['edit', 'description']
            },
            {
                id: 's2',
                name: 'Anna Nowak',
                email: 'anna.n@cez30.pl',
                initials: 'AN',
                status: 'W trakcie',
                scoreText: 'Brak danych',
                scorePercent: null,
                scoreColor: 'gray',
                mark: '-',
                markClass: 'admin-quiz-details__mark--muted',
                submittedAt: '-',
                feedbackEnabled: false,
                actions: ['visibility']
            },
            {
                id: 's3',
                name: 'Piotr Wisniewski',
                email: 'piotr.w@cez30.pl',
                initials: 'PW',
                status: 'Ukonczone',
                scoreText: '65 / 100',
                scorePercent: 65,
                scoreColor: 'amber',
                mark: '3.5',
                markClass: 'admin-quiz-details__mark--warn',
                submittedAt: '12.10.2023, 15:10',
                feedbackEnabled: true,
                actions: ['edit', 'description']
            },
            {
                id: 's4',
                name: 'Marek Zielinski',
                email: 'marek.z@cez30.pl',
                initials: 'MZ',
                status: 'Nierozpoczete',
                scoreText: '-',
                scorePercent: null,
                scoreColor: 'gray',
                mark: '-',
                markClass: 'admin-quiz-details__mark--muted',
                submittedAt: '-',
                feedbackEnabled: false,
                actions: ['mail']
            }
        ]
    }
};

const statusClass = {
    Ukonczone: 'admin-quiz-details__status admin-quiz-details__status--done',
    'W trakcie': 'admin-quiz-details__status admin-quiz-details__status--progress',
    Nierozpoczete: 'admin-quiz-details__status admin-quiz-details__status--not-started'
};

function EditQuizPage() {
    const navigate = useNavigate();
    const { quizId } = useParams();
    const [token, setToken] = useState(localStorage.getItem('token') || '');

    const quiz = useMemo(() => quizDataMap[quizId] || quizDataMap['python-basics'], [quizId]);

    const handleLogout = () => {
        setToken('');
        localStorage.removeItem('token');
        navigate('/admin');
    };

    if (!token) {
        return null;
    }

    return (
        <AdminLayout onLogout={handleLogout}>
            <div className="admin-quiz-details">
                <nav className="admin-quiz-details__breadcrumbs" aria-label="Breadcrumb">
                    <button type="button" onClick={() => navigate('/admin/quizzes')}>Quizy</button>
                    <span className="material-symbols-outlined">chevron_right</span>
                    <span>{quiz.breadcrumb}</span>
                </nav>

                <div className="admin-quiz-details__title-row">
                    <div>
                        <h1>{quiz.title}</h1>
                        <p>{quiz.subtitle}</p>
                    </div>
                    <button className="admin-quiz-details__back-btn" type="button" onClick={() => navigate('/admin/quizzes')}>
                        <span className="material-symbols-outlined">arrow_back</span>
                        <span>Powrot do listy</span>
                    </button>
                </div>

                <div className="admin-quiz-details__stats-grid">
                    {quiz.stats.map((stat) => (
                        <article key={stat.label} className="admin-quiz-details__stat-card">
                            <div className="admin-quiz-details__stat-top">
                                <span>{stat.label}</span>
                                <div className="admin-quiz-details__stat-icon">
                                    <span className="material-symbols-outlined">{stat.icon}</span>
                                </div>
                            </div>
                            <div className="admin-quiz-details__stat-values">
                                <strong>{stat.value}</strong>
                                <em className={stat.neutral ? 'is-neutral' : stat.positive ? 'is-positive' : 'is-negative'}>
                                    {stat.delta}
                                </em>
                            </div>
                        </article>
                    ))}
                </div>

                <section className="admin-quiz-details__table-card">
                    <div className="admin-quiz-details__table-toolbar">
                        <h3>Lista wynikow</h3>
                        <div className="admin-quiz-details__selects">
                            <select defaultValue="Wszystkie statusy">
                                <option>Wszystkie statusy</option>
                                <option>Ukonczone</option>
                                <option>W trakcie</option>
                                <option>Nierozpoczete</option>
                            </select>
                            <select defaultValue="Wszystkie grupy">
                                <option>Wszystkie grupy</option>
                                <option>Grupa A</option>
                                <option>Grupa B</option>
                            </select>
                            <select defaultValue="Zakres punktow">
                                <option>Zakres punktow</option>
                                <option>90-100%</option>
                                <option>70-89%</option>
                                <option>Ponizej 70%</option>
                            </select>
                        </div>
                    </div>

                    <div className="admin-quiz-details__table-wrap">
                        <table className="admin-quiz-details__table">
                            <thead>
                                <tr>
                                    <th>Student</th>
                                    <th>Status</th>
                                    <th>Wynik</th>
                                    <th>Ocena</th>
                                    <th>Data przeslania</th>
                                    <th>Feedback</th>
                                    <th className="admin-quiz-details__th-right">Akcje</th>
                                </tr>
                            </thead>
                            <tbody>
                                {quiz.students.map((student) => (
                                    <tr key={student.id}>
                                        <td>
                                            <div className="admin-quiz-details__student-cell">
                                                <div className="admin-quiz-details__avatar">{student.initials}</div>
                                                <div>
                                                    <p>{student.name}</p>
                                                    <small>{student.email}</small>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <span className={statusClass[student.status]}>{student.status}</span>
                                        </td>
                                        <td>
                                            {student.scorePercent === null ? (
                                                <span className="admin-quiz-details__muted">Brak danych</span>
                                            ) : (
                                                <div className="admin-quiz-details__score-block">
                                                    <span>{student.scoreText}</span>
                                                    <div className="admin-quiz-details__progress-track">
                                                        <div
                                                            className={`admin-quiz-details__progress-fill admin-quiz-details__progress-fill--${student.scoreColor}`}
                                                            style={{ width: `${student.scorePercent}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </td>
                                        <td>
                                            <span className={`admin-quiz-details__mark ${student.markClass}`}>{student.mark}</span>
                                        </td>
                                        <td>
                                            <span className="admin-quiz-details__date">{student.submittedAt}</span>
                                        </td>
                                        <td>
                                            <button
                                                type="button"
                                                className={`admin-quiz-details__icon-btn ${student.feedbackEnabled ? '' : 'is-disabled'}`}
                                                disabled={!student.feedbackEnabled}
                                                aria-label="Feedback"
                                            >
                                                <span className="material-symbols-outlined">comment_bank</span>
                                            </button>
                                        </td>
                                        <td className="admin-quiz-details__td-right">
                                            <div className="admin-quiz-details__actions">
                                                {student.actions.map((action) => (
                                                    <button key={`${student.id}-${action}`} type="button" className="admin-quiz-details__icon-btn" aria-label={action}>
                                                        <span className="material-symbols-outlined">{action}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="admin-quiz-details__pagination">
                        <p>Pokazano 1-10 z 124 wynikow</p>
                        <div>
                            <button type="button" disabled>Poprzednia</button>
                            <button type="button" className="is-active">1</button>
                            <button type="button">2</button>
                            <button type="button">3</button>
                            <button type="button">Nastepna</button>
                        </div>
                    </div>
                </section>
            </div>
        </AdminLayout>
    );
}

export default EditQuizPage;
