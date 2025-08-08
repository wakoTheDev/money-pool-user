/**
 * Enhanced API services for comprehensive Chama Management Platform
 */

import { ApiResponse, EnhancedMember, EnhancedContribution, EnhancedLoan, EnhancedMeeting, AnalyticsData, Transaction, Investment, Message, ChamaConfiguration } from '@/types/enhanced';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

// Generic API client with error handling and retry logic
class ApiClient {
  private baseURL: string;
  private retryCount: number;
  private timeout: number;

  constructor(baseURL: string = API_BASE_URL, retryCount: number = 3, timeout: number = 30000) {
    this.baseURL = baseURL;
    this.retryCount = retryCount;
    this.timeout = timeout;
  }

  private async makeRequest<T>(
    endpoint: string, 
    options: RequestInit = {}, 
    retries: number = this.retryCount
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        if (retries > 0 && response.status >= 500) {
          await new Promise(resolve => setTimeout(resolve, 1000));
          return this.makeRequest(endpoint, options, retries - 1);
        }
        
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (retries > 0 && (error as Error).name === 'AbortError') {
        return this.makeRequest(endpoint, options, retries - 1);
      }
      
      throw error;
    }
  }

  async get<T>(endpoint: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    const url = params ? `${endpoint}?${new URLSearchParams(params)}` : endpoint;
    return this.makeRequest<T>(url);
  }

  async post<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async patch<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      method: 'DELETE',
    });
  }
}

const apiClient = new ApiClient();

// Enhanced Member Management API
export const enhancedMemberApi = {
  // Basic CRUD operations
  getMembers: (chamaId: string, params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    role?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) => apiClient.get<EnhancedMember[]>(`/chamas/${chamaId}/members`, params),

  getMember: (chamaId: string, memberId: string) => 
    apiClient.get<EnhancedMember>(`/chamas/${chamaId}/members/${memberId}`),

  createMember: (chamaId: string, memberData: Partial<EnhancedMember>) =>
    apiClient.post<EnhancedMember>(`/chamas/${chamaId}/members`, memberData),

  updateMember: (chamaId: string, memberId: string, memberData: Partial<EnhancedMember>) =>
    apiClient.put<EnhancedMember>(`/chamas/${chamaId}/members/${memberId}`, memberData),

  deleteMember: (chamaId: string, memberId: string) =>
    apiClient.delete(`/chamas/${chamaId}/members/${memberId}`),

  // KYC and verification
  uploadKycDocuments: (chamaId: string, memberId: string, documents: FormData) =>
    apiClient.post(`/chamas/${chamaId}/members/${memberId}/kyc/documents`, documents),

  verifyMember: (chamaId: string, memberId: string, verificationData: any) =>
    apiClient.post(`/chamas/${chamaId}/members/${memberId}/kyc/verify`, verificationData),

  // Performance and analytics
  getMemberPerformance: (chamaId: string, memberId: string, period?: string) =>
    apiClient.get(`/chamas/${chamaId}/members/${memberId}/performance`, { period }),

  getMemberContributionHistory: (chamaId: string, memberId: string, params?: any) =>
    apiClient.get(`/chamas/${chamaId}/members/${memberId}/contributions`, params),

  getMemberLoanHistory: (chamaId: string, memberId: string, params?: any) =>
    apiClient.get(`/chamas/${chamaId}/members/${memberId}/loans`, params),

  // Communication preferences
  updateCommunicationPreferences: (chamaId: string, memberId: string, preferences: any) =>
    apiClient.patch(`/chamas/${chamaId}/members/${memberId}/communication`, preferences),

  // Member certificates
  generateMembershipCertificate: (chamaId: string, memberId: string) =>
    apiClient.post(`/chamas/${chamaId}/members/${memberId}/certificate`, {}),
};

// Enhanced Contribution Management API
export const enhancedContributionApi = {
  getContributions: (chamaId: string, params?: {
    page?: number;
    limit?: number;
    memberId?: string;
    type?: string;
    status?: string;
    cycle?: string;
    startDate?: string;
    endDate?: string;
  }) => apiClient.get<EnhancedContribution[]>(`/chamas/${chamaId}/contributions`, params),

  recordContribution: (chamaId: string, contributionData: Partial<EnhancedContribution>) =>
    apiClient.post<EnhancedContribution>(`/chamas/${chamaId}/contributions`, contributionData),

  updateContribution: (chamaId: string, contributionId: string, updates: Partial<EnhancedContribution>) =>
    apiClient.put<EnhancedContribution>(`/chamas/${chamaId}/contributions/${contributionId}`, updates),

  processPayment: (chamaId: string, contributionId: string, paymentData: any) =>
    apiClient.post(`/chamas/${chamaId}/contributions/${contributionId}/payment`, paymentData),

  generateContributionSchedule: (chamaId: string, scheduleData: any) =>
    apiClient.post(`/chamas/${chamaId}/contributions/schedule`, scheduleData),

  getContributionAnalytics: (chamaId: string, period?: string) =>
    apiClient.get<AnalyticsData>(`/chamas/${chamaId}/contributions/analytics`, { period }),

  sendPaymentReminders: (chamaId: string, memberIds?: string[]) =>
    apiClient.post(`/chamas/${chamaId}/contributions/reminders`, { memberIds }),

  exportContributions: (chamaId: string, format: 'csv' | 'excel' | 'pdf', params?: any) =>
    apiClient.get(`/chamas/${chamaId}/contributions/export/${format}`, params),
};

