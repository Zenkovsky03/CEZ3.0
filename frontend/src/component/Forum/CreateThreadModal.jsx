import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Modal from '../Modal';
import AuthContext from '../../context/AuthContext';
import { createThread } from '../../services/forumService';

const CreateThreadModal = ({ isOpen, onClose }) => {
    const { t } = useTranslation();
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const isValid = title.trim().length > 0 && content.trim().length > 0;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isValid || saving) return;
        setSaving(true);
        setError('');
        try {
            const data = await createThread({ Title: title.trim(), Content: content.trim() });
            onClose();
            const threadId = data?.id || data?.Id || data?.threadId;
            if (threadId) navigate(`/forum/${threadId}`);
            else navigate('/forum');
        } catch (err) {
            setError(err.message || t('error.create_thread'));
        } finally {
            setSaving(false);
        }
    };

    const handleClose = () => {
        setTitle('');
        setContent('');
        setError('');
        onClose();
    };

    if (!user) return null;

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title={t('forum.new_thread')} size="medium" handleBackdropClick={handleClose}>
            <form onSubmit={handleSubmit} className="create-thread-form">
                {error && <div className="error-message">{error}</div>}

                <div className="form-group">
                    <label htmlFor="thread-title" className="form-label">{t('forum.create_title')}</label>
                    <input
                        id="thread-title"
                        type="text"
                        className="form-input"
                        placeholder={t('forum.create_title_placeholder')}
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        maxLength={100}
                        autoFocus
                    />
                    <span className="char-count">{title.length}/100</span>
                </div>

                <div className="form-group">
                    <label htmlFor="thread-content" className="form-label">{t('forum.create_content')}</label>
                    <textarea
                        id="thread-content"
                        className="form-textarea"
                        placeholder={t('forum.create_content_placeholder')}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        maxLength={1000}
                        rows={6}
                    />
                    <span className="char-count">{content.length}/1000</span>
                </div>

                <div className="form-actions">
                    <button type="button" className="btn-secondary" onClick={handleClose}>{t('common.cancel')}</button>
                    <button type="submit" className="btn-primary" disabled={!isValid || saving}>
                        <span className="material-symbols-outlined">add</span>
                        {saving ? t('common.publishing') : t('forum.publish')}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default CreateThreadModal;
