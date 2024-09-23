import React, { useState, useEffect } from 'react';

const ImageModal = ({ isOpen, onClose, imageUrl, documentName }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
    }
  }, [isOpen]);

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-black opacity-50" onClick={onClose}></div>
      <div className="flex flex-col bg-white p-4 rounded-lg z-10 max-w-4xl max-h-full overflow-auto">
        <div className='flex gap-2 items-center justify-between'>
          <span className='bg-slate-200 px-6 py-2 rounded-md'>Image Preview: <span className='text-blue-600 underline'>{documentName}</span></span>
          <button onClick={onClose} className="bg-red-600 hover:bg-red-800 text-white px-4 py-2 rounded-lg">Close</button>
        </div>
        {isLoading && (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500"></div>
          </div>
        )}
        <img
          src={imageUrl}
          alt="Document"
          className={`max-w-full max-h-full ${isLoading ? 'hidden' : 'block'}`}
          onLoad={handleImageLoad}
        />
      </div>
    </div>
  );
};

export default ImageModal;