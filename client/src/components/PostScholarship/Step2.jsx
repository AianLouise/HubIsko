import React, { useState, useEffect } from 'react';

const Step2 = ({ formData, setFormData }) => {
    const [documents, setDocuments] = useState([
        { id: 'transcript', name: 'Transcript of Records', required: false },
        { id: 'recommendation', name: 'Recommendation Letters', required: false },
        { id: 'essay', name: 'Personal Statement/Essay', required: false },
        { id: 'enrollment', name: 'Proof of Enrollment', required: false },
    ]);

    useEffect(() => {
        // Scroll to the top of the page when the component is mounted
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        if (formData.requiredDocuments) {
            const updatedDocuments = documents.map(doc => ({
                ...doc,
                required: formData.requiredDocuments.some(requiredDoc => requiredDoc.id === doc.id)
            }));
            setDocuments(updatedDocuments);
        }
    }, [formData.requiredDocuments]);

    useEffect(() => {
        if (formData.documents) {
            setDocuments(formData.documents);
        }
    }, [formData.documents]);

    const updateFormData = (key, value) => {
        setFormData(prevFormData => ({
            ...prevFormData,
            [key]: value
        }));
    };

    const handleDocumentChange = (index, field, value) => {
        const updatedDocuments = [...documents];
        updatedDocuments[index] = { ...updatedDocuments[index], [field]: value };
        setDocuments(updatedDocuments);

        if (field === 'required') {
            const updatedRequiredDocuments = value
                ? [...(formData.requiredDocuments || []), updatedDocuments[index]]
                : (formData.requiredDocuments || []).filter(doc => doc.id !== updatedDocuments[index].id);
            updateFormData('requiredDocuments', updatedRequiredDocuments);

            // Log the selected required documents
            console.log('Selected required documents:', updatedRequiredDocuments);
        }

        updateFormData('documents', updatedDocuments);
    };

    const handleAddDocument = () => {
        const newDocument = { id: Date.now(), name: '', required: false, editable: true };
        const updatedDocuments = [...documents, newDocument];
        setDocuments(updatedDocuments);
        updateFormData('documents', updatedDocuments);
    };

    const handleRemoveDocument = (index) => {
        const updatedDocuments = documents.filter((_, i) => i !== index);
        setDocuments(updatedDocuments);
        updateFormData('documents', updatedDocuments);
    };

    return (
        <div className="flex flex-col gap-8">
            <div className="bg-white p-8 rounded-md shadow border flex flex-col gap-4">
                <div className='flex justify-between items-center'>
                    <h2 className="text-2xl font-bold text-gray-800">Required Documents <span className="text-red-500">*</span></h2>
                    {/* {errors && <p className="bg-red-600 text-white font-medium py-2 px-4 rounded-md mt-2">At least one document must be selected.</p>} */}
                </div>

                <p className="text-slate-600">Specify the documents that applicants need to submit.</p>

                {documents.map((doc, index) => (
                    <div key={doc.id} className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id={doc.id}
                            name={doc.id}
                            value={doc.id}
                            checked={doc.required || false}
                            onChange={(e) => handleDocumentChange(index, 'required', e.target.checked)}
                            className="mr-2"
                            required
                            disabled={!doc.name}
                        />
                        <input
                            type="text"
                            value={doc.name || ''}
                            onChange={(e) => handleDocumentChange(index, 'name', e.target.value)}
                            placeholder="Document Name"
                            className="border border-gray-300 rounded-md p-2 flex-grow"
                            readOnly={!doc.editable}
                            required
                        />
                        {doc.editable && (
                            <button
                                type="button"
                                onClick={() => handleRemoveDocument(index)}
                                className="text-red-600 hover:text-red-800"
                            >
                                Remove
                            </button>
                        )}
                    </div>
                ))}

                <div className='flex w-full justify-center'>
                    <button
                        type="button"
                        onClick={handleAddDocument}
                        className="bg-blue-600 hover:bg-blue-800 text-white py-2 px-4 rounded-md mt-2 hover:w-full w-[300px] transition-all ease-in-out duration-500 font-medium"
                    >
                        Add Requirement
                    </button>
                </div>
            </div>

            <div className="bg-white p-8 rounded-md shadow border flex flex-col gap-4">
                <h2 className="text-xl font-bold text-gray-800">Document Instructions <span className="text-red-500">*</span></h2>
                <p className="text-sm text-gray-500 mb-2">Please provide any additional instructions or guidelines for document submission.</p>
                <textarea
                    id="documentGuidelines"
                    name="documentGuidelines"
                    className="border border-gray-300 rounded-md p-2"
                    placeholder="Enter detailed instructions for document submission"
                    rows="4"
                    value={formData.documentGuidelines || ''}
                    onChange={(e) => updateFormData('documentGuidelines', e.target.value)}
                    required
                ></textarea>
            </div>
        </div>
    );
};

export default Step2;