import React from 'react'

export default function PostAnnouncement() {
    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4 text-blue-600">Post Announcement</h2>
            <p className="text-gray-700">
                You can post announcements here to keep scholars updated on important information.
            </p>
            <form className="mt-4">
                <textarea
                    className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    rows="5"
                    placeholder="Write your announcement here..."
                ></textarea>
                <button
                    type="submit"
                    className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-300"
                >
                    Post Announcement
                </button>
            </form>
            <h2 className="text-2xl font-bold mt-8 mb-4 text-blue-600">Previous Announcements</h2>


            <div className='bg-white rounded-lg shadow-md border'>
                <table className="min-w-full">
                    <thead>
                        <tr className='text-left'>
                            <th className="py-2 px-4 border-b">Date</th>
                            <th className="py-2 px-4 border-b">Announcement</th>
                        </tr>
                    </thead>
                    <tbody className=''>
                        <tr className="hover:bg-gray-100">
                            <td className="py-2 px-4 border-b">2023-10-01</td>
                            <td className="py-2 px-4 border-b">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam.</td>
                        </tr>
                        <tr className="hover:bg-gray-100">
                            <td className="py-2 px-4 border-b">2023-09-15</td>
                            <td className="py-2 px-4 border-b">Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed augue semper porta.</td>
                        </tr>
                        <tr className="hover:bg-gray-100">
                            <td className="py-2 px-4 border-b">2023-09-01</td>
                            <td className="py-2 px-4 border-b">Mauris massa. Vestibulum lacinia arcu eget nulla. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
}
