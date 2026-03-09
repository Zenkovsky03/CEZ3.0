import React from 'react';
import '../../AdminQuizzesPageNew.scss';

const getStatusClass = (status) => {
	if (status === 'Aktywny') {
		return 'admin-quizzes__status admin-quizzes__status--checked';
	}

	return 'admin-quizzes__status admin-quizzes__status--draft';
};

const QuizzesTable = ({ rows, onRowOpen }) => {
	return (
		<div className="admin-quizzes__table-card">
			<div className="admin-quizzes__table-wrap">
				<table className="admin-quizzes__table">
					<thead>
						<tr>
							<th>Tytul quizu</th>
							<th>Nazwa kursu</th>
							<th className="admin-quizzes__table-center">Pytania</th>
							<th>Limit czasu</th>
							<th>Status</th>
							<th className="admin-quizzes__table-right">Akcje</th>
						</tr>
					</thead>
					<tbody>
						{rows.map((row) => (
							<tr key={row.id} onClick={() => onRowOpen(row.quizId)}>
								<td className="admin-quizzes__title">{row.title}</td>
								<td>{row.courseName}</td>
								<td className="admin-quizzes__table-center">{row.questions}</td>
								<td>{row.timeLimit} min</td>
								<td>
									<span className={getStatusClass(row.status)}>{row.status}</span>
								</td>
								<td className="admin-quizzes__table-right">
									<div className="admin-quizzes__actions">
										<button type="button" className="admin-quizzes__icon-btn" aria-label="Edytuj">
											<span className="material-symbols-outlined">edit</span>
										</button>
										<button type="button" className="admin-quizzes__icon-btn" aria-label="Podglad">
											<span className="material-symbols-outlined">visibility</span>
										</button>
										<button type="button" className="admin-quizzes__icon-btn admin-quizzes__icon-btn--danger" aria-label="Usun">
											<span className="material-symbols-outlined">delete</span>
										</button>
									</div>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default QuizzesTable;
