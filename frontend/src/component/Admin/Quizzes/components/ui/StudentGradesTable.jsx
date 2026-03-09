import React from 'react';
import '../../AdminQuizzesPageNew.scss';

const getStatusClass = (status) => {
	if (status === 'Aktywny') {
		return 'admin-grades__status admin-grades__status--active';
	}

	if (status === 'Zablokowany') {
		return 'admin-grades__status admin-grades__status--blocked';
	}

	return 'admin-grades__status admin-grades__status--inactive';
};

const StudentGradesTable = ({ rows, loading, error, onOpenStudent }) => {
	if (loading) {
		return <div className="admin-grades__state">Ladowanie listy ocen studentow...</div>;
	}

	if (error) {
		return <div className="admin-grades__state admin-grades__state--error">{error}</div>;
	}

	if (!rows.length) {
		return <div className="admin-grades__state">Brak wynikow dla wybranych filtrow.</div>;
	}

	return (
		<div className="admin-grades__table-card">
			<div className="admin-grades__table-wrap">
				<table className="admin-grades__table">
					<thead>
						<tr>
							<th>Student</th>
							<th>Email</th>
							<th>Semestr</th>
							<th>Srednia ocena</th>
							<th>Status</th>
							<th>Ostatnia aktualizacja</th>
							<th className="admin-grades__th-right">Szczegoly</th>
						</tr>
					</thead>
					<tbody>
						{rows.map((row) => (
							<tr key={row.id} className="admin-grades__row" onClick={() => onOpenStudent(row.id)}>
								<td>{row.firstName} {row.lastName}</td>
								<td>{row.email}</td>
								<td>{row.semester}</td>
								<td className="admin-grades__grade">{row.averageGrade}</td>
								<td>
									<span className={getStatusClass(row.status)}>{row.status}</span>
								</td>
								<td>{row.lastUpdate}</td>
								<td className="admin-grades__td-right">
									<button
										type="button"
										className="admin-grades__open-btn"
										onClick={(event) => {
											event.stopPropagation();
											onOpenStudent(row.id);
										}}
									>
										<span className="material-symbols-outlined">open_in_new</span>
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default StudentGradesTable;
