import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

export default function StudentScholarship() {
    const { id } = useParams();

    const [scholarshipPrograms, setScholarshipPrograms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchScholarshipPrograms = async () => {
            try {
                const response = await fetch(`/api/admin/user/${id}/scholarship-programs`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setScholarshipPrograms(data.data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchScholarshipPrograms();
    }, [id]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className='border-2 rounded-md p-10 flex flex-col justify-center items-center bg-white h-96 mb-20'>
            <h2 className='text-xl font-bold mb-4'>Scholarship Programs</h2>
            {scholarshipPrograms.length === 0 ? (
                <span>No scholarship programs found.</span>
            ) : (
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                    {scholarshipPrograms.map((program) => (
                        <div key={program._id} className='border rounded-lg p-4 shadow-md'>
                            <h3 className='text-lg font-semibold mb-2'>{program.title}</h3>
                            <p className='text-sm mb-4'>{program.description}</p>
                            <Link to={`/scholarship-programs/${program._id}`} className='text-blue-500 hover:underline'>
                                View Details
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}