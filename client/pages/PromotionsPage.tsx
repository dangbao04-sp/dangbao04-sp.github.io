

import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { MOCK_PROMOTIONS, MOCK_REDEEMABLE_VOUCHERS, MOCK_POINTS_HISTORY, LUCKY_WHEEL_PRIZES, MOCK_USERS, MOCK_TIERS } from '../../constants';
import type { Promotion, Wallet, RedeemableVoucher, PointsHistory, User } from '../../types';
import { MOCK_SERVICES } from '../../constants';
import { ArrowRightIcon, GiftIcon, HistoryIcon, ClockIcon } from '../../shared/icons';

interface PromotionsPageProps {
    wallet: Wallet;
    setWallet: React.Dispatch<React.SetStateAction<Wallet>>;
    userVouchers: Promotion[];
    setUserVouchers: React.Dispatch<React.SetStateAction<Promotion[]>>;
}

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

type Prize = typeof LUCKY_WHEEL_PRIZES[0];

// Countdown Hook
const useCountdown = (targetDate: string) => {
    const calculateTimeLeft = () => {
        const difference = +new Date(targetDate) - +new Date();
        let timeLeft = {
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0,
        };

        if (difference > 0) {
            timeLeft = {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60),
            };
        }

        return timeLeft;
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
        const timer = setTimeout(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearTimeout(timer);
    });

    return timeLeft;
};

// Helper to determine if promo is "Expiring Soon"
const isExpiringSoon = (expiryDate: string) => {
    const now = new Date();
    const expiry = new Date(expiryDate);
    const diffDays = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays > 0 && diffDays <= 7; // Expires within 7 days
};

