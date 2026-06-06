import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../Header';
import { getCourses } from '../../services/courseService';
import { createEvent } from '../../services/eventService';
import './CreateEvent.scss';

const EVENT_TYPES = ['Wykład', 'Ćwiczenia', 'Egzamin', 'Kolokwium', 'Konsultacje', 'Inne'];

const CreateEvent = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        title: '',
        type: 'Wykład',
        courseId: '',
        description: '',
        startDate: '',
        startTime: '',
        endDate: '',
        endTime: '',
        location: '',
    });
    const [submitted, setSubmitted] = useState(false);
    const [courses, setCourses] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        getCourses().then(setCourses).catch(() => {});
    }, []);

    const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            await createEvent({
                title: form.title,
                description: form.description || null,
                startTime: `${form.startDate}T${form.startTime}`,
                endTime: `${form.endDate}T${form.endTime}`,
                eventType: form.type,
                courseId: form.courseId || null,
                location: form.location || null,
            });
            setSubmitted(true);
        } catch {
            setError('Nie udało się dodać wydarzenia. Spróbuj ponownie.');
        }
    };

    const isValid = form.title.trim() && form.startDate && form.startTime && form.endDate && form.endTime;

    if (submitted) {
        return (
            <div className="page-wrapper-create-event">
                <Header variant="dashboard" />
                <div className="main-content">
                    <div className="success-card">
                        <span className="material-symbols-outlined success-icon">event_available</span>
                        <h2>Wydarzenie zostało dodane!</h2>
                        <p>Wydarzenie "<strong>{form.title}</strong>" pojawiło się w kalendarzu.</p>
                        <div className="success-actions">
                            <button className="btn-secondary" onClick={() => { setSubmitted(false); setForm({ title: '', type: 'Wykład', courseId: '', description: '', startDate: '', startTime: '', endDate: '', endTime: '', location: '' }); }}>
                                Dodaj kolejne
                            </button>
                            <Link to="/calendar" className="btn-primary">
                                <span className="material-symbols-outlined">calendar_month</span>
                                Przejdź do kalendarza
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="page-wrapper-create-event">
            <Header variant="dashboard" />
            <div className="main-content">
                <Link to="/calendar" className="back-link">
                    <span className="material-symbols-outlined">arrow_back</span>
                    Kalendarz
                </Link>

                <div className="form-card">
                    <div className="form-card-header">
                        <div className="form-card-icon">
                            <span className="material-symbols-outlined">event</span>
                        </div>
                        <div>
                            <h1 className="form-card-title">Nowe wydarzenie</h1>
                            <p className="form-card-subtitle">Dodaj wydarzenie do kalendarza kursu lub ogólnego</p>
                        </div>
                    </div>

                    {error && <div className="form-error">{error}</div>}

                    <form className="event-form" onSubmit={handleSubmit}>
                        {/* Title + type row */}
                        <div className="form-row">
                            <div className="form-group flex-2">
                                <label className="form-label" htmlFor="title">Tytuł wydarzenia</label>
                                <input
                                    id="title"
                                    name="title"
                                    type="text"
                                    className="form-input"
                                    placeholder="np. Wykład – Moduł 4"
                                    value={form.title}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group flex-1">
                                <label className="form-label" htmlFor="type">Typ</label>
                                <div className="select-wrap">
                                    <select id="type" name="type" className="form-select" value={form.type} onChange={handleChange}>
                                        {EVENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                                    </select>
                                    <span className="material-symbols-outlined select-icon">expand_more</span>
                                </div>
                            </div>
                        </div>

                        {/* Date/time rows */}
                        <div className="form-row">
                            <div className="form-group flex-1">
                                <label className="form-label" htmlFor="startDate">Data rozpoczęcia</label>
                                <div className="input-with-icon">
                                    <span className="material-symbols-outlined">calendar_today</span>
                                    <input id="startDate" name="startDate" type="date" className="form-input" value={form.startDate} onChange={handleChange} required />
                                </div>
                            </div>
                            <div className="form-group flex-1">
                                <label className="form-label" htmlFor="startTime">Godzina rozpoczęcia</label>
                                <div className="input-with-icon">
                                    <span className="material-symbols-outlined">schedule</span>
                                    <input id="startTime" name="startTime" type="time" className="form-input" value={form.startTime} onChange={handleChange} required />
                                </div>
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group flex-1">
                                <label className="form-label" htmlFor="endDate">Data zakończenia</label>
                                <div className="input-with-icon">
                                    <span className="material-symbols-outlined">calendar_today</span>
                                    <input id="endDate" name="endDate" type="date" className="form-input" value={form.endDate} onChange={handleChange} required />
                                </div>
                            </div>
                            <div className="form-group flex-1">
                                <label className="form-label" htmlFor="endTime">Godzina zakończenia</label>
                                <div className="input-with-icon">
                                    <span className="material-symbols-outlined">schedule</span>
                                    <input id="endTime" name="endTime" type="time" className="form-input" value={form.endTime} onChange={handleChange} required />
                                </div>
                            </div>
                        </div>

                        {/* Course */}
                        <div className="form-group">
                            <label className="form-label" htmlFor="courseId">Powiązany kurs (opcjonalnie)</label>
                            <div className="select-wrap">
                                <select id="courseId" name="courseId" className="form-select" value={form.courseId} onChange={handleChange}>
                                    <option value="">Brak (wydarzenie ogólne)</option>
                                    {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                                <span className="material-symbols-outlined select-icon">expand_more</span>
                            </div>
                        </div>

                        {/* Location */}
                        <div className="form-group">
                            <label className="form-label" htmlFor="location">Miejsce / link do spotkania (opcjonalnie)</label>
                            <div className="input-with-icon">
                                <span className="material-symbols-outlined">location_on</span>
                                <input id="location" name="location" type="text" className="form-input" placeholder="np. Sala 204 lub link do Teams" value={form.location} onChange={handleChange} />
                            </div>
                        </div>

                        {/* Description */}
                        <div className="form-group">
                            <label className="form-label" htmlFor="description">Opis (opcjonalnie)</label>
                            <textarea
                                id="description"
                                name="description"
                                className="form-textarea"
                                placeholder="Dodatkowe informacje o wydarzeniu..."
                                rows={4}
                                value={form.description}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-actions">
                            <button type="button" className="btn-secondary" onClick={() => navigate(-1)}>
                                Anuluj
                            </button>
                            <button type="submit" className="btn-primary" disabled={!isValid}>
                                <span className="material-symbols-outlined">event</span>
                                Dodaj wydarzenie
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateEvent;
