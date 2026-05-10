import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createAnnouncement, getCourses } from '../../../../../services/adminApi';

const initialFormData = {
	title: '',
	content: '',
	courses: []
};

const NotificationForm = () => {
	const navigate = useNavigate();
	const [formData, setFormData] = useState(initialFormData);
	const [courses, setCourses] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [coursesLoading, setCoursesLoading] = useState(false);

	useEffect(() => {
		const fetchCourses = async () => {
			try {
				setCoursesLoading(true);
				const data = await getCourses();
				setCourses(data || []);
			} catch (err) {
				console.error('Failed to fetch courses:', err);
			} finally {
				setCoursesLoading(false);
			}
		};

		fetchCourses();
	}, []);

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
		setError(null);

		if (!formData.title.trim()) {
			setError('Tytuł powiadomienia jest wymagany');
			return;
		}

		if (formData.title.length > 100) {
			setError('Tytuł nie może być dłuższy niż 100 znaków');
			return;
		}

		if (!formData.content.trim()) {
			setError('Treść powiadomienia jest wymagana');
			return;
		}

		if (formData.content.length > 1000) {
			setError('Treść nie może być dłuższa niż 1000 znaków');
			return;
		}

		if (formData.courses.length === 0) {
			setError('Announcement must have at least one recipient');
			return;
		}

		try {
			setLoading(true);
			const payload = {
				Title: formData.title,
				Content: formData.content,
				Recivers: formData.courses
			};
			console.log('Sending announcement payload:', payload);
			await createAnnouncement(payload);
			navigate('/admin/notifications');
		} catch (err) {
			console.error('Announcement creation error:', err);
			setError(err.message || 'Nie udało się utworzyć powiadomienia');
		} finally {
			setLoading(false);
		}
	};

	return (
		<form onSubmit={handleSubmit}>
			<div className="input-group">
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
					style={{
						width: '100%',
						padding: '0.75rem',
						border: '1px solid #e5e7eb',
						borderRadius: '0.5rem',
						fontSize: '0.875rem'
					}}
				/>
				<small style={{ color: '#6b7280', display: 'block', marginTop: '0.25rem' }}>
					{formData.title.length}/100 znaków
				</small>
			</div>

			<div className="input-group">
				<label htmlFor="content">Treść powiadomienia *</label>
				<textarea
					id="content"
					name="content"
					value={formData.content}
					onChange={handleChange}
					placeholder="Wpisz treść powiadomienia..."
					maxLength="1000"
					rows="8"
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
				<small style={{ color: '#6b7280', display: 'block', marginTop: '0.25rem' }}>
					{formData.content.length}/1000 znaków
				</small>
			</div>

			<div className="input-group">
				<label>Wybierz kursy *</label>
				<div style={{
					border: '1px solid #e5e7eb',
					borderRadius: '0.5rem',
					padding: '0.75rem',
					maxHeight: '300px',
					overflowY: 'auto',
					backgroundColor: '#f9fafb'
				}}>
					{coursesLoading ? (
						<p style={{ color: '#9ca3af', margin: 0 }}>Ładowanie kursów...</p>
					) : courses && courses.length > 0 ? (
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
									disabled={loading || coursesLoading}
									style={{ cursor: 'pointer' }}
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
					<small style={{ color: '#6b7280', display: 'block', marginTop: '0.25rem' }}>
						Zaznaczono: {formData.courses.length} kurs(ów)
					</small>
				)}
			</div>

			{error && (
				<div style={{
					background: '#fee2e2',
					border: '1px solid #fecaca',
					color: '#991b1b',
					padding: '0.75rem',
					borderRadius: '0.5rem',
					fontSize: '0.875rem',
					marginBottom: '1rem'
				}}>
					{error}
				</div>
			)}

			<div style={{
				display: 'flex',
				gap: '1rem',
				marginTop: '1.5rem',
				justifyContent: 'flex-end'
			}}>
				<button
					type="button"
					onClick={() => navigate('/admin/notifications')}
					disabled={loading}
					style={{
						background: '#fff',
						border: '1px solid #e5e7eb',
						color: '#374151',
						padding: '0.68rem 1.5rem',
						borderRadius: '0.5rem',
						cursor: loading ? 'default' : 'pointer',
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
						padding: '0.68rem 1.5rem',
						borderRadius: '0.5rem',
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
	);
};

export default NotificationForm;
