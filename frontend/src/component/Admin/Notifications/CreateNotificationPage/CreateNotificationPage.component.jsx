import React from 'react';
import { Link } from 'react-router-dom';
import NotificationForm from '../components/ui/NotificationForm';

const CreateNotificationPage = () => {
	return (
		<div className="page-wrapper-course">
			<div className="page-container">
				<main className="main-content">
					<div className="course-wrapper">
						<div className="course-header-text">
							<h1 className="course-title">Utwórz powiadomienie</h1>
							<p className="course-subtitle">
								Wypełnij formularz, aby wysłać powiadomienie do wybranych kursów.
							</p>
						</div>

						<div className="course-card">
							<NotificationForm />
						</div>

						<p className="back-link-text">
							<Link className="link" to="/admin/notifications">
								← Powrót do powiadomień
							</Link>
						</p>
					</div>
				</main>
			</div>
		</div>
	);
};

export default CreateNotificationPage;
