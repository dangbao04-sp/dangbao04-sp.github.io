

import React, { useState, useMemo, useEffect } from 'react';
import { MOCK_SERVICES } from '../../constants';
import ServiceCard from '../components/ServiceCard';
import type { Service } from '../../types';
import { FilterIcon, StarIcon } from '../../shared/icons';

const SERVICES_PER_PAGE = 10;

const Pagination: React.FC<{
    totalServices: number;
    servicesPerPage: number;
    currentPage: number;
    onPageChange: (page: number) => void;
}> = ({ totalServices, servicesPerPage, currentPage, onPageChange }) => {
    const totalPages = Math.ceil(totalServices / servicesPerPage);
    if (totalPages <= 1) return null;

    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
        <nav className="mt-12 flex justify-center items-center space-x-2" aria-label="Pagination">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 text-sm font-medium text-gray-600 bg-white rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Trước
            </button>
            {pageNumbers.map((number) => (
                <button
                    key={number}
                    onClick={() => onPageChange(number)}
                    className={`w-10 h-10 text-sm font-medium rounded-md transition-colors ${
                        currentPage === number 
                        ? 'bg-brand-primary text-white' 
                        : 'bg-white text-gray-600 hover:bg-gray-100'
                    }`}
                >
                    {number}
                </button>
            ))}
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 text-sm font-medium text-gray-600 bg-white rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Sau
            </button>
        </nav>
    );
};


