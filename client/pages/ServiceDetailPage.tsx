
import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MOCK_SERVICES, MOCK_REVIEWS } from '../../constants';
import ServiceCard from '../components/ServiceCard';
import type { Review } from '../../types';
import { StarIcon, HeartIcon } from '../../shared/icons';

const ServiceDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const service = MOCK_SERVICES.find(s => s.id === id);
    const serviceReviews = MOCK_REVIEWS.filter(r => r.serviceId === id);
    const [isFavorite, setIsFavorite] = useState(false);

    // Mock data for suitable therapists
    const suitableTherapists = ['Chị Mai', 'Chị Lan', 'Anh Tuấn'];
    
    if (!service) {
        return <div className="text-center py-20">Dịch vụ không tồn tại.</div>;
    }

    const relatedServices = MOCK_SERVICES.filter(
        s => s.category === service.category && s.id !== service.id
    ).slice(0, 3);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    };

    const toggleFavorite = () => {
        setIsFavorite(!isFavorite);
    }

    const handleConsultationClick = () => {
        window.dispatchEvent(new CustomEvent('open-chatbot'));
    };

    return (
        <div className="container mx-auto px-4 py-12">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center text-brand-dark font-semibold hover:text-brand-primary mb-6 transition-colors group"
                aria-label="Quay lại trang trước"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 transition-transform group-hover:-translate-x-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                Quay lại danh sách
            </button>

            <div className="bg-white shadow-xl rounded-lg overflow-hidden">
                <div className="md:flex">
                    <div className="md:w-1/2">
                        <img className="h-full w-full object-cover" src={service.imageUrl.replace('/400/300', '/800/600')} alt={service.name} />
                    </div>
                    <div className="p-8 md:w-1/2 flex flex-col">
                        <div>
                            <p className="text-sm text-brand-primary font-semibold">{service.category}</p>
                            <div className="flex justify-between items-start">
                                <h1 className="text-3xl md:text-4xl font-serif font-bold text-brand-dark mt-2 mb-4">{service.name}</h1>
                                <button onClick={toggleFavorite} className={`p-2 rounded-full transition-colors duration-300 ${isFavorite ? 'text-red-500 bg-red-100' : 'text-gray-400 hover:bg-gray-100'}`} aria-label="Add to favorites">
                                    <HeartIcon className="w-7 h-7" />
                                </button>
                            </div>
                            <div className="flex items-center mb-4">
                                <div className="flex items-center text-yellow-500">
                                    {[...Array(Math.round(service.rating))].map((_, i) => <StarIcon key={i} className="w-5 h-5"/>)}
                                </div>
                                <span className="ml-2 text-brand-text text-sm">({service.reviewCount} đánh giá)</span>
                            </div>
                            <p className="text-brand-text text-base leading-relaxed mb-6">{service.longDescription}</p>
                            
                            <div className="grid grid-cols-2 gap-4 text-brand-text mb-6 border-t border-b border-gray-200 py-4">
                                <div className="flex flex-col">
                                    <span className="font-semibold text-gray-500 text-sm">Giá:</span>
                                    <span className="text-brand-primary font-bold text-lg">{formatPrice(service.price)}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-semibold text-gray-500 text-sm">Thời gian:</span>
                                    <span className="font-bold text-lg">{service.duration} phút</span>
                                </div>
                            </div>

                             <div className="mb-6">
                                <h3 className="font-semibold text-brand-dark mb-3">Chuyên viên phù hợp:</h3>
                                <div className="flex flex-wrap gap-3">
                                    {suitableTherapists.map(therapist => (
                                        <span key={therapist} className="bg-brand-secondary text-brand-dark text-sm font-medium px-3 py-1 rounded-full">{therapist}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                        
                        <div className="mt-auto flex flex-col sm:flex-row gap-4">
                            <Link 
                                to={`/booking?serviceId=${service.id}`} 
                                className="flex-1 text-center block bg-brand-primary text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-brand-dark transition-colors duration-300"
                            >
                                Đặt Lịch Ngay
                            </Link>
                             <button
                                onClick={handleConsultationClick}
                                className="flex-1 text-center block bg-brand-secondary text-brand-dark font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-brand-primary hover:text-white transition-colors duration-300 border border-brand-primary/50"
                            >
                                Tư Vấn Thêm
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Customer Reviews Section */}
            <div className="mt-16">
                <h2 className="text-3xl font-serif font-bold text-brand-dark text-center mb-10">Đánh giá từ khách hàng</h2>
                {serviceReviews.length > 0 ? (
                    <div className="max-w-4xl mx-auto space-y-8">
                        {serviceReviews.map((review: Review) => (
                            <div key={review.id} className="bg-white p-6 rounded-lg shadow-md flex items-start space-x-4">
                                <img src={review.userImageUrl} alt={review.userName} className="w-14 h-14 rounded-full flex-shrink-0" />
                                <div>
                                    <div className="flex items-center mb-1">
                                        <h4 className="font-bold text-brand-dark mr-2">{review.userName}</h4>
                                        <div className="flex text-yellow-400">
                                            {[...Array(review.rating)].map((_, i) => <StarIcon key={i} className="w-4 h-4"/>)}
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-500 mb-2">{review.date}</p>
                                    <p className="text-brand-text italic">"{review.comment}"</p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-brand-text">Chưa có đánh giá nào cho dịch vụ này.</p>
                )}
            </div>

            {/* Related Services Section */}
            {relatedServices.length > 0 && (
                <div className="mt-16">
                    <h2 className="text-3xl font-serif font-bold text-brand-dark text-center mb-10">Dịch Vụ Liên Quan</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {relatedServices.map(relatedService => (
                            <ServiceCard key={relatedService.id} service={relatedService} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ServiceDetailPage;