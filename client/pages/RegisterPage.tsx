

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import type { User } from '../../types';
import { EyeIcon, EyeSlashIcon } from '../../shared/icons';

// FIX: Define props interface for RegisterPage to accept onRegister function
interface RegisterPageProps {
    onRegister: (user: User) => void;
}

const RegisterPage: React.FC<RegisterPageProps> = ({ onRegister }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Mật khẩu xác nhận không khớp.');
            return;
        }

        const users: User[] = JSON.parse(localStorage.getItem('users') || '[]');
        const existingUser = users.find(user => user.email === email);
        if (existingUser) {
            setError('Email này đã được sử dụng. Vui lòng chọn email khác.');
            return;
        }

        const newUser: User = {
            id: `user-${Date.now()}`,
            name,
            email,
            password, 
            phone: '', 
            profilePictureUrl: `https://picsum.photos/seed/user-${Date.now()}/200/200`,
            joinDate: new Date().toISOString().split('T')[0],
            birthday: '01-01',
            tierLevel: 1, 
            selfCareIndex: 50,
            // FIX: Added missing properties to conform to the User type.
            role: 'Client', // Default role for new registrations
            status: 'Active', // Default status for new registrations
            lastLogin: new Date().toISOString(), // Set initial login date
        };
        
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        
        // FIX: Call onRegister to log the new user in and navigate to the profile page
        onRegister(newUser);
        navigate('/profile', { state: { message: 'Đăng ký thành công! Vui lòng cập nhật thêm thông tin cá nhân.' } });
    };

    return (
        <div className="container mx-auto px-4 py-16 flex justify-center items-center min-h-[70vh]">
            <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-2xl">
                <h1 className="text-3xl font-serif font-bold text-brand-dark text-center mb-6">Tạo Tài Khoản Mới</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-brand-text">Họ và Tên</label>
                        <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm transition-all duration-300 focus:border-transparent focus:ring-2 focus:ring-brand-primary"
                        />
                    </div>
                    <div>
                        <label htmlFor="email-register" className="block text-sm font-medium text-brand-text">Địa chỉ Email</label>
                        <input
                            id="email-register"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm transition-all duration-300 focus:border-transparent focus:ring-2 focus:ring-brand-primary"
                        />
                    </div>
                    <div>
                        <label htmlFor="password-register" className="block text-sm font-medium text-brand-text">Mật khẩu</label>
                        <div className="relative mt-1">
                            <input
                                id="password-register"
                                type={isPasswordVisible ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="block w-full p-3 border border-gray-300 rounded-md shadow-sm transition-all duration-300 focus:border-transparent focus:ring-2 focus:ring-brand-primary"
                            />
                             <button
                                type="button"
                                onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                                className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-brand-dark"
                                aria-label={isPasswordVisible ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                            >
                                {isPasswordVisible ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                            </button>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="confirm-password" className="block text-sm font-medium text-brand-text">Xác nhận Mật khẩu</label>
                        <div className="relative mt-1">
                            <input
                                id="confirm-password"
                                type={isConfirmPasswordVisible ? 'text' : 'password'}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                className="block w-full p-3 border border-gray-300 rounded-md shadow-sm transition-all duration-300 focus:border-transparent focus:ring-2 focus:ring-brand-primary"
                            />
                            <button
                                type="button"
                                onClick={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}
                                className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-brand-dark"
                                aria-label={isConfirmPasswordVisible ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                            >
                                {isConfirmPasswordVisible ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                            </button>
                        </div>
                    </div>
                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                    <div>
                        <button
                            type="submit"
                            className="w-full bg-brand-dark text-white font-bold py-3 px-4 rounded-md hover:bg-brand-primary transition-colors duration-300 shadow-lg"
                        >
                            Đăng Ký
                        </button>
                    </div>
                </form>
                <p className="mt-6 text-center text-sm text-gray-600">
                    Đã có tài khoản?{' '}
                    <Link to="/login" className="font-medium text-brand-primary hover:text-brand-dark">
                        Đăng nhập
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;