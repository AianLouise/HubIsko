function CustomNotification({ message, type, onClose }) {
    return (
        <div className={`fixed top-4 right-4 p-4 rounded shadow-lg ${type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
            <div className='flex justify-between items-center'>
                <span>{message}</span>
                <button onClick={onClose} className='ml-4 text-lg font-bold'>
                    &times;
                </button>
            </div>
        </div>
    );
}

export default CustomNotification;