import React, { useState, useCallback, useMemo } from "react";
import { FaPlus, FaSearch, FaSort, FaSortUp, FaSortDown } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import { CiEdit } from "react-icons/ci";

// Types for better type safety
interface Member {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  status: 'Active' | 'Inactive' | 'Suspended';
  joinedDate: string;
}

interface TooltipProps {
  content: string;
  children: React.ReactNode;
}

// Optimized tooltip component
const Tooltip = React.memo<TooltipProps>(({ content, children }) => (
  <div className="relative group cursor-pointer">
    {children}
    <div className="absolute left-0 top-full mt-1 bg-gray-800 text-white px-2 py-1 text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10 pointer-events-none">
      {content}
    </div>
  </div>
));

Tooltip.displayName = 'Tooltip';

// Optimized action button component
const ActionButton = React.memo<{
  onClick: () => void;
  icon: React.ComponentType<any>;
  tooltip: string;
  variant: 'edit' | 'delete';
  'aria-label': string;
}>(({ onClick, icon: Icon, tooltip, variant, 'aria-label': ariaLabel }) => {
  const baseClasses = "relative group focus:outline-none focus:ring-2 focus:ring-offset-2 rounded p-1";
  const variantClasses = variant === 'edit' 
    ? "text-blue-500 hover:text-blue-700 focus:ring-blue-500" 
    : "text-red-500 hover:text-red-700 focus:ring-red-500";

  return (
    <button 
      className={`${baseClasses} ${variantClasses}`}
      onClick={onClick}
      aria-label={ariaLabel}
      type="button"
    >
      <Icon className="h-5 w-5 transition-colors duration-200" />
      <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-2 py-1 text-xs rounded opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
        {tooltip}
      </span>
    </button>
  );
});

ActionButton.displayName = 'ActionButton';

// Optimized status badge component
const StatusBadge = React.memo<{ status: Member['status'] }>(({ status }) => {
  const statusConfig = useMemo(() => {
    const configs = {
      Active: { bg: 'bg-green-100', text: 'text-green-800', label: 'Active member' },
      Inactive: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Inactive member' },
      Suspended: { bg: 'bg-red-100', text: 'text-red-800', label: 'Suspended member' }
    };
    return configs[status];
  }, [status]);

  return (
    <span 
      className={`px-2 py-1 ${statusConfig.bg} ${statusConfig.text} rounded-full text-xs font-medium`}
      aria-label={statusConfig.label}
      role="status"
    >
      {status}
    </span>
  );
});

StatusBadge.displayName = 'StatusBadge';

// Optimized table row component
const MemberRow = React.memo<{
  member: Member;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}>(({ member, onEdit, onDelete }) => {
  const handleEdit = useCallback(() => onEdit(member.id), [member.id, onEdit]);
  const handleDelete = useCallback(() => onDelete(member.id), [member.id, onDelete]);

  // Helper function for text truncation
  const truncateText = useCallback((text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return `${text.slice(0, Math.floor(maxLength / 2))}...${text.slice(-Math.floor(maxLength / 4))}`;
  }, []);

  return (
    <tr className="border-b border-gray-200 hover:bg-gray-50 transition-colors duration-150">
      <td className="p-3">
        <Tooltip content={member.name}>
          <span className="block truncate max-w-24">
            {truncateText(member.name, 15)}
          </span>
        </Tooltip>
      </td>
      <td className="p-3">
        <Tooltip content={member.email}>
          <span className="block truncate max-w-32">
            {truncateText(member.email, 20)}
          </span>
        </Tooltip>
      </td>
      <td className="p-3">
        <Tooltip content={member.phone}>
          <span className="block truncate max-w-20">
            {truncateText(member.phone, 12)}
          </span>
        </Tooltip>
      </td>
      <td className="p-3">
        <span className="font-medium">{member.role}</span>
      </td>
      <td className="p-3">
        <StatusBadge status={member.status} />
      </td>
      <td className="p-3">
        <Tooltip content={member.id}>
          <span className="block truncate max-w-16">
            {truncateText(member.id, 8)}
          </span>
        </Tooltip>
      </td>
      <td className="p-3">
        <Tooltip content={member.joinedDate}>
          <span className="block truncate max-w-24">
            {truncateText(member.joinedDate, 12)}
          </span>
        </Tooltip>
      </td>
      <td className="p-3">
        <div className="flex gap-2 items-center">
          <ActionButton
            onClick={handleEdit}
            icon={CiEdit}
            tooltip="Edit"
            variant="edit"
            aria-label={`Edit member ${member.name}`}
          />
          <ActionButton
            onClick={handleDelete}
            icon={MdDeleteForever}
            tooltip="Delete"
            variant="delete"
            aria-label={`Delete member ${member.name}`}
          />
        </div>
      </td>
    </tr>
  );
});

MemberRow.displayName = 'MemberRow';

