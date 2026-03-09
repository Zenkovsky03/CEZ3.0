import React from 'react';
import '../../AdminQuizzesPageNew.scss';

const QuizzesStatsCards = ({ cards = [] }) => {
	if (!cards.length) {
		return null;
	}

	return (
		<div className="admin-quizzes__stats-grid">
			{cards.map((card) => (
				<article
					key={card.label}
					className={`admin-quizzes__stat-card ${card.warning ? 'admin-quizzes__stat-card--warning' : ''}`}
				>
					<p>{card.label}</p>
					<h3 className={card.highlighted ? 'admin-quizzes__stat-value--primary' : ''}>{card.value}</h3>
				</article>
			))}
		</div>
	);
};

export default QuizzesStatsCards;
