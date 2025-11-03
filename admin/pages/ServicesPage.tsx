import React, { useState, useMemo, useEffect } from 'react';
import { MOCK_SERVICES } from '../../constants';
import type { Service } from '../../types';
import AddEditServiceModal from '../components/AddEditServiceModal'; // Import the moved modal component
import {PlusIcon,SearchIcon,GridIcon,ListIcon,EyeIcon,EditIcon,TrashIcon } from '../../shared/icons';
// --- ICONS ---

const formatPrice = (price: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

type ServiceWithStatus = Service & { isActive: boolean }; // Assuming services have an 'isActive' status

const SERVICES_PER_PAGE = 6;

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
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


const ServicesPage: React.FC = () => {
    const [services, setServices] = useState<ServiceWithStatus[]>(() => {
        // Load from localStorage or use MOCK_SERVICES, ensuring isActive is present
        const savedServices = localStorage.getItem('adminServices');
        if (savedServices) {
            return JSON.parse(savedServices);
        }
        return MOCK_SERVICES.map(s => ({ ...s, isActive: true }));
    });
    const [categories, setCategories] = useState<string[]>(() => {
        const initialCategories = new Set(MOCK_SERVICES.map(s => s.category));
        return Array.from(initialCategories);
    });

    // Filtering & Pagination states
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('All');
    const [filterStatus, setFilterStatus] = useState<'All' | 'Active' | 'Inactive'>('All');
    const [currentPage, setCurrentPage] = useState(1);
    const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

    // Modal states
    const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
    const [editingService, setEditingService] = useState<ServiceWithStatus | null>(null);

    const [toast, setToast] = useState<{ visible: boolean; message: string }>({ visible: false, message: '' });

    // Persist services and categories to localStorage
    useEffect(() => {
        localStorage.setItem('adminServices', JSON.stringify(services));
    }, [services]);

    useEffect(() => {
        // Filter out "All" category for the modal's internal list
        localStorage.setItem('serviceCategories', JSON.stringify(categories.filter(c => c !== 'All')));
    }, [categories]);


    const filteredServices = useMemo(() => {
        return services
            .filter(service => service.name.toLowerCase().includes(searchTerm.toLowerCase()) || service.description.toLowerCase().includes(searchTerm.toLowerCase()))
            .filter(service => filterCategory === 'All' || service.category === filterCategory)
            .filter(service => filterStatus === 'All' || (filterStatus === 'Active' && service.isActive) || (filterStatus === 'Inactive' && !service.isActive));
    }, [services, searchTerm, filterCategory, filterStatus]);

    const totalPages = Math.ceil(filteredServices.length / SERVICES_PER_PAGE);
    const paginatedServices = useMemo(() => {
        const startIndex = (currentPage - 1) * SERVICES_PER_PAGE;
        return filteredServices.slice(startIndex, startIndex + SERVICES_PER_PAGE);
    }, [filteredServices, currentPage]);

    useEffect(() => {
        setCurrentPage(1); // Reset page on filter changes
    }, [searchTerm, filterCategory, filterStatus]);

    const handleAddService = () => {
        setEditingService(null);
        setIsAddEditModalOpen(true);
    };

    const handleEditService = (service: ServiceWithStatus) => {
        setEditingService(service);
        setIsAddEditModalOpen(true);
    };

    const handleSaveService = (service: ServiceWithStatus) => {
        if (editingService) {
            setServices(prev => prev.map(s => s.id === service.id ? service : s));
            setToast({ visible: true, message: `Cập nhật dịch vụ ${service.name} thành công!` });
        } else {
            const newService: ServiceWithStatus = {
                ...service,
                id: `svc-${Date.now()}`,
                rating: 0, // Default rating for new service
                reviewCount: 0, // Default review count for new service
            };
            setServices(prev => [newService, ...prev]);
            setToast({ visible: true, message: `Thêm dịch vụ ${service.name} thành công!` });
        }
        setIsAddEditModalOpen(false);
        setTimeout(() => setToast({ visible: false, message: '' }), 4000);
    };

    const handleDeleteService = (serviceId: string) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa dịch vụ này?')) {
            setServices(prev => prev.filter(s => s.id !== serviceId));
            setToast({ visible: true, message: `Đã xóa dịch vụ thành công!` });
            setTimeout(() => setToast({ visible: false, message: '' }), 4000);
        }
    };
    
    // Function to update local categories state
    const handleUpdateCategories = (newCategories: string[]) => {
        setCategories(newCategories);
    };

    return (
        <div>
            {isAddEditModalOpen && (
                <AddEditServiceModal
                    service={editingService}
                    onClose={() => setIsAddEditModalOpen(false)}
                    onSave={handleSaveService}
                    categories={categories}
                    onUpdateCategories={handleUpdateCategories}
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

            <h1 className="text-3xl font-bold text-gray-800 mb-6">Quản lý Dịch vụ</h1>
            
            <div className="mb-6 flex flex-col md:flex-row gap-4">
                <div className="relative flex-grow">
                    <input
                        type="text"
                        placeholder="Tìm kiếm theo tên dịch vụ hoặc mô tả..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-brand-primary focus:border-brand-primary"
                    />
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
                <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)} className="p-3 border border-gray-300 rounded-lg bg-white">
                    <option value="All">Tất cả danh mục</option>
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <select value={filterStatus} onChange={e => setFilterStatus(e.target.value as 'All' | 'Active' | 'Inactive')} className="p-3 border border-gray-300 rounded-lg bg-white">
                    <option value="All">Tất cả trạng thái</option>
                    <option value="Active">Hoạt động</option>
                    <option value="Inactive">Không hoạt động</option>
                </select>
                <div className="flex items-center bg-gray-200 rounded-lg p-1">
                    <button onClick={() => setViewMode('grid')} className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-white shadow' : 'text-gray-500'}`}><GridIcon className="w-5 h-5" /></button>
                    <button onClick={() => setViewMode('table')} className={`p-2 rounded-md ${viewMode === 'table' ? 'bg-white shadow' : 'text-gray-500'}`}><ListIcon className="w-5 h-5" /></button>
                </div>
                <button onClick={handleAddService} className="flex items-center justify-center gap-2 bg-brand-primary text-white font-semibold p-3 rounded-lg hover:bg-brand-dark transition-colors"><PlusIcon className="w-5 h-5" />Thêm dịch vụ</button>
            </div>

            {paginatedServices.length > 0 ? (
                <>
                    {viewMode === 'grid' ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {paginatedServices.map(service => (
                                <div key={service.id} className={`bg-white rounded-lg shadow-md flex flex-col ${!service.isActive ? 'opacity-70 grayscale' : ''}`}>
                                    <div className="relative">
                                        <img src={service.imageUrl} alt={service.name} className="w-full h-40 object-cover rounded-t-lg" />
                                        <div className="absolute top-2 left-2 px-2 py-1 text-xs font-bold rounded-full bg-blue-500 text-white">
                                            {service.category}
                                        </div>
                                        {!service.isActive && (
                                            <span className="absolute top-2 right-2 px-2 py-1 text-xs font-bold rounded-full bg-red-600 text-white">
                                                Không hoạt động
                                            </span>
                                        )}
                                    </div>
                                    <div className="p-4 flex flex-col flex-grow">
                                        <h3 className="font-bold text-gray-800 text-lg">{service.name}</h3>
                                        <p className="text-sm text-gray-500 mb-1 line-clamp-2 flex-grow">{service.description}</p>
                                        <div className="flex justify-between items-center my-2 text-sm">
                                            <span className="font-semibold text-brand-primary">{formatPrice(service.price)}</span>
                                            <span className="text-gray-600">{service.duration} phút</span>
                                        </div>
                                        <div className="mt-auto pt-4 border-t flex flex-wrap gap-2 justify-end">
                                            <button onClick={() => handleEditService(service)} className="p-2 text-gray-500 hover:text-green-600" title="Chỉnh sửa"><EditIcon className="w-5 h-5" /></button>
                                            <button onClick={() => handleDeleteService(service.id)} className="p-2 text-gray-500 hover:text-red-600" title="Xóa"><TrashIcon className="w-5 h-5" /></button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white rounded-lg shadow-md overflow-x-auto">
                            <table className="w-full whitespace-nowrap">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr className="text-left text-sm font-semibold text-gray-600">
                                        <th className="p-4">Dịch vụ</th>
                                        <th className="p-4">Danh mục</th>
                                        <th className="p-4">Giá</th>
                                        <th className="p-4">Thời lượng</th>
                                        <th className="p-4">Trạng thái</th>
                                        <th className="p-4">Hành động</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedServices.map(service => (
                                        <tr key={service.id} className="border-b border-gray-200 hover:bg-gray-50">
                                            <td className="p-4 flex items-center gap-3">
                                                <img src={service.imageUrl} alt={service.name} className="w-10 h-10 object-cover rounded-md" />
                                                <div>
                                                    <p className="font-semibold text-gray-800">{service.name}</p>
                                                    <p className="text-sm text-gray-500 line-clamp-1">{service.description}</p>
                                                </div>
                                            </td>
                                            <td className="p-4 text-sm text-gray-600">{service.category}</td>
                                            <td className="p-4 text-sm font-semibold text-brand-primary">{formatPrice(service.price)}</td>
                                            <td className="p-4 text-sm text-gray-600">{service.duration} phút</td>
                                            <td className="p-4">
                                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${service.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                    {service.isActive ? 'Hoạt động' : 'Không hoạt động'}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-1">
                                                    <button onClick={() => handleEditService(service)} className="p-2 text-gray-500 hover:text-green-600" title="Chỉnh sửa"><EditIcon className="w-5 h-5" /></button>
                                                    <button onClick={() => handleDeleteService(service.id)} className="p-2 text-gray-500 hover:text-red-600" title="Xóa"><TrashIcon className="w-5 h-5" /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                    <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
                </>
            ) : (
                <div className="text-center py-10 text-gray-500">Không tìm thấy dịch vụ nào.</div>
            )}
        </div>
    );
};

export default ServicesPage;