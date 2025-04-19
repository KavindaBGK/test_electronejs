import { useState } from 'react'

// Icons as components for a more professional look
const DashboardIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5z" fill="currentColor" opacity="0.4"/>
    <path d="M14 5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1V5z" fill="currentColor"/>
    <path d="M4 14a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-5z" fill="currentColor"/>
    <path d="M14 11a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1v-8z" fill="currentColor" opacity="0.4"/>
  </svg>
)

const AnalyticsIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 12a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1v-8z" fill="currentColor"/>
    <path d="M4 4a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V4z" fill="currentColor" opacity="0.4"/>
    <path d="M16 9a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1V9z" fill="currentColor" opacity="0.7"/>
    <path d="M4 9a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9z" fill="currentColor" opacity="0.4"/>
  </svg>
)

const ReportsIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2v-2M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const SettingsIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const NotificationIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const SearchIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
  </svg>
)

// const UserIcon = () => (
//   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
//   </svg>
// )

function App() {
  const [activeItem, setActiveItem] = useState('Dashboard')
  
  // Navigation items with icons
  const navItems = [
    { name: 'Dashboard', icon: <DashboardIcon /> },
    { name: 'Analytics', icon: <AnalyticsIcon /> },
    { name: 'Reports', icon: <ReportsIcon /> },
    { name: 'Settings', icon: <SettingsIcon /> }
  ]

  return (
    <div className="flex h-screen w-full bg-gray-100 font-sans text-sm overflow-hidden">
      {/* Left Sidebar - Collapsed by default */}
      <div className="w-16 bg-gray-900 flex flex-col items-center py-4 flex-shrink-0">
        <div className="w-8 h-8 bg-violet-600 rounded-lg mb-6 flex items-center justify-center">
          <span className="text-white text-xs font-bold">A</span>
        </div>
        
        {navItems.map((item) => (
          <button
            key={item.name}
            onClick={() => setActiveItem(item.name)}
            className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${activeItem === item.name 
              ? 'bg-violet-600 text-white' 
              : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'}`}
          >
            {item.icon}
          </button>
        ))}
        
        <div className="mt-auto">
          <button className="w-10 h-10 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-800 hover:text-gray-200">
            <SettingsIcon />
          </button>
        </div>
      </div>
      
      {/* Main Content Area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top Navigation */}
        <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 flex-shrink-0">
          <div className="flex items-center space-x-3">
            <h1 className="text-lg font-medium text-gray-800">{activeItem}</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon />
              </div>
              <input 
                type="text" 
                placeholder="Search..." 
                className="bg-gray-50 border border-gray-300 text-gray-700 text-xs rounded-lg pl-9 pr-4 py-2 focus:outline-none focus:ring-1 focus:ring-violet-500 focus:border-violet-500 w-56"
              />
            </div>
            
            {/* Notifications */}
            <button className="relative p-1.5 rounded-lg hover:bg-gray-100 text-gray-500">
              <NotificationIcon />
              <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500"></span>
            </button>
            
            {/* User */}
            <div className="flex items-center space-x-2 cursor-pointer">
              <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center text-violet-600 text-xs font-medium">JD</div>
              <span className="text-xs text-gray-700">John Doe</span>
            </div>
          </div>
        </header>
        
        {/* Secondary Navigation */}
        <div className="bg-white border-b border-gray-200 px-4 py-2.5 flex items-center space-x-1 flex-shrink-0">
          {navItems.map((item) => (
            <button
              key={item.name}
              onClick={() => setActiveItem(item.name)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium flex items-center ${activeItem === item.name 
                ? 'bg-violet-50 text-violet-700' 
                : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <span className="mr-1.5">{item.icon}</span>
              {item.name}
            </button>
          ))}
        </div>
        
        {/* Main Content */}
        <main className="flex-1 overflow-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Card 1 */}
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
            
            {/* Card 2 */}
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
            
            {/* Card 3 */}
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
            
            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden md:col-span-2">
              <div className="p-5">
                <h3 className="text-sm font-semibold text-gray-800 mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex items-center py-2 border-b border-gray-100 last:border-0">
                      <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center text-violet-600 mr-3 flex-shrink-0">
                        {['U', 'S', 'P', 'N'][i]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-gray-900 truncate">
                          {['User profile updated', 'New subscription added', 'Payment processed', 'New notification settings'][i]}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {['John Doe updated their profile picture', 'Premium plan - $24.99/mo', 'Invoice #12345 - $24.99', 'Email notifications enabled'][i]}
                        </p>
                      </div>
                      <span className="text-[10px] text-gray-400 flex-shrink-0">{['2m ago', '1h ago', '3h ago', '5h ago'][i]}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Tasks */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-5">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm font-semibold text-gray-800">Tasks</h3>
                  <button className="text-xs text-violet-600 hover:text-violet-700">View All</button>
                </div>
                <div className="space-y-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex items-start">
                      <input type="checkbox" className="mt-1 mr-3 h-3.5 w-3.5 rounded border-gray-300 text-violet-600 focus:ring-violet-500" />
                      <div>
                        <p className="text-xs font-medium text-gray-900">
                          {['Update dashboard layout', 'Review new analytics features', 'Prepare quarterly report', 'Schedule team meeting'][i]}
                        </p>
                        <p className="text-[10px] text-gray-500">
                          {['High priority', 'Medium priority', 'Low priority', 'Medium priority'][i]} · Due {['today', 'tomorrow', 'in 3 days', 'in 2 days'][i]}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default App
