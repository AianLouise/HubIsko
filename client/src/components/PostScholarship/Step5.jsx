import React, { useEffect } from 'react';

const Step5 = ({ formData, setFormData }) => {
    useEffect(() => {
        // Scroll to the top of the page when the component is mounted
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="bg-white p-8 rounded-md shadow border">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Data Privacy</h2>
            <p className="text-sm text-gray-600 mb-4">
                Please read the following data privacy policy carefully before submitting your scholarship program. By submitting your scholarship program, you agree to comply with this data privacy policy.
            </p>
            <div className="h-80 overflow-y-auto text-sm text-gray-600 space-y-4">
                <div>
                    <h3 className="text-lg font-semibold text-gray-700">1. Data Collection</h3>
                    <p>
                        We collect personal data from applicants to process and manage the scholarship program. This includes but is not limited to names, contact information, educational background, and other relevant details.
                    </p>
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-gray-700">2. Data Usage</h3>
                    <p>
                        The collected data will be used solely for the purpose of administering the scholarship program. This includes evaluating applications, communicating with applicants, and fulfilling any legal or regulatory requirements.
                    </p>
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-gray-700">3. Data Sharing</h3>
                    <p>
                        We do not share personal data with third parties except as necessary to administer the scholarship program or as required by law. Any third-party service providers are required to comply with our data privacy standards.
                    </p>
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-gray-700">4. Data Security</h3>
                    <p>
                        We implement appropriate technical and organizational measures to protect personal data against unauthorized access, alteration, disclosure, or destruction. This includes encryption, access controls, and regular security assessments.
                    </p>
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-gray-700">5. Data Retention</h3>
                    <p>
                        Personal data will be retained only for as long as necessary to fulfill the purposes for which it was collected or as required by law. Once the data is no longer needed, it will be securely deleted or anonymized.
                    </p>
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-gray-700">6. Data Access and Correction</h3>
                    <p>
                        Applicants have the right to access their personal data and request corrections if the data is inaccurate or incomplete. Requests for access or correction should be directed to our data privacy officer.
                    </p>
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-gray-700">7. Consent</h3>
                    <p>
                        By submitting your application, you consent to the collection, use, and processing of your personal data as described in this policy. You have the right to withdraw your consent at any time, but this may affect your eligibility for the scholarship program.
                    </p>
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-gray-700">8. Contact Information</h3>
                    <p>
                        If you have any questions or concerns about this data privacy policy or our data handling practices, please contact our data privacy officer at [contact information].
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
                    I have read and agree to the data privacy policy.
                </label>
            </div>
        </div>
    );
};

export default Step5;