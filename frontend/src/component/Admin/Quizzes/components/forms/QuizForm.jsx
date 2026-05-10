import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCourses } from '../../../../../services/adminApi';
import './QuizForm.scss';

const initialFormData = {
	title: '',
	description: '',
	courseId: '',
	timeLimit: 30,
	passPercentage: 70,
	isPublished: false
};

const getCourseNameById = (courseId) => {
	const courseName = localStorage.getItem(`courseName_${courseId}`);
	return courseName || 'Nowy kurs';
};

const QuizForm = () => {
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
		const { name, value, type, checked } = event.target;
		setFormData((previous) => ({
			...previous,
			[name]: type === 'checkbox' ? checked : value
		}));
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		setError(null);

		if (!formData.title.trim()) {
			setError('Tytuł quizu jest wymagany');
			return;
		}

		if (!formData.courseId) {
			setError('Wybierz kurs');
			return;
		}

		if (formData.timeLimit < 1) {
			setError('Limit czasu musi być co najmniej 1 minuta');
			return;
		}

		if (formData.passPercentage < 0 || formData.passPercentage > 100) {
			setError('Procent zaliczenia musi być między 0 a 100');
			return;
		}

		try {
			setLoading(true);
			// Save to localStorage until backend is ready
			const storedQuizzes = JSON.parse(localStorage.getItem('mockQuizzes') || '[]');
			const newQuiz = {
				id: Date.now().toString(),
				quizId: `quiz-${Date.now()}`,
				title: formData.title,
				courseName: getCourseNameById(formData.courseId),
				description: formData.description,
				timeLimit: formData.timeLimit,
				passPercentage: formData.passPercentage,
				isPublished: formData.isPublished,
				instructor: 'Draft',
				questions: 0,
				status: formData.isPublished ? 'Aktywny' : 'Szkic'
			};
			storedQuizzes.push(newQuiz);
			localStorage.setItem('mockQuizzes', JSON.stringify(storedQuizzes));
			navigate('/admin/quizzes');
		} catch (err) {
			setError(err.message || 'Nie udało się utworzyć quizu');
		} finally {
			setLoading(false);
		}
	};

	return (
		<form className="form-container" onSubmit={handleSubmit}>
			<div className="input-group">
				<label className="input-label" htmlFor="title">Tytuł quizu *</label>
				<input
					id="title"
					type="text"
					name="title"
					value={formData.title}
					onChange={handleChange}
					placeholder="np. Quiz z rozdz. 3"
					required
					disabled={loading}
					className="input-field"
				/>
			</div>

			<div className="input-group">
				<label className="input-label" htmlFor="description">Opis (opcjonalnie)</label>
				<textarea
					id="description"
					name="description"
					value={formData.description}
					onChange={handleChange}
					placeholder="Opisz zawartość i zakres quizu..."
					rows="4"
					disabled={loading}
					className="input-field"
				/>
			</div>

			<div className="input-group">
				<label className="input-label" htmlFor="courseId">Kurs *</label>
				<select
					id="courseId"
					name="courseId"
					value={formData.courseId}
					onChange={handleChange}
					required
					disabled={loading || coursesLoading}
					className="input-field"
				>
					<option value="">Wybierz kurs...</option>
					{courses.map((course) => (
						<option key={course.id} value={course.id}>
							{course.name}
						</option>
					))}
				</select>
			</div>

			<div className="input-group-row">
				<div className="input-group">
					<label className="input-label" htmlFor="timeLimit">Limit czasu (minuty) *</label>
					<input
						id="timeLimit"
						type="number"
						name="timeLimit"
						value={formData.timeLimit}
						onChange={handleChange}
						min="1"
						max="480"
						required
						disabled={loading}
						className="input-field"
					/>
				</div>

				<div className="input-group">
					<label className="input-label" htmlFor="passPercentage">Procent zaliczenia (%) *</label>
					<input
						id="passPercentage"
						type="number"
						name="passPercentage"
						value={formData.passPercentage}
						onChange={handleChange}
						min="0"
						max="100"
						required
						disabled={loading}
						className="input-field"
					/>
				</div>
			</div>

			<div className="input-group">
				<input
					id="isPublished"
					type="checkbox"
					name="isPublished"
					checked={formData.isPublished}
					onChange={handleChange}
					disabled={loading}
					className="checkbox-input"
				/>
				<label className="checkbox-label" htmlFor="isPublished">
					Opublikuj quiz (widoczny dla studentów)
				</label>
			</div>

			{error && (
				<div className="form-error">
					{error}
				</div>
			)}

			<div className="form-actions">
				<button
					type="button"
					onClick={() => navigate('/admin/quizzes')}
					disabled={loading}
					className="secondary-button"
				>
					Anuluj
				</button>
				<button
					type="submit"
					disabled={loading}
					className="primary-button"
				>
					{loading ? 'Tworzenie...' : 'Utwórz quiz'}
				</button>
			</div>
		</form>
	);
};

export default QuizForm;
