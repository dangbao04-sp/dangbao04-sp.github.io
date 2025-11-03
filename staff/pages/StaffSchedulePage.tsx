
import React, { useState, useMemo, useEffect } from 'react';
import { MOCK_STAFF_SHIFTS, MOCK_USERS } from '../../constants';
import type { User, StaffShift } from '../../types';

// Icons
import { CalendarIcon, PlusIcon, SwapIcon, XCircleIcon, CheckCircleIcon, PendingIcon } from '../../shared/icons';
import DayDetailsModal from '../components/DayDetailsModal'; // New import

interface StaffSchedulePageProps {
    currentUser: User;
}

// Helper to format date consistently
const formatDate = (date: Date) => date.toISOString().split('T')[0];

const StaffSchedulePage: React.FC<StaffSchedulePageProps> = ({ currentUser }) => {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    // Initialize with current user's shifts from localStorage or mock data
    const [allStaffShifts, setAllStaffShifts] = useState<StaffShift[]>(() => {
        const storedShifts = localStorage.getItem('allStaffShifts');
        if (storedShifts) {
            const parsedShifts: StaffShift[] = JSON.parse(storedShifts);
            // Ensure we only retrieve/manage current user's shifts in this component's state
            return parsedShifts.filter(shift => shift.staffId === currentUser.id);
        }
        // Fallback to mock data for the current user if nothing in localStorage
        return MOCK_STAFF_SHIFTS.filter(shift => shift.staffId === currentUser.id);
    });

    const [isDayModalOpen, setIsDayModalOpen] = useState(false);
    const [selectedDayInfo, setSelectedDayInfo] = useState<{
        dateString: string;
        dayOfMonth: number;
        shifts: StaffShift[];
    } | null>(null);

    // Persist shifts to localStorage
    useEffect(() => {
        // Get shifts for other staff members
        const otherStaffShifts = (JSON.parse(localStorage.getItem('allStaffShifts') || '[]') as StaffShift[])
            .filter(shift => shift.staffId !== currentUser.id);
        // Combine with current user's shifts and save
        localStorage.setItem('allStaffShifts', JSON.stringify([...otherStaffShifts, ...allStaffShifts]));
    }, [allStaffShifts, currentUser.id]);

    const daysInMonth = useMemo(() => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        const numDays = new Date(year, month + 1, 0).getDate();
        const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 for Sunday, 1 for Monday

        const days = [];
        // Add empty cells for days before the 1st of the month
        for (let i = 0; i < (firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1); i++) { // Adjust for Monday start
            days.push(null);
        }
        for (let i = 1; i <= numDays; i++) {
            days.push(i);
        }
        return days;
    }, [currentMonth]);

    const handlePrevMonth = () => {
        setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
    };

    const handleDayClick = (day: number) => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        const date = new Date(year, month, day);
        const dateString = formatDate(date);

        const shiftsOnDay = allStaffShifts.filter(shift => shift.date === dateString);

        setSelectedDayInfo({ dateString, dayOfMonth: day, shifts: shiftsOnDay });
        setIsDayModalOpen(true);
    };

    const handleCloseDayModal = () => {
        setIsDayModalOpen(false);
        setSelectedDayInfo(null);
    };

    const handleSaveShiftRequest = (newShift: StaffShift) => {
        setAllStaffShifts(prev => {
            // New shift always has a unique ID from DayDetailsModal, so just add it.
            return [...prev, newShift];
        });
        // Update selectedDayInfo for the current view if it matches the saved shift's date
        if (selectedDayInfo && selectedDayInfo.dateString === newShift.date) {
            setSelectedDayInfo(prev => {
                if (!prev) return null;
                // Add the new shift to the current day's shifts
                return { ...prev, shifts: [...prev.shifts, newShift] };
            });
        }
        handleCloseDayModal();
    };

    const handleUpdateShiftRequest = (updatedShift: StaffShift) => {
        setAllStaffShifts(prev =>
            prev.map(s => (s.id === updatedShift.id ? updatedShift : s))
        );
        // Update selectedDayInfo for the current view if it matches the updated shift's date
        if (selectedDayInfo && selectedDayInfo.dateString === updatedShift.date) {
            setSelectedDayInfo(prev => {
                if (!prev) return null;
                return {
                    ...prev,
                    shifts: prev.shifts.map(s => (s.id === updatedShift.id ? updatedShift : s)),
                };
            });
        }
        handleCloseDayModal();
    };

    const handleDeleteShiftRequest = (shiftId: string) => {
        setAllStaffShifts(prev => prev.filter(s => s.id !== shiftId));
        // Update selectedDayInfo for the current view if it contains the deleted shift
        if (selectedDayInfo) {
            setSelectedDayInfo(prev => {
                if (!prev) return null;
                return {
                    ...prev,
                    shifts: prev.shifts.filter(s => s.id !== shiftId),
                };
            });
        }
        handleCloseDayModal();
    };

    const getShiftStatusBadge = (status: StaffShift['status']) => {
        switch (status) {
            case 'approved': return <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-green-100 text-green-800 flex items-center gap-1"><CheckCircleIcon className="w-3 h-3" /> Duyệt</span>;
            case 'pending': return <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800 flex items-center gap-1"><PendingIcon className="w-3 h-3" /> Chờ</span>;
            case 'rejected': return <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-red-100 text-red-800 flex items-center gap-1"><XCircleIcon className="w-3 h-3" /> Từ chối</span>;
            default: return null;
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Quản lý Lịch làm việc</h1>
            <p className="text-gray-600 mb-8">Xem lịch của bạn và gửi yêu cầu đổi ca/nghỉ phép.</p>

            <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
                <div className="flex justify-between items-center mb-6">
                    <button onClick={handlePrevMonth} className="p-2 rounded-full hover:bg-gray-100">&larr;</button>
                    <h2 className="text-xl font-semibold text-gray-800">{currentMonth.toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' })}</h2>
                    <button onClick={handleNextMonth} className="p-2 rounded-full hover:bg-gray-100">&rarr;</button>
                </div>
                
                {/* Calendar Grid */}
                <div className="grid grid-cols-7 text-center text-sm font-medium text-gray-600 mb-4">
                    <span>Thứ 2</span>
                    <span>Thứ 3</span>
                    <span>Thứ 4</span>
                    <span>Thứ 5</span>
                    <span>Thứ 6</span>
                    <span>Thứ 7</span>
                    <span>Chủ Nhật</span>
                </div>
                <div className="grid grid-cols-7 gap-2">
                    {daysInMonth.map((day, index) => {
                        const date = day ? new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day) : null;
                        const dateString = date ? formatDate(date) : '';
                        const shiftsOnDay = date ? allStaffShifts.filter(shift => shift.date === dateString) : [];
                        const isToday = day && new Date().toDateString() === date?.toDateString();

                        return (
                            <div
                                key={index}
                                className={`h-28 rounded-md border p-2 flex flex-col ${day ? 'bg-gray-50 border-gray-200 cursor-pointer hover:bg-gray-100' : 'bg-gray-100 border-dashed border-gray-200'}`}
                                onClick={day ? () => handleDayClick(day) : undefined}
                                role="button" // Add ARIA role for accessibility
                                aria-label={day ? `Xem hoặc đăng ký ca làm ngày ${day}` : undefined}
                            >
                                <span className={`font-semibold ${isToday ? 'text-brand-primary' : 'text-gray-700'}`}>{day}</span>
                                {day && (
                                    <div className="mt-1 text-xs space-y-1 overflow-y-auto flex-grow">
                                        {shiftsOnDay.length > 0 ? (
                                            shiftsOnDay.map(shift => (
                                                <div key={shift.id} className="flex items-center justify-between bg-blue-100 text-blue-800 rounded px-2 py-1">
                                                    <span>
                                                        {shift.shiftType === 'morning' ? 'Sáng' : 
                                                         shift.shiftType === 'afternoon' ? 'Chiều' : 
                                                         shift.shiftType === 'evening' ? 'Tối' : 
                                                         'Nghỉ'}
                                                    </span>
                                                    {getShiftStatusBadge(shift.status)}
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-gray-400 italic">Trống</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {isDayModalOpen && selectedDayInfo && (
                <DayDetailsModal
                    currentUser={currentUser}
                    dayInfo={selectedDayInfo}
                    onClose={handleCloseDayModal}
                    onSaveShiftRequest={handleSaveShiftRequest}
                    onUpdateShiftRequest={handleUpdateShiftRequest}
                    onDeleteShiftRequest={handleDeleteShiftRequest}
                />
            )}
        </div>
    );
};

export default StaffSchedulePage;
