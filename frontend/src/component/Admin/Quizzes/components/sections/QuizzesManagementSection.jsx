import React from 'react';
import { QuizzesPagination, QuizzesTable } from '../ui';

const rows = [
	{
		id: '1',
		quizId: 'python-basics',
		title: 'Podstawy Python - Modul 1',
		courseName: 'Informatyka I',
		questions: 20,
		timeLimit: 30,
		status: 'Aktywny'
	},
	{
		id: '2',
		quizId: 'data-analysis',
		title: 'Analiza Danych - Egzamin',
		courseName: 'Statystyka II',
		questions: 45,
		timeLimit: 90,
		status: 'Szkic'
	},
	{
		id: '3',
		quizId: 'ui-patterns',
		title: 'UX Design Patterns Quiz',
		courseName: 'Projektowanie',
		questions: 15,
		timeLimit: 20,
		status: 'Aktywny'
	}
];

const QuizzesManagementSection = ({ onOpenQuizStudents }) => {
	return (
		<>
			<div className="admin-quizzes__filters">
				<div className="admin-quizzes__search">
					<span className="material-symbols-outlined">search</span>
					<input type="text" placeholder="Szukaj quizu..." />
				</div>

				<select defaultValue="Prowadzacy">
					<option>Prowadzacy</option>
					<option>Dr Janusz Kowalski</option>
					<option>Mgr Anna Nowak</option>
					<option>Prof. Marek Ziolko</option>
				</select>

				<select defaultValue="Wybierz kurs">
					<option>Wybierz kurs</option>
					<option>Informatyka I</option>
					<option>Statystyka II</option>
					<option>Projektowanie</option>
				</select>
			</div>

			<QuizzesTable rows={rows} onRowOpen={onOpenQuizStudents} />
			<QuizzesPagination totalItems={rows.length} itemsPerPage={10} currentPage={1} />
		</>
	);
};

export default QuizzesManagementSection;
