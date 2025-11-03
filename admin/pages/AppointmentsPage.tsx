
import React, { useState, useMemo, useEffect } from 'react';
import { MOCK_APPOINTMENTS, MOCK_USERS, MOCK_SERVICES, MOCK_THERAPISTS } from '../../constants';
import type { Appointment, User, Service, Therapist } from '../../types';
// --- ICONS ---
import {CalendarIcon,CheckCircleIcon,XCircleIcon,ClockIcon,
    ChevronLeftIcon,ChevronRightIcon,ShieldExclamationIcon
} from '../../shared/icons';



const STATUS_CONFIG: Record<Appointment['status'], { text: string; color: string; bgColor: string; }> = {
    pending: { text: 'Chờ xác nhận', color: 'text-yellow-800', bgColor: 'bg-yellow-100' },
    upcoming: { text: 'Đã xác nhận', color: 'text-green-800', bgColor: 'bg-green-100' },
    completed: { text: 'Hoàn thành', color: 'text-blue-800', bgColor: 'bg-blue-100' },
    cancelled: { text: 'Đã hủy', color: 'text-red-800', bgColor: 'bg-red-100' },
    // FIX: Added 'in-progress' status
    'in-progress': { text: 'Đang tiến hành', color: 'text-purple-800', bgColor: 'bg-purple-100' },
};

const StatCard: React.FC<{ title: string; value: number; icon: React.ReactNode; color: string }> = ({ title, value, icon, color }) => (
    <div className="bg-white p-4 rounded-lg shadow-sm flex items-center gap-4">
        <div className={`p-3 rounded-full ${color}`}>{icon}</div>
        <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
    </div>
);

type View = 'month' | 'week' | 'day';

