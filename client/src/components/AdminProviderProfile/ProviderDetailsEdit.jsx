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
      contactPersonNumber: '',
      website: ''
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
      contactPersonNumber: '',
      website: ''
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
    const { organizationName, organizationType, registrationNumber, contactPersonName, contactPersonPosition, contactPersonNumber, website } = scholarshipProviderDetails;

    if (!organizationName || !organizationType || !registrationNumber || !contactPersonName || !contactPersonPosition || !contactPersonNumber || !website) {
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
    return (
      <div className="flex justify-center items-center h-screen">
        <svg className="animate-spin h-10 w-10 text-blue-600" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
        </svg>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-md shadow-md w-full relative">
      <div className="text-lg font-bold bg-slate-200 border-2 px-4 py-2 rounded-md"> Organization Information</div>

      {notification && (
        <div className="fixed z-20 top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded shadow-md">
          {notification}
        </div>
      )}

      <form className='flex flex-col justify-between h-full'>
        <div className='gap-4 p-4'>
          {/* Provider Information */}
          <div className="col-span-2 font-sans">
            <div className="mb-4">
              <label htmlFor="organizationName" className="block text-sm font-medium text-gray-700">
                Organization Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="scholarshipProviderDetails.organizationName"
                id="organizationName"
                value={formData.scholarshipProviderDetails.organizationName}
                onChange={handleInputChange}
                className="mt-1 p-2 w-full border rounded-md"
                placeholder="Full name of the organization"
                required
                disabled={!isEditing}
              />
              <div className="mt-1 text-xs text-gray-600">
                {formData.scholarshipProviderDetails.organizationName.length}/{100} characters
              </div>
              {formData.scholarshipProviderDetails.organizationName.length === 100 && (
                <div className="mt-1 text-xs text-red-600">
                  You have reached the character limit.
                </div>
              )}
            </div>

            <div className="mb-4">
              <label htmlFor="organizationType" className="block text-sm font-medium text-gray-700 mb-2">
                Organization Type <span className="text-red-500">*</span>
              </label>
              <select
                name="scholarshipProviderDetails.organizationType"
                id="organizationType"
                value={formData.scholarshipProviderDetails.organizationType}
                onChange={handleInputChange}
                className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                required
                disabled={!isEditing}
              >
                <option value="" disabled>Select organization type</option>
                <option value="Government Agency">Government Agency (e.g., federal, state, local agencies)</option>
                <option value="Private Corporation">Private Corporation (e.g., business, companies)</option>
                <option value="Non-Governmental Organization">Non-Governmental Organization (e.g., charities, non-profit organization/foundations)</option>
                <option value="Educational Foundation">Educational Foundation (e.g., schools, universities)</option>
              </select>
              <div className="mt-1 text-xs text-gray-600">
                Please select the type of organization you are registering. This helps us categorize your organization correctly.
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="registrationNumber" className="block text-sm font-medium text-gray-700">
                Registration Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="scholarshipProviderDetails.registrationNumber"
                id="registrationNumber"
                value={formData.scholarshipProviderDetails.registrationNumber}
                onChange={handleInputChange}
                className="mt-1 p-2 w-full border rounded-md"
                placeholder="Enter your registration number"
                required
                disabled={!isEditing}
              />
              <div className="mt-1 text-xs text-gray-600">
                This is the official number assigned to your organization upon registration or incorporation.
              </div>
            </div>

            <div className="mb-4 col-span-2">
              <label htmlFor="website" className="block text-sm font-medium text-gray-700">
                Website or Social Media Account <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="scholarshipProviderDetails.website"
                id="website"
                value={formData.scholarshipProviderDetails.website}
                onChange={handleInputChange}
                className="mt-1 p-2 w-full border rounded-md"
                placeholder="Official website URL or social media account of the organization"
                required
                disabled={!isEditing}
              />
              <div className="mt-1 text-xs text-gray-600">
                Please provide the official website URL or a social media account link (e.g., Facebook, Instagram) of your organization.
              </div>
            </div>
          </div>

          <hr className="col-span-2" />

          {/* Contact Person Details */}
          <div className="col-span-2 font-sans">
            <div className="text-lg font-bold bg-slate-200 border-2 px-4 py-2 rounded-md">Contact Person Details</div>
            <div className="grid grid-cols-2 gap-4 p-4">
              <div className="mb-4">
                <label htmlFor="contactPersonName" className="block text-sm font-medium text-gray-700 mb-1">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="scholarshipProviderDetails.contactPersonName"
                  id="contactPersonName"
                  value={formData.scholarshipProviderDetails.contactPersonName}
                  onChange={handleInputChange}
                  className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="Enter the full name of the contact person"
                  required
                  disabled={!isEditing}
                />
                <div className="mt-1 text-xs text-gray-600">
                  Please enter the full name of the contact person responsible for the registration.
                </div>
              </div>
              <div className="mb-4">
                <label htmlFor="contactPersonPosition" className="block text-sm font-medium text-gray-700 mb-1">
                  Position <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="scholarshipProviderDetails.contactPersonPosition"
                  id="contactPersonPosition"
                  value={formData.scholarshipProviderDetails.contactPersonPosition}
                  onChange={handleInputChange}
                  className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="Enter the job title or position"
                  required
                  disabled={!isEditing}
                />
                <div className="mt-1 text-xs text-gray-600">
                  Please enter the job title or position of the contact person within the organization.
                </div>
              </div>
              <div className="mb-4">
                <label htmlFor="contactPersonNumber" className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="scholarshipProviderDetails.contactPersonNumber"
                  id="contactPersonNumber"
                  value={formData.scholarshipProviderDetails.contactPersonNumber}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d{0,11}$/.test(value)) {
                      handleInputChange(e);
                    }
                  }}
                  className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="Enter the direct contact number"
                  required
                  disabled={!isEditing}
                />
                <div className="mt-1 text-xs text-gray-600">
                  Please enter the direct contact number for the contact person. The number should be exactly 11 digits.
                </div>
              </div>
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