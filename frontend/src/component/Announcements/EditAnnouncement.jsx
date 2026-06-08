import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Header from '../Header';
import Spinner from '../Spinner';
import { getAnnouncementById, updateAnnouncement } from '../../services/announcementService';
import './Announcements.scss';

const EditAnnouncement = () => {
    const { t } = useTranslation();
    const { id } = useParams();
    const navigate = useNavigate();
    const [form, setForm] = useState({ title: '', content: '' });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        let mounted = true;
        getAnnouncementById(id)
            .then(data => {
                if (!mounted) return;
                setForm({ title: data.title || '', content: data.content || '' });
            })
            .catch(err => { if (mounted) setError(err.message || t('error.load_announcement')); })
            .finally(() => { if (mounted) setLoading(false); });
        return () => { mounted = false; };
    }, [id, t]);

    const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        try {
            await updateAnnouncement(id, {
                title: form.title.trim(),
                content: form.content.trim()
            });
            setSubmitted(true);
        } catch (err) {
            setError(err.message || t('error.update_announcement'));
        } finally {
            setSaving(false);
        }
    };

    const isValid = form.title.trim() && form.content.trim();

    if (loading) return (
        <div className="page-wrapper-announcements">
            <Header variant="dashboard" />
            <div className="main-content narrow"><Spinner size="lg" /></div>
        </div>
    );

    if (submitted) {
        return (
            <div className="page-wrapper-announcements">
                <Header variant="dashboard" />
                <div className="main-content narrow">
                    <div className="success-card">
                        <span className="material-symbols-outlined success-icon">campaign</span>
                        <h2>{t('announcement.updated')}</h2>
                        <p>{t('announcement.updated_message', { title: form.title })}</p>
                        <div className="success-actions">
                            <Link to={`/announcements/${id}`} className="btn-primary">
                                <span className="material-symbols-outlined">visibility</span>
                                {t('announcement.view')}
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="page-wrapper-announcements">
            <Header variant="dashboard" />
            <div className="main-content narrow">
                <Link to={`/announcements/${id}`} className="back-link">
                    <span className="material-symbols-outlined">arrow_back</span>
                    {t('announcement.title')}
                </Link>

                <div className="form-card">
                    <div className="form-card-header">
                        <div className="form-card-icon">
                            <span className="material-symbols-outlined">campaign</span>
                        </div>
                        <div>
                            <h1 className="form-card-title">{t('announcement.edit')}</h1>
                            <p className="form-card-subtitle">{t('announcement.edit_subtitle')}</p>
                        </div>
                    </div>

                    {error && <div className="error-message ann-form-error">{error}</div>}

                    <form className="ann-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label" htmlFor="title">{t('announcement.title_label')}</label>
                            <input id="title" name="title" type="text" className="form-input" value={form.title} onChange={handleChange} maxLength={100} required />
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="content">{t('announcement.content_label')}</label>
                            <textarea id="content" name="content" className="form-textarea" rows={6} value={form.content} onChange={handleChange} maxLength={1000} required />
                        </div>

                        <div className="form-actions">
                            <button type="button" className="btn-secondary" onClick={() => navigate(`/announcements/${id}`)}>{t('common.cancel')}</button>
                            <button type="submit" className="btn-primary" disabled={!isValid || saving}>
                                <span className="material-symbols-outlined">save</span>
                                {saving ? t('common.saving') : t('announcement.save_changes')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditAnnouncement;