// Enhanced Loan Management API
export const enhancedLoanApi = {
  getLoans: (chamaId: string, params?: {
    page?: number;
    limit?: number;
    memberId?: string;
    status?: string;
    type?: string;
    guarantorId?: string;
  }) => apiClient.get<EnhancedLoan[]>(`/chamas/${chamaId}/loans`, params),

  getLoan: (chamaId: string, loanId: string) =>
    apiClient.get<EnhancedLoan>(`/chamas/${chamaId}/loans/${loanId}`),

  applyForLoan: (chamaId: string, applicationData: Partial<EnhancedLoan>) =>
    apiClient.post<EnhancedLoan>(`/chamas/${chamaId}/loans`, applicationData),

  updateLoanApplication: (chamaId: string, loanId: string, updates: Partial<EnhancedLoan>) =>
    apiClient.put<EnhancedLoan>(`/chamas/${chamaId}/loans/${loanId}`, updates),

  reviewLoan: (chamaId: string, loanId: string, reviewData: any) =>
    apiClient.post(`/chamas/${chamaId}/loans/${loanId}/review`, reviewData),

  approveLoan: (chamaId: string, loanId: string, approvalData: any) =>
    apiClient.post(`/chamas/${chamaId}/loans/${loanId}/approve`, approvalData),

  disburseLoan: (chamaId: string, loanId: string, disbursementData: any) =>
    apiClient.post(`/chamas/${chamaId}/loans/${loanId}/disburse`, disbursementData),

  recordRepayment: (chamaId: string, loanId: string, repaymentData: any) =>
    apiClient.post(`/chamas/${chamaId}/loans/${loanId}/repayment`, repaymentData),

  generateRepaymentSchedule: (loanData: any) =>
    apiClient.post(`/loans/calculate-schedule`, loanData),

  requestGuarantor: (chamaId: string, loanId: string, guarantorData: any) =>
    apiClient.post(`/chamas/${chamaId}/loans/${loanId}/guarantors`, guarantorData),

  respondToGuarantorRequest: (chamaId: string, loanId: string, guarantorId: string, response: 'accept' | 'reject') =>
    apiClient.post(`/chamas/${chamaId}/loans/${loanId}/guarantors/${guarantorId}/respond`, { response }),

  getLoanAnalytics: (chamaId: string, period?: string) =>
    apiClient.get<AnalyticsData>(`/chamas/${chamaId}/loans/analytics`, { period }),
};

// Enhanced Meeting Management API
export const enhancedMeetingApi = {
  getMeetings: (chamaId: string, params?: {
    page?: number;
    limit?: number;
    type?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
  }) => apiClient.get<EnhancedMeeting[]>(`/chamas/${chamaId}/meetings`, params),

  getMeeting: (chamaId: string, meetingId: string) =>
    apiClient.get<EnhancedMeeting>(`/chamas/${chamaId}/meetings/${meetingId}`),

  createMeeting: (chamaId: string, meetingData: Partial<EnhancedMeeting>) =>
    apiClient.post<EnhancedMeeting>(`/chamas/${chamaId}/meetings`, meetingData),

  updateMeeting: (chamaId: string, meetingId: string, updates: Partial<EnhancedMeeting>) =>
    apiClient.put<EnhancedMeeting>(`/chamas/${chamaId}/meetings/${meetingId}`, updates),

  cancelMeeting: (chamaId: string, meetingId: string, reason: string) =>
    apiClient.post(`/chamas/${chamaId}/meetings/${meetingId}/cancel`, { reason }),

  recordAttendance: (chamaId: string, meetingId: string, attendanceData: any) =>
    apiClient.post(`/chamas/${chamaId}/meetings/${meetingId}/attendance`, attendanceData),

  updateMinutes: (chamaId: string, meetingId: string, minutesData: any) =>
    apiClient.put(`/chamas/${chamaId}/meetings/${meetingId}/minutes`, minutesData),

  recordDecision: (chamaId: string, meetingId: string, decisionData: any) =>
    apiClient.post(`/chamas/${chamaId}/meetings/${meetingId}/decisions`, decisionData),

  voteOnMotion: (chamaId: string, meetingId: string, decisionId: string, vote: 'yes' | 'no' | 'abstain') =>
    apiClient.post(`/chamas/${chamaId}/meetings/${meetingId}/decisions/${decisionId}/vote`, { vote }),

  sendMeetingInvitations: (chamaId: string, meetingId: string, channels: string[]) =>
    apiClient.post(`/chamas/${chamaId}/meetings/${meetingId}/invitations`, { channels }),

  generateMeetingReport: (chamaId: string, meetingId: string) =>
    apiClient.get(`/chamas/${chamaId}/meetings/${meetingId}/report`),
};

