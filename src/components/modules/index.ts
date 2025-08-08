/**
 * Enhanced Modules Index
 * Centralized export for all enhanced modules
 */

// Enhanced Modules
export { default as EnhancedMemberManagement } from './EnhancedMemberManagement';
export { default as EnhancedContributionManagement } from './EnhancedContributionManagement';
export { default as EnhancedLoanManagement } from './EnhancedLoanManagement';
export { default as EnhancedFinancialManagement } from './EnhancedFinancialManagement';
export { default as EnhancedMeetingManagement } from './EnhancedMeetingManagement';

// Original Modules (backward compatibility)
export { default as MemberManagement } from './MemberManagement';
export { default as ContributionManagement } from './ContributionManagement';
export { default as LoanManagement } from './LoanManagement';

// Module Registry
export { 
  default as MODULE_REGISTRY,
  MODULE_CATEGORIES,
  MODULE_FEATURES,
  hasModulePermission,
  getModulesByCategory,
  getAvailableModules,
  isModuleEnabled,
  isFeatureEnabled
} from './ModuleRegistry';

// Types
export type { ModuleInfo } from './ModuleRegistry';
