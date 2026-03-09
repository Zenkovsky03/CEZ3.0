import React from 'react';
import Modal from '../../Modal';
import Button from '../../Button';
import './AddModuleModal.scss';

const AddModuleModal = ({
    isOpen,
    onClose,
    onSubmit,
    title,
    orderIndex,
    onTitleChange,
    onOrderIndexChange,
    loading
}) => {
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title.trim()) {
            return;
        }

        await onSubmit({
            Title: title.trim(),
            OrderIndex: Number(orderIndex) || 1
        });
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Dodaj moduł" size="small">
            <form className="add-module-modal" onSubmit={handleSubmit}>
                <label className="field-label">
                    <p className="input-label-text">Nazwa modułu</p>
                    <input
                        className="form-input"
                        type="text"
                        value={title}
                        onChange={(e) => onTitleChange(e.target.value)}
                        placeholder="Np. Wprowadzenie"
                        required
                    />
                </label>

                <label className="field-label">
                    <p className="input-label-text">Kolejność</p>
                    <input
                        className="form-input"
                        type="number"
                        min="1"
                        value={orderIndex}
                        onChange={(e) => onOrderIndexChange(e.target.value)}
                        required
                    />
                </label>

                <div className="modal-actions">
                    <Button
                        variant="secondary"
                        onClick={onClose}
                        disabled={loading}
                    >
                        Anuluj
                    </Button>
                    <Button type="submit" variant="primary" disabled={loading}>
                        {loading ? 'Zapisywanie...' : 'Dodaj moduł'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

export default AddModuleModal;
