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
            <h2 className="text-2xl font-bold mb-6">Agree to Terms and Conditions</h2>
            <div className="mb-4">
                <div className="bg-gray-100 p-4 rounded-md mb-4 max-h-60 overflow-y-scroll" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                    <p><strong>1. Introduction</strong></p>
                    <p>Welcome to HubIsko. These Terms and Conditions govern your registration and use of our services as a scholarship provider. By registering as a scholarship provider, you agree to comply with and be bound by these Terms. If you do not agree with any part of these Terms, please do not proceed with registration.</p>

                    <p className="mt-4"><strong>2. Eligibility</strong></p>
                    <p>To register as a scholarship provider on HubIsko, you must:</p>
                    <ul>
                        <li>Be a legitimate organization, institution, or individual with the authority to offer scholarships.</li>
                        <li>Provide accurate and complete information during the registration process.</li>
                        <li>Agree to comply with all applicable laws and regulations related to scholarships.</li>
                    </ul>

                    <p className="mt-4"><strong>3. Account Responsibilities</strong></p>
                    <p>Upon successful registration, you will be granted access to an account to manage your scholarships. You are responsible for:</p>
                    <ul>
                        <li>Maintaining the confidentiality of your account credentials.</li>
                        <li>Ensuring that all information provided through your account is accurate, current, and complete.</li>
                        <li>Reporting any unauthorized use of your account to us immediately.</li>
                    </ul>

                    <p className="mt-4"><strong>4. Scholarship Program Creation</strong></p>
                    <p>When creating a scholarship program, you agree to:</p>
                    <ul>
                        <li>Provide accurate and complete information about the scholarship program, including but not limited to title, description, eligibility criteria, and deadlines.</li>
                        <li>Ensure that your scholarship programs comply with all relevant laws and regulations.</li>
                        <li>Obtain and provide all necessary documentation and approvals for the scholarship program.</li>
                    </ul>

                    <p className="mt-4"><strong>5. Content and Conduct</strong></p>
                    <p>You agree that:</p>
                    <ul>
                        <li>All content you provide, including scholarship descriptions and requirements, must be truthful and not misleading.</li>
                        <li>You will not use the Platform to engage in any unlawful, fraudulent, or harmful activities.</li>
                        <li>You will respect the privacy and rights of applicants and other users of the Platform.</li>
                    </ul>

                    <p className="mt-4"><strong>6. Platform Use</strong></p>
                    <p>We reserve the right to:</p>
                    <ul>
                        <li>Modify or discontinue any aspect of the Platform, including but not limited to features, functionality, and availability.</li>
                        <li>Remove or reject any content or scholarship program that violates these Terms or our content policies.</li>
                    </ul>

                    <p className="mt-4"><strong>7. Fees and Payments</strong></p>
                    <p>If applicable, you agree to:</p>
                    <ul>
                        <li>Pay any fees associated with using the Platform as a scholarship provider.</li>
                        <li>Comply with our payment terms and conditions, which will be provided separately.</li>
                    </ul>

                    <p className="mt-4"><strong>8. Termination</strong></p>
                    <p>We may terminate your account and access to the Platform if you:</p>
                    <ul>
                        <li>Violate these Terms or any other policies of the Platform.</li>
                        <li>Fail to comply with applicable laws and regulations.</li>
                        <li>Engage in behavior that we deem inappropriate or harmful to the Platform or its users.</li>
                    </ul>

                    <p className="mt-4"><strong>9. Limitation of Liability</strong></p>
                    <p>To the maximum extent permitted by law, HubIsko shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the Platform or any scholarship programs you create.</p>

                    <p className="mt-4"><strong>10. Indemnification</strong></p>
                    <p>You agree to indemnify and hold harmless HubIsko, its affiliates, officers, directors, employees, and agents from any claims, damages, liabilities, costs, and expenses arising out of your use of the Platform or violation of these Terms.</p>

                    <p className="mt-4"><strong>11. Changes to Terms</strong></p>
                    <p>We may update these Terms from time to time. We will notify you of any significant changes by posting the revised Terms on the Platform. Your continued use of the Platform after such changes indicates your acceptance of the updated Terms.</p>

                    <p className="mt-4"><strong>12. Governing Law</strong></p>
                    <p>These Terms shall be governed by and construed in accordance with the laws of [Your Jurisdiction], without regard to its conflict of law principles. Any disputes arising from these Terms shall be resolved in the courts of [Your Jurisdiction].</p>

                    <p className="mt-4"><strong>13. Contact Us</strong></p>
                    <p>If you have any questions or concerns about these Terms or your registration as a scholarship provider, please contact us at:</p>
                    <p>HubIsko</p>
                    <p>[Your Contact Information]</p>
                    <p>Email: contact@hubisko.com</p>
                    <p>Phone: [Your Phone Number]</p>
                    <p>Address: [Your Address]</p>
                </div>
                <label className="inline-flex items-center">
                    <input
                        type="checkbox"
                        name="agreeTerms"
                        checked={formData.agreeTerms}
                        onChange={handleChange}
                        className="form-checkbox h-4 w-4 text-blue-600 transition duration-150 ease-in-out"
                        required
                    />
                    <span className="ml-2 text-sm text-gray-700">
                        I agree to the <a href="#" className="text-blue-500">Terms and Conditions</a>
                    </span>
                </label>
            </div>
        </div>
    );
};

export default Step4;