export const ServicesListPage: React.FC = () => {
    const [services] = useState<Service[]>(MOCK_SERVICES);
    const [selectedCategory, setSelectedCategory] = useState<string>('Tất cả');
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [minRating, setMinRating] = useState<number>(0);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    const { minPrice, maxPrice: initialMaxPrice, minDuration, maxDuration } = useMemo(() => {
        if (services.length === 0) return { minPrice: 0, maxPrice: 1000000, minDuration: 0, maxDuration: 180 };
        const prices = services.map(s => s.price);
        const durations = services.map(s => s.duration);
        return {
            minPrice: Math.min(...prices),
            maxPrice: Math.max(...prices),
            minDuration: Math.min(...durations),
            maxDuration: Math.max(...durations)
        };
    }, [services]);
    
    const [priceRange, setPriceRange] = useState<[number, number]>([minPrice, initialMaxPrice]);
    const [durationRange, setDurationRange] = useState<[number, number]>([minDuration, maxDuration]);

    const categories = useMemo(() => {
        return ['Tất cả', ...new Set(MOCK_SERVICES.map(service => service.category))];
    }, []);

    const filteredServices = useMemo(() => {
        return services.filter(service => {
            const categoryMatch = selectedCategory === 'Tất cả' || service.category === selectedCategory;
            const price = service.discountPrice || service.price;
            const priceMatch = price >= priceRange[0] && price <= priceRange[1];
            const durationMatch = service.duration >= durationRange[0] && service.duration <= durationRange[1];
            const searchMatch = service.name.toLowerCase().includes(searchTerm.toLowerCase());
            const ratingMatch = service.rating >= minRating;
            return categoryMatch && priceMatch && searchMatch && durationMatch && ratingMatch;
        });
    }, [services, selectedCategory, priceRange, durationRange, searchTerm, minRating]);

    // Reset to page 1 when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [selectedCategory, priceRange, durationRange, searchTerm, minRating]);
    
    const indexOfLastService = currentPage * SERVICES_PER_PAGE;
    const indexOfFirstService = indexOfLastService - SERVICES_PER_PAGE;
    const currentServices = filteredServices.slice(indexOfFirstService, indexOfLastService);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    }
    
    const FilterSidebar = () => (
        <aside className="space-y-6">
            <div>
                <h3 className="font-bold text-brand-dark mb-3">Danh mục</h3>
                <div className="space-y-2">
                    {categories.map(category => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                                selectedCategory === category 
                                ? 'bg-brand-primary text-white font-semibold' 
                                : 'text-brand-text hover:bg-brand-secondary'
                            }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            </div>

            <div>
                <h3 className="font-bold text-brand-dark mb-3">Khoảng giá</h3>
                <input
                    type="range"
                    min={minPrice}
                    max={initialMaxPrice}
                    value={priceRange[1]}
                    step="50000"
                    onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-primary"
                />
                <div className="text-sm text-brand-text mt-2 text-center">Dưới {formatCurrency(priceRange[1])}</div>
            </div>

             <div>
                <h3 className="font-bold text-brand-dark mb-3">Thời lượng (phút)</h3>
                <input
                    type="range"
                    min={minDuration}
                    max={maxDuration}
                    value={durationRange[1]}
                    step="15"
                    onChange={(e) => setDurationRange([durationRange[0], Number(e.target.value)])}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-primary"
                />
                 <div className="text-sm text-brand-text mt-2 text-center">Dưới {durationRange[1]} phút</div>
            </div>

            <div>
                <h3 className="font-bold text-brand-dark mb-3">Đánh giá</h3>
                <div className="flex justify-around items-center">
                    {[1, 2, 3, 4, 5].map(rating => (
                        <button
                            key={rating}
                            onClick={() => setMinRating(rating)}
                            className={`flex items-center gap-1 p-2 rounded-md transition-colors ${
                                minRating === rating ? 'bg-yellow-100 ring-2 ring-yellow-400' : 'hover:bg-yellow-50'
                            }`}
                        >
                           <span> {/* Wrap StarIcon for semantic correctness */}
                               {rating} <StarIcon className="w-4 h-4 text-yellow-400" />
                           </span>
                        </button>
                    ))}
                </div>
                 <button onClick={() => setMinRating(0)} className="text-xs text-blue-600 hover:underline w-full text-center mt-2">Xóa lọc đánh giá</button>
            </div>
        </aside>
    );

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-serif font-bold text-brand-dark">Danh Sách Dịch Vụ</h1>
                <p className="mt-4 text-lg text-brand-text max-w-2xl mx-auto">Khám phá các liệu trình chăm sóc được thiết kế riêng cho bạn tại Anh Thơ Spa.</p>
            </div>
            
            <div className="lg:flex lg:gap-8">
                {/* Desktop Sidebar */}
                <div className="hidden lg:block w-1/4">
                    <FilterSidebar />
                </div>
                
                {/* Mobile Filter Button and Modal */}
                <div className="lg:hidden mb-6">
                    <button 
                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                        className="w-full flex items-center justify-center gap-2 bg-white p-3 rounded-lg shadow font-semibold text-brand-dark"
                    >
                        <FilterIcon />
                        {isFilterOpen ? 'Đóng bộ lọc' : 'Mở bộ lọc'}
                    </button>
                    {isFilterOpen && (
                        <div className="bg-white p-4 mt-2 rounded-lg shadow-lg">
                            <FilterSidebar />
                        </div>
                    )}
                </div>

                {/* Main Content */}
                <main className="flex-1">
                     <div className="mb-6">
                        <input
                            type="text"
                            placeholder="Tìm kiếm theo tên dịch vụ..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-brand-primary focus:border-brand-primary shadow-sm"
                        />
                    </div>
                    
                    {currentServices.length > 0 ? (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                                {currentServices.map((service) => (
                                    <ServiceCard 
                                        key={service.id} 
                                        service={service}
                                    />
                                ))}
                            </div>
                            <Pagination
                                totalServices={filteredServices.length}
                                servicesPerPage={SERVICES_PER_PAGE}
                                currentPage={currentPage}
                                onPageChange={setCurrentPage}
                            />
                        </>
                    ) : (
                        <div className="text-center py-16 bg-white rounded-lg shadow-md">
                            <p className="text-lg text-brand-text">Không tìm thấy dịch vụ nào phù hợp.</p>
                            <p className="text-sm text-gray-500 mt-2">Vui lòng thử thay đổi bộ lọc của bạn.</p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};