import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { MOCK_SERVICES, MOCK_REVIEWS, MOCK_PROMOTIONS } from "../../constants";
import ServiceCard from "../components/ServiceCard";
import PromotionCard from "../components/PromotionCard";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  StarIcon,
} from "../../shared/icons";

const heroSlides = [
  {
    imageUrl: "https://picsum.photos/seed/spa-hero1/1920/1080",
    title: "Nơi Vẻ Đẹp Thăng Hoa",
    subtitle:
      "Trải nghiệm dịch vụ spa 5 sao với các liệu trình độc quyền, giúp bạn tái tạo năng lượng và gìn giữ nét xuân.",
    buttonText: "Khám Phá Dịch Vụ",
    buttonLink: "/services",
  },
  {
    imageUrl: "https://picsum.photos/seed/spa-hero2/1920/1080",
    title: "Ưu Đãi Đặc Biệt Mùa Hè",
    subtitle:
      "Giảm giá lên đến 30% cho các gói chăm sóc da và massage toàn thân. Đừng bỏ lỡ!",
    buttonText: "Xem Ưu Đãi",
    buttonLink: "/promotions",
  },
  {
    imageUrl: "https://picsum.photos/seed/spa-hero3/1920/1080",
    title: "Đội Ngũ Chuyên Viên Hàng Đầu",
    subtitle:
      "Với kinh nghiệm và sự tận tâm, chúng tôi cam kết mang đến cho bạn sự hài lòng tuyệt đối.",
    buttonText: "Đặt Lịch Hẹn",
    buttonLink: "/booking",
  },
];

// Simple hook to detect when an element is in view
const useInView = (
  options = { root: null, rootMargin: "0px", threshold: 0.15 }
) => {
  const ref = useRef<HTMLElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) setInView(true);
      });
    }, options);
    obs.observe(node);
    return () => obs.disconnect();
  }, [ref.current]);

  return { ref, inView } as const;
};

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative w-full h-screen text-white overflow-hidden">
      <style>{`
                @keyframes gradientShift { 0% {background-position:0% 50%} 50% {background-position:100% 50%} 100% {background-position:0% 50%} }
                .animated-gradient { background: linear-gradient(90deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02), rgba(255,255,255,0.06)); background-size: 200% 200%; animation: gradientShift 8s ease infinite; }
                .slideTransform { transition: transform 1s cubic-bezier(.2,.9,.2,1), opacity 1s; }
            `}</style>

      {heroSlides.map((slide, index) => {
        const offset = index - currentSlide;
        const isActive = index === currentSlide;
        // small translate for slide-in effect
        const transformStyle = isActive
          ? { transform: "translateX(0%) scale(1)" }
          : offset < 0
          ? { transform: "translateX(-15%) scale(0.98)", opacity: 0 }
          : { transform: "translateX(15%) scale(0.98)", opacity: 0 };
        return (
          <div
            key={index}
            style={transformStyle as React.CSSProperties}
            className={`absolute inset-0 slideTransform ${
              isActive ? "opacity-100 z-0" : "opacity-0 z-[-1]"
            }`}
          >
            <img
              src={slide.imageUrl}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
            {/* animated gradient overlay and soft top-down gradient */}
            <div className="absolute inset-0 animated-gradient mix-blend-overlay opacity-60 pointer-events-none"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-transparent pointer-events-none"></div>
          </div>
        );
      })}

      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
        {heroSlides.map((slide, index) => {
          const isActive = index === currentSlide;
          return (
            <div
              key={index}
              className={`transition-all duration-700 ${
                isActive ? "opacity-100" : "opacity-0 hidden"
              }`}
            >
              <h1
                key={`${index}-title`}
                className="text-5xl md:text-7xl font-serif font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-pink-300 via-amber-200 to-white drop-shadow-lg"
              >
                {slide.title}
              </h1>
              <p
                key={`${index}-subtitle`}
                className="text-lg md:text-xl max-w-2xl mx-auto mb-8 italic leading-relaxed text-white/90"
              >
                {slide.subtitle}
              </p>
              <Link
                key={`${index}-button`}
                to={slide.buttonLink}
                className="inline-flex items-center gap-3 bg-gradient-to-r from-brand-primary to-brand-secondary text-white font-bold py-3 px-6 rounded-full text-lg hover:shadow-2xl transition-transform transform hover:-translate-y-0.5"
              >
                {slide.buttonText}
                <ChevronRightIcon className="w-5 h-5" />
              </Link>
            </div>
          );
        })}
      </div>
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex space-x-3">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-4 h-4 rounded-full transition-all duration-300 flex items-center justify-center ${
              currentSlide === index
                ? "bg-white scale-125 shadow-lg"
                : "bg-white/40 hover:bg-white/70"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          >
            <span
              className={`${
                currentSlide === index
                  ? "block w-2 h-2 rounded-full bg-brand-accent animate-pulse"
                  : "block w-2 h-2 rounded-full bg-white/80"
              }`}
            ></span>
          </button>
        ))}
      </div>
    </section>
  );
};

