
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { MOCK_SERVICES, MOCK_REVIEWS, MOCK_PROMOTIONS } from '../../constants';
import ServiceCard from '../components/ServiceCard';
import PromotionCard from '../components/PromotionCard';
import { ChevronLeftIcon, ChevronRightIcon, StarIcon } from '../../shared/icons';

const heroSlides = [
    {
        imageUrl: 'https://picsum.photos/seed/spa-hero1/1920/1080',
        title: 'Nơi Vẻ Đẹp Thăng Hoa',
        subtitle: 'Trải nghiệm dịch vụ spa 5 sao với các liệu trình độc quyền, giúp bạn tái tạo năng lượng và gìn giữ nét xuân.',
        buttonText: 'Khám Phá Dịch Vụ',
        buttonLink: '/services',
    },
    {
        imageUrl: 'https://picsum.photos/seed/spa-hero2/1920/1080',
        title: 'Ưu Đãi Đặc Biệt Mùa Hè',
        subtitle: 'Giảm giá lên đến 30% cho các gói chăm sóc da và massage toàn thân. Đừng bỏ lỡ!',
        buttonText: 'Xem Ưu Đãi',
        buttonLink: '/promotions',
    },
    {
        imageUrl: 'https://picsum.photos/seed/spa-hero3/1920/1080',
        title: 'Đội Ngũ Chuyên Viên Hàng Đầu',
        subtitle: 'Với kinh nghiệm và sự tận tâm, chúng tôi cam kết mang đến cho bạn sự hài lòng tuyệt đối.',
        buttonText: 'Đặt Lịch Hẹn',
        buttonLink: '/booking',
    },
];

