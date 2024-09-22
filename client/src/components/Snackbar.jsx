import React from 'react';

function Snackbar({ message, onClose, onAction, actionText }) {
    const isErrorMessage = message === 'No available slots in the scholarship program.';
    const bgColor = isErrorMessage ? 'bg-red-500' : 'bg-green-500';
    const buttonTextColor = isErrorMessage ? 'text-red-500' : 'text-green-500';
    const buttonBgColor = isErrorMessage ? 'bg-red-700' : 'bg-green-700';

    return (
        <div className={`fixed bottom-4 right-4 ${bgColor} text-white font-semibold px-6 py-3 rounded-md shadow-lg flex items-center justify-between`}>
            <span>{message}</span>
            <div className="flex gap-4 ml-4">
                <button
                    className={`bg-white ${buttonTextColor} px-4 py-2 rounded-md font-semibold`}
                    onClick={onAction}
                >
                    {actionText}
                </button>
                <button
                    className={`${buttonBgColor} px-4 py-2 rounded-md font-semibold`}
                    onClick={onClose}
                >
                    Close
                </button>
            </div>
        </div>
    );
}

export default Snackbar;