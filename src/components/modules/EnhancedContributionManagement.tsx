/**
 * Enhanced Contribution Management Module
 * Advanced contribution tracking with payment processing, analytics, and automation
 */

"use client";

import React, { useState, useCallback, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faMoneyBillWave, faPlus, faSearch, faFilter, faFileExport,
  faCalendarAlt, faCreditCard, faUniversity, faMobileAlt,
  faChartLine, faChartPie, faExclamationTriangle, faCheckCircle,
  faClock, faHistory, faBell, faCalculator, faReceipt,
  faDownload, faPrint, faShare, faEdit, faTrash, faEye,
  faUpload, faSpinner, faRefresh, faTimes, faSync
} from '@fortawesome/free-solid-svg-icons';
import { ContributionType, ContributionPayment, ModuleComponentProps } from '@/types/enhanced-features';

const EnhancedContributionManagement: React.FC<ModuleComponentProps> = ({
  chamaId,
  memberId,
  permissions = [],
  onNavigate,
  onUpdate,
  onError
}) => {
  // State Management
  const [activeTab, setActiveTab] = useState<'overview' | 'payments' | 'types' | 'automation' | 'analytics'>('overview');
  const [selectedContributions, setSelectedContributions] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterMethod, setFilterMethod] = useState('all');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // Mock data - replace with actual API calls
  const [contributionTypes] = useState<ContributionType[]>([
    {
      id: '1',
      name: 'Monthly Contribution',
      description: 'Regular monthly savings contribution',
      type: 'regular',
      amount: 5000,
      frequency: 'monthly',
      mandatory: true,
      deadline: '28th of each month',
      penalties: {
        latePaymentFee: 500,
        gracePeriodDays: 3,
        compoundDaily: false
      },
      isActive: true
    },
    {
      id: '2',
      name: 'Emergency Fund',
      description: 'Special contribution for emergency fund',
      type: 'emergency_fund',
      amount: 2000,
      frequency: 'monthly',
      mandatory: true,
      deadline: '15th of each month',
      penalties: {
        latePaymentFee: 200,
        gracePeriodDays: 5,
        compoundDaily: false
      },
      isActive: true
    }
  ]);

  const [payments] = useState<ContributionPayment[]>([
    {
      id: '1',
      memberId: 'member1',
      contributionTypeId: '1',
      amount: 5000,
      paymentMethod: 'mpesa',
      transactionId: 'MPX123456789',
      paymentDate: '2024-08-07',
      dueDate: '2024-08-28',
      status: 'confirmed',
      penalties: 0,
      receiptNumber: 'RCP001',
      processedBy: 'system',
      reconciliationStatus: 'reconciled'
    }
  ]);

  // Payment Processing Component
  const PaymentProcessingTab = () => {
    const [paymentData, setPaymentData] = useState({
      memberId: '',
      contributionTypeId: '',
      amount: '',
      paymentMethod: 'mpesa',
      transactionId: '',
      notes: ''
    });

    return (
      <div className="space-y-6">
        {/* Payment Integration Status */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <FontAwesomeIcon icon={faCreditCard} className="w-5 h-5 mr-2 text-blue-600" />
            Payment Gateway Status
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900">M-Pesa</h4>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  <FontAwesomeIcon icon={faCheckCircle} className="w-3 h-3 mr-1" />
                  Active
                </span>
              </div>
              <p className="text-sm text-gray-600">PayBill: 400200</p>
              <p className="text-sm text-gray-600">Last sync: 2 min ago</p>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900">Bank Transfer</h4>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  <FontAwesomeIcon icon={faCheckCircle} className="w-3 h-3 mr-1" />
                  Active
                </span>
              </div>
              <p className="text-sm text-gray-600">Auto-reconciliation</p>
              <p className="text-sm text-gray-600">Last sync: 5 min ago</p>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900">Cash Payments</h4>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  <FontAwesomeIcon icon={faClock} className="w-3 h-3 mr-1" />
                  Manual
                </span>
              </div>
              <p className="text-sm text-gray-600">Receipt required</p>
              <p className="text-sm text-gray-600">Manual entry</p>
            </div>
          </div>
        </div>

        {/* Quick Payment Entry */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <FontAwesomeIcon icon={faPlus} className="w-5 h-5 mr-2 text-green-600" />
            Quick Payment Entry
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Member</label>
              <select
                value={paymentData.memberId}
                onChange={(e) => setPaymentData(prev => ({ ...prev, memberId: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Member</option>
                <option value="member1">John Doe</option>
                <option value="member2">Jane Smith</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Contribution Type</label>
              <select
                value={paymentData.contributionTypeId}
                onChange={(e) => setPaymentData(prev => ({ ...prev, contributionTypeId: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Type</option>
                {contributionTypes.map((type) => (
                  <option key={type.id} value={type.id}>{type.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Amount (KES)</label>
              <input
                type="number"
                value={paymentData.amount}
                onChange={(e) => setPaymentData(prev => ({ ...prev, amount: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
              <select
                value={paymentData.paymentMethod}
                onChange={(e) => setPaymentData(prev => ({ ...prev, paymentMethod: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="mpesa">M-Pesa</option>
                <option value="bank_transfer">Bank Transfer</option>
                <option value="cash">Cash</option>
                <option value="check">Check</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Transaction ID</label>
              <input
                type="text"
                value={paymentData.transactionId}
                onChange={(e) => setPaymentData(prev => ({ ...prev, transactionId: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., MPX123456789"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={() => {
                  console.log('Processing payment:', paymentData);
                  // Handle payment processing
                }}
                className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                <FontAwesomeIcon icon={faPlus} className="w-4 h-4 mr-2" />
                Record Payment
              </button>
            </div>
          </div>
        </div>

        {/* Bulk Payment Processing */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <FontAwesomeIcon icon={faUpload} className="w-5 h-5 mr-2 text-purple-600" />
            Bulk Payment Processing
          </h3>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <FontAwesomeIcon icon={faUpload} className="w-12 h-12 text-gray-400 mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">Upload Payment File</h4>
            <p className="text-gray-600 mb-4">
              Upload CSV or Excel file with payment data for bulk processing
            </p>
            <div className="flex justify-center space-x-4">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                Choose File
              </button>
              <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200">
                Download Template
              </button>
            </div>
          </div>
        </div>

        {/* Recent Payments */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <FontAwesomeIcon icon={faHistory} className="w-5 h-5 mr-2 text-gray-600" />
              Recent Payments
            </h3>
          </div>
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Member
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Method
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {payments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        John Doe
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        Monthly Contribution
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        KES {payment.amount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {payment.paymentMethod.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          payment.status === 'confirmed' 
                            ? 'bg-green-100 text-green-800'
                            : payment.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {payment.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(payment.paymentDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button className="text-blue-600 hover:text-blue-900">
                            <FontAwesomeIcon icon={faEye} className="w-4 h-4" />
                          </button>
                          <button className="text-green-600 hover:text-green-900">
                            <FontAwesomeIcon icon={faReceipt} className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Contribution Types Management
  const ContributionTypesTab = () => {
    const [showTypeModal, setShowTypeModal] = useState(false);
    const [selectedType, setSelectedType] = useState<ContributionType | null>(null);

    return (
      <div className="space-y-6">
        {/* Header with Add Button */}
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">Contribution Types</h3>
          <button
            onClick={() => setShowTypeModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
          >
            <FontAwesomeIcon icon={faPlus} className="w-4 h-4 mr-2" />
            Add Type
          </button>
        </div>

        {/* Contribution Types Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contributionTypes.map((type) => (
            <div key={type.id} className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-gray-900">{type.name}</h4>
                  <p className="text-sm text-gray-600 mt-1">{type.description}</p>
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  type.isActive 
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {type.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Amount:</span>
                  <span className="text-sm font-medium">KES {type.amount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Frequency:</span>
                  <span className="text-sm font-medium capitalize">{type.frequency}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Mandatory:</span>
                  <span className="text-sm font-medium">{type.mandatory ? 'Yes' : 'No'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Late Fee:</span>
                  <span className="text-sm font-medium">KES {type.penalties.latePaymentFee}</span>
                </div>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => setSelectedType(type)}
                  className="flex-1 px-3 py-2 text-sm bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100"
                >
                  <FontAwesomeIcon icon={faEdit} className="w-4 h-4 mr-1" />
                  Edit
                </button>
                <button className="flex-1 px-3 py-2 text-sm bg-gray-50 text-gray-600 rounded-md hover:bg-gray-100">
                  <FontAwesomeIcon icon={faChartLine} className="w-4 h-4 mr-1" />
                  Analytics
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Add/Edit Type Modal */}
        {(showTypeModal || selectedType) && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">
                  {selectedType ? 'Edit Contribution Type' : 'Add New Contribution Type'}
                </h3>
                <button
                  onClick={() => {
                    setShowTypeModal(false);
                    setSelectedType(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FontAwesomeIcon icon={faTimes} className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-6">
                <form className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                      <input
                        type="text"
                        defaultValue={selectedType?.name || ''}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Type *</label>
                      <select
                        defaultValue={selectedType?.type || 'regular'}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="regular">Regular</option>
                        <option value="special_levy">Special Levy</option>
                        <option value="penalty">Penalty</option>
                        <option value="registration">Registration</option>
                        <option value="share_purchase">Share Purchase</option>
                        <option value="emergency_fund">Emergency Fund</option>
                        <option value="project_specific">Project Specific</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                      rows={3}
                      defaultValue={selectedType?.description || ''}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Amount (KES) *</label>
                      <input
                        type="number"
                        defaultValue={selectedType?.amount || ''}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Frequency *</label>
                      <select
                        defaultValue={selectedType?.frequency || 'monthly'}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                        <option value="quarterly">Quarterly</option>
                        <option value="one_time">One Time</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Late Fee (KES)</label>
                      <input
                        type="number"
                        defaultValue={selectedType?.penalties.latePaymentFee || ''}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        defaultChecked={selectedType?.mandatory ?? true}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700">Mandatory contribution</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        defaultChecked={selectedType?.isActive ?? true}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700">Active</span>
                    </label>
                  </div>

                  <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={() => {
                        setShowTypeModal(false);
                        setSelectedType(null);
                      }}
                      className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      {selectedType ? 'Update' : 'Create'} Type
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Automation & Scheduling
  const AutomationTab = () => {
    return (
      <div className="space-y-6">
        {/* Automated Reminders */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <FontAwesomeIcon icon={faBell} className="w-5 h-5 mr-2 text-yellow-600" />
            Automated Reminders
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Due Date Reminders</h4>
              <p className="text-sm text-gray-600 mb-3">Send reminders before contribution due dates</p>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input type="checkbox" defaultChecked className="mr-2" />
                  <span className="text-sm">7 days before due date</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" defaultChecked className="mr-2" />
                  <span className="text-sm">3 days before due date</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" defaultChecked className="mr-2" />
                  <span className="text-sm">1 day before due date</span>
                </label>
              </div>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Overdue Notifications</h4>
              <p className="text-sm text-gray-600 mb-3">Send notifications for overdue contributions</p>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input type="checkbox" defaultChecked className="mr-2" />
                  <span className="text-sm">Day of due date</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" defaultChecked className="mr-2" />
                  <span className="text-sm">3 days after due date</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" defaultChecked className="mr-2" />
                  <span className="text-sm">Weekly after 1 week overdue</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Reconciliation */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <FontAwesomeIcon icon={faSync} className="w-5 h-5 mr-2 text-blue-600" />
            Automatic Reconciliation
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border border-gray-200 rounded-lg">
              <FontAwesomeIcon icon={faMobileAlt} className="w-8 h-8 text-green-600 mb-2" />
              <h4 className="font-medium text-gray-900">M-Pesa Integration</h4>
              <p className="text-sm text-gray-600 mt-1">Auto-match M-Pesa transactions</p>
              <button className="mt-2 text-sm text-blue-600 hover:text-blue-800">Configure</button>
            </div>
            <div className="text-center p-4 border border-gray-200 rounded-lg">
              <FontAwesomeIcon icon={faUniversity} className="w-8 h-8 text-blue-600 mb-2" />
              <h4 className="font-medium text-gray-900">Bank Integration</h4>
              <p className="text-sm text-gray-600 mt-1">Auto-reconcile bank transfers</p>
              <button className="mt-2 text-sm text-blue-600 hover:text-blue-800">Configure</button>
            </div>
            <div className="text-center p-4 border border-gray-200 rounded-lg">
              <FontAwesomeIcon icon={faCalculator} className="w-8 h-8 text-purple-600 mb-2" />
              <h4 className="font-medium text-gray-900">Penalty Calculation</h4>
              <p className="text-sm text-gray-600 mt-1">Auto-calculate late fees</p>
              <button className="mt-2 text-sm text-blue-600 hover:text-blue-800">Configure</button>
            </div>
          </div>
        </div>

        {/* Scheduler Status */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <FontAwesomeIcon icon={faCalendarAlt} className="w-5 h-5 mr-2 text-purple-600" />
            Scheduled Tasks
          </h3>
          <div className="space-y-3">
            {[
              { task: 'Monthly Contribution Reminders', nextRun: 'Aug 25, 2024 09:00', status: 'active' },
              { task: 'Weekly Payment Reconciliation', nextRun: 'Aug 9, 2024 06:00', status: 'active' },
              { task: 'Penalty Calculation', nextRun: 'Aug 8, 2024 23:59', status: 'active' },
              { task: 'Member Statement Generation', nextRun: 'Aug 31, 2024 18:00', status: 'active' }
            ].map((task, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">{task.task}</h4>
                  <p className="text-sm text-gray-600">Next run: {task.nextRun}</p>
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  task.status === 'active' 
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {task.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Analytics & Reporting
  const AnalyticsTab = () => {
    return (
      <div className="space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
                <FontAwesomeIcon icon={faMoneyBillWave} className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Collected</p>
                <p className="text-2xl font-bold text-gray-900">KES 2.5M</p>
                <p className="text-xs text-green-600">+15% from last month</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
                <FontAwesomeIcon icon={faChartLine} className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Collection Rate</p>
                <p className="text-2xl font-bold text-gray-900">92%</p>
                <p className="text-xs text-green-600">+3% improvement</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4">
                <FontAwesomeIcon icon={faExclamationTriangle} className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Overdue Amount</p>
                <p className="text-2xl font-bold text-gray-900">KES 125K</p>
                <p className="text-xs text-red-600">5 members</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
                <FontAwesomeIcon icon={faChartPie} className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Avg per Member</p>
                <p className="text-2xl font-bold text-gray-900">KES 8.5K</p>
                <p className="text-xs text-blue-600">Monthly</p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Collection Trends</h3>
            <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">Line Chart - Monthly Collection Trends</p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Methods</h3>
            <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">Pie Chart - Payment Method Distribution</p>
            </div>
          </div>
        </div>

        {/* Contribution Performance */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Member Contribution Performance</h3>
          <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">Bar Chart - Member Performance Comparison</p>
          </div>
        </div>
      </div>
    );
  };

  // Main Tab Navigation
  const tabs = [
    { id: 'overview', label: 'Overview', icon: faMoneyBillWave },
    { id: 'payments', label: 'Payment Processing', icon: faCreditCard },
    { id: 'types', label: 'Contribution Types', icon: faCalculator },
    { id: 'automation', label: 'Automation', icon: faBell },
    { id: 'analytics', label: 'Analytics', icon: faChartLine }
  ];

  return (
    <div className="h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <FontAwesomeIcon icon={faMoneyBillWave} className="w-8 h-8 mr-3 text-green-600" />
              Enhanced Contribution Management
            </h1>
            <p className="text-gray-600 mt-1">Advanced contribution tracking with automated processing</p>
          </div>
          <div className="flex space-x-3">
            <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center">
              <FontAwesomeIcon icon={faPlus} className="w-4 h-4 mr-2" />
              Record Payment
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center">
              <FontAwesomeIcon icon={faFileExport} className="w-4 h-4 mr-2" />
              Export Report
            </button>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border-b border-gray-200">
        <nav className="px-6">
          <div className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <FontAwesomeIcon icon={tab.icon} className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-auto p-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
                    <FontAwesomeIcon icon={faMoneyBillWave} className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">This Month</p>
                    <p className="text-2xl font-bold text-gray-900">KES 250K</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
                    <FontAwesomeIcon icon={faCheckCircle} className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Paid Members</p>
                    <p className="text-2xl font-bold text-gray-900">28/30</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4">
                    <FontAwesomeIcon icon={faClock} className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Pending</p>
                    <p className="text-2xl font-bold text-gray-900">KES 15K</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-red-100 text-red-600 mr-4">
                    <FontAwesomeIcon icon={faExclamationTriangle} className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Overdue</p>
                    <p className="text-2xl font-bold text-gray-900">KES 5K</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Payment Activity</h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="p-2 bg-green-100 rounded-full">
                    <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Payment Received</p>
                    <p className="text-xs text-gray-600">John Doe paid KES 5,000 via M-Pesa • 2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="p-2 bg-blue-100 rounded-full">
                    <FontAwesomeIcon icon={faSync} className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Auto-reconciliation completed</p>
                    <p className="text-xs text-gray-600">15 M-Pesa transactions processed • 5 hours ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'payments' && <PaymentProcessingTab />}
        {activeTab === 'types' && <ContributionTypesTab />}
        {activeTab === 'automation' && <AutomationTab />}
        {activeTab === 'analytics' && <AnalyticsTab />}
      </div>
    </div>
  );
};

export default EnhancedContributionManagement;