const AdminAppointmentsPage: React.FC = () => {
    const [appointments, setAppointments] = useState<Appointment[]>(MOCK_APPOINTMENTS);
    const [view, setView] = useState<View>('month');
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

    // Filters
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStaff, setFilterStaff] = useState('all');
    const [filterService, setFilterService] = useState('all');
    const [filterStatus, setFilterStatus] = useState<Appointment['status'] | 'all'>('all');

    const stats = useMemo(() => ({
        pending: appointments.filter(a => a.status === 'pending').length,
        upcoming: appointments.filter(a => a.status === 'upcoming').length,
        completed: appointments.filter(a => a.status === 'completed').length,
        cancelled: appointments.filter(a => a.status === 'cancelled').length,
    }), [appointments]);

    const handleAction = (id: string, newStatus: Appointment['status']) => {
        setAppointments(prev => prev.map(app => app.id === id ? { ...app, status: newStatus } : app));
        setSelectedAppointment(null);
    };

    const calendarHeader = useMemo(() => {
        if (view === 'month') return currentDate.toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' });
        if (view === 'week') {
            const startOfWeek = new Date(currentDate);
            startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
            const endOfWeek = new Date(startOfWeek);
            endOfWeek.setDate(startOfWeek.getDate() + 6);
            return `${startOfWeek.toLocaleDateString('vi-VN')} - ${endOfWeek.toLocaleDateString('vi-VN')}`;
        }
        return currentDate.toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    }, [view, currentDate]);

    const changeDate = (amount: number) => {
        const newDate = new Date(currentDate);
        if (view === 'month') newDate.setMonth(currentDate.getMonth() + amount);
        else if (view === 'week') newDate.setDate(currentDate.getDate() + (amount * 7));
        else newDate.setDate(currentDate.getDate() + amount);
        setCurrentDate(newDate);
    };

    const renderCalendarView = () => {
        // This is a simplified placeholder for a full calendar view
        // A real implementation would involve complex grid calculations
        const filtered = appointments.filter(a => {
            const user = MOCK_USERS.find(u => u.id === a.userId);
            const searchMatch = searchTerm === '' ||
                a.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (user && user.name.toLowerCase().includes(searchTerm.toLowerCase()));
            const staffMatch = filterStaff === 'all' || a.therapistId === filterStaff;
            const serviceMatch = filterService === 'all' || a.serviceId === filterService;
            const statusMatch = filterStatus === 'all' || a.status === filterStatus;
            
            const appDate = new Date(`${a.date}T${a.time}`);
            let dateMatch = true;
            if (view === 'day') {
                dateMatch = appDate.toDateString() === currentDate.toDateString();
            } else if (view === 'week') {
                const startOfWeek = new Date(currentDate);
                startOfWeek.setDate(currentDate.getDate() - currentDate.getDay() + (currentDate.getDay() === 0 ? -6 : 1)); // Monday
                startOfWeek.setHours(0,0,0,0);
                const endOfWeek = new Date(startOfWeek);
                endOfWeek.setDate(startOfWeek.getDate() + 6);
                endOfWeek.setHours(23,59,59,999);
                dateMatch = appDate >= startOfWeek && appDate <= endOfWeek;
            } else if (view === 'month') {
                dateMatch = appDate.getMonth() === currentDate.getMonth() && appDate.getFullYear() === currentDate.getFullYear();
            }

            return searchMatch && staffMatch && serviceMatch && statusMatch && dateMatch;
        });

        return (
            <div className="space-y-4">
                {filtered.length > 0 ? filtered.map(app => (
                    <div key={app.id} onClick={() => setSelectedAppointment(app)} className={`p-3 rounded-lg cursor-pointer transition-shadow hover:shadow-md ${STATUS_CONFIG[app.status].bgColor}`}>
                        <div className="flex justify-between items-center">
                            <div>
                                <p className={`font-bold text-sm ${STATUS_CONFIG[app.status].color}`}>{app.time} - {app.serviceName}</p>
                                <p className="text-xs text-gray-600">Khách: {MOCK_USERS.find(u => u.id === app.userId)?.name}</p>
                                {app.therapist && <p className="text-xs text-gray-600">KTV: {app.therapist}</p>}
                            </div>
                            <div className={`text-xs font-semibold px-2 py-1 rounded-full ${STATUS_CONFIG[app.status].bgColor} ${STATUS_CONFIG[app.status].color}`}>{STATUS_CONFIG[app.status].text}</div>
                        </div>
                    </div>
                )) : <p className="text-center text-gray-500 py-8">Không có lịch hẹn nào.</p>}
            </div>
        );
    };


    return (
        <div>
            {selectedAppointment && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedAppointment(null)}>
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full" onClick={e => e.stopPropagation()}>
                        <div className="p-6">
                            <h3 className="text-xl font-bold text-gray-800 mb-4">Chi tiết lịch hẹn</h3>
                            <div className="space-y-2 text-sm">
                                <p><strong>Dịch vụ:</strong> {selectedAppointment.serviceName}</p>
                                <p><strong>Khách hàng:</strong> {MOCK_USERS.find(u => u.id === selectedAppointment.userId)?.name}</p>
                                <p><strong>Thời gian:</strong> {selectedAppointment.time}, {new Date(selectedAppointment.date).toLocaleDateString('vi-VN')}</p>
                                <p><strong>Kỹ thuật viên:</strong> {selectedAppointment.therapist || 'Chưa phân công'}</p>
                                <p><strong>Trạng thái:</strong> <span className={`font-semibold ${STATUS_CONFIG[selectedAppointment.status].color}`}>{STATUS_CONFIG[selectedAppointment.status].text}</span></p>
                            </div>
                        </div>
                        <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 rounded-b-lg">
                            {selectedAppointment.status === 'pending' && <button onClick={() => handleAction(selectedAppointment.id, 'upcoming')} className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 text-sm font-semibold">Xác nhận</button>}
                            {selectedAppointment.status !== 'cancelled' && <button onClick={() => handleAction(selectedAppointment.id, 'cancelled')} className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 text-sm font-semibold">Hủy lịch</button>}
                            <button onClick={() => setSelectedAppointment(null)} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 text-sm font-semibold">Đóng</button>
                        </div>
                    </div>
                </div>
            )}

            <h1 className="text-3xl font-bold text-gray-800 mb-6">Quản lý Lịch hẹn</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <StatCard title="Chờ xác nhận" value={stats.pending} icon={<ClockIcon className="w-6 h-6" />} color="bg-yellow-100 text-yellow-600" />
                <StatCard title="Đã xác nhận" value={stats.upcoming} icon={<CalendarIcon className="w-6 h-6" />} color="bg-green-100 text-green-600" />
                <StatCard title="Hoàn thành" value={stats.completed} icon={<CheckCircleIcon className="w-6 h-6" />} color="bg-blue-100 text-blue-600" />
                <StatCard title="Đã hủy" value={stats.cancelled} icon={<XCircleIcon className="w-6 h-6" />} color="bg-red-100 text-red-600" />
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <input type="text" placeholder="Tìm kiếm..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full p-2 border rounded-md" />
                    <select value={filterStaff} onChange={e => setFilterStaff(e.target.value)} className="w-full p-2 border rounded-md bg-white">
                        <option value="all">Tất cả nhân viên</option>
                        {MOCK_THERAPISTS.filter(t=>t.id !== 'any').map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                    </select>
                    <select value={filterService} onChange={e => setFilterService(e.target.value)} className="w-full p-2 border rounded-md bg-white">
                        <option value="all">Tất cả dịch vụ</option>
                        {MOCK_SERVICES.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                     <select value={filterStatus} onChange={e => setFilterStatus(e.target.value as any)} className="w-full p-2 border rounded-md bg-white">
                        <option value="all">Tất cả trạng thái</option>
                        {Object.entries(STATUS_CONFIG).map(([key, {text}]) => <option key={key} value={key}>{text}</option>)}
                    </select>
                </div>
            </div>
            
             <div className="bg-white rounded-lg shadow-sm">
                <div className="p-4 flex justify-between items-center border-b">
                    <div className="flex items-center gap-2">
                        <button onClick={() => changeDate(-1)}><ChevronLeftIcon className="w-6 h-6 text-gray-500" /></button>
                        <h2 className="text-lg font-bold text-gray-800 w-64 text-center capitalize">{calendarHeader}</h2>
                        <button onClick={() => changeDate(1)}><ChevronRightIcon className="w-6 h-6 text-gray-500" /></button>
                    </div>
                    <div className="flex items-center bg-gray-100 rounded-lg p-1">
                        <button onClick={() => setView('month')} className={`px-3 py-1 text-sm rounded-md ${view === 'month' ? 'bg-white shadow' : ''}`}>Tháng</button>
                        <button onClick={() => setView('week')} className={`px-3 py-1 text-sm rounded-md ${view === 'week' ? 'bg-white shadow' : ''}`}>Tuần</button>
                        <button onClick={() => setView('day')} className={`px-3 py-1 text-sm rounded-md ${view === 'day' ? 'bg-white shadow' : ''}`}>Ngày</button>
                    </div>
                </div>
                <div className="p-4">
                    {renderCalendarView()}
                </div>
            </div>
            
            <div className="mt-6 bg-blue-50 border-l-4 border-blue-400 text-blue-800 p-4 rounded-md">
                <div className="flex">
                    <div className="py-1"><ShieldExclamationIcon className="w-6 h-6 text-blue-500 mr-3" /></div>
                    <div>
                        <p className="font-bold">AI Cảnh báo (Mô phỏng)</p>
                        <p className="text-sm">Nhân viên 'Phạm Thị Mai' có lịch làm việc dày đặc vào ngày mai. Cân nhắc điều phối lại để tránh quá tải.</p>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default AdminAppointmentsPage;