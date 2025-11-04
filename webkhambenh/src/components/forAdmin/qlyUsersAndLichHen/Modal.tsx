
import React from 'react';
import './Modal.css'; 

interface ModalProps {
  children: React.ReactNode;
  title: string;
  onClose: () => void;
}

export const Modal: React.FC<ModalProps> = ({ children, title, onClose }) => (
    <div className="modal-overlay">
        <div className="modal-content">
            <div className="modal-header">
                <h3>{title}</h3>
                <button onClick={onClose} className="modal-close-btn">&times;</button>
            </div>
            {children} 
        </div>
    </div>
);

interface ConfirmationModalProps {
  title: string;
  confirmText: string;
  onConfirm: () => void;
  onCancel: () => void;
  children: React.ReactNode;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ title, confirmText, onConfirm, onCancel, children }) => {
    return (
        <Modal title={title} onClose={onCancel}>
            <div className="modal-body">
                <p className="modal-confirm-text">{children}</p>
                <div className="modal-actions">
                    <button onClick={onCancel} className="modal-button modal-button-secondary">Hủy</button>
                    <button onClick={onConfirm} className="modal-button modal-button-confirm">{confirmText}</button>
                </div>
            </div>
        </Modal>
    );
};