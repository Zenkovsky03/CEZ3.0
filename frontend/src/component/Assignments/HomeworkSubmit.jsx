import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import Header from '../Header';
import { request } from '../../services/apiClient';
import './HomeworkSubmit.scss';

const formatDate = (iso) =>
    new Intl.DateTimeFormat('pl-PL', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(iso));

const HomeworkSubmit = () => {
    const { id } = useParams();
    const [homework, setHomework] = useState(null);
    const [submissionText, setSubmissionText] = useState('');
    const [attachmentUrl, setAttachmentUrl] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        request(`/api/assignments/${id}/solve`)
            .then(data => setHomework(data))
            .catch(() => {})
            .finally(() => setLoading(false));
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await request(`/api/assignments/${id}/submit-homework`, {
                method: 'POST',
                body: JSON.stringify({ submissionUrl: attachmentUrl, description: submissionText || null })
            });
            setSubmitted(true);
        } catch {
            alert('Nie udało się wysłać pracy. Spróbuj ponownie.');
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

    if (loading) {
        return (
            <div className="page-wrapper-homework">
                <Header variant="dashboard" />
                <div className="main-content">
                    <p>Ładowanie zadania...</p>
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
                    {/* Left: assignment details */}
                    <div className="homework-details-card">
                        <div className="hw-card-header">
                            <div className="hw-icon">
                                <span className="material-symbols-outlined">edit_document</span>
                            </div>
                            <div>
                                <span className="hw-type-chip">Praca domowa</span>
                            </div>
                        </div>

                        <h2 className="hw-title">{homework?.title || 'Zadanie'}</h2>

                        {homework?.dueDate && (
                            <div className="hw-due">
                                <span className="material-symbols-outlined">schedule</span>
                                <span>Termin: <strong>{formatDate(homework.dueDate)}</strong></span>
                            </div>
                        )}

                        {homework?.description && (
                            <>
                                <div className="hw-description-label">Opis zadania</div>
                                <div className="hw-description">
                                    {homework.description.split('\n').map((line, i) => (
                                        <p key={i}>{line}</p>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>

                    {/* Right: submission form */}
                    <div className="submission-card">
                        <h3 className="submission-title">Oddaj pracę</h3>
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
                                <p className="form-hint">Podaj link do Figmy, Google Drive, GitHub lub innego serwisu</p>
                            </div>

                            <button
                                type="submit"
                                className="btn-submit"
                                disabled={!attachmentUrl.trim()}
                            >
                                <span className="material-symbols-outlined">send</span>
                                Wyślij pracę
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomeworkSubmit;
