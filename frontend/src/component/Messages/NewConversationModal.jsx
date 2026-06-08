import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import Modal from '../Modal';
import Spinner from '../Spinner';
import AuthContext from '../../context/AuthContext';
import { startConversation } from '../../services/conversationService';
import { getUsersByRole } from '../../services/userService';

const CONV_TYPE = {
    INQUIRY: 1,
    DIRECT: 2
};

const NewConversationModal = ({ isOpen, onClose, onCreated }) => {
    const { t } = useTranslation();
    const { user } = useContext(AuthContext);
    const [recipientSearch, setRecipientSearch] = useState('');
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [messageBody, setMessageBody] = useState('');
    const [convType, setConvType] = useState(CONV_TYPE.DIRECT);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [loadingUsers, setLoadingUsers] = useState(false);

    const loadUsers = useCallback(async () => {
        setLoadingUsers(true);
        try {
            const role = user?.role === 'Student' ? 'Teacher' : 'Student';
            const data = await getUsersByRole(role);
            setUsers(Array.isArray(data) ? data : []);
        } catch {
            setUsers([]);
        } finally {
            setLoadingUsers(false);
        }
    }, [user]);

    useEffect(() => {
        if (isOpen) {
            setSelectedUser(null);
            setRecipientSearch('');
            setMessageBody('');
            setError('');
            setConvType(user?.role === 'Student' ? CONV_TYPE.INQUIRY : CONV_TYPE.DIRECT);
            loadUsers();
        }
    }, [isOpen, loadUsers, user]);

    const filteredUsers = users.filter(u =>
        u.id !== user?.id &&
        (!recipientSearch ||
            `${u.firstName || ''} ${u.lastName || ''} ${u.email || ''} ${u.username || ''}`
                .toLowerCase()
                .includes(recipientSearch.toLowerCase()))
    );

    const isValid = selectedUser && messageBody.trim().length > 0;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isValid || saving) return;
        setSaving(true);
        setError('');
        try {
            const payload = {
                recepientId: selectedUser.id,
                fistMessageBody: messageBody.trim(),
                type: convType,
                title: `Rozmowa z ${selectedUser.firstName || ''} ${selectedUser.lastName || ''}`.trim()
            };
            const data = await startConversation(payload);
            onClose();
            if (onCreated) onCreated(data?.conversationId || data?.id);
        } catch (err) {
            setError(err.message || t('error.start_conversation'));
        } finally {
            setSaving(false);
        }
    };

    const handleClose = () => {
        setSelectedUser(null);
        setRecipientSearch('');
        setMessageBody('');
        setError('');
        onClose();
    };

    const handleSelectUser = (u) => {
        setSelectedUser(u);
        setRecipientSearch(`${u.firstName || ''} ${u.lastName || ''}`.trim() || u.email || u.username);
        if (u.role === 'Teacher' || u.role === 'Admin') {
            setConvType(CONV_TYPE.INQUIRY);
        } else if (user?.role === 'Teacher' || user?.role === 'Admin') {
            setConvType(CONV_TYPE.INQUIRY);
        } else {
            setConvType(CONV_TYPE.DIRECT);
        }
    };

    if (!user) return null;

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title={t('messages.new_conversation')} size="medium" handleBackdropClick={handleClose}>
            <form onSubmit={handleSubmit} className="new-conv-form">
                {error && <div className="error-message">{error}</div>}

                <div className="form-group">
                    <label className="form-label">{t('messages.recipient')}</label>
                    <input
                        type="text"
                        className="form-input"
                        placeholder={t('messages.search_user')}
                        value={selectedUser ? `${selectedUser.firstName || ''} ${selectedUser.lastName || ''}`.trim() || selectedUser.email : recipientSearch}
                        onChange={(e) => { setSelectedUser(null); setRecipientSearch(e.target.value); }}
                        autoFocus
                        disabled={!!selectedUser}
                    />
                    {selectedUser && (
                        <button type="button" className="btn-clear-selection" onClick={() => { setSelectedUser(null); setRecipientSearch(''); }}>
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    )}
                </div>

                {!selectedUser && (
                    <div className="user-results">
                        {loadingUsers ? (
                            <Spinner />
                        ) : filteredUsers.length === 0 ? (
                            <p className="empty-text">{t('messages.no_users')}</p>
                        ) : (
                            filteredUsers.map(u => (
                                <button key={u.id} type="button" className="user-result-item" onClick={() => handleSelectUser(u)}>
                                    <div className="user-result-avatar">
                                        {((u.firstName?.[0] || u.username?.[0] || '?').toUpperCase())}
                                    </div>
                                    <div className="user-result-info">
                                        <span className="user-result-name">{`${u.firstName || ''} ${u.lastName || ''}`.trim() || u.username}</span>
                                        <span className="user-result-email">{u.email}</span>
                                    </div>
                                    <span className="user-result-role">{u.role === 'Teacher' ? t('common.teacher') : u.role === 'Admin' ? t('common.admin') : t('common.student')}</span>
                                </button>
                            ))
                        )}
                    </div>
                )}

                {selectedUser && (
                    <>
                        <div className="form-group">
                            <label className="form-label">{t('conversation.type')}</label>
                            <div className="conv-type-select">
                                <button
                                    type="button"
                                    className={`conv-type-btn ${convType === CONV_TYPE.INQUIRY ? 'active' : ''}`}
                                    onClick={() => setConvType(CONV_TYPE.INQUIRY)}
                                >
                                    <span className="material-symbols-outlined">help</span>
                                    {t('conversation.inquiry')}
                                </button>
                                <button
                                    type="button"
                                    className={`conv-type-btn ${convType === CONV_TYPE.DIRECT ? 'active' : ''}`}
                                    onClick={() => setConvType(CONV_TYPE.DIRECT)}
                                >
                                    <span className="material-symbols-outlined">chat</span>
                                    {t('conversation.direct')}
                                </button>
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="conv-message" className="form-label">{t('messages.type_message')}</label>
                            <textarea
                                id="conv-message"
                                className="form-textarea"
                                placeholder={t('messages.content_placeholder')}
                                value={messageBody}
                                onChange={(e) => setMessageBody(e.target.value)}
                                rows={4}
                            />
                        </div>
                    </>
                )}

                <div className="form-actions">
                    <button type="button" className="btn-secondary" onClick={handleClose}>{t('common.cancel')}</button>
                    <button type="submit" className="btn-primary" disabled={!isValid || saving}>
                        <span className="material-symbols-outlined">send</span>
                        {saving ? t('common.sending') : t('messages.start_conversation')}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default NewConversationModal;
