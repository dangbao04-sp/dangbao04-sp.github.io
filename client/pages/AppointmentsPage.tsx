

import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { MOCK_APPOINTMENTS, MOCK_TREATMENT_COURSES, MOCK_SERVICES } from '../../constants';
import type { Appointment, TreatmentCourse, Wallet, User } from '../../types';
import { StarIcon, CheckCircleIcon, XCircleIcon } from '../../shared/icons'; // Removed XCircleIcon to avoid collision with CheckCircleIcon from types.ts (not an actual component)

interface AppointmentsPageProps {
    currentUser: User;
    wallet: Wallet;
    setWallet: React.Dispatch<React.SetStateAction<Wallet>>;
}

const getStatusBadge = (status: Appointment['status']) => {
    switch (status) {
        case 'upcoming':
            return <span className="px-3 py-1 text-sm font-semibold rounded-full bg-blue-100 text-blue-800">Đã xác nhận</span>;
        case 'completed':
            return <span className="px-3 py-1 text-sm font-semibold rounded-full bg-green-100 text-green-800">Hoàn thành</span>;
        case 'cancelled':
            return <span className="px-3 py-1 text-sm font-semibold rounded-full bg-red-100 text-red-800">Đã hủy</span>;
        case 'in-progress':
            return <span className="px-3 py-1 text-sm font-semibold rounded-full bg-purple-100 text-purple-800">Đang tiến hành</span>;
        case 'pending':
            return <span className="px-3 py-1 text-sm font-semibold rounded-full bg-yellow-100 text-yellow-800">Chờ xác nhận</span>;
        default:
            return <span className="px-3 py-1 text-sm font-semibold rounded-full bg-gray-100 text-gray-800">Không rõ</span>;
    }
};

