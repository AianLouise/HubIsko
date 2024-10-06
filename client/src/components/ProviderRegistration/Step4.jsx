import React, { useEffect } from 'react';

const Step4 = ({ formData, setFormData }) => {
    useEffect(() => {
        // Scroll to the top of the page when the component is mounted
        window.scrollTo(0, 0);
    }, []);

    const handleChange = (e) => {
        const { name, checked } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: checked,
        }));
    };

    return (
        <div className="bg-white p-8 shadow rounded-md border max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Agree to Data Privacy Policy</h2>
            <div className="mb-4">
                <div className="bg-gray-100 p-4 rounded-md mb-4 max-h-60 overflow-y-scroll" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                    <p><strong>1. Introduction</strong></p>
                    <p>Welcome to HubIsko. This Data Privacy Policy governs your registration and use of our services as a scholarship provider. By registering as a scholarship provider, you agree to comply with and be bound by this Policy. If you do not agree with any part of this Policy, please do not proceed with registration.</p>

                    <p className="mt-4"><strong>2. Data Collection</strong></p>
                    <p>We collect the following types of data:</p>
                    <ul>
                        <li>Personal information such as name, email address, and contact details.</li>
                        <li>Organizational information such as institution name, registration details, and address.</li>
                        <li>Any other information you provide during the registration process.</li>
                    </ul>

                    <p className="mt-4"><strong>3. Data Usage</strong></p>
                    <p>We use the collected data for the following purposes:</p>
                    <ul>
                        <li>To verify your identity and eligibility as a scholarship provider.</li>
                        <li>To manage and maintain your account.</li>
                        <li>To communicate with you regarding your account and our services.</li>
                    </ul>

                    <p className="mt-4"><strong>4. Data Sharing</strong></p>
                    <p>We may share your data with:</p>
                    <ul>
                        <li>Third-party service providers who assist us in operating our platform.</li>
                        <li>Law enforcement or regulatory authorities if required by law.</li>
                        <li>Other users of the platform as necessary for the provision of our services.</li>
                    </ul>

                    <p className="mt-4"><strong>5. Data Security</strong></p>
                    <p>We implement appropriate security measures to protect your data from unauthorized access, alteration, disclosure, or destruction.</p>

                    <p className="mt-4"><strong>6. Data Retention</strong></p>
                    <p>We retain your data for as long as necessary to fulfill the purposes outlined in this Policy, unless a longer retention period is required or permitted by law.</p>

                    <p className="mt-4"><strong>7. Your Rights</strong></p>
                    <p>You have the right to:</p>
                    <ul>
                        <li>Access and obtain a copy of your data.</li>
                        <li>Request correction or deletion of your data.</li>
                        <li>Object to or restrict the processing of your data.</li>
                    </ul>

                    <p className="mt-4"><strong>8. Changes to Policy</strong></p>
                    <p>We may update this Policy from time to time. We will notify you of any significant changes by posting the revised Policy on the Platform. Your continued use of the Platform after such changes indicates your acceptance of the updated Policy.</p>

                    <p className="mt-4"><strong>9. Contact Us</strong></p>
                    <p>If you have any questions or concerns about this Data Privacy Policy or your registration as a scholarship provider, please contact us at:</p>
                    <p>HubIsko</p>
                    <p>Email: connectwithhubisko@gmail.com</p>
                </div>
                <label className="inline-flex items-center">
                    <input
                        type="checkbox"
                        name="agreePrivacy"
                        checked={formData.agreePrivacy}
                        onChange={handleChange}
                        className="form-checkbox h-4 w-4 text-blue-600 transition duration-150 ease-in-out"
                        required
                    />
                    <span className="ml-2 text-sm text-gray-700">
                        I agree to the <a href="#" className="text-blue-500">Data Privacy Policy</a>
                    </span>
                </label>
            </div>
        </div>
    );
};

export default Step4;