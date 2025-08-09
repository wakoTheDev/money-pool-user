/**
 * Enhanced React hooks for Chama Management Platform
 */

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { ApiResponse, EnhancedMember, EnhancedContribution, EnhancedLoan, EnhancedMeeting, AnalyticsData } from '@/types/enhanced';
import { 
  enhancedMemberApi, 
  enhancedContributionApi, 
  enhancedLoanApi, 
  enhancedMeetingApi,
  analyticsApi 
} from '@/services/enhanced-api';

// Generic API hook with caching and error handling
export function useApiData<T>(
  apiCall: () => Promise<ApiResponse<T>>,
  dependencies: any[] = [],
  options: {
    enabled?: boolean;
    cacheKey?: string;
    cacheTime?: number;
    retryOnError?: boolean;
    retryDelay?: number;
  } = {}
) {
  const {
    enabled = true,
    cacheKey,
    cacheTime = 5 * 60 * 1000, // 5 minutes
    retryOnError = true,
    retryDelay = 1000
  } = options;

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(enabled);
  const [error, setError] = useState<string | null>(null);
  const [lastFetch, setLastFetch] = useState<number>(0);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const fetchData = useCallback(async () => {
    if (!enabled) return;

    // Check cache if available
    if (cacheKey && lastFetch > 0) {
      const now = Date.now();
      if (now - lastFetch < cacheTime) {
        return; // Use cached data
      }
    }

    setLoading(true);
    setError(null);

    try {
      const response = await apiCall();
      if (response.success && response.data) {
        setData(response.data);
        setLastFetch(Date.now());
      } else {
        setError(response.error || 'Failed to fetch data');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      
      // Retry on error if enabled
      if (retryOnError) {
        retryTimeoutRef.current = setTimeout(() => {
          fetchData();
        }, retryDelay);
      }
    } finally {
      setLoading(false);
    }
  }, [apiCall, enabled, cacheKey, cacheTime, lastFetch, retryOnError, retryDelay]);

  useEffect(() => {
    fetchData();
    
    return () => {
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
    };
  }, [fetchData, ...dependencies]);

  const refetch = useCallback(() => {
    setLastFetch(0); // Force refetch
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refetch
  };
}

// Enhanced Member Management Hooks
export function useMembers(chamaId: string, params?: any) {
  return useApiData(
    () => enhancedMemberApi.getMembers(chamaId, params),
    [chamaId, JSON.stringify(params)],
    { cacheKey: `members-${chamaId}` }
  );
}

export function useMember(chamaId: string, memberId: string) {
  return useApiData(
    () => enhancedMemberApi.getMember(chamaId, memberId),
    [chamaId, memberId],
    { cacheKey: `member-${chamaId}-${memberId}` }
  );
}

export function useMemberActions(chamaId: string) {
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const createMember = useCallback(async (memberData: Partial<EnhancedMember>) => {
    setCreating(true);
    try {
      const response = await enhancedMemberApi.createMember(chamaId, memberData);
      return response;
    } finally {
      setCreating(false);
    }
  }, [chamaId]);

  const updateMember = useCallback(async (memberId: string, memberData: Partial<EnhancedMember>) => {
    setUpdating(true);
    try {
      const response = await enhancedMemberApi.updateMember(chamaId, memberId, memberData);
      return response;
    } finally {
      setUpdating(false);
    }
  }, [chamaId]);

  const deleteMember = useCallback(async (memberId: string) => {
    setDeleting(true);
    try {
      const response = await enhancedMemberApi.deleteMember(chamaId, memberId);
      return response;
    } finally {
      setDeleting(false);
    }
  }, [chamaId]);

  return {
    createMember,
    updateMember,
    deleteMember,
    creating,
    updating,
    deleting
  };
}

// Enhanced Contribution Management Hooks
export function useContributions(chamaId: string, params?: any) {
  return useApiData(
    () => enhancedContributionApi.getContributions(chamaId, params),
    [chamaId, JSON.stringify(params)],
    { cacheKey: `contributions-${chamaId}` }
  );
}

export function useContributionAnalytics(chamaId: string, period?: string) {
  return useApiData(
    () => enhancedContributionApi.getContributionAnalytics(chamaId, period),
    [chamaId, period],
    { cacheKey: `contribution-analytics-${chamaId}-${period}` }
  );
}

export function useContributionActions(chamaId: string) {
  const [processing, setProcessing] = useState(false);

  const recordContribution = useCallback(async (contributionData: Partial<EnhancedContribution>) => {
    setProcessing(true);
    try {
      const response = await enhancedContributionApi.recordContribution(chamaId, contributionData);
      return response;
    } finally {
      setProcessing(false);
    }
  }, [chamaId]);

  const processPayment = useCallback(async (contributionId: string, paymentData: any) => {
    setProcessing(true);
    try {
      const response = await enhancedContributionApi.processPayment(chamaId, contributionId, paymentData);
      return response;
    } finally {
      setProcessing(false);
    }
  }, [chamaId]);

  return {
    recordContribution,
    processPayment,
    processing
  };
}

// Enhanced Loan Management Hooks
export function useLoans(chamaId: string, params?: any) {
  return useApiData(
    () => enhancedLoanApi.getLoans(chamaId, params),
    [chamaId, JSON.stringify(params)],
    { cacheKey: `loans-${chamaId}` }
  );
}

export function useLoan(chamaId: string, loanId: string) {
  return useApiData(
    () => enhancedLoanApi.getLoan(chamaId, loanId),
    [chamaId, loanId],
    { cacheKey: `loan-${chamaId}-${loanId}` }
  );
}

export function useLoanActions(chamaId: string) {
  const [applying, setApplying] = useState(false);
  const [reviewing, setReviewing] = useState(false);
  const [disbursing, setDisbursing] = useState(false);

  const applyForLoan = useCallback(async (applicationData: Partial<EnhancedLoan>) => {
    setApplying(true);
    try {
      const response = await enhancedLoanApi.applyForLoan(chamaId, applicationData);
      return response;
    } finally {
      setApplying(false);
    }
  }, [chamaId]);

  const reviewLoan = useCallback(async (loanId: string, reviewData: any) => {
    setReviewing(true);
    try {
      const response = await enhancedLoanApi.reviewLoan(chamaId, loanId, reviewData);
      return response;
    } finally {
      setReviewing(false);
    }
  }, [chamaId]);

  const disburseLoan = useCallback(async (loanId: string, disbursementData: any) => {
    setDisbursing(true);
    try {
      const response = await enhancedLoanApi.disburseLoan(chamaId, loanId, disbursementData);
      return response;
    } finally {
      setDisbursing(false);
    }
  }, [chamaId]);

  return {
    applyForLoan,
    reviewLoan,
    disburseLoan,
    applying,
    reviewing,
    disbursing
  };
}

// Enhanced Meeting Management Hooks
export function useMeetings(chamaId: string, params?: any) {
  return useApiData(
    () => enhancedMeetingApi.getMeetings(chamaId, params),
    [chamaId, JSON.stringify(params)],
    { cacheKey: `meetings-${chamaId}` }
  );
}

export function useMeeting(chamaId: string, meetingId: string) {
  return useApiData(
    () => enhancedMeetingApi.getMeeting(chamaId, meetingId),
    [chamaId, meetingId],
    { cacheKey: `meeting-${chamaId}-${meetingId}` }
  );
}

export function useMeetingActions(chamaId: string) {
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);

  const createMeeting = useCallback(async (meetingData: Partial<EnhancedMeeting>) => {
    setCreating(true);
    try {
      const response = await enhancedMeetingApi.createMeeting(chamaId, meetingData);
      return response;
    } finally {
      setCreating(false);
    }
  }, [chamaId]);

  const updateMeeting = useCallback(async (meetingId: string, updates: Partial<EnhancedMeeting>) => {
    setUpdating(true);
    try {
      const response = await enhancedMeetingApi.updateMeeting(chamaId, meetingId, updates);
      return response;
    } finally {
      setUpdating(false);
    }
  }, [chamaId]);

  const recordAttendance = useCallback(async (meetingId: string, attendanceData: any) => {
    const response = await enhancedMeetingApi.recordAttendance(chamaId, meetingId, attendanceData);
    return response;
  }, [chamaId]);

  return {
    createMeeting,
    updateMeeting,
    recordAttendance,
    creating,
    updating
  };
}

// Analytics Hooks
export function useDashboardMetrics(chamaId: string, period?: string) {
  return useApiData(
    () => analyticsApi.getDashboardMetrics(chamaId, period),
    [chamaId, period],
    { 
      cacheKey: `dashboard-metrics-${chamaId}-${period}`,
      cacheTime: 2 * 60 * 1000 // 2 minutes for dashboard data
    }
  );
}

// Real-time data hooks
export function useRealTimeData<T>(
  apiCall: () => Promise<ApiResponse<T>>,
  interval: number = 30000, // 30 seconds
  dependencies: any[] = []
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const response = await apiCall();
      if (response.success && response.data) {
        setData(response.data);
        setError(null);
      } else {
        setError(response.error || 'Failed to fetch data');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [apiCall]);

  useEffect(() => {
    fetchData();
    
    intervalRef.current = setInterval(fetchData, interval);
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [fetchData, interval, ...dependencies]);

  return { data, loading, error, refetch: fetchData };
}

// Form validation hooks
export function useFormValidation<T>(
  initialValues: T,
  validationRules: Record<keyof T, (value: any) => string | null>
) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touchedFields, setTouchedFields] = useState<Partial<Record<keyof T, boolean>>>({});

  const validateField = useCallback((field: keyof T, value: any) => {
    const rule = validationRules[field];
    return rule ? rule(value) : null;
  }, [validationRules]);

  const setValue = useCallback((field: keyof T, value: any) => {
    setValues(prev => ({ ...prev, [field]: value }));
    
    // Validate field if it's been touched
    if (touchedFields[field]) {
      const error = validateField(field, value);
      setErrors(prev => ({ ...prev, [field]: error || undefined }));
    }
  }, [touchedFields, validateField]);

  const setFieldTouched = useCallback((field: keyof T, isTouched: boolean = true) => {
    setTouchedFields(prev => ({ ...prev, [field]: isTouched }));
    
    if (isTouched) {
      const error = validateField(field, values[field]);
      setErrors(prev => ({ ...prev, [field]: error || undefined }));
    }
  }, [validateField, values]);

  const validateAll = useCallback(() => {
    const newErrors: Partial<Record<keyof T, string>> = {};
    let isValid = true;

    Object.keys(validationRules).forEach(key => {
      const field = key as keyof T;
      const error = validateField(field, values[field]);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [validationRules, validateField, values]);

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouchedFields({});
  }, [initialValues]);

  const isValid = useMemo(() => {
    return Object.keys(errors).length === 0;
  }, [errors]);

  return {
    values,
    errors,
    touched: touchedFields,
    setValue,
    setTouched: setFieldTouched,
    validateAll,
    reset,
    isValid
  };
}

// Pagination hook
export function usePagination(initialPage: number = 1, initialLimit: number = 10) {
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const [total, setTotal] = useState(0);

  const totalPages = useMemo(() => Math.ceil(total / limit), [total, limit]);
  const hasNext = useMemo(() => page < totalPages, [page, totalPages]);
  const hasPrev = useMemo(() => page > 1, [page]);

  const goToPage = useCallback((newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  }, [totalPages]);

  const nextPage = useCallback(() => {
    if (hasNext) setPage(prev => prev + 1);
  }, [hasNext]);

  const prevPage = useCallback(() => {
    if (hasPrev) setPage(prev => prev - 1);
  }, [hasPrev]);

  const changeLimit = useCallback((newLimit: number) => {
    setLimit(newLimit);
    setPage(1); // Reset to first page when changing limit
  }, []);

  return {
    page,
    limit,
    total,
    totalPages,
    hasNext,
    hasPrev,
    setTotal,
    goToPage,
    nextPage,
    prevPage,
    changeLimit
  };
}

// Local storage hook
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      if (typeof window !== 'undefined') {
        const item = window.localStorage.getItem(key);
        return item ? JSON.parse(item) : initialValue;
      }
      return initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setValue] as const;
}
