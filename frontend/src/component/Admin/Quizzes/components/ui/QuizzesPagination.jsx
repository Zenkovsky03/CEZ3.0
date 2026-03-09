import React from 'react';
import '../../AdminQuizzesPageNew.scss';

const QuizzesPagination = ({ currentPage, totalItems, itemsPerPage }) => {
	const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
	const startItem = totalItems > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0;
	const endItem = Math.min(currentPage * itemsPerPage, totalItems);

	return (
		<div className="admin-quizzes__pagination">
			<span>
				Wyswietlanie {startItem}-{endItem} z {totalItems} quizow
			</span>
			<div className="admin-quizzes__pages">
				<button type="button" className="admin-quizzes__page-btn" aria-label="Poprzednia" disabled>
					<span className="material-symbols-outlined">chevron_left</span>
				</button>
				<button type="button" className="admin-quizzes__page-btn admin-quizzes__page-btn--active">
					{currentPage}
				</button>
				{totalPages > currentPage + 1 && <span className="admin-quizzes__dots">...</span>}
				{totalPages > currentPage && (
					<button type="button" className="admin-quizzes__page-btn">
						{totalPages}
					</button>
				)}
				<button
					type="button"
					className="admin-quizzes__page-btn"
					aria-label="Nastepna"
					disabled={totalPages <= currentPage}
				>
					<span className="material-symbols-outlined">chevron_right</span>
				</button>
			</div>
		</div>
	);
};

export default QuizzesPagination;
