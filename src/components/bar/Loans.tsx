import { useState } from "react";
import { FaPlus, FaEye, FaEyeSlash, FaLock, FaUnlock, FaUsers, FaSearch, FaChartLine, FaChartBar, FaChartPie, FaCalendarAlt } from "react-icons/fa";
import { MdDeleteForever, MdWarning, MdCheckCircle, MdGroup, MdTrendingUp, MdTrendingDown, MdAssessment } from "react-icons/md";
import { CiEdit } from "react-icons/ci";
import { BiMoney, BiCalendar, BiUser, BiTrendingUp } from "react-icons/bi";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';

export default function ChamaMemberLoans() {
    const [showSensitiveData, setShowSensitiveData] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');
    type MemberType = typeof membersWithLoans[number];
    const [selectedMember, setSelectedMember] = useState<MemberType | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");

    // Sample chama data with multiple members having loans
    const chamaData = {
        name: "Umoja Savings Chama",
        totalMembers: 25,
        membersWithLoans: 8,
        totalLoanAmount: 450000,
        totalOutstanding: 287500
    };

    const membersWithLoans = [
        {
            id: 1,
            name: "John Doe",
            email: "johndoe@example.com",
            phone: "(123) 456-7890",
            membershipNumber: "UM001",
            joinedDate: "2023-01-01",
            loans: {
                amount: 50000,
                dateAllocated: "2024-03-15",
                dateReceived: "2024-03-18",
                nextInstallment: "2024-12-15",
                guarantors: ["Jane Smith (UM003)", "Mike Johnson (UM007)"],
                amountRepaid: 30000,
                interestAmount: 8500,
                remainingAmount: 28500,
                totalInstallments: 24,
                completedInstallments: 14,
                missedPayments: 2,
                paymentStatus: "delayed",
                monthlyInstallment: 2800
            }
        },
        {
            id: 2,
            name: "Sarah Wilson",
            email: "sarah.wilson@example.com",
            phone: "(555) 123-4567",
            membershipNumber: "UM002",
            joinedDate: "2022-08-10",
            loans: {
                amount: 75000,
                dateAllocated: "2024-01-10",
                dateReceived: "2024-01-12",
                nextInstallment: "2024-11-12",
                guarantors: ["Robert Brown (UM005)", "Lisa Davis (UM009)"],
                amountRepaid: 45000,
                interestAmount: 12750,
                remainingAmount: 42750,
                totalInstallments: 36,
                completedInstallments: 18,
                missedPayments: 0,
                paymentStatus: "current",
                monthlyInstallment: 2500
            }
        },
        {
            id: 3,
            name: "Peter Kamau",
            email: "peter.kamau@example.com",
            phone: "(254) 712-345-678",
            membershipNumber: "UM012",
            joinedDate: "2023-05-20",
            loans: {
                amount: 35000,
                dateAllocated: "2024-06-01",
                dateReceived: "2024-06-03",
                nextInstallment: "2024-12-01",
                guarantors: ["Grace Mwangi (UM015)", "Daniel Ochieng (UM018)"],
                amountRepaid: 21000,
                interestAmount: 5950,
                remainingAmount: 19950,
                totalInstallments: 18,
                completedInstallments: 10,
                missedPayments: 1,
                paymentStatus: "current",
                monthlyInstallment: 2100
            }
        },
        {
            id: 4,
            name: "Mary Wanjiku",
            email: "mary.wanjiku@example.com",
            phone: "(254) 721-987-654",
            membershipNumber: "UM008",
            joinedDate: "2022-12-01",
            loans: {
                amount: 60000,
                dateAllocated: "2023-11-15",
                dateReceived: "2023-11-18",
                nextInstallment: "2024-11-18",
                guarantors: ["Joseph Kimani (UM011)", "Faith Njeri (UM016)"],
                amountRepaid: 55000,
                interestAmount: 10200,
                remainingAmount: 15200,
                totalInstallments: 30,
                completedInstallments: 26,
                missedPayments: 0,
                paymentStatus: "current",
                monthlyInstallment: 2300
            }
        },
        {
            id: 5,
            name: "James Muthoni",
            email: "james.muthoni@example.com",
            phone: "(254) 733-456-789",
            membershipNumber: "UM020",
            joinedDate: "2023-09-10",
            loans: {
                amount: 80000,
                dateAllocated: "2024-02-01",
                dateReceived: "2024-02-05",
                nextInstallment: "2024-12-05",
                guarantors: ["Anne Njoroge (UM013)", "Paul Kiprotich (UM017)"],
                amountRepaid: 32000,
                interestAmount: 13600,
                remainingAmount: 61600,
                totalInstallments: 40,
                completedInstallments: 16,
                missedPayments: 3,
                paymentStatus: "delayed",
                monthlyInstallment: 2400
            }
        },
        {
            id: 6,
            name: "Lucy Akinyi",
            email: "lucy.akinyi@example.com",
            phone: "(254) 745-123-456",
            membershipNumber: "UM025",
            joinedDate: "2024-01-15",
            loans: {
                amount: 25000,
                dateAllocated: "2024-07-01",
                dateReceived: "2024-07-03",
                nextInstallment: "2024-11-03",
                guarantors: ["Samuel Oloo (UM021)", "Rebecca Wambui (UM014)"],
                amountRepaid: 12500,
                interestAmount: 4250,
                remainingAmount: 16750,
                totalInstallments: 15,
                completedInstallments: 7,
                missedPayments: 0,
                paymentStatus: "current",
                monthlyInstallment: 1900
            }
        }
    ];

    // Chart data
    const monthlyLoanTrends = [
        { month: 'Jan 2024', loansIssued: 3, totalAmount: 120000, repayments: 85000 },
        { month: 'Feb 2024', loansIssued: 2, totalAmount: 80000, repayments: 92000 },
        { month: 'Mar 2024', loansIssued: 4, totalAmount: 180000, repayments: 98000 },
        { month: 'Apr 2024', loansIssued: 1, totalAmount: 60000, repayments: 105000 },
        { month: 'May 2024', loansIssued: 3, totalAmount: 140000, repayments: 110000 },
        { month: 'Jun 2024', loansIssued: 2, totalAmount: 95000, repayments: 95000 },
        { month: 'Jul 2024', loansIssued: 5, totalAmount: 200000, repayments: 120000 },
        { month: 'Aug 2024', loansIssued: 1, totalAmount: 45000, repayments: 115000 },
        { month: 'Sep 2024', loansIssued: 2, totalAmount: 85000, repayments: 108000 },
        { month: 'Oct 2024', loansIssued: 3, totalAmount: 125000, repayments: 125000 },
        { month: 'Nov 2024', loansIssued: 2, totalAmount: 90000, repayments: 118000 },
        { month: 'Dec 2024', loansIssued: 1, totalAmount: 50000, repayments: 95000 }
    ];

    const yearlyTrends = [
        { year: '2022', totalLoans: 15, totalAmount: 850000, totalRepaid: 720000 },
        { year: '2023', totalLoans: 22, totalAmount: 1200000, totalRepaid: 980000 },
        { year: '2024', totalLoans: 29, totalAmount: 1270000, totalRepaid: 1165000 }
    ];

    const loanStatusData = [
        { name: 'Current', value: 4, color: '#10b981' },
        { name: 'Delayed', value: 2, color: '#ef4444' },
        { name: 'Completed', value: 12, color: '#3b82f6' }
    ];

    const repaymentPerformance = [
        { member: 'Mary W.', performance: 95, amount: 55000 },
        { member: 'Sarah W.', performance: 88, amount: 45000 },
        { member: 'Peter K.', performance: 82, amount: 21000 },
        { member: 'John D.', performance: 75, amount: 30000 },
        { member: 'James M.', performance: 65, amount: 32000 },
        { member: 'Lucy A.', performance: 92, amount: 12500 }
    ];

    const loanRequests = [
        { month: 'Jan', approved: 8, denied: 2, pending: 1 },
        { month: 'Feb', approved: 6, denied: 3, pending: 0 },
        { month: 'Mar', approved: 10, denied: 1, pending: 2 },
        { month: 'Apr', approved: 5, denied: 4, pending: 1 },
        { month: 'May', approved: 9, denied: 2, pending: 3 },
        { month: 'Jun', approved: 7, denied: 3, pending: 1 },
        { month: 'Jul', approved: 12, denied: 1, pending: 0 },
        { month: 'Aug', approved: 4, denied: 5, pending: 2 },
        { month: 'Sep', approved: 8, denied: 2, pending: 1 },
        { month: 'Oct', approved: 11, denied: 3, pending: 0 },
        { month: 'Nov', approved: 6, denied: 4, pending: 2 },
        { month: 'Dec', approved: 3, denied: 2, pending: 4 }
    ];

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-KE', {
            style: 'currency',
            currency: 'KES'
        }).format(amount);
    };

    type StatusKey = 'current' | 'delayed' | 'completed';
    const getStatusBadge = (status: string) => {
        const statusConfig: Record<StatusKey, { bg: string; text: string; icon: React.ComponentType<React.SVGProps<SVGSVGElement>> }> = {
            current: { bg: 'bg-green-100', text: 'text-green-800', icon: MdCheckCircle },
            delayed: { bg: 'bg-red-100', text: 'text-red-800', icon: MdWarning },
            completed: { bg: 'bg-blue-100', text: 'text-blue-800', icon: MdCheckCircle }
        };
        
        const config = statusConfig[(status as StatusKey)] || statusConfig.current;
        const IconComponent = config.icon;
        
        return (
            <span className={`inline-flex items-center gap-1 px-2 py-1 ${config.bg} ${config.text} rounded-full text-xs font-medium`}>
                <IconComponent className="w-3 h-3" />
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        );
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

    const filteredMembers = membersWithLoans.filter(member => {
        const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             member.membershipNumber.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterStatus === "all" || member.loans.paymentStatus === filterStatus;
        return matchesSearch && matchesFilter;
    });

    const tabs = [
        { id: 'overview', label: 'Overview', icon: MdAssessment },
        { id: 'analytics', label: 'Analytics', icon: FaChartLine },
        { id: 'members', label: 'Members', icon: FaUsers },
        { id: 'requests', label: 'Requests', icon: BiCalendar }
    ];

    const DetailCard = ({ member }: { member: MemberType }) => (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setSelectedMember(null)}>
            <div className="bg-white rounded-lg p-6 max-w-5xl w-full mx-4 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">{member.name}</h2>
                        <p className="text-gray-600">Member ID: {member.membershipNumber} • {chamaData.name}</p>
                    </div>
                    <button 
                        onClick={() => setSelectedMember(null)}
                        className="text-gray-500 hover:text-gray-700 text-xl font-bold"
                    >
                        ×
                    </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-4">
                        <div className="bg-blue-50 p-4 rounded-lg">
                            <h3 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                                <BiMoney className="w-5 h-5" />
                                Financial Overview
                            </h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span>Loan Amount:</span>
                                    <MaskedData className="font-medium">{formatCurrency(member.loans.amount)}</MaskedData>
                                </div>
                                <div className="flex justify-between">
                                    <span>Monthly Installment:</span>
                                    <MaskedData className="font-medium text-blue-600">{formatCurrency(member.loans.monthlyInstallment)}</MaskedData>
                                </div>
                                <div className="flex justify-between">
                                    <span>Amount Repaid:</span>
                                    <MaskedData className="font-medium text-green-600">{formatCurrency(member.loans.amountRepaid)}</MaskedData>
                                </div>
                                <div className="flex justify-between">
                                    <span>Interest Amount:</span>
                                    <MaskedData className="font-medium text-orange-600">{formatCurrency(member.loans.interestAmount)}</MaskedData>
                                </div>
                                <div className="flex justify-between border-t pt-2">
                                    <span className="font-semibold">Remaining:</span>
                                    <MaskedData className="font-bold text-red-600">{formatCurrency(member.loans.remainingAmount)}</MaskedData>
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-green-50 p-4 rounded-lg">
                            <h3 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
                                <BiCalendar className="w-5 h-5" />
                                Timeline
                            </h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span>Date Allocated:</span>
                                    <span className="font-medium">{member.loans.dateAllocated}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Date Received:</span>
                                    <span className="font-medium">{member.loans.dateReceived}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Next Installment:</span>
                                    <span className="font-medium text-blue-600">{member.loans.nextInstallment}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Joined Chama:</span>
                                    <span className="font-medium">{member.joinedDate}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="space-y-4">
                        <div className="bg-purple-50 p-4 rounded-lg">
                            <h3 className="font-semibold text-purple-800 mb-3 flex items-center gap-2">
                                <BiUser className="w-5 h-5" />
                                Guarantors (Chama Members)
                            </h3>
                            <div className="space-y-2">
                                {member.loans.guarantors.map((guarantor, index) => (
                                    <div key={index} className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                                        <MaskedData className="text-sm">{guarantor}</MaskedData>
                                    </div>
                                ))}
                            </div>
                        </div>
                        
                        <div className="bg-orange-50 p-4 rounded-lg">
                            <h3 className="font-semibold text-orange-800 mb-3">Contact Information</h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span>Email:</span>
                                    <MaskedData className="font-medium break-all">{member.email}</MaskedData>
                                </div>
                                <div className="flex justify-between">
                                    <span>Phone:</span>
                                    <MaskedData className="font-medium">{member.phone}</MaskedData>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="space-y-4">
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                <BiTrendingUp className="w-5 h-5" />
                                Payment Progress
                            </h3>
                            <div className="space-y-3">
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span>Installments Completed</span>
                                        <span>{member.loans.completedInstallments}/{member.loans.totalInstallments}</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-3">
                                        <div 
                                            className="bg-blue-600 h-3 rounded-full" 
                                            style={{width: `${(member.loans.completedInstallments / member.loans.totalInstallments) * 100}%`}}
                                        ></div>
                                    </div>
                                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                                        <span>0%</span>
                                        <span>{Math.round((member.loans.completedInstallments / member.loans.totalInstallments) * 100)}%</span>
                                        <span>100%</span>
                                    </div>
                                </div>
                                
                                <div className="pt-3 border-t">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium">Payment Status:</span>
                                        {getStatusBadge(member.loans.paymentStatus)}
                                    </div>
                                    
                                    {member.loans.missedPayments > 0 && (
                                        <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-2 rounded">
                                            <MdWarning className="w-4 h-4" />
                                            <span>{member.loans.missedPayments} missed payment(s)</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const OverviewTab = () => (
        <div className="space-y-6 w-full">
            {/* Key Metrics Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 w-full">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 sm:p-6 rounded-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-blue-100 text-xs sm:text-sm">Total Loans</p>
                            <p className="text-lg sm:text-2xl font-bold">{chamaData.membersWithLoans}</p>
                        </div>
                        <FaUsers className="w-6 h-6 sm:w-8 sm:h-8 text-blue-200" />
                    </div>
                </div>
                
                <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 sm:p-6 rounded-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-green-100 text-xs sm:text-sm">Total Amount</p>
                            <MaskedData className="text-lg sm:text-2xl font-bold">{formatCurrency(chamaData.totalLoanAmount)}</MaskedData>
                        </div>
                        <BiMoney className="w-6 h-6 sm:w-8 sm:h-8 text-green-200" />
                    </div>
                </div>
                
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 sm:p-6 rounded-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-orange-100 text-xs sm:text-sm">Outstanding</p>
                            <MaskedData className="text-lg sm:text-2xl font-bold">{formatCurrency(chamaData.totalOutstanding)}</MaskedData>
                        </div>
                        <MdWarning className="w-6 h-6 sm:w-8 sm:h-8 text-orange-200" />
                    </div>
                </div>
                
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 sm:p-6 rounded-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-purple-100 text-xs sm:text-sm">Recovery Rate</p>
                            <p className="text-lg sm:text-2xl font-bold">87%</p>
                        </div>
                        <MdTrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-purple-200" />
                    </div>
                </div>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Monthly Loan Trends */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <FaChartLine className="text-blue-600" />
                        Monthly Loan Trends (2024)
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={monthlyLoanTrends}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip formatter={(value, name) => [
                                name === 'totalAmount' || name === 'repayments' ? formatCurrency(Number(value)) : value,
                                name
                            ]} />
                            <Legend />
                            <Line type="monotone" dataKey="loansIssued" stroke="#8884d8" name="Loans Issued" />
                            <Line type="monotone" dataKey="totalAmount" stroke="#82ca9d" name="Total Amount" />
                            <Line type="monotone" dataKey="repayments" stroke="#ffc658" name="Repayments" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Loan Status Distribution */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <FaChartPie className="text-green-600" />
                        Loan Status Distribution
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={loanStatusData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {loanStatusData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Yearly Trends */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <FaChartBar className="text-purple-600" />
                        Yearly Loan Trends
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={yearlyTrends}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="year" />
                            <YAxis />
                            <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                            <Legend />
                            <Bar dataKey="totalAmount" fill="#8884d8" name="Total Amount" />
                            <Bar dataKey="totalRepaid" fill="#82ca9d" name="Total Repaid" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Member Performance */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <MdTrendingUp className="text-orange-600" />
                        Repayment Performance by Member
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={repaymentPerformance} layout="horizontal">
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis type="number" />
                            <YAxis dataKey="member" type="category" />
                            <Tooltip formatter={(value, name) => [
                                name === 'performance' ? `${value}%` : formatCurrency(Number(value)),
                                name
                            ]} />
                            <Bar dataKey="performance" fill="#3b82f6" name="Performance %" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );

    const AnalyticsTab = () => (
        <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
                {/* Loan Requests Analysis */}
                <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <FaCalendarAlt className="text-indigo-600" />
                        Loan Requests Analysis (2024)
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={loanRequests}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Area type="monotone" dataKey="approved" stackId="1" stroke="#10b981" fill="#10b981" name="Approved" />
                            <Area type="monotone" dataKey="denied" stackId="1" stroke="#ef4444" fill="#ef4444" name="Denied" />
                            <Area type="monotone" dataKey="pending" stackId="1" stroke="#f59e0b" fill="#f59e0b" name="Pending" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Loan Allocation Trends */}
                <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <BiMoney className="text-green-600" />
                        Monthly Loan Allocation vs Repayments
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={monthlyLoanTrends}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                            <Legend />
                            <Bar dataKey="totalAmount" fill="#3b82f6" name="Loans Allocated" />
                            <Bar dataKey="repayments" fill="#10b981" name="Repayments Received" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Detailed Performance Metrics */}
                <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <MdAssessment className="text-blue-600" />
                        Detailed Analytics Summary
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-blue-50 p-4 rounded-lg">
                            <h4 className="font-semibold text-blue-800 mb-2">Approval Rates</h4>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span>2024 Average:</span>
                                    <span className="font-bold text-green-600">78%</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Best Month:</span>
                                    <span className="font-bold">July (92%)</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Declined Rate:</span>
                                    <span className="font-bold text-red-600">18%</span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-green-50 p-4 rounded-lg">
                            <h4 className="font-semibold text-green-800 mb-2">Repayment Trends</h4>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span>On-time Rate:</span>
                                    <span className="font-bold text-green-600">83%</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Average Delay:</span>
                                    <span className="font-bold">3.2 days</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Default Rate:</span>
                                    <span className="font-bold text-red-600">2.1%</span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-purple-50 p-4 rounded-lg">
                            <h4 className="font-semibold text-purple-800 mb-2">Interest & Fees</h4>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span>Avg Interest:</span>
                                    <MaskedData className="font-bold">17%</MaskedData>
                                </div>
                                <div className="flex justify-between">
                                    <span>Total Interest:</span>
                                    <MaskedData className="font-bold text-green-600">{formatCurrency(54350)}</MaskedData>
                                </div>
                                <div className="flex justify-between">
                                    <span>Late Fees:</span>
                                    <MaskedData className="font-bold text-orange-600">{formatCurrency(8750)}</MaskedData>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const RequestsTab = () => (
        <div className="space-y-6">
            {/* Request Status Overview */}
            <div className="flex flex-row justify-between items-center mb-6 gap-4 ">
                <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-lg w-1/3 h-40">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-green-100">Approved This Year</p>
                            <p className="text-2xl font-bold">89</p>
                        </div>
                        <MdCheckCircle className="w-8 h-8 text-green-200" />
                    </div>
                </div>
                
                <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-6 rounded-lg w-1/3 h-40">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-red-100">Denied This Year</p>
                            <p className="text-2xl font-bold">32</p>
                        </div>
                        <MdWarning className="w-8 h-8 text-red-200" />
                    </div>
                </div>
                
                <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white p-6 rounded-lg w-1/3 h-40">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-yellow-100">Pending Review</p>
                            <p className="text-2xl font-bold">17</p>
                        </div>
                        <BiCalendar className="w-8 h-8 text-yellow-200" />
                    </div>
                </div>
            </div>

            {/* Request Trends Chart */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <FaChartBar className="text-indigo-600" />
                    Monthly Loan Request Trends
                </h3>
                <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={loanRequests}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="approved" fill="#10b981" name="Approved" />
                        <Bar dataKey="denied" fill="#ef4444" name="Denied" />
                        <Bar dataKey="pending" fill="#f59e0b" name="Pending" />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Recent Requests Table */}
            <div className="bg-white rounded-lg shadow-md">
                <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-semibold">Recent Loan Requests</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="p-4 text-left font-medium text-gray-600">Applicant</th>
                                <th className="p-4 text-left font-medium text-gray-600">Amount Requested</th>
                                <th className="p-4 text-left font-medium text-gray-600">Date Applied</th>
                                <th className="p-4 text-left font-medium text-gray-600">Purpose</th>
                                <th className="p-4 text-left font-medium text-gray-600">Status</th>
                                <th className="p-4 text-left font-medium text-gray-600">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[
                                { id: 1, name: 'Alice Mwangi', amount: 45000, date: '2024-12-01', purpose: 'Business Expansion', status: 'pending' },
                                { id: 2, name: 'David Kiprotich', amount: 30000, date: '2024-11-28', purpose: 'Education', status: 'approved' },
                                { id: 3, name: 'Grace Wanjiku', amount: 25000, date: '2024-11-25', purpose: 'Medical Emergency', status: 'approved' },
                                { id: 4, name: 'Robert Ochieng', amount: 60000, date: '2024-11-22', purpose: 'Home Improvement', status: 'denied' },
                                { id: 5, name: 'Susan Nyambura', amount: 35000, date: '2024-11-20', purpose: 'Agricultural Investment', status: 'pending' },
                            ].map((request) => (
                                <tr key={request.id} className="border-b border-gray-100 hover:bg-gray-50">
                                    <td className="p-4 font-medium">{request.name}</td>
                                    <td className="p-4">
                                        <MaskedData className="font-semibold text-blue-600">
                                            {formatCurrency(request.amount)}
                                        </MaskedData>
                                    </td>
                                    <td className="p-4 text-sm text-gray-600">{request.date}</td>
                                    <td className="p-4 text-sm">{request.purpose}</td>
                                    <td className="p-4">
                                        {request.status === 'pending' && (
                                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                                                <BiCalendar className="w-3 h-3" />
                                                Pending
                                            </span>
                                        )}
                                        {request.status === 'approved' && (
                                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                                                <MdCheckCircle className="w-3 h-3" />
                                                Approved
                                            </span>
                                        )}
                                        {request.status === 'denied' && (
                                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                                                <MdWarning className="w-3 h-3" />
                                                Denied
                                            </span>
                                        )}
                                    </td>
                                    <td className="p-4">
                                        <div className="flex gap-2">
                                            <button className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-100">
                                                <FaEye className="w-4 h-4" />
                                            </button>
                                            {request.status === 'pending' && (
                                                <>
                                                    <button className="text-green-600 hover:text-green-800 p-1 rounded hover:bg-green-100">
                                                        <MdCheckCircle className="w-4 h-4" />
                                                    </button>
                                                    <button className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-100">
                                                        <MdWarning className="w-4 h-4" />
                                                    </button>
                                                </>
                                            )}
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

    const MembersTab = () => (
        <div className="space-y-6 ">
            {/* Summary Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 w-full">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-3 sm:p-4 rounded-lg ">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-blue-100 text-xs sm:text-sm">Active Borrowers</p>
                            <p className="text-lg sm:text-2xl font-bold">{chamaData.membersWithLoans}</p>
                        </div>
                        <FaUsers className="w-6 h-6 sm:w-8 sm:h-8 text-blue-200" />
                    </div>
                </div>
                
                <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-3 sm:p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-green-100 text-xs sm:text-sm">On-Time Payments</p>
                            <p className="text-lg sm:text-2xl font-bold">75%</p>
                        </div>
                        <MdCheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-green-200" />
                    </div>
                </div>
                
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-3 sm:p-4 rounded-lg col-span-2 lg:col-span-1">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-orange-100 text-xs sm:text-sm">Avg Loan Size</p>
                            <MaskedData className="text-lg sm:text-xl font-bold">{formatCurrency(56250)}</MaskedData>
                        </div>
                        <BiMoney className="w-6 h-6 sm:w-8 sm:h-8 text-orange-200" />
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className="bg-white p-4 rounded-lg shadow-md">
                <div className="flex flex-row justify-between items-center gap-2">
                    <div className="flex flex-row items-center justify-between gap-4">
                        <div className="relative">
                            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Search by name or member ID..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 w-64"
                            />
                        </div>
                        
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="px-4 py-2 border border-gray-300 w-1/2 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        >
                            <option value="all">All Status</option>
                            <option value="current">Current</option>
                            <option value="delayed">Delayed</option>
                            <option value="completed">Completed</option>
                        </select>
                    </div>

                    <button
                        onClick={() => setShowSensitiveData(!showSensitiveData)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                            showSensitiveData 
                                ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                                : 'bg-green-100 text-green-700 hover:bg-green-200'
                        }`}
                    >
                        {showSensitiveData ? <FaEyeSlash /> : <FaEye />}
                        {showSensitiveData ? <FaUnlock /> : <FaLock />}
                        <span className="text-sm font-medium">
                            {showSensitiveData ? 'Hide Sensitive Data' : 'Show Sensitive Data'}
                        </span>
                    </button>
                </div>
                
                {/* Results count */}
                <div className="text-sm text-gray-600 mt-3 pt-3 border-t border-gray-200">
                    Showing {filteredMembers.length} of {membersWithLoans.length} members with active loans
                </div>
            </div>
            
            {/* Members Table */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden w-full">
                <div className="w-full overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-green-700 text-white">
                            <tr>
                                <th className="p-3 text-left font-medium">Member Details</th>
                                <th className="p-3 text-left font-medium">Contact</th>
                                <th className="p-3 text-left font-medium">Loan Amount</th>
                                <th className="p-3 text-left font-medium">Monthly Payment</th>
                                <th className="p-3 text-left font-medium">Remaining</th>
                                <th className="p-3 text-left font-medium">Next Payment</th>
                                <th className="p-3 text-left font-medium">Status</th>
                                <th className="p-3 text-left font-medium">Progress</th>
                                <th className="p-3 text-left font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredMembers.map((member) => (
                                <tr key={member.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                    <td className="p-1">
                                        <div className="flex flex-col">
                                            <span className="font-medium text-gray-900">{member.name}</span>
                                            <span className="text-xs text-gray-500">ID: {member.membershipNumber}</span>
                                            <span className="text-xs text-blue-600">Joined: {member.joinedDate}</span>
                                        </div>
                                    </td>
                                    <td className="p-1">
                                        <div className="flex flex-col text-sm">
                                            <span className="truncate max-w-32">{member.email.slice(0, 15)}...</span>
                                            <MaskedData className="text-xs text-gray-600">
                                                {member.phone}
                                            </MaskedData>
                                        </div>
                                    </td>
                                    <td className="p-1">
                                        <MaskedData className="font-medium text-blue-600">
                                            {formatCurrency(member.loans.amount)}
                                        </MaskedData>
                                    </td>
                                    <td className="p-1">
                                        <MaskedData className="font-medium text-purple-600">
                                            {formatCurrency(member.loans.monthlyInstallment)}
                                        </MaskedData>
                                    </td>
                                    <td className="p-1">
                                        <MaskedData className="font-medium text-red-600">
                                            {formatCurrency(member.loans.remainingAmount)}
                                        </MaskedData>
                                    </td>
                                    <td className="p-1">
                                        <span className="text-sm">{member.loans.nextInstallment}</span>
                                        {member.loans.missedPayments > 0 && (
                                            <div className="text-xs text-red-600 flex items-center gap-1 mt-1">
                                                <MdWarning className="w-3 h-3" />
                                                {member.loans.missedPayments} missed
                                            </div>
                                        )}
                                    </td>
                                    <td className="p-1">
                                        {getStatusBadge(member.loans.paymentStatus)}
                                    </td>
                                    <td className="p-1">
                                        <div className="flex flex-col">
                                            <div className="w-20 bg-gray-200 rounded-full h-2 mb-1">
                                                <div
                                                    className="bg-blue-600 h-2 rounded-full"
                                                    style={{ width: `${(member.loans.completedInstallments / member.loans.totalInstallments) * 100}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-xs text-gray-600">
                                                {member.loans.completedInstallments}/{member.loans.totalInstallments}
                                                <span className="ml-1">
                                                    ({Math.round((member.loans.completedInstallments / member.loans.totalInstallments) * 100)}%)
                                                </span>
                                            </span>
                                        </div>
                                    </td>
                                    <td className="p-1">
                                        <div className="flex gap-2 items-center">
                                            <button 
                                                onClick={() => setSelectedMember(member)}
                                                className="text-green-600 hover:text-green-800 p-1 rounded hover:bg-green-100 transition-colors"
                                                title="View Details"
                                            >
                                                <FaEye className="h-4 w-4" />
                                            </button>
                                            <button className="text-blue-500 relative group">
                                                <CiEdit className="h-5 w-5 hover:text-blue-700 hover:cursor-pointer" />
                                                <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-yellow-500 text-white px-2 py-1 text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                                                    Edit
                                                </span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredMembers.length === 0 && (
                                <tr>
                                    <td colSpan={9} className="p-8 text-center text-gray-500">
                                        <div className="flex flex-col items-center gap-2">
                                            <FaUsers className="w-8 h-8 text-gray-300" />
                                            <p>No members found matching your criteria</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );

    return (
        <div className="flex flex-col h-full bg-gray-50">
            {/* Fixed Navigation Tabs */}
            <div className="bg-white shadow-sm flex-shrink-0">
                <div className="flex space-x-8 px-6 w-full">
                    {tabs.map((tab) => {
                        const IconComponent = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center justify-between gap-2 py-2 px-2 border-b-2 font-medium text-sm mx-auto transition-colors ${
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
                </div>
            </div>

            {/* Scrollable Main Content */}
            <div className="flex-1 overflow-y-auto scrollbar-hide">
                <div className="p-6 w-full">
                    {activeTab === 'overview' && <OverviewTab />}
                    {activeTab === 'analytics' && <AnalyticsTab />}
                    {activeTab === 'members' && <MembersTab />}
                    {activeTab === 'requests' && <RequestsTab />}
                </div>
            </div>
            
            {selectedMember && <DetailCard member={selectedMember} />}
        </div>
    );
}