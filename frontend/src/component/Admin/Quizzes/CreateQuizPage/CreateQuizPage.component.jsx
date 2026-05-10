import React from 'react';
import { Link } from 'react-router-dom';
import QuizForm from '../components/forms/QuizForm';
import '../../../Course/CourseCreate/CourseCreate.scss';

const CreateQuizPage = () => {
	return (
		<div className="page-wrapper-course">
			<div className="page-container">
				<main className="main-content">
					<div className="course-wrapper">
						<div className="course-header-text">
							<h1 className="course-title">Utwórz nowy quiz</h1>
							<p className="course-subtitle">
								Wypełnij formularz, aby utworzyć nowy quiz dla wybranego kursu.
							</p>
						</div>

						<div className="course-card">
							<QuizForm />
						</div>

						<p className="back-link-text">
							<Link className="link" to="/admin/quizzes">
								← Powrót do quizów
							</Link>
						</p>
					</div>
				</main>
			</div>
		</div>
	);
};

export default CreateQuizPage;
