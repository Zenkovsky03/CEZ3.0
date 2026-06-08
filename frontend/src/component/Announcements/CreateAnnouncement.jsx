import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../Header';
import { createAnnouncement } from '../../services/announcementService';
import { getCourses } from '../../services/courseService';
import './Announcements.scss';

const CreateAnnouncement = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const [form, setForm] = useState({ title: '', courseId: '', content: '' });
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

        try {
            await createAnnouncement({
                Title: form.title.trim(),
                Content: form.content.trim(),
                Recivers: form.courseId ? [form.courseId] : []
            });
            setSubmitted(true);
        } catch (err) {
            setError(err.message || t('error.create_announcement'));
        } finally {
            setSaving(false);
        }
    };

    const isValid = form.title.trim() && form.content.trim();

    if (submitted) {
        return (
            <div className="page-wrapper-announcements">
                <Header variant="dashboard" />
                <div className="main-content">
                    <div className="success-card">
                        <span className="material-symbols-outlined success-icon">check_circle</span>
                        <h2>{t('announcement.published')}</h2>
                        <p>{t('announcement.course_info')}</p>
                        <div className="success-actions">
                            <button className="btn-secondary" onClick={() => { setSubmitted(false); setForm({ title: '', courseId: '', content: '' }); }}>
                                {t('announcement.create_another')}
                            </button>
                            <Link to="/courses" className="btn-primary">{t('course.back_to_courses')}</Link>
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
                        {t('course.back_to_courses')}
                    </Link>
                </div>

                <div className="form-card">
                    <div className="form-card-header">
                        <div className="form-card-icon">
                            <span className="material-symbols-outlined">campaign</span>
                        </div>
                        <div>
                            <h1 className="form-card-title">{t('announcement.create')}</h1>
                            <p className="form-card-subtitle">{t('announcement.create_subtitle')}</p>
                        </div>
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    <form className="ann-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label" htmlFor="title">{t('announcement.title_label')}</label>
                            <input id="title" name="title" type="text" className="form-input" placeholder={t('announcement.title_placeholder')} value={form.title} onChange={handleChange} required />
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="courseId">{t('announcement.course_required')}</label>
                            <div className="select-wrap">
                                <select id="courseId" name="courseId" className="form-select" value={form.courseId} onChange={handleChange}>
                                    <option value="">-- Wszystkie kursy --</option>
                                    {courses.map(c => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                                <span className="material-symbols-outlined select-icon">expand_more</span>
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="content">{t('announcement.content_label')}</label>
                            <textarea id="content" name="content" className="form-textarea" placeholder={t('announcement.content_placeholder')} rows={8} value={form.content} onChange={handleChange} required />
                        </div>

                        <div className="form-actions">
                            <button type="button" className="btn-secondary" onClick={() => navigate('/courses')}>{t('common.cancel')}</button>
                            <button type="submit" className="btn-primary" disabled={!isValid || saving}>
                                <span className="material-symbols-outlined">send</span>
                                {saving ? t('announcement.publishing') : t('announcement.publish')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateAnnouncement;
