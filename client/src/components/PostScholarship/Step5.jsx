import React, { useEffect } from 'react';

const Step5 = ({ formData, setFormData }) => {
    useEffect(() => {
        // Scroll to the top of the page when the component is mounted
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="bg-white p-8 rounded-md shadow border">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Terms and Conditions for Scholarship Providers</h2>
            <p className="text-sm text-gray-600 mb-4">
                Please read the following terms and conditions carefully before submitting your scholarship program. By submitting your scholarship program, you agree to comply with these terms and conditions.
            </p>
            <div className="h-80 overflow-y-auto text-sm text-gray-600 space-y-4">
                <div>
                    <h3 className="text-lg font-semibold text-gray-700">1. Eligibility</h3>
                    <p>
                        The provider must be a legitimate organization or individual with the capacity to offer and manage the scholarship program. Verification of the provider's status may be required.
                    </p>
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-gray-700">2. Documentation</h3>
                    <p>
                        All required documents must be submitted, including proof of the provider's legitimacy and capability to administer the scholarship. This includes but is not limited to business registration, tax identification, and financial statements.
                    </p>
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-gray-700">3. Accuracy of Information</h3>
                    <p>
                        The provider must ensure that all information provided in the scholarship program submission is accurate, complete, and up-to-date. Any false or misleading information may result in the disqualification or termination of the scholarship program.
                    </p>
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-gray-700">4. Compliance</h3>
                    <p>
                        The provider must adhere to all relevant local, state, and national laws and regulations related to the offering and administration of the scholarship. This includes compliance with anti-discrimination laws and financial regulations.
                    </p>
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-gray-700">5. Non-Discrimination</h3>
                    <p>
                        The scholarship program must be conducted in a non-discriminatory manner. The provider must ensure that the scholarship is accessible to all eligible applicants regardless of race, gender, religion, disability, sexual orientation, or any other protected characteristic.
                    </p>
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-gray-700">6. Termination</h3>
                    <p>
                        The provider reserves the right to terminate the scholarship program at any time. In such cases, the provider must honor all current commitments to applicants and notify all stakeholders as soon as possible.
                    </p>
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-gray-700">7. Liability</h3>
                    <p>
                        The provider shall not be liable for any damages or losses resulting from the scholarship program. This includes any issues related to the administration of the scholarship, delays, or errors in processing.
                    </p>
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-gray-700">8. Privacy</h3>
                    <p>
                        The provider agrees to handle all personal data collected during the scholarship application process in accordance with applicable privacy laws and regulations. Data must be kept confidential and used only for the purpose of managing the scholarship program.
                    </p>
                </div>
            </div>
            <div className="mt-6 flex items-center">
                <input
                    type="checkbox"
                    id="agree"
                    name="agree"
                    checked={formData.agree || false}
                    onChange={(e) => setFormData({ ...formData, agree: e.target.checked })}
                    className="mr-2"
                    required
                />
                <label htmlFor="agree" className="text-gray-700 text-sm">
                    I have read and agree to the terms and conditions.
                </label>
            </div>
        </div>

    );
};

export default Step5;