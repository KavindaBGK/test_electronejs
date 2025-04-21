import React from 'react';
import { PerformanceCard, RevenueCard, ActiveUsersCard } from './DashboardCards';
import ActivityFeed from './ActivityFeed';
import TasksList from './TasksList';

const Dashboard: React.FC = () => {
  return (
    <main className="p-6 h-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Performance Card */}
        <PerformanceCard />
        
        {/* Revenue Card */}
        <RevenueCard />
        
        {/* Active Users Card */}
        <ActiveUsersCard />
        
        {/* Recent Activity */}
        <ActivityFeed />
        
        {/* Tasks */}
        <TasksList />
      </div>
    </main>
  );
};

export default Dashboard;
