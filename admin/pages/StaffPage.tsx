import React, { useState, useMemo, useEffect } from 'react';
import { MOCK_USERS, MOCK_APPOINTMENTS, MOCK_THERAPISTS, MOCK_STAFF_SCHEDULES, AVAILABLE_SPECIALTIES, MOCK_STAFF_AVAILABILITY, MOCK_SERVICES } from '../../constants';
import type { User, UserRole, UserStatus, Appointment, StaffScheduleSlot, StaffDailyAvailability } from '../../types';
import AssignScheduleModal from '../components/AssignScheduleModal'; // Import new modal
import { PlusIcon, SearchIcon, EditIcon, TrashIcon, LockClosedIcon,
    EyeIcon, TrophyIcon, StarIcon, CalendarCheckIcon, ClockIcon, ScheduleIcon, GridIcon, ListIcon
 } from '../../shared/icons';

const STAFF_PER_PAGE = 6;
const STAFF_ROLES: UserRole[] = ['Admin', 'Manager', 'Technician', 'Receptionist'];
const ROLE_TRANSLATIONS: Record<UserRole, string> = {
    'Admin': 'Quản trị viên',
    'Manager': 'Quản lý',
    'Technician': 'Kỹ thuật viên',
    'Receptionist': 'Lễ tân',
    'Client': 'Khách hàng', // Not used here, but for consistency
};

const getStatusText = (status: UserStatus): string => {
    switch (status) {
        case 'Active': return 'Hoạt động';
        case 'Inactive': return 'Không hoạt động';
        case 'Locked': return 'Đã khóa';
        default: return status;
    }
};

const getStaffPerformance = (staffId: string) => {
    const staffAppointments = MOCK_APPOINTMENTS.filter(a => a.therapistId === staffId && a.status === 'completed');
    const totalAppointments = staffAppointments.length;
    
    // For average rating, use MOCK_THERAPISTS as a base, or calculate from reviews if implemented
    const therapistData = MOCK_THERAPISTS.find(t => t.id === staffId);
    const averageRating = therapistData?.rating || 0;
    const reviewCount = therapistData?.reviewCount || 0;

    return { totalAppointments, averageRating, reviewCount };
};