// Main Members component
const Members = React.memo(() => {
  // Sample data - replace with actual data from your API/state management
  const [members] = useState<Member[]>([
    {
      id: "1",
      name: "John Doe",
      email: "johndoe@example.com",
      phone: "(123) 456-7890",
      role: "Admin",
      status: "Active",
      joinedDate: "2023-01-01"
    },
    // Add more sample data or fetch from API
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Member | null;
    direction: 'asc' | 'desc';
  }>({ key: null, direction: 'asc' });

  // Optimized handlers
  const handleSearch = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  }, []);

  const handleSort = useCallback((key: keyof Member) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  }, []);

  const handleEdit = useCallback((id: string) => {
    console.log(`Edit member ${id}`);
    // TODO: Implement edit functionality
    // - Open edit modal/form
    // - Load member data
    // - Handle form submission
  }, []);

  const handleDelete = useCallback((id: string) => {
    console.log(`Delete member ${id}`);
    // TODO: Implement delete functionality
    // - Show confirmation dialog
    // - Delete from backend
    // - Update local state
  }, []);

  const handleAddMember = useCallback(() => {
    console.log("Add new member");
    // TODO: Implement add member functionality
    // - Open add member modal/form
    // - Handle form submission
    // - Update members list
  }, []);

  // Memoized filtered and sorted members
  const processedMembers = useMemo(() => {
    let filtered = members.filter(member =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.phone.includes(searchTerm)
    );

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        const aVal = a[sortConfig.key!];
        const bVal = b[sortConfig.key!];
        
        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [members, searchTerm, sortConfig]);

  // Memoized sort icon component
  const SortIcon = useCallback(({ column }: { column: keyof Member }) => {
    if (sortConfig.key !== column) {
      return <FaSort className="inline ml-1 text-gray-400" />;
    }
    return sortConfig.direction === 'asc' 
      ? <FaSortUp className="inline ml-1 text-green-600" />
      : <FaSortDown className="inline ml-1 text-green-600" />;
  }, [sortConfig]);

  // Memoized header content
  const tableHeader = useMemo(() => (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 p-4 bg-white rounded-lg border border-gray-200">
      <div>
        <h2 className="text-xl font-semibold text-gray-800">Members Management</h2>
        <p className="text-sm text-gray-600 mt-1">
          Manage your chama members, roles, and permissions
        </p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
        <div className="relative flex-1 sm:flex-initial">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search members..."
            value={searchTerm}
            onChange={handleSearch}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E7D32] focus:border-transparent w-full sm:w-64"
            aria-label="Search members by name, email, or phone"
          />
        </div>
        
        <button
          onClick={handleAddMember}
          className="flex items-center gap-2 px-4 py-2 bg-[#2E7D32] text-white rounded-lg hover:bg-[#1B5E20] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#2E7D32] focus:ring-offset-2"
          aria-label="Add new member"
        >
          <FaPlus className="h-4 w-4" />
          <span className="font-medium">Add Member</span>
        </button>
      </div>
    </div>
  ), [searchTerm, handleSearch, handleAddMember]);

  // Memoized table content
  const tableContent = useMemo(() => (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px]" role="table" aria-label="Members table">
          <thead className="bg-green-700 text-white">
            <tr>
              {[
                { key: 'name', label: 'Name', width: 'w-1/8' },
                { key: 'email', label: 'Email', width: 'w-1/4' },
                { key: 'phone', label: 'Phone', width: 'w-1/8' },
                { key: 'role', label: 'Role', width: 'w-1/8' },
                { key: 'status', label: 'Status', width: 'w-1/8' },
                { key: 'id', label: 'ID', width: 'w-1/12' },
                { key: 'joinedDate', label: 'Joined Date', width: 'w-1/8' },
              ].map(({ key, label, width }) => (
                <th 
                  key={key}
                  className={`p-3 text-left border border-white ${width} cursor-pointer hover:bg-green-800 transition-colors duration-150`}
                  onClick={() => handleSort(key as keyof Member)}
                  tabIndex={0}
                  role="columnheader"
                  aria-sort={
                    sortConfig.key === key 
                      ? sortConfig.direction === 'asc' ? 'ascending' : 'descending'
                      : 'none'
                  }
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleSort(key as keyof Member);
                    }
                  }}
                >
                  <div className="flex items-center font-medium">
                    {label}
                    <SortIcon column={key as keyof Member} />
                  </div>
                </th>
              ))}
              <th className="p-3 text-left border border-white w-1/8">
                <span className="font-medium">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {processedMembers.length > 0 ? (
              processedMembers.map((member) => (
                <MemberRow
                  key={member.id}
                  member={member}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))
            ) : (
              <tr>
                <td colSpan={8} className="p-8 text-center text-gray-500">
                  <div className="flex flex-col items-center gap-2">
                    <p className="text-lg font-medium">No members found</p>
                    <p className="text-sm">
                      {searchTerm ? "Try adjusting your search terms" : "Add your first member to get started"}
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Results summary */}
      <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
        <p className="text-sm text-gray-600">
          Showing {processedMembers.length} of {members.length} member{members.length !== 1 ? 's' : ''}
          {searchTerm && ` matching "${searchTerm}"`}
        </p>
      </div>
    </div>
  ), [processedMembers, members.length, searchTerm, handleSort, handleEdit, handleDelete, SortIcon]);

  return (
    <div className="w-full h-full p-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {tableHeader}
        {tableContent}
      </div>
    </div>
  );
});

Members.displayName = 'Members';

export default Members;