import React from 'react'

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white text-center p-4">
      <p>&copy; {new Date().getFullYear()} Scholarship Management System. All rights reserved.</p>
      <p>Privacy Policy | Terms of Use</p>
    </footer>
  )
}