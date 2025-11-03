
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import type { User, Wallet, Tier, Mission } from '../../types';
import { MOCK_TIERS, MOCK_MISSIONS } from '../../constants';
import { 
    UsersIcon, TrophyIcon, CreditCardIcon, CogIcon, 
    CheckCircleIcon, CameraIcon, EditIcon, ArrowRightIcon 
} from '../../shared/icons';

// --- PROPS ---
interface ProfilePageProps {
    currentUser: User;
    wallet: Wallet;
    onUpdateUser: (user: User) => void;
}

// --- SUB-COMPONENTS ---

const BirthdayModal: React.FC<{ user: User; onClose: () => void }> = ({ user, onClose }) => (
    <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center animate-fadeInUp">
        <div className="bg-white rounded-2xl shadow-2xl p-8 text-center max-w-sm w-full relative overflow-hidden">
            <div className="absolute -top-16 -right-16 text-9xl opacity-10">🎂</div>
            <div className="text-6xl mb-4 animate-pulse">🎉</div>
            <h2 className="text-2xl font-bold font-serif text-brand-dark">Chúc Mừng Sinh Nhật!</h2>
            <p className="text-brand-text my-4">Anh Thơ Spa chúc mừng sinh nhật <strong className="text-brand-primary">{user.name}</strong>! Chúc bạn một ngày thật vui vẻ, hạnh phúc và luôn xinh đẹp rạng ngời.</p>
            <p className="font-semibold text-brand-dark">Chúng tôi gửi tặng bạn một voucher giảm giá 20% như một món quà nhỏ!</p>
            <button onClick={onClose} className="mt-6 w-full bg-brand-primary text-white font-bold py-3 px-6 rounded-lg hover:bg-brand-dark transition-colors">Tuyệt vời!</button>
        </div>
    </div>
);


