import React, { useState, useCallback, useMemo, useRef } from "react";
import { FaFilter, FaFileExport, FaPrint, FaShare, FaEllipsisV, FaTimes, FaCalendarAlt, FaMoneyBillWave, FaUser, FaCheck, FaClock, FaBell, FaChartBar, FaChartLine, FaChartPie, FaCheckCircle, FaExclamationTriangle, FaEye, FaEyeSlash, FaHistory, FaLock, FaPlus, FaSearch, FaStar, FaTrophy, FaUnlock, FaUsers } from "react-icons/fa";
import { ANIMATION_DURATIONS, CONTRIBUTION_STATUSES, type ContributionStatus } from "@/constants";
import { formatCurrency, formatDate } from "@/utils/formatters";
import { BiTargetLock, BiWallet, BiUser, BiCalendar, BiMoney } from "react-icons/bi";
import { CiEdit } from "react-icons/ci";
import { MdTimer, MdAssessment, MdDeleteForever, MdWarning, MdCheckCircle, MdNotifications, MdAccountBalance, MdPayment, MdTrendingUp } from "react-icons/md";
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from "recharts";

// Contribution data interface
interface Contribution {
    id: string;
    member: string;
    amount: number;
    date: string;
    status: ContributionStatus;
    method: 'cash' | 'bank' | 'mobile';
    round: number;
}

// Mock data - replace with actual API calls
const MOCK_CONTRIBUTIONS: Contribution[] = [
    {
        id: '1',
        member: 'John Doe',
        amount: 5000,
        date: '2024-01-15',
        status: 'completed',
        method: 'bank',
        round: 1
    },
    {
        id: '2',
        member: 'Jane Smith',
        amount: 5000,
        date: '2024-01-15',
        status: 'pending',
        method: 'mobile',
        round: 1
    },
    {
        id: '3',
        member: 'Mike Johnson',
        amount: 5000,
        date: '2024-01-10',
        status: 'overdue',
        method: 'cash',
        round: 1
    },
    {
        id: '4',
        member: 'Sarah Wilson',
        amount: 5000,
        date: '2024-01-15',
        status: 'completed',
        method: 'bank',
        round: 1
    },
    {
        id: '5',
        member: 'David Brown',
        amount: 5000,
        date: '2024-01-15',
        status: 'completed',
        method: 'mobile',
        round: 1
    }
];

// Memoized status badge component
const StatusBadge = React.memo<{ status: ContributionStatus }>(({ status }) => {
    const statusConfig = useMemo(() => {
        switch (status) {
            case 'completed':
                return {
                    icon: FaCheck,
                    color: 'bg-green-100 text-green-800',
                    label: 'Completed'
                };
            case 'pending':
                return {
                    icon: FaClock,
                    color: 'bg-yellow-100 text-yellow-800',
                    label: 'Pending'
                };
            case 'overdue':
                return {
                    icon: FaTimes,
                    color: 'bg-red-100 text-red-800',
                    label: 'Overdue'
                };
            default:
                return {
                    icon: FaClock,
                    color: 'bg-gray-100 text-gray-800',
                    label: 'Unknown'
                };
        }
    }, [status]);

    const Icon = statusConfig.icon;

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig.color}`}>
            <Icon className="w-3 h-3 mr-1" />
            {statusConfig.label}
        </span>
    );
});

StatusBadge.displayName = 'StatusBadge';

// Memoized contribution row component
const ContributionRow = React.memo<{ contribution: Contribution; index: number }>(({ contribution, index }) => (
    <tr className={`hover:bg-gray-50 transition-colors duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
        <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
            <div className="flex items-center">
                <div className="flex-shrink-0 h-8 w-8">
                    <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                        <FaUser className="h-4 w-4 text-gray-600" />
                    </div>
                </div>
                <div className="ml-3">
                    <div className="font-medium">{contribution.member}</div>
                </div>
            </div>
        </td>
        <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
            <div className="flex items-center">
                <FaMoneyBillWave className="h-4 w-4 text-green-600 mr-2" />
                {formatCurrency(contribution.amount)}
            </div>
        </td>
        <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
            <div className="flex items-center">
                <FaCalendarAlt className="h-4 w-4 text-blue-600 mr-2" />
                {formatDate(contribution.date)}
            </div>
        </td>
        <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
            <StatusBadge status={contribution.status} />
        </td>
        <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
            {contribution.method}
        </td>
        <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
            Round {contribution.round}
        </td>
    </tr>
));

ContributionRow.displayName = 'ContributionRow';

/* Removed duplicate export default Contributions implementation to resolve redeclaration and duplicate function errors. */

