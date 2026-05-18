import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../Header';
import './Announcements.scss';

const COURSES = [
    { id: 'c1', name: 'UX/UI Design' },
    { id: 'c2', name: 'Programowanie webowe – React' },
    { id: 'c3', name: 'Podstawy baz danych' },
    { id: 'c4', name: 'Algorytmy i struktury danych' },
];

const CreateAnnouncement = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({ title: '', courseId: '', content: '' });
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
    };

    const isValid = form.title.trim() && form.courseId && form.content.trim();

    if (submitted) {
        return (
            <div className="page-wrapper-announcements">
                <Header variant="dashboard" />
                <div className="main-content">
                    <div className="success-card">
                        <span className="material-symbols-outlined success-icon">check_circle</span>
                        <h2>Ogłoszenie zostało opublikowane!</h2>
                        <p>Studenci zapisani na kurs zostaną poinformowani o nowym ogłoszeniu.</p>
                        <div className="success-actions">
                            <button className="btn-secondary" onClick={() => { setSubmitted(false); setForm({ title: '', courseId: '', content: '' }); }}>
                                Utwórz kolejne
                            </button>
                            <Link to="/courses" className="btn-primary">Wróć do kursów</Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="page-wrapper-announcements">
            <Header variant="dashboard" />
            <div className="main-content">
                <div className="page-header-row">
                    <Link to="/courses" className="back-link">
                        <span className="material-symbols-outlined">arrow_back</span>
                        Kursy
                    </Link>
                </div>

                <div className="form-card">
                    <div className="form-card-header">
                        <div className="form-card-icon">
                            <span className="material-symbols-outlined">campaign</span>
                        </div>
                        <div>
                            <h1 className="form-card-title">Nowe ogłoszenie</h1>
                            <p className="form-card-subtitle">Ogłoszenie zostanie wysłane do wszystkich studentów na wybranym kursie</p>
                        </div>
                    </div>

                    <form className="ann-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label" htmlFor="title">Tytuł ogłoszenia</label>
                            <input
                                id="title"
                                name="title"
                                type="text"
                                className="form-input"
                                placeholder="np. Zmiana terminu wykładu"
                                value={form.title}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="courseId">Kurs</label>
                            <div className="select-wrap">
                                <select
                                    id="courseId"
                                    name="courseId"
                                    className="form-select"
                                    value={form.courseId}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">-- Wybierz kurs --</option>
                                    {COURSES.map(c => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                                <span className="material-symbols-outlined select-icon">expand_more</span>
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="content">Treść ogłoszenia</label>
                            <textarea
                                id="content"
                                name="content"
                                className="form-textarea"
                                placeholder="Napisz treść ogłoszenia..."
                                rows={8}
                                value={form.content}
                                onChange={handleChange}
                                required
                            />
                            <p className="form-hint">
                                <span className="material-symbols-outlined">info</span>
                                Wiadomość zostanie wysłana e-mailem do wszystkich zapisanych studentów.
                            </p>
                        </div>

                        <div className="form-actions">
                            <button type="button" className="btn-secondary" onClick={() => navigate(-1)}>
                                Anuluj
                            </button>
                            <button type="submit" className="btn-primary" disabled={!isValid}>
                                <span className="material-symbols-outlined">send</span>
                                Opublikuj ogłoszenie
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateAnnouncement;
