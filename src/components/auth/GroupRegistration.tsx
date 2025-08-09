/**
 * Group Registration Component
 */

import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUsers, faBuilding, faEnvelope, faPhone, faGlobe, faMapMarkerAlt,
  faFileText, faUpload, faSpinner, faInfoCircle, faCheck, faTimes
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '@/hooks/useAuth';
import { GroupRegistrationData, ChamaType } from '@/types/auth';

interface GroupRegistrationProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

const GroupRegistration: React.FC<GroupRegistrationProps> = ({ onSuccess, onCancel }) => {
  const { registerGroup, isLoading, error, clearError } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<GroupRegistrationData>({
    groupName: '',
    description: '',
    category: 'savings',
    meetingFrequency: 'monthly',
    contributionAmount: 1000,
    currency: 'KES',
    maxMembers: 10,
    registrationFee: 500,
    location: {
      county: '',
      constituency: '',
      ward: '',
      address: ''
    },
    contactInfo: {
      email: '',
      phone: '',
      alternativePhone: ''
    },
    leaderInfo: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      idNumber: ''
    },
    documents: {}
  });
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [dataPrivacyAccepted, setDataPrivacyAccepted] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const steps = [
    { number: 1, title: 'Group Information', description: 'Basic group details' },
    { number: 2, title: 'Administrator Details', description: 'Group admin information' },
    { number: 3, title: 'Documents & Terms', description: 'Required documents and agreements' }
  ];

  const validateStep = (step: number): boolean => {
    const errors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.groupName.trim()) {
        errors.groupName = 'Group name is required';
      }
      if (!formData.description.trim()) {
        errors.description = 'Group description is required';
      }
      if (!formData.location.county.trim()) {
        errors.location = 'County is required';
      }
      if (!formData.location.constituency.trim()) {
        errors.constituency = 'Constituency is required';
      }
      if (!formData.location.ward.trim()) {
        errors.ward = 'Ward is required';
      }
      if (formData.maxMembers < 5 || formData.maxMembers > 50) {
        errors.maxMembers = 'Maximum members must be between 5 and 50';
      }
      if (formData.contributionAmount < 100) {
        errors.contributionAmount = 'Contribution amount must be at least KES 100';
      }
    }

    if (step === 2) {
      if (!formData.leaderInfo.firstName.trim()) {
        errors.adminFirstName = 'Leader first name is required';
      }
      if (!formData.leaderInfo.lastName.trim()) {
        errors.adminLastName = 'Leader last name is required';
      }
      if (!formData.leaderInfo.email.trim()) {
        errors.adminEmail = 'Leader email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.leaderInfo.email)) {
        errors.adminEmail = 'Please enter a valid email address';
      }
      if (!formData.leaderInfo.phone.trim()) {
        errors.adminPhone = 'Leader phone is required';
      }
      if (!formData.leaderInfo.idNumber.trim()) {
        errors.adminIdNumber = 'Leader ID number is required';
      }
    }

    if (step === 3) {
      if (uploadedFiles.length === 0) {
        errors.documents = 'At least one registration document is required';
      }
      if (!termsAccepted) {
        errors.termsAccepted = 'You must accept the terms and conditions';
      }
      if (!dataPrivacyAccepted) {
        errors.dataPrivacyAccepted = 'You must accept the data privacy policy';
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 3));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (!validateStep(3)) {
      return;
    }

    try {
      const registrationData = {
        ...formData,
        registrationDocuments: uploadedFiles.map(file => ({
          name: file.name,
          type: file.type,
          size: file.size
        }))
      };
      
      await registerGroup(registrationData);
      onSuccess?.();
    } catch (err) {
      // Error is handled by the auth context
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    if (name.startsWith('leader.')) {
      const leaderField = name.replace('leader.', '');
      setFormData(prev => ({
        ...prev,
        leaderInfo: {
          ...prev.leaderInfo,
          [leaderField]: value
        }
      }));
    } else if (name.startsWith('location.')) {
      const locationField = name.replace('location.', '');
      setFormData(prev => ({
        ...prev,
        location: {
          ...prev.location,
          [locationField]: value
        }
      }));
    } else if (name.startsWith('contact.')) {
      const contactField = name.replace('contact.', '');
      setFormData(prev => ({
        ...prev,
        contactInfo: {
          ...prev.contactInfo,
          [contactField]: value
        }
      }));
    } else if (name === 'termsAccepted') {
      setTermsAccepted(checked);
    } else if (name === 'dataPrivacyAccepted') {
      setDataPrivacyAccepted(checked);
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : type === 'number' ? Number(value) : value
      }));
    }

    // Clear validation error when user starts typing
    const errorKey = name.replace('admin.', 'admin');
    if (validationErrors[errorKey]) {
      setValidationErrors(prev => ({
        ...prev,
        [errorKey]: ''
      }));
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setUploadedFiles(prev => [...prev, ...files]);
    
    if (validationErrors.documents) {
      setValidationErrors(prev => ({
        ...prev,
        documents: ''
      }));
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div>
        <label htmlFor="groupName" className="block text-sm font-medium text-gray-700">
          Group Name *
        </label>
        <div className="mt-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FontAwesomeIcon icon={faUsers} className="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="groupName"
            name="groupName"
            type="text"
            required
            value={formData.groupName}
            onChange={handleInputChange}
            className={`block w-full pl-10 pr-3 py-3 border ${
              validationErrors.groupName ? 'border-red-300' : 'border-gray-300'
            } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm`}
            placeholder="Enter group name"
          />
        </div>
        {validationErrors.groupName && (
          <p className="mt-1 text-sm text-red-600">{validationErrors.groupName}</p>
        )}
      </div>

      <div>
        <label htmlFor="groupType" className="block text-sm font-medium text-gray-700">
          Group Type *
        </label>
        <div className="mt-1">
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            className="block w-full px-3 py-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
          >
            <option value="saving">Savings Group</option>
            <option value="credit">Credit Group</option>
            <option value="investment">Investment Group</option>
            <option value="table_banking">Table Banking</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Group Description *
        </label>
        <div className="mt-1">
          <textarea
            id="description"
            name="description"
            rows={4}
            value={formData.description}
            onChange={handleInputChange}
            className={`block w-full px-3 py-3 border ${
              validationErrors.description ? 'border-red-300' : 'border-gray-300'
            } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm`}
            placeholder="Describe your group's purpose and activities"
          />
        </div>
        {validationErrors.description && (
          <p className="mt-1 text-sm text-red-600">{validationErrors.description}</p>
        )}
      </div>

      <div>
        <label htmlFor="location" className="block text-sm font-medium text-gray-700">
          Location *
        </label>
        <div className="mt-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FontAwesomeIcon icon={faMapMarkerAlt} className="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="county"
            name="location.county"
            type="text"
            required
            placeholder="County"
            value={formData.location.county}
            onChange={handleInputChange}
            className={`block w-full pl-10 pr-3 py-3 border ${
              validationErrors.location ? 'border-red-300' : 'border-gray-300'
            } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm mb-2`}
          />
          <input
            id="constituency"
            name="location.constituency"
            type="text"
            required
            placeholder="Constituency"
            value={formData.location.constituency}
            onChange={handleInputChange}
            className={`block w-full pl-10 pr-3 py-3 border ${
              validationErrors.location ? 'border-red-300' : 'border-gray-300'
            } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm mb-2`}
          />
          <input
            id="ward"
            name="location.ward"
            type="text"
            required
            placeholder="Ward"
            value={formData.location.ward}
            onChange={handleInputChange}
            className={`block w-full pl-10 pr-3 py-3 border ${
              validationErrors.location ? 'border-red-300' : 'border-gray-300'
            } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm mb-2`}
          />
          <input
            id="address"
            name="location.address"
            type="text"
            placeholder="Address (Optional)"
            value={formData.location.address || ''}
            onChange={handleInputChange}
            className={`block w-full pl-10 pr-3 py-3 border ${
              validationErrors.location ? 'border-red-300' : 'border-gray-300'
            } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm`}
          />
        </div>
        {validationErrors.location && (
          <p className="mt-1 text-sm text-red-600">{validationErrors.location}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="maxMembers" className="block text-sm font-medium text-gray-700">
            Maximum Members *
          </label>
          <div className="mt-1">
            <input
              id="maxMembers"
              name="maxMembers"
              type="number"
              min="5"
              max="50"
              required
              value={formData.maxMembers}
              onChange={handleInputChange}
              className={`block w-full px-3 py-3 border ${
                validationErrors.maxMembers ? 'border-red-300' : 'border-gray-300'
              } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm`}
            />
          </div>
          {validationErrors.maxMembers && (
            <p className="mt-1 text-sm text-red-600">{validationErrors.maxMembers}</p>
          )}
        </div>

        <div>
          <label htmlFor="contributionAmount" className="block text-sm font-medium text-gray-700">
            Contribution Amount (KES) *
          </label>
          <div className="mt-1">
            <input
              id="contributionAmount"
              name="contributionAmount"
              type="number"
              min="100"
              required
              value={formData.contributionAmount}
              onChange={handleInputChange}
              className={`block w-full px-3 py-3 border ${
                validationErrors.contributionAmount ? 'border-red-300' : 'border-gray-300'
              } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm`}
            />
          </div>
          {validationErrors.contributionAmount && (
            <p className="mt-1 text-sm text-red-600">{validationErrors.contributionAmount}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="meetingFrequency" className="block text-sm font-medium text-gray-700">
          Meeting Frequency *
        </label>
        <div className="mt-1">
          <select
            id="meetingFrequency"
            name="meetingFrequency"
            value={formData.meetingFrequency}
            onChange={handleInputChange}
            className="block w-full px-3 py-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
          >
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
        <div className="flex">
          <FontAwesomeIcon icon={faInfoCircle} className="h-5 w-5 text-blue-400 mt-0.5" />
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">
              Administrator Information
            </h3>
            <div className="mt-2 text-sm text-blue-700">
              This person will be the primary administrator for the group and will have full management privileges.
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="admin.firstName" className="block text-sm font-medium text-gray-700">
            First Name *
          </label>
          <div className="mt-1">
            <input
              id="admin.firstName"
              name="admin.firstName"
              type="text"
              required
              value={formData.leaderInfo.firstName}
              onChange={handleInputChange}
              className={`block w-full px-3 py-3 border ${
                validationErrors.adminFirstName ? 'border-red-300' : 'border-gray-300'
              } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm`}
              placeholder="First Name"
            />
          </div>
          {validationErrors.adminFirstName && (
            <p className="mt-1 text-sm text-red-600">{validationErrors.adminFirstName}</p>
          )}
        </div>

        <div>
          <label htmlFor="admin.lastName" className="block text-sm font-medium text-gray-700">
            Last Name *
          </label>
          <div className="mt-1">
            <input
              id="admin.lastName"
              name="admin.lastName"
              type="text"
              required
              value={formData.leaderInfo.lastName}
              onChange={handleInputChange}
              className={`block w-full px-3 py-3 border ${
                validationErrors.adminLastName ? 'border-red-300' : 'border-gray-300'
              } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm`}
              placeholder="Last Name"
            />
          </div>
          {validationErrors.adminLastName && (
            <p className="mt-1 text-sm text-red-600">{validationErrors.adminLastName}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="admin.email" className="block text-sm font-medium text-gray-700">
          Email Address *
        </label>
        <div className="mt-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FontAwesomeIcon icon={faEnvelope} className="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="admin.email"
            name="admin.email"
            type="email"
            required
            value={formData.leaderInfo.email}
            onChange={handleInputChange}
            className={`block w-full pl-10 pr-3 py-3 border ${
              validationErrors.adminEmail ? 'border-red-300' : 'border-gray-300'
            } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm`}
            placeholder="Email Address"
          />
        </div>
        {validationErrors.adminEmail && (
          <p className="mt-1 text-sm text-red-600">{validationErrors.adminEmail}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="admin.phone" className="block text-sm font-medium text-gray-700">
            Phone Number *
          </label>
          <div className="mt-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FontAwesomeIcon icon={faPhone} className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="admin.phone"
              name="admin.phone"
              type="tel"
              required
              value={formData.leaderInfo.phone}
              onChange={handleInputChange}
              className={`block w-full pl-10 pr-3 py-3 border ${
                validationErrors.adminPhone ? 'border-red-300' : 'border-gray-300'
              } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm`}
              placeholder="+254 700 000 000"
            />
          </div>
          {validationErrors.adminPhone && (
            <p className="mt-1 text-sm text-red-600">{validationErrors.adminPhone}</p>
          )}
        </div>

        <div>
          <label htmlFor="admin.idNumber" className="block text-sm font-medium text-gray-700">
            ID Number *
          </label>
          <div className="mt-1">
            <input
              id="admin.idNumber"
              name="admin.idNumber"
              type="text"
              required
              value={formData.leaderInfo.idNumber}
              onChange={handleInputChange}
              className={`block w-full px-3 py-3 border ${
                validationErrors.adminIdNumber ? 'border-red-300' : 'border-gray-300'
              } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm`}
              placeholder="National ID Number"
            />
          </div>
          {validationErrors.adminIdNumber && (
            <p className="mt-1 text-sm text-red-600">{validationErrors.adminIdNumber}</p>
          )}
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Registration Documents *
        </label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <FontAwesomeIcon icon={faUpload} className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <div className="text-sm text-gray-600 mb-4">
            Upload required documents (ID copy, proof of address, constitution if applicable)
          </div>
          <input
            type="file"
            multiple
            onChange={handleFileUpload}
            className="hidden"
            id="file-upload"
            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
          />
          <label
            htmlFor="file-upload"
            className="cursor-pointer inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
          >
            Select Files
          </label>
        </div>
        {validationErrors.documents && (
          <p className="mt-1 text-sm text-red-600">{validationErrors.documents}</p>
        )}
      </div>

      {uploadedFiles.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Uploaded Files:</h4>
          <div className="space-y-2">
            {uploadedFiles.map((file, index) => (
              <div key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-md">
                <div className="flex items-center">
                  <FontAwesomeIcon icon={faFileText} className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-900">{file.name}</span>
                  <span className="text-xs text-gray-500 ml-2">
                    ({Math.round(file.size / 1024)} KB)
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  <FontAwesomeIcon icon={faTimes} className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-4">
        <div className="flex items-center">
          <input
            id="termsAccepted"
            name="termsAccepted"
            type="checkbox"
            checked={formData.termsAccepted}
            onChange={handleInputChange}
            className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
          />
          <label htmlFor="termsAccepted" className="ml-2 block text-sm text-gray-900">
            I agree to the{' '}
            <a href="#" className="text-green-600 hover:text-green-500">
              Terms and Conditions
            </a>
          </label>
        </div>
        {validationErrors.termsAccepted && (
          <p className="text-sm text-red-600">{validationErrors.termsAccepted}</p>
        )}

        <div className="flex items-center">
          <input
            id="dataPrivacyAccepted"
            name="dataPrivacyAccepted"
            type="checkbox"
            checked={formData.dataPrivacyAccepted}
            onChange={handleInputChange}
            className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
          />
          <label htmlFor="dataPrivacyAccepted" className="ml-2 block text-sm text-gray-900">
            I agree to the{' '}
            <a href="#" className="text-green-600 hover:text-green-500">
              Data Privacy Policy
            </a>
          </label>
        </div>
        {validationErrors.dataPrivacyAccepted && (
          <p className="text-sm text-red-600">{validationErrors.dataPrivacyAccepted}</p>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          {/* Header */}
          <div className="bg-green-600 px-6 py-4">
            <h2 className="text-2xl font-bold text-white">Register a New Chama</h2>
            <p className="text-green-100 mt-1">Create your financial group</p>
          </div>

          {/* Progress Steps */}
          <div className="bg-gray-50 px-6 py-4">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.number} className="flex items-center">
                  <div className={`
                    flex items-center justify-center w-8 h-8 rounded-full border-2 text-sm font-medium
                    ${currentStep >= step.number 
                      ? 'bg-green-600 border-green-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-500'
                    }
                  `}>
                    {currentStep > step.number ? (
                      <FontAwesomeIcon icon={faCheck} className="w-4 h-4" />
                    ) : (
                      step.number
                    )}
                  </div>
                  <div className="ml-2">
                    <div className="text-sm font-medium text-gray-900">{step.title}</div>
                    <div className="text-xs text-gray-500">{step.description}</div>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`
                      w-16 h-0.5 mx-4
                      ${currentStep > step.number ? 'bg-green-600' : 'bg-gray-300'}
                    `} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="px-6 py-6">
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
                <div className="flex">
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                      Registration Error
                    </h3>
                    <div className="mt-2 text-sm text-red-700">
                      {error}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6">
              <div>
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={handlePrevious}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Previous
                  </button>
                )}
              </div>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={onCancel}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Cancel
                </button>

                {currentStep < 3 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading && (
                      <FontAwesomeIcon icon={faSpinner} className="animate-spin -ml-1 mr-2 h-4 w-4" />
                    )}
                    {isLoading ? 'Submitting...' : 'Submit Registration'}
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default GroupRegistration;
