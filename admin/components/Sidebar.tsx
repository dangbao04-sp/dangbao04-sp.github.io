import React from 'react';
import { NavLink, Link } from 'react-router-dom';

// Icons
const DashboardIcon = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>;
const UsersIcon = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197M15 21a6 6 0 004.777-10.396M12 12a4 4 0 110-8 4 4 0 010 8z" /></svg>;
const ServicesIcon = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>;
const AppointmentsIcon = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;
const PaymentsIcon = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>;
const StaffIcon = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>;
const PromotionsIcon = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2zM10 8.5a.5.5 0 11-1 0 .5.5 0 011 0zm5 5a.5.5 0 11-1 0 .5.5 0 011 0z" /></svg>;
const LoyaltyIcon = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c1.657 0 3 1.343 3 3v2a3 3 0 01-3 3m-6 0c1.657 0 3-1.343 3-3v-2a3 3 0 01-3-3m0 0a1 1 0 100-2 1 1 0 000 2zm0 8a1 1 0 100-2 1 1 0 000 2zm10-8a1 1 0 100-2 1 1 0 000 2zm0 8a1 1 0 100-2 1 1 0 000 2zM12 5V3m0 18v-2m8.05-9H2.863c-1.3 0-2.4-.95-2.613-2.235A2.99 2.99 0 012.863 5h18.174c1.3 0 2.4.95 2.613 2.235A2.99 2.99 0 0121.137 10z"/></svg>; // A simple custom icon for Loyalty
const ReportsIcon = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;
const SettingsIcon = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const ChevronDoubleLeftIcon = (p: React.SVGProps<SVGSVGElement>) => <svg {...p} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M18.75 19.5l-7.5-7.5 7.5-7.5m-6 15L5.25 12l7.5-7.5" /></svg>;
const ChevronDoubleRightIcon = (p: React.SVGProps<SVGSVGElement>) => <svg {...p} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M11.25 4.5l7.5 7.5-7.5 7.5m-6-15l7.5 7.5-7.5 7.5" /></svg>;

const navLinks = [
    { name: 'Tổng quan', path: '/admin/dashboard', icon: <DashboardIcon /> },
    { name: 'Người dùng', path: '/admin/users', icon: <UsersIcon /> },
    { name: 'Dịch vụ', path: '/admin/services', icon: <ServicesIcon /> },
    { name: 'Lịch hẹn', path: '/admin/appointments', icon: <AppointmentsIcon /> },
    { name: 'Thanh toán', path: '/admin/payments', icon: <PaymentsIcon /> },
    { name: 'Nhân viên', path: '/admin/staff', icon: <StaffIcon /> },
    { name: 'Khuyến mãi', path: '/admin/promotions', icon: <PromotionsIcon /> },
    { name: 'Cửa hàng Loyalty', path: '/admin/loyalty-shop', icon: <LoyaltyIcon /> }, // New Loyalty Shop Link
    { name: 'Báo cáo', path: '/admin/reports', icon: <ReportsIcon /> },
    { name: 'Cài đặt', path: '/admin/settings', icon: <SettingsIcon /> },
];

interface SidebarProps {
    isCollapsed: boolean;
    toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, toggleSidebar }) => {
    return (
        <aside className={`hidden md:flex flex-col bg-gray-800 transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'}`}>
            <div className="flex items-center justify-center h-20 shadow-md flex-shrink-0 px-4">
                <Link to="/" className="text-white text-2xl font-serif font-bold overflow-hidden">
                    {isCollapsed ? 'AT' : 'Anh Thơ Spa'}
                </Link>
            </div>
            
            <div className="flex flex-col flex-grow overflow-y-auto overflow-x-hidden">
                <nav className="flex-1 px-2 py-4 space-y-2">
                    {navLinks.map(link => (
                        <NavLink
                            key={link.name}
                            to={link.path}
                            end={link.path === '/admin/dashboard'}
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

export default Sidebar;