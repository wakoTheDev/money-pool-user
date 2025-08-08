/**
 * Enhanced Member Management Module
 * Comprehensive member lifecycle management with all requested features
 */

"use client";

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, faUserPlus, faSearch, faFilter, faFileExport, 
  faIdCard, faPhone, faEnvelope, faMapMarkerAlt, 
  faCalendarAlt, faUserCheck, faUserTimes, faUserClock,
  faChartLine, faTrophy, faAward, faStar, faCheckCircle,
  faExclamationTriangle, faCog, faEdit, faTrash, faEye,
  faDownload, faPrint, faQrcode, faUserShield, faUsers,
  faBell, faMessage, faGraduationCap, faHandshake, faCamera,
  faUpload, faSpinner, faLanguage, faShieldAlt, faVoteYea,
  faHistory, faShare, faFingerprint, faLock
} from '@fortawesome/free-solid-svg-icons';
import { MemberProfile, ModuleComponentProps } from '@/types/enhanced-features';

// Enhanced Member Management Component
const EnhancedMemberManagement: React.FC<ModuleComponentProps> = ({
  chamaId,
  memberId,
  permissions = [],
  viewMode: initialViewMode = 'list',
  showFilters = true,
  showSearch = true,
  allowBulkActions = true,
  onNavigate,
  onUpdate,
  onError
}) => {
  // State Management
  const [activeTab, setActiveTab] = useState<'overview' | 'registration' | 'kyc' | 'communication' | 'analytics'>('overview');
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterRole, setFilterRole] = useState('all');
  const [currentViewMode, setCurrentViewMode] = useState(initialViewMode);
  const [selectedMember, setSelectedMember] = useState<MemberProfile | null>(null);
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // Mock data - replace with actual API calls
  const [members] = useState<MemberProfile[]>([
    {
      id: '1',
      membershipNumber: 'MEM001',
      profile: {
        firstName: 'John',
        lastName: 'Doe',
        fullName: 'John Doe',
        photo: '',
        idNumber: '12345678',
        phone: '+254712345678',
        email: 'john.doe@email.com',
        dateOfBirth: '1990-01-01',
        gender: 'male',
        address: {
          city: 'Nairobi',
          county: 'Nairobi',
          country: 'Kenya'
        },
        nextOfKin: {
          name: 'Jane Doe',
          relationship: 'Spouse',
          phone: '+254712345679'
        }
      },
      membership: {
        role: 'member',
        status: 'active',
        joinDate: '2024-01-01',
        chamaMemberships: [chamaId],
        votingRights: true,
        shareBalance: 50000,
        savingsBalance: 150000,
        loanBalance: 0
      },
      kyc: {
        status: 'verified',
        documents: {
          idCopy: 'id_copy_url',
          photoUrl: 'photo_url'
        },
        verificationDate: '2024-01-02'
      },
      communication: {
        preferences: {
          sms: true,
          email: true,
          push: true,
          whatsapp: true,
          ussd: false
        },
        language: 'en',
        timezone: 'Africa/Nairobi'
      },
      performance: {
        contributionScore: 95,
        attendanceRate: 88,
        creditScore: 750,
        performanceRank: 1,
        lastActivity: '2024-08-06'
      },
      privacy: {
        showBalance: true,
        showProfile: true,
        allowContact: true
      },
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-08-07T00:00:00Z'
    }
    // Add more mock data as needed
  ]);

  // Member Registration & Onboarding Component
  const MemberRegistrationTab = () => {
    const [registrationStep, setRegistrationStep] = useState(1);
    const [formData, setFormData] = useState({
      profile: {
        firstName: '',
        lastName: '',
        idNumber: '',
        phone: '',
        email: '',
        dateOfBirth: '',
        gender: 'male'
      },
      address: {
        street: '',
        city: '',
        county: '',
        country: 'Kenya'
      },
      nextOfKin: {
        name: '',
        relationship: '',
        phone: ''
      },
      membership: {
        role: 'member',
        referredBy: ''
      }
    });

    const handleInputChange = (section: string, field: string, value: string) => {
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section as keyof typeof prev],
          [field]: value
        }
      }));
    };

    return (
      <div className="space-y-6">
        {/* Registration Progress */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Member Registration</h3>
            <div className="flex space-x-2">
              {[1, 2, 3, 4].map((step) => (
                <div
                  key={step}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step === registrationStep 
                      ? 'bg-blue-600 text-white' 
                      : step < registrationStep 
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {step < registrationStep ? (
                    <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4" />
                  ) : (
                    step
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Step 1: Personal Information */}
          {registrationStep === 1 && (
            <div className="space-y-4">
              <h4 className="text-md font-medium text-gray-800 mb-4">Personal Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                  <input
                    type="text"
                    value={formData.profile.firstName}
                    onChange={(e) => handleInputChange('profile', 'firstName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                  <input
                    type="text"
                    value={formData.profile.lastName}
                    onChange={(e) => handleInputChange('profile', 'lastName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ID Number *</label>
                  <input
                    type="text"
                    value={formData.profile.idNumber}
                    onChange={(e) => handleInputChange('profile', 'idNumber', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                  <input
                    type="tel"
                    value={formData.profile.phone}
                    onChange={(e) => handleInputChange('profile', 'phone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                  <input
                    type="email"
                    value={formData.profile.email}
                    onChange={(e) => handleInputChange('profile', 'email', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth *</label>
                  <input
                    type="date"
                    value={formData.profile.dateOfBirth}
                    onChange={(e) => handleInputChange('profile', 'dateOfBirth', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Gender *</label>
                  <select
                    value={formData.profile.gender}
                    onChange={(e) => handleInputChange('profile', 'gender', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Referred By</label>
                  <input
                    type="text"
                    value={formData.membership.referredBy}
                    onChange={(e) => handleInputChange('membership', 'referredBy', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Member who referred this person"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Address Information */}
          {registrationStep === 2 && (
            <div className="space-y-4">
              <h4 className="text-md font-medium text-gray-800 mb-4">Address Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Street Address</label>
                  <input
                    type="text"
                    value={formData.address.street}
                    onChange={(e) => handleInputChange('address', 'street', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">City/Town *</label>
                  <input
                    type="text"
                    value={formData.address.city}
                    onChange={(e) => handleInputChange('address', 'city', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">County *</label>
                  <select
                    value={formData.address.county}
                    onChange={(e) => handleInputChange('address', 'county', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select County</option>
                    <option value="Nairobi">Nairobi</option>
                    <option value="Mombasa">Mombasa</option>
                    <option value="Kiambu">Kiambu</option>
                    <option value="Nakuru">Nakuru</option>
                    {/* Add more counties */}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Next of Kin */}
          {registrationStep === 3 && (
            <div className="space-y-4">
              <h4 className="text-md font-medium text-gray-800 mb-4">Next of Kin Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                  <input
                    type="text"
                    value={formData.nextOfKin.name}
                    onChange={(e) => handleInputChange('nextOfKin', 'name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Relationship *</label>
                  <select
                    value={formData.nextOfKin.relationship}
                    onChange={(e) => handleInputChange('nextOfKin', 'relationship', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Relationship</option>
                    <option value="Spouse">Spouse</option>
                    <option value="Parent">Parent</option>
                    <option value="Child">Child</option>
                    <option value="Sibling">Sibling</option>
                    <option value="Friend">Friend</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                  <input
                    type="tel"
                    value={formData.nextOfKin.phone}
                    onChange={(e) => handleInputChange('nextOfKin', 'phone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Role Assignment & Digital Certificate */}
          {registrationStep === 4 && (
            <div className="space-y-6">
              <h4 className="text-md font-medium text-gray-800 mb-4">Membership Details</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Member Role</label>
                  <select
                    value={formData.membership.role}
                    onChange={(e) => handleInputChange('membership', 'role', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="member">Member</option>
                    <option value="committee">Committee Member</option>
                    <option value="treasurer">Treasurer</option>
                    <option value="secretary">Secretary</option>
                    <option value="chairman">Chairman</option>
                  </select>
                </div>
              </div>

              {/* Digital Certificate Preview */}
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
                <h5 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
                  <FontAwesomeIcon icon={faQrcode} className="w-5 h-5 mr-2" />
                  Digital Membership Certificate
                </h5>
                <div className="bg-white rounded-lg p-4 border border-blue-300">
                  <div className="text-center">
                    <h6 className="text-xl font-bold text-gray-900">CHAMA MEMBERSHIP CERTIFICATE</h6>
                    <div className="mt-4 mb-4">
                      <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto flex items-center justify-center">
                        <FontAwesomeIcon icon={faUser} className="w-12 h-12 text-gray-500" />
                      </div>
                    </div>
                    <p className="text-lg font-semibold text-gray-800">
                      {formData.profile.firstName} {formData.profile.lastName}
                    </p>
                    <p className="text-sm text-gray-600">Member ID: {Date.now()}</p>
                    <p className="text-sm text-gray-600">Role: {formData.membership.role}</p>
                    <div className="mt-4">
                      <div className="w-16 h-16 bg-gray-200 mx-auto rounded"></div>
                      <p className="text-xs text-gray-500 mt-1">QR Code for Verification</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-6 pt-6 border-t border-gray-200">
            <button
              onClick={() => setRegistrationStep(Math.max(1, registrationStep - 1))}
              disabled={registrationStep === 1}
              className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <div className="flex space-x-2">
              {registrationStep < 4 ? (
                <button
                  onClick={() => setRegistrationStep(registrationStep + 1)}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={() => {
                    // Handle member registration
                    console.log('Registering member:', formData);
                    // Reset form and go to overview
                    setActiveTab('overview');
                    setRegistrationStep(1);
                  }}
                  className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Register Member
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // KYC Verification Component
  const KYCVerificationTab = () => {
    const [selectedMemberForKYC, setSelectedMemberForKYC] = useState<MemberProfile | null>(null);
    const [kycStep, setKycStep] = useState(1);

    const pendingKYCMembers = members.filter(m => m.kyc.status === 'pending');

    return (
      <div className="space-y-6">
        {/* KYC Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4">
                <FontAwesomeIcon icon={faUserClock} className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-yellow-700">Pending KYC</p>
                <p className="text-2xl font-bold text-yellow-900">{pendingKYCMembers.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-green-50 p-6 rounded-lg border border-green-200">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
                <FontAwesomeIcon icon={faUserCheck} className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-green-700">Verified</p>
                <p className="text-2xl font-bold text-green-900">
                  {members.filter(m => m.kyc.status === 'verified').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-red-50 p-6 rounded-lg border border-red-200">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-red-100 text-red-600 mr-4">
                <FontAwesomeIcon icon={faExclamationTriangle} className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-red-700">Rejected</p>
                <p className="text-2xl font-bold text-red-900">
                  {members.filter(m => m.kyc.status === 'rejected').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-orange-50 p-6 rounded-lg border border-orange-200">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-orange-100 text-orange-600 mr-4">
                <FontAwesomeIcon icon={faHistory} className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-orange-700">Expired</p>
                <p className="text-2xl font-bold text-orange-900">
                  {members.filter(m => m.kyc.status === 'expired').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Pending KYC Members */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <FontAwesomeIcon icon={faIdCard} className="w-5 h-5 mr-2 text-blue-600" />
              KYC Verification Queue
            </h3>
          </div>
          <div className="p-6">
            {pendingKYCMembers.length === 0 ? (
              <div className="text-center py-8">
                <FontAwesomeIcon icon={faCheckCircle} className="w-12 h-12 text-green-500 mb-4" />
                <h4 className="text-lg font-medium text-gray-900 mb-2">All Members Verified</h4>
                <p className="text-gray-600">No pending KYC verifications at this time.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingKYCMembers.map((member) => (
                  <div key={member.id} className="bg-gray-50 rounded-lg p-4 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                        {member.profile.photo ? (
                          <img 
                            src={member.profile.photo} 
                            alt={member.profile.fullName}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        ) : (
                          <FontAwesomeIcon icon={faUser} className="w-6 h-6 text-gray-500" />
                        )}
                      </div>
                      <div>
                        <h4 className="text-lg font-medium text-gray-900">{member.profile.fullName}</h4>
                        <p className="text-sm text-gray-600">ID: {member.profile.idNumber}</p>
                        <p className="text-sm text-gray-600">Phone: {member.profile.phone}</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setSelectedMemberForKYC(member)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                      >
                        <FontAwesomeIcon icon={faEye} className="w-4 h-4 mr-1" />
                        Review
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* KYC Document Review Modal */}
        {selectedMemberForKYC && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">
                  KYC Verification - {selectedMemberForKYC.profile.fullName}
                </h3>
                <button
                  onClick={() => setSelectedMemberForKYC(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FontAwesomeIcon icon={faTrash} className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-6">
                {/* Document Verification */}
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* ID Document */}
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="text-md font-medium text-gray-900 mb-2">ID Document</h4>
                      <div className="bg-gray-100 rounded-lg h-48 flex items-center justify-center mb-4">
                        <FontAwesomeIcon icon={faIdCard} className="w-12 h-12 text-gray-400" />
                      </div>
                      <p className="text-sm text-gray-600">ID Number: {selectedMemberForKYC.profile.idNumber}</p>
                    </div>
                    
                    {/* Photo */}
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="text-md font-medium text-gray-900 mb-2">Member Photo</h4>
                      <div className="bg-gray-100 rounded-lg h-48 flex items-center justify-center mb-4">
                        <FontAwesomeIcon icon={faCamera} className="w-12 h-12 text-gray-400" />
                      </div>
                    </div>
                  </div>

                  {/* Verification Actions */}
                  <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                    <button
                      onClick={() => {
                        // Handle KYC rejection
                        console.log('Rejecting KYC for:', selectedMemberForKYC.id);
                        setSelectedMemberForKYC(null);
                      }}
                      className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => {
                        // Handle KYC approval
                        console.log('Approving KYC for:', selectedMemberForKYC.id);
                        setSelectedMemberForKYC(null);
                      }}
                      className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                    >
                      Approve
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Communication Hub Component
  const CommunicationHubTab = () => {
    const [activeCommTab, setActiveCommTab] = useState<'messaging' | 'notifications' | 'preferences'>('messaging');

    return (
      <div className="space-y-6">
        {/* Communication Tabs */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {[
                { id: 'messaging', label: 'Messaging', icon: faMessage },
                { id: 'notifications', label: 'Notifications', icon: faBell },
                { id: 'preferences', label: 'Preferences', icon: faCog }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveCommTab(tab.id as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    activeCommTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <FontAwesomeIcon icon={tab.icon} className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Messaging Tab */}
            {activeCommTab === 'messaging' && (
              <div className="space-y-6">
                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
                    <FontAwesomeIcon icon={faUsers} className="w-6 h-6 text-blue-600 mb-2" />
                    <h4 className="font-medium text-gray-900">Group Message</h4>
                    <p className="text-sm text-gray-600">Send message to all members</p>
                  </button>
                  <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
                    <FontAwesomeIcon icon={faPhone} className="w-6 h-6 text-green-600 mb-2" />
                    <h4 className="font-medium text-gray-900">SMS Blast</h4>
                    <p className="text-sm text-gray-600">Send SMS to selected members</p>
                  </button>
                  <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
                    <FontAwesomeIcon icon={faEnvelope} className="w-6 h-6 text-purple-600 mb-2" />
                    <h4 className="font-medium text-gray-900">Email Campaign</h4>
                    <p className="text-sm text-gray-600">Send formatted email</p>
                  </button>
                </div>

                {/* Recent Messages */}
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Recent Messages</h4>
                  <div className="space-y-3">
                    {[
                      {
                        id: 1,
                        type: 'group',
                        subject: 'Monthly Meeting Reminder',
                        preview: 'Dear members, this is to remind you about our monthly meeting...',
                        timestamp: '2 hours ago',
                        recipients: 25
                      },
                      {
                        id: 2,
                        type: 'individual',
                        subject: 'Contribution Reminder',
                        preview: 'Hi John, your monthly contribution is due...',
                        timestamp: '1 day ago',
                        recipients: 1
                      }
                    ].map((message) => (
                      <div key={message.id} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h5 className="font-medium text-gray-900">{message.subject}</h5>
                            <p className="text-sm text-gray-600 mt-1">{message.preview}</p>
                            <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                              <span>{message.recipients} recipient{message.recipients > 1 ? 's' : ''}</span>
                              <span>{message.timestamp}</span>
                            </div>
                          </div>
                          <button className="text-blue-600 hover:text-blue-800 text-sm">
                            View Details
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeCommTab === 'notifications' && (
              <div className="space-y-6">
                <h4 className="text-lg font-medium text-gray-900">Notification Templates</h4>
                
                {/* Notification Templates */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { name: 'Contribution Reminder', trigger: 'Due date approaching' },
                    { name: 'Meeting Reminder', trigger: '24 hours before meeting' },
                    { name: 'Loan Approval', trigger: 'Loan status change' },
                    { name: 'Welcome Message', trigger: 'New member registration' }
                  ].map((template, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <h5 className="font-medium text-gray-900">{template.name}</h5>
                      <p className="text-sm text-gray-600 mt-1">Trigger: {template.trigger}</p>
                      <div className="mt-3 flex space-x-2">
                        <button className="text-sm text-blue-600 hover:text-blue-800">Edit</button>
                        <button className="text-sm text-green-600 hover:text-green-800">Test</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Preferences Tab */}
            {activeCommTab === 'preferences' && (
              <div className="space-y-6">
                <h4 className="text-lg font-medium text-gray-900">Communication Preferences</h4>
                
                {/* Language Settings */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <h5 className="font-medium text-gray-900 mb-4 flex items-center">
                    <FontAwesomeIcon icon={faLanguage} className="w-5 h-5 mr-2 text-blue-600" />
                    Multi-Language Support
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Default Language</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="en">English</option>
                        <option value="sw">Kiswahili</option>
                        <option value="local">Local Language</option>
                      </select>
                    </div>
                    <div className="flex items-center">
                      <input type="checkbox" id="auto-translate" className="mr-2" />
                      <label htmlFor="auto-translate" className="text-sm text-gray-700">Auto-translate messages</label>
                    </div>
                    <div className="flex items-center">
                      <input type="checkbox" id="voice-support" className="mr-2" />
                      <label htmlFor="voice-support" className="text-sm text-gray-700">Voice message support</label>
                    </div>
                  </div>
                </div>

                {/* Channel Preferences */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <h5 className="font-medium text-gray-900 mb-4">Communication Channels</h5>
                  <div className="space-y-3">
                    {[
                      { channel: 'SMS', icon: faPhone, enabled: true },
                      { channel: 'Email', icon: faEnvelope, enabled: true },
                      { channel: 'WhatsApp', icon: faMessage, enabled: false },
                      { channel: 'Push Notifications', icon: faBell, enabled: true },
                      { channel: 'USSD', icon: faPhone, enabled: false }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <FontAwesomeIcon icon={item.icon} className="w-5 h-5 text-gray-600" />
                          <span className="text-sm font-medium text-gray-900">{item.channel}</span>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" checked={item.enabled} className="sr-only peer" />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Member Analytics Component
  const MemberAnalyticsTab = () => {
    return (
      <div className="space-y-6">
        {/* Analytics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
                <FontAwesomeIcon icon={faUsers} className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Members</p>
                <p className="text-2xl font-bold text-gray-900">{members.length}</p>
                <p className="text-xs text-green-600">+12% from last month</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
                <FontAwesomeIcon icon={faChartLine} className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Performance</p>
                <p className="text-2xl font-bold text-gray-900">87%</p>
                <p className="text-xs text-green-600">+5% improvement</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
                <FontAwesomeIcon icon={faTrophy} className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Top Performers</p>
                <p className="text-2xl font-bold text-gray-900">8</p>
                <p className="text-xs text-blue-600">Above 90% score</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-orange-100 text-orange-600 mr-4">
                <FontAwesomeIcon icon={faExclamationTriangle} className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">At Risk</p>
                <p className="text-2xl font-bold text-gray-900">2</p>
                <p className="text-xs text-red-600">Need attention</p>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Trends */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <FontAwesomeIcon icon={faChartLine} className="w-5 h-5 mr-2 text-blue-600" />
            Member Performance Trends
          </h3>
          <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">Performance Chart Placeholder</p>
          </div>
        </div>

        {/* Top Performers */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <FontAwesomeIcon icon={faTrophy} className="w-5 h-5 mr-2 text-yellow-600" />
            Top Performing Members
          </h3>
          <div className="space-y-3">
            {members
              .sort((a, b) => b.performance.contributionScore - a.performance.contributionScore)
              .slice(0, 5)
              .map((member, index) => (
                <div key={member.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                      index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-orange-500' : 'bg-blue-500'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{member.profile.fullName}</p>
                      <p className="text-sm text-gray-600">{member.membership.role}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">{member.performance.contributionScore}%</p>
                    <p className="text-sm text-gray-600">Performance Score</p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    );
  };

  // Main Tab Navigation
  const tabs = [
    { id: 'overview', label: 'Overview', icon: faUsers },
    { id: 'registration', label: 'Registration', icon: faUserPlus },
    { id: 'kyc', label: 'KYC Verification', icon: faIdCard },
    { id: 'communication', label: 'Communication Hub', icon: faMessage },
    { id: 'analytics', label: 'Analytics', icon: faChartLine }
  ];

  return (
    <div className="h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <FontAwesomeIcon icon={faUsers} className="w-8 h-8 mr-3 text-blue-600" />
              Enhanced Member Management
            </h1>
            <p className="text-gray-600 mt-1">Comprehensive member lifecycle management system</p>
          </div>
          <div className="flex space-x-3">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center">
              <FontAwesomeIcon icon={faUserPlus} className="w-4 h-4 mr-2" />
              Quick Add Member
            </button>
            <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center">
              <FontAwesomeIcon icon={faFileExport} className="w-4 h-4 mr-2" />
              Export Data
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
                    ? 'border-blue-500 text-blue-600'
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
                    <FontAwesomeIcon icon={faUsers} className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Members</p>
                    <p className="text-2xl font-bold text-gray-900">{members.length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
                    <FontAwesomeIcon icon={faUserCheck} className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Members</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {members.filter(m => m.membership.status === 'active').length}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4">
                    <FontAwesomeIcon icon={faUserClock} className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Pending KYC</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {members.filter(m => m.kyc.status === 'pending').length}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
                    <FontAwesomeIcon icon={faTrophy} className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Avg Performance</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {Math.round(members.reduce((sum, m) => sum + m.performance.contributionScore, 0) / members.length)}%
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Member Activity</h3>
              <div className="space-y-3">
                {/* Mock recent activities */}
                <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="p-2 bg-green-100 rounded-full">
                    <FontAwesomeIcon icon={faUserPlus} className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">New member registered</p>
                    <p className="text-xs text-gray-600">John Doe joined the chama • 2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="p-2 bg-blue-100 rounded-full">
                    <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">KYC verification completed</p>
                    <p className="text-xs text-gray-600">Mary Smith's documents verified • 5 hours ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'registration' && <MemberRegistrationTab />}
        {activeTab === 'kyc' && <KYCVerificationTab />}
        {activeTab === 'communication' && <CommunicationHubTab />}
        {activeTab === 'analytics' && <MemberAnalyticsTab />}
      </div>
    </div>
  );
};

export default EnhancedMemberManagement;
