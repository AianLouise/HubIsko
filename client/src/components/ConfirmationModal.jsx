import React from 'react';

function ConfirmationModal({ isOpen, onClose, onConfirm, message }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-md shadow-md">
                <p className="mb-4">{message}</p>
                <div className="flex justify-end gap-4">
                    <button
                        className="bg-gray-300 px-4 py-2 rounded-md"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button
                        className="bg-green-600 text-white px-4 py-2 rounded-md"
                        onClick={onConfirm}
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ConfirmationModal;