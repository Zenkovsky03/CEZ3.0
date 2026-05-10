import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import '../../AdminNotificationsPageNew.scss';

const initialFormData = {
	title: '',
	content: '',
	courses: []
};

const CreateNotificationModal = ({ show, courses, loading, error, onSubmit, onCancel }) => {
	const [formData, setFormData] = useState(initialFormData);
	const [localError, setLocalError] = useState('');

	useEffect(() => {
		if (show) {
			setFormData(initialFormData);
			setLocalError('');
		}
	}, [show]);

	if (!show) return null;

	const handleChange = (event) => {
		const { name, value } = event.target;
		setFormData((previous) => ({
			...previous,
			[name]: value
		}));
	};

	const handleCourseToggle = (courseId) => {
		setFormData((previous) => {
			const isSelected = previous.courses.includes(courseId);
			return {
				...previous,
				courses: isSelected
					? previous.courses.filter((id) => id !== courseId)
					: [...previous.courses, courseId]
			};
		});
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		setLocalError('');

		if (!formData.title.trim()) {
			setLocalError('Tytuł powiadomienia jest wymagany');
			return;
		}

		if (formData.title.length > 100) {
			setLocalError('Tytuł nie może być dłuższy niż 100 znaków');
			return;
		}

		if (!formData.content.trim()) {
			setLocalError('Treść powiadomienia jest wymagana');
			return;
		}

		if (formData.content.length > 1000) {
			setLocalError('Treść nie może być dłuższa niż 1000 znaków');
			return;
		}

		if (formData.courses.length === 0) {
			setLocalError('Wybierz co najmniej jeden kurs');
			return;
		}

		await onSubmit({
			title: formData.title,
			content: formData.content,
			recivers: formData.courses
		});
	};

	const handleBackdropClick = (event) => {
		if (event.target === event.currentTarget) {
			onCancel();
		}
	};

	return createPortal(
		<div className="admin-users__modal-backdrop" onClick={handleBackdropClick}>
			<div className="admin-users__create-modal">
				<form onSubmit={handleSubmit}>
					<h2>Dodaj powiadomienie</h2>

					{(error || localError) && (
						<div className="admin-users__error" style={{ marginBottom: '1rem' }}>
							{error || localError}
						</div>
					)}

					<div className="admin-users__form-grid">
						<div>
							<label htmlFor="title">Tytuł powiadomienia *</label>
							<input
								id="title"
								type="text"
								name="title"
								value={formData.title}
								onChange={handleChange}
								placeholder="np. Nowy kurs dostępny"
								maxLength="100"
								required
								disabled={loading}
							/>
							<small style={{ color: '#6b7280' }}>
								{formData.title.length}/100 znaków
							</small>
						</div>

						<div style={{ gridColumn: '1 / -1' }}>
							<label htmlFor="content">Treść powiadomienia *</label>
							<textarea
								id="content"
								name="content"
								value={formData.content}
								onChange={handleChange}
								placeholder="Wpisz treść powiadomienia..."
								maxLength="1000"
								rows="6"
								required
								disabled={loading}
								style={{
									width: '100%',
									padding: '0.75rem',
									border: '1px solid #e5e7eb',
									borderRadius: '0.5rem',
									fontFamily: 'inherit',
									fontSize: '0.875rem',
									resize: 'vertical'
								}}
							/>
							<small style={{ color: '#6b7280' }}>
								{formData.content.length}/1000 znaków
							</small>
						</div>

						<div style={{ gridColumn: '1 / -1' }}>
							<label>Wybierz kursy *</label>
							<div style={{
								border: '1px solid #e5e7eb',
								borderRadius: '0.5rem',
								padding: '0.75rem',
								maxHeight: '200px',
								overflowY: 'auto',
								backgroundColor: '#f9fafb'
							}}>
								{courses && courses.length > 0 ? (
									courses.map((course) => (
										<label key={course.id} style={{
											display: 'flex',
											alignItems: 'center',
											gap: '0.5rem',
											padding: '0.5rem 0',
											cursor: 'pointer'
										}}>
											<input
												type="checkbox"
												checked={formData.courses.includes(course.id)}
												onChange={() => handleCourseToggle(course.id)}
												disabled={loading}
											/>
											<span style={{ fontSize: '0.875rem' }}>
												{course.name}
											</span>
										</label>
									))
								) : (
									<p style={{ color: '#9ca3af', margin: 0 }}>
										Brak dostępnych kursów
									</p>
								)}
							</div>
							{formData.courses.length > 0 && (
								<small style={{ color: '#6b7280' }}>
									Zaznaczono: {formData.courses.length} kurs(ów)
								</small>
							)}
						</div>
					</div>

					<div className="admin-users__modal-actions">
						<button
							type="button"
							onClick={onCancel}
							disabled={loading}
							style={{
								background: '#fff',
								border: '1px solid #e5e7eb',
								color: '#374151',
								padding: '0.68rem 1.25rem',
								borderRadius: '0.75rem',
								cursor: 'pointer',
								fontSize: '0.875rem',
								fontWeight: '600'
							}}
						>
							Anuluj
						</button>
						<button
							type="submit"
							disabled={loading}
							style={{
								background: loading ? '#d1d5db' : '#2563eb',
								color: '#fff',
								padding: '0.68rem 1.25rem',
								borderRadius: '0.75rem',
								border: 'none',
								cursor: loading ? 'default' : 'pointer',
								fontSize: '0.875rem',
								fontWeight: '600'
							}}
						>
							{loading ? 'Tworzenie...' : 'Utwórz powiadomienie'}
						</button>
					</div>
				</form>
			</div>
		</div>,
		document.body
	);
};

export default CreateNotificationModal;
