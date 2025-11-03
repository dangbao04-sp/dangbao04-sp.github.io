import React, { useState, useMemo, useEffect } from 'react';
import { MOCK_USERS, MOCK_APPOINTMENTS, MOCK_SERVICES, MOCK_TIERS } from '../../constants';
import type { User, UserRole, UserStatus, LoginAttempt, Wallet } from '../../types';
import { PlusIcon, SearchIcon,EditIcon,TrashIcon, LockClosedIcon,
    EyeIcon,KeyIcon,ChartBarIcon,GiftIcon,MinusIcon,TrophyIconFilled
} from '../../shared/icons';

const USERS_PER_PAGE = 8;
const USER_ROLES: UserRole[] = ['Client', 'Admin']; // Only show clients and admin in this table
const ROLE_TRANSLATIONS: Record<UserRole, string> = {
    'Admin': 'Quản trị viên',
    'Manager': 'Quản lý',
    'Technician': 'Kỹ thuật viên',
    'Receptionist': 'Lễ tân',
    'Client': 'Khách hàng',
};

const getStatusText = (status: UserStatus): string => {
    switch (status) {
        case 'Active': return 'Hoạt động';
        case 'Inactive': return 'Không hoạt động';
        case 'Locked': return 'Đã khóa';
        default: return status;
    }
};

