'use client';

import React, { useCallback, useMemo } from "react";

interface SideBarProps {
    onNavigate: (item: string) => void;
    activeItem: string;
}

// Menu items configuration
const MENU_ITEMS = [
    "Dashboard",
    "Members", 
    "Contributions",
    "Loans",
    "Meetings",
    "Report"
] as const;

// Optimized menu item component
const MenuItem = React.memo<{
    item: string;
    isActive: boolean;
    onClick: (item: string) => void;
}>(({ item, isActive, onClick }) => {
    const handleClick = useCallback(() => {
        onClick(item);
    }, [item, onClick]);

    return (
        <li 
            className={`p-3 hover:bg-[#2E7D32] hover:cursor-pointer rounded-md mb-2 hover:text-white transition-colors duration-200 flex-shrink-0 ${
                isActive ? 'bg-[#2E7D32] text-white shadow-md' : 'hover:shadow-sm'
            }`}
            onClick={handleClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleClick();
                }
            }}
            aria-pressed={isActive}
        >
            <span className="font-medium select-none">{item}</span>
        </li>
    );
});

MenuItem.displayName = 'MenuItem';

export default function SideBar({ onNavigate, activeItem }: SideBarProps) {
    // Optimized navigation handler
    const handleNavigation = useCallback((item: string) => {
        onNavigate(item);
        console.log(`Navigating to ${item}`);
    }, [onNavigate]);

    // Optimized logout handler
    const handleLogout = useCallback(() => {
        console.log("Logging out...");
        // TODO: Add your logout logic here
        // - Clear authentication tokens
        // - Redirect to login page
        // - Clear local storage/session storage
    }, []);

    // Memoized menu items to prevent unnecessary re-renders
    const menuItemComponents = useMemo(() => 
        MENU_ITEMS.map((item) => (
            <MenuItem
                key={item}
                item={item}
                isActive={activeItem === item}
                onClick={handleNavigation}
            />
        )),
        [activeItem, handleNavigation]
    );

    // Memoized logout button
    const LogoutButton = useMemo(() => (
        <div 
            className="p-3 bg-gray-200 rounded-lg text-center hover:cursor-pointer hover:bg-red-600 hover:text-white transition-colors duration-200 flex-shrink-0"
            onClick={handleLogout}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleLogout();
                }
            }}
        >
            <p className="font-medium select-none">Logout</p>
        </div>
    ), [handleLogout]);

    return (
        <nav className="flex flex-col h-full bg-white min-h-0" role="navigation" aria-label="Main navigation">
            <ul className="flex flex-col mb-4 text-gray-800 flex-grow overflow-y-auto scrollbar-hide">
                {menuItemComponents}
            </ul>
            
            {LogoutButton}
        </nav>
    );
}