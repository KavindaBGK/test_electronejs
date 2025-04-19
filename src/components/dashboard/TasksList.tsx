import React from 'react';

const TasksList: React.FC = () => {
  const tasks = [
    {
      id: 1,
      title: 'Update dashboard layout',
      priority: 'High priority',
      dueDate: 'today'
    },
    {
      id: 2,
      title: 'Review new analytics features',
      priority: 'Medium priority',
      dueDate: 'tomorrow'
    },
    {
      id: 3,
      title: 'Prepare quarterly report',
      priority: 'Low priority',
      dueDate: 'in 3 days'
    },
    {
      id: 4,
      title: 'Schedule team meeting',
      priority: 'Medium priority',
      dueDate: 'in 2 days'
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-5">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-semibold text-gray-800">Tasks</h3>
          <button className="text-xs text-violet-600 hover:text-violet-700">View All</button>
        </div>
        <div className="space-y-2">
          {tasks.map((task) => (
            <div key={task.id} className="flex items-start">
              <input 
                type="checkbox" 
                className="mt-1 mr-3 h-3.5 w-3.5 rounded border-gray-300 text-violet-600 focus:ring-violet-500" 
              />
              <div>
                <p className="text-xs font-medium text-gray-900">
                  {task.title}
                </p>
                <p className="text-[10px] text-gray-500">
                  {task.priority} · Due {task.dueDate}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TasksList;
