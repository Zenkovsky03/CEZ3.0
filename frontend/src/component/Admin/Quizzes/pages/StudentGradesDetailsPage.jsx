import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminLayout from '../../Layout/AdminLayout';
import '../AdminQuizzesPageNew.scss';

const courseCatalog = [
	{
		id: 'python',
		title: 'Podstawy Python',
		teacher: 'dr inz. Andrzej Nowak',
		icon: 'code',
		tasks: [
			{ name: 'Kolokwium I - Skladnia', date: '12.10.2023', score: '18 / 20', weight: '30%', status: 'Zaliczone', percent: 90 },
			{ name: 'Projekt Koncowy - Sklep', date: '15.12.2023', score: '50 / 50', weight: '50%', status: 'Zaliczone', percent: 100 }
		]
	},
	{
		id: 'sql',
		title: 'Bazy Danych SQL',
		teacher: 'mgr inz. Marek Kowal',
		icon: 'database',
		tasks: [
			{ name: 'Kartkowka - Model relacyjny', date: '05.11.2023', score: '14 / 15', weight: '10%', status: 'Zaliczone', percent: 93 },
			{ name: 'Egzamin semestralny', date: '20.01.2024', score: 'Oczekiwanie', weight: '60%', status: 'Oczekuje', percent: null }
		]
	}
];

const getStatusClass = (status) => {
	if (status === 'Zaliczone') {
		return 'admin-student-grades__badge admin-student-grades__badge--done';
	}

	if (status === 'Oczekuje') {
		return 'admin-student-grades__badge admin-student-grades__badge--pending';
	}

	return 'admin-student-grades__badge';
};

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

				const response = await fetch('/api/user/users?PageNumber=1&PageSize=1000&Role=Student', {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${token}`
					}
				});

				if (!response.ok) {
					throw new Error(`HTTP ${response.status}`);
				}

				const data = await response.json();
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

	const visibleCourses = useMemo(() => {
		const normalizedQuery = searchQuery.trim().toLowerCase();
		const semesterMatch = semester === 'all' || semester === derivedSemester;

		if (!semesterMatch) {
			return [];
		}

		if (!normalizedQuery) {
			return courseCatalog;
		}

		return courseCatalog.filter((course) => course.title.toLowerCase().includes(normalizedQuery));
	}, [derivedSemester, searchQuery, semester]);

	const summary = useMemo(() => {
		const scores = visibleCourses
			.flatMap((course) => course.tasks)
			.filter((task) => task.percent !== null)
			.map((task) => task.percent);
		const average = scores.length ? (scores.reduce((acc, val) => acc + val, 0) / scores.length) / 20 : 0;
		return {
			gpa: average ? average.toFixed(2) : '0.00',
			courses: `${visibleCourses.length}/${courseCatalog.length}`,
			attendance: scores.length ? `${Math.round(scores.reduce((acc, val) => acc + val, 0) / scores.length)}%` : '0%'
		};
	}, [visibleCourses]);

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
				<nav className="admin-student-grades__breadcrumbs" aria-label="Breadcrumb">
					<button type="button" onClick={() => navigate('/admin/quizzes')}>Oceny</button>
					<span className="material-symbols-outlined">chevron_right</span>
					<span>{student.firstName} {student.lastName}</span>
				</nav>

				<header className="admin-student-grades__header">
					<div>
						<h1>{student.firstName} {student.lastName} - Szczegoly Ocen</h1>
						<p>Podglad wynikow we wszystkich przypisanych kursach</p>
					</div>
					<div className="admin-student-grades__header-actions">
						<button type="button" className="admin-student-grades__btn admin-student-grades__btn--ghost">
							<span className="material-symbols-outlined">download</span>
							Eksportuj PDF
						</button>
						<button type="button" className="admin-student-grades__btn admin-student-grades__btn--primary">
							<span className="material-symbols-outlined">add</span>
							Dodaj ocene
						</button>
					</div>
				</header>

				<section className="admin-student-grades__summary">
					<div className="admin-student-grades__profile">
						<div className="admin-student-grades__avatar">
							{student.firstName[0]}{student.lastName[0]}
						</div>
						<div>
							<h2>{student.firstName} {student.lastName}</h2>
							<p>{student.email}</p>
							<small>{derivedSemester}</small>
						</div>
					</div>
					<div className="admin-student-grades__kpis">
						<article>
							<span>Srednia GPA</span>
							<strong>{summary.gpa}</strong>
						</article>
						<article>
							<span>Frekwencja</span>
							<strong>{summary.attendance}</strong>
						</article>
						<article>
							<span>Kursy</span>
							<strong>{summary.courses}</strong>
						</article>
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
					{visibleCourses.map((course) => {
						const doneTasks = course.tasks.filter((task) => task.percent !== null).map((task) => task.percent);
						const finalMark = doneTasks.length
							? (doneTasks.reduce((acc, val) => acc + val, 0) / doneTasks.length / 20).toFixed(1)
							: 'Brak';

						return (
							<article key={course.id} className="admin-student-grades__course-card">
								<div className="admin-student-grades__course-head">
									<div>
										<div className="admin-student-grades__course-top">
											<span className="material-symbols-outlined">{course.icon}</span>
											<h3>{course.title}</h3>
										</div>
										<p>Prowadzacy: {course.teacher}</p>
									</div>
									<div className="admin-student-grades__final-mark">
										<span>Ocena koncowa</span>
										<strong>{finalMark}</strong>
									</div>
								</div>

								<table className="admin-student-grades__course-table">
									<thead>
										<tr>
											<th>Nazwa zadania</th>
											<th>Data</th>
											<th>Wynik</th>
											<th>Waga</th>
											<th>Status</th>
										</tr>
									</thead>
									<tbody>
										{course.tasks.map((task) => (
											<tr key={`${course.id}-${task.name}`}>
												<td>{task.name}</td>
												<td>{task.date}</td>
												<td>
													<span className="admin-student-grades__score">{task.score}</span>
													{task.percent !== null && (
														<div className="admin-student-grades__progress-track">
															<div className="admin-student-grades__progress-fill" style={{ width: `${task.percent}%` }} />
														</div>
													)}
												</td>
												<td>{task.weight}</td>
												<td><span className={getStatusClass(task.status)}>{task.status}</span></td>
											</tr>
										))}
									</tbody>
								</table>
							</article>
						);
					})}
				</div>
			</div>
		</AdminLayout>
	);
};

export default StudentGradesDetailsPage;
