import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import type { User } from '../../types';
import {ChevronDownIcon,BellIcon} from '../../shared/icons';
interface StaffHeaderProps {
    currentUser: User;
    onLogout: () => void;
}

const StaffHeader: React.FC<StaffHeaderProps> = ({ currentUser, onLogout }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
    
    const handleLogout = () => {
        onLogout();
        navigate('/login');
    };

    return (
        <header className="flex items-center justify-end h-16 px-6 bg-white border-b border-gray-200">
            <div className="flex items-center space-x-4">
                {/* Notifications */}
                <Link to="/staff/notifications" className="relative text-gray-500 hover:text-brand-dark">
                    <BellIcon className="w-6 h-6" />
                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                    </span>
                </Link>

                {/* User Menu */}
                <div className="relative" ref={menuRef}>
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="flex items-center space-x-2 text-sm font-medium text-gray-700 hover:text-brand-dark"
                    >
                        <img
                            className="w-8 h-8 rounded-full object-cover"
                            src={currentUser.profilePictureUrl}
                            alt={currentUser.name}
                        />
                        <span>{currentUser.name}</span>
                        <ChevronDownIcon className={`w-5 h-5 transition-transform ${isMenuOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isMenuOpen && (
                        <div className="absolute right-0 w-48 mt-2 py-2 bg-white rounded-md shadow-lg z-20">
                            <Link to="/staff/profile" className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setIsMenuOpen(false)}>
                                Hồ sơ của tôi
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                                Đăng xuất
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default StaffHeader;