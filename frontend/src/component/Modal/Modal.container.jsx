import React, { useEffect } from 'react';
import Modal from './Modal.component';
import './Modal.scss';

const ModalContainer = ({ isOpen, onClose, title, children, size = 'medium' }) => {
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            size={size}
            handleBackdropClick={handleBackdropClick}>
            {children}
        </Modal>
    );
};

export default ModalContainer;