import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import StaffSidebar from './StaffSidebar';
import StaffHeader from './StaffHeader';
import type { User } from '../../types';

interface StaffLayoutProps {
    currentUser: User;
    onLogout: () => void;
}

const StaffLayout: React.FC<StaffLayoutProps> = ({ currentUser, onLogout }) => {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const toggleSidebar = () => setIsSidebarCollapsed(!isSidebarCollapsed);

    return (
        <div className="flex h-screen bg-gray-100 font-sans">
            <StaffSidebar isCollapsed={isSidebarCollapsed} toggleSidebar={toggleSidebar} currentUser={currentUser} />
            <div className="flex-1 flex flex-col overflow-hidden">
                <StaffHeader currentUser={currentUser} onLogout={onLogout} />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
                    <div className="container mx-auto px-6 py-8">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default StaffLayout;