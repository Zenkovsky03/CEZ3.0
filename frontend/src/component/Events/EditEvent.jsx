import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Header from '../Header';
import Spinner from '../Spinner';
import { getEventById, updateEvent } from '../../services/eventService';
import './CreateEvent.scss';

const EditEvent = () => {
    const { t } = useTranslation();
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState({
        title: '',
        description: '',
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
        let mounted = true;
        getEventById(id)
            .then(data => {
                if (!mounted || !data) return;
                const start = new Date(data.startTime);
                const end = new Date(data.endTime);
                setForm({
                    title: data.title || '',
                    description: (data.description || '').split('\nMiejsce: ')[0],
                    startDate: start.toISOString().split('T')[0],
                    startTime: start.toTimeString().slice(0, 5),
                    endDate: end.toISOString().split('T')[0],
                    endTime: end.toTimeString().slice(0, 5),
                    location: (data.description || '').includes('Miejsce: ') ? (data.description || '').split('Miejsce: ')[1] : '',
                });
            })
            .catch(err => setError(err.message || t('loading.event')))
            .finally(() => { if (mounted) setLoading(false); });
        return () => { mounted = false; };
    }, [id, t]);

    const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');

        const startTime = new Date(`${form.startDate}T${form.startTime}`);
        const endTime = new Date(`${form.endDate}T${form.endTime}`);

        try {
            await updateEvent(id, {
                title: form.title.trim(),
                description: form.location ? `${form.description}\nMiejsce: ${form.location}`.trim() : form.description.trim(),
                startTime: startTime.toISOString(),
                endTime: endTime.toISOString(),
            });
            setSubmitted(true);
        } catch (err) {
            setError(err.message || t('error.update_event'));
        } finally {
            setSaving(false);
        }
    };

    const isValid = form.title.trim() && form.startDate && form.startTime && form.endDate && form.endTime;

    if (loading) return (
        <div className="page-wrapper-create-event">
            <Header variant="dashboard" />
            <div className="main-content"><Spinner size="lg" /></div>
        </div>
    );

    if (submitted) {
        return (
            <div className="page-wrapper-create-event">
                <Header variant="dashboard" />
                <div className="main-content">
                    <div className="success-card">
                        <span className="material-symbols-outlined success-icon">event_available</span>
                        <h2>{t('calendar.event_updated')}</h2>
                        <p>{t('announcement.event_updated_in_calendar', { title: form.title })}</p>
                        <div className="success-actions">
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
                            <h1 className="form-card-title">{t('calendar.event_edit')}</h1>
                            <p className="form-card-subtitle">{t('calendar.event_edit_subtitle')}</p>
                        </div>
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    <form className="event-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label" htmlFor="title">{t('calendar.event_title')}</label>
                            <input id="title" name="title" type="text" className="form-input" value={form.title} onChange={handleChange} required />
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
                            <label className="form-label" htmlFor="location">{t('calendar.location')}</label>
                            <input id="location" name="location" type="text" className="form-input" value={form.location} onChange={handleChange} />
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="description">{t('calendar.description')}</label>
                            <textarea id="description" name="description" className="form-textarea" rows={4} value={form.description} onChange={handleChange} />
                        </div>

                        <div className="form-actions">
                            <button type="button" className="btn-secondary" onClick={() => navigate('/calendar')}>{t('common.cancel')}</button>
                            <button type="submit" className="btn-primary" disabled={!isValid || saving}>
                                <span className="material-symbols-outlined">save</span>
                                {saving ? t('common.saving') : t('calendar.save_changes')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditEvent;
