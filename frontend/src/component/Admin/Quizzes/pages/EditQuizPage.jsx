import React, { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminLayout from '../../Layout/AdminLayout';
import { getStudentUsers } from '../../../../services/adminApi';
import '../AdminQuizzesPageNew.scss';

const quizDataMap = {
	'python-basics': {
		breadcrumb: 'Quiz: Wstep do Python',
		title: 'Szczegoly i Wyniki Quizu',
		subtitle: 'Lista studentow i ich osiagniecia w tym quizie'
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
	const [students, setStudents] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [searchQuery, setSearchQuery] = useState('');
	const [statusFilter, setStatusFilter] = useState('Wszystkie statusy');
	const [editingStudent, setEditingStudent] = useState(null);
	const [editScore, setEditScore] = useState('');
	const [editMark, setEditMark] = useState('');
	const [deletingStudentId, setDeletingStudentId] = useState(null);

	const quiz = useMemo(() => quizDataMap[quizId] || quizDataMap['python-basics'], [quizId]);

	React.useEffect(() => {
		if (!token) return;

		const fetchStudents = async () => {
			try {
				setLoading(true);
				const data = await getStudentUsers();
				// Map students to quiz format with mock scores
				const mappedStudents = (data.items || []).map((student, idx) => ({
					id: student.id,
					name: `${student.firstName} ${student.lastName}`,
					email: student.email,
					initials: `${student.firstName?.[0] || '?'}${student.lastName?.[0] || '?'}`,
					status: ['Ukonczone', 'W trakcie', 'Nierozpoczete'][idx % 3],
					scoreText: idx % 3 === 0 ? `${80 + idx * 2} / 100` : 'Brak danych',
					scorePercent: idx % 3 === 0 ? 80 + idx * 2 : null,
					scoreColor: idx % 3 === 0 ? (idx % 2 === 0 ? 'green' : 'amber') : 'gray',
					mark: idx % 3 === 0 ? (idx % 2 === 0 ? '5.0' : '3.5') : '-',
					markClass: idx % 3 === 0 ? (idx % 2 === 0 ? 'admin-quiz-details__mark--primary' : 'admin-quiz-details__mark--warn') : 'admin-quiz-details__mark--muted',
					submittedAt: idx % 3 === 0 ? '12.10.2023, 14:30' : '-'
				}));
				setStudents(mappedStudents);
			} catch (err) {
				setError(err.message || 'Nie udało się pobrać studentów');
			} finally {
				setLoading(false);
			}
		};

		fetchStudents();
	}, [token]);

	const filteredStudents = useMemo(() => {
		const query = searchQuery.trim().toLowerCase();
		return students.filter((student) => {
			const matchesQuery = !query || [student.name, student.email].some(field => field.toLowerCase().includes(query));
			const matchesStatus = statusFilter === 'Wszystkie statusy' || student.status === statusFilter;
			return matchesQuery && matchesStatus;
		});
	}, [searchQuery, statusFilter, students]);

	const handleLogout = () => {
		setToken('');
		localStorage.removeItem('token');
		navigate('/admin');
	};

	const handleClearFilters = () => {
		setSearchQuery('');
		setStatusFilter('Wszystkie statusy');
	};

	const handleEditClick = (student) => {
		setEditingStudent(student);
		setEditScore(student.scoreText.split(' / ')[0] || '');
		setEditMark(student.mark);
	};

	const handleSaveEdit = () => {
		if (!editingStudent) return;
		
		setStudents(students.map(s => 
			s.id === editingStudent.id 
				? { 
					...s, 
					scoreText: `${editScore} / 100`,
					mark: editMark,
					scorePercent: parseInt(editScore) || 0
				}
				: s
		));
		setEditingStudent(null);
		setEditScore('');
		setEditMark('');
	};

	const handleDeleteClick = (studentId) => {
		setDeletingStudentId(studentId);
	};

	const handleConfirmDelete = () => {
		if (!deletingStudentId) return;
		setStudents(students.filter(s => s.id !== deletingStudentId));
		setDeletingStudentId(null);
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

				{error && (
					<div className="admin-grades__state admin-grades__state--error" style={{ marginBottom: '1rem' }}>
						{error}
					</div>
				)}

				<section className="admin-notifications__filters">
					<div className="admin-notifications__search">
						<span className="material-symbols-outlined">search</span>
						<input
							type="text"
							placeholder="Szukaj studenta..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
						/>
					</div>

					<select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
						<option>Wszystkie statusy</option>
						<option>Ukonczone</option>
						<option>W trakcie</option>
						<option>Nierozpoczete</option>
					</select>

					<button 
						type="button" 
						className="admin-notifications__clear-btn" 
						onClick={handleClearFilters}
						style={{ marginLeft: 'auto' }}
					>
						Wyczysc filtry
					</button>
				</section>

				<section className="admin-quiz-details__table-card">
					<div className="admin-quiz-details__table-wrap">
						{loading ? (
							<div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
								Ładowanie studentów...
							</div>
						) : (
							<table className="admin-quiz-details__table">
								<thead>
									<tr>
										<th>Student</th>
										<th>Status</th>
										<th>Wynik</th>
										<th>Ocena</th>
										<th>Data przeslania</th>
										<th className="admin-quiz-details__th-right">Akcje</th>
									</tr>
								</thead>
								<tbody>
									{filteredStudents.map((student) => (
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
													<strong>{student.scoreText}</strong>
												)}
											</td>
											<td>
												<span className={student.markClass}>{student.mark}</span>
											</td>
											<td>{student.submittedAt}</td>
											<td className="admin-quiz-details__table-right">
												<div className="admin-quiz-details__actions">
												<button 
													type="button" 
													className="admin-quiz-details__icon-btn" 
													aria-label="Edytuj"
													onClick={() => handleEditClick(student)}
												>
													<span className="material-symbols-outlined">edit</span>
												</button>
												<button 
													type="button" 
													className="admin-quiz-details__icon-btn admin-quiz-details__icon-btn--danger" 
													aria-label="Usuń"
													onClick={() => handleDeleteClick(student.id)}
												>
														<span className="material-symbols-outlined">delete</span>
													</button>
												</div>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						)}
					</div>
				</section>
			</div>

			{/* Edit Modal */}
			{editingStudent && (
				<div style={{
					position: 'fixed',
					inset: 0,
					background: 'rgba(0, 0, 0, 0.5)',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					zIndex: 1000
				}}>
					<div style={{
						background: 'white',
						borderRadius: '0.5rem',
						padding: '2rem',
						maxWidth: '400px',
						width: '90%',
						boxShadow: '0 20px 25px rgba(0, 0, 0, 0.15)'
					}}>
						<h2 style={{ marginTop: 0, marginBottom: '1rem' }}>Edytuj wynik</h2>
						<p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
							{editingStudent.name}
						</p>

						<div style={{ marginBottom: '1rem' }}>
							<label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>
								Wynik
							</label>
							<input
								type="number"
								value={editScore}
								onChange={(e) => setEditScore(e.target.value)}
								min="0"
								max="100"
								style={{
									width: '100%',
									padding: '0.5rem',
									border: '1px solid #e5e7eb',
									borderRadius: '0.375rem',
									fontSize: '0.875rem',
									boxSizing: 'border-box'
								}}
							/>
						</div>

						<div style={{ marginBottom: '1.5rem' }}>
							<label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>
								Ocena
							</label>
							<select
								value={editMark}
								onChange={(e) => setEditMark(e.target.value)}
								style={{
									width: '100%',
									padding: '0.5rem',
									border: '1px solid #e5e7eb',
									borderRadius: '0.375rem',
									fontSize: '0.875rem',
									boxSizing: 'border-box'
								}}
							>
								<option value="-">-</option>
								<option value="2.0">2.0</option>
								<option value="3.0">3.0</option>
								<option value="3.5">3.5</option>
								<option value="4.0">4.0</option>
								<option value="4.5">4.5</option>
								<option value="5.0">5.0</option>
							</select>
						</div>

						<div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
							<button
								type="button"
								onClick={() => {
									setEditingStudent(null);
									setEditScore('');
									setEditMark('');
								}}
								style={{
									background: '#f3f4f6',
									border: '1px solid #e5e7eb',
									padding: '0.5rem 1rem',
									borderRadius: '0.375rem',
									cursor: 'pointer',
									fontSize: '0.875rem',
									fontWeight: 600
								}}
							>
								Anuluj
							</button>
							<button
								type="button"
								onClick={handleSaveEdit}
								style={{
									background: '#2563eb',
									color: 'white',
									border: 'none',
									padding: '0.5rem 1rem',
									borderRadius: '0.375rem',
									cursor: 'pointer',
									fontSize: '0.875rem',
									fontWeight: 600
								}}
							>
								Zapisz
							</button>
						</div>
					</div>
				</div>
			)}

			{/* Delete Confirmation Modal */}
			{deletingStudentId && (
				<div style={{
					position: 'fixed',
					inset: 0,
					background: 'rgba(0, 0, 0, 0.5)',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					zIndex: 1000
				}}>
					<div style={{
						background: 'white',
						borderRadius: '0.5rem',
						padding: '2rem',
						maxWidth: '400px',
						width: '90%',
						boxShadow: '0 20px 25px rgba(0, 0, 0, 0.15)'
					}}>
						<h2 style={{ marginTop: 0, color: '#991b1b' }}>Potwierdź usunięcie</h2>
						<p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
							Czy na pewno chcesz usunąć wynik tego studenta? Tej operacji nie można cofnąć.
						</p>

						<div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
							<button
								type="button"
								onClick={() => setDeletingStudentId(null)}
								style={{
									background: '#f3f4f6',
									border: '1px solid #e5e7eb',
									padding: '0.5rem 1rem',
									borderRadius: '0.375rem',
									cursor: 'pointer',
									fontSize: '0.875rem',
									fontWeight: 600
								}}
							>
								Anuluj
							</button>
							<button
								type="button"
								onClick={handleConfirmDelete}
								style={{
									background: '#dc2626',
									color: 'white',
									border: 'none',
									padding: '0.5rem 1rem',
									borderRadius: '0.375rem',
									cursor: 'pointer',
									fontSize: '0.875rem',
									fontWeight: 600
								}}
							>
								Usuń
							</button>
						</div>
					</div>
				</div>
			)}
		</AdminLayout>
	);
}

export default EditQuizPage;
