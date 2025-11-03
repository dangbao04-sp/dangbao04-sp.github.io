

import React, { useState, useMemo, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { MOCK_SERVICES, AVAILABLE_TIMES, MOCK_THERAPISTS, MOCK_PROMOTIONS } from '../../constants';
import type { Service, Therapist, Promotion } from '../../types';
import { StarIcon } from '../../shared/icons';;

const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};

export const BookingPage: React.FC = () => { // FIX: Changed to named export
    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);
    const initialServiceId = queryParams.get('serviceId') || '';
    const initialPromoCode = queryParams.get('promoCode') || '';
    const initialTherapistId = queryParams.get('therapistId') || MOCK_THERAPISTS[0].id;

    const [currentStep, setCurrentStep] = useState(1);
    const [selectedServiceId, setSelectedServiceId] = useState<string>(initialServiceId);
    const [selectedDate, setSelectedDate] = useState<string>('');
    const [selectedTime, setSelectedTime] = useState<string>('');
    const [selectedTherapistId, setSelectedTherapistId] = useState<string>(initialTherapistId);
    const [showConfirmation, setShowConfirmation] = useState(false);
    
    // State for promo code
    const [promoCode, setPromoCode] = useState(initialPromoCode);
    const [appliedPromo, setAppliedPromo] = useState<{ code: string; discount: number } | null>(null);
    const [promoError, setPromoError] = useState('');
    const [isPromoListVisible, setIsPromoListVisible] = useState(false);
    
    const [userVouchers] = useState<Promotion[]>(() => {
        const saved = localStorage.getItem('userVouchers');
        return saved ? JSON.parse(saved) : [];
    });


    const steps = ["Chọn Dịch Vụ", "Chọn Thời Gian", "Chọn Nhân Viên", "Xác Nhận"];

    const selectedService = useMemo(() => MOCK_SERVICES.find(s => s.id === selectedServiceId), [selectedServiceId]);
    const selectedTherapist = useMemo(() => MOCK_THERAPISTS.find(t => t.id === selectedTherapistId), [selectedTherapistId]);
    
    const allAvailablePromos = useMemo(() => {
        const promoMap = new Map<string, Promotion>();
        MOCK_PROMOTIONS.forEach(p => promoMap.set(p.code, p));
        userVouchers.forEach(v => promoMap.set(v.code, v));
        return Array.from(promoMap.values());
    }, [userVouchers]);


    // Reset promo when service changes, but not if there's an initial code
    useEffect(() => {
        if (!initialPromoCode) {
            setPromoCode('');
            setAppliedPromo(null);
            setPromoError('');
        }
    }, [selectedServiceId, initialPromoCode]);

     // Automatically try to apply promo code from URL
    useEffect(() => {
        if (initialPromoCode && currentStep === 4) {
            handleApplyPromo(initialPromoCode);
        }
    }, [initialPromoCode, currentStep]);


    const handleNextStep = () => setCurrentStep(prev => Math.min(prev + 1, steps.length));
    const handlePrevStep = () => {
        if (currentStep === 4) {
            setAppliedPromo(null);
            setPromoCode('');
            setPromoError('');
        }
        setCurrentStep(prev => Math.max(prev - 1, 1));
    };
    
    const getTimeSlotStatus = (time: string, date: string) => {
        if (!date) return 'disabled';
        const day = new Date(date).getDate();
        const hour = parseInt(time.split(':')[0]);
        const hash = (day + hour) % 10;
        if (hash < 2) return 'full';
        if (hash < 5) return 'busy';
        return 'available';
    };

    const handleApplyPromo = (code: string) => {
        if (!code.trim() || !selectedService) return;

        const promotion = allAvailablePromos.find(p => p.code.toUpperCase() === code.toUpperCase());

        if (!promotion) {
            setPromoError('Mã giảm giá không hợp lệ.');
            setAppliedPromo(null);
            return;
        }

        if (new Date(promotion.expiryDate) < new Date()) {
            setPromoError('Mã giảm giá đã hết hạn.');
            setAppliedPromo(null);
            return;
            }

        let calculatedDiscount = 0;
        const priceToDiscount = selectedService.discountPrice || selectedService.price;
        if (promotion.discountType === 'percentage') {
            calculatedDiscount = (priceToDiscount * promotion.discountValue) / 100;
        } else { // 'fixed'
            calculatedDiscount = promotion.discountValue;
        }

        calculatedDiscount = Math.min(calculatedDiscount, priceToDiscount);
        
        setAppliedPromo({ code: promotion.code, discount: calculatedDiscount });
        setPromoError('');
    };
    
    const handleManualApply = () => {
        handleApplyPromo(promoCode);
    };
    
    const handleSelectPromo = (code: string) => {
        setPromoCode(code);
        setIsPromoListVisible(false);
        handleApplyPromo(code);
    };

    const handleBookingSubmit = () => {
      console.log({
        service: selectedService,
        date: selectedDate,
        time: selectedTime,
        therapist: selectedTherapist,
        therapistId: selectedTherapistId, // Add therapistId
        promo: appliedPromo,
      });
      setShowConfirmation(true);
    }
    
    const handleNewBooking = () => {
      setShowConfirmation(false);
      setCurrentStep(1);
      setSelectedServiceId(initialServiceId);
      setSelectedDate('');
      setSelectedTime('');
      setSelectedTherapistId(MOCK_THERAPISTS[0].id);
      setPromoCode('');
      setAppliedPromo(null);
      setPromoError('');
    }

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto p-1">
                        {MOCK_SERVICES.map(service => (
                            <div
                                key={service.id}
                                onClick={() => {
                                    setSelectedServiceId(service.id);
                                    handleNextStep();
                                }}
                                className={`p-4 border rounded-lg cursor-pointer transition-all ${selectedServiceId === service.id ? 'border-brand-primary ring-2 ring-brand-primary shadow-lg' : 'border-gray-200 hover:shadow-md'}`}
                            >
                                <div className="flex items-center gap-4">
                                    <img src={service.imageUrl} alt={service.name} className="w-20 h-20 object-cover rounded-md flex-shrink-0" />
                                    <div>
                                        <h3 className="font-bold text-brand-dark">{service.name}</h3>
                                        <p className="text-sm text-gray-600">{service.duration} phút</p>
                                        <p className="text-sm font-semibold text-brand-primary mt-1">{formatPrice(service.discountPrice || service.price)}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                );

            case 2:
                return (
                    <div>
                        <label className="block text-sm font-medium text-brand-text mb-2">Chọn Ngày</label>
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => {
                                setSelectedDate(e.target.value);
                                setSelectedTime('');
                            }}
                            min={new Date().toISOString().split('T')[0]}
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-brand-primary focus:border-brand-primary mb-6"
                        />
                        <label className="block text-sm font-medium text-brand-text mb-2">Chọn Giờ</label>
                         <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                            {AVAILABLE_TIMES.map(time => {
                                const status = getTimeSlotStatus(time, selectedDate);
                                const statusClasses = {
                                    available: 'bg-green-50 text-green-800 hover:bg-green-100',
                                    busy: 'bg-yellow-50 text-yellow-800 hover:bg-yellow-100',
                                    full: 'bg-red-100 text-red-500 cursor-not-allowed line-through',
                                    disabled: 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                };
                                return (
                                    <button
                                        key={time}
                                        type="button"
                                        onClick={() => setSelectedTime(time)}
                                        disabled={status === 'full' || status === 'disabled'}
                                        className={`p-3 border rounded-md transition-colors font-semibold ${
                                            selectedTime === time 
                                            ? 'bg-brand-primary text-white ring-2 ring-brand-dark' 
                                            : statusClasses[status]
                                        }`}
                                    >
                                        {time}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                );

            case 3: {
                const anyTherapist = MOCK_THERAPISTS.find(t => t.id === 'any');
                const otherTherapists = MOCK_THERAPISTS.filter(t => t.id !== 'any');

                return (
                    <div className="space-y-4 max-h-[60vh] overflow-y-auto p-1">
                        {anyTherapist && (
                            <div
                                key={anyTherapist.id}
                                onClick={() => {
                                    setSelectedTherapistId(anyTherapist.id);
                                    handleNextStep();
                                }}
                                className={`p-4 border-2 rounded-lg cursor-pointer transition-all flex items-center gap-4 ${selectedTherapistId === anyTherapist.id ? 'border-brand-primary ring-2 ring-brand-primary shadow-lg' : 'border-dashed border-gray-300 bg-brand-light hover:shadow-md hover:border-brand-primary'}`}
                            >
                                <img src={anyTherapist.imageUrl} alt={anyTherapist.name} className="w-20 h-20 object-cover rounded-full" />
                                <div>
                                    <h3 className="font-bold text-brand-dark text-lg">{anyTherapist.name}</h3>
                                    <p className="text-sm text-gray-600">{anyTherapist.specialty}</p>
                                    <p className="text-xs text-brand-primary mt-1 font-semibold">Lựa chọn nhanh và tiện lợi nhất!</p>
                                </div>
                            </div>
                        )}

                        <div className="relative flex py-3 items-center">
                            <div className="flex-grow border-t border-gray-200"></div>
                            <span className="flex-shrink mx-4 text-gray-400 text-sm">Hoặc chọn chuyên viên bạn muốn</span>
                            <div className="flex-grow border-t border-gray-200"></div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {otherTherapists.map(therapist => (
                                <div
                                    key={therapist.id}
                                    onClick={() => setSelectedTherapistId(therapist.id)}
                                    className={`p-4 border rounded-lg cursor-pointer transition-all flex items-center gap-4 ${selectedTherapistId === therapist.id ? 'border-brand-primary ring-2 ring-brand-primary shadow-lg' : 'border-gray-200 hover:shadow-md'}`}
                                >
                                    <img src={therapist.imageUrl} alt={therapist.name} className="w-20 h-20 object-cover rounded-full" />
                                    <div>
                                        <h3 className="font-bold text-brand-dark">{therapist.name}</h3>
                                        <p className="text-sm text-gray-600">{therapist.specialty.join(', ')}</p>
                                        <p className="text-xs text-gray-500 mt-1 flex items-center">
                                            <span> {/* Wrap StarIcon and text in a span for semantic correctness */}
                                                <StarIcon className="w-4 h-4 text-yellow-400 mr-1"/>
                                                {therapist.rating} ({therapist.reviewCount} đánh giá)
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            }
            case 4:
                return (
                    <div className="space-y-4">
                        <div className="bg-brand-light p-4 rounded-lg">
                            <h3 className="font-bold text-brand-dark mb-2">Thông tin đặt hẹn</h3>
                            <p><strong>Dịch vụ:</strong> {selectedService?.name}</p>
                            <p><strong>Ngày:</strong> {selectedDate}</p>
                            <p><strong>Giờ:</strong> {selectedTime}</p>
                            <p><strong>Chuyên viên:</strong> {selectedTherapist?.name}</p>
                        </div>

                        <div className="border-t pt-4">
                            <label className="block text-sm font-medium text-brand-text mb-2">Mã giảm giá (nếu có)</label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={promoCode}
                                    onChange={(e) => {
                                        setPromoCode(e.target.value);
                                        setPromoError('');
                                        setAppliedPromo(null);
                                    }}
                                    placeholder="Nhập mã giảm giá"
                                    className="flex-1 p-2 border rounded-md focus:ring-brand-primary focus:border-brand-primary"
                                />
                                <button
                                    type="button"
                                    onClick={handleManualApply}
                                    className="bg-brand-dark text-white px-4 py-2 rounded-md hover:bg-brand-primary"
                                    disabled={!promoCode.trim() || !selectedService}
                                >
                                    Áp dụng
                                </button>
                            </div>
                            {promoError && <p className="text-red-500 text-sm mt-2">{promoError}</p>}
                            {appliedPromo && (
                                <p className="text-green-600 text-sm mt-2">
                                    Mã <strong className="font-bold">{appliedPromo.code}</strong> đã được áp dụng. Giảm{' '}
                                    <strong className="font-bold">{formatPrice(appliedPromo.discount)}</strong>!
                                </p>
                            )}
                             <button type="button" onClick={() => setIsPromoListVisible(!isPromoListVisible)} className="text-sm text-blue-600 hover:underline mt-2">
                                {isPromoListVisible ? 'Ẩn danh sách ưu đãi' : 'Xem các ưu đãi khả dụng'}
                            </button>
                            {isPromoListVisible && (
                                <div className="mt-2 p-3 bg-gray-50 border rounded-md max-h-40 overflow-y-auto">
                                    {allAvailablePromos.length > 0 ? (
                                        allAvailablePromos.map(promo => (
                                            <div key={promo.id} className="flex justify-between items-center py-1.5 border-b last:border-b-0">
                                                <span className="text-sm text-gray-700">{promo.title}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => handleSelectPromo(promo.code)}
                                                    className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full hover:bg-blue-200"
                                                >
                                                    Chọn
                                                </button>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-xs text-gray-500">Không có ưu đãi nào khả dụng.</p>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="text-right text-lg font-bold text-brand-dark border-t pt-4">
                            Tổng cộng: {formatPrice((selectedService?.discountPrice || selectedService?.price || 0) - (appliedPromo?.discount || 0))}
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="container mx-auto px-4 py-12">
            <button
                onClick={() => {
                    if (currentStep > 1) handlePrevStep();
                    else navigate(-1);
                }}
                className="flex items-center text-brand-dark font-semibold hover:text-brand-primary mb-6 transition-colors group"
                aria-label="Quay lại trang trước"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 transition-transform group-hover:-translate-x-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                Quay lại
            </button>

            <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-2xl">
                <h1 className="text-3xl font-serif font-bold text-brand-dark text-center mb-6">Đặt Lịch Hẹn</h1>

                <div className="flex justify-between items-center mb-8">
                    {steps.map((step, index) => (
                        <div key={index} className="flex flex-col items-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${currentStep >= index + 1 ? 'bg-brand-primary' : 'bg-gray-300'}`}>
                                {index + 1}
                            </div>
                            <p className={`text-xs mt-2 ${currentStep >= index + 1 ? 'text-brand-dark font-semibold' : 'text-gray-500'}`}>{step}</p>
                        </div>
                    ))}
                </div>

                <div className="min-h-[300px]">
                    {renderStepContent()}
                </div>

                <div className="mt-8 flex justify-between">
                    <button
                        onClick={handlePrevStep}
                        disabled={currentStep === 1}
                        className="bg-gray-200 text-gray-800 font-bold py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Trước
                    </button>
                    {currentStep < steps.length ? (
                        <button
                            onClick={handleNextStep}
                            disabled={
                                (currentStep === 1 && !selectedServiceId) ||
                                (currentStep === 2 && (!selectedDate || !selectedTime)) ||
                                (currentStep === 3 && !selectedTherapistId)
                            }
                            className="bg-brand-dark text-white font-bold py-3 px-6 rounded-lg hover:bg-brand-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Tiếp theo
                        </button>
                    ) : (
                        <button
                            onClick={handleBookingSubmit}
                            className="bg-green-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-700 transition-colors"
                        >
                            Xác nhận Đặt lịch
                        </button>
                    )}
                </div>
            </div>

            {showConfirmation && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4" role="dialog" aria-modal="true" onClick={() => setShowConfirmation(false)}>
                    <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full text-center transform transition-all animate-fadeIn" onClick={(e) => e.stopPropagation()}>
                        <svg className="mx-auto mb-4 w-16 h-16 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        <h2 className="text-2xl font-bold text-brand-dark mb-4">Đặt lịch thành công!</h2>
                        <p className="text-md text-brand-text mb-6">Bạn đã đặt lịch thành công cho dịch vụ <br /><strong className="text-brand-primary">{selectedService?.name}</strong> <br />vào lúc {selectedTime}, ngày {selectedDate} với chuyên viên {selectedTherapist?.name}.</p>
                        <button onClick={handleNewBooking} className="bg-brand-primary text-white font-bold py-3 px-6 rounded-lg hover:bg-brand-dark transition-colors">Đặt lịch mới</button>
                        <button onClick={() => navigate('/appointments')} className="ml-4 bg-gray-200 text-gray-800 font-bold py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors">Xem lịch hẹn của tôi</button>
                    </div>
                </div>
            )}
        </div>
    );
};