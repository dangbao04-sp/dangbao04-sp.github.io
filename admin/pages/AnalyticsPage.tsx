
import React, { useState, useEffect, useMemo } from 'react';
import { MOCK_USERS, MOCK_APPOINTMENTS, MOCK_SERVICES, MOCK_REVIEWS, MOCK_PROMOTIONS } from '../../constants';
import type { User, Appointment, Service, Review } from '../../types';
import { CurrencyDollarIcon, UsersIcon, CalendarIcon, ChatBubbleLeftRightIcon,
  TrendingUpIcon, SparklesIcon, ShieldExclamationIcon, StarIcon } from '../../shared/icons';

// --- SUB-COMPONENTS ---
const StatCard = ({ title, value, icon, change, changeType }: { title: string; value: string; icon: React.ReactNode; change?: string; changeType?: 'increase' | 'decrease' }) => (
    <div className="bg-white p-6 rounded-lg shadow-sm transition-all hover:shadow-lg hover:-translate-y-1">
        <div className="flex items-center justify-between">
            <div>
                <p className="text-sm font-medium text-gray-500 uppercase">{title}</p>
                <p className="text-3xl font-bold text-gray-800 mt-1">{value}</p>
            </div>
            <div className="text-brand-primary p-3 bg-brand-secondary rounded-full">{icon}</div>
        </div>
        {change && (
            <p className={`mt-2 text-xs flex items-center ${changeType === 'increase' ? 'text-green-600' : 'text-red-600'}`}>
                 <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d={changeType === 'increase' ? "M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" : "M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z"} clipRule="evenodd" /></svg>
                {change} so với tháng trước
            </p>
        )}
    </div>
);

const useCountdown = (targetDateTime: Date) => {
    const [timeLeft, setTimeLeft] = useState(targetDateTime.getTime() - new Date().getTime());

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(targetDateTime.getTime() - new Date().getTime());
        }, 1000);

        return () => clearInterval(timer);
    }, [targetDateTime]);

    const format = (ms: number) => {
        if (ms < 0) return { h: '00', m: '00', s: '00' };
        const totalSeconds = Math.floor(ms / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        return {
            h: String(hours).padStart(2, '0'),
            m: String(minutes).padStart(2, '0'),
            s: String(seconds).padStart(2, '0')
        };
    };

    return format(timeLeft);
};

