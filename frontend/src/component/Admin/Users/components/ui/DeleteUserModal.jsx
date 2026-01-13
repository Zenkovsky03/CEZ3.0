import React from 'react';
import { createPortal } from 'react-dom';
import '../../AdminUsersPageNew.scss';

const DeleteUserModal = ({ 
    show,
    user,
    onCancel, 
    onConfirm, 
    deleting, 
    error 
}) => {
    if (!show) return null;

    return createPortal(
        <div className="delete-modal">
            <div className="delete-modal__backdrop" onClick={onCancel}></div>
            <div className="delete-modal__content">
                <div className="delete-modal__body">
                    <h2 className="delete-modal__title">Potwierdzenie usunięcia</h2>
                    <p className="delete-modal__message">
                        Czy na pewno chcesz usunąć użytkownika <span className="delete-modal__user-name">{user?.firstName} {user?.lastName}</span>? 
                        To działanie jest nieodwracalne.
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
                            Anuluj
                        </button>
                        <button
                            onClick={onConfirm}
                            disabled={deleting}
                            className="delete-modal__btn delete-modal__btn--delete"
                        >
                            {deleting ? (
                                <>
                                    <div className="delete-modal__btn-spinner"></div>
                                    <span>Usuwanie...</span>
                                </>
                            ) : (
                                'Usuń użytkownika'
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
