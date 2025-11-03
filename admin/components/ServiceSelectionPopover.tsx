import React, { useRef, useEffect, useMemo } from 'react';
import type { Service } from '../../types';

interface ServiceSelectionPopoverProps {
    time: string;
    currentServiceIds: string[];
    onClose: () => void;
    onServiceChange: (serviceId: string, checked: boolean) => void;
    anchorEl: HTMLButtonElement | null;
    availableServices: Service[];
    parentRect: DOMRect; // Rect of the scrollable parent modal content
    buttonRect: DOMRect; // Rect of the button that opened it
}

const ServiceSelectionPopover: React.FC<ServiceSelectionPopoverProps> = ({
    time,
    currentServiceIds,
    onClose,
    onServiceChange,
    anchorEl,
    availableServices,
    parentRect,
    buttonRect,
}) => {
    const popoverRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (popoverRef.current && !popoverRef.current.contains(event.target as Node) && anchorEl && !anchorEl.contains(event.target as Node)) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose, anchorEl]);

    const style: React.CSSProperties = useMemo(() => {
        if (!buttonRect || !parentRect) return {};

        const popoverWidth = 220; // Approx width of the popover
        // Calculate dynamic height based on content, with a max-height
        const contentHeight = Math.min(availableServices.length * 28 + 60, 200); // 28px per item, + padding/button
        const popoverHeight = contentHeight;

        let top = buttonRect.top - parentRect.top;
        let left = buttonRect.right - parentRect.left + 8; // Default to right of button

        // Adjust if it goes off screen to the right
        if (left + popoverWidth > parentRect.width - 20) { // -20 for some right margin
            left = buttonRect.left - parentRect.left - popoverWidth - 8; // Move to left of button
            if (left < 10) { // If it still goes off screen to the left, revert to right and align to parent start
                left = 10; // Align to parent's left padding
            }
        }
        
        // Adjust if it goes off screen to the top
        if (top + popoverHeight > parentRect.height - 10) { // -10 for some bottom margin
            top = parentRect.height - popoverHeight - 10; // Align to bottom of parent
        }
        if (top < 10) { // If still too tall, align to top
             top = 10; // Align to parent's top padding
        }

        return { top: `${top}px`, left: `${left}px` };
    }, [buttonRect, parentRect, availableServices.length]);


    return (
        <div
            ref={popoverRef}
            className="absolute z-50 bg-white border border-gray-200 rounded-lg shadow-xl p-4 min-w-[200px]"
            style={style}
            role="dialog"
            aria-modal="true"
            aria-labelledby="service-selection-title"
        >
            <h4 id="service-selection-title" className="font-semibold text-gray-800 mb-3 text-sm">Dịch vụ cho {time}</h4>
            <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                {availableServices.length > 0 ? (
                    availableServices.map(service => (
                        <label key={service.id} className="flex items-center gap-2 text-sm cursor-pointer hover:bg-gray-50 p-1 rounded">
                            <input
                                type="checkbox"
                                checked={currentServiceIds.includes(service.id)}
                                onChange={(e) => onServiceChange(service.id, e.target.checked)}
                                className="rounded text-brand-primary focus:ring-brand-primary"
                            />
                            {service.name}
                        </label>
                    ))
                ) : (
                    <p className="text-xs text-gray-500">Nhân viên này chưa có chuyên môn hoặc không có dịch vụ phù hợp.</p>
                )}
            </div>
            <button
                onClick={onClose}
                className="mt-4 w-full bg-brand-secondary text-brand-dark px-3 py-1.5 rounded-md text-sm font-semibold hover:bg-brand-primary hover:text-white transition-colors"
                aria-label="Đóng chọn dịch vụ"
            >
                Đóng
            </button>
        </div>
    );
};

export default ServiceSelectionPopover;