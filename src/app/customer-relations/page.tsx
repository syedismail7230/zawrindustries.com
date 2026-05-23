import React from 'react';

export const metadata = {
  title: 'Customer Relations | Zawr Industries',
  description: 'Welcome to Zawr Industries Customer Relations.',
};

export default function CustomerRelationsPage() {
  return (
    <div className="min-h-screen bg-white pt-32 pb-20 px-6 font-sans">
      <div className="max-w-4xl mx-auto">
        
        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-extrabold text-center text-black mb-10 tracking-tight">
          Welcome back, mate!!!
        </h1>

        {/* Hero Section */}
        <div className="flex flex-col md:flex-row bg-black rounded-[2.5rem] overflow-hidden mb-6 shadow-2xl">
          
          {/* Left Form */}
          <div className="w-full md:w-1/2 p-10 md:p-12 lg:p-16 flex flex-col justify-center">
            <div className="space-y-6 max-w-sm w-full mx-auto md:mx-0">
              <input 
                type="text" 
                placeholder="Enter your client ID" 
                className="w-full bg-[#1c1c1e] text-white border border-[#2c2c2e] rounded-xl px-5 py-4 outline-none focus:border-gray-500 transition-colors text-sm placeholder-gray-500"
              />
              
              <div className="relative">
                <select 
                  defaultValue=""
                  className="w-full bg-[#1c1c1e] text-white border border-[#2c2c2e] rounded-xl px-5 py-4 outline-none focus:border-gray-500 transition-colors appearance-none cursor-pointer text-sm"
                >
                  <option value="" disabled className="text-gray-500">Select priority</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                </div>
              </div>

              <div className="pt-2">
                <button className="bg-white text-black font-semibold rounded-full px-8 py-3.5 hover:bg-gray-200 transition-colors text-sm">
                  Request call back
                </button>
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="w-full md:w-1/2 relative min-h-[350px] md:min-h-[450px]">
            {/* The image will be pulled from public/assets/customer-hero.png */}
            <img 
              src="/assets/customer-hero.png" 
              alt="Customer Relations" 
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Bottom Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1 */}
          <div className="bg-black rounded-[2.5rem] p-8 aspect-square flex flex-col justify-between group cursor-pointer hover:bg-[#111111] transition-colors shadow-xl">
            <div className="flex justify-end">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform">
                <line x1="7" y1="17" x2="17" y2="7"></line>
                <polyline points="7 7 17 7 17 17"></polyline>
              </svg>
            </div>
            <h3 className="text-white text-xl font-bold tracking-tight">New Request</h3>
          </div>

          {/* Card 2 */}
          <div className="bg-black rounded-[2.5rem] p-8 aspect-square flex flex-col justify-between group cursor-pointer hover:bg-[#111111] transition-colors shadow-xl">
            <div className="flex justify-end">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform">
                <line x1="7" y1="17" x2="17" y2="7"></line>
                <polyline points="7 7 17 7 17 17"></polyline>
              </svg>
            </div>
            <h3 className="text-white text-xl font-bold tracking-tight">Grievance</h3>
          </div>

          {/* Card 3 */}
          <div className="bg-black rounded-[2.5rem] p-8 aspect-square flex flex-col justify-between group cursor-pointer hover:bg-[#111111] transition-colors shadow-xl">
            <div className="flex justify-end">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform">
                <line x1="7" y1="17" x2="17" y2="7"></line>
                <polyline points="7 7 17 7 17 17"></polyline>
              </svg>
            </div>
            <h3 className="text-white text-xl font-bold tracking-tight">Report Fraud</h3>
          </div>

        </div>

      </div>
    </div>
  );
}
