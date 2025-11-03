
import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import type { User, UserRole } from '../../types';
import {DashboardIcon,CalendarIcon,AppointmentsIcon,TreatmentIcon,
    CustomerInteractionIcon,RewardsIcon,UpsellingIcon,ReportsIcon ,
    NotificationsIcon ,ProfileIcon ,TransactionHistoryIcon,
    ChevronDoubleLeftIcon, ChevronDoubleRightIcon
} from '../../shared/icons';
// Icons for Staff Portal

interface StaffSidebarProps {
    isCollapsed: boolean;
    toggleSidebar: () => void;
    currentUser: User;
}

const StaffSidebar: React.FC<StaffSidebarProps> = ({ isCollapsed, toggleSidebar, currentUser }) => {
    // Define links based on user role if necessary
    const getNavLinks = (userRole: UserRole) => {
        const baseLinks = [
            { name: 'Tổng quan', path: '/staff/dashboard', icon: <DashboardIcon /> },
            { name: 'Lịch làm việc', path: '/staff/schedule', icon: <CalendarIcon /> },
            { name: 'Lịch hẹn cá nhân', path: '/staff/appointments', icon: <AppointmentsIcon /> },
            { name: 'Liệu trình khách hàng', path: '/staff/treatment-progress', icon: <TreatmentIcon /> },
            { name: 'Tư vấn KH', path: '/staff/customer-interaction', icon: <CustomerInteractionIcon /> },
            { name: 'Điểm thưởng cá nhân', path: '/staff/rewards', icon: <RewardsIcon /> },
            { name: 'Bán thêm sản phẩm', path: '/staff/upselling', icon: <UpsellingIcon /> },
            { name: 'Thống kê cá nhân', path: '/staff/personal-reports', icon: <ReportsIcon /> },
            { name: 'Thông báo & Tin nội bộ', path: '/staff/notifications', icon: <NotificationsIcon /> },
            { name: 'Hồ sơ cá nhân', path: '/staff/profile', icon: <ProfileIcon /> },
            { name: 'Lịch sử giao dịch', path: '/staff/transaction-history', icon: <TransactionHistoryIcon /> },
        ];

        // Example: Only Technicians can manage treatment progress
        if (userRole !== 'Technician') {
            // baseLinks = baseLinks.filter(link => link.path !== '/staff/treatment-progress');
        }

        return baseLinks;
    };

    const navLinks = getNavLinks(currentUser.role);

    return (
        <aside className={`hidden md:flex flex-col bg-gray-800 transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'}`}>
            <div className="flex items-center justify-center h-20 shadow-md flex-shrink-0 px-4">
                <Link to="/staff/dashboard" className="text-white text-2xl font-serif font-bold overflow-hidden">
                    {isCollapsed ? 'AT' : 'Anh Thơ Staff'}
                </Link>
            </div>
            
            <div className="flex flex-col flex-grow overflow-y-auto overflow-x-hidden">
                <nav className="flex-1 px-2 py-4 space-y-2">
                    {navLinks.map(link => (
                        <NavLink
                            key={link.name}
                            // FIX: Ensure all NavLink `to` props are absolute paths.
                            to={link.path}
                            end={link.path === '/staff/dashboard'}
                            className={({ isActive }) =>
                                `flex items-center px-4 py-2 text-gray-100 transition-colors duration-200 transform rounded-md hover:bg-gray-700 hover:text-white ${isActive ? 'bg-gray-700' : ''} ${isCollapsed ? 'justify-center' : ''}`
                            }
                            title={isCollapsed ? link.name : undefined}
                        >
                            <span className="flex-shrink-0">{link.icon}</span>
                            {!isCollapsed && <span className="mx-4 font-medium">{link.name}</span>}
                        </NavLink>
                    ))}
                </nav>

                <div className="px-2 py-4 flex-shrink-0">
                    <button
                        onClick={toggleSidebar}
                        className="flex items-center w-full px-4 py-2 text-gray-100 transition-colors duration-200 transform rounded-md hover:bg-gray-700 hover:text-white"
                        title={isCollapsed ? 'Mở rộng' : 'Thu gọn'}
                    >
                       <span className="flex-shrink-0">
                        {isCollapsed ? <ChevronDoubleRightIcon className="w-5 h-5" /> : <ChevronDoubleLeftIcon className="w-5 h-5" />}
                       </span>
                        {!isCollapsed && <span className="mx-4 font-medium">Thu gọn</span>}
                    </button>
                </div>
            </div>
        </aside>
    );
};

export default StaffSidebar;