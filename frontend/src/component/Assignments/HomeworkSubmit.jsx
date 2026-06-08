import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Header from '../Header';
import { submitHomework } from '../../services/assignmentService';
import './HomeworkSubmit.scss';

const HomeworkSubmit = () => {
    const { t } = useTranslation();
    const { id } = useParams();
    const [submissionText, setSubmissionText] = useState('');
    const [attachmentUrl, setAttachmentUrl] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');
    const [saving, setSaving] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');

        try {
            await submitHomework(id, {
                SubmissionText: submissionText.trim() || null,
                AttachmentUrl: attachmentUrl.trim()
            });
            setSubmitted(true);
        } catch (err) {
            setError(err.message || t('error.submit_homework'));
        } finally {
            setSaving(false);
        }
    };

    if (submitted) {
        return (
            <div className="page-wrapper-homework">
                <Header variant="dashboard" />
                <div className="main-content">
                    <div className="success-card">
                        <span className="material-symbols-outlined success-icon">task_alt</span>
                        <h2 className="success-title">{t('assignment.submitted')}</h2>
                        <p className="success-subtitle">{t('assignment.submitted_desc')}</p>
                        <Link to="/assignments" className="btn-primary">
                            <span className="material-symbols-outlined">arrow_back</span>
                            {t('assignment.back_to_list')}
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="page-wrapper-homework">
            <Header variant="dashboard" />
            <div className="main-content">
                <Link to="/assignments" className="back-link">
                    <span className="material-symbols-outlined">arrow_back</span>
                    {t('assignment.back_to_list')}
                </Link>

                <div className="homework-grid">
                    <div className="submission-card" style={{ gridColumn: '1 / -1', maxWidth: 600, margin: '0 auto' }}>
                        <h3 className="submission-title">{t('assignment.submit')}</h3>
                        {error && <div className="error-message">{error}</div>}
                        <form onSubmit={handleSubmit} className="submission-form">
                            <div className="form-group">
                                <label className="form-label">
                                    {t('assignment.description_comment')}
                                    <span className="form-optional">{t('common.optional')}</span>
                                </label>
                                <textarea
                                    className="form-textarea"
                                    placeholder={t('assignment.describe_work')}
                                    value={submissionText}
                                    onChange={(e) => setSubmissionText(e.target.value)}
                                    rows={6}
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">
                                    {t('assignment.work_link')}
                                    <span className="form-required">*</span>
                                </label>
                                <div className="input-with-icon">
                                    <span className="material-symbols-outlined input-icon">link</span>
                                    <input
                                        type="url"
                                        className="form-input"
                                        placeholder="https://www.figma.com/file/..."
                                        value={attachmentUrl}
                                        onChange={(e) => setAttachmentUrl(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <button type="submit" className="btn-submit" disabled={!attachmentUrl.trim() || saving}>
                                <span className="material-symbols-outlined">send</span>
                                {saving ? t('common.sending') : t('assignment.submit_work')}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomeworkSubmit;