const ProfilePage: React.FC<ProfilePageProps> = ({ currentUser, wallet, onUpdateUser }) => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview');
    const [theme, setTheme] = useState<'light' | 'dark'>('light');
    const [timeOfDay, setTimeOfDay] = useState<'day' | 'night'>('day');
    const [isBirthday, setIsBirthday] = useState(false);

    const currentTier = useMemo(() => MOCK_TIERS.find(t => t.level === currentUser.tierLevel) || MOCK_TIERS[0], [currentUser.tierLevel]);

    useEffect(() => {
        const hour = new Date().getHours();
        setTimeOfDay(hour >= 6 && hour < 18 ? 'day' : 'night');
    }, []);

    useEffect(() => {
        const today = new Date();
        const todayFormatted = `${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
        if (currentUser.birthday === todayFormatted) {
            setIsBirthday(true);
        }
    }, [currentUser.birthday]);
    
    useEffect(() => {
        document.body.classList.remove('light', 'dark');
        document.body.classList.add(theme);
        if(theme === 'dark') {
             document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [theme]);

    const TABS = [
        { id: 'overview', label: 'Tổng quan', icon: <UsersIcon className="w-5 h-5" /> },
        { id: 'membership', label: 'Thành viên', icon: <TrophyIcon className="w-5 h-5" /> },
        { id: 'transactions', label: 'Giao dịch', icon: <CreditCardIcon className="w-5 h-5" /> },
        { id: 'settings', label: 'Cài đặt', icon: <CogIcon className="w-5 h-5" /> },
    ];

    const TabContent = () => {
        const commonProps = { theme, user: currentUser, wallet };
        switch(activeTab) {
            case 'membership':
                return <MembershipTab {...commonProps} />;
            case 'transactions':
                return <TransactionsTab theme={theme} />;
            case 'settings':
                return <SettingsTab theme={theme} setTheme={setTheme} />;
            case 'overview':
            default:
                return <OverviewTab {...commonProps} currentTier={currentTier} onUpdateUser={onUpdateUser} />;
        }
    }

    return (
        <div className={`min-h-screen relative overflow-hidden transition-colors duration-500 ${timeOfDay === 'day' ? 'bg-gradient-to-br from-brand-secondary to-rose-100' : 'bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-800'}`}>
            {isBirthday && <BirthdayModal user={currentUser} onClose={() => setIsBirthday(false)} />}
            <div className="absolute inset-0 bg-cover bg-center opacity-20" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/az-subtle.png')" }}></div>
            
            <div className="container mx-auto px-4 py-12 relative z-10">
                <button
                    onClick={() => navigate(-1)}
                    className={`flex items-center font-semibold mb-8 transition-colors group ${timeOfDay === 'day' ? 'text-brand-dark hover:text-brand-primary' : 'text-gray-300 hover:text-white'}`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 transition-transform group-hover:-translate-x-1" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" /></svg>
                    Quay lại
                </button>

                <div className={`w-full max-w-4xl mx-auto rounded-2xl ${theme === 'light' ? 'bg-white/60' : 'bg-black/20'} backdrop-blur-2xl shadow-2xl p-4 md:p-6 ring-1 ring-black/5`}>
                    <div className="flex flex-col md:flex-row gap-4">
                        <nav className="flex-shrink-0 md:w-48">
                            <ul className="flex md:flex-col gap-1">
                                {TABS.map(tab => (
                                    <li key={tab.id} className="flex-1">
                                        <button 
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`w-full flex items-center gap-3 p-3 rounded-lg text-sm font-semibold transition-all duration-300 ${
                                                activeTab === tab.id
                                                    ? (theme === 'light' ? 'bg-white/80 text-brand-dark shadow-md' : 'bg-white/30 text-white shadow-md')
                                                    : (theme === 'light' ? 'text-brand-text/80 hover:bg-white/50' : 'text-white/60 hover:bg-white/10')
                                            }`}
                                        >
                                            {tab.icon}
                                            <span className="hidden md:inline">{tab.label}</span>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                        <main className={`flex-1 ${theme === 'light' ? 'bg-white/40' : 'bg-white/5'} rounded-lg p-4 md:p-6 min-h-[60vh] animate-fadeInUp`}>
                            <TabContent />
                        </main>
                    </div>
                </div>
            </div>
        </div>
    );
};

const OverviewTab: React.FC<{user: User, wallet: Wallet, currentTier: Tier, onUpdateUser: (user: User) => void, theme: 'light' | 'dark'}> = ({ user, wallet, currentTier, onUpdateUser, theme }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<User>(user);

    useEffect(() => {
        setFormData(user);
    }, [user]);

    const handleSave = () => {
        onUpdateUser(formData);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setFormData(user);
        setIsEditing(false);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const calculateProfileCompletion = (user: User) => {
        let completed = 0;
        const total = 4; // name, phone, birthday, gender
        if (user.name) completed++;
        if (user.phone) completed++;
        const birthDate = user.birthday ? new Date(user.birthday) : null;
        if (birthDate && !isNaN(birthDate.getTime())) completed++;
        if (user.gender) completed++;
        return Math.round((completed / total) * 100);
    };
    const completionPercentage = calculateProfileCompletion(user);
    
    const birthdayForInput = useMemo(() => {
        const [month, day] = user.birthday.split('-');
        if (month && day) {
            // Find a non-leap year to be safe, e.g., 2001
            return `2001-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        }
        return '';
    }, [user.birthday]);


    return (
         <div className={`${theme === 'light' ? 'text-brand-text' : 'text-white'}`}>
            <div className="flex justify-between items-start mb-6">
                <div className="flex flex-col sm:flex-row items-center gap-6">
                    <div className="relative group">
                         <img src={user.profilePictureUrl} alt={user.name} className="w-28 h-28 rounded-full object-cover ring-4 ring-white/20" />
                         {/* Dynamic glow effect based on tier color */}
                         <div className="absolute inset-0 rounded-full z-0" 
                            style={{ 
                                boxShadow: `0 0 15px 5px ${currentTier.color}`, 
                                animation: 'pulse 2s infinite cubic-bezier(0.4, 0, 0.6, 1)' 
                            }}></div>
                         <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                            <CameraIcon className="w-8 h-8 text-white" />
                         </div>
                    </div>
                    <div>
                         <h1 className={`text-3xl font-bold flex items-center gap-2 ${theme === 'light' ? 'text-brand-dark' : 'text-white'}`}>{user.name} <CheckCircleIcon className="w-6 h-6 text-sky-400" title="Tài khoản đã xác minh" /></h1>
                         <p className={`font-bold text-lg ${currentTier.textColor}`} style={{ color: currentTier.color }}>Hạng {currentTier.name}</p>
                         <p className={`text-sm ${theme === 'light' ? 'text-brand-text/80' : 'text-white/70'}`}>Tham gia từ: {new Date(user.joinDate).toLocaleDateString('vi-VN')}</p>
                    </div>
                </div>
                {!isEditing && (
                    <button onClick={() => setIsEditing(true)} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${theme === 'light' ? 'bg-brand-secondary/70 text-brand-dark hover:bg-brand-secondary' : 'bg-white/20 text-white hover:bg-white/30'}`}>
                        <EditIcon className="w-4 h-4" /> Chỉnh sửa
                    </button>
                )}
            </div>

            {isEditing ? (
                <div className="space-y-4 animate-fadeInUp">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className={`text-xs ${theme === 'light' ? 'text-brand-text/80' : 'text-white/70'}`}>Họ và tên</label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange} className={`w-full p-2 rounded-md mt-1 border focus:ring-pink-400 focus:border-pink-400 ${theme === 'light' ? 'bg-white/80 border-brand-primary/30 text-brand-dark' : 'bg-white/10 border-white/20 text-white'}`} />
                        </div>
                        <div>
                            <label className={`text-xs ${theme === 'light' ? 'text-brand-text/80' : 'text-white/70'}`}>Số điện thoại</label>
                            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className={`w-full p-2 rounded-md mt-1 border focus:ring-pink-400 focus:border-pink-400 ${theme === 'light' ? 'bg-white/80 border-brand-primary/30 text-brand-dark' : 'bg-white/10 border-white/20 text-white'}`} />
                        </div>
                        <div>
                            <label className={`text-xs ${theme === 'light' ? 'text-brand-text/80' : 'text-white/70'}`}>Ngày sinh</label>
                            <input type="date" name="birthday" value={formData.birthday} onChange={handleChange} className={`w-full p-2 rounded-md mt-1 border focus:ring-pink-400 focus:border-pink-400 ${theme === 'light' ? 'bg-white/80 border-brand-primary/30 text-brand-dark' : 'bg-white/10 border-white/20 text-white'}`} />
                        </div>
                         <div>
                            <label className={`text-xs ${theme === 'light' ? 'text-brand-text/80' : 'text-white/70'}`}>Giới tính</label>
                            <select name="gender" value={formData.gender || ''} onChange={handleChange} className={`w-full p-2 rounded-md mt-1 border focus:ring-pink-400 focus:border-pink-400 ${theme === 'light' ? 'bg-white/80 border-brand-primary/30 text-brand-dark' : 'bg-white/10 border-white/20 text-white'}`}>
                                <option value="">Chọn giới tính</option>
                                <option value="Nữ">Nữ</option>
                                <option value="Nam">Nam</option>
                                <option value="Khác">Khác</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex justify-end gap-4 mt-6">
                        <button onClick={handleCancel} className={`px-4 py-2 rounded-lg font-semibold ${theme === 'light' ? 'bg-gray-200 text-gray-800 hover:bg-gray-300' : 'bg-white/20 text-white hover:bg-white/30'}`}>Hủy</button>
                        <button onClick={handleSave} className="bg-pink-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-pink-600">Lưu thay đổi</button>
                    </div>
                </div>
            ) : (
                <div className="space-y-6">
                    <div className={`${theme === 'light' ? 'bg-white/30' : 'bg-white/10'} p-5 rounded-lg`}>
                        <h3 className={`font-semibold mb-3 ${theme === 'light' ? 'text-brand-dark' : 'text-white/80'}`}>Thông tin cơ bản</h3>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                           <p><strong className={`${theme === 'light' ? 'text-brand-text' : 'text-white/60'} block`}>Email:</strong> <span className={theme==='light' ? 'text-brand-dark font-medium' : ''}>{user.email}</span></p>
                           <p><strong className={`${theme === 'light' ? 'text-brand-text' : 'text-white/60'} block`}>Điện thoại:</strong> <span className={theme==='light' ? 'text-brand-dark font-medium' : ''}>{user.phone || 'Chưa cập nhật'}</span></p>
                           <p><strong className={`${theme === 'light' ? 'text-brand-text' : 'text-white/60'} block`}>Ngày sinh:</strong> <span className={theme==='light' ? 'text-brand-dark font-medium' : ''}>{user.birthday ? new Date(birthdayForInput).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }) : 'Chưa cập nhật'}</span></p>
                           <p><strong className={`${theme === 'light' ? 'text-brand-text' : 'text-white/60'} block`}>Giới tính:</strong> <span className={theme==='light' ? 'text-brand-dark font-medium' : ''}>{user.gender || 'Chưa cập nhật'}</span></p>
                        </div>
                    </div>
                    <div className={`${theme === 'light' ? 'bg-white/30' : 'bg-white/10'} p-5 rounded-lg`}>
                        <div className="flex justify-between items-center mb-2">
                           <h3 className={`font-semibold ${theme === 'light' ? 'text-brand-dark' : 'text-white/80'}`}>Độ hoàn thiện hồ sơ</h3>
                           <span className="font-bold text-pink-400">{completionPercentage}%</span>
                        </div>
                        <div className={`w-full ${theme === 'light' ? 'bg-gray-200' : 'bg-white/20'} rounded-full h-2`}>
                            <div className="bg-pink-400 h-2 rounded-full" style={{ width: `${completionPercentage}%` }}></div>
                        </div>
                    </div>
                </div>
            )}
         </div>
    );
};

const MembershipTab: React.FC<{user: User, wallet: Wallet, theme: 'light' | 'dark'}> = ({ user, wallet, theme }) => {
    const currentTier = MOCK_TIERS.find(t => t.level === user.tierLevel)!;
    const nextTier = MOCK_TIERS.find(t => t.level === user.tierLevel + 1);
    
    const progressToNextTierByPoints = nextTier ? (wallet.points / nextTier.pointsRequired) * 100 : 100;
    const progressToNextTierBySpending = nextTier ? ((user.totalSpending || 0) / nextTier.minSpendingRequired) * 100 : 100;
    
    // Use the lower of the two progresses for a more realistic "overall" progress bar
    const overallProgress = Math.min(progressToNextTierByPoints, progressToNextTierBySpending);

    return (
        <div className={theme === 'light' ? 'text-brand-text' : 'text-white/90'}>
             <h2 className={`text-2xl font-bold mb-6 ${theme === 'light' ? 'text-brand-dark' : 'text-white'}`}>Thành viên & Điểm thưởng</h2>
             <div className={`${theme === 'light' ? 'bg-white/30' : 'bg-white/10'} p-5 rounded-lg mb-8`}>
                <div className="flex justify-between items-center mb-2">
                    <h3 className="font-bold text-lg" style={{ color: currentTier.color }}>Hạng {currentTier.name}</h3>
                    {nextTier && <span className={`text-sm ${theme === 'light' ? 'text-brand-text/80' : 'text-white/70'}`}>Lên hạng {nextTier.name}</span>}
                </div>
                 <div className={`w-full ${theme === 'light' ? 'bg-gray-200' : 'bg-white/20'} rounded-full h-2.5`}>
                    <div className="h-2.5 rounded-full" style={{ width: `${overallProgress}%`, backgroundColor: currentTier.color }}></div>
                </div>
                <div className={`flex justify-between items-center text-sm mt-2 ${theme === 'light' ? 'text-brand-text/80' : 'text-white/70'}`}>
                     <span className={theme === 'light' ? 'font-medium text-brand-dark' : ''}>{wallet.points.toLocaleString()} điểm</span>
                     {nextTier ? <span>{nextTier.pointsRequired.toLocaleString()} điểm</span> : <span>Đã đạt hạng cao nhất</span>}
                </div>
                {nextTier && (
                    <div className="mt-4 text-sm space-y-1">
                        <p className={theme === 'light' ? 'text-brand-dark' : 'text-white/80'}>
                            Để đạt hạng <strong style={{ color: nextTier.color }}>{nextTier.name}</strong>, bạn cần:
                        </p>
                        <ul className={`list-disc list-inside pl-4 ${theme === 'light' ? 'text-brand-text/80' : 'text-white/70'}`}>
                            <li>Thêm <strong className={wallet.points >= nextTier.pointsRequired ? 'text-green-500' : 'text-red-500'}>{(nextTier.pointsRequired - wallet.points).toLocaleString()} điểm</strong></li>
                            <li>Tổng chi tiêu: <strong className={(user.totalSpending || 0) >= nextTier.minSpendingRequired ? 'text-green-500' : 'text-red-500'}>
                                {new Intl.NumberFormat('vi-VN').format(Math.max(0, nextTier.minSpendingRequired - (user.totalSpending || 0)))} đ
                            </strong></li>
                        </ul>
                        <p className="flex items-center gap-2 text-xs text-brand-primary mt-3">
                            <ArrowRightIcon className="w-3 h-3 text-brand-primary"/>
                            Ghé thăm <a href="#/promotions" className="underline font-semibold">Cửa hàng Loyalty</a> để đổi quà!
                        </p>
                    </div>
                )}
             </div>
             <h3 className={`text-xl font-bold mb-4 ${theme === 'light' ? 'text-brand-dark' : 'text-white'}`}>Nhiệm vụ hàng ngày</h3>
             <div className="space-y-3">
                 {MOCK_MISSIONS.map(mission => (
                     <div key={mission.id} className={`p-4 rounded-lg flex justify-between items-center ${
                         mission.isCompleted 
                            ? (theme === 'light' ? 'bg-green-100' : 'bg-green-500/20') 
                            : (theme === 'light' ? 'bg-white/30' : 'bg-white/10')
                        }`}>
                         <div>
                             <p className={`font-semibold ${theme === 'light' ? 'text-brand-dark' : ''}`}>{mission.title}</p>
                             <p className="text-sm text-yellow-500">+{mission.points} điểm</p>
                         </div>
                         <input type="checkbox" checked={mission.isCompleted} readOnly className={`form-checkbox h-5 w-5 rounded text-brand-primary cursor-pointer ${theme === 'light' ? 'bg-white/50 border-gray-300' : 'bg-transparent border-white/30'}`}/>
                     </div>
                 ))}
             </div>
        </div>
    );
};

const TransactionsTab: React.FC<{ theme: 'light' | 'dark' }> = ({ theme }) => {
    // Mock data for chart
    const spendingData = [ { month: 'T5', amount: 1200000 }, { month: 'T6', amount: 2500000 }, { month: 'T7', amount: 1800000 }];
    const maxAmount = Math.max(...spendingData.map(d => d.amount));
    
    return (
         <div className={theme === 'light' ? 'text-brand-text' : 'text-white/90'}>
             <h2 className={`text-2xl font-bold mb-6 ${theme === 'light' ? 'text-brand-dark' : 'text-white'}`}>Lịch sử giao dịch</h2>
             <div className={`${theme === 'light' ? 'bg-white/30' : 'bg-white/10'} p-5 rounded-lg mb-8`}>
                <h3 className={`font-semibold text-center mb-4 ${theme === 'light' ? 'text-brand-dark' : 'text-white'}`}>Thống kê chi tiêu 3 tháng gần nhất</h3>
                <div className="flex justify-around items-end h-32">
                    {spendingData.map(data => (
                         <div key={data.month} className="flex flex-col items-center">
                            <div 
                                className="w-8 bg-pink-400 rounded-t-md hover:opacity-80 transition-opacity"
                                style={{ height: `${(data.amount / maxAmount) * 100}%`}}
                                title={`${data.amount.toLocaleString()}đ`}
                            ></div>
                            <span className={`text-xs mt-2 ${theme === 'light' ? 'text-brand-text' : 'text-white/70'}`}>{data.month}</span>
                         </div>
                    ))}
                </div>
             </div>
             <p className={`text-center text-sm ${theme === 'light' ? 'text-brand-text/80' : 'text-white/60'}`}>Tính năng lịch sử chi tiết đang được phát triển.</p>
        </div>
    );
};

const SettingsTab: React.FC<{ theme: 'light' | 'dark', setTheme: (theme: 'light' | 'dark') => void }> = ({ theme, setTheme }) => {
    const Toggle = ({ label, enabled }: { label: string, enabled: boolean }) => (
        <div className={`flex justify-between items-center p-4 rounded-lg ${theme === 'light' ? 'bg-white/30' : 'bg-white/10'}`}>
            <span className={`font-semibold ${theme === 'light' ? 'text-brand-dark' : 'text-white'}`}>{label}</span>
            <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked={enabled} className="sr-only peer" />
                <div className={`w-11 h-6 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-500 ${theme === 'light' ? 'bg-gray-200' : 'bg-white/30'}`}></div>
            </label>
        </div>
    );

    return (
        <div className={theme === 'light' ? 'text-brand-text' : 'text-white/90'}>
            <h2 className={`text-2xl font-bold mb-6 ${theme === 'light' ? 'text-brand-dark' : 'text-white'}`}>Cài đặt & Bảo mật</h2>
            <div className="space-y-4">
                <div className={`${theme === 'light' ? 'bg-white/30' : 'bg-white/10'} p-4 rounded-lg`}>
                    <h3 className={`font-semibold mb-3 ${theme === 'light' ? 'text-brand-dark' : 'text-white'}`}>Giao diện</h3>
                    <div className="flex items-center gap-4">
                        <span className={theme === 'light' ? 'text-brand-dark' : ''}>Chế độ:</span>
                        <button onClick={() => setTheme('light')} className={`px-4 py-1 rounded-full text-sm font-semibold transition-colors ${theme === 'light' ? 'bg-brand-primary text-white' : 'bg-gray-500 text-white'}`}>Sáng</button>
                        <button onClick={() => setTheme('dark')} className={`px-4 py-1 rounded-full text-sm font-semibold transition-colors ${theme === 'dark' ? 'bg-brand-primary text-white' : 'bg-gray-500 text-white'}`}>Tối</button>
                    </div>
                </div>
                <Toggle label="Nhận thông báo ưu đãi" enabled={true} />
                <Toggle label="Cảnh báo đăng nhập lạ" enabled={false} />
                <button className={`w-full text-center p-4 rounded-lg font-semibold transition-colors ${theme === 'light' ? 'bg-white/30 text-brand-dark hover:bg-white/50' : 'bg-white/10 text-white hover:bg-white/20'}`}>Tải xuống dữ liệu cá nhân</button>
            </div>
        </div>
    );
};


export default ProfilePage;