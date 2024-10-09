import { useEffect } from 'react';

function CustomNotification({ message, type, onClose }) {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 3000); // Adjust the duration as needed (3000ms = 3 seconds)

        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className={`fixed top-4 right-4 ml-4 p-4 rounded shadow-lg z-20 ${type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
            <div className='flex justify-between items-center'>
                <span>{message}</span>
            </div>
        </div>
    );
}

export default CustomNotification;