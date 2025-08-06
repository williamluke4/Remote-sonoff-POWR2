import React from 'react';

export default function SetupPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h1 className="text-3xl font-bold mb-6 text-center">Device Setup Instructions</h1>
        <ol className="space-y-6">
          <li className="flex items-center">
            <div className="bg-blue-500 text-white font-bold rounded-full w-8 h-8 flex items-center justify-center mr-4">1</div>
            <p>Connect to Wi-Fi with the name <strong className="text-blue-500">SOH-XXXXXX</strong></p>
          </li>
          <li className="flex items-center">
            <div className="bg-blue-500 text-white font-bold rounded-full w-8 h-8 flex items-center justify-center mr-4">2</div>
            <p>Navigate to the URL <strong className="text-blue-500">192.168.1.1</strong></p>
          </li>
          <li>
            <div className="flex items-center">
              <div className="bg-blue-500 text-white font-bold rounded-full w-8 h-8 flex items-center justify-center mr-4">3</div>
              <p>Then:</p>
            </div>
            <ol className="mt-4 ml-12 space-y-4">
              <li className="flex items-center">
                <div className="bg-blue-500 text-white font-bold rounded-full w-6 h-6 flex items-center justify-center mr-4">a</div>
                <p>Select Wi-Fi SSID and enter Password</p>
              </li>
              <li className="flex items-center">
                <div className="bg-blue-500 text-white font-bold rounded-full w-6 h-6 flex items-center justify-center mr-4">b</div>
                <p>Enter Name (e.g., Room 112)</p>
              </li>
              <li className="flex items-center">
                <div className="bg-blue-500 text-white font-bold rounded-full w-6 h-6 flex items-center justify-center mr-4">c</div>
                <p>Hit <strong className="text-blue-500">Configure</strong></p>
              </li>
            </ol>
          </li>
        </ol>
      </div>
    </main>
  );
} 