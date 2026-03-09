import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../Layout/AdminLayout';
import QuizzesManagementSection from './components/sections/QuizzesManagementSection';
import StudentGradesSection from './components/sections/StudentGradesSection';
import './AdminQuizzesPageNew.scss';

function AdminQuizzesPageNew() {
	const navigate = useNavigate();
	const [token, setToken] = useState(localStorage.getItem('token') || '');
	const [activeTab, setActiveTab] = useState('quizzes');

	const handleLogout = () => {
		setToken('');
		localStorage.removeItem('token');
		navigate('/admin');
	};

	const openQuizStudentsView = (quizId) => {
		navigate(`/admin/quizzes/${quizId}`);
	};

	const openStudentGradesView = (studentId) => {
		navigate(`/admin/quizzes/students/${studentId}`);
	};

	if (!token) {
		return null;
	}

	return (
		<AdminLayout onLogout={handleLogout}>
			<div className="admin-quizzes">
				<section className="admin-quizzes__left">
					<div className="admin-quizzes__header">
						<div>
							<h1>Quizy i Oceny</h1>
							<p>Zarzadzaj arkuszami egzaminacyjnymi i wynikami studentow</p>
						</div>
						<button type="button" className="admin-quizzes__add-btn">
							<span className="material-symbols-outlined">add</span>
							<span>Dodaj nowy quiz</span>
						</button>
					</div>

					<div className="admin-quizzes__tabs">
						<button
							type="button"
							className={`admin-quizzes__tab ${activeTab === 'quizzes' ? 'admin-quizzes__tab--active' : ''}`}
							onClick={() => setActiveTab('quizzes')}
						>
							<span className="material-symbols-outlined">assignment</span>
							Zarzadzanie quizami
						</button>
						<button
							type="button"
							className={`admin-quizzes__tab ${activeTab === 'grades' ? 'admin-quizzes__tab--active' : ''}`}
							onClick={() => setActiveTab('grades')}
						>
							<span className="material-symbols-outlined">grade</span>
							Oceny studentow
						</button>
					</div>

					{activeTab === 'quizzes' ? (
						<QuizzesManagementSection onOpenQuizStudents={openQuizStudentsView} />
					) : (
						<StudentGradesSection token={token} onOpenStudent={openStudentGradesView} />
					)}
				</section>
			</div>
		</AdminLayout>
	);
}

export default AdminQuizzesPageNew;