// Financial Management API
export const financialApi = {
  getAccounts: (chamaId: string) =>
    apiClient.get(`/chamas/${chamaId}/accounts`),

  createAccount: (chamaId: string, accountData: any) =>
    apiClient.post(`/chamas/${chamaId}/accounts`, accountData),

  getTransactions: (chamaId: string, params?: any) =>
    apiClient.get<Transaction[]>(`/chamas/${chamaId}/transactions`, params),

  recordTransaction: (chamaId: string, transactionData: Partial<Transaction>) =>
    apiClient.post<Transaction>(`/chamas/${chamaId}/transactions`, transactionData),

  getFinancialReports: (chamaId: string, reportType: string, period: string) =>
    apiClient.get(`/chamas/${chamaId}/reports/${reportType}`, { period }),

  reconcileAccount: (chamaId: string, accountId: string, reconciliationData: any) =>
    apiClient.post(`/chamas/${chamaId}/accounts/${accountId}/reconcile`, reconciliationData),

  generateAuditTrail: (chamaId: string, params?: any) =>
    apiClient.get(`/chamas/${chamaId}/audit-trail`, params),
};

// Investment Management API
export const investmentApi = {
  getInvestments: (chamaId: string, params?: any) =>
    apiClient.get<Investment[]>(`/chamas/${chamaId}/investments`, params),

  createInvestment: (chamaId: string, investmentData: Partial<Investment>) =>
    apiClient.post<Investment>(`/chamas/${chamaId}/investments`, investmentData),

  updateInvestment: (chamaId: string, investmentId: string, updates: Partial<Investment>) =>
    apiClient.put<Investment>(`/chamas/${chamaId}/investments/${investmentId}`, updates),

  getInvestmentPerformance: (chamaId: string, investmentId: string, period?: string) =>
    apiClient.get(`/chamas/${chamaId}/investments/${investmentId}/performance`, { period }),

  allocateInvestmentShares: (chamaId: string, investmentId: string, allocations: any) =>
    apiClient.post(`/chamas/${chamaId}/investments/${investmentId}/allocate`, allocations),

  getPortfolioSummary: (chamaId: string) =>
    apiClient.get(`/chamas/${chamaId}/portfolio/summary`),
};

// Communication API
export const communicationApi = {
  sendMessage: (chamaId: string, messageData: Partial<Message>) =>
    apiClient.post<Message>(`/chamas/${chamaId}/messages`, messageData),

  getMessages: (chamaId: string, params?: any) =>
    apiClient.get<Message[]>(`/chamas/${chamaId}/messages`, params),

  getMessage: (chamaId: string, messageId: string) =>
    apiClient.get<Message>(`/chamas/${chamaId}/messages/${messageId}`),

  markMessageAsRead: (chamaId: string, messageId: string, memberId: string) =>
    apiClient.post(`/chamas/${chamaId}/messages/${messageId}/read`, { memberId }),

  getNotificationTemplates: (chamaId: string) =>
    apiClient.get(`/chamas/${chamaId}/notification-templates`),

  sendBulkNotification: (chamaId: string, notificationData: any) =>
    apiClient.post(`/chamas/${chamaId}/bulk-notifications`, notificationData),
};

// Analytics API
export const analyticsApi = {
  getDashboardMetrics: (chamaId: string, period?: string) =>
    apiClient.get<AnalyticsData>(`/chamas/${chamaId}/analytics/dashboard`, { period }),

  getMemberAnalytics: (chamaId: string, params?: any) =>
    apiClient.get(`/chamas/${chamaId}/analytics/members`, params),

  getFinancialAnalytics: (chamaId: string, params?: any) =>
    apiClient.get(`/chamas/${chamaId}/analytics/financial`, params),

  getLoanAnalytics: (chamaId: string, params?: any) =>
    apiClient.get(`/chamas/${chamaId}/analytics/loans`, params),

  getPredictiveAnalytics: (chamaId: string, type: string) =>
    apiClient.get(`/chamas/${chamaId}/analytics/predictions/${type}`),

  exportAnalytics: (chamaId: string, type: string, format: string, params?: any) =>
    apiClient.get(`/chamas/${chamaId}/analytics/${type}/export/${format}`, params),
};

// Configuration API
export const configurationApi = {
  getChamaConfiguration: (chamaId: string) =>
    apiClient.get<ChamaConfiguration>(`/chamas/${chamaId}/configuration`),

  updateChamaConfiguration: (chamaId: string, config: Partial<ChamaConfiguration>) =>
    apiClient.put<ChamaConfiguration>(`/chamas/${chamaId}/configuration`, config),

  getSystemSettings: () =>
    apiClient.get('/system/settings'),

  updateSystemSettings: (settings: any) =>
    apiClient.put('/system/settings', settings),
};
