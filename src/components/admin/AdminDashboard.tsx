/**
 * Comprehensive Admin Dashboard Component
 * Full control and management interface for the entire MoneyPool platform
 */

import React, { useState, useEffect, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTachometerAlt, faUsers, faBuilding, faCheck, faTimes, faEye, faBan, faPlay,
  faDatabase, faShieldAlt, faChartLine, faFileAlt, faExclamationTriangle, faCrown,
  faRefresh, faDownload, faCog, faUserCheck, faUserTimes, faSpinner, faEdit,
  faTrashAlt, faPlus, faSave, faSearch, faFilter, faSort, 
  faMoneyBillWave, faHandHoldingUsd, faCalendarAlt, faEnvelope, faBell,
  faLock, faUnlock, faKey, faSync, faHistory,
  faUserShield, faUserCog, faGavel, faBalanceScale, faChartBar, faChartPie,
  faListAlt, faClipboardList, faFolder, faArchive, faCloud, faServer,
  faMobile, faDesktop, faTablet, faGlobe, faWifi, faNetworkWired,
  faDollarSign, faClock, faUserTie, faArrowUp, faArrowDown, faCheckCircle
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '@/hooks/useAuth';
import { AdminStats, GroupRegistrationData, User } from '@/types/auth';

interface AdminDashboardProps {
  onClose?: () => void;
}

// Enhanced admin interface types
interface SystemMetrics {
  serverHealth: {
    status: 'healthy' | 'warning' | 'critical';
    uptime: string;
    cpuUsage: number;
    memoryUsage: number;
    diskUsage: number;
    responseTime: number;
  };
  databaseMetrics: {
    connections: number;
    queryPerformance: number;
    storageUsed: number;
    backupStatus: 'current' | 'overdue' | 'failed';
    lastBackup: string;
  };
  platformMetrics: {
    dailyActiveUsers: number;
    transactionVolume: number;
    errorRate: number;
    apiLatency: number;
  };
}

interface UserAction {
  id: string;
  userId: string;
  action: string;
  details: string;
  timestamp: string;
  ipAddress: string;
  userAgent: string;
  status: 'success' | 'failed' | 'suspicious';
}

interface SystemAlert {
  id: string;
  type: 'security' | 'performance' | 'system' | 'business';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  timestamp: string;
  status: 'new' | 'acknowledged' | 'resolved';
  actionRequired?: string;
}

interface BulkOperation {
  id: string;
  type: 'user_action' | 'group_action' | 'financial_action' | 'system_action';
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number;
  affectedItems: number;
  details: string;
  startedAt: string;
  completedAt?: string;
}

interface FinancialOverview {
  totalPlatformValue: number;
  totalContributions: number;
  totalLoans: number;
  totalInvestments: number;
  pendingTransactions: number;
  disputedTransactions: number;
  monthlyGrowth: number;
  revenueMetrics: {
    subscriptionRevenue: number;
    transactionFees: number;
    premiumFeatures: number;
    totalRevenue: number;
  };
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onClose }) => {
  const { user, hasPermission } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [activeSubTab, setActiveSubTab] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [selectedMember, setSelectedMember] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [editingItem, setEditingItem] = useState<any>(null);
  const [dateFilter, setDateFilter] = useState({ start: '', end: '' });
  const [statusFilter, setStatusFilter] = useState('all');

  // Core data states
  const [stats, setStats] = useState<AdminStats>({
    totalGroups: 0,
    pendingVerifications: 0,
    activeGroups: 0,
    totalMembers: 0,
    totalTransactions: 0,
    totalVolume: 0,
    growthMetrics: {
      groupsThisMonth: 0,
      membersThisMonth: 0,
      volumeThisMonth: 0
    },
    recentActivity: []
  });
  
  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics>({
    serverHealth: {
      status: 'healthy',
      uptime: '99.9%',
      cpuUsage: 45,
      memoryUsage: 62,
      diskUsage: 78,
      responseTime: 120
    },
    databaseMetrics: {
      connections: 45,
      queryPerformance: 95,
      storageUsed: 78,
      backupStatus: 'current',
      lastBackup: '2024-08-08 02:00:00'
    },
    platformMetrics: {
      dailyActiveUsers: 1247,
      transactionVolume: 2340000,
      errorRate: 0.01,
      apiLatency: 89
    }
  });

  const [financialOverview, setFinancialOverview] = useState<FinancialOverview>({
    totalPlatformValue: 45680000,
    totalContributions: 35000000,
    totalLoans: 8500000,
    totalInvestments: 2180000,
    pendingTransactions: 125,
    disputedTransactions: 8,
    monthlyGrowth: 12.5,
    revenueMetrics: {
      subscriptionRevenue: 125000,
      transactionFees: 45000,
      premiumFeatures: 28000,
      totalRevenue: 198000
    }
  });

  const [pendingGroups, setPendingGroups] = useState<GroupRegistrationData[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [systemAlerts, setSystemAlerts] = useState<SystemAlert[]>([]);
  const [userActions, setUserActions] = useState<UserAction[]>([]);
  const [bulkOperations, setBulkOperations] = useState<BulkOperation[]>([]);
  
  // Enhanced group management data
  const [allGroups, setAllGroups] = useState<any[]>([]);
  const [groupMembers, setGroupMembers] = useState<{ [key: string]: any[] }>({});
  const [groupContributions, setGroupContributions] = useState<{ [key: string]: any[] }>({});
  const [groupLoans, setGroupLoans] = useState<{ [key: string]: any[] }>({});
  const [groupMeetings, setGroupMeetings] = useState<{ [key: string]: any[] }>({});
  const [memberActivities, setMemberActivities] = useState<{ [key: string]: any[] }>({});
  const [groupReports, setGroupReports] = useState<{ [key: string]: any }>({});

  useEffect(() => {
    loadDashboardData();
    // Set up real-time data refresh
    const interval = setInterval(loadDashboardData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  // Comprehensive data loading function
  const loadDashboardData = useCallback(async () => {
    setIsLoading(true);
    try {
      await Promise.all([
        loadStats(),
        loadUsers(),
        loadGroups(),
        loadSystemMetrics(),
        loadSystemAlerts(),
        loadUserActions(),
        loadBulkOperations(),
        loadAllGroups(),
        loadGroupsData()
      ]);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadStats = async () => {
    // Mock enhanced stats - replace with real API
    const mockStats: AdminStats = {
      totalGroups: 189,
      pendingVerifications: 23,
      activeGroups: 166,
      totalMembers: 3247,
      totalTransactions: 145632,
      totalVolume: 45680000,
      growthMetrics: {
        groupsThisMonth: 18,
        membersThisMonth: 256,
        volumeThisMonth: 3240000
      },
      recentActivity: [
        {
          id: '1',
          type: 'group_registered',
          description: 'Makueni Farmers Group registered with 25 members',
          timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
          groupId: 'group-makueni'
        },
        {
          id: '2',
          type: 'transaction',
          description: 'Large loan disbursement of KES 500,000 processed',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '3',
          type: 'member_joined',
          description: 'System onboarded 12 new members today',
          timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString()
        }
      ]
    };
    setStats(mockStats);
  };

  const loadUsers = async () => {
    // Enhanced user data with more comprehensive information
    const mockUsers: User[] = [
      {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '+254700000001',
        role: 'group_leader',
        status: 'active',
        emailVerified: true,
        phoneVerified: true,
        chamaId: 'chama-1',
        createdAt: '2024-01-15T00:00:00.000Z',
        updatedAt: '2024-12-20T00:00:00.000Z',
        lastLoginAt: '2024-12-20T00:00:00.000Z',
        permissions: ['members.view', 'contributions.create', 'loans.approve']
      },
      {
        id: '2',
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@example.com',
        phone: '+254700000002',
        role: 'member',
        status: 'active',
        emailVerified: true,
        phoneVerified: true,
        chamaId: 'chama-2',
        createdAt: '2024-02-10T00:00:00.000Z',
        updatedAt: '2024-12-19T00:00:00.000Z',
        lastLoginAt: '2024-12-19T00:00:00.000Z',
        permissions: ['members.view', 'contributions.create']
      },
      {
        id: '3',
        firstName: 'Peter',
        lastName: 'Kamau',
        email: 'peter.kamau@gmail.com',
        phone: '+254700000003',
        role: 'member',
        status: 'suspended',
        emailVerified: true,
        phoneVerified: false,
        chamaId: 'chama-1',
        createdAt: '2024-03-05T00:00:00.000Z',
        updatedAt: '2024-12-10T00:00:00.000Z',
        lastLoginAt: '2024-12-10T00:00:00.000Z',
        permissions: ['members.view']
      }
    ];
    setUsers(mockUsers);
  };

  const loadGroups = async () => {
    // Enhanced group data
    const mockGroups: GroupRegistrationData[] = [
      {
        groupName: 'Kibera Savings Circle',
        description: 'Community savings group for small business owners',
        category: 'savings',
        meetingFrequency: 'weekly',
        contributionAmount: 1000,
        currency: 'KES',
        maxMembers: 20,
        registrationFee: 500,
        location: {
          county: 'Nairobi',
          constituency: 'Kibera',
          ward: 'Laini Saba',
          address: 'Kibera Market Area'
        },
        contactInfo: {
          email: 'kibera.savings@gmail.com',
          phone: '+254722123456'
        },
        leaderInfo: {
          firstName: 'Mary',
          lastName: 'Wanjiku',
          email: 'mary.wanjiku@gmail.com',
          phone: '+254722123456',
          idNumber: '12345678'
        },
        documents: {},
        termsAccepted: true,
        dataPrivacyAccepted: true
      }
    ];
    setPendingGroups(mockGroups);
  };

  const loadSystemMetrics = async () => {
    // Real-time system metrics would be loaded here
    // Current implementation uses static data
  };

  const loadSystemAlerts = async () => {
    const mockAlerts: SystemAlert[] = [
      {
        id: '1',
        type: 'security',
        severity: 'high',
        title: 'Multiple failed login attempts detected',
        description: 'User peter.kamau@gmail.com has 5 failed login attempts in the last hour',
        timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        status: 'new',
        actionRequired: 'Review and possibly suspend account'
      },
      {
        id: '2',
        type: 'system',
        severity: 'medium',
        title: 'Database backup taking longer than usual',
        description: 'Current backup process is 15 minutes over expected duration',
        timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
        status: 'acknowledged'
      }
    ];
    setSystemAlerts(mockAlerts);
  };

  const loadUserActions = async () => {
    const mockActions: UserAction[] = [
      {
        id: '1',
        userId: 'admin-1',
        action: 'User account suspended',
        details: 'Suspended user peter.kamau@gmail.com for policy violation',
        timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
        ipAddress: '192.168.1.1',
        userAgent: 'Mozilla/5.0...',
        status: 'success'
      }
    ];
    setUserActions(mockActions);
  };

  const loadBulkOperations = async () => {
    const mockOperations: BulkOperation[] = [
      {
        id: '1',
        type: 'user_action',
        status: 'completed',
        progress: 100,
        affectedItems: 150,
        details: 'Email verification reminders sent to all unverified users',
        startedAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
        completedAt: new Date(Date.now() - 45 * 60 * 1000).toISOString()
      }
    ];
    setBulkOperations(mockOperations);
  };

  // Enhanced Group Management Data Loading Functions
  const loadAllGroups = async () => {
    const mockGroups = [
      {
        id: 'group-1',
        name: 'Kibera Savings Circle',
        category: 'savings',
        status: 'active',
        memberCount: 25,
        totalContributions: 1250000,
        totalLoans: 850000,
        meetingFrequency: 'weekly',
        location: 'Kibera, Nairobi',
        createdAt: '2024-01-15',
        leader: {
          name: 'Mary Wanjiku',
          email: 'mary.wanjiku@gmail.com',
          phone: '+254722123456'
        },
        lastActivity: '2024-08-08T10:30:00Z',
        performance: {
          contributionRate: 95,
          loanRepaymentRate: 92,
          meetingAttendanceRate: 88
        }
      },
      {
        id: 'group-2',
        name: 'Mombasa Investment Club',
        category: 'investment',
        status: 'active',
        memberCount: 15,
        totalContributions: 2150000,
        totalLoans: 1200000,
        meetingFrequency: 'monthly',
        location: 'Mombasa',
        createdAt: '2024-02-20',
        leader: {
          name: 'Ahmed Hassan',
          email: 'ahmed.hassan@outlook.com',
          phone: '+254733987654'
        },
        lastActivity: '2024-08-07T14:15:00Z',
        performance: {
          contributionRate: 98,
          loanRepaymentRate: 95,
          meetingAttendanceRate: 92
        }
      }
    ];
    setAllGroups(mockGroups);
  };

  const loadGroupsData = async () => {
    // Load group members
    const mockGroupMembers = {
      'group-1': [
        {
          id: 'member-1',
          name: 'John Doe',
          email: 'john.doe@gmail.com',
          phone: '+254700123456',
          joinDate: '2024-01-15',
          role: 'member',
          status: 'active',
          totalContributions: 45000,
          currentBalance: 12000,
          loansCount: 2,
          lastLogin: '2024-08-08T09:30:00Z',
          kycStatus: 'verified'
        },
        {
          id: 'member-2',
          name: 'Jane Smith',
          email: 'jane.smith@gmail.com',
          phone: '+254700234567',
          joinDate: '2024-01-20',
          role: 'treasurer',
          status: 'active',
          totalContributions: 52000,
          currentBalance: 8000,
          loansCount: 1,
          lastLogin: '2024-08-08T11:15:00Z',
          kycStatus: 'verified'
        }
      ],
      'group-2': [
        {
          id: 'member-3',
          name: 'Ali Mohamed',
          email: 'ali.mohamed@gmail.com',
          phone: '+254700345678',
          joinDate: '2024-02-20',
          role: 'member',
          status: 'active',
          totalContributions: 120000,
          currentBalance: 25000,
          loansCount: 3,
          lastLogin: '2024-08-07T16:45:00Z',
          kycStatus: 'verified'
        }
      ]
    };
    setGroupMembers(mockGroupMembers);

    // Load group contributions
    const mockGroupContributions = {
      'group-1': [
        {
          id: 'contrib-1',
          memberId: 'member-1',
          memberName: 'John Doe',
          amount: 5000,
          date: '2024-08-01',
          type: 'regular',
          status: 'confirmed',
          paymentMethod: 'mpesa',
          transactionId: 'MP240801001'
        },
        {
          id: 'contrib-2',
          memberId: 'member-2',
          memberName: 'Jane Smith',
          amount: 5000,
          date: '2024-08-01',
          type: 'regular',
          status: 'confirmed',
          paymentMethod: 'bank_transfer',
          transactionId: 'BT240801002'
        }
      ]
    };
    setGroupContributions(mockGroupContributions);

    // Load group loans
    const mockGroupLoans = {
      'group-1': [
        {
          id: 'loan-1',
          memberId: 'member-1',
          memberName: 'John Doe',
          amount: 25000,
          interestRate: 10,
          term: 6,
          status: 'active',
          disbursedDate: '2024-07-01',
          dueDate: '2024-12-31',
          repaidAmount: 15000,
          remainingBalance: 12500,
          nextPaymentDate: '2024-08-15',
          nextPaymentAmount: 4500
        }
      ]
    };
    setGroupLoans(mockGroupLoans);

    // Load group meetings
    const mockGroupMeetings = {
      'group-1': [
        {
          id: 'meeting-1',
          title: 'Weekly Contribution Meeting',
          type: 'regular',
          scheduledDate: '2024-08-10',
          startTime: '10:00',
          endTime: '12:00',
          location: 'Kibera Community Center',
          status: 'scheduled',
          agenda: ['Review weekly contributions', 'Loan applications', 'Member updates'],
          attendees: 23,
          expectedAttendees: 25
        },
        {
          id: 'meeting-2',
          title: 'Monthly Review Meeting',
          type: 'monthly_review',
          scheduledDate: '2024-08-05',
          startTime: '14:00',
          endTime: '16:30',
          location: 'Kibera Community Center',
          status: 'completed',
          agenda: ['Monthly financial review', 'New member applications', 'Investment opportunities'],
          attendees: 22,
          expectedAttendees: 25,
          minutes: 'Meeting concluded successfully with all agenda items discussed.',
          decisions: ['Approved 2 new loan applications', 'Increased monthly contribution by 500 KES']
        }
      ]
    };
    setGroupMeetings(mockGroupMeetings);

    // Load member activities
    const mockMemberActivities = {
      'member-1': [
        {
          id: 'activity-1',
          type: 'contribution',
          description: 'Made monthly contribution of KES 5,000',
          date: '2024-08-01T10:30:00Z',
          amount: 5000,
          status: 'completed'
        },
        {
          id: 'activity-2',
          type: 'loan_repayment',
          description: 'Loan repayment of KES 4,500',
          date: '2024-07-15T14:20:00Z',
          amount: 4500,
          status: 'completed'
        }
      ]
    };
    setMemberActivities(mockMemberActivities);
  };
  // Comprehensive action handlers
  const handleApproveGroup = useCallback(async (groupIndex: number) => {
    try {
      setPendingGroups(prev => prev.filter((_, index) => index !== groupIndex));
      setStats(prev => ({
        ...prev,
        pendingVerifications: prev.pendingVerifications - 1,
        totalGroups: prev.totalGroups + 1,
        activeGroups: prev.activeGroups + 1
      }));
      
      // Add to recent activity
      const newActivity = {
        id: Date.now().toString(),
        type: 'group_verified' as const,
        description: 'Group approved and activated',
        timestamp: new Date().toISOString()
      };
      
      setStats(prev => ({
        ...prev,
        recentActivity: [newActivity, ...prev.recentActivity.slice(0, 9)]
      }));
      
      alert('Group approved successfully!');
    } catch (error) {
      console.error('Failed to approve group:', error);
      alert('Failed to approve group. Please try again.');
    }
  }, []);

  const handleRejectGroup = useCallback(async (groupIndex: number, reason?: string) => {
    try {
      setPendingGroups(prev => prev.filter((_, index) => index !== groupIndex));
      setStats(prev => ({
        ...prev,
        pendingVerifications: prev.pendingVerifications - 1
      }));
      alert(`Group registration rejected. ${reason ? `Reason: ${reason}` : ''}`);
    } catch (error) {
      console.error('Failed to reject group:', error);
    }
  }, []);

  const handleUserAction = useCallback(async (action: string, userId: string, details?: any) => {
    try {
      let updatedUsers = [...users];
      const userIndex = updatedUsers.findIndex(u => u.id === userId);
      
      if (userIndex === -1) return;
      
      switch (action) {
        case 'suspend':
          updatedUsers[userIndex].status = 'suspended';
          break;
        case 'activate':
          updatedUsers[userIndex].status = 'active';
          break;
        case 'delete':
          updatedUsers = updatedUsers.filter(u => u.id !== userId);
          break;
        case 'reset_password':
          // Handle password reset
          break;
        case 'update_permissions':
          if (details?.permissions) {
            updatedUsers[userIndex].permissions = details.permissions;
          }
          break;
        case 'update_role':
          if (details?.role) {
            updatedUsers[userIndex].role = details.role;
          }
          break;
      }
      
      setUsers(updatedUsers);
      
      // Log the action
      const newAction: UserAction = {
        id: Date.now().toString(),
        userId: user?.id || 'admin',
        action: `User ${action}`,
        details: `${action} user ${updatedUsers[userIndex]?.email || userId}`,
        timestamp: new Date().toISOString(),
        ipAddress: '192.168.1.1',
        userAgent: 'Admin Dashboard',
        status: 'success'
      };
      
      setUserActions(prev => [newAction, ...prev.slice(0, 99)]);
      
      alert(`User ${action} completed successfully!`);
    } catch (error) {
      console.error(`Failed to ${action} user:`, error);
      alert(`Failed to ${action} user. Please try again.`);
    }
  }, [users, user]);

  const handleBulkUserAction = useCallback(async (action: string, userIds: string[]) => {
    if (userIds.length === 0) {
      alert('Please select users first');
      return;
    }

    const confirmed = window.confirm(`Are you sure you want to ${action} ${userIds.length} users?`);
    if (!confirmed) return;

    try {
      const bulkOp: BulkOperation = {
        id: Date.now().toString(),
        type: 'user_action',
        status: 'running',
        progress: 0,
        affectedItems: userIds.length,
        details: `Bulk ${action} operation`,
        startedAt: new Date().toISOString()
      };

      setBulkOperations(prev => [bulkOp, ...prev]);

      // Simulate bulk operation progress
      for (let i = 0; i < userIds.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 100));
        await handleUserAction(action, userIds[i]);
        
        // Update progress
        setBulkOperations(prev => 
          prev.map(op => 
            op.id === bulkOp.id 
              ? { ...op, progress: Math.round(((i + 1) / userIds.length) * 100) }
              : op
          )
        );
      }

      // Mark as completed
      setBulkOperations(prev => 
        prev.map(op => 
          op.id === bulkOp.id 
            ? { ...op, status: 'completed' as const, completedAt: new Date().toISOString() }
            : op
        )
      );

      setSelectedItems([]);
      alert(`Bulk ${action} completed successfully!`);
    } catch (error) {
      console.error(`Bulk ${action} failed:`, error);
      alert(`Bulk ${action} failed. Please try again.`);
    }
  }, [handleUserAction]);

  const handleSystemAction = useCallback(async (action: string, details?: any) => {
    try {
      switch (action) {
        case 'backup_database':
          // Implement database backup
          alert('Database backup initiated. You will be notified when complete.');
          break;
        case 'restart_services':
          // Implement service restart
          alert('Services restart initiated. This may take a few minutes.');
          break;
        case 'clear_cache':
          // Implement cache clearing
          alert('System cache cleared successfully.');
          break;
        case 'run_maintenance':
          // Implement maintenance tasks
          alert('System maintenance tasks initiated.');
          break;
        case 'generate_report':
          // Implement report generation
          if (details?.reportType) {
            alert(`${details.reportType} report generation started. Download will be available shortly.`);
          }
          break;
        case 'send_notifications':
          // Implement bulk notifications
          if (details?.message && details?.recipients) {
            alert(`Notification sent to ${details.recipients.length} recipients.`);
          }
          break;
      }
      
      // Log the system action
      const newAction: UserAction = {
        id: Date.now().toString(),
        userId: user?.id || 'admin',
        action: `System ${action}`,
        details: details ? JSON.stringify(details) : `Executed ${action}`,
        timestamp: new Date().toISOString(),
        ipAddress: '192.168.1.1',
        userAgent: 'Admin Dashboard',
        status: 'success'
      };
      
      setUserActions(prev => [newAction, ...prev.slice(0, 99)]);
    } catch (error) {
      console.error(`System action ${action} failed:`, error);
      alert(`System action failed. Please try again.`);
    }
  }, [user]);

  const handleAlertAction = useCallback(async (alertId: string, action: 'acknowledge' | 'resolve' | 'dismiss') => {
    try {
      setSystemAlerts(prev => 
        prev.map(alert => 
          alert.id === alertId 
            ? { ...alert, status: action === 'dismiss' ? 'resolved' : action === 'acknowledge' ? 'acknowledged' : 'resolved' }
            : alert
        )
      );
      
      if (action === 'dismiss') {
        setSystemAlerts(prev => prev.filter(alert => alert.id !== alertId));
      }
      
      alert(`Alert ${action}d successfully!`);
    } catch (error) {
      console.error(`Failed to ${action} alert:`, error);
    }
  }, []);

  const handleFinancialAction = useCallback(async (action: string, details?: any) => {
    try {
      switch (action) {
        case 'freeze_transactions':
          alert('All transactions have been frozen. This is an emergency action.');
          break;
        case 'reconcile_accounts':
          alert('Account reconciliation process initiated.');
          break;
        case 'generate_financial_report':
          alert('Financial report generation started.');
          break;
        case 'audit_trail':
          alert('Generating comprehensive audit trail...');
          break;
      }
    } catch (error) {
      console.error(`Financial action ${action} failed:`, error);
    }
  }, []);

  // Render functions for different dashboard sections
  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* Enhanced Stats Cards with Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FontAwesomeIcon icon={faUsers} className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Members</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalMembers.toLocaleString()}</p>
                <p className="text-xs text-green-600">+{stats.growthMetrics.membersThisMonth} this month</p>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('users')}
              className="px-3 py-1 bg-blue-50 text-blue-600 rounded text-sm hover:bg-blue-100"
            >
              Manage
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <FontAwesomeIcon icon={faBuilding} className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Groups</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.activeGroups}</p>
                <p className="text-xs text-green-600">+{stats.growthMetrics.groupsThisMonth} this month</p>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('groups')}
              className="px-3 py-1 bg-green-50 text-green-600 rounded text-sm hover:bg-green-100"
            >
              Manage
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <FontAwesomeIcon icon={faExclamationTriangle} className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Verifications</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.pendingVerifications}</p>
                <p className="text-xs text-yellow-600">Requires attention</p>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('groups')}
              className="px-3 py-1 bg-yellow-50 text-yellow-600 rounded text-sm hover:bg-yellow-100"
            >
              Review
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <FontAwesomeIcon icon={faMoneyBillWave} className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Platform Volume</p>
                <p className="text-2xl font-semibold text-gray-900">KES {(financialOverview.totalPlatformValue / 1000000).toFixed(1)}M</p>
                <p className="text-xs text-green-600">+{financialOverview.monthlyGrowth}% growth</p>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('financial')}
              className="px-3 py-1 bg-purple-50 text-purple-600 rounded text-sm hover:bg-purple-100"
            >
              View
            </button>
          </div>
        </div>
      </div>

      {/* System Health & Alerts Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* System Health */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">System Health</h3>
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${
                systemMetrics.serverHealth.status === 'healthy' ? 'bg-green-400' :
                systemMetrics.serverHealth.status === 'warning' ? 'bg-yellow-400' : 'bg-red-400'
              }`}></div>
              <span className="text-sm text-gray-600 capitalize">{systemMetrics.serverHealth.status}</span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Server Uptime</span>
              <span className="text-sm font-medium">{systemMetrics.serverHealth.uptime}</span>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">CPU Usage</span>
                <span className="text-sm font-medium">{systemMetrics.serverHealth.cpuUsage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${
                    systemMetrics.serverHealth.cpuUsage > 80 ? 'bg-red-500' :
                    systemMetrics.serverHealth.cpuUsage > 60 ? 'bg-yellow-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${systemMetrics.serverHealth.cpuUsage}%` }}
                ></div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Memory Usage</span>
                <span className="text-sm font-medium">{systemMetrics.serverHealth.memoryUsage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${
                    systemMetrics.serverHealth.memoryUsage > 80 ? 'bg-red-500' :
                    systemMetrics.serverHealth.memoryUsage > 60 ? 'bg-yellow-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${systemMetrics.serverHealth.memoryUsage}%` }}
                ></div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Response Time</span>
              <span className="text-sm font-medium">{systemMetrics.serverHealth.responseTime}ms</span>
            </div>
          </div>

          <div className="mt-4 flex space-x-2">
            <button
              onClick={() => handleSystemAction('restart_services')}
              className="flex-1 px-3 py-2 bg-blue-50 text-blue-600 rounded text-sm hover:bg-blue-100"
            >
              <FontAwesomeIcon icon={faRefresh} className="mr-1" />
              Restart Services
            </button>
            <button
              onClick={() => handleSystemAction('run_maintenance')}
              className="flex-1 px-3 py-2 bg-gray-50 text-gray-600 rounded text-sm hover:bg-gray-100"
            >
              <FontAwesomeIcon icon={faCog} className="mr-1" />
              Maintenance
            </button>
          </div>
        </div>

        {/* System Alerts */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">System Alerts</h3>
            <span className="bg-red-100 text-red-600 text-xs font-medium px-2 py-1 rounded-full">
              {systemAlerts.filter(a => a.status === 'new').length} new
            </span>
          </div>

          <div className="space-y-3 max-h-64 overflow-y-auto">
            {systemAlerts.length === 0 ? (
              <div className="text-center py-4 text-gray-500">
                <FontAwesomeIcon icon={faCheck} className="h-8 w-8 text-green-400 mb-2" />
                <p>No active alerts</p>
              </div>
            ) : (
              systemAlerts.map((alert) => (
                <div key={alert.id} className={`p-3 rounded border-l-4 ${
                  alert.severity === 'critical' ? 'border-red-500 bg-red-50' :
                  alert.severity === 'high' ? 'border-orange-500 bg-orange-50' :
                  alert.severity === 'medium' ? 'border-yellow-500 bg-yellow-50' :
                  'border-blue-500 bg-blue-50'
                }`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900">{alert.title}</h4>
                      <p className="text-xs text-gray-600 mt-1">{alert.description}</p>
                      <div className="flex items-center mt-2 space-x-2">
                        <span className={`text-xs px-2 py-1 rounded ${
                          alert.severity === 'critical' ? 'bg-red-100 text-red-700' :
                          alert.severity === 'high' ? 'bg-orange-100 text-orange-700' :
                          alert.severity === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {alert.severity.toUpperCase()}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(alert.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-1 ml-2">
                      {alert.status === 'new' && (
                        <button
                          onClick={() => handleAlertAction(alert.id, 'acknowledge')}
                          className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                          title="Acknowledge"
                        >
                          <FontAwesomeIcon icon={faCheck} className="h-3 w-3" />
                        </button>
                      )}
                      <button
                        onClick={() => handleAlertAction(alert.id, 'dismiss')}
                        className="p-1 text-red-600 hover:bg-red-100 rounded"
                        title="Dismiss"
                      >
                        <FontAwesomeIcon icon={faTimes} className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Financial Overview */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-gray-900">Financial Overview</h3>
          <div className="flex space-x-2">
            <button
              onClick={() => handleFinancialAction('reconcile_accounts')}
              className="px-3 py-1 bg-blue-50 text-blue-600 rounded text-sm hover:bg-blue-100"
            >
              Reconcile
            </button>
            <button
              onClick={() => handleFinancialAction('generate_financial_report')}
              className="px-3 py-1 bg-green-50 text-green-600 rounded text-sm hover:bg-green-100"
            >
              <FontAwesomeIcon icon={faDownload} className="mr-1" />
              Export
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center p-4 border rounded-lg">
            <FontAwesomeIcon icon={faMoneyBillWave} className="h-8 w-8 text-green-600 mb-2" />
            <p className="text-sm text-gray-600">Total Contributions</p>
            <p className="text-xl font-semibold">KES {(financialOverview.totalContributions / 1000000).toFixed(1)}M</p>
          </div>
          <div className="text-center p-4 border rounded-lg">
            <FontAwesomeIcon icon={faHandHoldingUsd} className="h-8 w-8 text-blue-600 mb-2" />
            <p className="text-sm text-gray-600">Active Loans</p>
            <p className="text-xl font-semibold">KES {(financialOverview.totalLoans / 1000000).toFixed(1)}M</p>
          </div>
          <div className="text-center p-4 border rounded-lg">
            <FontAwesomeIcon icon={faChartLine} className="h-8 w-8 text-purple-600 mb-2" />
            <p className="text-sm text-gray-600">Investments</p>
            <p className="text-xl font-semibold">KES {(financialOverview.totalInvestments / 1000000).toFixed(1)}M</p>
          </div>
          <div className="text-center p-4 border rounded-lg">
            <FontAwesomeIcon icon={faExclamationTriangle} className="h-8 w-8 text-yellow-600 mb-2" />
            <p className="text-sm text-gray-600">Pending Issues</p>
            <p className="text-xl font-semibold">{financialOverview.pendingTransactions + financialOverview.disputedTransactions}</p>
          </div>
        </div>
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {stats.recentActivity.map((activity, index) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  activity.type === 'group_registered' ? 'bg-green-400' :
                  activity.type === 'member_joined' ? 'bg-blue-400' :
                  activity.type === 'transaction' ? 'bg-purple-400' :
                  'bg-gray-400'
                }`}></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">{activity.description}</p>
                  <p className="text-xs text-gray-500">{new Date(activity.timestamp).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleSystemAction('backup_database')}
              className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 text-left"
            >
              <FontAwesomeIcon icon={faDatabase} className="h-5 w-5 text-blue-600 mb-2" />
              <p className="text-sm font-medium">Backup Database</p>
              <p className="text-xs text-gray-500">Create system backup</p>
            </button>
            <button
              onClick={() => setActiveTab('communications')}
              className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 text-left"
            >
              <FontAwesomeIcon icon={faEnvelope} className="h-5 w-5 text-green-600 mb-2" />
              <p className="text-sm font-medium">Send Notification</p>
              <p className="text-xs text-gray-500">Broadcast message</p>
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 text-left"
            >
              <FontAwesomeIcon icon={faFileAlt} className="h-5 w-5 text-purple-600 mb-2" />
              <p className="text-sm font-medium">Generate Report</p>
              <p className="text-xs text-gray-500">Custom analytics</p>
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 text-left"
            >
              <FontAwesomeIcon icon={faShieldAlt} className="h-5 w-5 text-red-600 mb-2" />
              <p className="text-sm font-medium">Security Audit</p>
              <p className="text-xs text-gray-500">Review security</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderGroupRegistrationsTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Pending Group Registrations</h3>
        <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
          {pendingGroups.length} pending
        </span>
      </div>

      {pendingGroups.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center">
          <FontAwesomeIcon icon={faCheck} className="h-12 w-12 text-green-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Pending Registrations</h3>
          <p className="text-gray-600">All group registrations have been processed.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pendingGroups.map((group, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h4 className="text-lg font-medium text-gray-900">{group.groupName}</h4>
                  <p className="text-sm text-gray-600 mt-1">{group.description}</p>
                  
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Group Details</p>
                      <ul className="text-sm text-gray-600 mt-1 space-y-1">
                        <li>Category: {group.category}</li>
                        <li>Location: {group.location.county}, {group.location.constituency}</li>
                        <li>Max Members: {group.maxMembers}</li>
                        <li>Contribution: {group.currency} {group.contributionAmount.toLocaleString()}</li>
                        <li>Meeting: {group.meetingFrequency}</li>
                      </ul>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-gray-700">Group Leader</p>
                      <ul className="text-sm text-gray-600 mt-1 space-y-1">
                        <li>{group.leaderInfo.firstName} {group.leaderInfo.lastName}</li>
                        <li>{group.leaderInfo.email}</li>
                        <li>{group.leaderInfo.phone}</li>
                        <li>ID: {group.leaderInfo.idNumber}</li>
                      </ul>
                    </div>
                  </div>

                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-700">Documents</p>
                    <div className="mt-1 space-y-1">
                      <div className="flex items-center text-sm text-gray-600">
                        <FontAwesomeIcon icon={faFileAlt} className="h-4 w-4 mr-2" />
                        <span>Constitution (uploaded)</span>
                        <button className="ml-2 text-blue-600 hover:text-blue-800">
                          <FontAwesomeIcon icon={faEye} className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <FontAwesomeIcon icon={faFileAlt} className="h-4 w-4 mr-2" />
                        <span>Leader ID Copy (uploaded)</span>
                        <button className="ml-2 text-blue-600 hover:text-blue-800">
                          <FontAwesomeIcon icon={faEye} className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="ml-6 flex flex-col space-y-2">
                  <button
                    onClick={() => handleApproveGroup(index)}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                  >
                    <FontAwesomeIcon icon={faCheck} className="h-4 w-4 mr-1" />
                    Approve
                  </button>
                  <button
                    onClick={() => handleRejectGroup(index)}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                  >
                    <FontAwesomeIcon icon={faTimes} className="h-4 w-4 mr-1" />
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderUserManagementTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">User Management</h3>
        <div className="flex space-x-2">
          <button className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
            <FontAwesomeIcon icon={faDownload} className="h-4 w-4 mr-1" />
            Export
          </button>
        </div>
      </div>

      <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Login
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-700">
                          {user.firstName[0]}{user.lastName[0]}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {user.firstName} {user.lastName}
                      </div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                    {user.role.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    user.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {user.status === 'active' ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString() : 'Never'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleToggleUserStatus(user.id)}
                    className={`text-${user.status === 'active' ? 'red' : 'green'}-600 hover:text-${user.status === 'active' ? 'red' : 'green'}-900 mr-3`}
                  >
                    <FontAwesomeIcon 
                      icon={user.status === 'active' ? faUserTimes : faUserCheck} 
                      className="h-4 w-4" 
                    />
                  </button>
                  <button className="text-blue-600 hover:text-blue-900">
                    <FontAwesomeIcon icon={faEye} className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderSystemTab = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">System Administration</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h4 className="text-md font-medium text-gray-900 mb-4">Database</h4>
          <div className="space-y-3">
            <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              <FontAwesomeIcon icon={faDatabase} className="h-4 w-4 mr-2" />
              Backup Database
            </button>
            <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              <FontAwesomeIcon icon={faRefresh} className="h-4 w-4 mr-2" />
              Check Health
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h4 className="text-md font-medium text-gray-900 mb-4">Security</h4>
          <div className="space-y-3">
            <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              <FontAwesomeIcon icon={faShieldAlt} className="h-4 w-4 mr-2" />
              Security Audit
            </button>
            <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              <FontAwesomeIcon icon={faFileAlt} className="h-4 w-4 mr-2" />
              View Logs
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderGroupManagementTab = () => {
    if (!selectedGroup) {
      // Groups Overview
      return (
        <div className="space-y-6">
          {/* Header with Actions */}
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">Group Management</h3>
            <div className="flex space-x-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search groups..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
              </select>
              <button 
                onClick={() => handleSystemAction('create_group')}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <FontAwesomeIcon icon={faPlus} className="h-4 w-4 mr-2" />
                Create Group
              </button>
            </div>
          </div>

          {/* Group Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <FontAwesomeIcon icon={faUsers} className="h-8 w-8 text-blue-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Active Groups</dt>
                    <dd className="text-lg font-medium text-gray-900">{allGroups.filter(g => g.status === 'active').length}</dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <FontAwesomeIcon icon={faClock} className="h-8 w-8 text-yellow-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Members</dt>
                    <dd className="text-lg font-medium text-gray-900">{allGroups.reduce((sum, g) => sum + g.memberCount, 0)}</dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <FontAwesomeIcon icon={faDollarSign} className="h-8 w-8 text-green-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Pool Value</dt>
                    <dd className="text-lg font-medium text-gray-900">
                      KES {allGroups.reduce((sum, g) => sum + g.totalContributions, 0).toLocaleString()}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <FontAwesomeIcon icon={faChartLine} className="h-8 w-8 text-purple-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Avg. Performance</dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {Math.round(allGroups.reduce((sum, g) => sum + g.performance.contributionRate, 0) / allGroups.length)}%
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          {/* Groups Table */}
          <div className="bg-white shadow-sm rounded-lg border border-gray-200">
            <div className="px-4 py-5 sm:p-6">
              <h4 className="text-lg font-medium text-gray-900 mb-4">All Groups</h4>
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Group Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Members</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pool Value</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Performance</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Activity</th>
                      <th className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {allGroups.filter(group => 
                      group.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
                      (statusFilter === 'all' || group.status === statusFilter)
                    ).map((group) => (
                      <tr key={group.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                <FontAwesomeIcon icon={faUsers} className="h-5 w-5 text-blue-600" />
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{group.name}</div>
                              <div className="text-sm text-gray-500">{group.location}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            group.category === 'savings' ? 'bg-green-100 text-green-800' :
                            group.category === 'investment' ? 'bg-purple-100 text-purple-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {group.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{group.memberCount}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">KES {group.totalContributions.toLocaleString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-1">
                              <div className="text-sm text-gray-900">{group.performance.contributionRate}%</div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className={`h-2 rounded-full ${
                                    group.performance.contributionRate >= 90 ? 'bg-green-500' :
                                    group.performance.contributionRate >= 75 ? 'bg-yellow-500' : 'bg-red-500'
                                  }`}
                                  style={{ width: `${group.performance.contributionRate}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            group.status === 'active' ? 'bg-green-100 text-green-800' :
                            group.status === 'inactive' ? 'bg-gray-100 text-gray-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {group.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(group.lastActivity).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button 
                            onClick={() => setSelectedGroup(group.id)}
                            className="text-blue-600 hover:text-blue-900 mr-3"
                          >
                            <FontAwesomeIcon icon={faEye} className="h-4 w-4" />
                          </button>
                          <button className="text-yellow-600 hover:text-yellow-900 mr-3">
                            <FontAwesomeIcon icon={faEdit} className="h-4 w-4" />
                          </button>
                          <button className="text-red-600 hover:text-red-900">
                            <FontAwesomeIcon icon={faBan} className="h-4 w-4" />
                          </button>
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
    } else {
      // Individual Group Details
      const group = allGroups.find(g => g.id === selectedGroup);
      if (!group) return null;

      return (
        <div className="space-y-6">
          {/* Group Header */}
          <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <button 
                  onClick={() => setSelectedGroup(null)}
                  className="mr-4 text-gray-500 hover:text-gray-700"
                >
                  <FontAwesomeIcon icon={faTimes} className="h-5 w-5" />
                </button>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{group.name}</h2>
                  <p className="text-sm text-gray-500">{group.location} • {group.category} group</p>
                </div>
              </div>
              <div className="flex space-x-3">
                <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                  <FontAwesomeIcon icon={faDownload} className="h-4 w-4 mr-2" />
                  Export Report
                </button>
                <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                  <FontAwesomeIcon icon={faEdit} className="h-4 w-4 mr-2" />
                  Edit Group
                </button>
              </div>
            </div>
          </div>

          {/* Sub-navigation */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'overview', name: 'Overview', icon: faTachometerAlt },
                { id: 'members', name: 'Members', icon: faUsers },
                { id: 'contributions', name: 'Contributions', icon: faMoneyBillWave },
                { id: 'loans', name: 'Loans', icon: faHandHoldingUsd },
                { id: 'meetings', name: 'Meetings', icon: faCalendarAlt },
                { id: 'reports', name: 'Reports', icon: faChartLine }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveSubTab(tab.id)}
                  className={`${
                    activeSubTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center`}
                >
                  <FontAwesomeIcon icon={tab.icon} className="h-4 w-4 mr-2" />
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          {/* Sub-tab Content */}
          {renderGroupSubTab(group)}
        </div>
      );
    }
  };

  const renderFinancialManagementTab = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Financial Management</h3>

      {/* Financial Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <FontAwesomeIcon icon={faDollarSign} className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Total Platform Value</dt>
                <dd className="text-lg font-medium text-gray-900">$1,245,600</dd>
              </dl>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <FontAwesomeIcon icon={faArrowUp} className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Monthly Inflow</dt>
                <dd className="text-lg font-medium text-gray-900">$45,230</dd>
              </dl>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <FontAwesomeIcon icon={faArrowDown} className="h-8 w-8 text-red-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Monthly Outflow</dt>
                <dd className="text-lg font-medium text-gray-900">$23,150</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Financial Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h4 className="text-md font-medium text-gray-900 mb-4">Transaction Management</h4>
          <div className="space-y-3">
            <button 
              onClick={() => handleFinancialAction('view_transactions')}
              className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <FontAwesomeIcon icon={faFileAlt} className="h-4 w-4 mr-2" />
              View All Transactions
            </button>
            <button 
              onClick={() => handleFinancialAction('reconcile')}
              className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <FontAwesomeIcon icon={faCheckCircle} className="h-4 w-4 mr-2" />
              Reconcile Accounts
            </button>
            <button 
              onClick={() => handleFinancialAction('freeze_transactions')}
              className="w-full flex items-center justify-center px-4 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50"
            >
              <FontAwesomeIcon icon={faBan} className="h-4 w-4 mr-2" />
              Freeze All Transactions
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h4 className="text-md font-medium text-gray-900 mb-4">Financial Reports</h4>
          <div className="space-y-3">
            <button 
              onClick={() => handleFinancialAction('generate_report')}
              className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <FontAwesomeIcon icon={faChartLine} className="h-4 w-4 mr-2" />
              Generate Financial Report
            </button>
            <button 
              onClick={() => handleFinancialAction('audit_trail')}
              className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <FontAwesomeIcon icon={faSearch} className="h-4 w-4 mr-2" />
              Audit Trail
            </button>
            <button 
              onClick={() => handleFinancialAction('export_data')}
              className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <FontAwesomeIcon icon={faDownload} className="h-4 w-4 mr-2" />
              Export Financial Data
            </button>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200">
        <div className="px-4 py-5 sm:p-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4">Recent Large Transactions</h4>
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">From/To</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Dec 15, 2024</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Loan Disbursement</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">$5,000</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">John Doe</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Completed</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900">View Details</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSecurityTab = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Security Management</h3>

      {/* Security Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <FontAwesomeIcon icon={faShieldAlt} className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Security Score</dt>
                <dd className="text-lg font-medium text-gray-900">95%</dd>
              </dl>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <FontAwesomeIcon icon={faExclamationTriangle} className="h-8 w-8 text-yellow-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Active Threats</dt>
                <dd className="text-lg font-medium text-gray-900">2</dd>
              </dl>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <FontAwesomeIcon icon={faLock} className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Failed Logins</dt>
                <dd className="text-lg font-medium text-gray-900">23</dd>
              </dl>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <FontAwesomeIcon icon={faUserShield} className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">2FA Enabled</dt>
                <dd className="text-lg font-medium text-gray-900">89%</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Security Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h4 className="text-md font-medium text-gray-900 mb-4">Access Control</h4>
          <div className="space-y-3">
            <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              <FontAwesomeIcon icon={faUserShield} className="h-4 w-4 mr-2" />
              Manage User Permissions
            </button>
            <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              <FontAwesomeIcon icon={faKey} className="h-4 w-4 mr-2" />
              Force Password Reset
            </button>
            <button className="w-full flex items-center justify-center px-4 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50">
              <FontAwesomeIcon icon={faBan} className="h-4 w-4 mr-2" />
              Lockdown System
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h4 className="text-md font-medium text-gray-900 mb-4">Monitoring</h4>
          <div className="space-y-3">
            <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              <FontAwesomeIcon icon={faFileAlt} className="h-4 w-4 mr-2" />
              View Security Logs
            </button>
            <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              <FontAwesomeIcon icon={faSearch} className="h-4 w-4 mr-2" />
              Audit User Activity
            </button>
            <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              <FontAwesomeIcon icon={faExclamationTriangle} className="h-4 w-4 mr-2" />
              Threat Assessment
            </button>
          </div>
        </div>
      </div>

      {/* Recent Security Events */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200">
        <div className="px-4 py-5 sm:p-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4">Recent Security Events</h4>
          <div className="space-y-4">
            <div className="flex items-center p-4 bg-yellow-50 border border-yellow-200 rounded-md">
              <FontAwesomeIcon icon={faExclamationTriangle} className="h-5 w-5 text-yellow-600 mr-3" />
              <div className="flex-1">
                <p className="text-sm font-medium text-yellow-800">Suspicious login attempt detected</p>
                <p className="text-sm text-yellow-700">Multiple failed login attempts from IP 192.168.1.100</p>
              </div>
              <span className="text-sm text-yellow-600">2 hours ago</span>
            </div>
            <div className="flex items-center p-4 bg-red-50 border border-red-200 rounded-md">
              <FontAwesomeIcon icon={faBan} className="h-5 w-5 text-red-600 mr-3" />
              <div className="flex-1">
                <p className="text-sm font-medium text-red-800">Unauthorized access attempt</p>
                <p className="text-sm text-red-700">User tried to access admin panel without permissions</p>
              </div>
              <span className="text-sm text-red-600">5 hours ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCommunicationsTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Communications Center</h3>
        <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
          <FontAwesomeIcon icon={faPlus} className="h-4 w-4 mr-2" />
          New Broadcast
        </button>
      </div>

      {/* Communication Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <FontAwesomeIcon icon={faEnvelope} className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Messages Sent</dt>
                <dd className="text-lg font-medium text-gray-900">1,234</dd>
              </dl>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <FontAwesomeIcon icon={faBell} className="h-8 w-8 text-yellow-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Notifications</dt>
                <dd className="text-lg font-medium text-gray-900">456</dd>
              </dl>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <FontAwesomeIcon icon={faCheckCircle} className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Delivery Rate</dt>
                <dd className="text-lg font-medium text-gray-900">98.5%</dd>
              </dl>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <FontAwesomeIcon icon={faEye} className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Open Rate</dt>
                <dd className="text-lg font-medium text-gray-900">76.3%</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Communication Tools */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h4 className="text-md font-medium text-gray-900 mb-4">Broadcast Messages</h4>
          <div className="space-y-3">
            <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              <FontAwesomeIcon icon={faEnvelope} className="h-4 w-4 mr-2" />
              Send Platform Announcement
            </button>
            <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              <FontAwesomeIcon icon={faExclamationTriangle} className="h-4 w-4 mr-2" />
              Emergency Alert
            </button>
            <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              <FontAwesomeIcon icon={faCalendarAlt} className="h-4 w-4 mr-2" />
              Schedule Maintenance Notice
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h4 className="text-md font-medium text-gray-900 mb-4">Notification Settings</h4>
          <div className="space-y-3">
            <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              <FontAwesomeIcon icon={faBell} className="h-4 w-4 mr-2" />
              Configure Notifications
            </button>
            <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              <FontAwesomeIcon icon={faUserTie} className="h-4 w-4 mr-2" />
              Admin Alert Preferences
            </button>
            <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              <FontAwesomeIcon icon={faFileAlt} className="h-4 w-4 mr-2" />
              Message Templates
            </button>
          </div>
        </div>
      </div>

      {/* Recent Messages */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200">
        <div className="px-4 py-5 sm:p-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4">Recent Messages</h4>
          <div className="space-y-4">
            <div className="flex items-center p-4 bg-blue-50 border border-blue-200 rounded-md">
              <FontAwesomeIcon icon={faEnvelope} className="h-5 w-5 text-blue-600 mr-3" />
              <div className="flex-1">
                <p className="text-sm font-medium text-blue-800">Platform maintenance scheduled</p>
                <p className="text-sm text-blue-700">Sent to all users - System will be down for 2 hours on Sunday</p>
              </div>
              <span className="text-sm text-blue-600">1 hour ago</span>
            </div>
            <div className="flex items-center p-4 bg-green-50 border border-green-200 rounded-md">
              <FontAwesomeIcon icon={faCheckCircle} className="h-5 w-5 text-green-600 mr-3" />
              <div className="flex-1">
                <p className="text-sm font-medium text-green-800">New feature announcement</p>
                <p className="text-sm text-green-700">Sent to all users - Enhanced dashboard features now available</p>
              </div>
              <span className="text-sm text-green-600">3 hours ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderReportsTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Reports & Analytics</h3>
        <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
          <FontAwesomeIcon icon={faPlus} className="h-4 w-4 mr-2" />
          Generate Custom Report
        </button>
      </div>

      {/* Report Categories */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <FontAwesomeIcon icon={faChartLine} className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Financial Reports</dt>
                <dd className="text-lg font-medium text-gray-900">12</dd>
              </dl>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <FontAwesomeIcon icon={faUsers} className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">User Reports</dt>
                <dd className="text-lg font-medium text-gray-900">8</dd>
              </dl>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <FontAwesomeIcon icon={faShieldAlt} className="h-8 w-8 text-red-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Security Reports</dt>
                <dd className="text-lg font-medium text-gray-900">5</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Reports */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h4 className="text-md font-medium text-gray-900 mb-4">Financial Reports</h4>
          <div className="space-y-3">
            <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              <FontAwesomeIcon icon={faDollarSign} className="h-4 w-4 mr-2" />
              Monthly Financial Summary
            </button>
            <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              <FontAwesomeIcon icon={faChartPie} className="h-4 w-4 mr-2" />
              Portfolio Performance
            </button>
            <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              <FontAwesomeIcon icon={faFileAlt} className="h-4 w-4 mr-2" />
              Transaction Analysis
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h4 className="text-md font-medium text-gray-900 mb-4">User Analytics</h4>
          <div className="space-y-3">
            <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              <FontAwesomeIcon icon={faUsers} className="h-4 w-4 mr-2" />
              User Activity Report
            </button>
            <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              <FontAwesomeIcon icon={faChartBar} className="h-4 w-4 mr-2" />
              Engagement Analytics
            </button>
            <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              <FontAwesomeIcon icon={faCalendarAlt} className="h-4 w-4 mr-2" />
              Retention Analysis
            </button>
          </div>
        </div>
      </div>

      {/* Custom Report Builder */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h4 className="text-lg font-medium text-gray-900 mb-4">Custom Report Builder</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
            <select className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm">
              <option>Financial</option>
              <option>User Activity</option>
              <option>Security</option>
              <option>Performance</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
            <select className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 3 months</option>
              <option>Custom range</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Format</label>
            <select className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm">
              <option>PDF</option>
              <option>Excel</option>
              <option>CSV</option>
            </select>
          </div>
        </div>
        <div className="mt-4">
          <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
            <FontAwesomeIcon icon={faDownload} className="h-4 w-4 mr-2" />
            Generate Report
          </button>
        </div>
      </div>

      {/* Recent Reports */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200">
        <div className="px-4 py-5 sm:p-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4">Recent Reports</h4>
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Report Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Generated</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                  <th className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">November Financial Summary</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Financial</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Dec 1, 2024</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2.4 MB</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mr-3">Download</button>
                    <button className="text-green-600 hover:text-green-900">Share</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );

  if (!hasPermission('admin_access')) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <FontAwesomeIcon icon={faShieldAlt} className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900">Access Denied</h2>
          <p className="text-gray-600 mt-2">You don't have permission to access the admin dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <FontAwesomeIcon icon={faTachometerAlt} className="h-8 w-8 text-green-600 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-sm text-gray-600">Welcome back, {user?.firstName}!</p>
              </div>
            </div>
            {onClose && (
              <button
                onClick={onClose}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Close
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Navigation Tabs */}
        <div className="mb-8">
          <nav className="-mb-px flex space-x-6 overflow-x-auto">
            {[
              { id: 'overview', name: 'Overview', icon: faTachometerAlt, badge: null },
              { id: 'groups', name: 'Groups', icon: faBuilding, badge: pendingGroups.length },
              { id: 'users', name: 'Users', icon: faUsers, badge: users.filter(u => u.status === 'suspended').length },
              { id: 'financial', name: 'Financial', icon: faMoneyBillWave, badge: financialOverview.pendingTransactions },
              { id: 'security', name: 'Security', icon: faShieldAlt, badge: systemAlerts.filter(a => a.type === 'security').length },
              { id: 'communications', name: 'Communications', icon: faEnvelope, badge: null },
              { id: 'reports', name: 'Reports', icon: faFileAlt, badge: null },
              { id: 'system', name: 'System', icon: faCog, badge: null }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`${
                  activeTab === tab.id
                    ? 'border-green-500 text-green-600 bg-green-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-3 px-4 border-b-2 font-medium text-sm flex items-center rounded-t-lg transition-colors relative`}
              >
                <FontAwesomeIcon icon={tab.icon} className="h-4 w-4 mr-2" />
                {tab.name}
                {tab.badge !== null && tab.badge > 0 && (
                  <span className="ml-2 bg-red-100 text-red-600 text-xs font-medium px-2 py-0.5 rounded-full">
                    {tab.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Enhanced Tab Content */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <FontAwesomeIcon icon={faSpinner} className="animate-spin h-8 w-8 text-gray-400" />
            <span className="ml-2 text-gray-600">Loading dashboard data...</span>
          </div>
        ) : (
          <>
            {activeTab === 'overview' && renderOverviewTab()}
            {activeTab === 'groups' && renderGroupManagementTab()}
            {activeTab === 'users' && renderUserManagementTab()}
            {activeTab === 'financial' && renderFinancialManagementTab()}
            {activeTab === 'security' && renderSecurityTab()}
            {activeTab === 'communications' && renderCommunicationsTab()}
            {activeTab === 'reports' && renderReportsTab()}
            {activeTab === 'system' && renderSystemTab()}
          </>
        )}
      </div>
    </div>
  );

  const renderGroupSubTab = (group: any) => {
    const groupId = group.id;
    const members = groupMembers[groupId] || [];
    const contributions = groupContributions[groupId] || [];
    const loans = groupLoans[groupId] || [];
    const meetings = groupMeetings[groupId] || [];

    switch (activeSubTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* Group Performance Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h4 className="text-lg font-medium text-gray-900 mb-4">Performance Overview</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Contribution Rate</span>
                    <span className="text-sm font-medium text-gray-900">{group.performance.contributionRate}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Loan Repayment Rate</span>
                    <span className="text-sm font-medium text-gray-900">{group.performance.loanRepaymentRate}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Meeting Attendance</span>
                    <span className="text-sm font-medium text-gray-900">{group.performance.meetingAttendanceRate}%</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h4 className="text-lg font-medium text-gray-900 mb-4">Financial Summary</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total Contributions</span>
                    <span className="text-sm font-medium text-gray-900">KES {group.totalContributions.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total Loans</span>
                    <span className="text-sm font-medium text-gray-900">KES {group.totalLoans.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Available Funds</span>
                    <span className="text-sm font-medium text-gray-900">KES {(group.totalContributions - group.totalLoans).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h4 className="text-lg font-medium text-gray-900 mb-4">Group Leader</h4>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <FontAwesomeIcon icon={faUserTie} className="h-5 w-5 text-blue-600" />
                      </div>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">{group.leader.name}</p>
                      <p className="text-sm text-gray-500">{group.leader.email}</p>
                      <p className="text-sm text-gray-500">{group.leader.phone}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activities */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h4 className="text-lg font-medium text-gray-900 mb-4">Recent Activities</h4>
              <div className="flow-root">
                <ul className="-mb-8">
                  <li className="relative pb-8">
                    <div className="relative flex space-x-3">
                      <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-full">
                        <FontAwesomeIcon icon={faMoneyBillWave} className="w-4 h-4 text-green-600" />
                      </div>
                      <div className="min-w-0 flex-1 pt-1.5">
                        <p className="text-sm text-gray-500">
                          <span className="font-medium text-gray-900">Jane Smith</span> made a contribution of KES 5,000
                        </p>
                        <p className="text-xs text-gray-400">2 hours ago</p>
                      </div>
                    </div>
                  </li>
                  <li className="relative pb-8">
                    <div className="relative flex space-x-3">
                      <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full">
                        <FontAwesomeIcon icon={faUsers} className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="min-w-0 flex-1 pt-1.5">
                        <p className="text-sm text-gray-500">
                          <span className="font-medium text-gray-900">New member</span> Peter Kamau joined the group
                        </p>
                        <p className="text-xs text-gray-400">1 day ago</p>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        );

      case 'members':
        return (
          <div className="space-y-6">
            {/* Members Header */}
            <div className="flex justify-between items-center">
              <h4 className="text-lg font-medium text-gray-900">Group Members ({members.length})</h4>
              <div className="flex space-x-3">
                <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                  <FontAwesomeIcon icon={faDownload} className="h-4 w-4 mr-2" />
                  Export Members
                </button>
                <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                  <FontAwesomeIcon icon={faPlus} className="h-4 w-4 mr-2" />
                  Add Member
                </button>
              </div>
            </div>

            {/* Members Table */}
            <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Member</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Join Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contributions</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Balance</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Login</th>
                    <th className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {members.map((member) => (
                    <tr key={member.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                              <span className="text-sm font-medium text-gray-700">
                                {member.name.split(' ').map((n: string) => n[0]).join('')}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{member.name}</div>
                            <div className="text-sm text-gray-500">{member.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          member.role === 'leader' ? 'bg-purple-100 text-purple-800' :
                          member.role === 'treasurer' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {member.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(member.joinDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        KES {member.totalContributions.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        KES {member.currentBalance.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          member.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {member.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(member.lastLogin).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button 
                          onClick={() => setSelectedMember(member.id)}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          <FontAwesomeIcon icon={faEye} className="h-4 w-4" />
                        </button>
                        <button className="text-yellow-600 hover:text-yellow-900 mr-3">
                          <FontAwesomeIcon icon={faEdit} className="h-4 w-4" />
                        </button>
                        <button className="text-red-600 hover:text-red-900">
                          <FontAwesomeIcon icon={faTrashAlt} className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'contributions':
        return (
          <div className="space-y-6">
            {/* Contributions Header */}
            <div className="flex justify-between items-center">
              <h4 className="text-lg font-medium text-gray-900">Contributions</h4>
              <div className="flex space-x-3">
                <select className="px-3 py-2 border border-gray-300 rounded-md text-sm">
                  <option>All Members</option>
                  <option>This Month</option>
                  <option>Last Month</option>
                </select>
                <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700">
                  <FontAwesomeIcon icon={faPlus} className="h-4 w-4 mr-2" />
                  Record Contribution
                </button>
              </div>
            </div>

            {/* Contributions Table */}
            <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Member</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Method</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {contributions.map((contribution) => (
                    <tr key={contribution.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {contribution.memberName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        KES {contribution.amount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                          {contribution.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {contribution.paymentMethod}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(contribution.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          contribution.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                          contribution.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {contribution.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button className="text-blue-600 hover:text-blue-900 mr-3">
                          <FontAwesomeIcon icon={faEye} className="h-4 w-4" />
                        </button>
                        <button className="text-yellow-600 hover:text-yellow-900">
                          <FontAwesomeIcon icon={faEdit} className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'loans':
        return (
          <div className="space-y-6">
            {/* Loans Header */}
            <div className="flex justify-between items-center">
              <h4 className="text-lg font-medium text-gray-900">Loans</h4>
              <div className="flex space-x-3">
                <select className="px-3 py-2 border border-gray-300 rounded-md text-sm">
                  <option>All Status</option>
                  <option>Active</option>
                  <option>Completed</option>
                  <option>Overdue</option>
                </select>
                <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700">
                  <FontAwesomeIcon icon={faPlus} className="h-4 w-4 mr-2" />
                  Process Loan
                </button>
              </div>
            </div>

            {/* Loans Table */}
            <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Member</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Interest</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Term</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Next Payment</th>
                    <th className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {loans.map((loan) => (
                    <tr key={loan.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {loan.memberName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        KES {loan.amount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {loan.interestRate}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {loan.term} months
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-1">
                            <div className="text-sm text-gray-900">
                              KES {loan.repaidAmount.toLocaleString()} / KES {(loan.amount + (loan.amount * loan.interestRate / 100)).toLocaleString()}
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="h-2 rounded-full bg-blue-500"
                                style={{ width: `${(loan.repaidAmount / (loan.amount + (loan.amount * loan.interestRate / 100))) * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          loan.status === 'active' ? 'bg-green-100 text-green-800' :
                          loan.status === 'overdue' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {loan.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {new Date(loan.nextPaymentDate).toLocaleDateString()}
                        </div>
                        <div className="text-sm text-gray-500">
                          KES {loan.nextPaymentAmount.toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button className="text-blue-600 hover:text-blue-900 mr-3">
                          <FontAwesomeIcon icon={faEye} className="h-4 w-4" />
                        </button>
                        <button className="text-green-600 hover:text-green-900">
                          <FontAwesomeIcon icon={faMoneyBillWave} className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'meetings':
        return (
          <div className="space-y-6">
            {/* Meetings Header */}
            <div className="flex justify-between items-center">
              <h4 className="text-lg font-medium text-gray-900">Meetings</h4>
              <div className="flex space-x-3">
                <select className="px-3 py-2 border border-gray-300 rounded-md text-sm">
                  <option>All Meetings</option>
                  <option>Scheduled</option>
                  <option>Completed</option>
                  <option>Cancelled</option>
                </select>
                <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                  <FontAwesomeIcon icon={faCalendarAlt} className="h-4 w-4 mr-2" />
                  Schedule Meeting
                </button>
              </div>
            </div>

            {/* Meetings Table */}
            <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Meeting</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Attendance</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {meetings.map((meeting) => (
                    <tr key={meeting.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{meeting.title}</div>
                        <div className="text-sm text-gray-500">
                          {meeting.agenda?.slice(0, 2).join(', ')}
                          {meeting.agenda?.length > 2 && '...'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-indigo-100 text-indigo-800">
                          {meeting.type.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {new Date(meeting.scheduledDate).toLocaleDateString()}
                        </div>
                        <div className="text-sm text-gray-500">
                          {meeting.startTime} - {meeting.endTime}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {meeting.location}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {meeting.attendees} / {meeting.expectedAttendees}
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="h-2 rounded-full bg-green-500"
                            style={{ width: `${(meeting.attendees / meeting.expectedAttendees) * 100}%` }}
                          ></div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          meeting.status === 'completed' ? 'bg-green-100 text-green-800' :
                          meeting.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {meeting.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button className="text-blue-600 hover:text-blue-900 mr-3">
                          <FontAwesomeIcon icon={faEye} className="h-4 w-4" />
                        </button>
                        {meeting.status === 'scheduled' && (
                          <button className="text-green-600 hover:text-green-900 mr-3">
                            <FontAwesomeIcon icon={faPlay} className="h-4 w-4" />
                          </button>
                        )}
                        <button className="text-yellow-600 hover:text-yellow-900">
                          <FontAwesomeIcon icon={faEdit} className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'reports':
        return (
          <div className="space-y-6">
            {/* Reports Header */}
            <div className="flex justify-between items-center">
              <h4 className="text-lg font-medium text-gray-900">Group Reports & Analytics</h4>
              <div className="flex space-x-3">
                <select className="px-3 py-2 border border-gray-300 rounded-md text-sm">
                  <option>This Month</option>
                  <option>Last Month</option>
                  <option>This Year</option>
                  <option>Custom Range</option>
                </select>
                <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700">
                  <FontAwesomeIcon icon={faDownload} className="h-4 w-4 mr-2" />
                  Generate Report
                </button>
              </div>
            </div>

            {/* Charts and Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h5 className="text-lg font-medium text-gray-900 mb-4">Contribution Trends</h5>
                <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
                  <FontAwesomeIcon icon={faChartLine} className="h-16 w-16 text-gray-400" />
                  <span className="ml-3 text-gray-500">Chart placeholder</span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h5 className="text-lg font-medium text-gray-900 mb-4">Member Activity</h5>
                <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
                  <FontAwesomeIcon icon={faChartPie} className="h-16 w-16 text-gray-400" />
                  <span className="ml-3 text-gray-500">Chart placeholder</span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h5 className="text-lg font-medium text-gray-900 mb-4">Loan Performance</h5>
                <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
                  <FontAwesomeIcon icon={faChartBar} className="h-16 w-16 text-gray-400" />
                  <span className="ml-3 text-gray-500">Chart placeholder</span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h5 className="text-lg font-medium text-gray-900 mb-4">Meeting Attendance</h5>
                <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
                  <FontAwesomeIcon icon={faChartBar} className="h-16 w-16 text-gray-400" />
                  <span className="ml-3 text-gray-500">Chart placeholder</span>
                </div>
              </div>
            </div>

            {/* Quick Reports */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h5 className="text-lg font-medium text-gray-900 mb-4">Quick Reports</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <button className="p-4 border border-gray-300 rounded-lg text-center hover:bg-gray-50">
                  <FontAwesomeIcon icon={faFileAlt} className="h-8 w-8 text-blue-600 mb-2" />
                  <div className="text-sm font-medium text-gray-900">Monthly Summary</div>
                </button>
                <button className="p-4 border border-gray-300 rounded-lg text-center hover:bg-gray-50">
                  <FontAwesomeIcon icon={faUsers} className="h-8 w-8 text-green-600 mb-2" />
                  <div className="text-sm font-medium text-gray-900">Member Report</div>
                </button>
                <button className="p-4 border border-gray-300 rounded-lg text-center hover:bg-gray-50">
                  <FontAwesomeIcon icon={faMoneyBillWave} className="h-8 w-8 text-yellow-600 mb-2" />
                  <div className="text-sm font-medium text-gray-900">Financial Report</div>
                </button>
                <button className="p-4 border border-gray-300 rounded-lg text-center hover:bg-gray-50">
                  <FontAwesomeIcon icon={faCalendarAlt} className="h-8 w-8 text-purple-600 mb-2" />
                  <div className="text-sm font-medium text-gray-900">Meeting Report</div>
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };
};



export default AdminDashboard;
function handleToggleUserStatus(id: string) {
    throw new Error('Function not implemented.');
}

