import React from 'react';
import { AiOutlinePaperClip, AiFillFilePdf, AiFillFileWord } from 'react-icons/ai';

const CommentForm = ({
    handleCommentSubmit,
    commentContent,
    setCommentContent,
    handleAttachmentClick,
    handleFileChange,
    selectedFiles,
    handleRemoveFile,
    loading
}) => {
    return (
        <form onSubmit={handleCommentSubmit} className="bg-white p-8 rounded-md shadow mb-8 mx-auto">
            <textarea
                className="w-full p-4 border rounded-md mb-4 focus:outline-blue-200 resize-none"
                placeholder="Write your reply..."
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                required
            />
            <div className='w-full flex justify-end items-center'>
                <button
                    type="button"
                    className='bg-blue-600 p-3 rounded-md mx-2 hover:bg-blue-800 flex items-center justify-center'
                    onClick={handleAttachmentClick}
                >
                    <AiOutlinePaperClip className='w-6 h-6 text-white' />
                </button>
                <input
                    type="file"
                    id="fileInput"
                    className="hidden"
                    accept=".jpg,.jpeg,.png,.gif,.pdf,.docx"
                    multiple
                    onChange={handleFileChange}
                />
                <button
                    type="submit"
                    className={`bg-blue-600 text-white p-3 rounded-md mx-2 ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-800 transition ease-in-out'}`}
                    disabled={loading}
                >
                    {loading ? 'Adding...' : 'Add Reply'}
                </button>
            </div>

            {selectedFiles.length > 0 && (
                <div className="mt-4">
                    <h4 className="font-medium mb-2">Attached Files:</h4>
                    <ul className="grid grid-cols-2 gap-4">
                        {selectedFiles.map((fileObj, index) => (
                            <li key={index} className="flex flex-col items-center justify-center space-y-2 p-2 border rounded-md shadow-sm h-40">
                                {fileObj.file.type.startsWith('image/') ? (
                                    <>
                                        <img
                                            src={fileObj.url}
                                            alt={fileObj.file.name}
                                            className="w-24 h-24 object-cover rounded-md shadow"
                                        />
                                        <span className="text-sm text-gray-600 text-center">{fileObj.file.name}</span>
                                    </>
                                ) : fileObj.file.type === 'application/pdf' ? (
                                    <div className="flex flex-col items-center justify-center h-full">
                                        <AiFillFilePdf className="w-8 h-8 text-red-600" />
                                        <a href={fileObj.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-center">
                                            {fileObj.file.name}
                                        </a>
                                    </div>
                                ) : fileObj.file.type === 'application/msword' || fileObj.file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ? (
                                    <div className="flex flex-col items-center justify-center h-full">
                                        <AiFillFileWord className="w-8 h-8 text-blue-600" />
                                        <a href={fileObj.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-center">
                                            {fileObj.file.name}
                                        </a>
                                    </div>
                                ) : (
                                    <a href={fileObj.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-center">
                                        {fileObj.file.name}
                                    </a>
                                )}
                                <button
                                    type="button"
                                    className="text-red-600 hover:text-red-800"
                                    onClick={() => handleRemoveFile(index)}
                                >
                                    Remove
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </form>
    );
};

export default CommentForm;