const PromotionsPage: React.FC<PromotionsPageProps> = ({ wallet, setWallet, userVouchers, setUserVouchers }) => {
    const navigate = useNavigate();
    const [promotions, setPromotions] = useState<Promotion[]>(() => {
        const saved = localStorage.getItem('promotions');
        return saved ? JSON.parse(saved) : MOCK_PROMOTIONS;
    });
    const [redeemableVouchers, setRedeemableVouchers] = useState<RedeemableVoucher[]>(() => {
        const saved = localStorage.getItem('redeemableVouchers');
        return saved ? JSON.parse(saved) : MOCK_REDEEMABLE_VOUCHERS;
    });

    const [viewingPromo, setViewingPromo] = useState<Promotion | null>(null);

    const [activeTab, setActiveTab] = useState<'redeem' | 'history'>('redeem');
    
    // Lucky Wheel State
    const [isSpinning, setIsSpinning] = useState(false);
    const [wheelRotation, setWheelRotation] = useState(0);
    const [spinResultModal, setSpinResultModal] = useState<Prize | null>(null);

    // Current user for eligibility checks (mock from local storage)
    const currentUser: User | null = useMemo(() => {
        const savedUser = localStorage.getItem('currentUser');
        return savedUser ? JSON.parse(savedUser) : null;
    }, []);


    useEffect(() => {
        localStorage.setItem('userVouchers', JSON.stringify(userVouchers));
        // Also update the main promotions list if a voucher from a promotion was claimed
        localStorage.setItem('promotions', JSON.stringify(promotions));
    }, [userVouchers, promotions]);

    const availablePromotions = useMemo(() => {
        const claimedPromoIds = new Set(userVouchers.map(v => v.id));
        return promotions.filter(promo => {
            // Check expiry date
            if (new Date(promo.expiryDate) < new Date()) return false;
            
            // Check if claimed
            if (claimedPromoIds.has(promo.id)) return false;

            // Check target audience eligibility
            if (promo.targetAudience === 'New Clients' && currentUser && currentUser.joinDate && (new Date(currentUser.joinDate).getTime() + (30 * 24 * 60 * 60 * 1000)) < new Date().getTime()) {
                // If user is not new client anymore
                return false;
            }
            if (promo.targetAudience === 'Birthday' && currentUser && currentUser.birthday) {
                const today = new Date();
                const [month, day] = currentUser.birthday.split('-');
                if (!(parseInt(month) === (today.getMonth() + 1) && parseInt(day) === today.getDate())) {
                    return false; // Not user's birthday today
                }
            }
            if (promo.targetAudience === 'VIP' && currentUser && currentUser.tierLevel < 5) { // Assuming VIP is Tier 5+
                return false;
            }
            if (promo.targetAudience?.startsWith('Tier Level') && currentUser) {
                const requiredLevel = parseInt(promo.targetAudience.split(' ')[2]);
                if (currentUser.tierLevel < requiredLevel) {
                    return false;
                }
            }
            // For now, always show 'All' and other specific promotions will be filtered out based on real user data
            // For mock, simply return true for 'All' and handle others as above.
            return true;
        });
    }, [promotions, userVouchers, currentUser]);


    const handleRedeemVoucher = (voucher: RedeemableVoucher) => {
        if (!currentUser) {
            alert('Vui lòng đăng nhập để đổi voucher.');
            return;
        }

        // Check target audience for redeemable voucher
        if (voucher.targetAudience === 'VIP' && currentUser.tierLevel < 5) {
            alert('Bạn không đủ điều kiện VIP để đổi voucher này.');
            return;
        }
        if (voucher.targetAudience?.startsWith('Tier Level')) {
            const requiredLevel = parseInt(voucher.targetAudience.split(' ')[2]);
            if (currentUser.tierLevel < requiredLevel) {
                alert(`Bạn cần hạng ${MOCK_TIERS.find(t => t.level === requiredLevel)?.name} trở lên để đổi voucher này.`);
                return;
            }
        }

        if (wallet.points < voucher.pointsRequired) {
            alert('Bạn không đủ điểm để đổi voucher này.');
            return;
        }

        setWallet(prev => ({ ...prev, points: prev.points - voucher.pointsRequired }));
        
        const newVoucher: Promotion = {
            id: `uv-${Date.now()}`,
            title: voucher.description,
            description: `Voucher trị giá ${formatCurrency(voucher.value)}`,
            code: `VOUCHER${Math.floor(1000 + Math.random() * 9000)}`,
            expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days expiry
            imageUrl: 'https://picsum.photos/seed/voucher/500/300',
            discountType: 'fixed',
            discountValue: voucher.value,
            termsAndConditions: `Voucher áp dụng cho tất cả dịch vụ. Không có giá trị quy đổi thành tiền mặt.`,
            targetAudience: 'All', // Default for now
            applicableServiceIds: voucher.applicableServiceIds,
            minOrderValue: 0,
            usageCount: 0,
        };

        setUserVouchers(prev => [...prev, newVoucher]);
        alert(`Đổi voucher thành công! Mã của bạn là: ${newVoucher.code}`);
    };

    const handleClaimPromotion = (promoToClaim: Promotion) => {
        if (!currentUser) {
            alert('Vui lòng đăng nhập để nhận ưu đãi.');
            return;
        }
        if (userVouchers.some(v => v.id === promoToClaim.id)) {
            return;
        }
        setUserVouchers(prev => [...prev, promoToClaim]);
        setPromotions(prev => prev.map(p => p.id === promoToClaim.id ? { ...p, usageCount: (p.usageCount || 0) + 1 } : p));
        alert(`Bạn đã nhận ưu đãi "${promoToClaim.title}"! Mã: ${promoToClaim.code}`);
    };

    const handleSpin = () => {
        if (isSpinning || (wallet.spinsLeft ?? 0) <= 0) return;

        setWallet(prev => ({...prev, spinsLeft: (prev.spinsLeft ?? 0) - 1}));
        setIsSpinning(true);

        const prizes = LUCKY_WHEEL_PRIZES;
        const totalPrizes = prizes.length;
        const randomPrizeIndex = Math.floor(Math.random() * totalPrizes);
        const prize = prizes[randomPrizeIndex];
        const segmentAngle = 360 / totalPrizes;
        
        // Calculate target rotation
        const randomOffset = (Math.random() - 0.5) * (segmentAngle * 0.8);
        const targetAngle = (randomPrizeIndex * segmentAngle) + (segmentAngle / 2) + randomOffset;
        const finalRotation = (360 * 5) + (360 - targetAngle); // 5 full spins + target prize

        setWheelRotation(finalRotation);

        setTimeout(() => {
            setIsSpinning(false);
            setSpinResultModal(prize);

            switch (prize.type) {
                case 'points':
                    setWallet(prev => ({ ...prev, points: prev.points + prize.value }));
                    break;
                case 'spin':
                    setWallet(prev => ({...prev, spinsLeft: (prev.spinsLeft ?? 0) + prize.value}));
                    break;
                case 'voucher':
                case 'voucher_fixed':
                    const newVoucher: Promotion = {
                        id: `uv-wheel-${Date.now()}`,
                        title: prize.type === 'voucher' ? `Voucher giảm ${prize.value}%` : `Voucher giảm ${formatCurrency(prize.value)}`,
                        description: `Voucher từ Vòng quay may mắn.`,
                        code: `LUCKY${Math.floor(1000 + Math.random() * 9000)}`,
                        expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                        imageUrl: 'https://picsum.photos/seed/lucky-voucher/500/300',
                        discountType: prize.type === 'voucher' ? 'percentage' : 'fixed',
                        discountValue: prize.value,
                        termsAndConditions: 'Voucher áp dụng cho lần đặt lịch tiếp theo.',
                        targetAudience: 'All',
                        applicableServiceIds: [],
                        minOrderValue: 0,
                        usageCount: 0,
                    };
                    setUserVouchers(prev => [...prev, newVoucher]);
                    break;
            }
             // Reset rotation slightly so CSS transition will re-trigger
             setWheelRotation(finalRotation % 360);
        }, 4500); // slightly longer than CSS transition
    };

    const wheelPrizes = LUCKY_WHEEL_PRIZES;
    const segmentColors = ['#F3E9E1', '#FFF7F0', '#F3E9E1', '#FFF7F0', '#F3E9E1', '#FFF7F0', '#F3E9E1', '#FFF7F0'];
    const conicGradient = `conic-gradient(${segmentColors.map((color, i) => `${color} ${i * (100/wheelPrizes.length)}%, ${color} ${(i+1) * (100/wheelPrizes.length)}%`).join(', ')})`;


    return (
        <div className="container mx-auto px-4 py-12">
            <button onClick={() => navigate(-1)} className="flex items-center text-brand-dark font-semibold hover:text-brand-primary mb-6 transition-colors group" aria-label="Quay lại trang trước">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 transition-transform group-hover:-translate-x-1" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" /></svg>
                Quay lại
            </button>

            <div className="relative bg-brand-primary text-white rounded-lg shadow-lg overflow-hidden p-8 md:p-12 mb-16 text-center md:text-left">
                <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-white/10 rounded-full"></div>
                <div className="absolute top-4 left-4 w-24 h-24 bg-white/10 rounded-full"></div>
                <div className="relative z-10">
                    <h1 className="text-3xl md:text-4xl font-serif font-bold mb-2">Ưu Đãi Đặc Biệt Trong Tháng</h1>
                    <p className="text-lg mb-6">Đừng bỏ lỡ cơ hội làm đẹp với giá tốt nhất chỉ có tại Anh Thơ Spa!</p>
                    <a href="#promotions" className="inline-flex items-center bg-white text-brand-dark font-bold py-2 px-6 rounded-full shadow-md hover:bg-brand-secondary transition-transform transform hover:scale-105">
                        Khám Phá Ngay <ArrowRightIcon />
                    </a>
                </div>
            </div>

            <div id="promotions">
                <h2 className="text-3xl font-serif font-bold text-brand-dark text-center mb-10">Danh sách khuyến mãi</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {availablePromotions.length > 0 ? (
                        availablePromotions.map(promo => {
                            const timeLeft = useCountdown(promo.expiryDate);
                            const isExpired = timeLeft.days <= 0 && timeLeft.hours <= 0 && timeLeft.minutes <= 0 && timeLeft.seconds <= 0;
                            const expiringSoon = isExpiringSoon(promo.expiryDate) && !isExpired;
                            const isClaimedByUser = userVouchers.some(v => v.id === promo.id);

                            return (
                                <div key={promo.id} className="group perspective-1000">
                                    <div className={`relative bg-white rounded-lg shadow-lg overflow-hidden transition-transform duration-700 preserve-3d group-hover:rotate-y-180 ${isExpired ? 'opacity-60 grayscale' : ''}`}>
                                        {/* Front of the card */}
                                        <div className="absolute w-full h-full backface-hidden flex flex-col">
                                            <div className="relative">
                                                <img src={promo.imageUrl} alt={promo.title} className="w-full h-48 object-cover" />
                                                {(expiringSoon && !isExpired) && (
                                                    <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                                                        SẮP HẾT HẠN!
                                                    </span>
                                                )}
                                                {promo.targetAudience && promo.targetAudience !== 'All' && (
                                                    <span className="absolute top-2 left-2 bg-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                                                        {promo.targetAudience === 'New Clients' ? 'Khách hàng mới' : promo.targetAudience === 'Birthday' ? 'Ưu đãi sinh nhật' : promo.targetAudience === 'VIP' ? 'VIP' : `Hạng ${promo.targetAudience.split(' ')[2]}`}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="p-4 flex flex-col flex-grow">
                                                <h3 className="text-lg font-bold font-serif text-brand-dark mb-2 h-14">{promo.title}</h3>
                                                <p className="text-sm text-brand-text mb-4 flex-grow line-clamp-2">{promo.description}</p>
                                                <div className="mt-auto">
                                                    <div className="flex items-center justify-between text-sm text-gray-500">
                                                        <span className="font-semibold text-brand-primary">
                                                            {promo.discountType === 'percentage' ? `${promo.discountValue}%` : formatCurrency(promo.discountValue)}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <ClockIcon className="w-4 h-4" />
                                                            {isExpired ? 'Hết hạn' : `${timeLeft.days}d ${timeLeft.hours}h ${timeLeft.minutes}m`}
                                                        </span>
                                                    </div>
                                                    <button className="mt-4 w-full bg-brand-secondary text-brand-dark font-semibold py-2 px-4 rounded-md text-sm">
                                                        Xem chi tiết
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Back of the card */}
                                        <div className="absolute w-full h-full rotate-y-180 backface-hidden bg-brand-light p-4 flex flex-col justify-between">
                                            <div>
                                                <h3 className="text-xl font-bold font-serif text-brand-dark mb-2">{promo.title}</h3>
                                                <p className="text-sm text-brand-text mb-3">{promo.termsAndConditions}</p>
                                                <p className="text-sm text-gray-600 mb-2">Mã: <span className="font-mono bg-gray-200 px-1.5 py-0.5 rounded text-xs">{promo.code}</span></p>
                                                <p className="text-sm text-gray-600">Hạn sử dụng: {new Date(promo.expiryDate).toLocaleDateString('vi-VN')}</p>
                                                {promo.minOrderValue && promo.minOrderValue > 0 && (
                                                    <p className="text-sm text-gray-600 mt-1">Đơn hàng tối thiểu: {formatCurrency(promo.minOrderValue)}</p>
                                                )}
                                                {promo.applicableServiceIds && promo.applicableServiceIds.length > 0 && (
                                                    <p className="text-sm text-gray-600 mt-1">Áp dụng cho: {promo.applicableServiceIds.map(id => MOCK_SERVICES.find(s => s.id === id)?.name).filter(Boolean).join(', ')}</p>
                                                )}
                                            </div>
                                            <button
                                                onClick={() => handleClaimPromotion(promo)}
                                                disabled={isExpired || isClaimedByUser}
                                                className={`w-full font-semibold py-2 px-4 rounded-md text-sm transition-colors mt-4
                                                    ${isExpired ? 'bg-gray-400 text-white cursor-not-allowed' :
                                                      isClaimedByUser ? 'bg-green-500 text-white cursor-not-allowed' :
                                                      'bg-brand-dark text-white hover:bg-brand-primary'}
                                                `}
                                            >
                                                {isExpired ? 'Đã hết hạn' : isClaimedByUser ? 'Đã nhận ưu đãi' : 'Nhận ưu đãi'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="col-span-full text-center py-10 bg-white rounded-lg shadow-md">
                            <p className="text-lg text-brand-text">Không có ưu đãi nào khả dụng vào lúc này.</p>
                            <p className="text-sm text-gray-500 mt-2">Hãy kiểm tra lại sau để không bỏ lỡ các chương trình mới nhé.</p>
                        </div>
                    )}
                </div>
            </div>

             {/* Lucky Wheel Section */}
            <div className="mt-20">
                <h2 className="text-3xl font-serif font-bold text-brand-dark text-center mb-10">Vòng Quay May Mắn</h2>
                <div className="flex flex-col items-center">
                    <div className="relative w-80 h-80 sm:w-96 sm:h-96">
                        {/* Pointer */}
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20" style={{ filter: 'drop-shadow(0 4px 3px rgba(0,0,0,0.4))' }}>
                            <svg width="30" height="45" viewBox="0 0 30 45" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M15 45L0.277568 22.5L29.7224 22.5L15 45Z" fill="#eab308"/>
                                <circle cx="15" cy="22.5" r="5" fill="#fef08a"/>
                            </svg>
                        </div>
                        
                        {/* Wheel */}
                        <div 
                            className="relative w-full h-full rounded-full border-8 border-yellow-300 shadow-xl transition-transform duration-[4000ms] ease-out"
                            style={{ 
                                transform: `rotate(${wheelRotation}deg)`,
                                background: conicGradient
                            }}
                        >
                            {/* Prize Labels */}
                            {wheelPrizes.map((prize, index) => {
                                const angle = (360 / wheelPrizes.length) * index + (360 / wheelPrizes.length / 2);
                                const radius = 110;
                                return (
                                <div 
                                    key={index}
                                    className="absolute top-1/2 left-1/2"
                                    style={{ 
                                        transform: `rotate(${angle}deg) translate(0, -${radius}px) rotate(-${angle}deg) translate(-50%, -50%)`
                                    }}
                                >
                                    <span className="text-sm font-bold text-brand-dark text-center block w-20 transform -rotate-90">{prize.label}</span>
                                </div>
                                );
                            })}
                        </div>

                        {/* Spin Button */}
                        <button
                            onClick={handleSpin}
                            disabled={isSpinning || (wallet.spinsLeft ?? 0) <= 0}
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-brand-primary rounded-full text-white font-bold text-xl shadow-inner z-10 border-4 border-yellow-300 hover:bg-brand-dark disabled:bg-gray-400 disabled:cursor-not-allowed transition-all transform hover:scale-110"
                        >
                            QUAY
                        </button>
                    </div>
                    <p className="text-center mt-6 text-brand-text">Bạn còn <strong className="text-brand-dark text-lg">{wallet.spinsLeft ?? 0}</strong> lượt quay.</p>
                </div>
            </div>
            
            <div className="mt-20">
                <h2 className="text-3xl font-serif font-bold text-brand-dark text-center mb-4">Chương Trình Khách Hàng Thân Thiết</h2>
                <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg text-center mb-10">
                     <p className="text-sm text-gray-500">Tổng điểm của bạn</p>
                     <p className="text-4xl font-bold text-brand-dark my-2">{wallet.points.toLocaleString('vi-VN')} <span className="text-2xl text-brand-primary">điểm</span></p>
                     <p className="text-xs text-gray-400">Tích điểm với mỗi lần sử dụng dịch vụ để đổi lấy những phần quà hấp dẫn!</p>
                </div>
                
                <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg">
                    <div className="flex border-b">
                         <button onClick={() => setActiveTab('redeem')} className={`flex-1 p-4 font-semibold flex items-center justify-center gap-2 transition-colors ${activeTab === 'redeem' ? 'text-brand-primary border-b-2 border-brand-primary' : 'text-gray-500 hover:bg-gray-50'}`}>
                            <GiftIcon className="w-5 h-5"/> Đổi Thưởng & Voucher Của Bạn
                        </button>
                        <button onClick={() => setActiveTab('history')} className={`flex-1 p-4 font-semibold flex items-center justify-center gap-2 transition-colors ${activeTab === 'history' ? 'border-b-2 border-brand-primary' : 'text-gray-500 hover:bg-gray-50'}`}>
                            <HistoryIcon className="w-5 h-5"/> Lịch Sử Điểm
                        </button>
                    </div>

                    <div className="p-6">
                        {activeTab === 'redeem' ? (
                            <div>
                                <h3 className="text-lg font-bold text-brand-dark mb-4">Đổi Voucher</h3>
                                <div className="space-y-4">
                                    {redeemableVouchers.map(voucher => (
                                        <div key={voucher.id} className="flex justify-between items-center p-4 bg-brand-light rounded-md">
                                            <div>
                                                <p className="font-semibold text-brand-dark">{voucher.description}</p>
                                                <p className="text-sm text-brand-primary font-bold">{voucher.pointsRequired.toLocaleString('vi-VN')} điểm</p>
                                            </div>
                                            <button 
                                                onClick={() => handleRedeemVoucher(voucher)}
                                                disabled={wallet.points < voucher.pointsRequired || !currentUser || 
                                                    (voucher.targetAudience === 'VIP' && currentUser.tierLevel < 5) ||
                                                    (voucher.targetAudience?.startsWith('Tier Level') && currentUser.tierLevel < parseInt(voucher.targetAudience.split(' ')[2]))
                                                }
                                                className="bg-brand-dark text-white font-semibold px-4 py-2 rounded-md text-sm transition-colors hover:bg-brand-primary disabled:bg-gray-400 disabled:cursor-not-allowed"
                                            >
                                                Đổi
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                <h3 className="text-lg font-bold text-brand-dark mt-8 mb-4 border-t pt-6">Voucher của bạn</h3>
                                {userVouchers.length > 0 ? (
                                    <div className="space-y-4">
                                        {userVouchers.map(uv => (
                                            <div key={uv.id} className="flex justify-between items-center p-4 bg-green-50 border-l-4 border-green-500 rounded-md">
                                                 <div>
                                                    <p className="font-semibold text-green-800">{uv.title}</p>
                                                    <p className="text-sm text-gray-600 mt-1">Mã: <span className="font-mono bg-gray-200 px-1.5 py-0.5 rounded text-xs">{uv.code}</span></p>
                                                </div>
                                                <button onClick={() => navigate(`/booking?promoCode=${uv.code}`)} className="bg-green-600 text-white font-semibold px-4 py-2 rounded-md text-sm hover:bg-green-700">Dùng ngay</button>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-center text-gray-500 italic">Bạn chưa có voucher nào. Hãy tích điểm và đổi ngay nhé!</p>
                                )}
                            </div>
                        ) : (
                             <div className="space-y-3 max-h-80 overflow-y-auto">
                                {MOCK_POINTS_HISTORY.map(item => (
                                    <div key={item.id} className="flex justify-between items-center p-3 border-b last:border-b-0">
                                        <div>
                                            <p className="font-medium text-brand-text">{item.description}</p>
                                            <p className="text-xs text-gray-500">{new Date(item.date).toLocaleDateString('vi-VN')}</p>
                                        </div>
                                        <span className={`font-bold text-lg ${item.pointsChange > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                            {item.pointsChange > 0 ? `+${item.pointsChange.toLocaleString('vi-VN')}` : item.pointsChange.toLocaleString('vi-VN')}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {viewingPromo && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4" onClick={() => setViewingPromo(null)}>
                    <div className="bg-white p-8 rounded-lg shadow-xl max-w-lg w-full transform transition-all animate-fadeIn" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-between items-start mb-4">
                            <h2 className="text-2xl font-serif font-bold text-brand-dark">{viewingPromo.title}</h2>
                            <button onClick={() => setViewingPromo(null)} className="text-gray-400 hover:text-gray-800 text-3xl font-light leading-none">&times;</button>
                        </div>
                        <div className="space-y-4">
                            <img src={viewingPromo.imageUrl} alt={viewingPromo.title} className="w-full h-48 object-cover rounded-md mb-4" />
                            <p className="text-brand-text">{viewingPromo.description}</p>
                             <div className="grid grid-cols-2 gap-4 border-t border-b py-4">
                                <div>
                                    <p className="text-sm text-gray-500">Mã khuyến mãi</p>
                                    <p className="font-mono bg-gray-200 text-brand-dark px-2 py-1 rounded-md inline-block mt-1">{viewingPromo.code}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Giá trị</p>
                                    <p className="font-bold text-brand-primary text-lg mt-1">
                                        {viewingPromo.discountType === 'percentage'
                                            ? `Giảm ${viewingPromo.discountValue}%`
                                            : `Giảm ${formatCurrency(viewingPromo.discountValue)}`}
                                    </p>
                                </div>
                            </div>
                            <div>
                                <h4 className="font-bold text-brand-dark">Điều khoản & Điều kiện:</h4>
                                <p className="text-sm text-gray-600 italic mt-1">{viewingPromo.termsAndConditions}</p>
                            </div>
                             <p className="text-sm text-brand-text"><span className="font-semibold">Hết hạn:</span> {new Date(viewingPromo.expiryDate).toLocaleDateString('vi-VN')}</p>
                        </div>
                        <div className="mt-6 text-right">
                             <button onClick={() => navigate(`/booking?promoCode=${viewingPromo.code}`)} className="bg-brand-dark text-white font-bold py-2 px-6 rounded-lg hover:bg-brand-primary transition-colors duration-300">
                                Đặt Lịch & Dùng Mã
                            </button>
                        </div>
                    </div>
                </div>
            )}
             {spinResultModal && (
                <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 animate-fadeInUp">
                    <div className="bg-white rounded-2xl shadow-2xl p-8 text-center max-w-sm w-full relative overflow-hidden">
                        <div className="absolute -top-16 -right-16 text-9xl opacity-10">🎁</div>
                        <div className="text-6xl mb-4 animate-bounce">
                            {spinResultModal.type === 'nothing' ? 'Ôi, Tiếc Quá!' : 'Chúc Mừng!'}
                        </div>
                        <p className="text-brand-text my-4">
                            Bạn đã quay trúng ô <strong className="text-brand-primary">{spinResultModal.label}</strong>!
                        </p>
                        <button onClick={() => setSpinResultModal(null)} className="mt-6 w-full bg-brand-primary text-white font-bold py-3 px-6 rounded-lg hover:bg-brand-dark transition-colors">
                            Tuyệt vời!
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PromotionsPage;