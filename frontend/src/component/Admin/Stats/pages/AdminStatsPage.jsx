import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../Layout/AdminLayout';
import { getDashboardSnapshot } from '../../../../services/adminApi';
import './AdminStatsPage.scss';

const AdminStatsPage = () => {
	const navigate = useNavigate();
	const [token, setToken] = useState(localStorage.getItem('token') || '');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [snapshot, setSnapshot] = useState({ kpis: [], topCourses: [], weeklyActivity: [] });

	useEffect(() => {
		if (!token) {
			return;
		}

		const loadStats = async () => {
			try {
				setLoading(true);
				setError(null);
				const data = await getDashboardSnapshot();
				setSnapshot(data);
			} catch (statsError) {
				setError(statsError.message || 'Nie udało się pobrać statystyk');
			} finally {
				setLoading(false);
			}
		};

		loadStats();
	}, [token]);

	const handleLogout = () => {
		setToken('');
		localStorage.removeItem('token');
		navigate('/admin');
	};

	if (!token) {
		return null;
	}

	const users = snapshot.users || [];
	const activeUsers = snapshot.activeUsers || [];
	const blockedUsers = snapshot.blockedUsers || [];

	const stats = [
		{
			title: 'Użytkownicy ogółem',
			value: users.length,
			icon: 'group',
			color: 'blue',
			description: 'Zarejestrowanych użytkowników'
		},
		{
			title: 'Aktywni',
			value: activeUsers.length,
			icon: 'check_circle',
			color: 'green',
			description: 'Aktywnych kont'
		},
		{
			title: 'Zablokowanych',
			value: blockedUsers.length,
			icon: 'block',
			color: 'red',
			description: 'Zablokowanych użytkowników'
		},
		{
			title: 'Kursy',
			value: (snapshot.topCourses || []).length,
			icon: 'school',
			color: 'purple',
			description: 'Dostępnych kursów'
		}
	];

	return (
		<AdminLayout onLogout={handleLogout}>
			<div className="admin-stats">
				<div className="admin-stats__header">
					<div>
						<h1>Statystyki</h1>
						<p>Przegląd danych platformy edukacyjnej</p>
					</div>
				</div>

				{error && (
					<div className="admin-stats__error">
						<span className="material-symbols-outlined">error</span>
						{error}
					</div>
				)}

				{loading ? (
					<div className="admin-stats__loading">Ładowanie statystyk...</div>
				) : (
					<>
						{/* KPI Cards */}
						<div className="admin-stats__cards">
							{stats.map((stat, idx) => (
								<div key={idx} className={`admin-stats__card admin-stats__card--${stat.color}`}>
									<div className="admin-stats__card-icon">
										<span className="material-symbols-outlined">{stat.icon}</span>
									</div>
									<div className="admin-stats__card-content">
										<p className="admin-stats__card-title">{stat.title}</p>
										<p className="admin-stats__card-value">{stat.value}</p>
										<p className="admin-stats__card-desc">{stat.description}</p>
									</div>
								</div>
							))}
						</div>

						{/* User Distribution */}
						<div className="admin-stats__grid">
							<div className="admin-stats__panel">
								<div className="admin-stats__panel-header">
									<h2>
										<span className="material-symbols-outlined">pie_chart</span>
										Rozkład użytkowników
									</h2>
									<p>Liczba użytkowników według ról</p>
								</div>
								<div className="admin-stats__distribution">
									<div className="admin-stats__dist-item">
										<div className="admin-stats__dist-label">
											<span className="admin-stats__dist-badge admin-stats__dist-badge--admin">👨‍💼</span>
											<span>Administratorzy</span>
										</div>
										<div className="admin-stats__dist-bar">
											<div 
												className="admin-stats__dist-fill admin-stats__dist-fill--admin"
												style={{ width: `${Math.min(100, (users.filter(u => u.role === 'Admin').length / (users.length || 1)) * 100)}%` }}
											/>
										</div>
										<span className="admin-stats__dist-count">
											{users.filter(u => u.role === 'Admin').length}
										</span>
									</div>

									<div className="admin-stats__dist-item">
										<div className="admin-stats__dist-label">
											<span className="admin-stats__dist-badge admin-stats__dist-badge--teacher">👨‍🏫</span>
											<span>Nauczyciele</span>
										</div>
										<div className="admin-stats__dist-bar">
											<div 
												className="admin-stats__dist-fill admin-stats__dist-fill--teacher"
												style={{ width: `${Math.min(100, (users.filter(u => u.role === 'Teacher').length / (users.length || 1)) * 100)}%` }}
											/>
										</div>
										<span className="admin-stats__dist-count">
											{users.filter(u => u.role === 'Teacher').length}
										</span>
									</div>

									<div className="admin-stats__dist-item">
										<div className="admin-stats__dist-label">
											<span className="admin-stats__dist-badge admin-stats__dist-badge--student">👨‍🎓</span>
											<span>Studenci</span>
										</div>
										<div className="admin-stats__dist-bar">
											<div 
												className="admin-stats__dist-fill admin-stats__dist-fill--student"
												style={{ width: `${Math.min(100, (users.filter(u => u.role === 'Student').length / (users.length || 1)) * 100)}%` }}
											/>
										</div>
										<span className="admin-stats__dist-count">
											{users.filter(u => u.role === 'Student').length}
										</span>
									</div>
								</div>
							</div>

							<div className="admin-stats__panel">
								<div className="admin-stats__panel-header">
									<h2>
										<span className="material-symbols-outlined">trending_up</span>
										Top Kursy
									</h2>
									<p>Najpopularniejsze kursy</p>
								</div>
								<div className="admin-stats__top-courses">
									{(snapshot.topCourses || []).length > 0 ? (
										(snapshot.topCourses || []).slice(0, 5).map((course, idx) => (
											<div key={idx} className="admin-stats__course-item">
												<div className="admin-stats__course-rank">{idx + 1}</div>
												<div className="admin-stats__course-info">
													<p className="admin-stats__course-name">{course.name || 'Bez nazwy'}</p>
													<p className="admin-stats__course-meta">
														{course.studentCount || 0} studentów
													</p>
												</div>
												<div className="admin-stats__course-badge">
													{course.studentCount || 0}
												</div>
											</div>
										))
									) : (
										<p style={{ color: '#9ca3af', textAlign: 'center', padding: '1rem' }}>Brak danych o kursach</p>
									)}
								</div>
							</div>
						</div>

						{/* Status Summary */}
						<div className="admin-stats__summary">
							<div className="admin-stats__summary-item">
								<span className="material-symbols-outlined admin-stats__summary-icon admin-stats__summary-icon--success">check_circle</span>
								<div>
									<p className="admin-stats__summary-label">Aktywne konta</p>
									<p className="admin-stats__summary-value">{activeUsers.length}</p>
								</div>
							</div>
							<div className="admin-stats__summary-item">
								<span className="material-symbols-outlined admin-stats__summary-icon admin-stats__summary-icon--danger">block</span>
								<div>
									<p className="admin-stats__summary-label">Zablokowane konta</p>
									<p className="admin-stats__summary-value">{blockedUsers.length}</p>
								</div>
							</div>
							<div className="admin-stats__summary-item">
								<span className="material-symbols-outlined admin-stats__summary-icon admin-stats__summary-icon--info">info</span>
								<div>
									<p className="admin-stats__summary-label">Łącznie użytkowników</p>
									<p className="admin-stats__summary-value">{users.length}</p>
								</div>
							</div>
						</div>
					</>
				)}
			</div>
		</AdminLayout>
	);
};

export default AdminStatsPage;
