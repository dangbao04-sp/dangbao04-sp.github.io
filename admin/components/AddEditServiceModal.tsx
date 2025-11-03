import React, { useState, useMemo, useEffect } from 'react';
import type { Service } from '../../types';
import { MOCK_SERVICES } from '../../constants'; // Needed for service names in dropdown, will filter.

// Type definition for service within the modal's context
type ServiceWithStatus = Service & { isActive: boolean };

// New Props for AddEditServiceModal for dynamic categories
interface AddEditServiceModalProps {
    service: ServiceWithStatus | null;
    onClose: () => void;
    onSave: (service: ServiceWithStatus) => void;
    categories: string[]; // List of existing categories (excluding 'All')
    onUpdateCategories: React.Dispatch<React.SetStateAction<string[]>>; // Callback to update parent's category list
}

const AddEditServiceModal: React.FC<AddEditServiceModalProps> = ({ service, onClose, onSave, categories, onUpdateCategories }) => {
    const [formData, setFormData] = useState<Partial<ServiceWithStatus>>(() => {
        // Defensive check for categories during initial state setup
        const initialCategory = Array.isArray(categories) && categories.length > 0 ? categories[0] : '';
        if (service) {
            return { ...service };
        }
        return {
            name: '',
            price: 0,
            duration: 30,
            category: initialCategory,
            description: '',
            longDescription: '',
            imageUrl: '',
            isActive: true,
            // Default values for new service
            rating: 0,
            reviewCount: 0,
            isHot: false,
            isNew: false,
        };
    });
    const [imagePreview, setImagePreview] = useState<string>(service?.imageUrl || '');
    const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [newCategoryError, setNewCategoryError] = useState('');
    const [formError, setFormError] = useState(''); // General form error for category selection

    useEffect(() => {
        // Reset new category input state and form errors when modal opens or service/categories change
        setShowNewCategoryInput(false);
        setNewCategoryName('');
        setNewCategoryError('');
        setFormError('');

        // Defensive check for categories when resetting form data
        const defaultCategory = Array.isArray(categories) && categories.length > 0 ? categories[0] : '';

        if (service) {
            setFormData({ ...service });
            setImagePreview(service.imageUrl || '');
        } else {
            setFormData({
                name: '',
                price: 0,
                duration: 30,
                category: defaultCategory, // Default to first available category
                description: '',
                longDescription: '',
                imageUrl: '',
                isActive: true,
                // Default values for new service
                rating: 0,
                reviewCount: 0,
                isHot: false,
                isNew: false,
            });
            setImagePreview('');
        }
    }, [service, categories]); // Re-run effect if service or categories change

    const handleCancelNewCategory = () => {
        // Function to explicitly cancel new category input and revert to existing selection
        setShowNewCategoryInput(false);
        setNewCategoryName('');
        setNewCategoryError('');
        setFormError('');
        // Defensive check for categories
        if (Array.isArray(categories) && categories.length > 0) {
            setFormData(prev => ({ ...prev, category: service?.category || categories[0] }));
        } else {
            setFormData(prev => ({ ...prev, category: '' }));
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const isCheckbox = type === 'checkbox';
        const isNumber = type === 'number';

        const newValue = isCheckbox ? (e.target as HTMLInputElement).checked : (isNumber ? parseFloat(value) : value);
        
        setFormData(prev => ({ ...prev, [name]: newValue }));
        setFormError(''); // Clear general form error on input change
        
        if (name === 'imageUrl') {
            setImagePreview(value);
        }

        if (name === 'category') {
            if (value === '___ADD_NEW___') {
                setShowNewCategoryInput(true);
                setNewCategoryName('');
                setNewCategoryError('');
                setFormData(prev => ({ ...prev, category: '' })); // Temporarily clear category until new one is added
            } else {
                setShowNewCategoryInput(false);
                setNewCategoryName('');
                setNewCategoryError('');
            }
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result as string;
                setImagePreview(result);
                setFormData(prev => ({ ...prev, imageUrl: result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAddNewCategory = () => {
        setNewCategoryError('');
        const trimmedName = newCategoryName.trim();
        if (!trimmedName) {
            setNewCategoryError('Tên danh mục không được để trống.');
            return;
        }
        // Defensive check for categories before using .some()
        if (Array.isArray(categories) && categories.some(cat => cat.toLowerCase() === trimmedName.toLowerCase())) {
            setNewCategoryError('Danh mục này đã tồn tại.');
            return;
        }

        onUpdateCategories(prev => [...prev, trimmedName]);
        setFormData(prev => ({ ...prev, category: trimmedName })); // Automatically select new category
        setShowNewCategoryInput(false);
        setNewCategoryName('');
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setFormError('');

        if (showNewCategoryInput) {
            setNewCategoryError('Vui lòng thêm danh mục mới hoặc chọn danh mục đã có.');
            return;
        }
        
        if (!formData.category || formData.category === '___ADD_NEW___') {
            setFormError('Vui lòng chọn hoặc thêm danh mục cho dịch vụ.');
            return;
        }

        // Basic validation for required fields before saving
        if (!formData.name || (formData.price === undefined || formData.price <= 0) || (formData.duration === undefined || formData.duration <= 0)) {
            setFormError('Vui lòng điền đầy đủ các trường bắt buộc (Tên, Giá, Thời lượng).');
            return;
        }

        onSave(formData as ServiceWithStatus);
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full" onClick={e => e.stopPropagation()}>
                <form onSubmit={handleSubmit}>
                    <div className="p-6 max-h-[80vh] overflow-y-auto">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">{service ? 'Chỉnh sửa dịch vụ' : 'Thêm dịch vụ mới'}</h2>
                        {formError && <p className="text-red-500 text-sm mb-4">{formError}</p>}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2"><label className="block text-sm font-medium text-gray-700">Tên dịch vụ</label><input type="text" name="name" value={formData.name || ''} onChange={handleChange} className="mt-1 w-full p-2 border rounded" required /></div>
                            <div><label className="block text-sm font-medium text-gray-700">Giá (VND)</label><input type="number" name="price" value={formData.price || 0} onChange={handleChange} className="mt-1 w-full p-2 border rounded" required /></div>
                            <div><label className="block text-sm font-medium text-gray-700">Thời lượng (phút)</label><input type="number" name="duration" value={formData.duration || 0} onChange={handleChange} className="mt-1 w-full p-2 border rounded" required /></div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700">Mô tả ngắn</label><textarea name="description" value={formData.description || ''} onChange={handleChange} rows={2} className="mt-1 w-full p-2 border rounded"></textarea>
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700">Mô tả chi tiết</label><textarea name="longDescription" value={formData.longDescription || ''} onChange={handleChange} rows={4} className="mt-1 w-full p-2 border rounded"></textarea>
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700">Danh mục</label>
                                <select name="category" value={formData.category || ''} onChange={handleChange} className="mt-1 w-full p-2 border rounded" required aria-required="true">
                                    <option value="" disabled>Chọn danh mục</option>
                                    {/* Defensive check for categories before mapping */}
                                    {(Array.isArray(categories) ? categories : []).map(c => <option key={c} value={c}>{c}</option>)}
                                    <option value="___ADD_NEW___">--- Thêm danh mục mới ---</option>
                                </select>
                                {showNewCategoryInput && (
                                    <div className="flex gap-2 mt-2">
                                        <input
                                            type="text"
                                            value={newCategoryName}
                                            onChange={(e) => setNewCategoryName(e.target.value)}
                                            placeholder="Tên danh mục mới"
                                            className="flex-grow p-2 border rounded"
                                            required
                                        />
                                        <button type="button" onClick={handleAddNewCategory} className="px-4 py-2 bg-brand-primary text-white rounded-md hover:bg-brand-dark">Thêm</button>
                                        <button type="button" onClick={handleCancelNewCategory} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Hủy</button>
                                    </div>
                                )}
                                {newCategoryError && <p className="text-red-500 text-sm mt-1">{newCategoryError}</p>}
                                {formError && !formData.category && <p className="text-red-500 text-sm mt-1">Vui lòng chọn hoặc thêm danh mục.</p>}
                            </div>
                            
                            {/* Image Upload Section */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700">Hình ảnh dịch vụ</label>
                                <div className="mt-1 flex items-center gap-4">
                                    <div className="w-24 h-24 flex-shrink-0 bg-gray-100 rounded-md flex items-center justify-center">
                                        {imagePreview ? (
                                            <img src={imagePreview} alt="Xem trước" className="w-full h-full object-cover rounded-md" />
                                        ) : (
                                            <span className="text-xs text-gray-500 text-center">Xem trước</span>
                                        )}
                                    </div>
                                    <div className="flex-grow">
                                        <label htmlFor="imageUrl" className="block text-xs font-medium text-gray-500">Dán liên kết ảnh</label>
                                        <input type="text" name="imageUrl" id="imageUrl" value={formData.imageUrl || ''} onChange={handleChange} className="mt-1 w-full p-2 border rounded text-sm" placeholder="https://..." />
                                        <div className="relative text-center my-2">
                                            <div className="absolute inset-y-1/2 left-0 w-full h-px bg-gray-200"></div>
                                            <span className="relative text-xs text-gray-400 bg-white px-2">hoặc</span>
                                        </div>
                                        <label htmlFor="file-upload" className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 w-full text-center block">Tải lên từ máy</label>
                                        <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/*" />
                                    </div>
                                </div>
                            </div>
                            
                            <div className="md:col-span-2 flex items-center gap-4">
                                <label className="flex items-center gap-2"><input type="checkbox" name="isHot" checked={formData.isHot || false} onChange={handleChange} className="rounded" /> Nổi bật (Hot)</label>
                                <label className="flex items-center gap-2"><input type="checkbox" name="isNew" checked={formData.isNew || false} onChange={handleChange} className="rounded" /> Dịch vụ mới</label>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-50 px-6 py-4 flex justify-between items-center rounded-b-lg">
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700"><input type="checkbox" name="isActive" checked={formData.isActive || false} onChange={handleChange} /> Hoạt động</label>
                        <div className="flex gap-4">
                            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Hủy</button>
                            <button type="submit" className="px-4 py-2 bg-brand-primary text-white rounded-md hover:bg-brand-dark">Lưu</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddEditServiceModal;