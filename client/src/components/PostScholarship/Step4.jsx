import React, { useState, useEffect } from 'react';
import { BsEyeFill } from 'react-icons/bs';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const Step4 = ({ formData, setFormData }) => {
    const storage = getStorage();

    const initialProviderRequirements = [
        { id: 'accreditation', name: 'Accreditation Certificate', url: '' },
        { id: 'funding', name: 'Proof of Funding', url: '' },
        { id: 'programDescription', name: 'Program Description', url: '' },
        { id: 'legalCompliance', name: 'Legal Compliance Documents', url: '' },
        { id: 'taxClearance', name: 'Tax Clearance Certificate', url: '' },
        { id: 'bankStatements', name: 'Recent Bank Statements', url: '' },
        { id: 'partnershipAgreements', name: 'Partnership Agreements', url: '' },
        { id: 'promotionalMaterial', name: 'Promotional Materials', url: '' },
        { id: 'budgetProposal', name: 'Budget Proposal', url: '' },
    ];

    const [providerRequirements, setProviderRequirements] = useState(initialProviderRequirements);
    const [newDocuments, setNewDocuments] = useState([]);

    useEffect(() => {
        // Scroll to the top of the page when the component is mounted
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        if (formData.providerRequirements) {
            setProviderRequirements(formData.providerRequirements);
        }
    }, [formData]);

    const handleFileChange = async (event, id) => {
        const file = event.target.files[0];
        if (file) {
            try {
                const filePath = `requiredDocuments/${id}/${file.name}`;
                const fileRef = ref(storage, filePath);
                await uploadBytes(fileRef, file);
                const fileUrl = await getDownloadURL(fileRef);

                const updatedProviderRequirements = providerRequirements.map((req) =>
                    req.id === id ? { ...req, url: fileUrl } : req
                );

                setProviderRequirements(updatedProviderRequirements);

                setFormData((prevFormData) => ({
                    ...prevFormData,
                    providerRequirements: updatedProviderRequirements,
                }));

                console.log('Updated formData:', {
                    ...formData,
                    providerRequirements: updatedProviderRequirements,
                });
            } catch (error) {
                console.error('Error uploading file:', error);
            }
        }
    };

    const handleAddDocument = () => {
        setNewDocuments([...newDocuments, { name: '', id: '' }]);
    };

    const handleNewDocumentChange = (index, field, value) => {
        const updatedNewDocuments = newDocuments.map((doc, i) =>
            i === index ? { ...doc, [field]: value } : doc
        );
        setNewDocuments(updatedNewDocuments);
    };

    const handleNewFileChange = async (event, index) => {
        const file = event.target.files[0];
        const newDocument = newDocuments[index];
        if (file && newDocument.name) {
            try {
                const newId = newDocument.name.toLowerCase().replace(/\s+/g, '');
                const filePath = `requiredDocuments/${newId}/${file.name}`;
                const fileRef = ref(storage, filePath);
                await uploadBytes(fileRef, file);
                const fileUrl = await getDownloadURL(fileRef);

                const newReq = { id: newId, name: newDocument.name, url: fileUrl };
                const updatedProviderRequirements = [...providerRequirements, newReq];

                setProviderRequirements(updatedProviderRequirements);
                setFormData((prevFormData) => ({
                    ...prevFormData,
                    providerRequirements: updatedProviderRequirements,
                }));

                console.log('Updated formData:', {
                    ...formData,
                    providerRequirements: updatedProviderRequirements,
                });

                // Remove the new document input after adding
                setNewDocuments(newDocuments.filter((_, i) => i !== index));
            } catch (error) {
                console.error('Error uploading file:', error);
            }
        }
    };

    return (
        <div className="bg-white p-8 rounded-md shadow border">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Required Documents</h2>
            <p className="text-lg text-gray-600 mb-4">Specify the documents that prove you can offer this scholarship program.</p>
            <div className="space-y-4 px-4 py-8">
                {providerRequirements.map((req) => (
                    <div key={req.id} className="flex flex-col gap-4 border-b border-gray-200 pb-4">
                        <div className="flex items-center justify-between gap-4">
                            <label htmlFor={req.id} className="text-lg font-medium text-gray-700 w-1/2">
                                {req.name}
                            </label>
                            <input
                                type="file"
                                id={req.id}
                                name={req.id}
                                className="border border-gray-300 rounded-md p-2 text-sm w-1/2"
                                onChange={(e) => handleFileChange(e, req.id)}
                            />
                            {req.url && (
                                <a href={req.url} className="flex gap-2 justify-center items-center text-white bg-blue-600 px-6 py-2 rounded-md w-[300px] hover:bg-blue-800" target="_blank" rel="noopener noreferrer">
                                    <BsEyeFill className="inline-block" />
                                    View Uploaded File
                                </a>
                            )}
                        </div>
                    </div>
                ))}

                {newDocuments.map((doc, index) => (
                    <div key={index} className="flex flex-col gap-4 border-b border-gray-200 pb-4">
                        <div className="flex items-center justify-between gap-4">
                            <input
                                type="text"
                                placeholder="Document Name"
                                value={doc.name}
                                onChange={(e) => handleNewDocumentChange(index, 'name', e.target.value)}
                                className="border border-gray-300 rounded-md p-2 text-sm w-1/2"
                            />
                            <input
                                type="file"
                                className="border border-gray-300 rounded-md p-2 text-sm w-1/2"
                                onChange={(e) => handleNewFileChange(e, index)}
                            />
                        </div>
                    </div>
                ))}

                <button
                    type="button"
                    onClick={handleAddDocument}
                    className="bg-blue-600 rounded-md px-6 py-2 font-medium text-white w-[220px] hover:bg-blue-800 hover:w-full hover:text-center transition-all ease-in-out duration-500"
                >
                    Add another document
                </button>
            </div>
        </div>
    );
};

export default Step4;