const AddEditStaffModal: React.FC<{ staff: User | null; onClose: () => void; onSave: (staff: User) => void; }> = ({ staff, onClose, onSave }) => {
    const [formData, setFormData] = useState<Partial<User>>({ 
        ...staff, 
        specialty: staff?.specialty || [], // Initialize specialty as an empty array if not present
        role: staff?.role || 'Technician', 
        status: staff?.status || 'Active' 
    });
    const [imagePreview, setImagePreview] = useState<string>(staff?.profilePictureUrl || '');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        
        if (name === 'profilePictureUrl') {
            setImagePreview(value);
        }
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = e.target;
        setFormData(prev => {
            const currentSpecialties = Array.isArray(prev.specialty) ? prev.specialty : [];
            if (checked) {
                return { ...prev, specialty: [...currentSpecialties, value] };
            } else {
                return { ...prev, specialty: currentSpecialties.filter(s => s !== value) };
            }
        });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result as string;
                setImagePreview(result);
                setFormData(prev => ({ ...prev, profilePictureUrl: result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData as User);
    };

    const isTechnician = formData.role === 'Technician';

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full" onClick={e => e.stopPropagation()}>
                <form onSubmit={handleSubmit}>
                    <div className="p-6 max-h-[80vh] overflow-y-auto">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">{staff ? 'Chỉnh sửa thông tin nhân viên' : 'Thêm nhân viên mới'}</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Profile Picture */}
                            <div className="md:col-span-2 flex flex-col items-center mb-4">
                                <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center border-4 border-gray-200">
                                    {imagePreview ? (
                                        <img src={imagePreview} alt="Profile Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <svg className="w-16 h-16 text-gray-400" fill="currentColor" viewBox="0 0 24 24"><path d="M24 20.993V24H0v-2.996h1.537C3.185 20.252 5.228 20 7.5 20c2.272 0 4.315.252 5.963.996H24zM12 18c-4.418 0-8-3.582-8-8s3.582-8 8-8s8 3.582 8 8s-3.582 8-8 8z"/></svg>
                                    )}
                                </div>
                                <div className="mt-3 w-full max-w-xs">
                                    <label htmlFor="profilePictureUrl" className="block text-xs font-medium text-gray-500">Liên kết ảnh đại diện</label>
                                    <input type="text" name="profilePictureUrl" id="profilePictureUrl" value={formData.profilePictureUrl || ''} onChange={handleChange} className="mt-1 w-full p-2 border rounded text-sm" placeholder="https://..." />
                                    <div className="relative text-center my-2">
                                        <div className="absolute inset-y-1/2 left-0 w-full h-px bg-gray-200"></div>
                                        <span className="relative text-xs text-gray-400 bg-white px-2">hoặc</span>
                                    </div>
                                    <label htmlFor="file-upload" className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 w-full text-center block">Tải lên từ máy</label>
                                    <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/*" />
                                </div>
                            </div>

                            <div><label className="block text-sm font-medium text-gray-700">Họ tên</label><input type="text" name="name" value={formData.name || ''} onChange={handleChange} className="mt-1 w-full p-2 border rounded" required /></div>
                            <div><label className="block text-sm font-medium text-gray-700">Email</label><input type="email" name="email" value={formData.email || ''} onChange={handleChange} className="mt-1 w-full p-2 border rounded" required /></div>
                            <div><label className="block text-sm font-medium text-gray-700">Số điện thoại</label><input type="tel" name="phone" value={formData.phone || ''} onChange={handleChange} className="mt-1 w-full p-2 border rounded" /></div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Vai trò</label>
                                <select name="role" value={formData.role} onChange={handleChange} className="mt-1 w-full p-2 border rounded">
                                    {STAFF_ROLES.map(r => <option key={r} value={r}>{ROLE_TRANSLATIONS[r]}</option>)}
                                </select>
                            </div>
                            {isTechnician && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Chuyên môn</label>
                                    <div className="grid grid-cols-2 gap-2 bg-gray-50 p-3 rounded-md border border-gray-200 max-h-40 overflow-y-auto">
                                        {AVAILABLE_SPECIALTIES.map(s => (
                                            <label key={s} className="flex items-center gap-2 text-sm text-gray-800">
                                                <input
                                                    type="checkbox"
                                                    name="specialty"
                                                    value={s}
                                                    checked={formData.specialty?.includes(s) || false}
                                                    onChange={handleCheckboxChange}
                                                    className="rounded text-brand-primary focus:ring-brand-primary"
                                                />
                                                {s}
                                            </label>
                                        ))}
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">Chọn một hoặc nhiều chuyên môn phù hợp.</p>
                                </div>
                            )}
                            <div className={isTechnician ? '' : 'md:col-span-2'}>
                                <label className="block text-sm font-medium text-gray-700">Kinh nghiệm</label>
                                <textarea name="experience" value={formData.experience || ''} onChange={handleChange} rows={3} className="mt-1 w-full p-2 border rounded"></textarea>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Trạng thái</label>
                                <select name="status" value={formData.status} onChange={handleChange} className="mt-1 w-full p-2 border rounded">
                                    <option value="Active">Hoạt động</option>
                                    <option value="Inactive">Không hoạt động</option>
                                    <option value="Locked">Đã khóa</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-50 px-6 py-4 flex justify-end gap-4 rounded-b-lg">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Hủy</button>
                        <button type="submit" className="px-4 py-2 bg-brand-primary text-white rounded-md hover:bg-brand-dark">Lưu</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const StaffDetailsModal: React.FC<{ staff: User; onClose: () => void; allStaffAvailability: StaffDailyAvailability[]; bookedAppointments: StaffScheduleSlot[]; }> = ({ staff, onClose, allStaffAvailability, bookedAppointments }) => {
    const performance = useMemo(() => getStaffPerformance(staff.id), [staff]);
    const isTechnician = staff.role === 'Technician';
    
    const staffSchedules = useMemo(() => {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        tomorrow.setHours(0,0,0,0);

        const relevantBookedSlots = bookedAppointments
            .filter(s => s.therapistId === staff.id)
            .sort((a, b) => {
                const dateA = new Date(`${a.date}T${a.time}`).getTime();
                const dateB = new Date(`${b.date}T${b.time}`).getTime();
                return dateA - dateB;
            });

        const todayBooked = relevantBookedSlots.filter(s => new Date(`${s.date}T${s.time}`).toDateString() === today.toDateString());
        const upcomingBooked = relevantBookedSlots.filter(s => new Date(`${s.date}T${s.time}`) >= tomorrow);
        
        // Get today's general availability for this staff
        const todayAvailability = allStaffAvailability.find(a => a.staffId === staff.id && a.date === today.toISOString().split('T')[0]);
        const next7DaysAvailability = allStaffAvailability
            .filter(a => a.staffId === staff.id && new Date(a.date) >= tomorrow && new Date(a.date) <= new Date(new Date().setDate(today.getDate() + 7)))
            .sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());


        return { todayBooked, upcomingBooked, todayAvailability, next7DaysAvailability };
    }, [staff, allStaffAvailability, bookedAppointments]);

    const isStaffOfTheMonth = useMemo(() => {
        // Mock logic: Staff of the month if rating > 4.8 and has served > 50 appointments.
        // In a real app, this would involve more complex aggregation.
        return isTechnician && performance.averageRating >= 4.8 && performance.totalAppointments > 50;
    }, [isTechnician, performance]);

    return (
         <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full" onClick={e => e.stopPropagation()}>
                <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <img src={staff.profilePictureUrl} alt={staff.name} className="w-20 h-20 rounded-full object-cover border-4 border-brand-primary/30"/>
                                {isStaffOfTheMonth && (
                                    <div className="absolute -top-1 -right-1 bg-yellow-400 text-white p-1 rounded-full text-xs font-bold shadow-md transform rotate-12">
                                        <TrophyIcon className="w-5 h-5" />
                                    </div>
                                )}
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                                    {staff.name} 
                                </h2>
                                <p className="text-brand-primary text-lg font-semibold">{ROLE_TRANSLATIONS[staff.role]}</p>
                                <p className="text-gray-500">{staff.email}</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-h-[70vh] overflow-y-auto pr-2">
                        {/* Basic Info */}
                        <div className="bg-gray-50 p-4 rounded-lg border">
                            <h3 className="text-lg font-semibold text-gray-700 mb-3">Thông tin cơ bản</h3>
                            <div className="text-sm space-y-2">
                                <p><strong>Điện thoại:</strong> {staff.phone || 'N/A'}</p>
                                <p><strong>Ngày tham gia:</strong> {new Date(staff.joinDate).toLocaleDateString('vi-VN')}</p>
                                <p><strong>Đăng nhập cuối:</strong> {new Date(staff.lastLogin).toLocaleString('vi-VN')}</p>
                                <p><strong>Trạng thái:</strong> <span className={`px-2 py-1 text-xs font-semibold rounded-full ${staff.status === 'Active' ? 'bg-green-100 text-green-800' : staff.status === 'Inactive' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>{getStatusText(staff.status)}</span></p>
                            </div>
                        </div>

                        {/* Specialty & Experience */}
                        <div className="bg-gray-50 p-4 rounded-lg border">
                            <h3 className="text-lg font-semibold text-gray-700 mb-3">Chuyên môn & Kinh nghiệm</h3>
                            <div className="text-sm space-y-2">
                                <p><strong>Chuyên môn:</strong> {staff.specialty?.join(', ') || 'Chưa cập nhật'}</p>
                                <p><strong>Kinh nghiệm:</strong> {staff.experience || 'Chưa cập nhật'}</p>
                            </div>
                        </div>

                        {/* Performance Metrics */}
                        {isTechnician && (
                             <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
                                <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center gap-2"><CalendarCheckIcon className="w-5 h-5 text-blue-600"/> Hiệu suất làm việc</h3>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div><p className="font-medium text-gray-500">Tổng lịch hẹn hoàn thành</p><p className="font-bold text-gray-800 text-lg">{performance.totalAppointments}</p></div>
                                    <div><p className="font-medium text-gray-500">Điểm đánh giá trung bình</p><p className="font-bold text-yellow-500 text-lg flex items-center">{performance.averageRating} <StarIcon className="w-4 h-4 ml-1" /> ({performance.reviewCount})</p></div>
                                </div>
                                {isStaffOfTheMonth && (
                                     <div className="mt-4 p-2 bg-yellow-100 text-yellow-800 rounded-md text-sm font-semibold flex items-center gap-2">
                                        <TrophyIcon className="w-5 h-5" /> Nhân viên xuất sắc trong tháng!
                                     </div>
                                )}
                            </div>
                        )}

                        {/* Work Schedule */}
                        <div className="bg-gray-50 p-4 rounded-lg border">
                            <h3 className="text-lg font-semibold text-gray-700 mb-3">Lịch làm việc</h3>
                            <div className="space-y-3 max-h-40 overflow-y-auto">
                                {staffSchedules.todayAvailability && staffSchedules.todayAvailability.timeSlots.length > 0 ? (
                                    <>
                                        <p className="font-semibold text-gray-700">Hôm nay ({new Date().toLocaleDateString('vi-VN')}):</p>
                                        <div className="text-sm pl-2 border-l-2 border-brand-primary">
                                            {staffSchedules.todayAvailability.timeSlots.map((slot, idx) => (
                                                <div key={idx} className="mb-1">
                                                    <strong className="text-brand-dark">{slot.time}</strong>:
                                                    {slot.availableServiceIds.length > 0
                                                        ? ` ${slot.availableServiceIds.map(id => MOCK_SERVICES.find(s => s.id === id)?.name || id).join(', ')}`
                                                        : ` (Có mặt)`}
                                                    {staffSchedules.todayBooked.some(b => b.time === slot.time) && (
                                                        <span className="text-red-500 ml-2">(Đã đặt)</span>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                ) : (
                                    <p className="text-sm text-gray-500">Chưa có lịch làm việc hoặc lịch hẹn sắp tới cho hôm nay.</p>
                                )}
                                {staffSchedules.upcomingBooked.length > 0 && (
                                    <>
                                        <p className="font-semibold text-gray-700 mt-4">Lịch hẹn sắp tới:</p>
                                        {staffSchedules.upcomingBooked.slice(0, 3).map(s => (
                                            <div key={s.id} className="text-sm pl-2 border-l-2 border-gray-300">
                                                <p><strong className="text-brand-dark">{new Date(s.date).toLocaleDateString('vi-VN')} {s.time}</strong>: {s.serviceName}</p>
                                            </div>
                                        ))}
                                        {staffSchedules.upcomingBooked.length > 3 && <p className="text-xs text-gray-500 mt-2">... và {staffSchedules.upcomingBooked.length - 3} lịch hẹn khác.</p>}
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Login History */}
                        <div className="lg:col-span-2 bg-gray-50 p-4 rounded-lg border">
                            <h3 className="text-lg font-semibold text-gray-700 mb-3">Lịch sử đăng nhập</h3>
                            <div className="max-h-40 overflow-y-auto border rounded-lg">
                                <table className="w-full text-sm">
                                    <thead className="bg-gray-50"><tr className="text-left text-gray-600">
                                        <th className="p-2">Thời gian</th><th className="p-2">Địa chỉ IP</th><th className="p-2">Thiết bị</th>
                                    </tr></thead>
                                    <tbody>
                                        {(staff.loginHistory || []).map((log, i) => (
                                            <tr key={i} className={`border-t ${log.isUnusual ? 'bg-red-50 text-red-800' : ''}`}>
                                                <td className="p-2">{new Date(log.date).toLocaleString('vi-VN')} {log.isUnusual && <span className="font-bold">(Bất thường)</span>}</td>
                                                <td className="p-2">{log.ip}</td><td className="p-2">{log.device}</td>
                                            </tr>
                                        ))}
                                        {(!staff.loginHistory || staff.loginHistory.length === 0) && <tr><td colSpan={3} className="p-4 text-center text-gray-500">Không có dữ liệu.</td></tr>}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                 <div className="bg-gray-50 px-6 py-4 flex justify-end rounded-b-lg">
                    <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Đóng</button>
                </div>
            </div>
        </div>
    );
};

const Pagination: React.FC<{ currentPage: number; totalPages: number; onPageChange: (page: number) => void; }> = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;
    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
        <nav className="mt-8 flex justify-center items-center gap-1" aria-label="Pagination">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50"
            >
                Trước
            </button>
            {pageNumbers.map(number => (
                <button
                    key={number}
                    onClick={() => onPageChange(number)}
                    className={`px-3 py-2 leading-tight border ${
                        currentPage === number
                            ? 'bg-brand-primary text-white border-brand-primary z-10'
                            : 'text-gray-500 bg-white border-gray-300 hover:bg-gray-100'
                    }`}
                >
                    {number}
                </button>
            ))}
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50"
            >
                Sau
            </button>
        </nav>
    );
};


const StaffPage: React.FC = () => {
    const [allUsers, setAllUsers] = useState<User[]>(() => JSON.parse(localStorage.getItem('users') || JSON.stringify(MOCK_USERS)));
    const [allStaffAvailability, setAllStaffAvailability] = useState<StaffDailyAvailability[]>(() => JSON.parse(localStorage.getItem('staffAvailability') || JSON.stringify(MOCK_STAFF_AVAILABILITY)));
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState<UserRole | 'All'>('All');
    const [filterStatus, setFilterStatus] = useState<UserStatus | 'All'>('All');
    const [currentPage, setCurrentPage] = useState(1);
    const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid'); // New state for view mode
    
    // Modal states
    const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
    const [editingStaff, setEditingStaff] = useState<User | null>(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [viewingStaff, setViewingStaff] = useState<User | null>(null);
    const [isAssignScheduleModalOpen, setIsAssignScheduleModalOpen] = useState(false); // New state for schedule modal
    const [staffToAssignSchedule, setStaffToAssignSchedule] = useState<User | null>(null); // New state for staff to assign schedule
    const [toast, setToast] = useState<{ visible: boolean; message: string }>({ visible: false, message: '' });
    
    useEffect(() => {
        // Ensure only staff users are managed here, exclude clients and admin (if not managing admin)
        const staffUsers = allUsers.filter(user => user.role !== 'Client' && user.id !== 'user-admin');
        const updatedUsers = MOCK_USERS.filter(u => STAFF_ROLES.includes(u.role)).map(mockUser => {
            const existingUser = staffUsers.find(u => u.id === mockUser.id);
            return existingUser ? { ...existingUser, ...mockUser } : mockUser;
        });
        // Filter out any default MOCK_USERS clients that might have been added by mistake
        setAllUsers(MOCK_USERS);
    }, []);

    useEffect(() => {
        localStorage.setItem('users', JSON.stringify(allUsers));
    }, [allUsers]);

    useEffect(() => {
        localStorage.setItem('staffAvailability', JSON.stringify(allStaffAvailability));
    }, [allStaffAvailability]);

    const staffMembers = useMemo(() => {
        return allUsers.filter(user => user.role !== 'Client');
    }, [allUsers]);

    const filteredStaff = useMemo(() => {
        return staffMembers
            .filter(staff => staff.name.toLowerCase().includes(searchTerm.toLowerCase()) || staff.email.toLowerCase().includes(searchTerm.toLowerCase()))
            .filter(staff => filterRole === 'All' || staff.role === filterRole)
            .filter(staff => filterStatus === 'All' || staff.status === filterStatus);
    }, [staffMembers, searchTerm, filterRole, filterStatus]);

    const totalPages = Math.ceil(filteredStaff.length / STAFF_PER_PAGE);
    const paginatedStaff = useMemo(() => {
        const startIndex = (currentPage - 1) * STAFF_PER_PAGE;
        return filteredStaff.slice(startIndex, startIndex + STAFF_PER_PAGE);
    }, [filteredStaff, currentPage]);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, filterRole, filterStatus]);
    
    const handleAddStaff = () => { setEditingStaff(null); setIsAddEditModalOpen(true); };
    const handleEditStaff = (staff: User) => { setEditingStaff(staff); setIsAddEditModalOpen(true); };
    const handleViewDetails = (staff: User) => { setViewingStaff(staff); setIsDetailsModalOpen(true); };
    const handleAssignSchedule = (staff: User) => { setStaffToAssignSchedule(staff); setIsAssignScheduleModalOpen(true); };


    const handleSaveStaff = (staff: User) => {
        if (editingStaff) {
            setAllUsers(prev => prev.map(u => u.id === staff.id ? staff : u));
            setToast({ visible: true, message: `Cập nhật thông tin nhân viên ${staff.name} thành công!` });
        } else {
            const newUser: User = { 
                ...staff, 
                id: `staff-${Date.now()}`, 
                profilePictureUrl: staff.profilePictureUrl || `https://picsum.photos/seed/staff-${Date.now()}/200/200`,
                joinDate: new Date().toISOString().split('T')[0], 
                lastLogin: new Date().toISOString(),
                birthday: staff.birthday || '01-01', // Default birthday for new staff
                tierLevel: 1, // Staff don't use tiers
                selfCareIndex: 0,
                gender: staff.gender || 'Other',
                isAdmin: staff.role === 'Admin', // Ensure isAdmin is set correctly based on role
            };
            setAllUsers(prev => [newUser, ...prev]);
            setToast({ visible: true, message: `Thêm nhân viên ${staff.name} thành công!` });
        }
        setIsAddEditModalOpen(false);
        setTimeout(() => setToast({ visible: false, message: '' }), 4000);
    };

    const handleSaveStaffAvailability = (staffId: string, date: string, timeSlots: StaffDailyAvailability['timeSlots']) => {
        setAllStaffAvailability(prev => {
            const existingIndex = prev.findIndex(item => item.staffId === staffId && item.date === date);
            if (timeSlots.length === 0) {
                // If no time slots are selected, remove the availability record
                if (existingIndex !== -1) {
                    setToast({ visible: true, message: `Đã xóa lịch làm việc ngày ${new Date(date).toLocaleDateString('vi-VN')} cho nhân viên.` });
                    return prev.filter((_, index) => index !== existingIndex);
                }
                return prev;
            } else {
                const newAvailability: StaffDailyAvailability = {
                    id: `avail-${staffId}-${date}`,
                    staffId,
                    date,
                    timeSlots: timeSlots,
                };
                if (existingIndex !== -1) {
                    setToast({ visible: true, message: `Đã cập nhật lịch làm việc ngày ${new Date(date).toLocaleDateString('vi-VN')} cho nhân viên.` });
                    return prev.map((item, index) => (index === existingIndex ? newAvailability : item));
                } else {
                    setToast({ visible: true, message: `Đã thêm lịch làm việc ngày ${new Date(date).toLocaleDateString('vi-VN')} cho nhân viên.` });
                    return [...prev, newAvailability];
                }
            }
        });
        setTimeout(() => setToast({ visible: false, message: '' }), 4000);
    };

    const handleToggleLockStaff = (staffId: string) => { 
        setAllUsers(prev => prev.map(u => u.id === staffId ? { ...u, status: u.status === 'Locked' ? 'Active' : 'Locked' } : u)); 
        setToast({ visible: true, message: `Thay đổi trạng thái nhân viên thành công!` });
        setTimeout(() => setToast({ visible: false, message: '' }), 4000);
    };
    
    const handleDeleteStaff = (staffId: string) => { 
        if (window.confirm('Bạn có chắc chắn muốn xóa nhân viên này? Hành động này không thể hoàn tác.')) { 
            setAllUsers(prev => prev.filter(u => u.id !== staffId)); 
            setToast({ visible: true, message: `Đã xóa nhân viên thành công!` });
            setTimeout(() => setToast({ visible: false, message: '' }), 4000);
        } 
    };
    
    return (
        <div>
            {isAddEditModalOpen && <AddEditStaffModal staff={editingStaff} onClose={() => setIsAddEditModalOpen(false)} onSave={handleSaveStaff} />}
            {isDetailsModalOpen && viewingStaff && <StaffDetailsModal staff={viewingStaff} onClose={() => setIsDetailsModalOpen(false)} allStaffAvailability={allStaffAvailability} bookedAppointments={MOCK_STAFF_SCHEDULES} />}
            {isAssignScheduleModalOpen && staffToAssignSchedule && (
                <AssignScheduleModal 
                    staff={staffToAssignSchedule} 
                    allStaffAvailability={allStaffAvailability} 
                    bookedAppointments={MOCK_STAFF_SCHEDULES} 
                    onClose={() => setIsAssignScheduleModalOpen(false)} 
                    onSave={handleSaveStaffAvailability} 
                />
            )}
            
            {toast.visible && (
                <div className="fixed top-24 right-6 bg-green-500 text-white p-4 rounded-lg shadow-lg z-[100] animate-fadeInDown transition-all">
                    <div className="flex items-center gap-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{toast.message}</span>
                    </div>
                </div>
            )}

            <h1 className="text-3xl font-bold text-gray-800 mb-6">Quản lý Nhân viên</h1>
            
            <div className="mb-6 flex flex-col md:flex-row gap-4">
                <div className="relative flex-grow"><input type="text" placeholder="Tìm kiếm theo tên hoặc email..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-brand-primary focus:border-brand-primary" /><SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" /></div>
                <select value={filterRole} onChange={e => setFilterRole(e.target.value as UserRole | 'All')} className="p-3 border border-gray-300 rounded-lg bg-white">
                    <option value="All">Tất cả vai trò</option>
                    {STAFF_ROLES.map(r => <option key={r} value={r}>{ROLE_TRANSLATIONS[r]}</option>)}
                </select>
                <select value={filterStatus} onChange={e => setFilterStatus(e.target.value as UserStatus | 'All')} className="p-3 border border-gray-300 rounded-lg bg-white">
                    <option value="All">Tất cả trạng thái</option>
                    <option value="Active">Hoạt động</option>
                    <option value="Inactive">Không hoạt động</option>
                    <option value="Locked">Đã khóa</option>
                </select>
                <div className="flex items-center bg-gray-200 rounded-lg p-1">
                    <button onClick={() => setViewMode('grid')} className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-white shadow' : 'text-gray-500'}`}><GridIcon className="w-5 h-5" /></button>
                    <button onClick={() => setViewMode('table')} className={`p-2 rounded-md ${viewMode === 'table' ? 'bg-white shadow' : 'text-gray-500'}`}><ListIcon className="w-5 h-5" /></button>
                </div>
                <button onClick={handleAddStaff} className="flex items-center justify-center gap-2 bg-brand-primary text-white font-semibold p-3 rounded-lg hover:bg-brand-dark transition-colors"><PlusIcon className="w-5 h-5" />Thêm</button>
            </div>

            {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {paginatedStaff.map(staff => {
                        const performance = getStaffPerformance(staff.id);
                        const isTechnician = staff.role === 'Technician';
                        return (
                            <div key={staff.id} className={`bg-white rounded-lg shadow-md flex flex-col ${!staff.status || staff.status === 'Inactive' ? 'opacity-70' : ''}`}>
                                <div className="relative">
                                    <img src={staff.profilePictureUrl} alt={staff.name} className="w-full h-40 object-cover rounded-t-lg" />
                                    <div className="absolute top-2 left-2 px-2 py-1 text-xs font-bold rounded-full bg-blue-500 text-white">
                                        {ROLE_TRANSLATIONS[staff.role]}
                                    </div>
                                    {isTechnician && performance.averageRating >= 4.8 && performance.totalAppointments > 50 && (
                                        <div className="absolute top-2 right-2 bg-yellow-400 text-white p-1 rounded-full text-xs font-bold shadow-md" title="Nhân viên xuất sắc">
                                            <TrophyIcon className="w-4 h-4" />
                                        </div>
                                    )}
                                </div>
                                <div className="p-4 flex flex-col flex-grow">
                                    <h3 className="font-bold text-gray-800 text-lg">{staff.name}</h3>
                                    {isTechnician && (
                                        <p className="text-sm text-gray-500 mb-1">{staff.specialty?.join(', ') || 'Chuyên môn: N/A'}</p>
                                    )}
                                    <div className="flex justify-between items-center my-2 text-sm">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${staff.status === 'Active' ? 'bg-green-100 text-green-800' : staff.status === 'Inactive' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>{getStatusText(staff.status)}</span>
                                        {isTechnician && (
                                            <div className="flex items-center gap-1">
                                                <span>{performance.averageRating}</span> <StarIcon className="w-4 h-4 text-yellow-500" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="mt-auto pt-4 border-t flex flex-wrap gap-2 justify-end">
                                        <button onClick={() => handleViewDetails(staff)} className="p-2 text-gray-500 hover:text-blue-600" title="Xem chi tiết"><EyeIcon className="w-5 h-5" /></button>
                                        <button onClick={() => handleEditStaff(staff)} className="p-2 text-gray-500 hover:text-green-600" title="Sửa"><EditIcon className="w-5 h-5" /></button>
                                        <button onClick={() => handleAssignSchedule(staff)} className="p-2 text-gray-500 hover:text-purple-600" title="Phân công lịch"><ScheduleIcon className="w-5 h-5" /></button>
                                        <button onClick={() => handleToggleLockStaff(staff.id)} className="p-2 text-gray-500 hover:text-yellow-600" title={staff.status === 'Locked' ? "Mở khóa" : "Khóa"}><LockClosedIcon className="w-5 h-5" /></button>
                                        <button onClick={() => handleDeleteStaff(staff.id)} className="p-2 text-gray-500 hover:text-red-600" title="Xóa"><TrashIcon className="w-5 h-5" /></button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow-md overflow-x-auto">
                    <table className="w-full whitespace-nowrap">
                        <thead className="bg-gray-50 border-b border-gray-200"><tr className="text-left text-sm font-semibold text-gray-600">
                            <th className="p-4">Nhân viên</th>
                            <th className="p-4">Vai trò</th>
                            <th className="p-4">Chuyên môn</th>
                            <th className="p-4">Điện thoại</th>
                            <th className="p-4">Trạng thái</th>
                            <th className="p-4">Đánh giá TB</th>
                            <th className="p-4">Lịch làm việc</th>
                            <th className="p-4">Hành động</th>
                        </tr></thead>
                        <tbody>
                            {paginatedStaff.map(staff => {
                                const performance = getStaffPerformance(staff.id);
                                return (
                                    <tr key={staff.id} className="border-b border-gray-200 hover:bg-gray-50">
                                        <td className="p-4"><div className="flex items-center gap-3"><img src={staff.profilePictureUrl} alt={staff.name} className="w-10 h-10 rounded-full object-cover" /><div><p className="font-semibold text-gray-800">{staff.name}</p><p className="text-sm text-gray-500">{staff.email}</p></div></div></td>
                                        <td className="p-4"><span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">{ROLE_TRANSLATIONS[staff.role]}</span></td>
                                        <td className="p-4 text-sm text-gray-600">{staff.specialty?.join(', ') || 'N/A'}</td>
                                        <td className="p-4 text-sm text-gray-600">{staff.phone}</td>
                                        <td className="p-4"><span className={`px-2 py-1 text-xs font-semibold rounded-full ${staff.status === 'Active' ? 'bg-green-100 text-green-800' : staff.status === 'Inactive' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>{getStatusText(staff.status)}</span></td>
                                        <td className="p-4 text-sm text-gray-600">
                                            {staff.role === 'Technician' ? (
                                                <div className="flex items-center gap-1">
                                                    <span>{performance.averageRating}</span> <StarIcon className="w-4 h-4 text-yellow-500" />
                                                </div>
                                            ) : 'N/A'}
                                        </td>
                                        <td className="p-4">
                                            <button 
                                                onClick={() => handleAssignSchedule(staff)} 
                                                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-full bg-brand-secondary text-brand-dark hover:bg-brand-primary hover:text-white transition-colors"
                                                title="Phân công lịch làm việc"
                                            >
                                                <ScheduleIcon className="w-4 h-4" /> Phân công
                                            </button>
                                        </td>
                                        <td className="p-4"><div className="flex items-center gap-1">
                                            <button onClick={() => handleViewDetails(staff)} className="p-2 text-gray-500 hover:text-blue-600" title="Xem chi tiết"><EyeIcon className="w-5 h-5" /></button>
                                            <button onClick={() => handleEditStaff(staff)} className="p-2 text-gray-500 hover:text-green-600" title="Chỉnh sửa"><EditIcon className="w-5 h-5" /></button>
                                            <button onClick={() => handleToggleLockStaff(staff.id)} className="p-2 text-gray-500 hover:text-yellow-600" title={staff.status === 'Locked' ? "Mở khóa" : "Khóa"}><LockClosedIcon className="w-5 h-5" /></button>
                                            <button onClick={() => handleDeleteStaff(staff.id)} className="p-2 text-gray-500 hover:text-red-600" title="Xóa"><TrashIcon className="w-5 h-5" /></button>
                                        </div></td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
            
            {totalPages > 0 ? (
                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
            ) : (
                <div className="text-center py-10 text-gray-500">Không tìm thấy nhân viên nào.</div>
            )}
        </div>
    );
};

export default StaffPage;