export const AppointmentsPage: React.FC<AppointmentsPageProps> = ({ currentUser, wallet, setWallet }) => {
    const [appointments, setAppointments] = useState<Appointment[]>(MOCK_APPOINTMENTS);
    const [activeTab, setActiveTab] = useState<'upcoming' | 'history' | 'courses'>('upcoming');
    const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
    const [reminders, setReminders] = useState<Appointment[]>([]);
    const [appointmentToCancel, setAppointmentToCancel] = useState<Appointment | null>(null);
    const [selectedCourse, setSelectedCourse] = useState<TreatmentCourse | null>(null);
    
    const [pointsNotification, setPointsNotification] = useState<{ show: boolean; points: number }>({ show: false, points: 0 });
    
    // State for reviews
    const [reviewedAppointments, setReviewedAppointments] = useState<Set<string>>(new Set());
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [appointmentToReview, setAppointmentToReview] = useState<Appointment | null>(null);
    const [reviewRating, setReviewRating] = useState(0);
    const [reviewComment, setReviewComment] = useState('');
    const [hoverRating, setHoverRating] = useState(0);
    
    // State for sorting and filtering
    const [upcomingSort, setUpcomingSort] = useState('date_asc');
    const [upcomingFilterService, setUpcomingFilterService] = useState('all');
    const [upcomingTimeFilter, setUpcomingTimeFilter] = useState('all');

    const [pastSort, setPastSort] = useState('date_desc');
    const [pastFilterService, setPastFilterService] = useState('all');
    const [pastFilterStatus, setPastFilterStatus] = useState<'all' | 'completed' | 'cancelled'>('all');
    const [pastTimeFilter, setPastTimeFilter] = useState('all');

    const treatmentCourses: TreatmentCourse[] = MOCK_TREATMENT_COURSES;
    const selectedServiceDetails = selectedAppointment ? MOCK_SERVICES.find(s => s.id === selectedAppointment.serviceId) : null;

    useEffect(() => {
        const now = new Date().getTime();
        const twentyFourHours = 24 * 60 * 60 * 1000;

        const upcomingReminders = appointments.filter(app => {
            if (app.status !== 'upcoming') return false;
            const appointmentTime = new Date(`${app.date}T${app.time}`).getTime();
            const timeDifference = appointmentTime - now;
            return timeDifference > 0 && timeDifference <= twentyFourHours;
        });

        setReminders(upcomingReminders);
    }, [appointments]);
    
    const handleConfirmCancel = () => {
        if (appointmentToCancel) {
            setAppointments(prev =>
                prev.map(app =>
                    app.id === appointmentToCancel.id ? { ...app, status: 'cancelled' } : app
                )
            );
            setAppointmentToCancel(null);
        }
    };
    
    const handleOpenReviewModal = (app: Appointment) => {
        setAppointmentToReview(app);
        setIsReviewModalOpen(true);
    };

    const handleCloseReviewModal = () => {
        setIsReviewModalOpen(false);
        setAppointmentToReview(null);
        setReviewRating(0);
        setReviewComment('');
        setHoverRating(0);
    };

    const handleSubmitReview = () => {
        if (!appointmentToReview || reviewRating === 0) {
            alert('Vui lòng chọn số sao đánh giá.');
            return;
        }
        console.log({
            appointmentId: appointmentToReview.id,
            rating: reviewRating,
            comment: reviewComment,
        });
        setReviewedAppointments(prev => new Set(prev).add(appointmentToReview.id));
        
        const service = MOCK_SERVICES.find(s => s.id === appointmentToReview.serviceId);
        if (service) {
            const price = service.discountPrice || service.price;
            const pointsEarned = Math.floor(price / 1000);
            if (pointsEarned > 0) {
                setWallet(prev => ({ ...prev, points: prev.points + pointsEarned }));
                setPointsNotification({ show: true, points: pointsEarned });
                setTimeout(() => {
                    setPointsNotification({ show: false, points: 0 });
                }, 5000); // Hide after 5 seconds
            }
        }

        handleCloseReviewModal();
    };

    const dateFilterFunc = (dateStr: string, filter: string) => {
        if (filter === 'all') return true;
        const today = new Date();
        const appointmentDate = new Date(dateStr);
        if (filter === 'today') {
            return appointmentDate.toDateString() === today.toDateString();
        }
        if (filter === 'week') {
            const firstDayOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1))); // Monday
            firstDayOfWeek.setHours(0, 0, 0, 0);
            const lastDayOfWeek = new Date(firstDayOfWeek);
            lastDayOfWeek.setDate(lastDayOfWeek.getDate() + 6);
            lastDayOfWeek.setHours(23, 59, 59, 999);
            return appointmentDate >= firstDayOfWeek && appointmentDate <= lastDayOfWeek;
        }
        if (filter === 'month') {
            return appointmentDate.getMonth() === today.getMonth() && appointmentDate.getFullYear() === today.getFullYear();
        }
        return true;
    };

    const filteredUpcomingAppointments = useMemo(() => {
        let filtered = appointments.filter(a => a.status === 'upcoming');

        if (upcomingFilterService !== 'all') {
            filtered = filtered.filter(a => a.serviceId === upcomingFilterService);
        }
        
        filtered = filtered.filter(a => dateFilterFunc(a.date, upcomingTimeFilter));

        const [sortKey, sortOrder] = upcomingSort.split('_');
        return [...filtered].sort((a, b) => {
            if (sortKey === 'date') {
                const dateA = new Date(`${a.date}T${a.time}`).getTime();
                const dateB = new Date(`${b.date}T${b.time}`).getTime();
                return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
            }
            if (sortKey === 'service') {
                return sortOrder === 'asc' 
                    ? a.serviceName.localeCompare(b.serviceName)
                    : b.serviceName.localeCompare(a.serviceName);
            }
            return 0;
        });
    }, [appointments, upcomingSort, upcomingFilterService, upcomingTimeFilter]);
    
    const filteredPastAppointments = useMemo(() => {
        let filtered = appointments.filter(a => a.status === 'completed' || a.status === 'cancelled');

        if (pastFilterService !== 'all') {
            filtered = filtered.filter(a => a.serviceId === pastFilterService);
        }
        if (pastFilterStatus !== 'all') {
            filtered = filtered.filter(a => a.status === pastFilterStatus);
        }
        filtered = filtered.filter(a => dateFilterFunc(a.date, pastTimeFilter));
        
        const [sortKey, sortOrder] = pastSort.split('_');
        return [...filtered].sort((a, b) => {
             if (sortKey === 'date') {
                const dateA = new Date(a.date).getTime();
                const dateB = new Date(b.date).getTime();
                return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
            }
            if (sortKey === 'service') {
                return sortOrder === 'asc' 
                    ? a.serviceName.localeCompare(b.serviceName)
                    : b.serviceName.localeCompare(a.serviceName);
            }
            return 0;
        });
    }, [appointments, pastSort, pastFilterService, pastFilterStatus, pastTimeFilter]);

    const upcomingServices = useMemo(() => {
        const serviceIds = new Set(appointments.filter(a => a.status === 'upcoming').map(a => a.serviceId));
        return MOCK_SERVICES.filter(s => serviceIds.has(s.id));
    }, [appointments]);

    const pastServices = useMemo(() => {
        const serviceIds = new Set(appointments.filter(a => a.status !== 'upcoming').map(a => a.serviceId));
        return MOCK_SERVICES.filter(s => serviceIds.has(s.id));
    }, [appointments]);

    const TimeFilterButtons = ({ value, onChange }: { value: string, onChange: (val: string) => void }) => (
         <div>
            <label className="block text-sm font-medium text-brand-text mb-2">Lọc theo thời gian</label>
            <div className="flex flex-wrap gap-2">
                <button onClick={() => onChange('all')} className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${value === 'all' ? 'bg-brand-primary text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>Tất cả</button>
                <button onClick={() => onChange('today')} className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${value === 'today' ? 'bg-brand-primary text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>Hôm nay</button>
                <button onClick={() => onChange('week')} className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${value === 'week' ? 'bg-brand-primary text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>Tuần này</button>
                <button onClick={() => onChange('month')} className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${value === 'month' ? 'bg-brand-primary text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>Tháng này</button>
            </div>
        </div>
    );

    return (
        <div className="container mx-auto px-4 py-12">
            {pointsNotification.show && (
                <div className="fixed top-24 right-6 bg-green-500 text-white p-4 rounded-lg shadow-lg z-50 animate-fadeInUp">
                    🎉 Chúc mừng! Bạn đã nhận được <strong>{pointsNotification.points}</strong> điểm thưởng.
                </div>
            )}

            <h1 className="text-4xl font-serif font-bold text-brand-dark text-center mb-10">Lịch Hẹn & Liệu Trình</h1>

            <div className="mb-8 flex justify-center border-b border-gray-200">
                <button onClick={() => setActiveTab('upcoming')} className={`px-6 py-3 font-medium text-lg transition-colors ${activeTab === 'upcoming' ? 'border-b-2 border-brand-primary text-brand-dark' : 'text-gray-500 hover:text-brand-dark'}`}>Lịch Hẹn Sắp Tới</button>
                <button onClick={() => setActiveTab('history')} className={`px-6 py-3 font-medium text-lg transition-colors ${activeTab === 'history' ? 'border-b-2 border-brand-primary text-brand-dark' : 'text-gray-500 hover:text-brand-dark'}`}>Lịch Sử Hẹn</button>
                <button onClick={() => setActiveTab('courses')} className={`px-6 py-3 font-medium text-lg transition-colors ${activeTab === 'courses' ? 'border-b-2 border-brand-primary text-brand-dark' : 'text-gray-500 hover:text-brand-dark'}`}>Liệu Trình Của Tôi</button>
            </div>

            <div className="max-w-6xl mx-auto">
                {activeTab === 'upcoming' && (
                    <div>
                        <div className="bg-gray-50 p-4 rounded-lg mb-6 shadow-sm border space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="upcoming-sort" className="block text-sm font-medium text-brand-text mb-1">Sắp xếp theo</label>
                                    <select id="upcoming-sort" value={upcomingSort} onChange={(e) => setUpcomingSort(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md focus:ring-brand-primary focus:border-brand-primary bg-white">
                                        <option value="date_asc">Ngày hẹn (Gần nhất)</option>
                                        <option value="date_desc">Ngày hẹn (Xa nhất)</option>
                                        <option value="service_asc">Dịch vụ (A-Z)</option>
                                        <option value="service_desc">Dịch vụ (Z-A)</option>
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="upcoming-filter-service" className="block text-sm font-medium text-brand-text mb-1">Lọc theo dịch vụ</label>
                                    <select id="upcoming-filter-service" value={upcomingFilterService} onChange={(e) => setUpcomingFilterService(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md focus:ring-brand-primary focus:border-brand-primary bg-white">
                                        <option value="all">Tất cả dịch vụ</option>
                                        {upcomingServices.map(service => (<option key={service.id} value={service.id}>{service.name}</option>))}
                                    </select>
                                </div>
                            </div>
                            <TimeFilterButtons value={upcomingTimeFilter} onChange={setUpcomingTimeFilter} />
                        </div>
                        <div className="space-y-6">
                        {reminders.length > 0 && (
                            <div className="bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 p-4 mb-6 rounded-md shadow" role="alert">
                                <div className="flex">
                                    <div className="py-1"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-400 mr-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg></div>
                                    <div>
                                        <p className="font-bold">Nhắc nhở lịch hẹn!</p>
                                        <p className="text-sm">Bạn có lịch hẹn sau đây trong vòng 24 giờ tới:</p>
                                        <ul className="list-disc list-inside mt-2 text-sm">{reminders.map(app => (<li key={app.id}><strong>{app.serviceName}</strong> lúc {app.time} ngày {new Date(app.date).toLocaleDateString('vi-VN')}</li>))}</ul>
                                    </div>
                                </div>
                            </div>
                        )}
                        {filteredUpcomingAppointments.length > 0 ? (
                            filteredUpcomingAppointments.map(app => {
                                const service = MOCK_SERVICES.find(s => s.id === app.serviceId);
                                return (
                                    <div key={app.id} className="bg-white p-5 rounded-lg shadow-md flex flex-col sm:flex-row justify-between items-start gap-4">
                                        <div className="flex-1">
                                            <p className="text-sm font-semibold text-brand-primary">{new Date(app.date).toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} - {app.time}</p>
                                            <h3 className="text-xl font-bold text-brand-dark mt-1">{app.serviceName}</h3>
                                            {service && <p className="text-brand-text text-sm mt-1 italic">{service.description}</p>}
                                            <div className="mt-2 pt-2 border-t border-gray-100 text-sm text-brand-text space-y-1">
                                                <p><span className="font-semibold text-gray-600">Khách hàng:</span> {currentUser.name}</p>
                                                {app.therapist && <p><span className="font-semibold text-gray-600">Kỹ thuật viên:</span> {app.therapist}</p>}
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end gap-3 self-end sm:self-center flex-shrink-0 sm:ml-4">
                                            {getStatusBadge(app.status)}
                                            <div className="flex gap-2">
                                                <button onClick={() => setSelectedAppointment(app)} className="bg-brand-secondary text-brand-dark hover:bg-brand-primary hover:text-white font-semibold px-4 py-2 rounded-md text-sm transition-colors">Xem Chi Tiết</button>
                                                <button onClick={() => setAppointmentToCancel(app)} className="bg-red-100 text-red-700 hover:bg-red-200 font-semibold px-4 py-2 rounded-md text-sm transition-colors">Hủy lịch</button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (<div className="text-center py-10 bg-white rounded-lg shadow-md"><p className="text-lg text-brand-text">Không có lịch hẹn nào phù hợp.</p></div>)}
                        </div>
                    </div>
                )}
                {activeTab === 'history' && (
                    <div>
                         <div className="bg-gray-50 p-4 rounded-lg mb-6 shadow-sm border space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="past-sort" className="block text-sm font-medium text-brand-text mb-1">Sắp xếp theo</label>
                                    <select id="past-sort" value={pastSort} onChange={(e) => setPastSort(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md focus:ring-brand-primary focus:border-brand-primary bg-white">
                                        <option value="date_desc">Ngày hẹn (Mới nhất)</option>
                                        <option value="date_asc">Ngày hẹn (Cũ nhất)</option>
                                        <option value="service_asc">Dịch vụ (A-Z)</option>
                                        <option value="service_desc">Dịch vụ (Z-A)</option>
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="past-filter-service" className="block text-sm font-medium text-brand-text mb-1">Lọc theo dịch vụ</label>
                                    <select id="past-filter-service" value={pastFilterService} onChange={(e) => setPastFilterService(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md focus:ring-brand-primary focus:border-brand-primary bg-white">
                                        <option value="all">Tất cả dịch vụ</option>
                                        {pastServices.map(service => (<option key={service.id} value={service.id}>{service.name}</option>))}
                                    </select>
                                </div>
                            </div>
                             <TimeFilterButtons value={pastTimeFilter} onChange={setPastTimeFilter} />
                            <div>
                                <label className="block text-sm font-medium text-brand-text mb-2">Lọc theo trạng thái</label>
                                <div className="flex flex-wrap gap-2">
                                    <button onClick={() => setPastFilterStatus('all')} className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${pastFilterStatus === 'all' ? 'bg-brand-primary text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>Tất cả</button>
                                    <button onClick={() => setPastFilterStatus('completed')} className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${pastFilterStatus === 'completed' ? 'bg-brand-primary text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>Hoàn thành</button>
                                    <button onClick={() => setPastFilterStatus('cancelled')} className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${pastFilterStatus === 'cancelled' ? 'bg-brand-primary text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>Đã hủy</button>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-6">
                            {filteredPastAppointments.length > 0 ? (
                                filteredPastAppointments.map(app => (
                                    <div key={app.id} className={`bg-white p-5 rounded-lg shadow-md flex flex-col sm:flex-row justify-between items-start gap-4 ${app.status === 'cancelled' ? 'opacity-70' : ''}`}>
                                        <div className="flex-1">
                                            <p className="text-sm font-semibold text-gray-500">{new Date(app.date).toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} - {app.time}</p>
                                            <h3 className={`text-xl font-bold mt-1 ${app.status === 'cancelled' ? 'text-gray-600 line-through' : 'text-brand-dark'}`}>{app.serviceName}</h3>
                                            {app.therapist && <p className="text-gray-500 text-sm mt-1">Kỹ thuật viên: {app.therapist}</p>}
                                        </div>
                                        <div className="flex flex-col items-end gap-3 self-end sm:self-center flex-shrink-0 sm:ml-4">
                                            {getStatusBadge(app.status)}
                                            {app.status === 'completed' && (
                                                <div className="flex gap-2">
                                                    <button onClick={() => handleOpenReviewModal(app)} disabled={reviewedAppointments.has(app.id)} className="bg-green-100 text-green-800 hover:bg-green-200 font-semibold px-4 py-2 rounded-md text-sm transition-colors disabled:bg-gray-200 disabled:text-gray-500 disabled:cursor-not-allowed">{reviewedAppointments.has(app.id) ? 'Đã đánh giá' : 'Đánh giá'}</button>
                                                    <button className="bg-brand-secondary text-brand-dark hover:bg-brand-primary hover:text-white font-semibold px-4 py-2 rounded-md text-sm transition-colors">Đặt lại</button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))
                            ) : (<div className="text-center py-10 bg-white rounded-lg shadow-md"><p className="text-lg text-brand-text">Không có lịch hẹn nào trong quá khứ phù hợp.</p></div>)}
                        </div>
                    </div>
                )}
                 {activeTab === 'courses' && (
                    <div className="space-y-8">
                        {treatmentCourses.length > 0 ? (
                            treatmentCourses.map(course => (
                               <div key={course.id} className="bg-white p-6 rounded-lg shadow-md">
                                    <div className="mb-4">
                                        <div className="flex justify-between items-center flex-wrap gap-2">
                                            <h3 className="text-xl font-bold text-brand-dark">{course.serviceName}</h3>
                                            <p className="text-sm font-medium text-brand-text">Hoàn thành {course.sessions.length}/{course.totalSessions} buổi</p>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                                            <div className="bg-brand-primary h-2.5 rounded-full" style={{ width: `${(course.sessions.length / course.totalSessions) * 100}%` }}></div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 mt-4">
                                         <button onClick={() => setSelectedCourse(course)} className="bg-brand-secondary text-brand-dark hover:bg-brand-primary hover:text-white font-semibold px-4 py-2 rounded-md text-sm transition-colors">Xem chi tiết liệu trình</button>
                                        {course.sessions.length < course.totalSessions && (
                                            <Link to={`/booking?serviceId=${course.serviceId}`} className="bg-brand-dark text-white hover:bg-brand-primary font-semibold px-4 py-2 rounded-md text-sm transition-colors">
                                                Đặt buổi tiếp theo
                                            </Link>
                                        )}
                                    </div>
                               </div>
                            ))
                        ) : (<div className="text-center py-10 bg-white rounded-lg shadow-md"><p className="text-lg text-brand-text">Bạn chưa có liệu trình nào đang theo dõi.</p></div>)}
                    </div>
                )}
            </div>

            {selectedAppointment && selectedServiceDetails && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4" role="dialog" aria-modal="true" onClick={() => setSelectedAppointment(null)}>
                    <div className="bg-white p-6 sm:p-8 rounded-lg shadow-xl max-w-lg w-full transform transition-all animate-fadeIn" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-between items-start mb-4"><h2 className="text-2xl font-serif font-bold text-brand-dark">Chi Tiết Lịch Hẹn</h2><button onClick={() => setSelectedAppointment(null)} className="text-gray-400 hover:text-gray-800 text-3xl font-light leading-none">&times;</button></div>
                        <div className="space-y-5 text-sm sm:text-base">
                            <div className="pb-3 border-b"><p className="text-sm text-gray-500">Dịch vụ</p><p className="text-lg font-bold text-brand-primary">{selectedServiceDetails.name}</p><p className="text-sm text-brand-text mt-1">{selectedServiceDetails.longDescription}</p></div>
                            <div className="grid grid-cols-2 gap-4 pb-3 border-b">
                                <div><p className="text-sm text-gray-500">Ngày hẹn</p><p className="font-semibold text-brand-text">{new Date(selectedAppointment.date).toLocaleDateString('vi-VN')}</p></div>
                                <div><p className="text-sm text-gray-500">Giờ hẹn</p><p className="font-semibold text-brand-text">{selectedAppointment.time}</p></div>
                                <div><p className="text-sm text-gray-500">Kỹ thuật viên</p><p className="font-semibold text-brand-text">{selectedAppointment.therapist || 'Chưa xác định'}</p></div>
                                <div><p className="text-sm text-gray-500">Chi phí</p><p className="font-semibold text-brand-text">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(selectedServiceDetails.price)}</p></div>
                            </div>
                             <div><p className="text-sm text-gray-500">Trạng thái</p>{getStatusBadge(selectedAppointment.status)}</div>
                            <div><p className="text-sm text-gray-500">Thông tin khách hàng</p><p className="font-semibold text-brand-text">{currentUser.name}</p><p className="text-sm text-brand-text">{currentUser.email} | {currentUser.phone}</p></div>
                        </div>
                        <div className="mt-6 text-right"><button onClick={() => setSelectedAppointment(null)} className="bg-brand-secondary text-brand-dark font-bold py-2 px-6 rounded-lg hover:bg-brand-primary hover:text-white transition-colors duration-300">Đóng</button></div>
                    </div>
                </div>
            )}
            
            {appointmentToCancel && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4" role="dialog" aria-modal="true" onClick={() => setAppointmentToCancel(null)}>
                    <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full text-center transform transition-all animate-fadeIn" onClick={(e) => e.stopPropagation()}>
                        <div className="mx-auto mb-4 w-16 h-16 bg-red-100 rounded-full flex items-center justify-center"><XCircleIcon className="w-10 h-10 text-red-600" /></div>
                        <h2 className="text-2xl font-bold text-brand-dark mb-4">Xác nhận Hủy Lịch hẹn</h2>
                        <p className="text-md text-brand-text mb-6">Bạn có chắc chắn muốn hủy lịch hẹn cho dịch vụ <br /><strong className="text-brand-primary">{appointmentToCancel.serviceName}</strong> <br />vào lúc {appointmentToCancel.time}, {new Date(appointmentToCancel.date).toLocaleDateString('vi-VN')}?</p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <button onClick={() => setAppointmentToCancel(null)} className="w-full sm:w-auto bg-gray-200 text-gray-800 font-bold py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors duration-300">Không</button>
                            <button onClick={handleConfirmCancel} className="w-full sm:w-auto bg-red-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-red-700 transition-colors duration-300">Xác nhận Hủy</button>
                        </div>
                    </div>
                </div>
            )}
            
            {isReviewModalOpen && appointmentToReview && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4" role="dialog" aria-modal="true" onClick={handleCloseReviewModal}>
                    <div className="bg-white p-6 sm:p-8 rounded-lg shadow-xl max-w-lg w-full transform transition-all animate-fadeIn" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-between items-start mb-4">
                            <div><h2 className="text-2xl font-serif font-bold text-brand-dark">Đánh giá Dịch vụ</h2><p className="text-brand-primary font-semibold">{appointmentToReview.serviceName}</p></div>
                            <button onClick={handleCloseReviewModal} className="text-gray-400 hover:text-gray-800 text-3xl font-light leading-none">&times;</button>
                        </div>
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-brand-text mb-2">1. Xếp hạng của bạn</label>
                                <div className="flex items-center space-x-2">{[1, 2, 3, 4, 5].map((star) => (<button key={star} onClick={() => setReviewRating(star)} onMouseEnter={() => setHoverRating(star)} onMouseLeave={() => setHoverRating(0)} className="text-3xl transition-colors" aria-label={`Rate ${star} stars`}><span><StarIcon className={`w-8 h-8 ${(hoverRating || reviewRating) >= star ? 'text-yellow-400' : 'text-gray-300'}`} /></span></button>))}</div>
                            </div>
                            <div>
                                <label htmlFor="review-comment" className="block text-sm font-medium text-brand-text mb-2">2. Viết bình luận (tùy chọn)</label>
                                <textarea id="review-comment" rows={4} value={reviewComment} onChange={(e) => setReviewComment(e.target.value)} placeholder="Chia sẻ trải nghiệm của bạn về dịch vụ..." className="w-full p-3 border border-gray-300 rounded-md focus:ring-brand-primary focus:border-brand-primary" />
                            </div>
                        </div>
                        <div className="mt-8 flex justify-end gap-4">
                            <button onClick={handleCloseReviewModal} className="bg-gray-200 text-gray-800 font-bold py-2 px-6 rounded-lg hover:bg-gray-300 transition-colors duration-300">Hủy</button>
                            <button onClick={handleSubmitReview} disabled={reviewRating === 0} className="bg-brand-dark text-white font-bold py-2 px-6 rounded-lg hover:bg-brand-primary transition-colors duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed">Gửi đánh giá</button>
                        </div>
                    </div>
                </div>
            )}
            
            {selectedCourse && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[60] p-4" role="dialog" aria-modal="true" onClick={() => setSelectedCourse(null)}>
                    <div className="bg-white p-6 sm:p-8 rounded-lg shadow-xl max-w-2xl w-full transform transition-all animate-fadeIn" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-between items-start mb-4">
                             <div>
                                <h2 className="text-2xl font-serif font-bold text-brand-dark">Chi Tiết Liệu Trình</h2>
                                <p className="text-brand-primary font-semibold">{selectedCourse.serviceName}</p>
                            </div>
                            <button onClick={() => setSelectedCourse(null)} className="text-gray-400 hover:text-gray-800 text-3xl font-light leading-none">&times;</button>
                        </div>
                        <div className="max-h-[60vh] overflow-y-auto pr-4">
                           <div className="relative border-l-2 border-brand-primary/30 ml-3 py-4">
                               {selectedCourse.sessions.map((session, index) => (
                                   <div key={index} className="mb-8 pl-8 relative">
                                        <div className="absolute -left-[7px] top-1 w-3 h-3 bg-brand-primary rounded-full ring-4 ring-white"></div>
                                        <p className="font-bold text-md text-brand-dark">Buổi {index + 1} - {new Date(session.date).toLocaleDateString('vi-VN')}</p>
                                        <p className="text-sm text-gray-500 mb-2">KTV: {session.therapist}</p>
                                        <div className="bg-brand-secondary/50 p-3 rounded-md">
                                            <p className="text-sm text-brand-text italic">{session.notes}</p>
                                        </div>
                                   </div>
                               ))}
                           </div>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};