const AnalyticsPage: React.FC = () => {
    // --- DATA CALCULATION ---
    const stats = useMemo(() => {
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();
        const todayStr = now.toISOString().split('T')[0];

        const totalRevenue = MOCK_APPOINTMENTS.filter(a => a.status === 'completed').reduce((sum, app) => {
            const service = MOCK_SERVICES.find(s => s.id === app.serviceId);
            return sum + (service?.price || 0);
        }, 0);

        const newCustomersThisMonth = MOCK_USERS.filter(u => {
            const joinDate = new Date(u.joinDate);
            return joinDate.getMonth() === currentMonth && joinDate.getFullYear() === currentYear;
        }).length;

        const appointmentsToday = MOCK_APPOINTMENTS.filter(a => a.date === todayStr).length;

        const newFeedback = MOCK_REVIEWS.length; // Assuming all are new for this mock

        return { totalRevenue, newCustomersThisMonth, appointmentsToday, newFeedback };
    }, []);

    const nextAppointment = useMemo(() => {
        const upcoming = MOCK_APPOINTMENTS
            .filter(a => a.status === 'upcoming' && new Date(`${a.date}T${a.time}`) > new Date())
            .sort((a, b) => new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime());
        return upcoming[0] || null;
    }, []);

    const countdown = useCountdown(nextAppointment ? new Date(`${nextAppointment.date}T${nextAppointment.time}`) : new Date());

    const topServices = useMemo(() => {
        const serviceCounts = MOCK_APPOINTMENTS.reduce((acc, app) => {
            acc[app.serviceId] = (acc[app.serviceId] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);
        return Object.entries(serviceCounts)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 3)
            .map(([id, count]) => ({
                service: MOCK_SERVICES.find(s => s.id === id)!,
                count
            }));
    }, []);
    
    const topCustomers = useMemo(() => {
        const customerCounts = MOCK_APPOINTMENTS.reduce((acc, app) => {
            if (app.status === 'completed') {
                acc[app.userId] = (acc[app.userId] || 0) + 1;
            }
            return acc;
        }, {} as Record<string, number>);
        return Object.entries(customerCounts)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 3)
            .map(([id, count]) => ({
                user: MOCK_USERS.find(u => u.id === id)!,
                count
            }));
    }, []);
    
    const serviceDistribution = useMemo(() => {
        const categoryCounts = MOCK_APPOINTMENTS.reduce((acc, app) => {
            const service = MOCK_SERVICES.find(s => s.id === app.serviceId);
            if(service) {
                acc[service.category] = (acc[service.category] || 0) + 1;
            }
            return acc;
        }, {} as Record<string, number>);
        const total = Object.values(categoryCounts).reduce((sum, count) => sum + count, 0);
        return Object.entries(categoryCounts).map(([name, count]) => ({
            name,
            percentage: (count / total) * 100,
        }));
    }, []);

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Bảng điều khiển tổng quan</h1>
            
            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard title="Tổng doanh thu" value={new Intl.NumberFormat('vi-VN').format(stats.totalRevenue) + 'đ'} icon={<CurrencyDollarIcon className="w-8 h-8"/>} change="+5.4%" changeType="increase"/>
                <StatCard title="Khách hàng mới" value={`+${stats.newCustomersThisMonth}`} icon={<UsersIcon className="w-8 h-8"/>} change="+12.1%" changeType="increase"/>
                <StatCard title="Lịch hẹn hôm nay" value={`${stats.appointmentsToday}`} icon={<CalendarIcon className="w-8 h-8"/>} />
                <StatCard title="Phản hồi mới" value={`${stats.newFeedback}`} icon={<ChatBubbleLeftRightIcon className="w-8 h-8"/>} change="-2.8%" changeType="decrease"/>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
                {/* Main Dashboard Column */}
                <div className="xl:col-span-2 flex flex-col gap-6">
                    <div className="p-6 bg-white rounded-lg shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-700 flex items-center mb-4"><TrendingUpIcon className="w-6 h-6 mr-2 text-brand-primary"/>Doanh thu theo tháng</h3>
                         <div className="h-64 flex items-center justify-center text-gray-400 italic">Biểu đồ đang được cập nhật...</div>
                    </div>
                     <div className="p-6 bg-white rounded-lg shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-700 flex items-center mb-4">Phân bổ dịch vụ</h3>
                         <div className="h-48 flex items-center justify-center text-gray-400 italic">Biểu đồ đang được cập nhật...</div>
                    </div>
                </div>

                {/* Right Sidebar Column */}
                <div className="flex flex-col gap-6">
                    {nextAppointment && (
                        <div className="p-6 bg-white rounded-lg shadow-sm bg-gradient-to-br from-brand-primary to-brand-dark text-white">
                             <h3 className="font-semibold text-lg flex items-center mb-2">Lịch hẹn kế tiếp</h3>
                             <div className="text-center my-4">
                                <span className="text-4xl font-mono font-bold">{countdown.h}:{countdown.m}:{countdown.s}</span>
                             </div>
                             <div className="text-sm bg-white/20 p-3 rounded-md">
                                <p className="font-bold">{MOCK_USERS.find(u => u.id === nextAppointment.userId)?.name}</p>
                                <p>{nextAppointment.serviceName}</p>
                                <p className="font-light">{nextAppointment.therapist}</p>
                             </div>
                        </div>
                    )}
                    <div className="p-6 bg-white rounded-lg shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-700 flex items-center mb-4"><SparklesIcon className="w-6 h-6 mr-2 text-yellow-500"/>AI Gợi Ý</h3>
                        <ul className="text-sm text-gray-600 space-y-3">
                            <li className="p-3 bg-blue-50 rounded-md border-l-4 border-blue-400"><strong>Gợi ý:</strong> Khung giờ 14h-16h đang có ít lịch hẹn, cân nhắc tạo ưu đãi flash sale.</li>
                            <li className="p-3 bg-yellow-50 rounded-md border-l-4 border-yellow-400"><strong>Phân tích:</strong> Dịch vụ "Massage Cổ Vai Gáy" đang có tỷ lệ đặt lại cao nhất (75%).</li>
                        </ul>
                    </div>
                     <div className="p-6 bg-white rounded-lg shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-700 flex items-center mb-4">Cảnh báo quan trọng</h3>
                         <ul className="text-sm text-gray-600 space-y-3">
                            <li className="p-3 bg-red-50 rounded-md border-l-4 border-red-400 flex items-start gap-2">
                                <ShieldExclamationIcon className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5"/>
                                <span>Có 1 đánh giá 1 sao mới cho dịch vụ "Sơn Gel". Cần xem xét phản hồi.</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-white rounded-lg shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Top dịch vụ hot</h3>
                    <ul className="space-y-3 text-sm">
                        {topServices.map(({service, count}) => (
                             <li key={service.id} className="flex justify-between items-center">
                                <span className="font-medium text-gray-700">{service.name}</span>
                                <span className="font-bold text-brand-primary">{count} lượt</span>
                            </li>
                        ))}
                    </ul>
                </div>
                 <div className="p-6 bg-white rounded-lg shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Khách hàng thân thiết</h3>
                    <ul className="space-y-3 text-sm">
                         {topCustomers.map(({user, count}) => (
                             <li key={user.id} className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <img src={user.profilePictureUrl} alt={user.name} className="w-8 h-8 rounded-full object-cover"/>
                                    <span className="font-medium text-gray-700">{user.name}</span>
                                </div>
                                <span className="font-bold text-brand-primary">{count} lần</span>
                            </li>
                        ))}
                    </ul>
                </div>
                 <div className="p-6 bg-white rounded-lg shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Đánh giá mới</h3>
                    <ul className="space-y-4 text-sm">
                         {MOCK_REVIEWS.slice(0, 2).map(review => (
                             <li key={review.id}>
                                <div className="flex justify-between items-center">
                                    <p className="font-medium text-gray-800">{review.userName}</p>
                                    <div className="flex text-yellow-400">
                                        {[...Array(review.rating)].map((_, i) => <StarIcon key={i} className="w-4 h-4"/>)}
                                    </div>
                                </div>
                                <p className="text-gray-500 italic mt-1">"{review.comment}"</p>
                            </li>
                         ))}
                    </ul>
                </div>
            </div>

        </div>
    );
};

export default AnalyticsPage;