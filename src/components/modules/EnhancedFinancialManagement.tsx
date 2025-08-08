/**
 * Enhanced Financial Management Module
 * Comprehensive financial tracking, budgeting, and reporting system
 */

"use client";

import React, { useState, useCallback, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCoins, faPlus, faSearch, faFilter, faFileExport,
  faChartLine, faUser, faCalendarAlt, faWallet, faMoneyBillWave,
  faArrowUp, faArrowDown, faPiggyBank, faCalculator, faReceipt,
  faExchangeAlt, faCreditCard, faUniversity, faPercentage, faShieldAlt,
  faChartPie, faChartBar, faCaretUp, faCaretDown, faEdit,
  faTrash, faEye, faDownload, faPrint, faShare, faUpload,
  faSpinner, faTimes, faCheck, faHistory, faBell, faFileInvoice,
  faFileContract, faHandHoldingUsd, faClock, faGlobe
} from '@fortawesome/free-solid-svg-icons';
import { FinancialTransaction, BudgetCategory, ModuleComponentProps } from '@/types/enhanced-features';

const EnhancedFinancialManagement: React.FC<ModuleComponentProps> = ({
  chamaId,
  memberId,
  permissions = [],
  onNavigate,
  onUpdate,
  onError
}) => {
  // State Management
  const [activeTab, setActiveTab] = useState<'overview' | 'transactions' | 'budgets' | 'reports' | 'reconciliation' | 'investment'>('overview');
  const [selectedTransactions, setSelectedTransactions] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<FinancialTransaction | null>(null);
  const [loading, setLoading] = useState(false);

  // Mock data - replace with actual API calls
  const [transactions] = useState<FinancialTransaction[]>([
    {
      id: '1',
      type: 'income',
      category: 'contributions',
      amount: 50000,
      description: 'Monthly member contributions',
      date: '2024-08-05',
      memberId: 'system',
      reference: 'CONT-001',
      status: 'completed',
      paymentMethod: 'bank_transfer',
      accountId: 'acc_001',
      tags: ['recurring', 'member-fees'],
      attachments: []
    },
    {
      id: '2',
      type: 'expense',
      category: 'administrative',
      amount: 15000,
      description: 'Meeting venue and refreshments',
      date: '2024-08-03',
      memberId: 'admin1',
      reference: 'EXP-001',
      status: 'completed',
      paymentMethod: 'cash',
      accountId: 'acc_002',
      tags: ['meetings', 'venue'],
      attachments: []
    },
    {
      id: '3',
      type: 'investment',
      category: 'fixed_deposit',
      amount: 100000,
      description: 'Fixed deposit with ABC Bank',
      date: '2024-08-01',
      memberId: 'treasurer',
      reference: 'INV-001',
      status: 'pending',
      paymentMethod: 'bank_transfer',
      accountId: 'acc_001',
      tags: ['investment', 'fd'],
      attachments: []
    }
  ]);

  const [budgetCategories] = useState<BudgetCategory[]>([
    {
      id: '1',
      name: 'Administrative Expenses',
      allocated: 50000,
      spent: 35000,
      remaining: 15000,
      period: '2024-08',
      type: 'expense',
      description: 'General administrative costs'
    },
    {
      id: '2',
      name: 'Meeting Costs',
      allocated: 30000,
      spent: 15000,
      remaining: 15000,
      period: '2024-08',
      type: 'expense',
      description: 'Meeting venue and refreshments'
    },
    {
      id: '3',
      name: 'Investment Fund',
      allocated: 200000,
      spent: 100000,
      remaining: 100000,
      period: '2024-08',
      type: 'investment',
      description: 'Investment opportunities'
    }
  ]);

  // Financial Overview Tab
  const OverviewTab = () => {
    const [timeframe, setTimeframe] = useState('month');

    return (
      <div className="space-y-6">
        {/* Financial Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-gradient-to-r from-green-400 to-green-600 p-6 rounded-lg text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100">Total Assets</p>
                <p className="text-3xl font-bold">KES 5.2M</p>
                <p className="text-green-200 text-sm">+12% this month</p>
              </div>
              <FontAwesomeIcon icon={faPiggyBank} className="w-12 h-12 text-green-200" />
            </div>
          </div>
          <div className="bg-gradient-to-r from-blue-400 to-blue-600 p-6 rounded-lg text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100">Monthly Income</p>
                <p className="text-3xl font-bold">KES 450K</p>
                <p className="text-blue-200 text-sm">+8% from last month</p>
              </div>
              <FontAwesomeIcon icon={faArrowUp} className="w-12 h-12 text-blue-200" />
            </div>
          </div>
          <div className="bg-gradient-to-r from-orange-400 to-orange-600 p-6 rounded-lg text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100">Monthly Expenses</p>
                <p className="text-3xl font-bold">KES 120K</p>
                <p className="text-orange-200 text-sm">-5% from last month</p>
              </div>
              <FontAwesomeIcon icon={faArrowDown} className="w-12 h-12 text-orange-200" />
            </div>
          </div>
          <div className="bg-gradient-to-r from-purple-400 to-purple-600 p-6 rounded-lg text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100">Net Worth</p>
                <p className="text-3xl font-bold">KES 4.8M</p>
                <p className="text-purple-200 text-sm">+15% this year</p>
              </div>
              <FontAwesomeIcon icon={faCaretUp} className="w-12 h-12 text-purple-200" />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button
              onClick={() => setShowTransactionModal(true)}
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 flex flex-col items-center space-y-2"
            >
              <FontAwesomeIcon icon={faPlus} className="w-6 h-6 text-green-600" />
              <span className="text-sm font-medium text-gray-700">Add Transaction</span>
            </button>
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 flex flex-col items-center space-y-2">
              <FontAwesomeIcon icon={faExchangeAlt} className="w-6 h-6 text-blue-600" />
              <span className="text-sm font-medium text-gray-700">Transfer Funds</span>
            </button>
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 flex flex-col items-center space-y-2">
              <FontAwesomeIcon icon={faReceipt} className="w-6 h-6 text-purple-600" />
              <span className="text-sm font-medium text-gray-700">Generate Receipt</span>
            </button>
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 flex flex-col items-center space-y-2">
              <FontAwesomeIcon icon={faFileExport} className="w-6 h-6 text-orange-600" />
              <span className="text-sm font-medium text-gray-700">Export Report</span>
            </button>
          </div>
        </div>

        {/* Charts and Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Income vs Expenses</h3>
              <select
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm"
              >
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="quarter">This Quarter</option>
                <option value="year">This Year</option>
              </select>
            </div>
            <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">Bar Chart - Income vs Expenses Over Time</p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Expense Breakdown</h3>
            <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">Pie Chart - Expense Categories</p>
            </div>
          </div>
        </div>

        {/* Account Balances */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <FontAwesomeIcon icon={faUniversity} className="w-5 h-5 mr-2 text-blue-600" />
            Account Balances
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900">Main Savings</h4>
                <FontAwesomeIcon icon={faUniversity} className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">KES 3,250,000</p>
              <p className="text-sm text-gray-600">ABC Bank - ****1234</p>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900">Emergency Fund</h4>
                <FontAwesomeIcon icon={faShieldAlt} className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">KES 500,000</p>
              <p className="text-sm text-gray-600">XYZ Bank - ****5678</p>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900">Investment Fund</h4>
                <FontAwesomeIcon icon={faChartLine} className="w-5 h-5 text-purple-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">KES 1,450,000</p>
              <p className="text-sm text-gray-600">Investment Portfolio</p>
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
            <button 
              onClick={() => setActiveTab('transactions')}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              View All
            </button>
          </div>
          <div className="space-y-3">
            {transactions.slice(0, 5).map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-full ${
                    transaction.type === 'income' ? 'bg-green-100 text-green-600' :
                    transaction.type === 'expense' ? 'bg-red-100 text-red-600' :
                    'bg-blue-100 text-blue-600'
                  }`}>
                    <FontAwesomeIcon 
                      icon={
                        transaction.type === 'income' ? faArrowUp :
                        transaction.type === 'expense' ? faArrowDown :
                        faExchangeAlt
                      } 
                      className="w-4 h-4" 
                    />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{transaction.description}</p>
                    <p className="text-sm text-gray-600">{transaction.category} • {transaction.reference}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-bold ${
                    transaction.type === 'income' ? 'text-green-600' :
                    transaction.type === 'expense' ? 'text-red-600' :
                    'text-blue-600'
                  }`}>
                    {transaction.type === 'expense' ? '-' : '+'}KES {transaction.amount.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600">{new Date(transaction.date).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Transactions Tab
  const TransactionsTab = () => {
    const [showFilters, setShowFilters] = useState(false);
    const [selectedView, setSelectedView] = useState<'list' | 'grid'>('list');

    return (
      <div className="space-y-6">
        {/* Transaction Controls */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 flex items-center"
              >
                <FontAwesomeIcon icon={faFilter} className="w-4 h-4 mr-2" />
                Filters
              </button>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex border border-gray-300 rounded-md">
                <button
                  onClick={() => setSelectedView('list')}
                  className={`px-3 py-2 text-sm ${selectedView === 'list' ? 'bg-blue-50 text-blue-600' : 'text-gray-600'}`}
                >
                  List
                </button>
                <button
                  onClick={() => setSelectedView('grid')}
                  className={`px-3 py-2 text-sm border-l border-gray-300 ${selectedView === 'grid' ? 'bg-blue-50 text-blue-600' : 'text-gray-600'}`}
                >
                  Grid
                </button>
              </div>
              <button
                onClick={() => setShowTransactionModal(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
              >
                <FontAwesomeIcon icon={faPlus} className="w-4 h-4 mr-2" />
                Add Transaction
              </button>
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="mt-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Transaction Type</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">All Types</option>
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                    <option value="investment">Investment</option>
                    <option value="transfer">Transfer</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select 
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Categories</option>
                    <option value="contributions">Contributions</option>
                    <option value="administrative">Administrative</option>
                    <option value="meetings">Meetings</option>
                    <option value="investment">Investment</option>
                    <option value="loans">Loans</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date From</label>
                  <input
                    type="date"
                    value={dateRange.start}
                    onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date To</label>
                  <input
                    type="date"
                    value={dateRange.end}
                    onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Transaction Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-600 mr-3">
                <FontAwesomeIcon icon={faArrowUp} className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Income</p>
                <p className="text-xl font-bold text-gray-900">KES 450K</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-red-100 text-red-600 mr-3">
                <FontAwesomeIcon icon={faArrowDown} className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Expenses</p>
                <p className="text-xl font-bold text-gray-900">KES 120K</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-3">
                <FontAwesomeIcon icon={faExchangeAlt} className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Investments</p>
                <p className="text-xl font-bold text-gray-900">KES 100K</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-3">
                <FontAwesomeIcon icon={faCalculator} className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Net Flow</p>
                <p className="text-xl font-bold text-green-600">+KES 330K</p>
              </div>
            </div>
          </div>
        </div>

        {/* Transactions Table/Grid */}
        {selectedView === 'list' ? (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <input type="checkbox" className="rounded" />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {transactions.map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input type="checkbox" className="rounded" />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(transaction.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{transaction.description}</div>
                          <div className="text-sm text-gray-500">{transaction.reference}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {transaction.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          transaction.type === 'income' ? 'bg-green-100 text-green-800' :
                          transaction.type === 'expense' ? 'bg-red-100 text-red-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {transaction.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`text-sm font-medium ${
                          transaction.type === 'income' ? 'text-green-600' :
                          transaction.type === 'expense' ? 'text-red-600' :
                          'text-blue-600'
                        }`}>
                          {transaction.type === 'expense' ? '-' : '+'}KES {transaction.amount.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          transaction.status === 'completed' ? 'bg-green-100 text-green-800' :
                          transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {transaction.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => setSelectedTransaction(transaction)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <FontAwesomeIcon icon={faEye} className="w-4 h-4" />
                          </button>
                          <button className="text-green-600 hover:text-green-900">
                            <FontAwesomeIcon icon={faEdit} className="w-4 h-4" />
                          </button>
                          <button className="text-red-600 hover:text-red-900">
                            <FontAwesomeIcon icon={faTrash} className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {transactions.map((transaction) => (
              <div key={transaction.id} className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-full ${
                    transaction.type === 'income' ? 'bg-green-100 text-green-600' :
                    transaction.type === 'expense' ? 'bg-red-100 text-red-600' :
                    'bg-blue-100 text-blue-600'
                  }`}>
                    <FontAwesomeIcon 
                      icon={
                        transaction.type === 'income' ? faArrowUp :
                        transaction.type === 'expense' ? faArrowDown :
                        faExchangeAlt
                      } 
                      className="w-5 h-5" 
                    />
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    transaction.status === 'completed' ? 'bg-green-100 text-green-800' :
                    transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {transaction.status}
                  </span>
                </div>
                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-1">{transaction.description}</h4>
                  <p className="text-sm text-gray-600">{transaction.reference}</p>
                  <p className="text-xs text-gray-500 mt-1">{new Date(transaction.date).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    {transaction.category}
                  </span>
                  <span className={`text-lg font-bold ${
                    transaction.type === 'income' ? 'text-green-600' :
                    transaction.type === 'expense' ? 'text-red-600' :
                    'text-blue-600'
                  }`}>
                    {transaction.type === 'expense' ? '-' : '+'}KES {transaction.amount.toLocaleString()}
                  </span>
                </div>
                <div className="mt-4 flex justify-end space-x-2">
                  <button
                    onClick={() => setSelectedTransaction(transaction)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                  >
                    <FontAwesomeIcon icon={faEye} className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-green-600 hover:bg-green-50 rounded">
                    <FontAwesomeIcon icon={faEdit} className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-red-600 hover:bg-red-50 rounded">
                    <FontAwesomeIcon icon={faTrash} className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Transaction Detail Modal */}
        {selectedTransaction && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Transaction Details</h3>
                <button
                  onClick={() => setSelectedTransaction(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FontAwesomeIcon icon={faTimes} className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Transaction Amount</h4>
                    <p className={`text-3xl font-bold ${
                      selectedTransaction.type === 'income' ? 'text-green-600' :
                      selectedTransaction.type === 'expense' ? 'text-red-600' :
                      'text-blue-600'
                    }`}>
                      {selectedTransaction.type === 'expense' ? '-' : '+'}KES {selectedTransaction.amount.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Status</h4>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      selectedTransaction.status === 'completed' ? 'bg-green-100 text-green-800' :
                      selectedTransaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {selectedTransaction.status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Description</h4>
                    <p className="text-gray-900">{selectedTransaction.description}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Reference</h4>
                    <p className="text-gray-900">{selectedTransaction.reference}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Category</h4>
                    <p className="text-gray-900">{selectedTransaction.category}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Payment Method</h4>
                    <p className="text-gray-900">{selectedTransaction.paymentMethod}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Date</h4>
                    <p className="text-gray-900">{new Date(selectedTransaction.date).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Account</h4>
                    <p className="text-gray-900">{selectedTransaction.accountId}</p>
                  </div>
                </div>

                {selectedTransaction.tags.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedTransaction.tags.map((tag, index) => (
                        <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                  <button className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">
                    Print Receipt
                  </button>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                    Edit Transaction
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Budget Management Tab
  const BudgetsTab = () => {
    const [showBudgetModal, setShowBudgetModal] = useState(false);

    return (
      <div className="space-y-6">
        {/* Budget Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Total Budget</h3>
              <FontAwesomeIcon icon={faCalculator} className="w-6 h-6 text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">KES 280K</p>
            <p className="text-sm text-gray-600">For August 2024</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Total Spent</h3>
              <FontAwesomeIcon icon={faMoneyBillWave} className="w-6 h-6 text-red-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">KES 150K</p>
            <p className="text-sm text-green-600">54% of budget</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Remaining</h3>
              <FontAwesomeIcon icon={faPiggyBank} className="w-6 h-6 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">KES 130K</p>
            <p className="text-sm text-blue-600">46% remaining</p>
          </div>
        </div>

        {/* Budget Categories */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Budget Categories</h3>
            <button
              onClick={() => setShowBudgetModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
            >
              <FontAwesomeIcon icon={faPlus} className="w-4 h-4 mr-2" />
              Add Category
            </button>
          </div>

          <div className="space-y-6">
            {budgetCategories.map((category) => (
              <div key={category.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="text-lg font-medium text-gray-900">{category.name}</h4>
                    <p className="text-sm text-gray-600">{category.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">
                      KES {category.spent.toLocaleString()} / KES {category.allocated.toLocaleString()}
                    </p>
                    <p className={`text-sm font-medium ${
                      category.remaining > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {category.remaining > 0 ? 'Under' : 'Over'} by KES {Math.abs(category.remaining).toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-3">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Progress</span>
                    <span>{Math.round((category.spent / category.allocated) * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        (category.spent / category.allocated) > 1 ? 'bg-red-500' :
                        (category.spent / category.allocated) > 0.8 ? 'bg-yellow-500' :
                        'bg-green-500'
                      }`}
                      style={{ width: `${Math.min((category.spent / category.allocated) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end space-x-2">
                  <button className="px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded hover:bg-blue-100">
                    View Details
                  </button>
                  <button className="px-3 py-1 text-sm bg-green-50 text-green-600 rounded hover:bg-green-100">
                    Edit Budget
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Budget Performance Chart */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Budget vs Actual Spending</h3>
          <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">Bar Chart - Budget vs Actual by Category</p>
          </div>
        </div>
      </div>
    );
  };

  // Main Tab Navigation
  const tabs = [
    { id: 'overview', label: 'Overview', icon: faCoins },
    { id: 'transactions', label: 'Transactions', icon: faExchangeAlt },
    { id: 'budgets', label: 'Budgets', icon: faCalculator },
    { id: 'reports', label: 'Reports', icon: faChartLine },
    { id: 'reconciliation', label: 'Reconciliation', icon: faFileContract },
    { id: 'investment', label: 'Investments', icon: faChartPie }
  ];

  return (
    <div className="h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <FontAwesomeIcon icon={faCoins} className="w-8 h-8 mr-3 text-green-600" />
              Enhanced Financial Management
            </h1>
            <p className="text-gray-600 mt-1">Comprehensive financial tracking and reporting system</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => setShowTransactionModal(true)}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center"
            >
              <FontAwesomeIcon icon={faPlus} className="w-4 h-4 mr-2" />
              Add Transaction
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
        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'transactions' && <TransactionsTab />}
        {activeTab === 'budgets' && <BudgetsTab />}
        {activeTab === 'reports' && (
          <div className="text-center py-12">
            <FontAwesomeIcon icon={faChartLine} className="w-16 h-16 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Financial Reports</h3>
            <p className="text-gray-600">Detailed financial reports and analytics coming soon</p>
          </div>
        )}
        {activeTab === 'reconciliation' && (
          <div className="text-center py-12">
            <FontAwesomeIcon icon={faFileContract} className="w-16 h-16 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Bank Reconciliation</h3>
            <p className="text-gray-600">Automated bank reconciliation tools coming soon</p>
          </div>
        )}
        {activeTab === 'investment' && (
          <div className="text-center py-12">
            <FontAwesomeIcon icon={faChartPie} className="w-16 h-16 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Investment Management</h3>
            <p className="text-gray-600">Investment portfolio tracking coming soon</p>
          </div>
        )}
      </div>

      {/* Transaction Modal */}
      {showTransactionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Add New Transaction</h3>
              <button
                onClick={() => setShowTransactionModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FontAwesomeIcon icon={faTimes} className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6">
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Transaction Type *</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="">Select Type</option>
                      <option value="income">Income</option>
                      <option value="expense">Expense</option>
                      <option value="investment">Investment</option>
                      <option value="transfer">Transfer</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="">Select Category</option>
                      <option value="contributions">Contributions</option>
                      <option value="administrative">Administrative</option>
                      <option value="meetings">Meetings</option>
                      <option value="investment">Investment</option>
                      <option value="loans">Loans</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Amount (KES) *</label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date *</label>
                    <input
                      type="date"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                    <textarea
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter transaction description..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="">Select Method</option>
                      <option value="cash">Cash</option>
                      <option value="bank_transfer">Bank Transfer</option>
                      <option value="mobile_money">Mobile Money</option>
                      <option value="check">Check</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Reference Number</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Optional reference"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setShowTransactionModal(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    Add Transaction
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

export default EnhancedFinancialManagement;
