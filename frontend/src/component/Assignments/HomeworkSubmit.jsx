import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Header from '../Header';
import { submitHomework } from '../../services/assignmentService';
import './HomeworkSubmit.scss';

const HomeworkSubmit = () => {
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
            setError(err.message || 'Nie udało się przesłać pracy');
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
                        <h2 className="success-title">Praca oddana!</h2>
                        <p className="success-subtitle">
                            Twoja praca została pomyślnie przesłana. Nauczyciel oceni ją wkrótce.
                        </p>
                        <Link to="/assignments" className="btn-primary">
                            <span className="material-symbols-outlined">arrow_back</span>
                            Powrót do zadań
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
                    Powrót do zadań
                </Link>

                <div className="homework-grid">
                    <div className="submission-card" style={{ gridColumn: '1 / -1', maxWidth: 600, margin: '0 auto' }}>
                        <h3 className="submission-title">Oddaj pracę</h3>
                        {error && <div className="error-message">{error}</div>}
                        <form onSubmit={handleSubmit} className="submission-form">
                            <div className="form-group">
                                <label className="form-label">
                                    Opis / komentarz
                                    <span className="form-optional">opcjonalne</span>
                                </label>
                                <textarea
                                    className="form-textarea"
                                    placeholder="Opisz swoją pracę, podaj informacje dodatkowe lub wnioski..."
                                    value={submissionText}
                                    onChange={(e) => setSubmissionText(e.target.value)}
                                    rows={6}
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">
                                    Link do pracy
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
                                {saving ? 'Wysyłanie...' : 'Wyślij pracę'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomeworkSubmit;
