
import { FaDollarSign } from "react-icons/fa";
import { FaArrowTrendUp, FaUserGroup, FaUserPlus  } from "react-icons/fa6";
import { CiCircleCheck } from "react-icons/ci";
import { useState } from "react";


export default function DashboardOverview() {
    const [selectedAction, setSelectedAction] = useState("");

    const handleActionSelect = (action: string) => {
        setSelectedAction(action);
        // Add your action handling logic here
        console.log(`Selected action: ${action}`);
    };
    return (
        <div className="flex flex-col h-full bg-gray-50">
            {/* Fixed Header */}
            <div className="bg-white shadow-sm flex-shrink-0 p-4">
                <div className="flex flex-row items-center justify-between">
                    <div className="text-xl sm:text-2xl text-center font-bold text-gray-800">
                        Welcome User
                    </div>
                    
                    {/* Desktop Actions - Hidden on small screens */}
                    <div className="hidden sm:flex flex-row gap-4">
                        <p className="font-bold border border-[#2E7D32] text-[#2E7D32] p-2 rounded flex items-center gap-2">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="2" fill="none"/>
                                <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="2"/>
                                <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="2"/>
                                <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="2"/>
                            </svg>
                            Schedule <span className="font-bold">Meeting</span>
                        </p>
                        <p className="font-bold bg-green-700 text-white p-2 rounded flex items-center gap-2">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" strokeWidth="2"/>
                                <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" strokeWidth="2"/>
                            </svg>
                            Add Member
                        </p>
                    </div>

                    {/* Mobile Actions - Dropdown for small screens */}
                    <div className="sm:hidden">
                        <select
                            value={selectedAction}
                            onChange={(e) => handleActionSelect(e.target.value)}
                            className="px-3 py-2 bg-green-600 text-white rounded-lg text-sm font-medium border-none outline-none"
                        >
                            <option value="">Quick Actions</option>
                            <option value="schedule">Schedule Meeting</option>
                            <option value="addMember">Add Member</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Scrollable Main Content */}
            <div className="flex-1 overflow-y-auto p-4 scrollbar-hide">
                {/* Statistics Cards - Responsive Layout */}
                <div className="w-full mx-auto mb-6">
                    <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
                        <article className="flex flex-col p-3 lg:p-4 border border-gray-200 rounded-lg shadow-sm bg-white">
                            <h2 className="text-sm lg:text-base font-medium mb-2">Total Members</h2>
                            <div className="flex flex-col lg:flex-row lg:items-center">
                                <FaUserGroup className="text-gray-500 w-6 h-6 lg:w-8 lg:h-8 mb-2 lg:mb-0 lg:mr-3" />
                                <span className="text-lg lg:text-xl font-bold">20</span>
                            </div>
                            <p className="text-yellow-500 text-xs lg:text-sm mt-2">+2 members this month</p>
                        </article>
                        
                        <article className="flex flex-col p-3 lg:p-4 border border-gray-200 rounded-lg shadow-sm bg-white">
                            <h2 className="text-sm lg:text-base font-medium mb-2">Total Savings</h2>
                            <div className="flex flex-col lg:flex-row lg:items-center">
                                <FaDollarSign className="text-gray-500 w-6 h-6 lg:w-8 lg:h-8 mb-2 lg:mb-0 lg:mr-3" />
                                <span className="text-lg lg:text-xl font-bold">Ksh 150,000</span>
                            </div>
                            <p className="text-yellow-500 text-xs lg:text-sm mt-2">+12% this month</p>
                        </article>
                        
                        <article className="flex flex-col p-3 lg:p-4 border border-gray-200 rounded-lg shadow-sm bg-white">
                            <h2 className="text-sm lg:text-base font-medium mb-2">Active Loans</h2>
                            <div className="flex flex-col lg:flex-row lg:items-center">
                                <FaArrowTrendUp className="text-gray-500 w-6 h-6 lg:w-8 lg:h-8 mb-2 lg:mb-0 lg:mr-3" />
                                <span className="text-lg lg:text-xl font-bold">5</span>
                            </div>
                        </article>
                        
                        <article className="flex flex-col p-3 lg:p-4 border border-gray-200 rounded-lg shadow-sm bg-white">
                            <h2 className="text-sm lg:text-base font-medium mb-2">Collection Rate</h2>
                            <div className="flex flex-col lg:flex-row lg:items-center">
                                <CiCircleCheck className="text-gray-500 w-6 h-6 lg:w-8 lg:h-8 mb-2 lg:mb-0 lg:mr-3" />
                                <span className="text-lg lg:text-xl font-bold">85%</span>
                            </div>
                            <p className="text-yellow-500 text-xs lg:text-sm mt-2">+3% improvement</p>
                        </article>
                    </section>
                </div>

                {/*recent activities will be appearing here */}
                <section className="w-full lg:w-[90%] mx-auto p-4 lg:p-6 bg-white rounded-lg shadow-sm">
                    <h2 className="text-lg lg:text-xl font-semibold mb-4">Recent Activities</h2>
                    <p className="text-sm lg:text-base mb-4">Latest transactions and member activities</p>
                    <ul className="space-y-3">
                        <li className="flex flex-row items-start border border-gray-200 p-3 rounded-lg">
                            <FaUserPlus className="text-gray-500 w-8 h-8 lg:w-10 lg:h-10 mr-3 border rounded-lg shadow-sm p-1 lg:p-2 flex-shrink-0" />
                            <p className="text-sm lg:text-base">Member John Doe joined the chama.</p>
                        </li>
                        <li className="flex flex-row items-start border border-gray-200 p-3 rounded-lg">
                            <FaDollarSign className="text-gray-500 w-8 h-8 lg:w-10 lg:h-10 mr-3 border rounded-lg shadow-sm p-1 lg:p-2 flex-shrink-0" />
                            <p className="text-sm lg:text-base">Contribution of Ksh 500 received from Jane Smith.</p>
                        </li>
                        <li className="flex flex-row items-start border border-gray-200 p-3 rounded-lg">
                            <FaArrowTrendUp className="text-gray-500 w-8 h-8 lg:w-10 lg:h-10 mr-3 border rounded-lg shadow-sm p-1 lg:p-2 flex-shrink-0" />
                            <p className="text-sm lg:text-base">Loan of Ksh 1,000 approved for Michael Johnson.</p>
                        </li>
                        <li className="flex flex-row items-start border border-gray-200 p-3 rounded-lg">
                            <CiCircleCheck className="text-gray-500 w-8 h-8 lg:w-10 lg:h-10 mr-3 border rounded-lg shadow-sm p-1 lg:p-2 flex-shrink-0" />
                            <p className="text-sm lg:text-base">Meeting scheduled for next Friday at 3 PM.</p>
                        </li>
                    </ul>
                </section>
                {/* progress bar */}
                <div className="mt-6 w-full lg:w-[90%] mx-auto p-4 lg:p-6 bg-white rounded-lg shadow-sm">
                    <h2 className="text-lg lg:text-xl font-semibold mb-4">Monthly collection progress</h2>
                    <p className="mb-4 text-sm lg:text-base">Ksh 75,000 out of Ksh 100,000 target collected</p>
                    <div className="w-full bg-gray-200 rounded-full h-6 lg:h-8 mb-2">
                        <div className="bg-green-500 h-6 lg:h-8 rounded-full" style={{ width: '75%' }}></div>
                    </div>
                    <div className="flex flex-row items-center justify-between">
                        <p className="text-xs lg:text-sm text-gray-600 mt-2">75% achieved</p>
                        <p className="text-xs lg:text-sm text-gray-600 mt-2">Ksh 25,000 remaining</p>
                    </div>
                </div>
            </div>
        </div>
    );    
}