/**
 * Enhanced Module Demo Component
 * Demonstrates all enhanced modules with sample data
 */

"use client";

import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faRocket, faPlay, faCode, faChartLine, 
  faUsers, faHandHoldingUsd, faCoins, faCalendarAlt,
  faMoneyBillWave, faBullseye, faFeatherAlt, faLightbulb
} from '@fortawesome/free-solid-svg-icons';
import EnhancedDashboard from './modules/EnhancedDashboard';

const EnhancedModuleDemo: React.FC = () => {
  const [showDemo, setShowDemo] = useState(false);

  if (showDemo) {
    return (
      <EnhancedDashboard 
        userId="demo-user"
        userPermissions={[
          'members.view', 'members.create', 'members.edit', 'members.kyc', 'members.analytics',
          'contributions.view', 'contributions.create', 'contributions.edit', 'contributions.process', 'contributions.analytics',
          'loans.view', 'loans.apply', 'loans.approve', 'loans.disburse', 'loans.collect', 'loans.analytics',
          'finance.view', 'finance.create', 'finance.edit', 'finance.budget', 'finance.reports',
          'meetings.view', 'meetings.create', 'meetings.edit', 'meetings.attend', 'meetings.vote'
        ]}
        chamaId="demo-chama"
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mr-4">
                <FontAwesomeIcon icon={faRocket} className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Enhanced Chama Management Platform
              </h1>
            </div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Next-generation modular platform with AI-powered insights, automated workflows, and comprehensive financial management
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Demo Launch Section */}
        <div className="text-center mb-16">
          <button
            onClick={() => setShowDemo(true)}
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            <FontAwesomeIcon icon={faPlay} className="w-6 h-6 mr-3" />
            Launch Enhanced Dashboard Demo
          </button>
          <p className="text-gray-600 mt-4">Experience the comprehensive platform with all enhanced modules</p>
        </div>

        {/* Platform Features */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-blue-100 rounded-lg mr-4">
                <FontAwesomeIcon icon={faFeatherAlt} className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Modular Architecture</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Built with a modular, scalable architecture that allows easy customization and extension of features.
            </p>
            <ul className="space-y-2 text-sm text-gray-500">
              <li>• Lazy-loaded components for optimal performance</li>
              <li>• TypeScript for type safety and better DX</li>
              <li>• Comprehensive permission system</li>
              <li>• Responsive and mobile-first design</li>
            </ul>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-green-100 rounded-lg mr-4">
                <FontAwesomeIcon icon={faLightbulb} className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">AI-Powered Insights</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Intelligent analytics and automated decision-making to optimize chama operations.
            </p>
            <ul className="space-y-2 text-sm text-gray-500">
              <li>• Predictive contribution analytics</li>
              <li>• AI-powered credit scoring</li>
              <li>• Automated risk assessment</li>
              <li>• Smart recommendation engine</li>
            </ul>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-purple-100 rounded-lg mr-4">
                <FontAwesomeIcon icon={faBullseye} className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Performance Optimized</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Engineered for speed, scalability, and reliability with modern web technologies.
            </p>
            <ul className="space-y-2 text-sm text-gray-500">
              <li>• Optimized bundle splitting</li>
              <li>• Efficient state management</li>
              <li>• Real-time data synchronization</li>
              <li>• Progressive Web App features</li>
            </ul>
          </div>
        </div>

        {/* Enhanced Modules Overview */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Enhanced Modules</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Enhanced Member Management */}
            <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <div className="p-3 bg-blue-100 rounded-lg mr-4">
                  <FontAwesomeIcon icon={faUsers} className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Enhanced Member Management</h3>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    Beta
                  </span>
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                Next-generation member lifecycle management with advanced KYC, performance analytics, and communication hub.
              </p>
              <ul className="space-y-1 text-xs text-gray-500">
                <li>• Advanced Registration Workflow</li>
                <li>• Digital KYC & Identity Verification</li>
                <li>• AI-Powered Member Insights</li>
                <li>• Automated Role Management</li>
                <li>• Integrated Communication Hub</li>
              </ul>
            </div>

            {/* Enhanced Contribution Management */}
            <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <div className="p-3 bg-green-100 rounded-lg mr-4">
                  <FontAwesomeIcon icon={faMoneyBillWave} className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Enhanced Contribution Management</h3>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    Beta
                  </span>
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                Advanced contribution tracking with intelligent payment processing and predictive analytics.
              </p>
              <ul className="space-y-1 text-xs text-gray-500">
                <li>• Intelligent Payment Processing</li>
                <li>• Predictive Analytics</li>
                <li>• Automated Reconciliation</li>
                <li>• Payment Gateway Integration</li>
                <li>• Smart Scheduling & Reminders</li>
              </ul>
            </div>

            {/* Enhanced Loan Management */}
            <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <div className="p-3 bg-purple-100 rounded-lg mr-4">
                  <FontAwesomeIcon icon={faHandHoldingUsd} className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Enhanced Loan Management</h3>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    Beta
                  </span>
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                Comprehensive loan lifecycle management with AI-powered risk assessment and automated workflows.
              </p>
              <ul className="space-y-1 text-xs text-gray-500">
                <li>• AI-Powered Credit Scoring</li>
                <li>• Intelligent Approval Workflows</li>
                <li>• Advanced Risk Assessment</li>
                <li>• Automated Collection Tools</li>
                <li>• Loan Portfolio Analytics</li>
              </ul>
            </div>

            {/* Enhanced Financial Management */}
            <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <div className="p-3 bg-orange-100 rounded-lg mr-4">
                  <FontAwesomeIcon icon={faCoins} className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Enhanced Financial Management</h3>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    Beta
                  </span>
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                Comprehensive financial tracking, budgeting, and investment management with real-time analytics.
              </p>
              <ul className="space-y-1 text-xs text-gray-500">
                <li>• Multi-Account Financial Tracking</li>
                <li>• Advanced Budgeting & Forecasting</li>
                <li>• Investment Portfolio Management</li>
                <li>• Automated Bank Reconciliation</li>
                <li>• Financial Goal Tracking</li>
              </ul>
            </div>

            {/* Enhanced Meeting Management */}
            <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <div className="p-3 bg-indigo-100 rounded-lg mr-4">
                  <FontAwesomeIcon icon={faCalendarAlt} className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Enhanced Meeting Management</h3>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    Beta
                  </span>
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                Complete meeting lifecycle management with governance tools and virtual meeting support.
              </p>
              <ul className="space-y-1 text-xs text-gray-500">
                <li>• Smart Meeting Scheduling</li>
                <li>• Hybrid Meeting Support</li>
                <li>• Electronic Voting & Governance</li>
                <li>• Automated Meeting Minutes</li>
                <li>• Real-time Attendance Tracking</li>
              </ul>
            </div>

            {/* Coming Soon Module */}
            <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow opacity-75">
              <div className="flex items-center mb-4">
                <div className="p-3 bg-gray-100 rounded-lg mr-4">
                  <FontAwesomeIcon icon={faChartLine} className="w-6 h-6 text-gray-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Enhanced Analytics</h3>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    Coming Soon
                  </span>
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                Advanced business intelligence and predictive analytics for data-driven decision making.
              </p>
              <ul className="space-y-1 text-xs text-gray-500">
                <li>• Predictive Analytics Dashboard</li>
                <li>• Custom Report Builder</li>
                <li>• Financial Forecasting</li>
                <li>• Member Behavior Analysis</li>
                <li>• Performance Benchmarking</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Technical Features */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Technical Excellence</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="p-3 bg-blue-500 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                <FontAwesomeIcon icon={faCode} className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">TypeScript</h3>
              <p className="text-sm text-gray-600">Type-safe development with comprehensive type definitions</p>
            </div>
            <div className="text-center">
              <div className="p-3 bg-green-500 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                <FontAwesomeIcon icon={faRocket} className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Next.js 15</h3>
              <p className="text-sm text-gray-600">Latest React framework with server components</p>
            </div>
            <div className="text-center">
              <div className="p-3 bg-purple-500 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                <FontAwesomeIcon icon={faFeatherAlt} className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Tailwind CSS</h3>
              <p className="text-sm text-gray-600">Utility-first CSS for rapid UI development</p>
            </div>
            <div className="text-center">
              <div className="p-3 bg-orange-500 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                <FontAwesomeIcon icon={faChartLine} className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Performance</h3>
              <p className="text-sm text-gray-600">Optimized for speed and scalability</p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <button
            onClick={() => setShowDemo(true)}
            className="inline-flex items-center px-12 py-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg rounded-xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
          >
            <FontAwesomeIcon icon={faPlay} className="w-8 h-8 mr-4" />
            Experience the Future of Chama Management
          </button>
          <p className="text-gray-600 mt-6 max-w-2xl mx-auto">
            Discover how our enhanced platform can revolutionize your chama operations with intelligent automation, 
            comprehensive analytics, and seamless user experience.
          </p>
        </div>
      </div>
    </div>
  );
};

export default EnhancedModuleDemo;