const getCustomerAnalytics = (userId: string) => {
    const userAppointments = MOCK_APPOINTMENTS.filter(a => a.userId === userId && a.status === 'completed');
    const totalSpending = userAppointments.reduce((sum, app) => {
        const service = MOCK_SERVICES.find(s => s.id === app.serviceId);
        return sum + (service?.price || 0);
    }, 0);

    const serviceCounts = userAppointments.reduce((acc, app) => {
        acc[app.serviceName] = (acc[app.serviceName] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const favoriteService = Object.entries(serviceCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Chưa có';
    
    return { totalSpending, favoriteService };
};

const AddEditUserModal: React.FC<{ user: User | null; onClose: () => void; onSave: (user: User) => void; }> = ({ user, onClose, onSave }) => {
    const [formData, setFormData] = useState<Partial<User>>(user || { role: 'Client', status: 'Active' });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData as User);
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-lg w-full" onClick={e => e.stopPropagation()}>
                <form onSubmit={handleSubmit}>
                    <div className="p-6">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">{user ? 'Chỉnh sửa người dùng' : 'Thêm người dùng mới'}</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div><label className="block text-sm font-medium text-gray-700">Họ tên</label><input type="text" name="name" value={formData.name || ''} onChange={handleChange} className="mt-1 w-full p-2 border rounded" required /></div>
                            <div><label className="block text-sm font-medium text-gray-700">Email</label><input type="email" name="email" value={formData.email || ''} onChange={handleChange} className="mt-1 w-full p-2 border rounded" required /></div>
                            <div><label className="block text-sm font-medium text-gray-700">Số điện thoại</label><input type="tel" name="phone" value={formData.phone || ''} onChange={handleChange} className="mt-1 w-full p-2 border rounded" /></div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Vai trò</label>
                                <select name="role" value={formData.role} onChange={handleChange} className="mt-1 w-full p-2 border rounded">
                                    {USER_ROLES.map(r => <option key={r} value={r}>{ROLE_TRANSLATIONS[r]}</option>)}
                                </select>
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

const UserDetailsModal: React.FC<{ user: User; onClose: () => void; }> = ({ user, onClose }) => {
    const analytics = useMemo(() => user.role === 'Client' ? getCustomerAnalytics(user.id) : null, [user]);
    const userTier = MOCK_TIERS.find(t => t.level === user.tierLevel) || MOCK_TIERS[0];
    const userWallet: Wallet = useMemo(() => {
        const saved = localStorage.getItem('userWallet');
        return saved ? JSON.parse(saved) : { balance: 0, points: 0 }; // Default if not found
    }, [user.id]); // Recalculate if user changes

    return (
         <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full" onClick={e => e.stopPropagation()}>
                <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-4">
                            <img src={user.profilePictureUrl} alt={user.name} className="w-16 h-16 rounded-full object-cover"/>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800">{user.name}</h2>
                                <p className="text-gray-500">{user.email}</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg mb-6 border">
                        <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center gap-2"><TrophyIconFilled className="w-5 h-5 text-brand-primary"/>Thông tin thành viên</h3>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div><p className="font-medium text-gray-500">Cấp độ</p><p className={`font-bold ${userTier.textColor}`} style={{ color: userTier.color }}>{userTier.name}</p></div>
                            <div><p className="font-medium text-gray-500">Tổng điểm</p><p className="font-bold text-brand-dark">{userWallet.points?.toLocaleString() || 0} điểm</p></div>
                            <div><p className="font-medium text-gray-500">Tổng chi tiêu</p><p className="font-bold text-brand-dark">{new Intl.NumberFormat('vi-VN').format(user.totalSpending || 0)}đ</p></div>
                        </div>
                    </div>

                    {analytics && (
                         <div className="bg-gray-50 p-4 rounded-lg mb-6 border">
                            <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center gap-2"><ChartBarIcon className="w-5 h-5 text-brand-primary"/> Phân Tích Khách Hàng (AI)</h3>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div><p className="font-medium text-gray-500">Dịch vụ yêu thích</p><p className="font-bold text-brand-dark">{analytics.favoriteService}</p></div>
                                <div><p className="font-medium text-gray-500">Tổng chi tiêu</p><p className="font-bold text-brand-dark">{new Intl.NumberFormat('vi-VN').format(analytics.totalSpending)}đ</p></div>
                            </div>
                        </div>
                    )}

                    <div>
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">Lịch sử đăng nhập</h3>
                        <div className="max-h-60 overflow-y-auto border rounded-lg">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-50"><tr className="text-left text-gray-600">
                                    <th className="p-2">Thời gian</th><th className="p-2">Địa chỉ IP</th><th className="p-2">Thiết bị</th>
                                </tr></thead>
                                <tbody>
                                    {(user.loginHistory || []).map((log, i) => (
                                        <tr key={i} className={`border-t ${log.isUnusual ? 'bg-red-50 text-red-800' : ''}`}>
                                            <td className="p-2">{new Date(log.date).toLocaleString('vi-VN')} {log.isUnusual && <span className="font-bold">(Bất thường)</span>}</td>
                                            <td className="p-2">{log.ip}</td><td className="p-2">{log.device}</td>
                                        </tr>
                                    ))}
                                    {(!user.loginHistory || user.loginHistory.length === 0) && <tr><td colSpan={3} className="p-4 text-center text-gray-500">Không có dữ liệu.</td></tr>}
                                </tbody>
                            </table>
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

const DirectResetPasswordModal: React.FC<{
    user: User;
    onClose: () => void;
    onSave: (userId: string, newPassword: string) => void;
}> = ({ user, onClose, onSave }) => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setError('Mật khẩu xác nhận không khớp.');
            return;
        }
        if (newPassword.length < 6) {
            setError('Mật khẩu phải có ít nhất 6 ký tự.');
            return;
        }
        onSave(user.id, newPassword);
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full" onClick={e => e.stopPropagation()}>
                <form onSubmit={handleSubmit}>
                    <div className="p-6">
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Đặt lại mật khẩu</h2>
                        <p className="text-gray-600 mb-4">Bạn đang đặt lại mật khẩu cho người dùng: <strong className="text-brand-dark">{user.name}</strong></p>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Mật khẩu mới</label>
                                <input 
                                    type="password" 
                                    value={newPassword}
                                    onChange={(e) => { setNewPassword(e.target.value); setError(''); }}
                                    className="mt-1 w-full p-2 border rounded" 
                                    required 
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Xác nhận mật khẩu mới</label>
                                <input 
                                    type="password" 
                                    value={confirmPassword}
                                    onChange={(e) => { setConfirmPassword(e.target.value); setError(''); }}
                                    className="mt-1 w-full p-2 border rounded" 
                                    required 
                                />
                            </div>
                            {error && <p className="text-red-500 text-sm">{error}</p>}
                        </div>
                    </div>
                    <div className="bg-gray-50 px-6 py-4 flex justify-end gap-4 rounded-b-lg">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Hủy</button>
                        <button type="submit" className="px-4 py-2 bg-brand-primary text-white rounded-md hover:bg-brand-dark">Lưu mật khẩu mới</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const GivePointsModal: React.FC<{
    user: User;
    currentWallet: Wallet;
    onClose: () => void;
    onSavePoints: (userId: string, newPoints: number, reason: string) => void;
}> = ({ user, currentWallet, onClose, onSavePoints }) => {
    const [pointsChange, setPointsChange] = useState(0);
    const [reason, setReason] = useState('');
    const [isAdding, setIsAdding] = useState(true);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const finalPoints = isAdding ? (currentWallet.points + pointsChange) : (currentWallet.points - pointsChange);
        onSavePoints(user.id, finalPoints, reason);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full" onClick={e => e.stopPropagation()}>
                <form onSubmit={handleSubmit}>
                    <div className="p-6">
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Điều chỉnh điểm thưởng</h2>
                        <p className="text-gray-600 mb-4">Người dùng: <strong className="text-brand-dark">{user.name}</strong> (Điểm hiện tại: {currentWallet.points.toLocaleString()})</p>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Loại điều chỉnh</label>
                                <div className="flex gap-4 mt-1">
                                    <label className="flex items-center gap-2">
                                        <input type="radio" checked={isAdding} onChange={() => setIsAdding(true)} className="text-brand-primary" /> Cộng điểm
                                    </label>
                                    <label className="flex items-center gap-2">
                                        <input type="radio" checked={!isAdding} onChange={() => setIsAdding(false)} className="text-brand-primary" /> Trừ điểm
                                    </label>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Số điểm</label>
                                <input 
                                    type="number" 
                                    value={pointsChange}
                                    onChange={(e) => setPointsChange(Math.max(0, parseInt(e.target.value) || 0))}
                                    className="mt-1 w-full p-2 border rounded" 
                                    min="0"
                                    required 
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Lý do (tùy chọn)</label>
                                <textarea 
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                    rows={2}
                                    className="mt-1 w-full p-2 border rounded" 
                                />
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


const Pagination: React.FC<{ currentPage: number; totalPages: number; onPageChange: (page: number) => void; }> = ({ currentPage, totalPages, onPageChange }) => (
    <div className="mt-6 flex justify-between items-center">
        <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} className="px-4 py-2 text-sm bg-white border rounded-md disabled:opacity-50">Trước</button>
        <span className="text-sm text-gray-600">Trang {currentPage} / {totalPages}</span>
        <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} className="px-4 py-2 text-sm bg-white border rounded-md disabled:opacity-50">Sau</button>
    </div>
);


const UsersPage: React.FC = () => {
    const [allUsers, setAllUsers] = useState<User[]>(() => JSON.parse(localStorage.getItem('users') || JSON.stringify(MOCK_USERS)));
    const [wallets, setWallets] = useState<Record<string, Wallet>>(() => {
        const savedWallets = localStorage.getItem('allUserWallets');
        return savedWallets ? JSON.parse(savedWallets) : {};
    });

    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState<UserRole | 'All'>('All');
    const [filterStatus, setFilterStatus] = useState<UserStatus | 'All'>('All');
    const [currentPage, setCurrentPage] = useState(1);
    
    // Modal states
    const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [viewingUser, setViewingUser] = useState<User | null>(null);
    const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
    const [userToReset, setUserToReset] = useState<User | null>(null);
    const [isDirectResetModalOpen, setIsDirectResetModalOpen] = useState(false);
    const [userForDirectReset, setUserForDirectReset] = useState<User | null>(null);
    const [isGivePointsModalOpen, setIsGivePointsModalOpen] = useState(false); // New state
    const [userToGivePoints, setUserToGivePoints] = useState<User | null>(null); // New state
    const [toast, setToast] = useState<{ visible: boolean, message: string }>({ visible: false, message: '' });
    
    useEffect(() => {
        localStorage.setItem('users', JSON.stringify(allUsers));
    }, [allUsers]);

    useEffect(() => {
        localStorage.setItem('allUserWallets', JSON.stringify(wallets));
    }, [wallets]);

    // Initialize wallets for new users or if not present
    useEffect(() => {
        const initialWallets: Record<string, Wallet> = {};
        allUsers.forEach(user => {
            if (!wallets[user.id]) {
                initialWallets[user.id] = { balance: 0, points: 0, spinsLeft: 0 };
            }
        });
        if (Object.keys(initialWallets).length > 0) {
            setWallets(prev => ({ ...prev, ...initialWallets }));
        }
    }, [allUsers, wallets]);


    // Filter out staff roles from this view
    const clientUsers = useMemo(() => {
        return allUsers.filter(user => user.role === 'Client' || user.role === 'Admin'); // Keep admin here for overall user management
    }, [allUsers]);

    const filteredUsers = useMemo(() => {
        return clientUsers
            .filter(user => user.name.toLowerCase().includes(searchTerm.toLowerCase()) || user.email.toLowerCase().includes(searchTerm.toLowerCase()))
            .filter(user => filterRole === 'All' || user.role === filterRole)
            .filter(user => filterStatus === 'All' || user.status === filterStatus);
    }, [clientUsers, searchTerm, filterRole, filterStatus]);

    const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE);
    const paginatedUsers = useMemo(() => {
        const startIndex = (currentPage - 1) * USERS_PER_PAGE;
        return filteredUsers.slice(startIndex, startIndex + USERS_PER_PAGE);
    }, [filteredUsers, currentPage]);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, filterRole, filterStatus]);
    
    const handleAddUser = () => { setEditingUser(null); setIsAddEditModalOpen(true); };
    const handleEditUser = (user: User) => { setEditingUser(user); setIsAddEditModalOpen(true); };
    const handleViewDetails = (user: User) => { setViewingUser(user); setIsDetailsModalOpen(true); };
    const handleGivePoints = (user: User) => { setUserToGivePoints(user); setIsGivePointsModalOpen(true); };

    const handleSaveUser = (user: User) => {
        if (editingUser) {
            setAllUsers(prev => prev.map(u => u.id === user.id ? user : u));
        } else {
            const newUser: User = { ...user, id: `user-${Date.now()}`, profilePictureUrl: 'https://picsum.photos/seed/new-user/200/200', joinDate: new Date().toISOString(), lastLogin: new Date().toISOString(), totalSpending: 0, lastTierUpgradeDate: new Date().toISOString() };
            setAllUsers(prev => [newUser, ...prev]);
            // Initialize wallet for new user
            setWallets(prev => ({ ...prev, [newUser.id]: { balance: 0, points: 0, spinsLeft: 0 } }));
        }
        setIsAddEditModalOpen(false);
    };

    const handleSavePoints = (userId: string, newPoints: number, reason: string) => {
        setWallets(prev => ({ ...prev, [userId]: { ...prev[userId], points: newPoints } }));
        setToast({ visible: true, message: `Điểm của ${allUsers.find(u => u.id === userId)?.name} đã được cập nhật.` });
        setTimeout(() => setToast({ visible: false, message: '' }), 4000);
        setIsGivePointsModalOpen(false);
        setUserToGivePoints(null);
    };

    const handleToggleLockUser = (userId: string) => { setAllUsers(prev => prev.map(u => u.id === userId ? { ...u, status: u.status === 'Locked' ? 'Active' : 'Locked' } : u)); };
    
    const handleResetPassword = (user: User) => {
        if (user.role === 'Client') {
            setUserToReset(user);
            setIsResetConfirmOpen(true);
        } else {
            setUserForDirectReset(user);
            setIsDirectResetModalOpen(true);
        }
    };
    
    const handleConfirmResetPassword = () => {
        if (userToReset) {
            setToast({ visible: true, message: `Đã gửi email đặt lại mật khẩu cho ${userToReset.name}.` });
            setTimeout(() => setToast({ visible: false, message: '' }), 4000);
            setIsResetConfirmOpen(false);
            setUserToReset(null);
        }
    };
    
    const handleSaveNewPassword = (userId: string, newPassword: string) => {
        setAllUsers(prevUsers => prevUsers.map(u => 
            u.id === userId ? { ...u, password: newPassword } : u
        ));
        setIsDirectResetModalOpen(false);
        setUserForDirectReset(null);
        setToast({ visible: true, message: `Đã cập nhật mật khẩu thành công.` });
        setTimeout(() => setToast({ visible: false, message: '' }), 4000);
    };


    const handleDeleteUser = (userId: string) => { if (window.confirm('Bạn có chắc chắn muốn xóa người dùng này?')) { setAllUsers(prev => prev.filter(u => u.id !== userId)); } };
    
    return (
        <div>
            {isAddEditModalOpen && <AddEditUserModal user={editingUser} onClose={() => setIsAddEditModalOpen(false)} onSave={handleSaveUser} />}
            {isDetailsModalOpen && viewingUser && <UserDetailsModal user={viewingUser} onClose={() => setIsDetailsModalOpen(false)} />}
            {isDirectResetModalOpen && userForDirectReset && (
                <DirectResetPasswordModal 
                    user={userForDirectReset} 
                    onClose={() => setIsDirectResetModalOpen(false)} 
                    onSave={handleSaveNewPassword} 
                />
            )}
            {isGivePointsModalOpen && userToGivePoints && (
                <GivePointsModal
                    user={userToGivePoints}
                    currentWallet={wallets[userToGivePoints.id] || { balance: 0, points: 0, spinsLeft: 0 }}
                    onClose={() => setIsGivePointsModalOpen(false)}
                    onSavePoints={handleSavePoints}
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
            
            {isResetConfirmOpen && userToReset && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4" onClick={() => setIsResetConfirmOpen(false)}>
                    <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full text-center transform transition-all animate-fadeIn" onClick={(e) => e.stopPropagation()}>
                        <div className="mx-auto mb-4 w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
                            <svg className="w-10 h-10 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-brand-dark mb-4">Xác nhận Đặt lại Mật khẩu</h2>
                        <p className="text-md text-brand-text mb-6">
                            Bạn có chắc chắn muốn gửi email đặt lại mật khẩu cho khách hàng <strong className="text-brand-primary">{userToReset.name}</strong>?
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <button onClick={() => setIsResetConfirmOpen(false)} className="w-full sm:w-auto bg-gray-200 text-gray-800 font-bold py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors duration-300">
                                Hủy
                            </button>
                            <button onClick={handleConfirmResetPassword} className="w-full sm:w-auto bg-brand-primary text-white font-bold py-3 px-6 rounded-lg hover:bg-brand-dark transition-colors duration-300">
                                Xác nhận
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <h1 className="text-3xl font-bold text-gray-800 mb-6">Quản lý Người dùng</h1>
            
            <div className="mb-6 flex flex-col md:flex-row gap-4">
                <div className="relative flex-grow"><input type="text" placeholder="Tìm kiếm theo tên hoặc email..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-brand-primary focus:border-brand-primary" /><SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" /></div>
                <select value={filterRole} onChange={e => setFilterRole(e.target.value as UserRole | 'All')} className="p-3 border border-gray-300 rounded-lg bg-white">
                    <option value="All">Tất cả vai trò</option>
                    {USER_ROLES.map(r => <option key={r} value={r}>{ROLE_TRANSLATIONS[r]}</option>)}
                </select>
                <select value={filterStatus} onChange={e => setFilterStatus(e.target.value as UserStatus | 'All')} className="p-3 border border-gray-300 rounded-lg bg-white">
                    <option value="All">Tất cả trạng thái</option>
                    <option value="Active">Hoạt động</option>
                    <option value="Inactive">Không hoạt động</option>
                    <option value="Locked">Đã khóa</option>
                </select>
                <button onClick={handleAddUser} className="flex items-center justify-center gap-2 bg-brand-primary text-white font-semibold p-3 rounded-lg hover:bg-brand-dark transition-colors"><PlusIcon className="w-5 h-5" />Thêm</button>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-x-auto">
                <table className="w-full whitespace-nowrap">
                    <thead className="bg-gray-50 border-b border-gray-200"><tr className="text-left text-sm font-semibold text-gray-600"><th className="p-4">Người dùng</th><th className="p-4">Vai trò</th><th className="p-4">Điểm</th><th className="p-4">Trạng thái</th><th className="p-4">Đăng nhập cuối</th><th className="p-4">Hành động</th></tr></thead>
                    <tbody>
                        {paginatedUsers.map(user => (
                            <tr key={user.id} className="border-b border-gray-200 hover:bg-gray-50">
                                <td className="p-4"><div className="flex items-center gap-3"><img src={user.profilePictureUrl} alt={user.name} className="w-10 h-10 rounded-full object-cover" /><div><p className="font-semibold text-gray-800">{user.name}</p><p className="text-sm text-gray-500">{user.email}</p></div></div></td>
                                <td className="p-4"><span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">{ROLE_TRANSLATIONS[user.role]}</span></td>
                                <td className="p-4 text-sm text-gray-600 font-semibold">{wallets[user.id]?.points.toLocaleString() || 0}</td>
                                <td className="p-4"><span className={`px-2 py-1 text-xs font-semibold rounded-full ${user.status === 'Active' ? 'bg-green-100 text-green-800' : user.status === 'Inactive' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>{getStatusText(user.status)}</span></td>
                                <td className="p-4 text-sm text-gray-600">{new Date(user.lastLogin).toLocaleString('vi-VN')}</td>
                                <td className="p-4"><div className="flex items-center gap-1">
                                    <button onClick={() => handleViewDetails(user)} className="p-2 text-gray-500 hover:text-blue-600" title="Xem chi tiết"><EyeIcon className="w-5 h-5" /></button>
                                    <button onClick={() => handleEditUser(user)} className="p-2 text-gray-500 hover:text-green-600" title="Chỉnh sửa"><EditIcon className="w-5 h-5" /></button>
                                    <button onClick={() => handleGivePoints(user)} className="p-2 text-gray-500 hover:text-orange-600" title="Tặng/Trừ điểm"><GiftIcon className="w-5 h-5" /></button>
                                    <button onClick={() => handleToggleLockUser(user.id)} className="p-2 text-gray-500 hover:text-yellow-600" title={user.status === 'Locked' ? "Mở khóa" : "Khóa"}><LockClosedIcon className="w-5 h-5" /></button>
                                    <button onClick={() => handleResetPassword(user)} className="p-2 text-gray-500 hover:text-purple-600" title="Đặt lại mật khẩu"><KeyIcon className="w-5 h-5" /></button>
                                    <button onClick={() => handleDeleteUser(user.id)} className="p-2 text-gray-500 hover:text-red-600" title="Xóa"><TrashIcon className="w-5 h-5" /></button>
                                </div></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            {totalPages > 0 ? (
                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
            ) : (
                <div className="text-center py-10 text-gray-500">Không tìm thấy người dùng nào.</div>
            )}
        </div>
    );
};

export default UsersPage;