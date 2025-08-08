/**
 * Enhanced Loan Management Module
 * Complete loan lifecycle management with approval workflows and guarantor system
 */

"use client";

import React, { useState, useCallback, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faHandHoldingUsd, faPlus, faSearch, faFilter, faFileExport,
  faCalculator, faUser, faUsers, faFileContract, faShieldAlt,
  faChartLine, faCheckCircle, faExclamationTriangle, faClock,
  faHistory, faBell, faEdit, faTrash, faEye, faDownload,
  faPrint, faShare, faUpload, faSpinner, faTimes, faCheck,
  faUserCheck, faMoneyBillWave, faCalendarAlt, faPercent,
  faWallet, faBank, faHandshake, faGavel, faChartBar
} from '@fortawesome/free-solid-svg-icons';
import { LoanProduct, LoanApplication, ModuleComponentProps } from '@/types/enhanced-features';

const EnhancedLoanManagement: React.FC<ModuleComponentProps> = ({
  chamaId,
  memberId,
  permissions = [],
  onNavigate,
  onUpdate,
  onError
}) => {
  // State Management
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'applications' | 'disbursement' | 'collection' | 'analytics'>('overview');
  const [selectedApplications, setSelectedApplications] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<LoanApplication | null>(null);
  const [loading, setLoading] = useState(false);

  // Mock data - replace with actual API calls
  const [loanProducts] = useState<LoanProduct[]>([
    {
      id: '1',
      name: 'Emergency Loan',
      description: 'Quick loan for emergency expenses',
      minAmount: 5000,
      maxAmount: 50000,
      interestRate: 10,
      interestType: 'reducing_balance',
      maxTermMonths: 12,
      guarantorsRequired: 1,
      collateralRequired: false,
      eligibilityCriteria: {
        minSavingsMultiple: 2,
        minMembershipMonths: 6,
        maxActiveLoans: 1,
        minCreditScore: 600
      },
      fees: {
        processingFee: 500,
        insuranceFee: 200,
        legalFee: 0
      },
      isActive: true
    },
    {
      id: '2',
      name: 'Development Loan',
      description: 'Long-term loan for development projects',
      minAmount: 50000,
      maxAmount: 500000,
      interestRate: 12,
      interestType: 'reducing_balance',
      maxTermMonths: 36,
      guarantorsRequired: 2,
      collateralRequired: true,
      eligibilityCriteria: {
        minSavingsMultiple: 3,
        minMembershipMonths: 12,
        maxActiveLoans: 1,
        minCreditScore: 700
      },
      fees: {
        processingFee: 2000,
        insuranceFee: 1000,
        legalFee: 1500
      },
      isActive: true
    }
  ]);

  const [loanApplications] = useState<LoanApplication[]>([
    {
      id: '1',
      applicantId: 'member1',
      loanProductId: '1',
      amount: 25000,
      termMonths: 6,
      purpose: 'Medical emergency',
      guarantors: [
        {
          memberId: 'member2',
          guaranteedAmount: 25000,
          status: 'accepted',
          acceptedAt: '2024-08-06T10:00:00Z'
        }
      ],
      applicationDate: '2024-08-05',
      status: 'committee_review',
      approvalWorkflow: [
        {
          step: 'initial_review',
          status: 'approved',
          approvedBy: 'admin1',
          approvedAt: '2024-08-05T15:00:00Z',
          comments: 'Application meets basic criteria'
        },
        {
          step: 'committee_review',
          status: 'pending',
          comments: 'Awaiting committee decision'
        }
      ],
      creditScore: 720,
      riskAssessment: {
        score: 85,
        factors: ['Good payment history', 'Adequate savings', 'Strong guarantor'],
        recommendation: 'approve'
      }
    }
  ]);

  // Loan Products Management
  const LoanProductsTab = () => {
    const [showProductModal, setShowProductModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<LoanProduct | null>(null);

    return (
      <div className="space-y-6">
        {/* Header with Add Button */}
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">Loan Products</h3>
          <button
            onClick={() => setShowProductModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
          >
            <FontAwesomeIcon icon={faPlus} className="w-4 h-4 mr-2" />
            Add Product
          </button>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {loanProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-gray-900">{product.name}</h4>
                  <p className="text-sm text-gray-600 mt-1">{product.description}</p>
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  product.isActive 
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {product.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>

              <div className="space-y-3 mb-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-gray-600">Amount Range:</span>
                    <p className="text-sm font-medium">
                      KES {product.minAmount.toLocaleString()} - {product.maxAmount.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Interest Rate:</span>
                    <p className="text-sm font-medium">{product.interestRate}% p.a.</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Max Term:</span>
                    <p className="text-sm font-medium">{product.maxTermMonths} months</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Guarantors:</span>
                    <p className="text-sm font-medium">{product.guarantorsRequired}</p>
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-200">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Processing Fee:</span>
                    <span className="font-medium">KES {product.fees.processingFee}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Collateral Required:</span>
                    <span className="font-medium">{product.collateralRequired ? 'Yes' : 'No'}</span>
                  </div>
                </div>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => setSelectedProduct(product)}
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

        {/* Loan Calculator */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <FontAwesomeIcon icon={faCalculator} className="w-5 h-5 mr-2 text-green-600" />
            Loan Calculator
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Loan Product</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Select Product</option>
                {loanProducts.map((product) => (
                  <option key={product.id} value={product.id}>{product.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Principal Amount</label>
              <input
                type="number"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Term (Months)</label>
              <input
                type="number"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="12"
              />
            </div>
            <div className="flex items-end">
              <button className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
                Calculate
              </button>
            </div>
          </div>

          {/* Calculation Results */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <p className="text-sm text-gray-600">Monthly Payment</p>
              <p className="text-lg font-bold text-gray-900">KES 0</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <p className="text-sm text-gray-600">Total Interest</p>
              <p className="text-lg font-bold text-gray-900">KES 0</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <p className="text-sm text-gray-600">Total Repayment</p>
              <p className="text-lg font-bold text-gray-900">KES 0</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <p className="text-sm text-gray-600">Total Fees</p>
              <p className="text-lg font-bold text-gray-900">KES 0</p>
            </div>
          </div>
        </div>

        {/* Product Creation/Edit Modal */}
        {(showProductModal || selectedProduct) && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">
                  {selectedProduct ? 'Edit Loan Product' : 'Create New Loan Product'}
                </h3>
                <button
                  onClick={() => {
                    setShowProductModal(false);
                    setSelectedProduct(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FontAwesomeIcon icon={faTimes} className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-6">
                <form className="space-y-6">
                  {/* Basic Information */}
                  <div>
                    <h4 className="text-md font-medium text-gray-900 mb-4">Basic Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Product Name *</label>
                        <input
                          type="text"
                          defaultValue={selectedProduct?.name || ''}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Interest Type *</label>
                        <select
                          defaultValue={selectedProduct?.interestType || 'reducing_balance'}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="fixed">Fixed</option>
                          <option value="reducing_balance">Reducing Balance</option>
                          <option value="flat_rate">Flat Rate</option>
                        </select>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                        <textarea
                          rows={3}
                          defaultValue={selectedProduct?.description || ''}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Loan Terms */}
                  <div>
                    <h4 className="text-md font-medium text-gray-900 mb-4">Loan Terms</h4>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Min Amount (KES) *</label>
                        <input
                          type="number"
                          defaultValue={selectedProduct?.minAmount || ''}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Max Amount (KES) *</label>
                        <input
                          type="number"
                          defaultValue={selectedProduct?.maxAmount || ''}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Interest Rate (%) *</label>
                        <input
                          type="number"
                          step="0.1"
                          defaultValue={selectedProduct?.interestRate || ''}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Max Term (Months) *</label>
                        <input
                          type="number"
                          defaultValue={selectedProduct?.maxTermMonths || ''}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Requirements */}
                  <div>
                    <h4 className="text-md font-medium text-gray-900 mb-4">Requirements</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Guarantors Required *</label>
                        <input
                          type="number"
                          defaultValue={selectedProduct?.guarantorsRequired || ''}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                      <div className="flex items-center pt-6">
                        <input
                          type="checkbox"
                          defaultChecked={selectedProduct?.collateralRequired ?? false}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-700">Collateral Required</span>
                      </div>
                    </div>
                  </div>

                  {/* Fees */}
                  <div>
                    <h4 className="text-md font-medium text-gray-900 mb-4">Fees</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Processing Fee (KES)</label>
                        <input
                          type="number"
                          defaultValue={selectedProduct?.fees.processingFee || ''}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Insurance Fee (KES)</label>
                        <input
                          type="number"
                          defaultValue={selectedProduct?.fees.insuranceFee || ''}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Legal Fee (KES)</label>
                        <input
                          type="number"
                          defaultValue={selectedProduct?.fees.legalFee || ''}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={() => {
                        setShowProductModal(false);
                        setSelectedProduct(null);
                      }}
                      className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      {selectedProduct ? 'Update' : 'Create'} Product
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

  // Loan Applications Management
  const ApplicationsTab = () => {
    const [showApprovalModal, setShowApprovalModal] = useState(false);

    return (
      <div className="space-y-6">
        {/* Application Status Summary */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {[
            { status: 'submitted', label: 'Submitted', count: 5, color: 'blue' },
            { status: 'under_review', label: 'Under Review', count: 3, color: 'yellow' },
            { status: 'committee_review', label: 'Committee Review', count: 2, color: 'purple' },
            { status: 'approved', label: 'Approved', count: 8, color: 'green' },
            { status: 'rejected', label: 'Rejected', count: 1, color: 'red' }
          ].map((item) => (
            <div key={item.status} className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
              <div className="text-center">
                <p className={`text-2xl font-bold text-${item.color}-600`}>{item.count}</p>
                <p className="text-sm text-gray-600">{item.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Applications Table */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Loan Applications</h3>
              <div className="flex space-x-2">
                <div className="relative">
                  <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search applications..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <select className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="all">All Status</option>
                  <option value="submitted">Submitted</option>
                  <option value="under_review">Under Review</option>
                  <option value="committee_review">Committee Review</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Applicant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Term
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Credit Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Applied Date
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loanApplications.map((application) => (
                  <tr key={application.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                          <FontAwesomeIcon icon={faUser} className="w-5 h-5 text-gray-500" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">John Doe</div>
                          <div className="text-sm text-gray-500">MEM001</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      Emergency Loan
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      KES {application.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {application.termMonths} months
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        application.status === 'approved' 
                          ? 'bg-green-100 text-green-800'
                          : application.status === 'rejected'
                          ? 'bg-red-100 text-red-800'
                          : application.status === 'committee_review'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {application.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-gray-900">{application.creditScore}</span>
                        <div className={`ml-2 w-2 h-2 rounded-full ${
                          application.creditScore >= 700 ? 'bg-green-500' : 
                          application.creditScore >= 600 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}></div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(application.applicationDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => setSelectedApplication(application)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <FontAwesomeIcon icon={faEye} className="w-4 h-4" />
                        </button>
                        {application.status === 'committee_review' && (
                          <button
                            onClick={() => setShowApprovalModal(true)}
                            className="text-green-600 hover:text-green-900"
                          >
                            <FontAwesomeIcon icon={faCheck} className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Application Detail Modal */}
        {selectedApplication && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">
                  Loan Application Details
                </h3>
                <button
                  onClick={() => setSelectedApplication(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FontAwesomeIcon icon={faTimes} className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Application Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium text-blue-900">Loan Amount</h4>
                    <p className="text-2xl font-bold text-blue-600">
                      KES {selectedApplication.amount.toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-medium text-green-900">Monthly Payment</h4>
                    <p className="text-2xl font-bold text-green-600">KES 4,500</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h4 className="font-medium text-purple-900">Credit Score</h4>
                    <p className="text-2xl font-bold text-purple-600">{selectedApplication.creditScore}</p>
                  </div>
                </div>

                {/* Guarantors */}
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Guarantors</h4>
                  <div className="space-y-3">
                    {selectedApplication.guarantors.map((guarantor, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                            <FontAwesomeIcon icon={faUser} className="w-5 h-5 text-gray-500" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">Jane Smith</p>
                            <p className="text-sm text-gray-600">Guaranteed: KES {guarantor.guaranteedAmount.toLocaleString()}</p>
                          </div>
                        </div>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          guarantor.status === 'accepted' 
                            ? 'bg-green-100 text-green-800'
                            : guarantor.status === 'declined'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {guarantor.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Risk Assessment */}
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Risk Assessment</h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-gray-700">Risk Score</span>
                      <span className="text-lg font-bold text-green-600">{selectedApplication.riskAssessment.score}/100</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                      <div 
                        className="bg-green-600 h-2 rounded-full" 
                        style={{ width: `${selectedApplication.riskAssessment.score}%` }}
                      ></div>
                    </div>
                    <div className="space-y-1">
                      {selectedApplication.riskAssessment.factors.map((factor, index) => (
                        <div key={index} className="flex items-center text-sm text-gray-600">
                          <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-green-500 mr-2" />
                          {factor}
                        </div>
                      ))}
                    </div>
                    <div className="mt-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        selectedApplication.riskAssessment.recommendation === 'approve'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        Recommendation: {selectedApplication.riskAssessment.recommendation}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Approval Actions */}
                {selectedApplication.status === 'committee_review' && (
                  <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                    <button className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
                      Reject Application
                    </button>
                    <button className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
                      Approve Application
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Collection & Recovery
  const CollectionTab = () => {
    return (
      <div className="space-y-6">
        {/* Collection Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
                <FontAwesomeIcon icon={faMoneyBillWave} className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Active Loans</p>
                <p className="text-2xl font-bold text-gray-900">25</p>
                <p className="text-xs text-green-600">KES 2.5M outstanding</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
                <FontAwesomeIcon icon={faCalendarAlt} className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Due This Month</p>
                <p className="text-2xl font-bold text-gray-900">KES 350K</p>
                <p className="text-xs text-blue-600">18 payments</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4">
                <FontAwesomeIcon icon={faClock} className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Overdue</p>
                <p className="text-2xl font-bold text-gray-900">KES 45K</p>
                <p className="text-xs text-red-600">3 borrowers</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
                <FontAwesomeIcon icon={faPercent} className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Recovery Rate</p>
                <p className="text-2xl font-bold text-gray-900">95%</p>
                <p className="text-xs text-green-600">Excellent</p>
              </div>
            </div>
          </div>
        </div>

        {/* Repayment Schedule */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <FontAwesomeIcon icon={faCalendarAlt} className="w-5 h-5 mr-2 text-blue-600" />
            Upcoming Repayments
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Borrower
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Loan ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Due Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount Due
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
                {[
                  { borrower: 'John Doe', loanId: 'LN001', dueDate: '2024-08-10', amount: 15000, status: 'due' },
                  { borrower: 'Jane Smith', loanId: 'LN002', dueDate: '2024-08-12', amount: 22000, status: 'upcoming' },
                  { borrower: 'Mike Johnson', loanId: 'LN003', dueDate: '2024-08-05', amount: 8000, status: 'overdue' }
                ].map((payment, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {payment.borrower}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {payment.loanId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(payment.dueDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      KES {payment.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        payment.status === 'overdue' 
                          ? 'bg-red-100 text-red-800'
                          : payment.status === 'due'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {payment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button className="text-blue-600 hover:text-blue-900">
                          <FontAwesomeIcon icon={faBell} className="w-4 h-4" />
                        </button>
                        <button className="text-green-600 hover:text-green-900">
                          <FontAwesomeIcon icon={faMoneyBillWave} className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Collection Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <FontAwesomeIcon icon={faBell} className="w-5 h-5 mr-2 text-yellow-600" />
              Send Reminders
            </h4>
            <p className="text-sm text-gray-600 mb-4">Send automated reminders to borrowers</p>
            <button className="w-full px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700">
              Send All Reminders
            </button>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <FontAwesomeIcon icon={faGavel} className="w-5 h-5 mr-2 text-red-600" />
              Collection Actions
            </h4>
            <p className="text-sm text-gray-600 mb-4">Escalate overdue accounts</p>
            <button className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
              View Overdue
            </button>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <FontAwesomeIcon icon={faChartBar} className="w-5 h-5 mr-2 text-green-600" />
              Performance Report
            </h4>
            <p className="text-sm text-gray-600 mb-4">Generate collection reports</p>
            <button className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
              Generate Report
            </button>
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
              <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
                <FontAwesomeIcon icon={faHandHoldingUsd} className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Disbursed</p>
                <p className="text-2xl font-bold text-gray-900">KES 15M</p>
                <p className="text-xs text-green-600">+25% this year</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
                <FontAwesomeIcon icon={faChartLine} className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Repayment Rate</p>
                <p className="text-2xl font-bold text-gray-900">97%</p>
                <p className="text-xs text-green-600">Excellent</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
                <FontAwesomeIcon icon={faPercent} className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Interest Rate</p>
                <p className="text-2xl font-bold text-gray-900">11%</p>
                <p className="text-xs text-blue-600">Per annum</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-orange-100 text-orange-600 mr-4">
                <FontAwesomeIcon icon={faCalendarAlt} className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Term</p>
                <p className="text-2xl font-bold text-gray-900">18</p>
                <p className="text-xs text-orange-600">Months</p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Loan Portfolio Growth</h3>
            <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">Line Chart - Portfolio Growth Over Time</p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Loan Product Distribution</h3>
            <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">Pie Chart - Loans by Product Type</p>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Loan Performance Metrics</h3>
          <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">Multi-line Chart - Approval Rate, Default Rate, Collection Rate</p>
          </div>
        </div>
      </div>
    );
  };

  // Main Tab Navigation
  const tabs = [
    { id: 'overview', label: 'Overview', icon: faHandHoldingUsd },
    { id: 'products', label: 'Loan Products', icon: faCalculator },
    { id: 'applications', label: 'Applications', icon: faFileContract },
    { id: 'disbursement', label: 'Disbursement', icon: faMoneyBillWave },
    { id: 'collection', label: 'Collection', icon: faWallet },
    { id: 'analytics', label: 'Analytics', icon: faChartLine }
  ];

  return (
    <div className="h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <FontAwesomeIcon icon={faHandHoldingUsd} className="w-8 h-8 mr-3 text-purple-600" />
              Enhanced Loan Management
            </h1>
            <p className="text-gray-600 mt-1">Complete loan lifecycle management system</p>
          </div>
          <div className="flex space-x-3">
            <button className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 flex items-center">
              <FontAwesomeIcon icon={faPlus} className="w-4 h-4 mr-2" />
              New Application
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
                    ? 'border-purple-500 text-purple-600'
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
                  <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
                    <FontAwesomeIcon icon={faFileContract} className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Pending Applications</p>
                    <p className="text-2xl font-bold text-gray-900">5</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
                    <FontAwesomeIcon icon={faCheckCircle} className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Loans</p>
                    <p className="text-2xl font-bold text-gray-900">25</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
                    <FontAwesomeIcon icon={faMoneyBillWave} className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Outstanding</p>
                    <p className="text-2xl font-bold text-gray-900">KES 2.5M</p>
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
                    <p className="text-2xl font-bold text-gray-900">KES 45K</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Loan Activity</h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="p-2 bg-green-100 rounded-full">
                    <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Loan Approved</p>
                    <p className="text-xs text-gray-600">John Doe's emergency loan of KES 25,000 approved • 2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="p-2 bg-blue-100 rounded-full">
                    <FontAwesomeIcon icon={faMoneyBillWave} className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Payment Received</p>
                    <p className="text-xs text-gray-600">Jane Smith made loan repayment of KES 15,000 • 5 hours ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'products' && <LoanProductsTab />}
        {activeTab === 'applications' && <ApplicationsTab />}
        {activeTab === 'collection' && <CollectionTab />}
        {activeTab === 'analytics' && <AnalyticsTab />}
      </div>
    </div>
  );
};

export default EnhancedLoanManagement;
