

import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import type { User } from '../../types';
import { EyeIcon, EyeSlashIcon, GoogleIcon } from '../../shared/icons';

interface LoginPageProps {
    onLogin: (user: User) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    React.useEffect(() => {
        if (location.state?.message) {
            setSuccessMessage(location.state.message);
        }
    }, [location]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        const users: User[] = JSON.parse(localStorage.getItem('users') || '[]');
        const foundUser = users.find(user => user.email === email && user.password === password);

        if (foundUser) {
            onLogin(foundUser);
            // Removed direct navigation from LoginPage. App.tsx's handleLogin will now manage all redirections.
        } else {
            setError('Email hoặc mật khẩu không chính xác.');
        }
    };
    
    const handleGoogleLogin = () => {
        // Mock Google Login
        alert("Chức năng đăng nhập bằng Google đang được phát triển.");
    }

    return (
        <div className="container mx-auto px-4 py-16 flex justify-center items-center min-h-[70vh]">
            <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-2xl">
                <h1 className="text-3xl font-serif font-bold text-brand-dark text-center mb-6">Đăng Nhập</h1>
                {successMessage && <p className="text-green-600 bg-green-50 p-3 rounded-md text-sm text-center mb-4">{successMessage}</p>}
                
                <button 
                    onClick={handleGoogleLogin}
                    className="w-full flex justify-center items-center py-3 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                    <GoogleIcon />
                    Đăng nhập với Google
                </button>

                <div className="relative flex py-5 items-center">
                    <div className="flex-grow border-t border-gray-200"></div>
                    <span className="flex-shrink mx-4 text-gray-400 text-sm">Hoặc đăng nhập bằng email</span>
                    <div className="flex-grow border-t border-gray-200"></div>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-brand-text">Địa chỉ Email</label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="Vui lòng nhập địa chỉ email"
                            className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm transition-all duration-300 focus:border-transparent focus:ring-2 focus:ring-brand-primary"
                        />
                    </div>
                    <div>
                         <div className="flex justify-between items-center">
                            <label htmlFor="password" className="block text-sm font-medium text-brand-text">Mật khẩu</label>
                            <Link to="/forgot-password" className="text-sm text-brand-primary hover:underline">Quên mật khẩu?</Link>
                        </div>
                        <div className="relative mt-1">
                            <input
                                id="password"
                                type={isPasswordVisible ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                placeholder="Nhập mật khẩu"
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
                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                    <div>
                        <button
                            type="submit"
                            className="w-full bg-brand-dark text-white font-bold py-3 px-4 rounded-md hover:bg-brand-primary transition-colors duration-300 shadow-lg"
                        >
                            Đăng Nhập
                        </button>
                    </div>
                </form>
                <p className="mt-6 text-center text-sm text-gray-600">
                    Chưa có tài khoản?{' '}
                    <Link to="/register" className="font-medium text-brand-primary hover:text-brand-dark">
                        Đăng ký ngay
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;