import React from 'react';

// Performance Card Component
export const PerformanceCard: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-5">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-semibold text-gray-800">Performance</h3>
          <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">+12.5%</span>
        </div>
        <div className="flex items-end space-x-2">
          <span className="text-2xl font-bold text-gray-800">89.2%</span>
          <span className="text-xs text-gray-500">vs 76.7% last week</span>
        </div>
        <div className="mt-4 h-2 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-violet-500 rounded-full" style={{width: '89.2%'}}></div>
        </div>
      </div>
    </div>
  );
};

// Revenue Card Component
export const RevenueCard: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-5">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-semibold text-gray-800">Revenue</h3>
          <span className="text-xs text-red-600 bg-red-50 px-2 py-0.5 rounded-full">-3.2%</span>
        </div>
        <div className="flex items-end space-x-2">
          <span className="text-2xl font-bold text-gray-800">$24,581</span>
          <span className="text-xs text-gray-500">vs $25,392 last month</span>
        </div>
        <div className="mt-4 grid grid-cols-7 gap-1">
          <div className="h-8 bg-violet-200 rounded-sm"></div>
          <div className="h-12 bg-violet-300 rounded-sm"></div>
          <div className="h-10 bg-violet-400 rounded-sm"></div>
          <div className="h-16 bg-violet-500 rounded-sm"></div>
          <div className="h-14 bg-violet-400 rounded-sm"></div>
          <div className="h-10 bg-violet-300 rounded-sm"></div>
          <div className="h-6 bg-violet-200 rounded-sm"></div>
        </div>
      </div>
    </div>
  );
};

// Active Users Card Component
export const ActiveUsersCard: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-5">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-semibold text-gray-800">Active Users</h3>
          <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">+8.1%</span>
        </div>
        <div className="flex items-end space-x-2">
          <span className="text-2xl font-bold text-gray-800">2,845</span>
          <span className="text-xs text-gray-500">vs 2,631 last week</span>
        </div>
        <div className="mt-4 flex -space-x-2">
          {[...Array(6)].map((_, i) => (
            <div key={i} className={`w-7 h-7 rounded-full border-2 border-white flex-shrink-0 bg-${['violet', 'indigo', 'blue', 'green', 'yellow', 'red'][i]}-${i % 2 ? '400' : '500'}`}></div>
          ))}
          <div className="w-7 h-7 rounded-full border-2 border-white flex-shrink-0 bg-gray-200 flex items-center justify-center">
            <span className="text-[10px] text-gray-600 font-medium">+18</span>
          </div>
        </div>
      </div>
    </div>
  );
};
