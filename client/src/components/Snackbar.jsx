import React from 'react';

function Snackbar({ message, onClose, onAction, actionText }) {
    return (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white font-semibold px-6 py-3 rounded-md shadow-lg flex items-center justify-between">
            <span>{message}</span>
            <div className="flex gap-4 ml-4">
                <button
                    className="bg-white text-green-500 px-4 py-2 rounded-md font-semibold"
                    onClick={onAction}
                >
                    {actionText}
                </button>
                <button
                    className="bg-green-700 px-4 py-2 rounded-md font-semibold"
                    onClick={onClose}
                >
                    Close
                </button>
            </div>
        </div>
    );
}

export default Snackbar;
