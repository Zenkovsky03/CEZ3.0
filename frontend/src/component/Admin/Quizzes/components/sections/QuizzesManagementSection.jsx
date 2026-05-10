import React, { useEffect, useMemo, useState, useContext } from 'react';
import { QuizzesPagination, QuizzesTable } from '../ui';
import { SearchContext } from '../../../../../context/SearchContext';
import { getCourses } from '../../../../../services/adminApi';

const getMockQuizzes = (courses) => {
	const courseMap = {};
	(courses || []).forEach((course) => {
		const instructor = [course.owner?.firstName, course.owner?.lastName]
			.filter(Boolean)
			.join(' ')
			.trim() || 'Brak prowadzącego';
		courseMap[course.name] = instructor;
	});

	return [
		{
			id: '1',
			quizId: 'python-basics',
			title: 'Podstawy Python - Modul 1',
			courseName: 'Informatyka I',
			instructor: courseMap['Informatyka I'] || 'Dr Janusz Kowalski',
			questions: 20,
			timeLimit: 30,
			status: 'Aktywny'
		},
		{
			id: '2',
			quizId: 'data-analysis',
			title: 'Analiza Danych - Egzamin',
			courseName: 'Statystyka II',
			instructor: courseMap['Statystyka II'] || 'Mgr Anna Nowak',
			questions: 45,
			timeLimit: 90,
			status: 'Szkic'
		},
		{
			id: '3',
			quizId: 'ui-patterns',
			title: 'UX Design Patterns Quiz',
			courseName: 'Projektowanie',
			instructor: courseMap['Projektowanie'] || 'Prof. Marek Ziolko',
			questions: 15,
			timeLimit: 20,
			status: 'Aktywny'
		}
	];
};

const QuizzesManagementSection = ({ onOpenQuizStudents }) => {
	const { searchQuery, setSearchQuery } = useContext(SearchContext);
	const [teacherFilter, setTeacherFilter] = useState('Wszyscy prowadzący');
	const [courseFilter, setCourseFilter] = useState('Wszystkie kursy');
	const [courseOptions, setCourseOptions] = useState([]);
	const [courses, setCourses] = useState([]);
	const [teacherOptions, setTeacherOptions] = useState(['Wszyscy prowadzący']);
	const [loadingCourses, setLoadingCourses] = useState(false);
	const [courseError, setCourseError] = useState(null);

	useEffect(() => {
		const loadCourses = async () => {
			try {
				setLoadingCourses(true);
				setCourseError(null);
				const data = await getCourses();
				setCourses(data || []);
				setCourseOptions((data || []).map((course) => course.name));
				
				// Store course names for later retrieval
				(data || []).forEach((course) => {
					localStorage.setItem(`courseName_${course.id}`, course.name);
				});
				
				// Extract unique instructors
				const instructors = new Set(['Wszyscy prowadzący']);
				(data || []).forEach((course) => {
					const instructor = [course.owner?.firstName, course.owner?.lastName]
						.filter(Boolean)
						.join(' ')
						.trim();
					if (instructor) {
						instructors.add(instructor);
					}
				});
				setTeacherOptions(Array.from(instructors));
			} catch (error) {
				setCourseError(error.message || 'Nie udało się pobrać kursów');
			} finally {
				setLoadingCourses(false);
			}
		};

		loadCourses();
	}, []);

	const rows = useMemo(() => {
		// Get stored quizzes from localStorage, fall back to mock data
		const storedQuizzes = JSON.parse(localStorage.getItem('mockQuizzes') || '[]');
		const mockData = getMockQuizzes(courses);
		return storedQuizzes.length > 0 ? storedQuizzes : mockData;
	}, [courses]);

	const filteredRows = useMemo(() => {
		const query = searchQuery.trim().toLowerCase();

		return rows.filter((row) => {
			const matchesQuery = !query || [row.title, row.courseName, row.instructor, row.status].some((field) => field.toLowerCase().includes(query));
			const matchesTeacher = teacherFilter === 'Wszyscy prowadzący' || row.instructor === teacherFilter;
			const matchesCourse = courseFilter === 'Wszystkie kursy' || row.courseName === courseFilter;

			return matchesQuery && matchesTeacher && matchesCourse;
		});
	}, [courseFilter, searchQuery, teacherFilter, rows]);

	return (
		<>
			<div className="admin-quizzes__filters">
				<div className="admin-quizzes__search">
					<span className="material-symbols-outlined">search</span>
					<input type="text" placeholder="Szukaj quizu..." value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} />
				</div>

				<select value={teacherFilter} onChange={(event) => setTeacherFilter(event.target.value)}>
					{teacherOptions.map((teacher) => (
						<option key={teacher}>{teacher}</option>
					))}
				</select>

				<select value={courseFilter} onChange={(event) => setCourseFilter(event.target.value)} disabled={loadingCourses}>
					<option>Wszystkie kursy</option>
					{courseOptions.map((courseName) => (
						<option key={courseName}>{courseName}</option>
					))}
				</select>
			</div>

			{courseError && <div className="admin-grades__state admin-grades__state--error">{courseError}</div>}

			<QuizzesTable rows={filteredRows} onRowOpen={onOpenQuizStudents} />
			<QuizzesPagination totalItems={filteredRows.length} itemsPerPage={10} currentPage={1} />
		</>
	);
};

export default QuizzesManagementSection;