export default function Contributions() {
    const [showSensitiveData, setShowSensitiveData] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');
    const [selectedMember, setSelectedMember] = useState<MemberData | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterCategory, setFilterCategory] = useState("all");
    const [dateFilter, setDateFilter] = useState("all");
    const [showActionMenu, setShowActionMenu] = useState(false);

    // Sample Chama Data
    const chamaData = {
        name: "Umoja Savings Chama",
        totalMembers: 25,
        totalContributions: 2850000,
        monthlyTarget: 125000,
        currentMonthCollection: 98500,
        avgContributionPerMember: 114000,
        topContributor: "Mary Wanjiku"
    };

    // Contribution Categories
    const contributionCategories = [
        { id: 1, name: "Monthly Savings", target: 5000, mandatory: true, color: "#10b981" },
        { id: 2, name: "Emergency Fund", target: 2000, mandatory: true, color: "#ef4444" },
        { id: 3, name: "Investment Fund", target: 3000, mandatory: false, color: "#3b82f6" },
        { id: 4, name: "Social Fund", target: 1000, mandatory: false, color: "#f59e0b" },
        { id: 5, name: "Welfare Fund", target: 1500, mandatory: true, color: "#8b5cf6" },
        { id: 6, name: "Development Projects", target: 2500, mandatory: false, color: "#06b6d4" }
    ];

    // Types for contributions and members
    type ContributionCategoryData = {
        contributed: number;
        target: number;
        percentage: number;
    };
    type ContributionCategories = {
        [category: string]: ContributionCategoryData;
    };
    type MemberContribution = {
        totalContributed: number;
        monthlyAverage: number;
        contributionScore: number;
        loanEligibleAmount: number;
        lastContribution: string;
        streak: number;
        categories: ContributionCategories;
    };
    type ContributionHistory = {
        date: string;
        amount: number;
        category: string;
        method: string;
    };
    type MemberData = {
        id: number;
        name: string;
        membershipNumber: string;
        joinedDate: string;
        phone: string;
        email: string;
        contributions: MemberContribution;
        contributionHistory: ContributionHistory[];
    };
    
    // Sample Members with Contributions
    const membersData: MemberData[] = [
        {
            id: 1,
            name: "Mary Wanjiku",
            membershipNumber: "UM008",
            joinedDate: "2022-12-01",
            phone: "(254) 721-987-654",
            email: "mary.wanjiku@example.com",
            contributions: {
                totalContributed: 156000,
                monthlyAverage: 12500,
                contributionScore: 98,
                loanEligibleAmount: 468000,
                lastContribution: "2024-12-01",
                streak: 24,
                categories: {
                    "Monthly Savings": { contributed: 120000, target: 120000, percentage: 100 },
                    "Emergency Fund": { contributed: 24000, target: 24000, percentage: 100 },
                    "Investment Fund": { contributed: 8000, target: 36000, percentage: 22 },
                    "Welfare Fund": { contributed: 18000, target: 18000, percentage: 100 }
                }
            },
            contributionHistory: [
                { date: "2024-12-01", amount: 12500, category: "Monthly Savings", method: "M-Pesa" },
                { date: "2024-11-28", amount: 2000, category: "Emergency Fund", method: "Bank Transfer" },
                { date: "2024-11-15", amount: 5000, category: "Monthly Savings", method: "Cash" }
            ]
        },
        {
            id: 2,
            name: "John Doe",
            membershipNumber: "UM001",
            joinedDate: "2023-01-01",
            phone: "(123) 456-7890",
            email: "johndoe@example.com",
            contributions: {
                totalContributed: 89500,
                monthlyAverage: 8500,
                contributionScore: 72,
                loanEligibleAmount: 268500,
                lastContribution: "2024-11-25",
                streak: 18,
                categories: {
                    "Monthly Savings": { contributed: 60000, target: 110000, percentage: 55 },
                    "Emergency Fund": { contributed: 18000, target: 22000, percentage: 82 },
                    "Welfare Fund": { contributed: 11500, target: 16500, percentage: 70 }
                }
            },
            contributionHistory: [
                { date: "2024-11-25", amount: 5000, category: "Monthly Savings", method: "M-Pesa" },
                { date: "2024-11-10", amount: 2000, category: "Emergency Fund", method: "Cash" },
                { date: "2024-10-28", amount: 1500, category: "Welfare Fund", method: "Bank Transfer" }
            ]
        },
        {
            id: 3,
            name: "Sarah Wilson",
            membershipNumber: "UM002",
            joinedDate: "2022-08-10",
            phone: "(555) 123-4567",
            email: "sarah.wilson@example.com",
            contributions: {
                totalContributed: 142000,
                monthlyAverage: 11200,
                contributionScore: 88,
                loanEligibleAmount: 426000,
                lastContribution: "2024-12-02",
                streak: 22,
                categories: {
                    "Monthly Savings": { contributed: 95000, target: 125000, percentage: 76 },
                    "Emergency Fund": { contributed: 22000, target: 25000, percentage: 88 },
                    "Investment Fund": { contributed: 15000, target: 37500, percentage: 40 },
                    "Welfare Fund": { contributed: 10000, target: 18750, percentage: 53 }
                }
            },
            contributionHistory: [
                { date: "2024-12-02", amount: 5000, category: "Monthly Savings", method: "M-Pesa" },
                { date: "2024-11-30", amount: 3000, category: "Investment Fund", method: "Bank Transfer" },
                { date: "2024-11-15", amount: 2000, category: "Emergency Fund", method: "M-Pesa" }
            ]
        },
        {
            id: 4,
            name: "Peter Kamau",
            membershipNumber: "UM012",
            joinedDate: "2023-05-20",
            phone: "(254) 712-345-678",
            email: "peter.kamau@example.com",
            contributions: {
                totalContributed: 67500,
                monthlyAverage: 9500,
                contributionScore: 65,
                loanEligibleAmount: 202500,
                lastContribution: "2024-11-20",
                streak: 12,
                categories: {
                    "Monthly Savings": { contributed: 45000, target: 75000, percentage: 60 },
                    "Emergency Fund": { contributed: 12000, target: 15000, percentage: 80 },
                    "Welfare Fund": { contributed: 10500, target: 11250, percentage: 93 }
                }
            },
            contributionHistory: [
                { date: "2024-11-20", amount: 5000, category: "Monthly Savings", method: "Cash" },
                { date: "2024-11-05", amount: 2000, category: "Emergency Fund", method: "M-Pesa" },
                { date: "2024-10-25", amount: 1500, category: "Welfare Fund", method: "Bank Transfer" }
            ]
        },
        {
            id: 5,
            name: "Grace Mwangi",
            membershipNumber: "UM015",
            joinedDate: "2023-03-15",
            phone: "(254) 734-567-890",
            email: "grace.mwangi@example.com",
            contributions: {
                totalContributed: 125000,
                monthlyAverage: 12500,
                contributionScore: 92,
                loanEligibleAmount: 375000,
                lastContribution: "2024-12-01",
                streak: 20,
                categories: {
                    "Monthly Savings": { contributed: 80000, target: 100000, percentage: 80 },
                    "Emergency Fund": { contributed: 20000, target: 20000, percentage: 100 },
                    "Investment Fund": { contributed: 12000, target: 30000, percentage: 40 },
                    "Welfare Fund": { contributed: 13000, target: 15000, percentage: 87 }
                }
            },
            contributionHistory: [
                { date: "2024-12-01", amount: 5000, category: "Monthly Savings", method: "M-Pesa" },
                { date: "2024-11-28", amount: 2000, category: "Emergency Fund", method: "Bank Transfer" },
                { date: "2024-11-20", amount: 3000, category: "Investment Fund", method: "M-Pesa" }
            ]
        }
    ];

    // Chart Data
    const monthlyContributionTrends = [
        { month: 'Jan 2024', total: 115000, target: 125000, members: 22 },
        { month: 'Feb 2024', total: 108000, target: 125000, members: 23 },
        { month: 'Mar 2024', total: 132000, target: 125000, members: 24 },
        { month: 'Apr 2024', total: 128000, target: 125000, members: 24 },
        { month: 'May 2024', total: 119000, target: 125000, members: 25 },
        { month: 'Jun 2024', total: 135000, target: 125000, members: 25 },
        { month: 'Jul 2024', total: 142000, target: 125000, members: 25 },
        { month: 'Aug 2024', total: 138000, target: 125000, members: 25 },
        { month: 'Sep 2024', total: 125000, target: 125000, members: 25 },
        { month: 'Oct 2024', total: 148000, target: 125000, members: 25 },
        { month: 'Nov 2024', total: 156000, target: 125000, members: 25 },
        { month: 'Dec 2024', total: 98500, target: 125000, members: 25 }
    ];

    const categoryContributions = contributionCategories.map(cat => {
        const totalContributed = membersData.reduce((sum, member) => {
            return sum + (member.contributions.categories[cat.name]?.contributed || 0);
        }, 0);
        return {
            name: cat.name,
            value: totalContributed,
            target: cat.target * membersData.length,
            percentage: Math.round((totalContributed / (cat.target * membersData.length)) * 100),
            color: cat.color
        };
    });

    const memberPerformanceData = membersData.map(member => ({
        name: member.name.split(' ')[0],
        score: member.contributions.contributionScore,
        total: member.contributions.totalContributed,
        streak: member.contributions.streak
    }));

    // Utility Functions
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-KE', {
            style: 'currency',
            currency: 'KES'
        }).format(amount);
    };

    const getScoreColor = (score: number) => {
        if (score >= 90) return 'text-green-600 bg-green-100';
        if (score >= 75) return 'text-blue-600 bg-blue-100';
        if (score >= 60) return 'text-yellow-600 bg-yellow-100';
        return 'text-red-600 bg-red-100';
    };

    const getScoreBadge = (score: number) => {
        if (score >= 90) return { label: 'Excellent', icon: FaTrophy, color: 'text-yellow-500' };
        if (score >= 75) return { label: 'Good', icon: FaCheckCircle, color: 'text-green-500' };
        if (score >= 60) return { label: 'Fair', icon: MdTimer, color: 'text-blue-500' };
        return { label: 'Poor', icon: FaExclamationTriangle, color: 'text-red-500' };
    };

    type MaskedDataProps = {
        children: React.ReactNode;
        className?: string;
    };
    const MaskedData = ({ children, className = "" }: MaskedDataProps) => (
        <span className={`${className} ${showSensitiveData ? '' : 'blur-sm select-none'} transition-all duration-300`}>
            {showSensitiveData ? children : '••••••'}
        </span>
    );

    const filteredMembers = membersData.filter(member => {
        const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             member.membershipNumber.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
    });

    const tabs = [
        { id: 'overview', label: 'Overview', icon: MdAssessment },
        { id: 'analytics', label: 'Analytics', icon: FaChartLine },
        { id: 'members', label: 'Members', icon: FaUsers },
        { id: 'categories', label: 'Categories', icon: BiTargetLock },
        { id: 'reminders', label: 'Reminders', icon: FaBell }
    ];

    // Member Detail Modal
    const MemberDetailModal = ({ member, onClose }: { member: MemberData; onClose: () => void }) => (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
            <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                            {member.name}
                            {(() => {
                                const badge = getScoreBadge(member.contributions.contributionScore);
                                const IconComponent = badge.icon;
                                return (
                                    <span className={badge.color}>
                                        <IconComponent className="w-6 h-6" />
                                    </span>
                                );
                            })()}
                        </h2>
                        <p className="text-gray-600">Member ID: {member.membershipNumber} • Joined: {member.joinedDate}</p>
                    </div>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-xl font-bold">×</button>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Performance Overview */}
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg">
                        <h3 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                            <FaStar className="w-5 h-5" />
                            Performance Overview
                        </h3>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span>Contribution Score:</span>
                                <span className={`px-2 py-1 rounded-full text-sm font-bold ${getScoreColor(member.contributions.contributionScore)}`}>
                                    {member.contributions.contributionScore}%
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span>Payment Streak:</span>
                                <span className="font-bold text-green-600">{member.contributions.streak} months</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Total Contributed:</span>
                                <MaskedData className="font-bold text-blue-600">
                                    {formatCurrency(member.contributions.totalContributed)}
                                </MaskedData>
                            </div>
                            <div className="flex justify-between">
                                <span>Monthly Average:</span>
                                <MaskedData className="font-bold">
                                    {formatCurrency(member.contributions.monthlyAverage)}
                                </MaskedData>
                            </div>
                        </div>
                    </div>

                    {/* Loan Eligibility */}
                    <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg">
                        <h3 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
                            <BiWallet className="w-5 h-5" />
                            Loan Eligibility
                        </h3>
                        <div className="text-center">
                            <p className="text-sm text-green-600">Maximum Loan Amount</p>
                            <MaskedData className="text-2xl font-bold text-green-700">
                                {formatCurrency(member.contributions.loanEligibleAmount)}
                            </MaskedData>
                            <p className="text-xs text-gray-600 mt-1">3x your total contributions</p>
                            <div className="w-full bg-gray-200 rounded-full h-3 mt-3">
                                <div 
                                    className="bg-green-600 h-3 rounded-full" 
                                    style={{width: `${Math.min((member.contributions.totalContributed / 200000) * 100, 100)}%`}}
                                ></div>
                            </div>
                            <p className="text-xs text-center text-gray-600 mt-1">
                                {formatCurrency(200000 - member.contributions.totalContributed)} to maximum eligibility
                            </p>
                        </div>
                    </div>

                    {/* Contact & Status */}
                    <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg">
                        <h3 className="font-semibold text-purple-800 mb-3 flex items-center gap-2">
                            <BiUser className="w-5 h-5" />
                            Contact & Status
                        </h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span>Phone:</span>
                                <MaskedData>{member.phone}</MaskedData>
                            </div>
                            <div className="flex justify-between">
                                <span>Email:</span>
                                <MaskedData className="break-all">{member.email}</MaskedData>
                            </div>
                            <div className="flex justify-between">
                                <span>Last Payment:</span>
                                <span className="font-medium">{member.contributions.lastContribution}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Status:</span>
                                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                                    Active
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Category Breakdown */}
                <div className="mt-6 bg-white border rounded-lg p-4">
                    <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <BiTargetLock className="w-5 h-5" />
                        Contribution Categories
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Object.entries(member.contributions.categories).map(([category, data]) => (
                            <div key={category} className="border rounded-lg p-3">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="font-medium text-sm">{category}</span>
                                    <span className="text-xs font-bold">{data.percentage}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                                    <div 
                                        className="bg-blue-600 h-2 rounded-full" 
                                        style={{width: `${data.percentage}%`}}
                                    ></div>
                                </div>
                                <div className="flex justify-between text-xs text-gray-600">
                                    <MaskedData>{formatCurrency(data.contributed)}</MaskedData>
                                    <span>Target: {formatCurrency(data.target)}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Contribution History */}
                <div className="mt-6 bg-white border rounded-lg p-4">
                    <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <FaHistory className="w-5 h-5" />
                        Recent Contributions
                    </h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="p-2 text-left">Date</th>
                                    <th className="p-2 text-left">Amount</th>
                                    <th className="p-2 text-left">Category</th>
                                    <th className="p-2 text-left">Method</th>
                                </tr>
                            </thead>
                            <tbody>
                                {member.contributionHistory.map((contribution, index) => (
                                    <tr key={index} className="border-b border-gray-100">
                                        <td className="p-2">{contribution.date}</td>
                                        <td className="p-2">
                                            <MaskedData className="font-medium text-green-600">
                                                {formatCurrency(contribution.amount)}
                                            </MaskedData>
                                        </td>
                                        <td className="p-2">{contribution.category}</td>
                                        <td className="p-2">
                                            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                                                {contribution.method}
                                            </span>
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

    const MembersTab = () => (
        <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-green-100">Top Performers</p>
                            <p className="text-2xl font-bold">8</p>
                        </div>
                        <FaTrophy className="w-8 h-8 text-green-200" />
                    </div>
                </div>
                
                <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-yellow-100">Need Attention</p>
                            <p className="text-2xl font-bold">4</p>
                        </div>
                        <FaExclamationTriangle className="w-8 h-8 text-yellow-200" />
                    </div>
                </div>
                
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-blue-100">Average Score</p>
                            <p className="text-2xl font-bold">83%</p>
                        </div>
                        <FaStar className="w-8 h-8 text-blue-200" />
                    </div>
                </div>
            </div>

            {/* Search and Filter Controls */}
            <div className="bg-white p-4 rounded-lg shadow-md">
                <div className="flex flex-wrap justify-between items-center gap-4">
                    <div className="flex flex-wrap items-center gap-4">
                        <div className="relative">
                            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Search members..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 w-64"
                            />
                        </div>
                        
                        <select
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        >
                            <option value="all">All Performance Levels</option>
                            <option value="excellent">Excellent (90%+)</option>
                            <option value="good">Good (75-89%)</option>
                            <option value="fair">Fair (60-74%)</option>
                            <option value="poor">Poor (&lt;60%)</option>
                        </select>
                    </div>

                    <button
                        onClick={() => setShowSensitiveData(!showSensitiveData)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                            showSensitiveData 
                                ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                                : 'bg-green-100 text-green-700 hover:bg-green-200'
                        }`}
                    >
                        {showSensitiveData ? <FaEyeSlash /> : <FaEye />}
                        {showSensitiveData ? <FaUnlock /> : <FaLock />}
                        <span className="text-sm font-medium">
                            {showSensitiveData ? 'Hide Financial Data' : 'Show Financial Data'}
                        </span>
                    </button>
                </div>
                
                <div className="text-sm text-gray-600 mt-3 pt-3 border-t border-gray-200">
                    Showing {filteredMembers.length} of {membersData.length} members
                </div>
            </div>

            {/* Members Table */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead className="bg-green-700 text-white">
                            <tr>
                                <th className="p-3 text-left font-medium">Member Details</th>
                                <th className="p-3 text-left font-medium">Total Contributed</th>
                                <th className="p-3 text-left font-medium">Monthly Avg</th>
                                <th className="p-3 text-left font-medium">Score</th>
                                <th className="p-3 text-left font-medium">Streak</th>
                                <th className="p-3 text-left font-medium">Loan Eligible</th>
                                <th className="p-3 text-left font-medium">Last Payment</th>
                                <th className="p-3 text-left font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredMembers.map((member) => {
                                const badge = getScoreBadge(member.contributions.contributionScore);
                                const IconComponent = badge.icon;
                                return (
                                    <tr key={member.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                        <td className="p-3">
                                            <div className="flex items-center gap-3">
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-gray-900 flex items-center gap-2">
                                                        {member.name}
                                                        <IconComponent className={`w-4 h-4 ${badge.color}`} />
                                                    </span>
                                                    <span className="text-xs text-gray-500">ID: {member.membershipNumber}</span>
                                                    <span className="text-xs text-blue-600">Joined: {member.joinedDate}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-3">
                                            <MaskedData className="font-medium text-green-600">
                                                {formatCurrency(member.contributions.totalContributed)}
                                            </MaskedData>
                                        </td>
                                        <td className="p-3">
                                            <MaskedData className="font-medium text-blue-600">
                                                {formatCurrency(member.contributions.monthlyAverage)}
                                            </MaskedData>
                                        </td>
                                        <td className="p-3">
                                            <span className={`px-3 py-1 rounded-full text-sm font-bold ${getScoreColor(member.contributions.contributionScore)}`}>
                                                {member.contributions.contributionScore}%
                                            </span>
                                        </td>
                                        <td className="p-3">
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium text-purple-600">{member.contributions.streak}</span>
                                                <span className="text-xs text-gray-600">months</span>
                                            </div>
                                        </td>
                                        <td className="p-3">
                                            <MaskedData className="font-medium text-orange-600">
                                                {formatCurrency(member.contributions.loanEligibleAmount)}
                                            </MaskedData>
                                        </td>
                                        <td className="p-3">
                                            <span className="text-sm text-gray-600">{member.contributions.lastContribution}</span>
                                        </td>
                                        <td className="p-3">
                                            <div className="flex gap-2 items-center">
                                                <button 
                                                    onClick={() => setSelectedMember(member)}
                                                    className="text-green-600 hover:text-green-800 p-1 rounded hover:bg-green-100 transition-colors"
                                                    title="View Details"
                                                >
                                                    <FaEye className="h-4 w-4" />
                                                </button>
                                                <button className="text-blue-500 p-1 rounded hover:bg-blue-100 transition-colors" title="Send Reminder">
                                                    <FaBell className="h-4 w-4" />
                                                </button>
                                                <button className="text-purple-500 p-1 rounded hover:bg-purple-100 transition-colors" title="View History">
                                                    <FaHistory className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );

    const CategoriesTab = () => (
        <div className="space-y-6">
            {/* Category Overview */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <BiTargetLock className="text-blue-600" />
                    Contribution Categories Overview
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                    {contributionCategories.map((category) => {
                        const categoryData = categoryContributions.find(cat => cat.name === category.name);
                        return (
                            <div key={category.id} className="border rounded-lg p-3 sm:p-4 hover:shadow-md transition-shadow">
                                <div className="flex items-center justify-between mb-3">
                                    <h4 className="font-medium text-gray-800 flex items-center gap-2 text-sm sm:text-base">
                                        <div 
                                            className="w-3 h-3 rounded-full flex-shrink-0" 
                                            style={{ backgroundColor: category.color }}
                                        ></div>
                                        <span className="truncate">{category.name}</span>
                                    </h4>
                                    {category.mandatory && (
                                        <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium whitespace-nowrap flex-shrink-0">
                                            Mandatory
                                        </span>
                                    )}
                                </div>
                                
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span>Progress:</span>
                                        <span className="font-medium">{categoryData?.percentage || 0}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                                        <div 
                                            className="h-2 rounded-full transition-all duration-300 ease-in-out" 
                                            style={{ 
                                                backgroundColor: category.color,
                                                width: `${Math.min(categoryData?.percentage || 0, 100)}%` 
                                            }}
                                        ></div>
                                    </div>
                                    <div className="flex justify-between text-xs text-gray-600 gap-2">
                                        <MaskedData className="truncate">
                                            {formatCurrency(categoryData?.value || 0)}
                                        </MaskedData>
                                        <span className="text-right whitespace-nowrap">Target: {formatCurrency(category.target * membersData.length)}</span>
                                    </div>
                                </div>
                                
                                <div className="mt-3 pt-3 border-t border-gray-200">
                                    <div className="flex justify-between text-xs">
                                        <span className="text-gray-600">Per Member Target:</span>
                                        <span className="font-medium text-gray-800">{formatCurrency(category.target)}</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Category Performance Chart */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <FaChartBar className="text-green-600" />
                    Category Performance Comparison
                </h3>
                <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={categoryContributions}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                        <YAxis />
                        <Tooltip formatter={(value, name) => [
                            name === 'percentage' ? `${value}%` : formatCurrency(Number(value)),
                            name === 'value' ? 'Collected' : name === 'target' ? 'Target' : name
                        ]} />
                        <Legend />
                        <Bar dataKey="value" fill="#10b981" name="Collected" />
                        <Bar dataKey="target" fill="#ef4444" name="Target" />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Category Settings */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                        <CiEdit className="text-blue-600" />
                        Manage Categories
                    </h3>
                    <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2">
                        <FaPlus className="w-4 h-4" />
                        Add Category
                    </button>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="p-3 text-left">Category Name</th>
                                <th className="p-3 text-left">Target Amount</th>
                                <th className="p-3 text-left">Type</th>
                                <th className="p-3 text-left">Status</th>
                                <th className="p-3 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {contributionCategories.map((category) => (
                                <tr key={category.id} className="border-b border-gray-100">
                                    <td className="p-3">
                                        <div className="flex items-center gap-2">
                                            <div 
                                                className="w-3 h-3 rounded-full" 
                                                style={{ backgroundColor: category.color }}
                                            ></div>
                                            <span className="font-medium">{category.name}</span>
                                        </div>
                                    </td>
                                    <td className="p-3 font-medium">{formatCurrency(category.target)}</td>
                                    <td className="p-3">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                            category.mandatory 
                                                ? 'bg-red-100 text-red-800' 
                                                : 'bg-blue-100 text-blue-800'
                                        }`}>
                                            {category.mandatory ? 'Mandatory' : 'Optional'}
                                        </span>
                                    </td>
                                    <td className="p-3">
                                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                                            Active
                                        </span>
                                    </td>
                                    <td className="p-3">
                                        <div className="flex gap-2">
                                            <button className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-100">
                                                <CiEdit className="w-4 h-4" />
                                            </button>
                                            <button className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-100">
                                                <MdDeleteForever className="w-4 h-4" />
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
    );

    const RemindersTab = () => (
        <div className="space-y-6">
            {/* Reminder Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-red-100">Overdue</p>
                            <p className="text-2xl font-bold">3</p>
                        </div>
                        <MdWarning className="w-8 h-8 text-red-200" />
                    </div>
                </div>
                
                <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-yellow-100">Due Today</p>
                            <p className="text-2xl font-bold">7</p>
                        </div>
                        <FaBell className="w-8 h-8 text-yellow-200" />
                    </div>
                </div>
                
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-blue-100">Due This Week</p>
                            <p className="text-2xl font-bold">15</p>
                        </div>
                        <FaCalendarAlt className="w-8 h-8 text-blue-200" />
                    </div>
                </div>
                
                <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-green-100">Up to Date</p>
                            <p className="text-2xl font-bold">20</p>
                        </div>
                        <MdCheckCircle className="w-8 h-8 text-green-200" />
                    </div>
                </div>
            </div>

            {/* Reminder Actions */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                        <MdNotifications className="text-blue-600" />
                        Quick Actions
                    </h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button className="p-4 border-2 border-dashed border-red-300 rounded-lg text-red-600 hover:bg-red-50 transition-colors">
                        <MdWarning className="w-8 h-8 mx-auto mb-2" />
                        <div className="font-medium">Send Overdue Reminders</div>
                        <div className="text-sm text-gray-600">3 members</div>
                    </button>
                    
                    <button className="p-4 border-2 border-dashed border-yellow-300 rounded-lg text-yellow-600 hover:bg-yellow-50 transition-colors">
                        <FaBell className="w-8 h-8 mx-auto mb-2" />
                        <div className="font-medium">Send Daily Reminders</div>
                        <div className="text-sm text-gray-600">7 members</div>
                    </button>
                    
                    <button className="p-4 border-2 border-dashed border-blue-300 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors">
                        <FaCalendarAlt className="w-8 h-8 mx-auto mb-2" />
                        <div className="font-medium">Send Weekly Reminders</div>
                        <div className="text-sm text-gray-600">15 members</div>
                    </button>
                </div>
            </div>

            {/* Member Contribution Status */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <BiCalendar className="text-green-600" />
                    Member Contribution Status
                </h3>
                
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="p-3 text-left">Member</th>
                                <th className="p-3 text-left">Last Contribution</th>
                                <th className="p-3 text-left">Days Overdue</th>
                                <th className="p-3 text-left">Amount Due</th>
                                <th className="p-3 text-left">Status</th>
                                <th className="p-3 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[
                                { name: 'James Muthoni', lastPayment: '2024-10-15', daysOverdue: 45, amountDue: 15000, status: 'overdue' },
                                { name: 'Lucy Akinyi', lastPayment: '2024-11-28', daysOverdue: 5, amountDue: 5000, status: 'overdue' },
                                { name: 'Daniel Ochieng', lastPayment: '2024-11-20', daysOverdue: 12, amountDue: 8000, status: 'overdue' },
                                { name: 'Alice Wambui', lastPayment: '2024-12-01', daysOverdue: 0, amountDue: 5000, status: 'due_today' },
                                { name: 'Robert Kiprotich', lastPayment: '2024-11-30', daysOverdue: 0, amountDue: 7500, status: 'due_today' }
                            ].map((member, index) => (
                                <tr key={index} className="border-b border-gray-100">
                                    <td className="p-3 font-medium">{member.name}</td>
                                    <td className="p-3 text-sm text-gray-600">{member.lastPayment}</td>
                                    <td className="p-3">
                                        {member.daysOverdue > 0 ? (
                                            <span className="text-red-600 font-medium">{member.daysOverdue} days</span>
                                        ) : (
                                            <span className="text-green-600">-</span>
                                        )}
                                    </td>
                                    <td className="p-3">
                                        <MaskedData className="font-medium text-orange-600">
                                            {formatCurrency(member.amountDue)}
                                        </MaskedData>
                                    </td>
                                    <td className="p-3">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                            member.status === 'overdue' 
                                                ? 'bg-red-100 text-red-800'
                                                : 'bg-yellow-100 text-yellow-800'
                                        }`}>
                                            {member.status === 'overdue' ? 'Overdue' : 'Due Today'}
                                        </span>
                                    </td>
                                    <td className="p-3">
                                        <div className="flex gap-2">
                                            <button className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-100" title="Send SMS">
                                                <FaBell className="w-4 h-4" />
                                            </button>
                                            <button className="text-green-600 hover:text-green-800 p-1 rounded hover:bg-green-100" title="Call">
                                                <BiUser className="w-4 h-4" />
                                            </button>
                                            <button className="text-purple-600 hover:text-purple-800 p-1 rounded hover:bg-purple-100" title="Email">
                                                <MdNotifications className="w-4 h-4" />
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
    );

    // Tab Components
    const OverviewTab = () => (
        <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
                <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 sm:p-6 rounded-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-green-100 text-xs sm:text-sm">Total Contributions</p>
                            <MaskedData className="text-lg sm:text-2xl font-bold">{formatCurrency(chamaData.totalContributions)}</MaskedData>
                        </div>
                        <MdAccountBalance className="w-6 h-6 sm:w-8 sm:h-8 text-green-200" />
                    </div>
                </div>
                
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 sm:p-6 rounded-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-blue-100 text-xs sm:text-sm">Monthly Target</p>
                            <MaskedData className="text-lg sm:text-2xl font-bold">{formatCurrency(chamaData.monthlyTarget)}</MaskedData>
                        </div>
                        <BiTargetLock className="w-6 h-6 sm:w-8 sm:h-8 text-blue-200" />
                    </div>
                </div>
                
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 sm:p-6 rounded-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-purple-100 text-xs sm:text-sm">This Month</p>
                            <MaskedData className="text-lg sm:text-2xl font-bold">{formatCurrency(chamaData.currentMonthCollection)}</MaskedData>
                        </div>
                        <MdPayment className="w-6 h-6 sm:w-8 sm:h-8 text-purple-200" />
                    </div>
                </div>
                
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 sm:p-6 rounded-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-orange-100 text-xs sm:text-sm">Avg Per Member</p>
                            <MaskedData className="text-lg sm:text-2xl font-bold">{formatCurrency(chamaData.avgContributionPerMember)}</MaskedData>
                        </div>
                        <FaUsers className="w-6 h-6 sm:w-8 sm:h-8 text-orange-200" />
                    </div>
                </div>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 gap-6">
                {/* Monthly Trends */}
                <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <FaChartLine className="text-blue-600" />
                        Monthly Contribution Trends
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={monthlyContributionTrends}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                            <Legend />
                            <Line type="monotone" dataKey="total" stroke="#10b981" name="Actual" strokeWidth={3} />
                            <Line type="monotone" dataKey="target" stroke="#ef4444" name="Target" strokeDasharray="5 5" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Category Distribution */}
                <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <FaChartPie className="text-green-600" />
                        Contribution by Category
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={categoryContributions}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percentage }) => `${name} ${percentage}%`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {categoryContributions.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Member Performance */}
                <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <FaTrophy className="text-yellow-600" />
                        Member Performance Ranking
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={memberPerformanceData.sort((a, b) => b.score - a.score)}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip formatter={(value, name) => [
                                name === 'score' ? `${value}%` : formatCurrency(Number(value)),
                                name
                            ]} />
                            <Legend />
                            <Bar dataKey="score" fill="#3b82f6" name="Contribution Score %" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );

    const AnalyticsTab = () => (
        <div className="space-y-6">
            {/* Performance Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <MdTrendingUp className="text-green-600" />
                        Collection Rate
                    </h3>
                    <div className="text-center">
                        <div className="text-3xl font-bold text-green-600">78.8%</div>
                        <p className="text-sm text-gray-600">This month</p>
                        <div className="mt-3 w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                            <div className="bg-green-600 h-3 rounded-full transition-all duration-300 ease-in-out" style={{width: '78.8%'}}></div>
                        </div>
                    </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <FaUsers className="text-blue-600" />
                        Active Contributors
                    </h3>
                    <div className="text-center">
                        <div className="text-3xl font-bold text-blue-600">23/25</div>
                        <p className="text-sm text-gray-600">Members contributing</p>
                        <div className="mt-3 flex justify-center gap-1">
                            {[...Array(25)].map((_, i) => (
                                <div 
                                    key={i}
                                    className={`w-2 h-6 rounded ${i < 23 ? 'bg-blue-500' : 'bg-gray-300'}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <MdTimer className="text-orange-600" />
                        Avg Days to Contribute
                    </h3>
                    <div className="text-center">
                        <div className="text-3xl font-bold text-orange-600">12</div>
                        <p className="text-sm text-gray-600">Days from due date</p>
                        <div className="mt-3 text-xs text-gray-500">
                            Target: Within 5 days
                        </div>
                    </div>
                </div>
            </div>

            {/* Detailed Analytics Charts */}
            <div className="grid grid-cols-1 gap-6">
                {/* Contribution Patterns */}
                <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <FaChartBar className="text-indigo-600" />
                        Weekly Contribution Patterns
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={[
                            { day: 'Mon', amount: 25000 },
                            { day: 'Tue', amount: 18000 },
                            { day: 'Wed', amount: 32000 },
                            { day: 'Thu', amount: 28000 },
                            { day: 'Fri', amount: 45000 },
                            { day: 'Sat', amount: 15000 },
                            { day: 'Sun', amount: 8000 }
                        ]}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="day" />
                            <YAxis />
                            <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                            <Bar dataKey="amount" fill="#6366f1" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Payment Methods */}
                <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <MdPayment className="text-purple-600" />
                        Payment Method Distribution
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={[
                                    { name: 'M-Pesa', value: 65, color: '#10b981' },
                                    { name: 'Bank Transfer', value: 25, color: '#3b82f6' },
                                    { name: 'Cash', value: 10, color: '#f59e0b' }
                                ]}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, value }) => `${name} ${value}%`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {[
                                    { name: 'M-Pesa', value: 65, color: '#10b981' },
                                    { name: 'Bank Transfer', value: 25, color: '#3b82f6' },
                                    { name: 'Cash', value: 10, color: '#f59e0b' }
                                ].map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip formatter={(value) => `${value}%`} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Contribution Frequency */}
                <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <FaCalendarAlt className="text-orange-600" />
                        Contribution Frequency Analysis
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={[
                            { period: 'Week 1', onTime: 20, late: 3, missed: 2 },
                            { period: 'Week 2', onTime: 18, late: 5, missed: 2 },
                            { period: 'Week 3', onTime: 22, late: 2, missed: 1 },
                            { period: 'Week 4', onTime: 19, late: 4, missed: 2 }
                        ]}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="period" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Area type="monotone" dataKey="onTime" stackId="1" stroke="#10b981" fill="#10b981" name="On Time" />
                            <Area type="monotone" dataKey="late" stackId="1" stroke="#f59e0b" fill="#f59e0b" name="Late" />
                            <Area type="monotone" dataKey="missed" stackId="1" stroke="#ef4444" fill="#ef4444" name="Missed" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Additional Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <MdTrendingUp className="text-green-600" />
                        Growth Metrics
                    </h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Monthly Growth</span>
                            <span className="font-bold text-green-600">+12.5%</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Member Growth</span>
                            <span className="font-bold text-blue-600">+8.0%</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Retention Rate</span>
                            <span className="font-bold text-purple-600">96%</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <BiMoney className="text-yellow-600" />
                        Top Categories
                    </h3>
                    <div className="space-y-3">
                        {categoryContributions.slice(0, 3).map((cat, index) => (
                            <div key={index} className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div 
                                        className="w-3 h-3 rounded-full" 
                                        style={{ backgroundColor: cat.color }}
                                    ></div>
                                    <span className="text-sm">{cat.name}</span>
                                </div>
                                <MaskedData className="text-sm font-medium">
                                    {formatCurrency(cat.value)}
                                </MaskedData>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <FaStar className="text-indigo-600" />
                        Performance Stats
                    </h3>
                    <div className="space-y-4">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-green-600">92%</div>
                            <p className="text-xs text-gray-600">On-time payments</p>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600">18.5</div>
                            <p className="text-xs text-gray-600">Avg streak (months)</p>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-purple-600">2.3%</div>
                            <p className="text-xs text-gray-600">Default rate</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="flex flex-col h-full bg-gray-50">
            {/* Fixed Header */}
            <div className="bg-white shadow-sm border-b border-gray-200 flex-shrink-0">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                                <MdAccountBalance className="text-green-600" />
                                {/* {chamaData.name} - Contributions */}
                            </h1>
                            <p className="text-gray-600 mt-1">
                                Manage and track member contributions across all categories
                            </p>
                        </div>
                        
                        <div className="flex items-center gap-4">
                            <div className="text-right">
                                <div className="text-sm text-gray-600">Total Members</div>
                                <div className="text-2xl font-bold text-blue-600">{chamaData.totalMembers}</div>
                            </div>
                            
                            <button
                                onClick={() => setShowSensitiveData(!showSensitiveData)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                                    showSensitiveData 
                                        ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                                }`}
                            >
                                {showSensitiveData ? <FaEyeSlash /> : <FaEye />}
                                {showSensitiveData ? <FaUnlock /> : <FaLock />}
                                <span className="text-sm font-medium">
                                    {showSensitiveData ? 'Hide Data' : 'Show Data'}
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Fixed Navigation Tabs */}
            <div className="bg-white border-b border-gray-200 flex-shrink-0">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <nav className="flex space-x-4 overflow-x-auto scrollbar-hide" aria-label="Tabs">
                        {tabs.map((tab) => {
                            const IconComponent = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-2 py-4 px-3 border-b-2 font-medium text-sm transition-colors whitespace-nowrap flex-shrink-0 ${
                                        activeTab === tab.id
                                            ? 'border-green-500 text-green-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                                >
                                    <IconComponent className="w-5 h-5" />
                                    {tab.label}
                                </button>
                            );
                        })}
                    </nav>
                </div>
            </div>

            {/* Scrollable Main Content */}
            <div className="flex-1 overflow-y-auto scrollbar-hide">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {activeTab === 'overview' && <OverviewTab />}
                    {activeTab === 'analytics' && <AnalyticsTab />}
                    {activeTab === 'members' && <MembersTab />}
                    {activeTab === 'categories' && <CategoriesTab />}
                    {activeTab === 'reminders' && <RemindersTab />}
                </div>
            </div>

            {/* Member Detail Modal */}
            {selectedMember && (
                <MemberDetailModal 
                    member={selectedMember} 
                    onClose={() => setSelectedMember(null)} 
                />
            )}
        </div>
    );
}