const Hero = () => {
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <section className="relative w-full h-screen text-white">
            {heroSlides.map((slide, index) => (
                <div
                    key={index}
                    className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
                >
                    <img src={slide.imageUrl} alt={slide.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50"></div>
                </div>
            ))}
            <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
                {heroSlides.map((slide, index) => (
                    <div
                        key={index}
                        className={`transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0 hidden'}`}
                    >
                        <h1 key={`${index}-title`} className="text-5xl md:text-7xl font-serif font-bold text-white mb-4 animate-slideUpFade">
                            {slide.title}
                        </h1>
                        <p key={`${index}-subtitle`} className="text-lg md:text-xl max-w-2xl mx-auto mb-8 animate-slideUpFade animation-delay-300">
                            {slide.subtitle}
                        </p>
                        <Link
                            key={`${index}-button`}
                            to={slide.buttonLink}
                            className="bg-brand-primary text-white font-bold py-3 px-8 rounded-full text-lg hover:bg-brand-dark transition-transform transform hover:scale-105 shadow-lg animate-slideUpFade animation-delay-500"
                        >
                            {slide.buttonText}
                        </Link>
                    </div>
                ))}
            </div>
             <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex space-x-3">
                {heroSlides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${currentSlide === index ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white'}`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </section>
    );
};

export const HomePage = () => {
    const featuredServices = MOCK_SERVICES.filter(s => s.isHot).slice(0, 8); // Get more services to enable scrolling
    
    // Filter promotions that are active and expire within 30 days (for "this month" highlight)
    const featuredPromotions = MOCK_PROMOTIONS.filter(promo => {
        const expiry = promo.expiryDate ? new Date(promo.expiryDate) : null;
        const now = new Date();
        const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // approx 30 days
        return expiry && expiry > now && expiry <= thirtyDaysFromNow;
    }).slice(0, 8); // Get up to 8 promotions

    const [currentServiceIndex, setCurrentServiceIndex] = useState(0);
    const [serviceItemsPerView, setServiceItemsPerView] = useState(3); // Default for large screens

    // Corrected state variables for promotions carousel
    const [currentPromoIndex, setCurrentPromoIndex] = useState(0);
    const [promoItemsPerView, setPromoItemsPerView] = useState(3); // Default for large screens


    useEffect(() => {
        const handleResize = () => {
            let newItemsPerView = 3;
            if (window.innerWidth < 768) { // md breakpoint
                newItemsPerView = 1;
            } else if (window.innerWidth < 1024) { // lg breakpoint
                newItemsPerView = 2;
            } else {
                newItemsPerView = 3;
            }
            setServiceItemsPerView(newItemsPerView);
            setPromoItemsPerView(newItemsPerView); // Update for promotions carousel
        };

        window.addEventListener('resize', handleResize);
        handleResize(); // Set initial value
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const totalServices = featuredServices.length;
    const maxServiceIndex = Math.max(0, totalServices - serviceItemsPerView);

    const handleNextService = () => {
        setCurrentServiceIndex(prev => Math.min(prev + 1, maxServiceIndex));
    };

    const handlePrevService = () => {
        setCurrentServiceIndex(prev => Math.max(prev - 1, 0));
    };

    // Corrected carousel handlers for promotions
    const totalPromotions = featuredPromotions.length;
    const maxPromoIndex = Math.max(0, totalPromotions - promoItemsPerView);

    const handleNextPromo = () => {
        setCurrentPromoIndex(prev => Math.min(prev + 1, maxPromoIndex));
    };

    const handlePrevPromo = () => {
        setCurrentPromoIndex(prev => Math.max(prev - 1, 0));
    };


    return (
        <div>
            <Hero />

            <section id="about" className="py-20 bg-brand-light">
                <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <img src="https://picsum.photos/seed/spa-about/600/700" alt="About Anh Tho Spa" className="rounded-lg shadow-xl" />
                    </div>
                    <div>
                        <h2 className="text-4xl font-serif font-bold text-brand-dark mb-6">Chào Mừng Đến Với Anh Thơ Spa</h2>
                        <p className="text-lg text-brand-text mb-4">
                            Tại Anh Thơ Spa, chúng tôi tin rằng vẻ đẹp thực sự đến từ sự cân bằng giữa cơ thể, tâm trí và tinh thần. Sứ mệnh của chúng tôi là mang đến cho bạn một không gian yên tĩnh, nơi bạn có thể tạm gác lại những bộn bề cuộc sống và tận hưởng những giây phút chăm sóc bản thân quý giá.
                        </p>
                        <p className="text-brand-text mb-6">
                            Với đội ngũ chuyên viên giàu kinh nghiệm, sản phẩm cao cấp và công nghệ hiện đại, chúng tôi cam kết mang đến những liệu trình hiệu quả và an toàn nhất.
                        </p>
                        <Link to="/services" className="bg-brand-dark text-white font-semibold py-3 px-6 rounded-md hover:bg-brand-primary transition-colors">
                            Tìm Hiểu Thêm
                        </Link>
                    </div>
                </div>
            </section>
            
            <section className="py-20 bg-brand-secondary">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-serif font-bold text-brand-dark">Dịch Vụ Nổi Bật</h2>
                        <p className="mt-4 text-lg text-brand-text max-w-2xl mx-auto">Những liệu trình được khách hàng yêu thích và tin dùng nhất tại Anh Thơ Spa.</p>
                    </div>
                    {/* Services Carousel */}
                    <div className="relative"> {/* Outer container for carousel with relative positioning */}
                        <div className="overflow-hidden"> {/* Viewport for the carousel */}
                            <div 
                                className="flex transition-transform duration-500 ease-in-out" 
                                style={{ transform: `translateX(-${currentServiceIndex * (100 / serviceItemsPerView)}%)` }}
                            >
                                {featuredServices.map(service => (
                                    <div 
                                        key={service.id} 
                                        className="flex-shrink-0 p-2"
                                        style={{ flexBasis: `${100 / serviceItemsPerView}%` }} /* Dynamic width based on itemsPerView */
                                    >
                                        <ServiceCard service={service} />
                                    </div>
                                ))}
                            </div>
                        </div>
                        {/* Navigation Buttons for Services */}
                        {totalServices > serviceItemsPerView && (
                            <>
                                <button
                                    onClick={handlePrevService}
                                    disabled={currentServiceIndex === 0}
                                    className="absolute top-1/2 left-0 -translate-y-1/2 p-2 bg-white rounded-full shadow-md text-brand-dark hover:bg-brand-secondary disabled:opacity-50 disabled:cursor-not-allowed z-10 -ml-4"
                                    aria-label="Previous service"
                                >
                                    <ChevronLeftIcon className="w-6 h-6" />
                                </button>
                                <button
                                    onClick={handleNextService}
                                    disabled={currentServiceIndex >= maxServiceIndex}
                                    className="absolute top-1/2 right-0 -translate-y-1/2 p-2 bg-white rounded-full shadow-md text-brand-dark hover:bg-brand-secondary disabled:opacity-50 disabled:cursor-not-allowed z-10 -mr-4"
                                    aria-label="Next service"
                                >
                                    <ChevronRightIcon className="w-6 h-6" />
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </section>

            {featuredPromotions.length > 0 && ( // Changed from discountedServices to featuredPromotions
                <section className="py-20 bg-brand-light">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-12">
                            <h2 className="text-4xl font-serif font-bold text-brand-dark">Ưu Đãi Nổi Bật Trong Tháng</h2>
                            <p className="mt-4 text-lg text-brand-text max-w-2xl mx-auto">Đừng bỏ lỡ các chương trình khuyến mãi hấp dẫn đang diễn ra!</p>
                        </div>
                        <div className="relative"> {/* Outer container for carousel with relative positioning */}
                            <div className="overflow-hidden"> {/* Viewport for the carousel */}
                                <div 
                                    className="flex transition-transform duration-500 ease-in-out" 
                                    style={{ transform: `translateX(-${currentPromoIndex * (100 / promoItemsPerView)}%)` }}
                                >
                                    {/* Now rendering PromotionCard for promotions */}
                                    {featuredPromotions.map((promotion) => (
                                        <div 
                                            key={promotion.id} 
                                            className="flex-shrink-0 p-2"
                                            style={{ flexBasis: `${100 / promoItemsPerView}%` }} /* Dynamic width based on itemsPerView */
                                        >
                                            <PromotionCard promotion={promotion} /> {/* Using PromotionCard */}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            {/* Navigation Buttons for Promotions */}
                            {totalPromotions > promoItemsPerView && (
                                <>
                                    <button
                                        onClick={handlePrevPromo}
                                        disabled={currentPromoIndex === 0}
                                        className="absolute top-1/2 left-0 -translate-y-1/2 p-2 bg-white rounded-full shadow-md text-brand-dark hover:bg-brand-secondary disabled:opacity-50 disabled:cursor-not-allowed z-10 -ml-4"
                                        aria-label="Previous promotion"
                                    >
                                        <ChevronLeftIcon className="w-6 h-6" />
                                    </button>
                                    <button
                                        onClick={handleNextPromo}
                                        disabled={currentPromoIndex >= maxPromoIndex}
                                        className="absolute top-1/2 right-0 -translate-y-1/2 p-2 bg-white rounded-full shadow-md text-brand-dark hover:bg-brand-secondary disabled:opacity-50 disabled:cursor-not-allowed z-10 -mr-4"
                                        aria-label="Next promotion"
                                    >
                                        <ChevronRightIcon className="w-6 h-6" />
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </section>
            )}
            
             <section className="py-20 bg-brand-light">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-4xl font-serif font-bold text-brand-dark mb-12">Khách Hàng Nói Gì Về Chúng Tôi</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {MOCK_REVIEWS.slice(0, 3).map((review) => (
                            <div key={review.id} className="bg-white p-8 rounded-lg shadow-lg">
                                <img src={review.userImageUrl} alt={review.userName} className="w-20 h-20 rounded-full mx-auto mb-4" />
                                <div className="flex justify-center mb-4">
                                    {[...Array(review.rating)].map((_, i) => <StarIcon key={i} className="w-5 h-5 text-yellow-400" />)}
                                </div>
                                <p className="text-brand-text italic mb-4">"{review.comment}"</p>
                                <p className="font-bold text-brand-dark">{review.userName}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}