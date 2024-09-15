import React from 'react';
import { Link } from 'react-router-dom';

const EditProgram = () => {
    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4 text-blue-600">Edit Program</h2>
            <p className="text-gray-700">
                To make changes to the scholarship program, please visit the{' '}
                <Link to={``} className="text-blue-600 hover:underline">
                    Edit Program Page
                </Link>.
            </p>
        </div>
    );
};

export default EditProgram;