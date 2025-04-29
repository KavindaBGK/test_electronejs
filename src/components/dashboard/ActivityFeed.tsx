import React from 'react';

const ActivityFeed: React.FC = () => {
  const activities = [
    {
      id: 1,
      initial: 'U',
      title: 'User profile updated',
      description: 'Keshara Kavinda updated their profile picture',
      time: '2m ago'
    },
    {
      id: 2,
      initial: 'S',
      title: 'New subscription added',
      description: 'Premium plan - $24.99/mo',
      time: '1h ago'
    },
    {
      id: 3,
      initial: 'P',
      title: 'Payment processed',
      description: 'Invoice #12345 - $24.99',
      time: '3h ago'
    },
    {
      id: 4,
      initial: 'N',
      title: 'New notification settings',
      description: 'Email notifications enabled',
      time: '5h ago'
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden md:col-span-2">
      <div className="p-5">
        <h3 className="text-sm font-semibold text-gray-800 mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-center py-2 border-b border-gray-100 last:border-0">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3 flex-shrink-0">
                {activity.initial}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-900 truncate">
                  {activity.title}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {activity.description}
                </p>
              </div>
              <span className="text-[10px] text-gray-400 flex-shrink-0">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ActivityFeed;
