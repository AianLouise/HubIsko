import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function ProviderDetailsEdit() {
  const { id } = useParams();

  useEffect(() => {
    const fetchProviderDetails = async () => {
      try {
        const response = await fetch(`/api/admin/scholarship-provider/${id}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setProvider(data.provider);
        setFormData(data.provider); // Initialize formData with fetched data
      } catch (error) {
        console.error('Error fetching provider details:', error);
      }
    };

    fetchProviderDetails();
  }, [id]);

  const [provider, setProvider] = useState({
    scholarshipProviderDetails: {
      organizationName: '',
      organizationType: '',
      registrationNumber: '',
      contactPersonName: '',
      contactPersonPosition: '',
      contactPersonNumber: ''
    },
  });

  const [isEditing, setIsEditing] = useState(false);
  const [notification, setNotification] = useState(''); // State for notification message

  const [formData, setFormData] = useState({
    scholarshipProviderDetails: {
      organizationName: '',
      organizationType: '',
      registrationNumber: '',
      contactPersonName: '',
      contactPersonPosition: '',
      contactPersonNumber: ''
    }
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const [key, field] = name.split('.'); // Split the name into key and field

    setFormData((prevFormData) => ({
      ...prevFormData,
      [key]: {
        ...prevFormData[key],
        [field]: value,
      },
    }));
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveChanges = async () => {
    // Validate form data
    const { scholarshipProviderDetails } = formData;
    const { organizationName, organizationType, registrationNumber, contactPersonName, contactPersonPosition, contactPersonNumber } = scholarshipProviderDetails;

    if (!organizationName || !organizationType || !registrationNumber || !contactPersonName || !contactPersonPosition || !contactPersonNumber) {
      setNotification('Please fill in all required fields.');
      // Clear the notification after a few seconds
      setTimeout(() => {
        setNotification('');
      }, 3000);
      return;
    }

    try {
      const response = await fetch(`/api/admin/provider/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const updatedData = await response.json();
      setProvider(updatedData.provider); // Update the provider state with the updated data
      setIsEditing(false);
      setNotification('Provider details updated successfully'); // Set success notification
    } catch (error) {
      console.error('Error updating provider details:', error);
      setNotification('Error updating provider details'); // Set error notification
    }

    // Clear the notification after a few seconds
    setTimeout(() => {
      setNotification('');
    }, 3000);
  };

  const handleCancel = () => {
    setFormData(provider); // Revert changes
    setIsEditing(false);
  };

  if (!provider) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-white p-8 rounded-md shadow-md w-full relative">
      <div className="text-lg font-bold bg-slate-200 border-2 px-4 py-2 rounded-md">Provider Information</div>

      {notification && (
        <div className="fixed z-20 top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded shadow-md">
          {notification}
        </div>
      )}

      <form className='flex flex-col justify-between h-full'>
        <div className='gap-4 p-4'>
          {/* All input fields */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="mb-4">
              <label className='block text-sm font-medium text-gray-700 mb-2'>Organization Name</label>
              <input
                type="text"
                name="scholarshipProviderDetails.organizationName"
                placeholder="Enter organization name"
                value={formData.scholarshipProviderDetails.organizationName}
                onChange={handleInputChange}
                readOnly={!isEditing}
                required
                className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
              />
            </div>

            <div className="mb-4">
              <label className='block text-sm font-medium text-gray-700 mb-2'>Organization Type</label>
              <input
                type="text"
                name="scholarshipProviderDetails.organizationType"
                placeholder="Enter organization type"
                value={formData.scholarshipProviderDetails.organizationType}
                onChange={handleInputChange}
                readOnly={!isEditing}
                className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
              />
            </div>

            <div className="mb-4">
              <label className='block text-sm font-medium text-gray-700 mb-2'>Registration Number</label>
              <input
                type="text"
                name="scholarshipProviderDetails.registrationNumber"
                placeholder="Enter registration number"
                value={formData.scholarshipProviderDetails.registrationNumber}
                onChange={handleInputChange}
                readOnly={!isEditing}
                className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
              />
            </div>

            <div className="mb-4">
              <label className='block text-sm font-medium text-gray-700 mb-2'>Contact Person Name</label>
              <input
                type="text"
                name="scholarshipProviderDetails.contactPersonName"
                placeholder="Enter contact person name"
                value={formData.scholarshipProviderDetails.contactPersonName}
                onChange={handleInputChange}
                readOnly={!isEditing}
                className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
              />
            </div>

            <div className="mb-4">
              <label className='block text-sm font-medium text-gray-700 mb-2'>Contact Person Position</label>
              <input
                type="text"
                name="scholarshipProviderDetails.contactPersonPosition"
                placeholder="Enter contact person position"
                value={formData.scholarshipProviderDetails.contactPersonPosition}
                onChange={handleInputChange}
                readOnly={!isEditing}
                className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
              />
            </div>

            <div className="mb-4">
              <label className='block text-sm font-medium text-gray-700 mb-2'>Contact Person Number</label>
              <input
                type="text"
                name="scholarshipProviderDetails.contactPersonNumber"
                placeholder="Enter contact person number"
                value={formData.scholarshipProviderDetails.contactPersonNumber}
                onChange={handleInputChange}
                readOnly={!isEditing}
                className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-4">
          {isEditing ? (
            <>
              <button
                type="button"
                onClick={handleSaveChanges}
                className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="bg-gray-500 text-white px-4 py-2 rounded-md"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={handleEditClick}
              className="bg-blue-500 text-white px-4 py-2 rounded-md"
            >
              Edit
            </button>
          )}
        </div>
      </form>
    </div>
  );
}