export const HomePage = () => {
  const featuredServices = MOCK_SERVICES.filter((s) => s.isHot).slice(0, 8); // Get more services to enable scrolling

  // Filter promotions that are active and expire within 30 days (for "this month" highlight)
  const featuredPromotions = MOCK_PROMOTIONS.filter((promo) => {
    const expiry = promo.expiryDate ? new Date(promo.expiryDate) : null;
    const now = new Date();
    const thirtyDaysFromNow = new Date(
      now.getTime() + 30 * 24 * 60 * 60 * 1000
    ); // approx 30 days
    return expiry && expiry > now && expiry <= thirtyDaysFromNow;
  }).slice(0, 8); // Get up to 8 promotions

  const [currentServiceIndex, setCurrentServiceIndex] = useState(0);
  const [serviceItemsPerView, setServiceItemsPerView] = useState(3); // Default for large screens

  // Corrected state variables for promotions carousel
  const [currentPromoIndex, setCurrentPromoIndex] = useState(0);
  const [promoItemsPerView, setPromoItemsPerView] = useState(3); // Default for large screens

  // scroll-in observers for sections
  const { ref: aboutRef, inView: aboutInView } = useInView();
  const { ref: reviewsRef, inView: reviewsInView } = useInView();

  // touch / swipe support for services and promotions
  const serviceTouchStartX = useRef<number | null>(null);
  const promoTouchStartX = useRef<number | null>(null);

  const onServiceTouchStart = (e: React.TouchEvent) => {
    serviceTouchStartX.current = e.touches[0].clientX;
  };
  const onServiceTouchEnd = (e: React.TouchEvent) => {
    const start = serviceTouchStartX.current;
    if (start == null) return;
    const dx = e.changedTouches[0].clientX - start;
    if (Math.abs(dx) > 50) {
      if (dx < 0) handleNextService();
      else handlePrevService();
    }
    serviceTouchStartX.current = null;
  };

  const onPromoTouchStart = (e: React.TouchEvent) => {
    promoTouchStartX.current = e.touches[0].clientX;
  };
  const onPromoTouchEnd = (e: React.TouchEvent) => {
    const start = promoTouchStartX.current;
    if (start == null) return;
    const dx = e.changedTouches[0].clientX - start;
    if (Math.abs(dx) > 50) {
      if (dx < 0) handleNextPromo();
      else handlePrevPromo();
    }
    promoTouchStartX.current = null;
  };

  useEffect(() => {
    const handleResize = () => {
      let newItemsPerView = 3;
      if (window.innerWidth < 768) {
        // md breakpoint
        newItemsPerView = 1;
      } else if (window.innerWidth < 1024) {
        // lg breakpoint
        newItemsPerView = 2;
      } else {
        newItemsPerView = 3;
      }
      setServiceItemsPerView(newItemsPerView);
      setPromoItemsPerView(newItemsPerView); // Update for promotions carousel
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Set initial value
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const totalServices = featuredServices.length;
  const maxServiceIndex = Math.max(0, totalServices - serviceItemsPerView);

  const handleNextService = () => {
    setCurrentServiceIndex((prev) => Math.min(prev + 1, maxServiceIndex));
  };

  const handlePrevService = () => {
    setCurrentServiceIndex((prev) => Math.max(prev - 1, 0));
  };

  // Corrected carousel handlers for promotions
  const totalPromotions = featuredPromotions.length;
  const maxPromoIndex = Math.max(0, totalPromotions - promoItemsPerView);

  const handleNextPromo = () => {
    setCurrentPromoIndex((prev) => Math.min(prev + 1, maxPromoIndex));
  };

  const handlePrevPromo = () => {
    setCurrentPromoIndex((prev) => Math.max(prev - 1, 0));
  };

  return (
    <div>
      <Hero />

      <section
        id="about"
        ref={aboutRef as any}
        className={`py-20 bg-brand-light transition-all duration-700 ${
          aboutInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <img
              src="https://picsum.photos/seed/spa-about/600/700"
              alt="About Anh Tho Spa"
              className="rounded-2xl shadow-2xl transition-transform transform hover:scale-105"
            />
          </div>
          <div>
            <h2 className="text-4xl font-serif font-bold text-brand-dark mb-6">
              Chào Mừng Đến Với Anh Thơ Spa
            </h2>
            <p className="text-lg text-brand-text mb-4 leading-relaxed">
              Tại Anh Thơ Spa, chúng tôi tin rằng vẻ đẹp thực sự đến từ sự cân
              bằng giữa cơ thể, tâm trí và tinh thần.{" "}
              <span className="text-brand-accent font-semibold">
                Sứ mệnh của chúng tôi
              </span>{" "}
              là mang đến cho bạn một không gian yên tĩnh, nơi bạn có thể tạm
              gác lại những bộn bề cuộc sống và tận hưởng những giây phút chăm
              sóc bản thân quý giá.
            </p>
            <p className="text-brand-text mb-6">
              Với đội ngũ chuyên viên giàu kinh nghiệm, sản phẩm cao cấp và công
              nghệ hiện đại, chúng tôi cam kết mang đến những liệu trình hiệu
              quả và an toàn nhất.
            </p>
            <Link
              to="/services"
              className="bg-brand-dark text-white font-semibold py-3 px-6 rounded-md hover:bg-brand-primary transition-colors hover:animate-pulse"
            >
              Tìm Hiểu Thêm
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 bg-brand-secondary">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-serif font-bold text-brand-dark">
              Dịch Vụ Nổi Bật
            </h2>
            <p className="mt-4 text-lg text-brand-text max-w-2xl mx-auto">
              Những liệu trình được khách hàng yêu thích và tin dùng nhất tại
              Anh Thơ Spa.
            </p>
          </div>

          {/* Services Carousel */}
          <div className="relative">
            <div
              className="overflow-hidden"
              onTouchStart={onServiceTouchStart}
              onTouchEnd={onServiceTouchEnd}
            >
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{
                  transform: `translateX(-${
                    currentServiceIndex * (100 / serviceItemsPerView)
                  }%)`,
                }}
              >
                {featuredServices.map((service) => (
                  <div
                    key={service.id}
                    className="flex-shrink-0 p-2 transition-transform transform hover:scale-105 hover:shadow-2xl"
                    style={{ flexBasis: `${100 / serviceItemsPerView}%` }}
                  >
                    <div className="bg-white rounded-xl overflow-hidden">
                      <ServiceCard service={service} />
                    </div>
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
                  className="absolute top-1/2 left-0 -translate-y-1/2 p-3 bg-gradient-to-r from-brand-primary to-brand-secondary text-white rounded-full shadow-xl hover:opacity-95 disabled:opacity-50 disabled:cursor-not-allowed z-10 -ml-6"
                  aria-label="Previous service"
                >
                  <ChevronLeftIcon className="w-6 h-6 text-white" />
                </button>
                <button
                  onClick={handleNextService}
                  disabled={currentServiceIndex >= maxServiceIndex}
                  className="absolute top-1/2 right-0 -translate-y-1/2 p-3 bg-gradient-to-r from-brand-primary to-brand-secondary text-white rounded-full shadow-xl hover:opacity-95 disabled:opacity-50 disabled:cursor-not-allowed z-10 -mr-6"
                  aria-label="Next service"
                >
                  <ChevronRightIcon className="w-6 h-6 text-white" />
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
              <h2 className="text-4xl font-serif font-bold text-brand-dark">
                Ưu Đãi Nổi Bật Trong Tháng
              </h2>
              <p className="mt-4 text-lg text-brand-text max-w-2xl mx-auto">
                Đừng bỏ lỡ các chương trình khuyến mãi hấp dẫn đang diễn ra!
              </p>
            </div>
            <div className="relative">
              {" "}
              {/* Outer container for carousel with relative positioning */}
              <div
                className="overflow-hidden"
                onTouchStart={onPromoTouchStart}
                onTouchEnd={onPromoTouchEnd}
              >
                {" "}
                {/* Viewport for the carousel */}
                <div
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{
                    transform: `translateX(-${
                      currentPromoIndex * (100 / promoItemsPerView)
                    }%)`,
                  }}
                >
                  {/* Now rendering PromotionCard for promotions */}
                  {featuredPromotions.map((promotion, idx) => {
                    const isCenter = idx === currentPromoIndex;
                    // compute days left for optional urgency badge
                    const daysLeft = promotion.expiryDate
                      ? Math.ceil(
                          (new Date(promotion.expiryDate).getTime() -
                            Date.now()) /
                            (1000 * 60 * 60 * 24)
                        )
                      : null;
                    return (
                      <div
                        key={promotion.id}
                        className="flex-shrink-0 p-2"
                        style={{
                          flexBasis: `${100 / promoItemsPerView}%`,
                          transform: isCenter ? "scale(1.07)" : "scale(0.98)",
                          transition: "transform 300ms",
                          opacity: isCenter ? 1 : 0.95,
                        }}
                      >
                        <div
                          className={`relative ${
                            isCenter ? "shadow-2xl" : "shadow-lg"
                          } rounded-lg overflow-hidden`}
                        >
                          {daysLeft !== null && daysLeft <= 3 && (
                            <div className="absolute top-3 right-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full z-20">
                              Còn {daysLeft} ngày
                            </div>
                          )}
                          <PromotionCard promotion={promotion} />{" "}
                          {/* Using PromotionCard */}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              {/* Navigation Buttons for Promotions */}
              {totalPromotions > promoItemsPerView && (
                <>
                  <button
                    onClick={handlePrevPromo}
                    disabled={currentPromoIndex === 0}
                    className="absolute top-1/2 left-0 -translate-y-1/2 p-3 bg-gradient-to-r from-brand-primary to-brand-secondary text-white rounded-full shadow-xl hover:opacity-95 disabled:opacity-50 disabled:cursor-not-allowed z-10 -ml-6"
                    aria-label="Previous promotion"
                  >
                    <ChevronLeftIcon className="w-6 h-6 text-white" />
                  </button>
                  <button
                    onClick={handleNextPromo}
                    disabled={currentPromoIndex >= maxPromoIndex}
                    className="absolute top-1/2 right-0 -translate-y-1/2 p-3 bg-gradient-to-r from-brand-primary to-brand-secondary text-white rounded-full shadow-xl hover:opacity-95 disabled:opacity-50 disabled:cursor-not-allowed z-10 -mr-6"
                    aria-label="Next promotion"
                  >
                    <ChevronRightIcon className="w-6 h-6 text-white" />
                  </button>
                </>
              )}
            </div>
          </div>
        </section>
      )}

      <section
        ref={reviewsRef as any}
        className={`py-20 bg-brand-light transition-all duration-700 ${
          reviewsInView
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-6"
        }`}
      >
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-serif font-bold text-brand-dark mb-12">
            Khách Hàng Nói Gì Về Chúng Tôi
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {MOCK_REVIEWS.slice(0, 3).map((review) => (
              <div
                key={review.id}
                className="bg-white p-8 rounded-lg shadow-lg transition-transform transform hover:-translate-y-2 hover:shadow-2xl"
              >
                <img
                  src={review.userImageUrl}
                  alt={review.userName}
                  className="w-20 h-20 rounded-full mx-auto mb-4"
                />
                <div className="flex justify-center mb-4">
                  {[...Array(review.rating)].map((_, i) => (
                    <StarIcon
                      key={i}
                      className={`w-5 h-5 text-yellow-400 ${
                        reviewsInView ? "animate-pulse" : ""
                      }`}
                    />
                  ))}
                </div>
                <p className="text-brand-text italic mb-4">
                  "{review.comment}"
                </p>
                <p className="font-bold text-brand-dark">{review.userName}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
