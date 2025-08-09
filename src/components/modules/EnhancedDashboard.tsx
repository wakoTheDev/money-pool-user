"use client";

import React, { useState, Suspense } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTachometerAlt, faUsers, faMoneyBillWave, faHandHoldingUsd,
  faCoins, faCalendarAlt, faChartLine, faCog, faBars,
  faTimes, faHome, faSearch, faBell, faUser, faSignOutAlt
} from '@fortawesome/free-solid-svg-icons';
import { MODULE_REGISTRY, getAvailableModules, MODULE_CATEGORIES } from './ModuleRegistry';
import type { ModuleComponentProps } from '@/types/enhanced-features';

interface EnhancedDashboardProps {
  userId: string;
  userPermissions: string[];
  chamaId: string;
}

const EnhancedDashboard: React.FC<EnhancedDashboardProps> = ({
  userId,
  userPermissions,
  chamaId
}) => {
  const [activeModule, setActiveModule] = useState<string>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Get available modules based on user permissions
  const availableModules = getAvailableModules(userPermissions);

  // Module component props
  const moduleProps: ModuleComponentProps = {
    chamaId,
    memberId: userId,
    permissions: userPermissions,
    onNavigate: (path) => setActiveModule(path),
    onUpdate: (data) => console.log('Module update:', data),
    onError: (error) => console.error('Module error:', error)
  };

  // Render active module
  const renderActiveModule = () => {
    if (activeModule === 'dashboard') {
      return <DashboardOverview />;
    }

    const module = MODULE_REGISTRY[activeModule];
    if (!module) {
      return <div className="p-8 text-center text-gray-500">Module not found</div>;
    }

    const ModuleComponent = module.component;
    return (
      <Suspense fallback={<ModuleLoadingSkeleton />}>
        <ModuleComponent {...moduleProps} />
      </Suspense>
    );
  };

  // Dashboard Overview Component
  const DashboardOverview = () => (
    <div className="p-6 space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Welcome to Enhanced Chama Management</h1>
        <p className="text-blue-100">Comprehensive platform for modern chama operations</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
              <FontAwesomeIcon icon={faUsers} className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Active Members</p>
              <p className="text-2xl font-bold text-gray-900">25</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
              <FontAwesomeIcon icon={faCoins} className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Savings</p>
              <p className="text-2xl font-bold text-gray-900">KES 5.2M</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
              <FontAwesomeIcon icon={faHandHoldingUsd} className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Active Loans</p>
              <p className="text-2xl font-bold text-gray-900">KES 2.1M</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-orange-100 text-orange-600 mr-4">
              <FontAwesomeIcon icon={faCalendarAlt} className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Next Meeting</p>
              <p className="text-2xl font-bold text-gray-900">Aug 15</p>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Modules Grid */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Enhanced Modules</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {availableModules.filter(module => module.id.startsWith('enhanced-')).map((module) => (
            <div
              key={module.id}
              onClick={() => setActiveModule(module.id)}
              className="border border-gray-200 rounded-lg p-6 hover:bg-gray-50 cursor-pointer transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-lg bg-blue-100">
                  <FontAwesomeIcon 
                    icon={
                      module.icon === 'faUsers' ? faUsers :
                      module.icon === 'faMoneyBillWave' ? faMoneyBillWave :
                      module.icon === 'faHandHoldingUsd' ? faHandHoldingUsd :
                      module.icon === 'faCoins' ? faCoins :
                      module.icon === 'faCalendarAlt' ? faCalendarAlt :
                      faTachometerAlt
                    } 
                    className="w-6 h-6 text-blue-600" 
                  />
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  module.status === 'stable' ? 'bg-green-100 text-green-800' :
                  module.status === 'beta' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {module.status}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{module.name}</h3>
              <p className="text-sm text-gray-600 mb-4">{module.description}</p>
              <div className="space-y-1">
                {module.features.slice(0, 3).map((feature, index) => (
                  <div key={index} className="flex items-center text-xs text-gray-500">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></div>
                    {feature}
                  </div>
                ))}
                {module.features.length > 3 && (
                  <p className="text-xs text-gray-400">+{module.features.length - 3} more features</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Module Categories */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Module Categories</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(MODULE_CATEGORIES).map(([key, category]) => {
            const categoryModules = availableModules.filter(m => m.category === key);
            return (
              <div key={key} className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">{category.name}</h3>
                <p className="text-sm text-gray-600 mb-3">{category.description}</p>
                <div className="space-y-1">
                  {categoryModules.map((module) => (
                    <button
                      key={module.id}
                      onClick={() => setActiveModule(module.id)}
                      className="block w-full text-left text-sm text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      {module.name}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  // Loading skeleton for modules
  const ModuleLoadingSkeleton = () => (
    <div className="p-6 space-y-4">
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          <div className="h-4 bg-gray-200 rounded w-4/6"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-white shadow-lg transition-all duration-300 ease-in-out`}>
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          {sidebarOpen && <h1 className="text-xl font-bold text-gray-900">Money Pool</h1>}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-md hover:bg-gray-100"
          >
            <FontAwesomeIcon icon={sidebarOpen ? faTimes : faBars} className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="mt-4">
          <div className="px-2 space-y-1">
            {/* Dashboard */}
            <button
              onClick={() => setActiveModule('dashboard')}
              className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                activeModule === 'dashboard'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <FontAwesomeIcon icon={faHome} className="w-5 h-5 mr-3" />
              {sidebarOpen && 'Dashboard'}
            </button>

            {/* Enhanced Modules */}
            {sidebarOpen && <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Enhanced Modules</div>}
            {availableModules.filter(module => module.id.startsWith('enhanced-')).map((module) => (
              <button
                key={module.id}
                onClick={() => setActiveModule(module.id)}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeModule === module.id
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <FontAwesomeIcon 
                  icon={
                    module.icon === 'faUsers' ? faUsers :
                    module.icon === 'faMoneyBillWave' ? faMoneyBillWave :
                    module.icon === 'faHandHoldingUsd' ? faHandHoldingUsd :
                    module.icon === 'faCoins' ? faCoins :
                    module.icon === 'faCalendarAlt' ? faCalendarAlt :
                    faTachometerAlt
                  } 
                  className="w-5 h-5 mr-3" 
                />
                {sidebarOpen && module.name.replace('Enhanced ', '')}
              </button>
            ))}

            {/* Legacy Modules */}
            {sidebarOpen && <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Legacy Modules</div>}
            {availableModules.filter(module => !module.id.startsWith('enhanced-')).map((module) => (
              <button
                key={module.id}
                onClick={() => setActiveModule(module.id)}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeModule === module.id
                    ? 'bg-gray-100 text-gray-700'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <FontAwesomeIcon 
                  icon={
                    module.icon === 'faUsers' ? faUsers :
                    module.icon === 'faMoneyBillWave' ? faMoneyBillWave :
                    module.icon === 'faHandHoldingUsd' ? faHandHoldingUsd :
                    faTachometerAlt
                  } 
                  className="w-5 h-5 mr-3" 
                />
                {sidebarOpen && module.name}
              </button>
            ))}
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center space-x-4">
              <h2 className="text-lg font-semibold text-gray-900">
                {activeModule === 'dashboard' ? 'Dashboard' : MODULE_REGISTRY[activeModule]?.name || 'Module'}
              </h2>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                />
              </div>
              <button className="p-2 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100">
                <FontAwesomeIcon icon={faBell} className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100">
                <FontAwesomeIcon icon={faUser} className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100">
                <FontAwesomeIcon icon={faCog} className="w-5 h-5" />
              </button>
            </div>
          </div>
        </header>

        {/* Module Content */}
        <main className="flex-1 overflow-auto bg-gray-50">
          {renderActiveModule()}
        </main>
      </div>
    </div>
  );
};

export default EnhancedDashboard;
