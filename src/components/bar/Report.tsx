"use client";

import { useState } from "react";
import { FaDownload, FaFilter, FaCalendarAlt, FaPrint, FaShare, FaChartLine, FaChartBar, FaChartPie, FaUsers, FaMoneyBillWave, FaTrophy, FaExclamationTriangle, FaCheckCircle, FaEye, FaEyeSlash, FaLock, FaUnlock, FaCreditCard, FaFileAlt, FaArrowUp, FaArrowDown, FaBars } from "react-icons/fa";
import { MdAssessment, MdTrendingUp, MdTrendingDown, MdAccountBalance, MdPayment, MdWarning, MdCheckCircle, MdTimer, MdDateRange, MdPeople, MdSavings, MdAccountBalanceWallet } from "react-icons/md";
import { BiMoney, BiCalendar,  BiWallet, BiGroup, BiTrendingUp, BiTrendingDown } from "react-icons/bi";
import { BiTargetLock } from "react-icons/bi";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area, ComposedChart, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

export default function Report() {
    const [activeReportType, setActiveReportType] = useState('executive');
    const [showSensitiveData, setShowSensitiveData] = useState(false);
    const [dateRange, setDateRange] = useState('ytd');
    const [selectedPeriod, setSelectedPeriod] = useState('2024');
    const [filterBy, setFilterBy] = useState('all');
    const [showActionMenu, setShowActionMenu] = useState(false);

    // Sample Data (will be replaced with API calls)
    const chamaData = {
        name: "Umoja Savings Chama",
        reportDate: "2024-12-06",
        totalMembers: 25,
        activeMembers: 23,
        totalContributions: 2850000,
        totalLoans: 1250000,
        totalSavings: 1600000,
        interestEarned: 125000,
        expensesIncurred: 45000,
        netWorth: 2930000,
        monthlyTarget: 125000,
        achievementRate: 89.2
    };

    // Financial Performance Data
    const financialPerformance = [
        { month: 'Jan 2024', contributions: 115000, loans: 85000, savings: 130000, expenses: 3500, netWorth: 2650000 },
        { month: 'Feb 2024', contributions: 108000, loans: 95000, savings: 138000, expenses: 4200, netWorth: 2689800 },
        { month: 'Mar 2024', contributions: 132000, loans: 110000, savings: 145000, expenses: 3800, netWorth: 2862000 },
        { month: 'Apr 2024', contributions: 128000, loans: 102000, savings: 152000, expenses: 4100, netWorth: 2985900 },
        { month: 'May 2024', contributions: 119000, loans: 88000, savings: 159000, expenses: 3900, netWorth: 3101000 },
        { month: 'Jun 2024', contributions: 135000, loans: 120000, savings: 166000, expenses: 4500, netWorth: 3231500 },
        { month: 'Jul 2024', contributions: 142000, loans: 115000, savings: 173000, expenses: 4000, netWorth: 3369500 },
        { month: 'Aug 2024', contributions: 138000, loans: 98000, savings: 180000, expenses: 3700, netWorth: 3503800 },
        { month: 'Sep 2024', contributions: 125000, loans: 105000, savings: 187000, expenses: 4300, netWorth: 3625500 },
        { month: 'Oct 2024', contributions: 148000, loans: 125000, savings: 194000, expenses: 3900, netWorth: 3769600 },
        { month: 'Nov 2024', contributions: 156000, loans: 135000, savings: 201000, expenses: 4600, netWorth: 3921000 },
        { month: 'Dec 2024', contributions: 98500, loans: 142000, savings: 208000, expenses: 5000, netWorth: 4014500 }
    ];

    // Member Performance Data
    const memberPerformance = [
        { category: 'Excellent (90%+)', count: 8, percentage: 32 },
        { category: 'Good (75-89%)', count: 9, percentage: 36 },
        { category: 'Fair (60-74%)', count: 5, percentage: 20 },
        { category: 'Poor (<60%)', count: 3, percentage: 12 }
    ];

    // Loan Performance Data
    const loanPerformance = {
        totalLoansIssued: 45,
        totalLoanValue: 1250000,
        activeLoans: 18,
        repaidLoans: 24,
        defaultedLoans: 3,
        averageLoanSize: 27778,
        repaymentRate: 94.2,
        interestEarned: 125000
    };

    // Category Performance
    const categoryPerformance = [
        { name: "Monthly Savings", target: 125000, actual: 118500, percentage: 94.8, color: "#10b981" },
        { name: "Emergency Fund", target: 50000, actual: 47500, percentage: 95.0, color: "#ef4444" },
        { name: "Investment Fund", target: 75000, actual: 52500, percentage: 70.0, color: "#3b82f6" },
        { name: "Welfare Fund", target: 37500, actual: 39000, percentage: 104.0, color: "#8b5cf6" },
        { name: "Social Fund", target: 25000, actual: 18500, percentage: 74.0, color: "#f59e0b" },
        { name: "Development Projects", target: 62500, actual: 45000, percentage: 72.0, color: "#06b6d4" }
    ];

    // Risk Assessment Data
    const riskAssessment = {
        lowRisk: { members: 15, percentage: 60, amount: 1950000 },
        mediumRisk: { members: 7, percentage: 28, amount: 645000 },
        highRisk: { members: 3, percentage: 12, amount: 255000 }
    };

    // Utility Functions
    const formatCurrency = (amount:number) => {
        return new Intl.NumberFormat('en-KE', {
            style: 'currency',
            currency: 'KES'
        }).format(amount);
    };

    const formatPercentage = (value:number) => {
        return `${value.toFixed(1)}%`;
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

    // Report Types Configuration
    const reportTypes = [
        { id: 'executive', label: 'Summary', icon: MdAssessment },
        { id: 'financial', label: 'Financial', icon: MdAccountBalance },
        { id: 'member', label: 'Individual', icon: MdPeople },
        { id: 'loan', label: 'Loans', icon: BiWallet },
        { id: 'risk', label: 'Risks', icon: MdWarning },
        { id: 'performance', label: 'Performance', icon: MdTrendingUp }
    ];

    // Executive Summary Report
    const ExecutiveSummaryReport = () => (
        <div className="space-y-2">
            {/* Key Performance Indicators */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
                <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-2 rounded-lg shadow-lg">
                    <div className="flex flex-row items-center justify-between gap-2">
                        <MdAccountBalanceWallet className="w-15 h-15 text-green-200 mt-2" />
                        <div className="text-sm font-thin items-end justify-end w-2/3">
                            <p className="text-green-100 text-sm mt-4">Net Worth</p>
                            <MaskedData className="text-xs font-thin">
                                {formatCurrency(chamaData.netWorth)}
                            </MaskedData>
                            <p className="text-green-200 text-xs mt-12">+12.5% from last month</p>
                        </div>
                        
                    </div>
                </div>
                
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-lg shadow-lg">
                    <div className="flex items-center justify-between">
                        <MdSavings className="w-8 h-8 text-blue-200" />
                        <div className="text-sm font-thin items-end justify-end w-2/3">
                            <p className="text-blue-100 text-sm">Total Contributions</p>
                            <MaskedData className="text-xs font-thin">
                                {formatCurrency(chamaData.totalContributions)}
                            </MaskedData>
                            <p className="text-blue-200 text-xs mt-8">Target Achievement: {formatPercentage(chamaData.achievementRate)}</p>
                        </div>
                    </div>
                </div>
                
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-lg shadow-lg">
                    <div className="flex items-center justify-between p-2">
                        <MdPeople className="w-8 h-8 text-purple-200" />
                        <div className="text-sm font-thin items-end justify-end w-2/3">
                            <p className="text-purple-100 text-sm">Active Members</p>
                            <p className="text-2xl font-thin">{chamaData.activeMembers}/{chamaData.totalMembers}</p>
                            <p className="text-purple-200 text-xs mt-8">{formatPercentage((chamaData.activeMembers/chamaData.totalMembers)*100)} Active Rate</p>
                        </div>
                    </div>
                </div>
                
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-lg shadow-lg">
                    <div className="flex items-center justify-between">
                        <BiWallet className="w-8 h-8 text-orange-200" />
                        <div className="text-sm font-thin items-end justify-end w-2/3">
                            <p className="text-orange-100 text-sm">Loan Portfolio</p>
                            <MaskedData className="text-xs font-thin">
                                {formatCurrency(chamaData.totalLoans)}
                            </MaskedData>
                            <p className="text-orange-200 text-xs mt-8">{formatPercentage(loanPerformance.repaymentRate)} Repayment Rate</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Financial Overview Chart */}
            <div className="bg-white p-2 rounded-lg shadow-md">
                <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
                    <FaChartLine className="text-green-600" />
                    Financial Performance Trend
                </h3>
                <ResponsiveContainer width="100%" height={400}>
                    <ComposedChart data={financialPerformance}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" angle={-45} textAnchor="end" height={80} />
                        <YAxis className="text-xs font-thin" />
                        <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                        <Legend />
                        <Area type="monotone" dataKey="netWorth" fill="#8884d8" stroke="#8884d8" fillOpacity={0.3} name="Net Worth" />
                        <Bar dataKey="contributions" fill="#10b981" name="Contributions" />
                        <Line type="monotone" dataKey="loans" stroke="#ef4444" strokeWidth={3} name="Loans Issued" />
                    </ComposedChart>
                </ResponsiveContainer>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-2 rounded-lg shadow-md">
                    <h4 className="font-thin text-gray-800 mb-4">Member Performance</h4>
                    <ResponsiveContainer width="100%" height={200} className="mx-auto">
                        <PieChart className="mx-auto">
                            <Pie
                                data={memberPerformance}
                                cx="42%"
                                cy="42%"
                                outerRadius={40}
                                dataKey="count"
                                label={({ category, percentage }) => `${percentage}%`}
                                className="mx-auto border border-gray-200"
                            >
                                {memberPerformance.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={['#10b981', '#3b82f6', '#f59e0b', '#ef4444'][index]} className="font-thin text-xs"/>
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h4 className="font-semibold text-gray-800 mb-4">Category Performance</h4>
                    <div className="space-y-3">
                        {categoryPerformance.slice(0, 4).map((category, index) => (
                            <div key={index} className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div 
                                        className="w-3 h-3 rounded-full" 
                                        style={{ backgroundColor: category.color }}
                                    ></div>
                                    <span className="text-sm text-gray-600">{category.name}</span>
                                </div>
                                <span className={`text-sm font-semibold ${
                                    category.percentage >= 90 ? 'text-green-600' :
                                    category.percentage >= 75 ? 'text-blue-600' :
                                    category.percentage >= 60 ? 'text-yellow-600' : 'text-red-600'
                                }`}>
                                    {formatPercentage(category.percentage)}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white p-2 rounded-lg shadow-md">
                    <h4 className="font-semibold text-gray-800 mb-4">Risk Distribution</h4>
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <div className="w-1 h-1 rounded-full bg-green-500"></div>
                                <span className="text-xs">Low Risk</span>
                            </div>
                            <span className="text-xs font-thin text-green-600">
                                {riskAssessment.lowRisk.percentage}%
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <div className="w-1 h-1 rounded-full bg-yellow-500"></div>
                                <span className="text-xs">Medium Risk</span>
                            </div>
                            <span className="text-xs font-thin text-yellow-600">
                                {riskAssessment.mediumRisk.percentage}%
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <div className="w-1 h-1 rounded-full bg-red-500"></div>
                                <span className="text-xs">High Risk</span>
                            </div>
                            <span className="text-xs font-thin text-red-600">
                                {riskAssessment.highRisk.percentage}%
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    // Financial Report
    const FinancialReport = () => (
        <div className="space-y-8">
            {/* Financial Summary */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                    <MdAccountBalance className="text-blue-600" />
                    Financial Position Summary
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                        <p className="text-sm text-green-600 mb-1">Total Assets</p>
                        <MaskedData className="text-2xl font-bold text-green-700">
                            {formatCurrency(chamaData.netWorth + chamaData.totalLoans)}
                        </MaskedData>
                        <p className="text-xs text-green-600 mt-1">↑ 8.5% vs last quarter</p>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <p className="text-sm text-blue-600 mb-1">Cash & Savings</p>
                        <MaskedData className="text-2xl font-bold text-blue-700">
                            {formatCurrency(chamaData.totalSavings)}
                        </MaskedData>
                        <p className="text-xs text-blue-600 mt-1">↑ 12.3% vs last quarter</p>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <p className="text-sm text-purple-600 mb-1">Interest Earned</p>
                        <MaskedData className="text-2xl font-bold text-purple-700">
                            {formatCurrency(chamaData.interestEarned)}
                        </MaskedData>
                        <p className="text-xs text-purple-600 mt-1">↑ 15.7% vs last quarter</p>
                    </div>
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                        <p className="text-sm text-orange-600 mb-1">Total Expenses</p>
                        <MaskedData className="text-2xl font-bold text-orange-700">
                            {formatCurrency(chamaData.expensesIncurred)}
                        </MaskedData>
                        <p className="text-xs text-orange-600 mt-1">↓ 2.1% vs last quarter</p>
                    </div>
                </div>
            </div>

            {/* Income vs Expenses */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <FaChartBar className="text-green-600" />
                    Monthly Income vs Expenses Analysis
                </h3>
                <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={financialPerformance}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" angle={-45} textAnchor="end" height={80} />
                        <YAxis />
                        <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                        <Legend />
                        <Bar dataKey="contributions" fill="#10b981" name="Income (Contributions)" />
                        <Bar dataKey="expenses" fill="#ef4444" name="Expenses" />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Cash Flow Analysis */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <FaChartLine className="text-blue-600" />
                    Cash Flow Trend
                </h3>
                <ResponsiveContainer width="100%" height={350}>
                    <LineChart data={financialPerformance}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" angle={-45} textAnchor="end" height={80} />
                        <YAxis />
                        <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                        <Legend />
                        <Line 
                            type="monotone" 
                            dataKey="savings" 
                            stroke="#10b981" 
                            strokeWidth={3} 
                            name="Savings Balance" 
                        />
                        <Line 
                            type="monotone" 
                            dataKey="loans" 
                            stroke="#ef4444" 
                            strokeWidth={3} 
                            name="Loans Outstanding" 
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );

    // Member Analysis Report
    const MemberAnalysisReport = () => (
        <div className="space-y-8">
            {/* Member Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-green-100">Total Members</p>
                            <p className="text-3xl font-bold">{chamaData.totalMembers}</p>
                        </div>
                        <FaUsers className="w-8 h-8 text-green-200" />
                    </div>
                </div>
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-blue-100">Active Members</p>
                            <p className="text-3xl font-bold">{chamaData.activeMembers}</p>
                        </div>
                        <FaCheckCircle className="w-8 h-8 text-blue-200" />
                    </div>
                </div>
                <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white p-6 rounded-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-yellow-100">Top Performers</p>
                            <p className="text-3xl font-bold">8</p>
                        </div>
                        <FaTrophy className="w-8 h-8 text-yellow-200" />
                    </div>
                </div>
                <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-6 rounded-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-red-100">At Risk</p>
                            <p className="text-3xl font-bold">3</p>
                        </div>
                        <FaExclamationTriangle className="w-8 h-8 text-red-200" />
                    </div>
                </div>
            </div>

            {/* Member Performance Distribution */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <FaChartPie className="text-purple-600" />
                    Member Performance Distribution
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={memberPerformance}
                                cx="50%"
                                cy="50%"
                                outerRadius={100}
                                dataKey="count"
                                label={({ category, percentage }) => `${category}: ${percentage}%`}
                            >
                                {memberPerformance.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={['#10b981', '#3b82f6', '#f59e0b', '#ef4444'][index]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="space-y-4">
                        {memberPerformance.map((perf, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <div 
                                        className="w-4 h-4 rounded-full" 
                                        style={{ backgroundColor: ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'][index] }}
                                    ></div>
                                    <span className="font-medium">{perf.category}</span>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold">{perf.count} members</p>
                                    <p className="text-sm text-gray-600">{perf.percentage}%</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Member Contribution Patterns */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <FaChartBar className="text-green-600" />
                    Member Contribution Patterns
                </h3>
                <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={[
                        { range: 'KES 0-50K', members: 3, percentage: 12 },
                        { range: 'KES 50-100K', members: 7, percentage: 28 },
                        { range: 'KES 100-150K', members: 9, percentage: 36 },
                        { range: 'KES 150-200K', members: 4, percentage: 16 },
                        { range: 'KES 200K+', members: 2, percentage: 8 }
                    ]}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="range" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="members" fill="#10b981" name="Number of Members" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );

    // Loan Portfolio Report
    const LoanPortfolioReport = () => (
        <div className="space-y-8">
            {/* Loan Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-blue-100">Total Loans</p>
                            <p className="text-2xl font-bold">{loanPerformance.totalLoansIssued}</p>
                        </div>
                        <MdAccountBalance className="w-8 h-8 text-blue-200" />
                    </div>
                </div>
                <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-green-100">Active Loans</p>
                            <p className="text-2xl font-bold">{loanPerformance.activeLoans}</p>
                        </div>
                        <FaCheckCircle className="w-8 h-8 text-green-200" />
                    </div>
                </div>
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-purple-100">Repayment Rate</p>
                            <p className="text-2xl font-bold">{formatPercentage(loanPerformance.repaymentRate)}</p>
                        </div>
                        <FaTrophy className="w-8 h-8 text-purple-200" />
                    </div>
                </div>
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-orange-100">Interest Earned</p>
                            <MaskedData className="text-2xl font-bold">
                                {formatCurrency(loanPerformance.interestEarned)}
                            </MaskedData>
                        </div>
                        <BiMoney className="w-8 h-8 text-orange-200" />
                    </div>
                </div>
            </div>

            {/* Loan Status Distribution */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <FaChartPie className="text-blue-600" />
                    Loan Status Distribution
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={[
                                    { name: 'Active', value: loanPerformance.activeLoans, color: '#3b82f6' },
                                    { name: 'Repaid', value: loanPerformance.repaidLoans, color: '#10b981' },
                                    { name: 'Defaulted', value: loanPerformance.defaultedLoans, color: '#ef4444' }
                                ]}
                                cx="50%"
                                cy="50%"
                                outerRadius={100}
                                dataKey="value"
                                label={({ name, value }) => `${name}: ${value}`}
                            >
                                {[
                                    { name: 'Active', value: loanPerformance.activeLoans, color: '#3b82f6' },
                                    { name: 'Repaid', value: loanPerformance.repaidLoans, color: '#10b981' },
                                    { name: 'Defaulted', value: loanPerformance.defaultedLoans, color: '#ef4444' }
                                ].map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="space-y-6">
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                            <p className="text-sm text-blue-600 mb-1">Average Loan Size</p>
                            <MaskedData className="text-2xl font-bold text-blue-700">
                                {formatCurrency(loanPerformance.averageLoanSize)}
                            </MaskedData>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                            <p className="text-sm text-green-600 mb-1">Total Portfolio Value</p>
                            <MaskedData className="text-2xl font-bold text-green-700">
                                {formatCurrency(loanPerformance.totalLoanValue)}
                            </MaskedData>
                        </div>
                        <div className="text-center p-4 bg-purple-50 rounded-lg">
                            <p className="text-sm text-purple-600 mb-1">Default Rate</p>
                            <p className="text-2xl font-bold text-purple-700">
                                {formatPercentage((loanPerformance.defaultedLoans / loanPerformance.totalLoansIssued) * 100)}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Loan Performance Over Time */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <FaChartLine className="text-purple-600" />
                    Loan Disbursement & Recovery Trends
                </h3>
                <ResponsiveContainer width="100%" height={350}>
                    <LineChart data={financialPerformance}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" angle={-45} textAnchor="end" height={80} />
                        <YAxis />
                        <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                        <Legend />
                        <Line 
                            type="monotone" 
                            dataKey="loans" 
                            stroke="#8b5cf6" 
                            strokeWidth={3} 
                            name="Loans Disbursed" 
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );

    // Risk Assessment Report
    const RiskAssessmentReport = () => (
        <div className="space-y-8">
            {/* Risk Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-green-100">Low Risk Members</p>
                            <p className="text-2xl font-bold">{riskAssessment.lowRisk.members}</p>
                            <p className="text-green-200 text-sm">{riskAssessment.lowRisk.percentage}% of portfolio</p>
                        </div>
                        <FaCheckCircle className="w-8 h-8 text-green-200" />
                    </div>
                </div>
                <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white p-6 rounded-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-yellow-100">Medium Risk Members</p>
                            <p className="text-2xl font-bold">{riskAssessment.mediumRisk.members}</p>
                            <p className="text-yellow-200 text-sm">{riskAssessment.mediumRisk.percentage}% of portfolio</p>
                        </div>
                        <MdTimer className="w-8 h-8 text-yellow-200" />
                    </div>
                </div>
                <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-6 rounded-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-red-100">High Risk Members</p>
                            <p className="text-2xl font-bold">{riskAssessment.highRisk.members}</p>
                            <p className="text-red-200 text-sm">{riskAssessment.highRisk.percentage}% of portfolio</p>
                        </div>
                        <FaExclamationTriangle className="w-8 h-8 text-red-200" />
                    </div>
                </div>
            </div>

            {/* Risk Distribution Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <FaChartPie className="text-red-600" />
                        Risk Level Distribution
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={[
                                    { name: 'Low Risk', value: riskAssessment.lowRisk.percentage, color: '#10b981' },
                                    { name: 'Medium Risk', value: riskAssessment.mediumRisk.percentage, color: '#f59e0b' },
                                    { name: 'High Risk', value: riskAssessment.highRisk.percentage, color: '#ef4444' }
                                ]}
                                cx="50%"
                                cy="50%"
                                outerRadius={100}
                                dataKey="value"
                                label={({ name, value }) => `${name}: ${value}%`}
                            >
                                {[
                                    { color: '#10b981' },
                                    { color: '#f59e0b' },
                                    { color: '#ef4444' }
                                ].map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <BiMoney className="text-green-600" />
                        Risk-Based Portfolio Value
                    </h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                            <div className="flex items-center gap-3">
                                <div className="w-4 h-4 rounded-full bg-green-500"></div>
                                <span className="font-medium">Low Risk Portfolio</span>
                            </div>
                            <MaskedData className="font-bold text-green-600">
                                {formatCurrency(riskAssessment.lowRisk.amount)}
                            </MaskedData>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                            <div className="flex items-center gap-3">
                                <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
                                <span className="font-medium">Medium Risk Portfolio</span>
                            </div>
                            <MaskedData className="font-bold text-yellow-600">
                                {formatCurrency(riskAssessment.mediumRisk.amount)}
                            </MaskedData>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                            <div className="flex items-center gap-3">
                                <div className="w-4 h-4 rounded-full bg-red-500"></div>
                                <span className="font-medium">High Risk Portfolio</span>
                            </div>
                            <MaskedData className="font-bold text-red-600">
                                {formatCurrency(riskAssessment.highRisk.amount)}
                            </MaskedData>
                        </div>
                    </div>
                </div>
            </div>

            {/* Risk Mitigation Recommendations */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <MdWarning className="text-orange-600" />
                    Risk Mitigation Recommendations
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <h4 className="font-medium text-gray-800">Immediate Actions</h4>
                        <div className="space-y-3">
                            <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
                                <FaExclamationTriangle className="w-5 h-5 text-red-600 mt-1" />
                                <div>
                                    <p className="font-medium text-red-800">Review High-Risk Members</p>
                                    <p className="text-sm text-red-600">3 members require immediate attention</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
                                <MdTimer className="w-5 h-5 text-yellow-600 mt-1" />
                                <div>
                                    <p className="font-medium text-yellow-800">Monitor Medium-Risk Portfolio</p>
                                    <p className="text-sm text-yellow-600">Increase monitoring frequency for 7 members</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <h4 className="font-medium text-gray-800">Long-term Strategies</h4>
                        <div className="space-y-3">
                            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                                <FaCheckCircle className="w-5 h-5 text-blue-600 mt-1" />
                                <div>
                                    <p className="font-medium text-blue-800">Diversify Investment Portfolio</p>
                                    <p className="text-sm text-blue-600">Reduce concentration risk across categories</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                                <BiTargetLock className="w-5 h-5 text-green-600 mt-1" />
                                <div>
                                    <p className="font-medium text-green-800">Enhance Member Education</p>
                                    <p className="text-sm text-green-600">Improve financial literacy programs</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    // Performance Metrics Report
    const PerformanceMetricsReport = () => (
        <div className="space-y-8">
            {/* Performance Overview */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                    <MdTrendingUp className="text-green-600" />
                    Key Performance Indicators
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="flex items-center justify-center mb-2">
                            <FaArrowUp className="w-5 h-5 text-green-600 mr-2" />
                            <p className="text-sm text-green-600">Collection Rate</p>
                        </div>
                        <p className="text-3xl font-bold text-green-700">{formatPercentage(chamaData.achievementRate)}</p>
                        <p className="text-xs text-green-600 mt-1">↑ 5.2% vs last month</p>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="flex items-center justify-center mb-2">
                            <FaUsers className="w-5 h-5 text-blue-600 mr-2" />
                            <p className="text-sm text-blue-600">Member Retention</p>
                        </div>
                        <p className="text-3xl font-bold text-blue-700">96%</p>
                        <p className="text-xs text-blue-600 mt-1">↑ 2.1% vs last quarter</p>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <div className="flex items-center justify-center mb-2">
                            <BiWallet className="w-5 h-5 text-purple-600 mr-2" />
                            <p className="text-sm text-purple-600">ROI</p>
                        </div>
                        <p className="text-3xl font-bold text-purple-700">12.5%</p>
                        <p className="text-xs text-purple-600 mt-1">↑ 1.8% vs last quarter</p>
                    </div>
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                        <div className="flex items-center justify-center mb-2">
                            <FaCreditCard className="w-5 h-5 text-orange-600 mr-2" />
                            <p className="text-sm text-orange-600">Loan Recovery</p>
                        </div>
                        <p className="text-3xl font-bold text-orange-700">{formatPercentage(loanPerformance.repaymentRate)}</p>
                        <p className="text-xs text-orange-600 mt-1">↓ 0.5% vs last month</p>
                    </div>
                </div>
            </div>

            {/* Category Performance Radar */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <BiTargetLock className="text-blue-600" />
                    Category Performance Radar
                </h3>
                <ResponsiveContainer width="100%" height={400}>
                    <RadarChart data={categoryPerformance}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="name" />
                        <PolarRadiusAxis angle={90} domain={[0, 110]} />
                        <Radar
                            name="Achievement %"
                            dataKey="percentage"
                            stroke="#10b981"
                            fill="#10b981"
                            fillOpacity={0.3}
                            strokeWidth={2}
                        />
                        <Tooltip formatter={(value) => `${value}%`} />
                    </RadarChart>
                </ResponsiveContainer>
            </div>

            {/* Performance Trends */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <FaChartLine className="text-purple-600" />
                    Performance Trends Over Time
                </h3>
                <ResponsiveContainer width="100%" height={350}>
                    <LineChart data={financialPerformance.map((item, index) => ({
                        ...item,
                        collectionRate: 75 + Math.random() * 20,
                        memberSatisfaction: 80 + Math.random() * 15,
                        loanRecoveryRate: 85 + Math.random() * 10
                    }))}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" angle={-45} textAnchor="end" height={80} />
                        <YAxis />
                        <Tooltip formatter={(value) => `${Number(value).toFixed(1)}%`} />
                        <Legend />
                        <Line 
                            type="monotone" 
                            dataKey="collectionRate" 
                            stroke="#10b981" 
                            strokeWidth={3} 
                            name="Collection Rate %" 
                        />
                        <Line 
                            type="monotone" 
                            dataKey="memberSatisfaction" 
                            stroke="#3b82f6" 
                            strokeWidth={3} 
                            name="Member Satisfaction %" 
                        />
                        <Line 
                            type="monotone" 
                            dataKey="loanRecoveryRate" 
                            stroke="#8b5cf6" 
                            strokeWidth={3} 
                            name="Loan Recovery Rate %" 
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );

    return (
        <div className="flex flex-col h-full bg-gray-50">
            {/* Fixed Header */}
            <div className="bg-white shadow-sm flex-shrink-0">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-6">
                        <div>
                            {/* <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                                <FaFileAlt className="text-blue-600" />
                                {chamaData.name} - Comprehensive Reports
                            </h1> */}
                            <p className="text-gray-600 mt-1">
                                Detailed analytics and insights for informed decision making
                            </p>
                        </div>
                        
                        <div className="flex items-center gap-4 ml-auto">
                            {/* Report Period Selector */}
                            <select
                                value={selectedPeriod}
                                onChange={(e) => setSelectedPeriod(e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                            >
                                <option value="2024">Year 2024</option>
                                <option value="q4-2024">Q4 2024</option>
                                <option value="dec-2024">December 2024</option>
                                <option value="ytd">Year to Date</option>
                            </select>

                            {/* Data Visibility Toggle */}
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
                                <span className="text-sm font-medium hidden sm:inline">
                                    {showSensitiveData ? 'Hide Data' : 'Show Data'}
                                </span>
                            </button>

                            {/* Desktop Export Actions */}
                            <div className="hidden md:flex gap-2">
                                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                    <FaDownload className="w-4 h-4" />
                                    Export
                                </button>
                                <button className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                                    <FaPrint className="w-4 h-4" />
                                    Print
                                </button>
                                <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                                    <FaShare className="w-4 h-4" />
                                    Share
                                </button>
                            </div>

                            {/* Mobile Hamburger Menu */}
                            <div className="relative md:hidden">
                                <button
                                    onClick={() => setShowActionMenu(!showActionMenu)}
                                    className="flex items-center justify-between p-2 bg-white text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                                >
                                    <FaBars className="w-5 h-5" />
                                </button>

                                {/* Dropdown Menu */}
                                {showActionMenu && (
                                    <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                                        <div className="py-2">
                                            <button className="flex items-center gap-3 w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50">
                                                <FaDownload className="w-4 h-4 text-blue-600" />
                                                Export Report
                                            </button>
                                            <button className="flex items-center gap-3 w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50">
                                                <FaPrint className="w-4 h-4 text-gray-600" />
                                                Print Report
                                            </button>
                                            <button className="flex items-center gap-3 w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50">
                                                <FaShare className="w-4 h-4 text-green-600" />
                                                Share Report
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Fixed Report Type Navigation */}
            <div className="bg-white border-b border-gray-200 flex-shrink-0">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <nav className="flex space-x-4 overflow-x-auto scrollbar-hide" aria-label="Report Types">
                        {reportTypes.map((type) => {
                            const IconComponent = type.icon;
                            return (
                                <button
                                    key={type.id}
                                    onClick={() => setActiveReportType(type.id)}
                                    className={`flex items-center gap-2 py-4 px-3 border-b-2 font-medium text-sm transition-colors whitespace-nowrap flex-shrink-0 ${
                                        activeReportType === type.id
                                            ? 'border-blue-500 text-blue-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                                >
                                    <IconComponent className="w-5 h-5" />
                                    {type.label}
                                </button>
                            );
                        })}
                    </nav>
                </div>
            </div>

            {/* Scrollable Report Content */}
            <div className="flex-1 overflow-y-auto scrollbar-hide">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Report Header Info */}
                    <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
                        <div className="flex justify-between items-center">
                            <div>
                                <h2 className="text-xl font-semibold text-gray-800">
                                    {reportTypes.find(type => type.id === activeReportType)?.label}
                                </h2>
                                <p className="text-sm text-gray-600">
                                    Report generated on {chamaData.reportDate} for {selectedPeriod}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-gray-600">Report ID: RPT-{Date.now().toString().slice(-6)}</p>
                                <p className="text-sm text-blue-600">Generated by: System Admin</p>
                            </div>
                        </div>
                    </div>

                {/* Dynamic Report Content */}
                {activeReportType === 'executive' && <ExecutiveSummaryReport />}
                {activeReportType === 'financial' && <FinancialReport />}
                {activeReportType === 'member' && <MemberAnalysisReport />}
                {activeReportType === 'loan' && <LoanPortfolioReport />}
                {activeReportType === 'risk' && <RiskAssessmentReport />}
                {activeReportType === 'performance' && <PerformanceMetricsReport />}
                </div>
            </div>
        </div>
    );
}