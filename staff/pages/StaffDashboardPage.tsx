import React, { useMemo } from 'react';
import { MOCK_APPOINTMENTS, MOCK_USERS, MOCK_SERVICES, MOCK_STAFF_TIERS, MOCK_INTERNAL_NOTIFICATIONS } from '../../constants';
import type { User, Appointment, StaffTier, InternalNotification } from '../../types';
import { UserCircleIcon, CalendarIcon, ClockIcon, StarIcon, BellIcon, ChartBarIcon } from '../../shared/icons';
// --- ICONS ---

interface StaffDashboardPageProps {
    currentUser: User;
}

const StaffDashboardPage: React.FC<StaffDashboardPageProps> = ({ currentUser }) => {
    const today = new Date().toISOString().split('T')[0];

    const todayAppointments = useMemo(() => {
        return MOCK_APPOINTMENTS.filter(
            app => app.therapistId === currentUser.id && app.date === today && app.status !== 'cancelled'
        ).sort((a, b) => a.time.localeCompare(b.time));
    }, [currentUser.id, today]);

    const stats = useMemo(() => {
        const staffAppointments = MOCK_APPOINTMENTS.filter(app => app.therapistId === currentUser.id && app.status === 'completed');
        
        const sessionsThisWeek = staffAppointments.filter(app => {
            const appDate = new Date(app.date);
            const now = new Date();
            const firstDayOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + (now.getDay() === 0 ? -6 : 1))); // Monday
            firstDayOfWeek.setHours(0,0,0,0);
            const lastDayOfWeek = new Date(firstDayOfWeek);
            lastDayOfWeek.setDate(firstDayOfWeek.getDate() + 6);
            lastDayOfWeek.setHours(23,59,59,999);
            return appDate >= firstDayOfWeek && appDate <= lastDayOfWeek;
        }).length;

        const sessionsThisMonth = staffAppointments.filter(app => {
            const appDate = new Date(app.date);
            const now = new Date();
            return appDate.getMonth() === now.getMonth() && appDate.getFullYear() === now.getFullYear();
        }).length;

        const totalRevenue = staffAppointments.reduce((sum, app) => {
            const service = MOCK_SERVICES.find(s => s.id === app.serviceId);
            return sum + (service?.price || 0);
        }, 0);

        // FIX: Added commission calculation.
        const commission = totalRevenue * (currentUser.commissionRate || 0);

        // Mock average rating from MOCK_USERS / MOCK_THERAPISTS
        const staffInTherapistList = MOCK_USERS.find(u => u.id === currentUser.id);
        const averageRating = staffInTherapistList?.selfCareIndex ? (staffInTherapistList.selfCareIndex / 100) * 5 : 4.5; // Using selfCareIndex as a mock rating
        const reviewCount = staffInTherapistList?.loginHistory?.length || 0; // Mock review count

        return { sessionsThisWeek, sessionsThisMonth, totalRevenue, commission, averageRating, reviewCount };
    }, [currentUser.id, currentUser.commissionRate, currentUser.selfCareIndex]);

    const newNotifications = useMemo(() => {
        return MOCK_INTERNAL_NOTIFICATIONS.filter(
            notif => (notif.recipientId === currentUser.id || notif.recipientType === 'all') && !notif.isRead
        ).slice(0, 3); // Show top 3 unread
    }, [currentUser.id]);

    const staffTier: StaffTier | undefined = useMemo(() => {
        // Assuming staffTier is directly on currentUser now, or derive from a specific logic if needed
        return MOCK_STAFF_TIERS.find(tier => tier.id === currentUser.staffTier);
    }, [currentUser.staffTier]);


    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Chào mừng, {currentUser.name}!</h1>
            <p className="text-gray-600 mb-8">Bạn đang ở vai trò <span className="font-semibold text-brand-primary">{currentUser.role}</span>.</p>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Personal Info Card */}
                <div className="bg-white p-6 rounded-lg shadow-sm flex items-center gap-4">
                    <img src={currentUser.profilePictureUrl} alt={currentUser.name} className="w-16 h-16 rounded-full object-cover border-2 border-brand-primary/50" />
                    <div>
                        <p className="text-lg font-bold text-gray-800">{currentUser.name}</p>
                        <p className="text-sm text-gray-500">{currentUser.email}</p>
                        {staffTier && (
                            <p className="text-sm mt-1 font-semibold" style={{color: staffTier.color}}>{staffTier.name}</p>
                        )}
                    </div>
                </div>

                {/* Performance Stats */}
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2"><ChartBarIcon className="w-5 h-5 text-brand-primary"/> Hiệu suất của bạn</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <p className="font-medium text-gray-500">Số buổi phục vụ</p>
                            <p className="font-bold text-gray-800 text-xl">{stats.sessionsThisMonth}</p>
                        </div>
                        <div>
                            <p className="font-medium text-gray-500">Đánh giá trung bình</p>
                            <p className="font-bold text-yellow-500 text-xl flex items-center">{stats.averageRating.toFixed(1)} <StarIcon className="w-4 h-4 ml-1" /></p>
                        </div>
                        <div>
                            <p className="font-medium text-gray-500">Tổng doanh thu</p>
                            <p className="font-bold text-green-600 text-xl">{formatCurrency(stats.totalRevenue)}</p>
                        </div>
                        <div>
                            <p className="font-medium text-gray-500">Hoa hồng cá nhân</p>
                            <p className="font-bold text-purple-600 text-xl">{formatCurrency(stats.commission)}</p>
                        </div>
                    </div>
                </div>

                {/* Notifications */}
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2"><BellIcon className="w-5 h-5 text-red-500"/> Thông báo mới</h3>
                    {newNotifications.length > 0 ? (
                        <ul className="space-y-3">
                            {newNotifications.map(notif => (
                                <li key={notif.id} className="text-sm text-gray-700 border-l-4 border-red-400 pl-3">
                                    <p className="font-medium">{notif.message}</p>
                                    <p className="text-xs text-gray-500">{new Date(notif.date).toLocaleDateString('vi-VN')}</p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-sm text-gray-500 italic">Không có thông báo mới.</p>
                    )}
                </div>
            </div>

            {/* Today's Appointments */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2"><CalendarIcon className="w-5 h-5 text-blue-500"/> Lịch hẹn hôm nay ({new Date().toLocaleDateString('vi-VN')})</h3>
                {todayAppointments.length > 0 ? (
                    <div className="space-y-4">
                        {todayAppointments.map(app => {
                            const client = MOCK_USERS.find(u => u.id === app.userId);
                            const service = MOCK_SERVICES.find(s => s.id === app.serviceId);
                            return (
                                <div key={app.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-md border-l-4 border-blue-300">
                                    <div>
                                        <p className="font-bold text-gray-800">{app.time} - {service?.name}</p>
                                        <p className="text-sm text-gray-600">Khách hàng: {client?.name}</p>
                                        {app.room && <p className="text-xs text-gray-500">Phòng: {app.room}</p>}
                                    </div>
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${app.status === 'upcoming' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                        {app.status === 'upcoming' ? 'Đã xác nhận' : 'Chờ khách'}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <p className="text-gray-500 italic">Không có lịch hẹn nào cho hôm nay.</p>
                )}
            </div>
        </div>
    );
};

export default StaffDashboardPage;