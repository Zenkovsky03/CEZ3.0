import React from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import '../../AdminUsersPageNew.scss';

const DeleteUserModal = ({ 
    show,
    user,
    onCancel, 
    onConfirm, 
    deleting, 
    error 
}) => {
    const { t } = useTranslation();
    if (!show) return null;

    return createPortal(
        <div className="delete-modal">
            <div className="delete-modal__backdrop" onClick={onCancel}></div>
            <div className="delete-modal__content">
                <div className="delete-modal__body">
                    <h2 className="delete-modal__title">{t('common.confirm_delete')}</h2>
                    <p className="delete-modal__message">
                        {t('admin.delete_confirm_message', { name: `${user?.firstName} ${user?.lastName}` })} {t('common.irreversible')}
                    </p>
                    {error && (
                        <div className="delete-modal__error">
                            {error}
                        </div>
                    )}
                    <div className="delete-modal__actions">
                        <button
                            onClick={onCancel}
                            className="delete-modal__btn delete-modal__btn--cancel"
                            disabled={deleting}
                        >
                            {t('common.cancel')}
                        </button>
                        <button
                            onClick={onConfirm}
                            disabled={deleting}
                            className="delete-modal__btn delete-modal__btn--delete"
                        >
                            {deleting ? (
                                <>
                                    <div className="delete-modal__btn-spinner"></div>
                                    <span>{t('delete.loading')}</span>
                                </>
                            ) : (
                                t('admin.delete_user_btn')
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default DeleteUserModal;
