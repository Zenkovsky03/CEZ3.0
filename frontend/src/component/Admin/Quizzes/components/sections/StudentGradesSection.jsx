import React, { useEffect, useMemo, useState } from 'react';
import { StudentGradesTable } from '../ui';
import { getStudentUsers } from '../../../../../services/adminApi';

const StudentGradesSection = ({ token, onOpenStudent }) => {
	const [studentNameQuery, setStudentNameQuery] = useState('');
	const [semesterFilter, setSemesterFilter] = useState('all');
	const [studentStatusFilter, setStudentStatusFilter] = useState('all');
	const [students, setStudents] = useState([]);
	const [studentsLoading, setStudentsLoading] = useState(false);
	const [studentsError, setStudentsError] = useState(null);

	useEffect(() => {
		if (!token) {
			return;
		}

		const fetchStudents = async () => {
			try {
				setStudentsLoading(true);
				setStudentsError(null);

				const data = await getStudentUsers();
				setStudents(data.items || []);
			} catch (error) {
				setStudentsError(error.message || 'Nie udalo sie pobrac listy studentow');
			} finally {
				setStudentsLoading(false);
			}
		};

		fetchStudents();
	}, [token]);

	const gradeRows = useMemo(() => {
		const now = new Date();

		return students
			.filter((student) => student.role === 'Student')
			.map((student, index) => {
				const createdDate = student.createdAt ? new Date(student.createdAt) : now;
				const yearsDiff = Math.max(0, now.getFullYear() - createdDate.getFullYear());
				const semesterNumber = Math.min(7, yearsDiff * 2 + 1);

				return {
					id: student.id,
					firstName: student.firstName,
					lastName: student.lastName,
					email: student.email,
					semester: `Semestr ${semesterNumber}`,
					status: student.isBlocked ? 'Zablokowany' : student.isActive ? 'Aktywny' : 'Nieaktywny',
					averageGrade: ['4.5', '3.5', '5.0', '4.0', '3.0'][index % 5],
					lastUpdate: createdDate.toLocaleDateString('pl-PL')
				};
			});
	}, [students]);

	const filteredGradeRows = useMemo(() => {
		const normalizedQuery = studentNameQuery.trim().toLowerCase();

		return gradeRows.filter((row) => {
			const fullName = `${row.firstName} ${row.lastName}`.toLowerCase();
			const matchesName = !normalizedQuery || fullName.includes(normalizedQuery);
			const matchesSemester = semesterFilter === 'all' || row.semester === semesterFilter;
			const matchesStatus = studentStatusFilter === 'all' || row.status === studentStatusFilter;

			return matchesName && matchesSemester && matchesStatus;
		});
	}, [gradeRows, semesterFilter, studentNameQuery, studentStatusFilter]);

	const availableSemesters = useMemo(() => {
		const unique = [...new Set(gradeRows.map((row) => row.semester))];
		return unique.sort((a, b) => a.localeCompare(b, 'pl'));
	}, [gradeRows]);

	return (
		<>
			<div className="admin-quizzes__filters admin-quizzes__filters--grades">
				<div className="admin-quizzes__search">
					<span className="material-symbols-outlined">search</span>
					<input
						type="text"
						placeholder="Szukaj po imieniu i nazwisku..."
						value={studentNameQuery}
						onChange={(event) => setStudentNameQuery(event.target.value)}
					/>
				</div>

				<select value={semesterFilter} onChange={(event) => setSemesterFilter(event.target.value)}>
					<option value="all">Wszystkie semestry</option>
					{availableSemesters.map((semester) => (
						<option key={semester} value={semester}>
							{semester}
						</option>
					))}
				</select>

				<select value={studentStatusFilter} onChange={(event) => setStudentStatusFilter(event.target.value)}>
					<option value="all">Wszystkie statusy</option>
					<option value="Aktywny">Aktywny</option>
					<option value="Nieaktywny">Nieaktywny</option>
					<option value="Zablokowany">Zablokowany</option>
				</select>
			</div>

			<StudentGradesTable
				rows={filteredGradeRows}
				loading={studentsLoading}
				error={studentsError}
				onOpenStudent={onOpenStudent}
			/>
		</>
	);
};

export default StudentGradesSection;
