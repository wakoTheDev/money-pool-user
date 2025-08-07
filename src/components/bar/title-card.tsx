import React, { useState, useCallback, useRef, useEffect } from "react";
import logo2 from "@/assets/logo2.png";
import { FaSearch, FaBars } from "react-icons/fa";
import { CiSettings } from "react-icons/ci";
import { IoMdNotificationsOutline } from "react-icons/io";
import { useDebouncedSearch } from "@/hooks/useDebounce";
import { ANIMATION_DURATIONS } from "@/constants";

// Dummy data - to be replaced with database calls
const NOTIFICATION_COUNT = 4;
const SEARCH_PLACEHOLDER_DESKTOP = "Search members, transactions and more";
const SEARCH_PLACEHOLDER_MOBILE = "Search...";

export default function TitleCard() {
    const [showActionMenu, setShowActionMenu] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const menuRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);

    // Use debounced search hook
    const { debouncedValue: debouncedSearchQuery, isSearching } = useDebouncedSearch(searchQuery, 300);

    // Optimized menu toggle with useCallback to prevent unnecessary re-renders
    const toggleActionMenu = useCallback(() => {
        setShowActionMenu(prev => !prev);
    }, []);

    // Optimized search handler
    const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    }, []);

    // Handle search submit
    const handleSearchSubmit = useCallback((e: React.FormEvent) => {
        e.preventDefault();
        if (debouncedSearchQuery.trim()) {
            // TODO: Implement search functionality
            console.log('Searching for:', debouncedSearchQuery);
        }
    }, [debouncedSearchQuery]);

    // Handle notification click
    const handleNotificationClick = useCallback(() => {
        // TODO: Implement notification functionality
        console.log('Notifications clicked');
        setShowActionMenu(false);
    }, []);

    // Handle settings click
    const handleSettingsClick = useCallback(() => {
        // TODO: Implement settings functionality
        console.log('Settings clicked');
        setShowActionMenu(false);
    }, []);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setShowActionMenu(false);
            }
        };

        if (showActionMenu) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [showActionMenu]);

    // Close menu on escape key
    useEffect(() => {
        const handleEscapeKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && showActionMenu) {
                setShowActionMenu(false);
            }
        };

        document.addEventListener('keydown', handleEscapeKey);
        return () => document.removeEventListener('keydown', handleEscapeKey);
    }, [showActionMenu]);

    // Effect to handle debounced search
    useEffect(() => {
        if (debouncedSearchQuery.trim()) {
            // TODO: Implement actual search API call here
            console.log('Debounced search:', debouncedSearchQuery);
        }
    }, [debouncedSearchQuery]);

    // Memoized notification badge component
    const NotificationBadge = React.memo(() => (
        <div className="absolute -top-2 -right-2 bg-yellow-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
            {NOTIFICATION_COUNT}
        </div>
    ));

    NotificationBadge.displayName = 'NotificationBadge';

    // Memoized search input component
    const SearchInput = React.memo<{ isMobile?: boolean }>(({ isMobile = false }) => (
        <form onSubmit={handleSearchSubmit} className="flex-1">
            <div className="flex items-center border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-gray-200 focus-within:border-gray-200 transition-all duration-200">
                <FaSearch className={`h-4 w-4 text-gray-400 mr-3 ${isSearching ? 'animate-pulse' : ''}`} />
                <input
                    ref={isMobile ? searchInputRef : undefined}
                    type="search"
                    placeholder={isMobile ? SEARCH_PLACEHOLDER_MOBILE : SEARCH_PLACEHOLDER_DESKTOP}
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className={`flex-1 outline-none border-none focus:ring-0 bg-transparent ${isMobile ? 'text-sm' : ''}`}
                    autoComplete="off"
                    aria-label="Search"
                />
                {isSearching && (
                    <div className="ml-2 w-4 h-4">
                        <div className="loading-spinner w-4 h-4"></div>
                    </div>
                )}
            </div>
        </form>
    ));

    SearchInput.displayName = 'SearchInput';

    return (
        <div className="bg-white p-2 shadow-sm">
            {/* Desktop Layout */}
            <div className="hidden md:flex flex-row items-center justify-between">
                <div className="flex flex-row items-center bg-white p-2">
                    <img 
                        src={logo2.src} 
                        alt="MoneyPool Logo" 
                        className="w-16 h-16 mb-2 rounded-lg mr-2"
                        loading="eager"
                        fetchPriority="high"
                    />
                    <div className="flex flex-col items-start justify-center">
                        <h2 className="text-lg font-semibold text-gray-800 mt-8">MoneyPool</h2>
                    </div>
                </div>
                
                <div className="flex flex-row items-center justify-end gap-6 bg-white p-2">
                    <SearchInput />
                    
                    <button 
                        onClick={handleNotificationClick}
                        className="relative hover:opacity-80 transition-opacity duration-200 p-1 rounded-full hover:bg-gray-100"
                        aria-label="Notifications"
                        type="button"
                    >
                        <IoMdNotificationsOutline className="h-8 w-8" />
                        <NotificationBadge />
                    </button>
                    
                    <button 
                        onClick={handleSettingsClick}
                        className="hover:opacity-80 transition-opacity duration-200 p-1 rounded-full hover:bg-gray-100"
                        aria-label="Settings"
                        type="button"
                    >
                        <CiSettings className="h-8 w-8" />
                    </button>
                    
                    <div className="flex flex-row items-center justify-center bg-green-700 border border-green-700 rounded-full p-2 w-15 h-15 cursor-pointer hover:bg-green-800 transition-colors duration-200">
                        {/* TODO: Add user avatar/initials */}
                    </div>
                </div>
            </div>

            {/* Mobile Layout */}
            <div className="md:hidden">
                {/* Top Row: Logo, Menu Button, Avatar */}
                <div className="flex flex-row items-center justify-between mb-3">
                    {/* Logo and Text - Reduced Size */}
                    <div className="flex flex-row items-center">
                        <img 
                            src={logo2.src} 
                            alt="MoneyPool Logo" 
                            className="w-8 h-8 rounded-lg mr-2"
                            loading="eager"
                        />
                        <h2 className="text-sm font-semibold text-gray-800">MoneyPool</h2>
                    </div>

                    {/* Right Side: Dropdown Menu + Avatar */}
                    <div className="flex items-center gap-3">
                        {/* Mobile Dropdown Menu */}
                        <div className="relative" ref={menuRef}>
                            <button
                                onClick={toggleActionMenu}
                                className="flex items-center justify-center p-2 text-gray-600 hover:text-gray-800 transition-colors duration-200 rounded-full hover:bg-gray-100"
                                aria-label="Menu"
                                aria-expanded={showActionMenu}
                                type="button"
                            >
                                <FaBars className="w-4 h-4" />
                            </button>

                            {/* Dropdown Menu */}
                            {showActionMenu && (
                                <div 
                                    className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50 animate-in slide-in-from-top-2 duration-200"
                                    style={{
                                        animationDuration: `${ANIMATION_DURATIONS.normal}ms`,
                                    }}
                                >
                                    <div className="py-2">
                                        <button 
                                            onClick={handleNotificationClick}
                                            className="flex items-center gap-3 w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                                            type="button"
                                        >
                                            <IoMdNotificationsOutline className="w-5 h-5" />
                                            <span>Notifications</span>
                                            <div className="ml-auto bg-yellow-500 text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">
                                                {NOTIFICATION_COUNT}
                                            </div>
                                        </button>
                                        <button 
                                            onClick={handleSettingsClick}
                                            className="flex items-center gap-3 w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                                            type="button"
                                        >
                                            <CiSettings className="w-5 h-5" />
                                            <span>Settings</span>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Avatar - Green Circle */}
                        <div className="flex items-center justify-center bg-green-700 border border-green-700 rounded-full p-2 w-8 h-8 cursor-pointer hover:bg-green-800 transition-colors duration-200">
                            {/* TODO: Add user avatar/initials */}
                        </div>
                    </div>
                </div>

                {/* Search Bar - Aligned to the right */}
                <div className="w-full flex justify-end">
                    <div style={{ width: '80%' }}>
                        <SearchInput isMobile={true} />
                    </div>
                </div>
            </div>
        </div>
    );
}