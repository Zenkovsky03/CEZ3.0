import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../Header';
import { createEvent } from '../../services/eventService';
import { getCourses } from '../../services/courseService';
import './CreateEvent.scss';

const CreateEvent = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const [form, setForm] = useState({
        title: '',
        description: '',
        courseId: '',
        startDate: '',
        startTime: '',
        endDate: '',
        endTime: '',
        location: '',
    });
    const [saving, setSaving] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        getCourses()
            .then(data => {
                const list = data?.items || data?.Items || (Array.isArray(data) ? data : []);
                setCourses(list);
            })
            .catch(() => {});
    }, []);

    const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');

        const startTime = new Date(`${form.startDate}T${form.startTime}`);
        const endTime = new Date(`${form.endDate}T${form.endTime}`);

        try {
            await createEvent({
                Title: form.title.trim(),
                Description: form.location ? `${form.description}\nMiejsce: ${form.location}`.trim() : form.description.trim(),
                StartTime: startTime.toISOString(),
                EndTime: endTime.toISOString(),
                Recivers: form.courseId ? [form.courseId] : []
            });
            setSubmitted(true);
        } catch (err) {
            setError(err.message || t('error.create_event'));
        } finally {
            setSaving(false);
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
                        <h2>{t('calendar.event_created')}</h2>
                        <p>{t('announcement.event_created_in_calendar', { title: form.title })}</p>
                        <div className="success-actions">
                            <button className="btn-secondary" onClick={() => { setSubmitted(false); setForm({ title: '', description: '', courseId: '', startDate: '', startTime: '', endDate: '', endTime: '', location: '' }); }}>
                                {t('calendar.add_another')}
                            </button>
                            <Link to="/calendar" className="btn-primary">
                                <span className="material-symbols-outlined">calendar_month</span>
                                {t('calendar.go_to_calendar')}
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
                    {t('nav.calendar')}
                </Link>

                <div className="form-card">
                    <div className="form-card-header">
                        <div className="form-card-icon">
                            <span className="material-symbols-outlined">event</span>
                        </div>
                        <div>
                            <h1 className="form-card-title">{t('calendar.event_create')}</h1>
                            <p className="form-card-subtitle">{t('calendar.event_create_subtitle')}</p>
                        </div>
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    <form className="event-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label" htmlFor="title">{t('calendar.event_title')}</label>
                            <input id="title" name="title" type="text" className="form-input" placeholder={t('calendar.event_title_placeholder')} value={form.title} onChange={handleChange} required />
                        </div>

                        <div className="form-row">
                            <div className="form-group flex-1">
                                <label className="form-label" htmlFor="startDate">{t('calendar.start_date')}</label>
                                <input id="startDate" name="startDate" type="date" className="form-input" value={form.startDate} onChange={handleChange} required />
                            </div>
                            <div className="form-group flex-1">
                                <label className="form-label" htmlFor="startTime">{t('calendar.start_time')}</label>
                                <input id="startTime" name="startTime" type="time" className="form-input" value={form.startTime} onChange={handleChange} required />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group flex-1">
                                <label className="form-label" htmlFor="endDate">{t('calendar.end_date')}</label>
                                <input id="endDate" name="endDate" type="date" className="form-input" value={form.endDate} onChange={handleChange} required />
                            </div>
                            <div className="form-group flex-1">
                                <label className="form-label" htmlFor="endTime">{t('calendar.end_time')}</label>
                                <input id="endTime" name="endTime" type="time" className="form-input" value={form.endTime} onChange={handleChange} required />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="courseId">{t('calendar.course_select')}</label>
                            <div className="select-wrap">
                                <select id="courseId" name="courseId" className="form-select" value={form.courseId} onChange={handleChange}>
                                    <option value="">{t('calendar.no_course')}</option>
                                    {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                                <span className="material-symbols-outlined select-icon">expand_more</span>
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="location">{t('calendar.location')}</label>
                            <input id="location" name="location" type="text" className="form-input" placeholder={t('calendar.location_placeholder')} value={form.location} onChange={handleChange} />
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="description">{t('calendar.description')}</label>
                            <textarea id="description" name="description" className="form-textarea" placeholder={t('calendar.description_placeholder')} rows={4} value={form.description} onChange={handleChange} />
                        </div>

                        <div className="form-actions">
                            <button type="button" className="btn-secondary" onClick={() => navigate('/calendar')}>{t('common.cancel')}</button>
                            <button type="submit" className="btn-primary" disabled={!isValid || saving}>
                                <span className="material-symbols-outlined">event</span>
                                {saving ? t('calendar.adding') : t('calendar.add_event_btn')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateEvent;
