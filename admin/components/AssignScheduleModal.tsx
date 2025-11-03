

import React, { useState, useMemo, useEffect, useRef } from 'react';
import type { User, StaffDailyAvailability, StaffScheduleSlot, Service } from '../../types';
import { STANDARD_WORK_TIMES, MOCK_SERVICES } from '../../constants';
import ServiceSelectionPopover from './ServiceSelectionPopover'; // Import the newly extracted ServiceSelectionPopover
import {CalendarIcon,ClockIcon,BriefcaseIcon,EditIcon} from '../../shared/icons';


interface AssignScheduleModalProps {
    staff: User;
    allStaffAvailability: StaffDailyAvailability[];
    bookedAppointments: StaffScheduleSlot[];
    onClose: () => void;
    onSave: (staffId: string, date: string, timeSlots: StaffDailyAvailability['timeSlots']) => void;
}

const AssignScheduleModal: React.FC<AssignScheduleModalProps> = ({ staff, allStaffAvailability, bookedAppointments, onClose, onSave }) => {
    const today = new Date().toISOString().split('T')[0];
    const [selectedDate, setSelectedDate] = useState<string>(today);
    const [selectedTimeSlotDetails, setSelectedTimeSlotDetails] = useState<StaffDailyAvailability['timeSlots']>([]);
    const [serviceSelectionPopover, setServiceSelectionPopover] = useState<{ time: string; anchorEl: HTMLButtonElement | null; buttonRect: DOMRect | null } | null>(null);

    const modalContentRef = useRef<HTMLDivElement>(null); // Ref for the scrollable content area of the modal

    const isTechnician = staff.role === 'Technician';

    const staffSpecialties = useMemo(() => staff.specialty || [], [staff.specialty]);

    // Filter available services based on staff's specialties
    const filterServicesBySpecialty = useMemo(() => {
        if (!isTechnician || staffSpecialties.length === 0) {
            return [];
        }
        return MOCK_SERVICES.filter(service =>
            staffSpecialties.some(specialty => service.category.includes(specialty))
        );
    }, [isTechnician, staffSpecialties]);


    // Get staff's availability for the selected date
    const staffAvailabilityForDate = useMemo(() => {
        return allStaffAvailability.find(avail => avail.staffId === staff.id && avail.date === selectedDate);
    }, [allStaffAvailability, staff.id, selectedDate]);

    // Get booked appointments for the selected date and staff
    const bookedSlotsForDate = useMemo(() => {
        return bookedAppointments.filter(app => app.therapistId === staff.id && app.date === selectedDate);
    }, [bookedAppointments, staff.id, selectedDate]);

    useEffect(() => {
        // Initialize currentAvailableTimes when selectedDate or staff changes
        if (staffAvailabilityForDate) {
            // Deep copy to ensure independence
            setSelectedTimeSlotDetails(staffAvailabilityForDate.timeSlots.map(ts => ({ ...ts, availableServiceIds: [...ts.availableServiceIds] })));
        } else {
            setSelectedTimeSlotDetails([]); // Default to no availability if no record found
        }
    }, [staffAvailabilityForDate, selectedDate, staff.id]);

    const handleToggleTimeSlotAvailability = (time: string) => {
        setSelectedTimeSlotDetails(prev => {
            const existingIndex = prev.findIndex(ts => ts.time === time);
            if (existingIndex !== -1) {
                // If already available, remove it (user wants to make it unavailable)
                return prev.filter((_, idx) => idx !== existingIndex);
            } else {
                // If not available, add it. Check if it had previous services for this date in the original availability.
                const originalSlot = staffAvailabilityForDate?.timeSlots.find(ts => ts.time === time);
                const newTimeSlot = {
                    time,
                    availableServiceIds: originalSlot ? [...originalSlot.availableServiceIds] : [],
                };
                return [...prev, newTimeSlot].sort((a, b) => a.time.localeCompare(b.time));
            }
        });
    };

    const handleOpenServiceSelection = (time: string, event: React.MouseEvent<HTMLButtonElement>) => {
        setServiceSelectionPopover({ time, anchorEl: event.currentTarget, buttonRect: event.currentTarget.getBoundingClientRect() });
    };

    const handleServiceChange = (time: string, serviceId: string, checked: boolean) => {
        setSelectedTimeSlotDetails(prev =>
            prev.map(ts => {
                if (ts.time === time) {
                    const updatedServiceIds = checked
                        ? [...ts.availableServiceIds, serviceId]
                        : ts.availableServiceIds.filter(id => id !== serviceId);
                    return { ...ts, availableServiceIds: updatedServiceIds };
                }
                return ts;
            })
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Filter out time slots that are marked as available but have no services if it's a technician
        const finalTimeSlots = isTechnician
            ? selectedTimeSlotDetails.filter(ts => ts.availableServiceIds.length > 0)
            : selectedTimeSlotDetails; // For non-technicians, general availability is fine

        onSave(staff.id, selectedDate, finalTimeSlots);
        onClose();
    };

    const isMinimumDate = useMemo(() => {
        const todayNoTime = new Date(today);
        todayNoTime.setHours(0,0,0,0);
        const selectedNoTime = new Date(selectedDate);
        selectedNoTime.setHours(0,0,0,0);
        return selectedNoTime < todayNoTime;
    }, [selectedDate, today]);

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full relative" onClick={e => e.stopPropagation()}>
                <form onSubmit={handleSubmit}>
                    <div ref={modalContentRef} className="p-6 max-h-[80vh] overflow-y-auto"> {/* Apply ref here */}
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Phân công lịch làm việc</h2>
                        <p className="text-gray-600 mb-4">
                            Cho nhân viên: <strong className="text-brand-dark">{staff.name}</strong> ({staff.role === 'Technician' ? staff.specialty?.join(', ') : staff.role})
                        </p>

                        <div className="mb-6">
                            <label htmlFor="scheduleDate" className="block text-sm font-medium text-gray-700 mb-2">Chọn Ngày</label>
                            <input
                                type="date"
                                id="scheduleDate"
                                value={selectedDate}
                                onChange={(e) => {
                                    setSelectedDate(e.target.value);
                                    setServiceSelectionPopover(null); // Close popover on date change
                                }}
                                min={today}
                                className="w-full p-2 border rounded-md focus:ring-brand-primary focus:border-brand-primary"
                                aria-label="Chọn ngày làm việc"
                            />
                        </div>

                        {isMinimumDate && (
                            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded" role="alert">
                                <p className="font-bold">Không thể chỉnh sửa lịch đã qua</p>
                                <p className="text-sm">Bạn chỉ có thể phân công lịch từ hôm nay trở đi.</p>
                            </div>
                        )}

                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Chọn các khung giờ có mặt và dịch vụ</label>
                            <div className="grid grid-cols-1 gap-2 border p-3 rounded-md bg-gray-50 max-h-60 overflow-y-auto">
                                {STANDARD_WORK_TIMES.map(time => {
                                    const timeSlotDetail = selectedTimeSlotDetails.find(ts => ts.time === time);
                                    const isAvailable = !!timeSlotDetail;
                                    const isBooked = bookedSlotsForDate.some(slot => slot.time === time);
                                    const isPastTime = new Date(`${selectedDate}T${time}`) < new Date();
                                    
                                    const currentServiceNames = timeSlotDetail?.availableServiceIds
                                        .map(id => MOCK_SERVICES.find(s => s.id === id)?.name || id)
                                        .filter(name => name)
                                        .join(', ');

                                    return (
                                        <div 
                                            key={time} 
                                            className={`
                                                flex items-center gap-3 p-2 rounded-md transition-colors relative
                                                ${isPastTime || isMinimumDate ? 'bg-gray-200 text-gray-500 cursor-not-allowed opacity-70' :
                                                  isAvailable ? 'bg-brand-light border-brand-primary ring-1 ring-brand-primary' : 'bg-white hover:bg-gray-100'}
                                            `}
                                        >
                                            <input
                                                type="checkbox"
                                                id={`time-${time}`}
                                                checked={isAvailable}
                                                onChange={() => handleToggleTimeSlotAvailability(time)}
                                                disabled={isMinimumDate || isPastTime}
                                                className="rounded text-brand-primary focus:ring-brand-primary"
                                                aria-label={`Đặt ${time} là khả dụng`}
                                            />
                                            <label htmlFor={`time-${time}`} className={`flex-1 font-semibold cursor-pointer ${isPastTime || isMinimumDate ? 'line-through' : 'text-gray-800'}`}>
                                                {time}
                                            </label>

                                            {isAvailable && isTechnician && (
                                                <div className="flex items-center gap-2">
                                                    {currentServiceNames && (
                                                        <span className="text-sm text-gray-600 italic max-w-[150px] truncate" title={currentServiceNames}>
                                                            ({currentServiceNames})
                                                        </span>
                                                    )}
                                                    <button
                                                        type="button"
                                                        onClick={(e) => handleOpenServiceSelection(time, e)}
                                                        disabled={isMinimumDate || isPastTime || filterServicesBySpecialty.length === 0}
                                                        className="p-1.5 bg-brand-secondary text-brand-dark rounded-md text-xs font-medium hover:bg-brand-primary hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                        aria-label={`Chọn dịch vụ cho ${time}`}
                                                    >
                                                        <EditIcon className="w-4 h-4 inline-block mr-1" /> Dịch vụ
                                                    </button>
                                                </div>
                                            )}

                                            {isBooked && (
                                                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" title="Có lịch hẹn"></span>
                                                </span>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="mt-3 flex items-center justify-between text-xs text-gray-600">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-brand-primary rounded-full"></div> <span>Có mặt</span>
                                    <div className="w-3 h-3 bg-gray-100 rounded-full"></div> <span>Không có mặt</span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 ml-2"></span> <span>Đã có lịch hẹn</span>
                                </div>
                            </div>
                        </div>

                        {serviceSelectionPopover && modalContentRef.current && serviceSelectionPopover.buttonRect && (
                            <ServiceSelectionPopover
                                time={serviceSelectionPopover.time}
                                currentServiceIds={selectedTimeSlotDetails.find(ts => ts.time === serviceSelectionPopover.time)?.availableServiceIds || []}
                                onClose={() => setServiceSelectionPopover(null)}
                                onServiceChange={(serviceId, checked) => handleServiceChange(serviceSelectionPopover.time, serviceId, checked)}
                                anchorEl={serviceSelectionPopover.anchorEl}
                                availableServices={filterServicesBySpecialty}
                                parentRect={modalContentRef.current.getBoundingClientRect()}
                                buttonRect={serviceSelectionPopover.buttonRect}
                            />
                        )}

                        {bookedSlotsForDate.length > 0 && (
                            <div className="mt-6 bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
                                <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                    <BriefcaseIcon className="w-5 h-5 text-blue-600 mr-2" /> Lịch hẹn đã đặt ngày {new Date(selectedDate).toLocaleDateString('vi-VN')}
                                </h3>
                                <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                                    {bookedSlotsForDate.map(app => {
                                        const displayStatus = app.status === 'completed' ? 'Hoàn thành' : app.status === 'cancelled' ? 'Đã hủy' : 'Đã đặt';
                                        return (
                                            <li key={app.id}>
                                                <strong>{app.time}</strong>: {app.serviceName} ({displayStatus})
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        )}
                    </div>
                    <div className="bg-gray-50 px-6 py-4 flex justify-end gap-4 rounded-b-lg">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Hủy</button>
                        <button type="submit" disabled={isMinimumDate} className="px-4 py-2 bg-brand-primary text-white rounded-md hover:bg-brand-dark disabled:opacity-50 disabled:cursor-not-allowed">Lưu lịch làm việc</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AssignScheduleModal;