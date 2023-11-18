'use client'
import React, { useState } from "react";

export default function HomePage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex flex-col bg-white min-h-screen">
      {/* Main Content */}
      <div className="flex-grow">
        {/* Navbar */}
        <nav className="bg-gray-800 text-white shadow-lg">
          <div className="container mx-auto px-6 py-3 md:flex md:justify-between md:items-center">
            <div className="flex justify-between items-center">
              <div>
                <a className="text-white text-xl font-bold md:text-2xl hover:text-green-500" href="#">DataAnalysis</a>
              </div>
              <div className="md:hidden">
                <button
                  type="button"
                  className="text-gray-200 hover:text-green-500 focus:outline-none focus:text-green-500"
                  aria-label="toggle menu"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                  <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current">
                    <path fillRule="evenodd" d="M4 5h16v2H4V5zm0 6h16v2H4v-2zm0 6h16v2H4v-2z"></path>
                  </svg>
                </button>
              </div>
            </div>
            <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} md:flex items-center`}>
              <div className="flex flex-col md:flex-row md:mx-6">
                <a className="my-1 text-sm text-gray-200 hover:text-green-500 md:mx-4 md:my-0" href="#">Home</a>
                <a className="my-1 text-sm text-gray-200 hover:text-green-500 md:mx-4 md:my-0" href="#">Services</a>
                <a className="my-1 text-sm text-gray-200 hover:text-green-500 md:mx-4 md:my-0" href="#">About</a>
                <a className="my-1 text-sm text-gray-200 hover:text-green-500 md:mx-4 md:my-0" href="#">Contact</a>
              </div>
              <div className="flex items-center md:ml-6">
                <button className="text-gray-200 hover:bg-green-600 bg-gray-700 px-3 py-2 rounded-md text-sm font-medium mr-4">Login</button>
                <button className="text-gray-200 hover:bg-green-600 bg-gray-700 px-3 py-2 rounded-md text-sm font-medium">Register</button>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="bg-white">
          <div className="container mx-auto px-6 py-16 text-center">
            <h2 className="text-4xl font-bold text-gray-800 mb-2">Data Analysis Solutions</h2>
            <h3 className="text-2xl mb-8 text-gray-600">Insights to drive your business forward</h3>
            <button className="bg-gray-800 hover:bg-green-600 text-white px-4 py-2 rounded">Get Started</button>
          </div>
        </div>

        {/* Features Section */}
        <div className="container mx-auto px-6 py-20">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-8">Features</h2>
          <div className="flex flex-wrap">
            <div className="w-full sm:w-1/2 lg:w-1/3 px-2 mb-4">
              <div className="bg-white rounded shadow py-2">
                <h3 className="text-xl text-gray-800 font-semibold mb-2">Feature One</h3>
                <p className="text-gray-600 text-sm">Description of feature one.</p>
              </div>
            </div>
            <div className="w-full sm:w-1/2 lg:w-1/3 px-2 mb-4">
              <div className="bg-white rounded shadow py-2">
                <h3 className="text-xl text-gray-800 font-semibold mb-2">Feature Two</h3>
                <p className="text-gray-600 text-sm">Description of feature two.</p>
              </div>
            </div>
            <div className="w-full sm:w-1/2 lg:w-1/3 px-2 mb-4">
              <div className="bg-white rounded shadow py-2">
                <h3 className="text-xl text-gray-800 font-semibold mb-2">Feature Three</h3>
                <p className="text-gray-600 text-sm">Description of feature three.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white">
        <div className="container mx-auto px-6 py-4">
          <div className="flex flex-col items-center">
            <div className="py-6">
              <p className="text-gray-400 text-sm text-center">© 2023 DataAnalysis. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
