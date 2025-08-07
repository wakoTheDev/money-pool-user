import { useState, useEffect } from "react";
import { 
    FaPlus, FaCalendar, FaVideo, FaUsers, FaMicrophone, FaMicrophoneSlash, 
    FaVideoSlash, FaShare, FaEdit, FaTrash, FaClock, FaMapMarkerAlt,
    FaPhone, FaDesktop, FaUserPlus, FaSignOutAlt, FaCopy, FaDownload,
    FaRobot, FaRecordVinyl, FaStop, FaPlay, FaPause, FaBell
} from "react-icons/fa";
import { MdSchedule, MdGroup, MdLocationOn, MdContentCopy, MdSend } from "react-icons/md";
import { BiTime, BiVideoRecording, BiMicrophone } from "react-icons/bi";

type Meeting = {
    id: number;
    title: string;
    type: string;
    date: string;
    time: string;
    duration: number;
    location: string;
    organizer: string;
    agenda: string[];
    attendees: number[];
    status: string;
    meetingLink?: string;
    recordingEnabled: boolean;
    aiMinutesEnabled: boolean;
    isInstant?: boolean;
};

export default function Meetings() {
    const [activeView, setActiveView] = useState("schedule"); 
    const [showCreateMeeting, setShowCreateMeeting] = useState(false);
    const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const [aiMinutes, setAiMinutes] = useState("");
    const [meetingNotes, setMeetingNotes] = useState("");
    const [participants, setParticipants] = useState([]);
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);

    // Sample chama data
    const chamaMembers = [
        { id: 1, name: "John Doe", email: "john@example.com", status: "online" },
        { id: 2, name: "Sarah Wilson", email: "sarah@example.com", status: "online" },
        { id: 3, name: "Peter Kamau", email: "peter@example.com", status: "offline" },
        { id: 4, name: "Mary Wanjiku", email: "mary@example.com", status: "online" },
        { id: 5, name: "James Muthoni", email: "james@example.com", status: "away" },
        { id: 6, name: "Lucy Akinyi", email: "lucy@example.com", status: "online" }
    ];

    const [meetings, setMeetings] = useState([
        {
            id: 1,
            title: "Monthly Financial Review",
            type: "virtual",
            date: "2024-08-15",
            time: "14:00",
            duration: 120,
            location: "Virtual Meeting Room",
            organizer: "John Doe",
            agenda: ["Financial reports", "Loan applications review", "Investment opportunities"],
            attendees: [1, 2, 3, 4],
            status: "upcoming",
            meetingLink: "https://meet.chama.com/monthly-review-aug",
            recordingEnabled: true,
            aiMinutesEnabled: true
        },
        {
            id: 2,
            title: "Emergency Meeting - Loan Default",
            type: "instant",
            date: "2024-08-06",
            time: "16:00",
            duration: 60,
            location: "Virtual Meeting Room",
            organizer: "Sarah Wilson",
            agenda: ["Discuss loan default case", "Recovery strategies", "Policy review"],
            attendees: [1, 2, 5],
            status: "live",
            meetingLink: "https://meet.chama.com/emergency-aug",
            recordingEnabled: true,
            aiMinutesEnabled: true
        },
        {
            id: 3,
            title: "Quarterly Planning Session",
            type: "physical",
            date: "2024-08-20",
            time: "10:00",
            duration: 180,
            location: "Community Center Hall A",
            organizer: "Peter Kamau",
            agenda: ["Q3 performance review", "Q4 goals setting", "Member recruitment", "Investment planning"],
            attendees: [1, 2, 3, 4, 5, 6],
            status: "upcoming",
            recordingEnabled: false,
            aiMinutesEnabled: false
        }
    ]);

    const [newMeeting, setNewMeeting] = useState<{
        title: string;
        type: string;
        date: string;
        time: string;
        duration: number;
        location: string;
        agenda: string[];
        attendees: number[];
        recordingEnabled: boolean;
        aiMinutesEnabled: boolean;
        isInstant: boolean;
    }>({
        title: "",
        type: "virtual",
        date: "",
        time: "",
        duration: 60,
        location: "",
        agenda: [""],
        attendees: [],
        recordingEnabled: true,
        aiMinutesEnabled: true,
        isInstant: false
    });

    // Recording timer effect
    useEffect(() => {
        let interval: NodeJS.Timeout | undefined;
        if (isRecording) {
            interval = setInterval(() => {
                setRecordingTime(time => time + 1);
            }, 1000);
        } else if (!isRecording && recordingTime !== 0) {
            if (interval) clearInterval(interval);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isRecording, recordingTime]);

    const formatTime = (seconds: number) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        if (hours > 0) {
            return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
        return `${minutes}:${secs.toString().padStart(2, '0')}`;
    };

    const handleCreateMeeting = () => {
        const meeting = {
            ...newMeeting,
            id: meetings.length + 1,
            organizer: "Current User",
            status: newMeeting.isInstant ? "live" : "upcoming",
            meetingLink: newMeeting.type === "virtual" ? `https://meet.chama.com/meeting-${meetings.length + 1}` : ""
        };
        
        setMeetings([...meetings, meeting]);
        setNewMeeting({
            title: "",
            type: "virtual",
            date: "",
            time: "",
            duration: 60,
            location: "",
            agenda: [""],
            attendees: [],
            recordingEnabled: true,
            aiMinutesEnabled: true,
            isInstant: false
        });
        setShowCreateMeeting(false);
        
        if (newMeeting.isInstant) {
            setSelectedMeeting(meeting);
            setActiveView("live");
        }
    };

    const addAgendaItem = () => {
        setNewMeeting({...newMeeting, agenda: [...newMeeting.agenda, ""]});
    };

    const updateAgendaItem = ({index, value}: {index: number, value: string}) => {
        const newAgenda = [...newMeeting.agenda];
        newAgenda[index] = value;
        setNewMeeting({...newMeeting, agenda: newAgenda});
    };

    const removeAgendaItem = (index: number) => {
        const newAgenda = newMeeting.agenda.filter((_, i) => i !== index);
        setNewMeeting({...newMeeting, agenda: newAgenda});
    };

    const generateAIMinutes = () => {
        // Simulate AI processing
        setTimeout(() => {
            setAiMinutes(`
**Meeting Minutes - ${selectedMeeting?.title}**
**Date:** ${selectedMeeting?.date} at ${selectedMeeting?.time}
**Attendees:** ${selectedMeeting?.attendees?.map(id => chamaMembers.find(m => m.id === id)?.name).join(", ")}

**Key Discussion Points:**
• Financial performance review completed
• Loan applications discussed and approved
• New investment opportunities identified
• Member concerns addressed

**Decisions Made:**
• Approved 3 new loan applications
• Allocated KES 50,000 for emergency fund
• Scheduled next review for end of month

**Action Items:**
• John Doe: Follow up on pending loan documentation
• Sarah Wilson: Prepare investment proposal presentation
• Peter Kamau: Update member handbook

**Next Meeting:** Scheduled for next month
            `);
        }, 3000);
    };

    const copyMeetingLink = (link: string) => {
        navigator.clipboard.writeText(link);
        // Show toast notification
    };

    const getMemberStatus = (memberId: number) => {
        const member = chamaMembers.find(m => m.id === memberId);
        return member?.status || "offline";
    };

    const CreateMeetingModal = () => (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Schedule New Meeting</h2>
                    <button 
                        onClick={() => setShowCreateMeeting(false)}
                        className="text-gray-500 hover:text-gray-700 text-xl font-bold"
                    >
                        ×
                    </button>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Meeting Title</label>
                        <input
                            type="text"
                            value={newMeeting.title}
                            onChange={(e) => setNewMeeting({...newMeeting, title: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                            placeholder="Enter meeting title"
                        />
                    </div>

                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Meeting Type</label>
                            <select
                                value={newMeeting.type}
                                onChange={(e) => setNewMeeting({...newMeeting, type: e.target.value})}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                            >
                                <option value="virtual">Virtual Meeting</option>
                                <option value="physical">Physical Meeting</option>
                                <option value="hybrid">Hybrid Meeting</option>
                            </select>
                        </div>
                        <div className="flex items-center mt-6">
                            <input
                                type="checkbox"
                                id="instant"
                                checked={newMeeting.isInstant}
                                onChange={(e) => setNewMeeting({...newMeeting, isInstant: e.target.checked})}
                                className="w-4 h-4 text-green-600"
                            />
                            <label htmlFor="instant" className="ml-2 text-sm text-gray-700">Start Instantly</label>
                        </div>
                    </div>

                    {!newMeeting.isInstant && (
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                                <input
                                    type="date"
                                    value={newMeeting.date}
                                    onChange={(e) => setNewMeeting({...newMeeting, date: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                />
                            </div>
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                                <input
                                    type="time"
                                    value={newMeeting.time}
                                    onChange={(e) => setNewMeeting({...newMeeting, time: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                />
                            </div>
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
                                <input
                                    type="number"
                                    value={newMeeting.duration}
                                    onChange={(e) => setNewMeeting({...newMeeting, duration: parseInt(e.target.value)})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                    min="15"
                                    step="15"
                                />
                            </div>
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {newMeeting.type === "virtual" ? "Meeting Room" : "Location"}
                        </label>
                        <input
                            type="text"
                            value={newMeeting.location}
                            onChange={(e) => setNewMeeting({...newMeeting, location: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                            placeholder={newMeeting.type === "virtual" ? "Virtual Meeting Room" : "Enter physical location"}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Agenda Items</label>
                        {newMeeting.agenda.map((item, index) => (
                            <div key={index} className="flex gap-2 mb-2">
                                <input
                                    type="text"
                                    value={item}
                                    onChange={(e) => updateAgendaItem({ index, value: e.target.value })}
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                    placeholder={`Agenda item ${index + 1}`}
                                />
                                {newMeeting.agenda.length > 1 && (
                                    <button
                                        onClick={() => removeAgendaItem(index)}
                                        className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                                    >
                                        <FaTrash />
                                    </button>
                                )}
                            </div>
                        ))}
                        <button
                            onClick={addAgendaItem}
                            className="text-green-600 hover:text-green-800 text-sm flex items-center gap-1"
                        >
                            <FaPlus /> Add agenda item
                        </button>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Invite Members</label>
                        <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                            {chamaMembers.map(member => (
                                <label key={member.id} className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={newMeeting.attendees.includes(member.id)}
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setNewMeeting({...newMeeting, attendees: [...newMeeting.attendees, member.id]});
                                            } else {
                                                setNewMeeting({...newMeeting, attendees: newMeeting.attendees.filter(id => id !== member.id)});
                                            }
                                        }}
                                        className="w-4 h-4 text-green-600"
                                    />
                                    <span className="text-sm">{member.name}</span>
                                    <div className={`w-2 h-2 rounded-full ${
                                        member.status === "online" ? "bg-green-500" :
                                        member.status === "away" ? "bg-yellow-500" : "bg-gray-400"
                                    }`} />
                                </label>
                            ))}
                        </div>
                    </div>

                    {newMeeting.type !== "physical" && (
                        <div className="flex gap-4">
                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={newMeeting.recordingEnabled}
                                    onChange={(e) => setNewMeeting({...newMeeting, recordingEnabled: e.target.checked})}
                                    className="w-4 h-4 text-green-600"
                                />
                                <span className="text-sm">Enable Recording</span>
                            </label>
                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={newMeeting.aiMinutesEnabled}
                                    onChange={(e) => setNewMeeting({...newMeeting, aiMinutesEnabled: e.target.checked})}
                                    className="w-4 h-4 text-green-600"
                                />
                                <span className="text-sm">AI Meeting Minutes</span>
                            </label>
                        </div>
                    )}

                    <div className="flex gap-3 pt-4">
                        <button
                            onClick={handleCreateMeeting}
                            disabled={!newMeeting.title || (!newMeeting.isInstant && (!newMeeting.date || !newMeeting.time))}
                            className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:bg-gray-400 flex items-center justify-center gap-2"
                        >
                            {newMeeting.isInstant ? <FaPlay /> : <FaCalendar />}
                            {newMeeting.isInstant ? "Start Meeting Now" : "Schedule Meeting"}
                        </button>
                        <button
                            onClick={() => setShowCreateMeeting(false)}
                            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    const LiveMeetingPanel = ({ meeting }: { meeting: Meeting }) => (
        <div className="bg-gray-900 text-white rounded-lg overflow-hidden">
            <div className="bg-gray-800 p-4 flex justify-between items-center">
                <div>
                    <h3 className="text-xl font-bold">{meeting.title}</h3>
                    <p className="text-gray-300">Live Meeting • {meeting.attendees.length} participants</p>
                </div>
                <div className="flex items-center gap-4">
                    {isRecording && (
                        <div className="flex items-center gap-2 bg-red-600 px-3 py-1 rounded-full">
                            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                            <span className="text-sm">REC {formatTime(recordingTime)}</span>
                        </div>
                    )}
                    <button
                        onClick={() => setActiveView("upcoming")}
                        className="text-gray-400 hover:text-white"
                    >
                        <FaSignOutAlt />
                    </button>
                </div>
            </div>

            <div className="flex">
                {/* Main video area */}
                <div className="flex-1 bg-gray-700 aspect-video flex items-center justify-center relative">
                    <div className="text-center">
                        <div className="w-32 h-32 bg-gray-600 rounded-full flex items-center justify-center mb-4">
                            <FaUsers className="w-16 h-16 text-gray-400" />
                        </div>
                        <p className="text-lg">Main Speaker View</p>
                    </div>
                    {isRecording && (
                        <div className="absolute top-4 right-4">
                            <div className="bg-red-600 px-2 py-1 rounded flex items-center gap-1">
                                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                                <span className="text-xs">Recording</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Participants sidebar */}
                <div className="w-80 bg-gray-800 p-4">
                    <h4 className="font-semibold mb-3">Participants ({meeting.attendees.length})</h4>
                    <div className="space-y-2">
                        {meeting.attendees.map(attendeeId => {
                            const member = chamaMembers.find(m => m.id === attendeeId);
                            return (
                                <div key={attendeeId} className="flex items-center justify-between p-2 bg-gray-700 rounded">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                                            <span className="text-sm">{member?.name?.charAt(0)}</span>
                                        </div>
                                        <span className="text-sm">{member?.name}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <div className={`w-2 h-2 rounded-full ${
                                            getMemberStatus(attendeeId) === "online" ? "bg-green-500" : "bg-gray-500"
                                        }`} />
                                        {Math.random() > 0.5 ? <FaMicrophone className="w-3 h-3" /> : <FaMicrophoneSlash className="w-3 h-3 text-red-500" />}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {meeting.aiMinutesEnabled && (
                        <div className="mt-6">
                            <h4 className="font-semibold mb-3 flex items-center gap-2">
                                <FaRobot /> AI Meeting Notes
                            </h4>
                            <div className="bg-gray-700 p-3 rounded text-sm max-h-40 overflow-y-auto">
                                <textarea
                                    value={meetingNotes}
                                    onChange={(e) => setMeetingNotes(e.target.value)}
                                    placeholder="AI is listening and taking notes..."
                                    className="w-full bg-transparent border-none outline-none resize-none"
                                    rows={6}
                                />
                            </div>
                            <button
                                onClick={generateAIMinutes}
                                className="mt-2 bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                            >
                                Generate Summary
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Meeting controls */}
            <div className="bg-gray-800 p-4 flex justify-center gap-4">
                <button
                    onClick={() => setIsMuted(!isMuted)}
                    className={`p-3 rounded-full ${isMuted ? 'bg-red-600' : 'bg-gray-600'} hover:bg-opacity-80`}
                >
                    {isMuted ? <FaMicrophoneSlash /> : <FaMicrophone />}
                </button>
                <button
                    onClick={() => setIsVideoOff(!isVideoOff)}
                    className={`p-3 rounded-full ${isVideoOff ? 'bg-red-600' : 'bg-gray-600'} hover:bg-opacity-80`}
                >
                    {isVideoOff ? <FaVideoSlash /> : <FaVideo />}
                </button>
                <button
                    onClick={() => setIsRecording(!isRecording)}
                    className={`p-3 rounded-full ${isRecording ? 'bg-red-600' : 'bg-gray-600'} hover:bg-opacity-80`}
                    disabled={!meeting.recordingEnabled}
                >
                    {isRecording ? <FaStop /> : <FaRecordVinyl />}
                </button>
                <button className="p-3 rounded-full bg-gray-600 hover:bg-opacity-80">
                    <FaDesktop />
                </button>
                <button className="p-3 rounded-full bg-red-600 hover:bg-red-700">
                    <FaPhone className="transform rotate-135" />
                </button>
            </div>
        </div>
    );

    return (
        <div className="w-full h-full bg-white rounded-lg shadow-lg">
           
            {/* Navigation */}
            <div className="bg-gray-50 mb-2 flex gap-1 p-1">
                {[
                    { key: "schedule", label: "Schedule", icon: FaCalendar },
                    { key: "upcoming", label: "Upcoming", icon: FaClock },
                    { key: "live", label: "Live", icon: FaVideo },
                    { key: "history", label: "History", icon: BiTime }
                ].map(tab => {
                    const IconComponent = tab.icon;
                    return (
                        <button
                            key={tab.key}
                            onClick={() => setActiveView(tab.key)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                                activeView === tab.key 
                                    ? 'bg-blue-600 text-white' 
                                    : 'text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            <IconComponent className="w-4 h-4" />
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            <div className="p-6">
                {activeView === "schedule" && (
                    <div className="text-center py-12">
                        <FaCalendar className="w-15 h-15 text-gray-300 mx-auto mb-6" />
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Schedule a New Meeting</h2>
                        <p className="text-gray-600 mb-8">Create instant or future meetings for your chama members</p>
                        <div className="flex gap-4 justify-center">
                            <button
                                onClick={() => {
                                    setNewMeeting({...newMeeting, isInstant: true});
                                    setShowCreateMeeting(true);
                                }}
                                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 flex items-center gap-2"
                            >
                                <FaPlay /> Start Instant Meeting
                            </button>
                            <button
                                onClick={() => {
                                    setNewMeeting({...newMeeting, isInstant: false});
                                    setShowCreateMeeting(true);
                                }}
                                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 flex items-center gap-2"
                            >
                                <FaCalendar /> Schedule Meeting
                            </button>
                        </div>
                    </div>
                )}

                {activeView === "upcoming" && (
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold">Upcoming Meetings</h2>
                            <button
                                onClick={() => setShowCreateMeeting(true)}
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
                            >
                                <FaPlus /> New Meeting
                            </button>
                        </div>

                        <div className="grid gap-4">
                            {meetings.filter(m => m.status === "upcoming").map(meeting => (
                                <div key={meeting.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <h3 className="text-lg font-semibold mb-2">{meeting.title}</h3>
                                            <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
                                                <div className="flex items-center gap-1">
                                                    <FaCalendar /> {meeting.date} at {meeting.time}
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <BiTime /> {meeting.duration} minutes
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    {meeting.type === "virtual" ? <FaVideo /> : <FaMapMarkerAlt />}
                                                    {meeting.location}
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <FaUsers /> {meeting.attendees.length} attendees
                                                </div>
                                            </div>
                                            <div className="mb-3">
                                                <p className="text-sm text-gray-700 font-medium mb-1">Agenda:</p>
                                                <ul className="text-sm text-gray-600">
                                                    {meeting.agenda.slice(0, 2).map((item, index) => (
                                                        <li key={index}>• {item}</li>
                                                    ))}
                                                    {meeting.agenda.length > 2 && (
                                                        <li className="text-blue-600">• and {meeting.agenda.length - 2} more items...</li>
                                                    )}
                                                </ul>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            {meeting.type === "virtual" && (
                                                <button
                                                    onClick={() => meeting.meetingLink && copyMeetingLink(meeting.meetingLink)}
                                                    className="bg-green-100 text-green-700 px-3 py-2 rounded-lg hover:bg-green-200 flex items-center gap-1"
                                                >
                                                    <FaShare /> Share Link
                                                </button>
                                            )}
                                            <button className="bg-blue-100 text-blue-700 px-3 py-2 rounded-lg hover:bg-blue-200 flex items-center gap-1">
                                                <FaEdit /> Edit
                                            </button>
                                            {meeting.type === "virtual" && new Date(`${meeting.date} ${meeting.time}`) <= new Date() && (
                                                <button
                                                    onClick={() => {
                                                        setSelectedMeeting(meeting);
                                                        setActiveView("live");
                                                    }}
                                                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-1"
                                                >
                                                    <FaVideo /> Join Now
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeView === "live" && (
                    <div>
                        {selectedMeeting ? (
                            <LiveMeetingPanel meeting={selectedMeeting} />
                        ) : (
                            meetings.filter(m => m.status === "live").length > 0 ? (
                                <div>
                                    <h2 className="text-2xl font-bold mb-6">Live Meetings</h2>
                                    {meetings.filter(m => m.status === "live").map(meeting => (
                                        <div key={meeting.id} className="border border-red-200 bg-red-50 rounded-lg p-4 mb-4">
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <h3 className="text-lg font-semibold flex items-center gap-2">
                                                        <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                                                        {meeting.title} (LIVE)
                                                    </h3>
                                                    <p className="text-sm text-gray-600">Started at {meeting.time} • {meeting.attendees.length} participants</p>
                                                </div>
                                                <button
                                                    onClick={() => setSelectedMeeting(meeting)}
                                                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center gap-2"
                                                >
                                                    <FaVideo /> Join Meeting
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <FaVideo className="w-24 h-24 text-gray-300 mx-auto mb-6" />
                                    <h2 className="text-2xl font-bold text-gray-800 mb-4">No Live Meetings</h2>
                                    <p className="text-gray-600">There are no active meetings at the moment</p>
                                </div>
                            )
                        )}
                    </div>
                )}

                {activeView === "history" && (
                    <div>
                        <h2 className="text-2xl font-bold mb-6">Meeting History</h2>
                        <div className="space-y-4">
                            {meetings.filter(m => m.status === "completed").map(meeting => (
                                <div key={meeting.id} className="border border-gray-200 rounded-lg p-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-semibold text-lg">{meeting.title}</h3>
                                            <p className="text-sm text-gray-600 mb-2">
                                                {meeting.date} at {meeting.time} • {meeting.duration} minutes
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                Attendees: {meeting.attendees.map(id => chamaMembers.find(m => m.id === id)?.name).join(", ")}
                                            </p>
                                        </div>
                                        <div className="flex gap-2">
                                            {meeting.recordingEnabled && (
                                                <button className="bg-blue-100 text-blue-700 px-3 py-2 rounded-lg hover:bg-blue-200 flex items-center gap-1">
                                                    <FaDownload /> Recording
                                                </button>
                                            )}
                                            {meeting.aiMinutesEnabled && (
                                                <button className="bg-purple-100 text-purple-700 px-3 py-2 rounded-lg hover:bg-purple-200 flex items-center gap-1">
                                                    <FaRobot /> AI Minutes
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            
                            {/* Sample completed meeting */}
                            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-semibold text-lg">July Monthly Review</h3>
                                        <p className="text-sm text-gray-600 mb-2">2024-07-15 at 14:00 • 90 minutes</p>
                                        <p className="text-sm text-gray-600">
                                            Attendees: John Doe, Sarah Wilson, Peter Kamau, Mary Wanjiku
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button className="bg-blue-100 text-blue-700 px-3 py-2 rounded-lg hover:bg-blue-200 flex items-center gap-1">
                                            <FaDownload /> Recording
                                        </button>
                                        <button 
                                            onClick={() => setAiMinutes(aiMinutes || "Click 'Generate Summary' to view AI-generated meeting minutes.")}
                                            className="bg-purple-100 text-purple-700 px-3 py-2 rounded-lg hover:bg-purple-200 flex items-center gap-1"
                                        >
                                            <FaRobot /> AI Minutes
                                        </button>
                                    </div>
                                </div>
                                {aiMinutes && (
                                    <div className="mt-4 p-4 bg-white rounded-lg border">
                                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                                            <FaRobot /> AI-Generated Meeting Minutes
                                        </h4>
                                        <div className="text-sm whitespace-pre-wrap text-gray-700">
                                            {aiMinutes}
                                        </div>
                                        <div className="flex gap-2 mt-3">
                                            <button 
                                                onClick={() => navigator.clipboard.writeText(aiMinutes)}
                                                className="bg-gray-100 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-200 flex items-center gap-1"
                                            >
                                                <FaCopy /> Copy
                                            </button>
                                            <button className="bg-green-100 text-green-700 px-3 py-1 rounded text-sm hover:bg-green-200 flex items-center gap-1">
                                                <FaDownload /> Download
                                            </button>
                                            <button className="bg-blue-100 text-blue-700 px-3 py-1 rounded text-sm hover:bg-blue-200 flex items-center gap-1">
                                                <FaShare /> Share
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Meeting invitation notification */}
            <div className="fixed bottom-4 right-4">
                {meetings.some(m => m.status === "live") && !selectedMeeting && (
                    <div className="bg-red-600 text-white p-4 rounded-lg shadow-lg flex items-center gap-3 animate-pulse">
                        <FaBell className="w-5 h-5" />
                        <div>
                            <p className="font-semibold">Live Meeting In Progress!</p>
                            <p className="text-sm opacity-90">Click to join the active meeting</p>
                        </div>
                        <button
                            onClick={() => {
                                const liveMeeting = meetings.find(m => m.status === "live");
                                if (liveMeeting) {
                                    setSelectedMeeting(liveMeeting);
                                    setActiveView("live");
                                }
                            }}
                            className="bg-white text-red-600 px-3 py-1 rounded text-sm hover:bg-gray-100"
                        >
                            Join
                        </button>
                    </div>
                )}
            </div>

            {showCreateMeeting && <CreateMeetingModal />}
        </div>
    );
}