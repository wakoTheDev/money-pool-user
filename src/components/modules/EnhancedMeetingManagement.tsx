"use client";

import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCalendarAlt, faPlus, faFileExport,
  faUsers, faUser, faMapMarkerAlt, faClock, 
  faCheckCircle, faTimesCircle, faExclamationTriangle, faEdit,
  faTrash, faEye, 
  faTimes, faVoteYea,
  faGavel, faClipboardList, 
  
  faChartBar
} from '@fortawesome/free-solid-svg-icons';
import { Meeting, Voting, ModuleComponentProps } from '@/types/enhanced-features';

const EnhancedMeetingManagement: React.FC<ModuleComponentProps> = ({
  chamaId,
  memberId,
  permissions = [],
  onNavigate,
  onUpdate,
  onError
}) => {
  // State Management
  const [activeTab, setActiveTab] = useState<'overview' | 'schedule' | 'attendance' | 'governance' | 'minutes' | 'analytics'>('overview');
  const [selectedMeetings, setSelectedMeetings] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showMeetingModal, setShowMeetingModal] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentView, setCurrentView] = useState<'calendar' | 'list'>('calendar');

  // Mock data - replace with actual API calls
const [meetings] = useState<Meeting[]>([
    {
        id: '1',
        title: 'Monthly General Meeting',
        description: 'Regular monthly meeting for all members',
        type: 'regular',
        date: '2024-08-15',
        time: '14:00',
        duration: 120,
        location: {
            type: 'physical',
            address: 'Community Hall, Main Street',
            coordinates: { lat: -1.2921, lng: 36.8219 }
        },
        agenda: [
            {
                id: '1',
                title: 'Opening and Welcome',
                item: 'Opening and Welcome',
                timeAllocation: 10,
                presenter: 'Chairperson',
                duration: 10
            },
            {
                id: '2',
                title: 'Financial Report',
                item: 'Financial Report',
                timeAllocation: 20,
                presenter: 'Treasurer',
                duration: 20
            },
            {
                id: '3',
                title: 'Loan Applications Review',
                item: 'Loan Applications Review',
                timeAllocation: 30,
                presenter: 'Loan Committee',
                duration: 30
            },
            {
                id: '4',
                title: 'New Business',
                item: 'New Business',
                timeAllocation: 40,
                presenter: 'Secretary',
                duration: 40
            },
            {
                id: '5',
                title: 'AOB and Closure',
                item: 'AOB and Closure',
                timeAllocation: 20,
                presenter: 'Chairperson',
                duration: 20
            }
        ],
        attendees: ['member1', 'member2', 'member3'],
        invitees: ['member1', 'member2', 'member3', 'member4', 'member5'],
        status: 'scheduled',
        requiresQuorum: true,
        quorumPercentage: 60,
        meetingLink: 'https://meet.zoom.us/j/123456789',
        documents: [
            {
                name: 'Default Case Details',
                type: 'pdf',
                uploadedBy: 'loan-officer',
                uploadedAt: '2024-08-09T12:00:00Z',
                id: '3',
                url: '/documents/default-case-details.pdf'
            },
            {
                name: 'Loan Applications',
                type: 'xlsx',
                uploadedBy: 'loan-officer',
                uploadedAt: '2024-08-14T14:30:00Z',
                id: '4',
                url: '/documents/loan-applications.xlsx'
            }
        ],
        scheduledDate: '',
        venue: {
            type: 'physical',
            location: '',
            coordinates: {
                lat: 0,
                lng: 0
            },
            virtualLink: ''
        },
        attendance: [],
        minutes: {
            discussions: [],
            decisions: [],
            actionItems: []
        }
    },
    {
        id: '2',
        title: 'Emergency Committee Meeting',
        description: 'Urgent committee meeting for loan default case',
        type: 'committee',
        date: '2024-08-10',
        time: '16:00',
        duration: 60,
        location: {
            type: 'virtual',
            platform: 'zoom',
            meetingId: '123456789'
        },
        agenda: [
            {
                id: '1',
                title: 'Loan Default Case Review',
                item: 'Loan Default Case Review',
                timeAllocation: 40,
                presenter: 'Loan Officer',
                duration: 40
            },
            {
                id: '2',
                title: 'Recovery Action Plan',
                item: 'Recovery Action Plan',
                timeAllocation: 20,
                presenter: 'Committee',
                duration: 20
            }
        ],
        attendees: ['committee1', 'committee2', 'committee3'],
        invitees: ['committee1', 'committee2', 'committee3', 'committee4'],
        status: 'completed',
        requiresQuorum: true,
        quorumPercentage: 75,
        meetingLink: 'https://meet.zoom.us/j/987654321',
        documents: [
            {
                id: '3',
                name: 'Default Case Details',
                type: 'pdf',
                url: '/documents/default-case-details.pdf',
                uploadedBy: 'loan-officer',
                uploadedAt: '2024-08-09T12:00:00Z'
            }
        ],
        scheduledDate: '',
        venue: {
            type: 'physical',
            location: '',
            coordinates: {
                lat: 0,
                lng: 0
            },
            virtualLink: ''
        },
        attendance: [],
        minutes: {
            discussions: [],
            decisions: [],
            actionItems: []
        }
    }
]);

  const [votingItems] = useState<Voting[]>([
    {
        id: '1',
        title: 'Loan Application - John Doe',
        description: 'Approval of emergency loan application for KES 50,000',
        type: 'resolution',
        status: 'active',
        startDate: '2024-08-15T14:30:00Z',
        endDate: '2024-08-15T15:00:00Z',
        options: [
            { id: '1', text: 'Approve', votes: 8 },
            { id: '2', text: 'Reject', votes: 2 },
            { id: '3', text: 'Defer', votes: 1 }
        ],
        eligibleVoters: ['member1', 'member2', 'member3', 'member4', 'member5'],
        results: [
            { optionId: '1', voteCount: 8, percentage: 73 },
            { optionId: '2', voteCount: 2, percentage: 18 },
            { optionId: '3', voteCount: 1, percentage: 9 }
        ],
        allowProxy: false,
        anonymousVoting: false,
        votes: []
    }
  ]);

  // Overview Tab
  const OverviewTab = () => {
    const upcomingMeetings = meetings.filter(m => m.status === 'scheduled').slice(0, 3);
    const recentMeetings = meetings.filter(m => m.status === 'completed').slice(0, 3);

    return (
      <div className="space-y-6">
        {/* Meeting Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
                <FontAwesomeIcon icon={faCalendarAlt} className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">This Month</p>
                <p className="text-2xl font-bold text-gray-900">4</p>
                <p className="text-xs text-blue-600">Meetings scheduled</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
                <FontAwesomeIcon icon={faUsers} className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Attendance</p>
                <p className="text-2xl font-bold text-gray-900">87%</p>
                <p className="text-xs text-green-600">Above target</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
                <FontAwesomeIcon icon={faVoteYea} className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Active Votes</p>
                <p className="text-2xl font-bold text-gray-900">2</p>
                <p className="text-xs text-purple-600">Pending decisions</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-orange-100 text-orange-600 mr-4">
                <FontAwesomeIcon icon={faGavel} className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Quorum Rate</p>
                <p className="text-2xl font-bold text-gray-900">95%</p>
                <p className="text-xs text-orange-600">Excellent</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button
              onClick={() => setShowMeetingModal(true)}
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 flex flex-col items-center space-y-2"
            >
              <FontAwesomeIcon icon={faPlus} className="w-6 h-6 text-blue-600" />
              <span className="text-sm font-medium text-gray-700">Schedule Meeting</span>
            </button>
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 flex flex-col items-center space-y-2">
              <FontAwesomeIcon icon={faVoteYea} className="w-6 h-6 text-green-600" />
              <span className="text-sm font-medium text-gray-700">Create Vote</span>
            </button>
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 flex flex-col items-center space-y-2">
              <FontAwesomeIcon icon={faClipboardList} className="w-6 h-6 text-purple-600" />
              <span className="text-sm font-medium text-gray-700">Meeting Minutes</span>
            </button>
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 flex flex-col items-center space-y-2">
              <FontAwesomeIcon icon={faFileExport} className="w-6 h-6 text-orange-600" />
              <span className="text-sm font-medium text-gray-700">Export Report</span>
            </button>
          </div>
        </div>

        {/* Upcoming Meetings */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Upcoming Meetings</h3>
            <button 
              onClick={() => setActiveTab('schedule')}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              View All
            </button>
          </div>
          <div className="space-y-4">
            {upcomingMeetings.map((meeting) => (
              <div key={meeting.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{meeting.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{meeting.description}</p>
                    <div className="flex items-center space-x-4 mt-2">
                      <div className="flex items-center text-sm text-gray-500">
                        <FontAwesomeIcon icon={faCalendarAlt} className="w-4 h-4 mr-1" />
                        {new Date(meeting.date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <FontAwesomeIcon icon={faClock} className="w-4 h-4 mr-1" />
                        {meeting.time}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <FontAwesomeIcon icon={faMapMarkerAlt} className="w-4 h-4 mr-1" />
                        {meeting.location.type === 'physical' ? meeting.location.address : 'Virtual'}
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="p-2 text-blue-600 hover:bg-blue-50 rounded">
                      <FontAwesomeIcon icon={faEye} className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-green-600 hover:bg-green-50 rounded">
                      <FontAwesomeIcon icon={faEdit} className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Active Voting */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <FontAwesomeIcon icon={faVoteYea} className="w-5 h-5 mr-2 text-purple-600" />
            Active Voting
          </h3>
          <div className="space-y-4">
            {votingItems.filter(v => v.status === 'active').map((vote) => (
              <div key={vote.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-medium text-gray-900">{vote.title}</h4>
                    <p className="text-sm text-gray-600">{vote.description}</p>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Active
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-4 mb-3">
                  {vote.options.map((option) => (
                    <div key={option.id} className="text-center p-3 bg-gray-50 rounded">
                      <p className="text-sm font-medium text-gray-900">{option.text}</p>
                      <p className="text-lg font-bold text-blue-600">{option.votes}</p>
                      <p className="text-xs text-gray-600">votes</p>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-600">
                    {vote.options.reduce((total, option) => total + option.votes, 0)} votes • Ends {new Date(vote.endDate).toLocaleString()}
                  </p>
                  <button className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 text-sm">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Meeting Activity */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="p-2 bg-green-100 rounded-full">
                <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Meeting Completed</p>
                <p className="text-xs text-gray-600">Emergency Committee Meeting completed with 100% attendance • 2 hours ago</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="p-2 bg-blue-100 rounded-full">
                <FontAwesomeIcon icon={faVoteYea} className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Vote Concluded</p>
                <p className="text-xs text-gray-600">Loan application vote passed with 73% approval • 4 hours ago</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="p-2 bg-purple-100 rounded-full">
                <FontAwesomeIcon icon={faCalendarAlt} className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Meeting Scheduled</p>
                <p className="text-xs text-gray-600">Monthly General Meeting scheduled for August 15th • 1 day ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Schedule Tab
  const ScheduleTab = () => {
    return (
      <div className="space-y-6">
        {/* Calendar/List View Toggle */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">Meeting Schedule</h3>
            <div className="flex items-center space-x-4">
              <div className="flex border border-gray-300 rounded-md">
                <button
                  onClick={() => setCurrentView('calendar')}
                  className={`px-4 py-2 text-sm ${currentView === 'calendar' ? 'bg-blue-50 text-blue-600' : 'text-gray-600'}`}
                >
                  <FontAwesomeIcon icon={faCalendarAlt} className="w-4 h-4 mr-2" />
                  Calendar
                </button>
                <button
                  onClick={() => setCurrentView('list')}
                  className={`px-4 py-2 text-sm border-l border-gray-300 ${currentView === 'list' ? 'bg-blue-50 text-blue-600' : 'text-gray-600'}`}
                >
                  <FontAwesomeIcon icon={faClipboardList} className="w-4 h-4 mr-2" />
                  List
                </button>
              </div>
              <button
                onClick={() => setShowMeetingModal(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
              >
                <FontAwesomeIcon icon={faPlus} className="w-4 h-4 mr-2" />
                Schedule Meeting
              </button>
            </div>
          </div>
        </div>

        {/* Calendar View */}
        {currentView === 'calendar' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <FontAwesomeIcon icon={faCalendarAlt} className="w-16 h-16 text-gray-400 mb-4" />
                <p className="text-gray-500">Interactive Calendar View</p>
                <p className="text-sm text-gray-400">Meeting calendar integration coming soon</p>
              </div>
            </div>
          </div>
        )}

        {/* List View */}
        {currentView === 'list' && (
          <div className="bg-white rounded-lg shadow-md">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h4 className="text-md font-semibold text-gray-900">All Meetings</h4>
                <div className="flex space-x-2">
                  <select className="px-3 py-2 border border-gray-300 rounded-md text-sm">
                    <option value="all">All Status</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  <select className="px-3 py-2 border border-gray-300 rounded-md text-sm">
                    <option value="all">All Types</option>
                    <option value="regular">Regular</option>
                    <option value="committee">Committee</option>
                    <option value="emergency">Emergency</option>
                    <option value="agm">AGM</option>
                    <option value="training">Training</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="divide-y divide-gray-200">
              {meetings.map((meeting) => (
                <div key={meeting.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="font-medium text-gray-900">{meeting.title}</h4>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          meeting.status === 'completed' ? 'bg-green-100 text-green-800' :
                          meeting.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                          meeting.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {meeting.status.replace('_', ' ')}
                        </span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          meeting.type === 'regular' ? 'bg-purple-100 text-purple-800' :
                          meeting.type === 'committee' ? 'bg-orange-100 text-orange-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                        
                          {meeting.type}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{meeting.description}</p>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <FontAwesomeIcon icon={faCalendarAlt} className="w-4 h-4 mr-2" />
                          {new Date(meeting.date).toLocaleDateString()}
                        </div>
                        <div className="flex items-center">
                          <FontAwesomeIcon icon={faClock} className="w-4 h-4 mr-2" />
                          {meeting.time} ({meeting.duration} min)
                        </div>
                        <div className="flex items-center">
                          <FontAwesomeIcon icon={faMapMarkerAlt} className="w-4 h-4 mr-2" />
                          {meeting.location.type === 'physical' ? meeting.location.address : meeting.location.platform}
                        </div>
                        <div className="flex items-center">
                          <FontAwesomeIcon icon={faUsers} className="w-4 h-4 mr-2" />
                          {meeting.attendees.length}/{meeting.invitees.length} attending
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <button
                        onClick={() => setSelectedMeeting(meeting)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                      >
                        <FontAwesomeIcon icon={faEye} className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-green-600 hover:bg-green-50 rounded">
                        <FontAwesomeIcon icon={faEdit} className="w-4 h-4" />
                      </button>
                      {meeting.status === 'scheduled' && (
                        <button className="p-2 text-red-600 hover:bg-red-50 rounded">
                          <FontAwesomeIcon icon={faTrash} className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                  
                  {/* Meeting Agenda Preview */}
                  {meeting.agenda.length > 0 && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                      <h5 className="text-sm font-medium text-gray-900 mb-2">Agenda ({meeting.agenda.length} items)</h5>
                      <div className="space-y-1">
                        {meeting.agenda.slice(0, 3).map((item) => (
                          <div key={item.id} className="flex justify-between text-sm text-gray-600">
                            <span>{item.item}</span>
                            <span>{item.timeAllocation} min</span>
                          </div>
                        ))}
                        {meeting.agenda.length > 3 && (
                          <p className="text-xs text-gray-500">+ {meeting.agenda.length - 3} more items</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Meeting Detail Modal */}
        {selectedMeeting && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">{selectedMeeting.title}</h3>
                <button
                  onClick={() => setSelectedMeeting(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FontAwesomeIcon icon={faTimes} className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Meeting Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Meeting Details</h4>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">Date:</span> {new Date(selectedMeeting.date).toLocaleDateString()}</p>
                      <p><span className="font-medium">Time:</span> {selectedMeeting.time}</p>
                      <p><span className="font-medium">Duration:</span> {selectedMeeting.duration} minutes</p>
                      <p><span className="font-medium">Type:</span> {selectedMeeting.type}</p>
                      <p><span className="font-medium">Location:</span> {
                        selectedMeeting.location.type === 'physical' ? 
                        selectedMeeting.location.address : 
                        `${selectedMeeting.location.platform} (Virtual)`
                      }</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Attendance</h4>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">Invited:</span> {selectedMeeting.invitees.length} members</p>
                      <p><span className="font-medium">Confirmed:</span> {selectedMeeting.attendees.length} members</p>
                      <p><span className="font-medium">Attendance Rate:</span> {Math.round((selectedMeeting.attendees.length / selectedMeeting.invitees.length) * 100)}%</p>
                      <p><span className="font-medium">Quorum Required:</span> {selectedMeeting.requiresQuorum ? `${selectedMeeting.quorumPercentage}%` : 'No'}</p>
                    </div>
                  </div>
                </div>

                {/* Agenda */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Meeting Agenda</h4>
                  <div className="space-y-2">
                    {selectedMeeting.agenda.map((item, index) => (
                      <div key={item.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs font-medium">
                            {index + 1}
                          </span>
                          <div>
                            <p className="font-medium text-gray-900">{item.title}</p>
                            <p className="text-sm text-gray-600">Presenter: {item.presenter}</p>
                          </div>
                        </div>
                        <span className="text-sm text-gray-500">{item.duration} min</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                  <button className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">
                    Export Details
                  </button>
                  {selectedMeeting.status === 'scheduled' && (
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                      Edit Meeting
                    </button>
                  )}
                  {selectedMeeting.meetingLink && (
                    <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
                      Join Meeting
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Attendance Tab
  const AttendanceTab = () => {
    return (
      <div className="space-y-6">
        {/* Attendance Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
                <FontAwesomeIcon icon={faCheckCircle} className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Present</p>
                <p className="text-2xl font-bold text-gray-900">15</p>
                <p className="text-xs text-green-600">Last meeting</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-red-100 text-red-600 mr-4">
                <FontAwesomeIcon icon={faTimesCircle} className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Absent</p>
                <p className="text-2xl font-bold text-gray-900">3</p>
                <p className="text-xs text-red-600">Last meeting</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4">
                <FontAwesomeIcon icon={faExclamationTriangle} className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Apologies</p>
                <p className="text-2xl font-bold text-gray-900">2</p>
                <p className="text-xs text-yellow-600">Last meeting</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
                <FontAwesomeIcon icon={faUsers} className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Attendance Rate</p>
                <p className="text-2xl font-bold text-gray-900">83%</p>
                <p className="text-xs text-blue-600">This month</p>
              </div>
            </div>
          </div>
        </div>

        {/* Attendance Tracking */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Meeting Attendance Tracking</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Member
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Meetings
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Attended
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Missed
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Attendance Rate
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Attendance
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {[
                  { name: 'John Doe', total: 12, attended: 11, missed: 1, rate: 92, lastDate: '2024-08-10' },
                  { name: 'Jane Smith', total: 12, attended: 10, missed: 2, rate: 83, lastDate: '2024-08-10' },
                  { name: 'Mike Johnson', total: 12, attended: 12, missed: 0, rate: 100, lastDate: '2024-08-10' },
                  { name: 'Sarah Wilson', total: 12, attended: 8, missed: 4, rate: 67, lastDate: '2024-07-15' }
                ].map((member, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                          <FontAwesomeIcon icon={faUser} className="w-5 h-5 text-gray-500" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{member.name}</div>
                          <div className="text-sm text-gray-500">MEM{(index + 1).toString().padStart(3, '0')}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {member.total}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">
                      {member.attended}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-medium">
                      {member.missed}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className={`text-sm font-medium ${
                          member.rate >= 90 ? 'text-green-600' :
                          member.rate >= 75 ? 'text-yellow-600' :
                          'text-red-600'
                        }`}>
                          {member.rate}%
                        </span>
                        <div className="ml-2 w-16 bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              member.rate >= 90 ? 'bg-green-500' :
                              member.rate >= 75 ? 'bg-yellow-500' :
                              'bg-red-500'
                            }`}
                            style={{ width: `${member.rate}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(member.lastDate).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Attendance Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Attendance Trends</h3>
            <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">Line Chart - Attendance Over Time</p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Member Attendance Distribution</h3>
            <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">Bar Chart - Attendance by Member</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Main Tab Navigation
  const tabs = [
    { id: 'overview', label: 'Overview', icon: faCalendarAlt },
    { id: 'schedule', label: 'Schedule', icon: faCalendarAlt },
    { id: 'attendance', label: 'Attendance', icon: faUsers },
    { id: 'governance', label: 'Governance', icon: faVoteYea },
    { id: 'minutes', label: 'Minutes', icon: faClipboardList },
    { id: 'analytics', label: 'Analytics', icon: faChartBar }
  ];

  return (
    <div className="h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <FontAwesomeIcon icon={faCalendarAlt} className="w-8 h-8 mr-3 text-blue-600" />
              Enhanced Meeting Management
            </h1>
            <p className="text-gray-600 mt-1">Complete meeting scheduling and governance system</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => setShowMeetingModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
            >
              <FontAwesomeIcon icon={faPlus} className="w-4 h-4 mr-2" />
              Schedule Meeting
            </button>
            <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center">
              <FontAwesomeIcon icon={faVoteYea} className="w-4 h-4 mr-2" />
              Create Vote
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
        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'schedule' && <ScheduleTab />}
        {activeTab === 'attendance' && <AttendanceTab />}
        {activeTab === 'governance' && (
          <div className="text-center py-12">
            <FontAwesomeIcon icon={faVoteYea} className="w-16 h-16 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Governance & Voting</h3>
            <p className="text-gray-600">Electronic voting and governance tools coming soon</p>
          </div>
        )}
        {activeTab === 'minutes' && (
          <div className="text-center py-12">
            <FontAwesomeIcon icon={faClipboardList} className="w-16 h-16 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Meeting Minutes</h3>
            <p className="text-gray-600">Automated meeting minutes generation coming soon</p>
          </div>
        )}
        {activeTab === 'analytics' && (
          <div className="text-center py-12">
            <FontAwesomeIcon icon={faChartBar} className="w-16 h-16 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Meeting Analytics</h3>
            <p className="text-gray-600">Detailed meeting analytics and insights coming soon</p>
          </div>
        )}
      </div>

      {/* Meeting Modal */}
      {showMeetingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Schedule New Meeting</h3>
              <button
                onClick={() => setShowMeetingModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FontAwesomeIcon icon={faTimes} className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6">
              <form className="space-y-6">
                {/* Basic Information */}
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-4">Meeting Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Meeting Title *</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter meeting title"
                        required
                      />
                    </div>
                    <div>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="regular">Regular Meeting</option>
                        <option value="committee">Committee Meeting</option>
                        <option value="emergency">Emergency Meeting</option>
                        <option value="agm">Annual General Meeting</option>
                        <option value="training">Training Meeting</option>
                      </select>
                      
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                      <textarea
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Meeting description and objectives"
                      />
                    </div>
                  </div>
                </div>

                {/* Date and Time */}
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-4">Date & Time</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Date *</label>
                      <input
                        type="date"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Start Time *</label>
                      <input
                        type="time"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Duration (minutes) *</label>
                      <input
                        type="number"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="120"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Location */}
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-4">Location</h4>
                  <div className="space-y-4">
                    <div className="flex space-x-4">
                      <label className="flex items-center">
                        <input type="radio" name="locationType" value="physical" className="mr-2" defaultChecked />
                        <span className="text-sm">Physical Location</span>
                      </label>
                      <label className="flex items-center">
                        <input type="radio" name="locationType" value="virtual" className="mr-2" />
                        <span className="text-sm">Virtual Meeting</span>
                      </label>
                      <label className="flex items-center">
                        <input type="radio" name="locationType" value="hybrid" className="mr-2" />
                        <span className="text-sm">Hybrid</span>
                      </label>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Address/Meeting Link</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter venue address or meeting link"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setShowMeetingModal(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Schedule Meeting
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedMeetingManagement;
