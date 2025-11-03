
import React, { useState, useEffect, useRef } from 'react';
import { HashRouter, Routes, Route, useLocation, Navigate, useNavigate } from 'react-router-dom';
import Header from './client/components/Header';
import Footer from './client/components/Footer';
import Chatbot from './client/components/Chatbot';
import { HomePage } from './client/pages/HomePage';
import { ServicesListPage } from './client/pages/ServicesListPage';
import ServiceDetailPage from './client/pages/ServiceDetailPage';
import { BookingPage } from './client/pages/BookingPage';
import { AppointmentsPage } from './client/pages/AppointmentsPage';
import PromotionsPage from './client/pages/PromotionsPage';
import ProfilePage from './client/pages/ProfilePage';
import LoginPage from './client/pages/LoginPage';
import RegisterPage from './client/pages/RegisterPage';
import ProtectedRoute from './components/ProtectedRoute';
import QAPage from './client/pages/QAPage';
import ContactPage from './client/pages/ContactPage';
import ForgotPasswordPage from './client/pages/ForgotPasswordPage';
import type { User, Wallet, Tier, Promotion, PromotionTargetAudience } from './types';
import { MOCK_WALLET, MOCK_USERS, MOCK_PAYMENTS, MOCK_TIERS, MOCK_REDEEMABLE_VOUCHERS, MOCK_PROMOTIONS } from './constants';

// Admin imports
import AdminLayout from './admin/components/AdminLayout';
import DashboardPage from './admin/pages/DashboardPage';
import UsersPage from './admin/pages/UsersPage';
import ServicesPage from './admin/pages/ServicesPage';
import AdminAppointmentsPage from './admin/pages/AppointmentsPage';
import PaymentsPage from './admin/pages/PaymentsPage';
import StaffPage from './admin/pages/StaffPage';
import AdminPromotionsPage from './admin/pages/PromotionsPage';
import { LoyaltyShopPage } from './admin/pages/LoyaltyShopPage';
import PlaceholderPage from './admin/pages/PlaceholderPage';
import AnalyticsPage from './admin/pages/AnalyticsPage'; 

// Staff Imports
import StaffLayout from './staff/components/StaffLayout';
import StaffDashboardPage from './staff/pages/StaffDashboardPage';
import StaffSchedulePage from './staff/pages/StaffSchedulePage';
import { StaffAppointmentsPage } from './staff/pages/StaffAppointmentsPage';
import StaffTreatmentProgressPage from './staff/pages/StaffTreatmentProgressPage';
import StaffCustomerInteractionPage from './staff/pages/StaffCustomerInteractionPage';
import StaffRewardsPage from './staff/pages/StaffRewardsPage';
import { StaffUpsellingPage } from './staff/pages/StaffUpsellingPage';
import StaffPersonalReportsPage from './staff/pages/StaffPersonalReportsPage';
import { StaffNotificationsPage } from './staff/pages/StaffNotificationsPage';
import StaffProfilePage from './staff/pages/StaffProfilePage';
import { StaffTransactionHistoryPage } from './staff/pages/StaffTransactionHistoryPage';


// Helper to calculate total spending from mock payments
const calculateUserTotalSpending = (userId: string): number => {
    return MOCK_PAYMENTS
        .filter(p => p.userId === userId && p.status === 'Completed')
        .reduce((sum, p) => sum + p.amount, 0);
};

const checkAndUpgradeTier = (user: User, wallet: Wallet): User => {
    let updatedUser = { ...user };
    const currentTier = MOCK_TIERS.find(t => t.level === user.tierLevel);
    if (!currentTier) return updatedUser;

    const sortedTiers = [...MOCK_TIERS].sort((a, b) => a.level - b.level);

    for (let i = 0; i < sortedTiers.length; i++) {
        const tier = sortedTiers[i];
        if (tier.level > updatedUser.tierLevel) {
            if (wallet.points >= tier.pointsRequired && (updatedUser.totalSpending ?? 0) >= tier.minSpendingRequired) {
                updatedUser = {
                    ...updatedUser,
                    tierLevel: tier.level,
                    lastTierUpgradeDate: new Date().toISOString(),
                };
            } else {
                break;
            }
        }
    }
    return updatedUser;
};

const AppContent: React.FC = () => {
    const navigate = useNavigate(); 
    const location = useLocation();
    const isLoggingOutRef = useRef(false); // New ref to track logout intent

    const [currentUser, setCurrentUser] = useState<User | null>(() => {
        const savedUser = localStorage.getItem('currentUser');
        const user = savedUser ? JSON.parse(savedUser) : null;
        if (user) {
            const updatedSpending = calculateUserTotalSpending(user.id);
            return { ...user, totalSpending: updatedSpending };
        }
        return null;
    });
    const [wallet, setWallet] = useState<Wallet>(() => {
        const saved = localStorage.getItem('userWallet');
        return saved ? JSON.parse(saved) : MOCK_WALLET;
    });
    const [userVouchers, setUserVouchers] = useState<Promotion[]>(() => {
        const saved = localStorage.getItem('userVouchers');
        return saved ? JSON.parse(saved) : [];
    });

    // FIX: Ensured location.pathname is treated as a string when using startsWith
    const currentIsAdminRoute = String(location.pathname).startsWith('/admin');
    const currentIsStaffRoute = String(location.pathname).startsWith('/staff');


    useEffect(() => {
        if (!localStorage.getItem('users')) {
            localStorage.setItem('users', JSON.stringify(MOCK_USERS));
        }
        if (!localStorage.getItem('promotions')) {
            localStorage.setItem('promotions', JSON.stringify(MOCK_PROMOTIONS));
        }
        if (!localStorage.getItem('redeemableVouchers')) {
            localStorage.setItem('redeemableVouchers', JSON.stringify(MOCK_REDEEMABLE_VOUCHERS));
        }
    }, []);

    useEffect(() => {
        // Scroll to top on client route changes, but not for admin/staff to prevent scroll issues within their layouts
        if (!currentIsAdminRoute && !currentIsStaffRoute) {
            window.scrollTo(0, 0);
        }
    }, [location.pathname, currentIsAdminRoute, currentIsStaffRoute]);

    useEffect(() => {
        // console.log(`[App.tsx] Auto-login effect running. Path: ${location.pathname}, currentUser: ${currentUser?.email}, isLoggingOut: ${isLoggingOutRef.current}`);

        // If a user is currently logging out (handled by handleLogout, prevents double redirects)
        if (isLoggingOutRef.current) {
            return;
        }

        const currentPath = location.pathname;
        const isAuthRoute = currentPath.startsWith('/login') ||
                            currentPath.startsWith('/register') ||
                            currentPath.startsWith('/forgot-password');
        const isAdminPath = currentPath.startsWith('/admin');
        const isStaffPath = currentPath.startsWith('/staff');

        if (currentUser) {
            // User is logged in, ensure they are on the correct dashboard if they tried to access auth pages
            if (isAuthRoute) {
                if (currentUser.isAdmin) {
                    navigate('/admin/dashboard', { replace: true });
                } else if (['Technician', 'Manager', 'Receptionist'].includes(currentUser.role)) {
                    navigate('/staff/dashboard', { replace: true });
                } else {
                    navigate('/', { replace: true });
                }
            }
            // If logged in and not on an auth route, let them proceed.
            return;
        }

        // --- User is NOT logged in from this point ---

        if (isAdminPath || isStaffPath) {
            // Attempt auto-login for admin/staff routes
            const usersData = localStorage.getItem('users');
            if (usersData) {
                const users: User[] = JSON.parse(usersData);
                let autoLoginUser: User | undefined;

                if (isAdminPath) {
                    autoLoginUser = users.find(user => user.isAdmin);
                } else { // isStaffPath
                    autoLoginUser = users.find(user => ['Technician', 'Manager', 'Receptionist'].includes(user.role));
                }
                
                if (autoLoginUser) {
                    // console.log(`[App.tsx] Attempting auto-login for user: ${autoLoginUser.email} on path: ${currentPath}`);
                    handleLogin(autoLoginUser); // This will set currentUser and navigate
                } else {
                    // If no auto-login user found for admin/staff, redirect to login page.
                    // console.log(`[App.tsx] No suitable auto-login user found for ${currentPath}. Redirecting to login.`);
                    navigate('/login', { replace: true });
                }
            } else {
                // No users data at all, redirect to login
                // console.log("[App.tsx] No users data in localStorage. Redirecting to login.");
                navigate('/login', { replace: true });
            }
        } else if (!isAuthRoute && currentPath !== '/') {
            // If not logged in, not on an admin/staff route, not on an auth route, and not already on home,
            // redirect to the home page (Trang chủ).
            // console.log(`[App.tsx] Unauthenticated user on non-home/non-auth/non-admin/non-staff route (${currentPath}). Redirecting to /.`);
            navigate('/', { replace: true });
        }
        // If !isAuthRoute && currentPath === '/', let them stay on the home page (unauthenticated).
        // This is important to allow unauthenticated users to see the homepage.

    }, [currentUser, navigate, location.pathname, isLoggingOutRef]); // Dependencies: only re-run if currentUser or path changes.


    const handleLogin = (user: User) => {
        isLoggingOutRef.current = false; // Reset if a login happens
        const users: User[] = JSON.parse(localStorage.getItem('users') || '[]');
        const foundUser = users.find(u => u.id === user.id);
        if (!foundUser) {
            console.error("User not found in localStorage during login handling.");
            return;
        }

        const updatedSpending = calculateUserTotalSpending(foundUser.id);
        const userWithSpending = { ...foundUser, totalSpending: updatedSpending };

        const userAfterTierCheck = checkAndUpgradeTier(userWithSpending, wallet);

        if (userAfterTierCheck.tierLevel > userWithSpending.tierLevel) {
            console.log(`User ${userAfterTierCheck.name} upgraded to Tier ${userAfterTierCheck.tierLevel}!`);
            const tierUpgradeVoucher = MOCK_REDEEMABLE_VOUCHERS.find(
                v => v.targetAudience === (`Tier Level ${userAfterTierCheck.tierLevel}` as PromotionTargetAudience) && v.pointsRequired === 0
            );

            if (tierUpgradeVoucher) {
                const hasClaimedTierVoucher = userVouchers.some(
                    uv => uv.title.includes(`tri ân nâng hạng ${MOCK_TIERS.find(t => t.level === userAfterTierCheck.tierLevel)?.name}`)
                );
                if (!hasClaimedTierVoucher) {
                    const newVoucher: Promotion = {
                        id: `tier-thankyou-${userAfterTierCheck.tierLevel}-${Date.now()}`,
                        title: `Voucher tri ân nâng hạng ${MOCK_TIERS.find(t => t.level === userAfterTierCheck.tierLevel)?.name}`,
                        description: `Chúc mừng bạn đã đạt hạng ${MOCK_TIERS.find(t => t.level === userAfterTierCheck.tierLevel)?.name}!`,
                        code: `TIER${userAfterTierCheck.tierLevel}THANKS`,
                        expiryDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
                        imageUrl: 'https://picsum.photos/seed/tier-voucher/500/300',
                        discountType: 'fixed',
                        discountValue: tierUpgradeVoucher.value,
                        termsAndConditions: `Voucher áp dụng cho mọi dịch vụ. Giá trị ${new Intl.NumberFormat('vi-VN').format(tierUpgradeVoucher.value)} VND.`,
                        targetAudience: (`Tier Level ${userAfterTierCheck.tierLevel}` as PromotionTargetAudience),
                        applicableServiceIds: [],
                        minOrderValue: 0,
                        usageCount: 0,
                    };
                    setUserVouchers(prev => [...prev, newVoucher]);
                }
            }
        }

        const { password, ...userToStore } = userAfterTierCheck;
        setCurrentUser(userToStore as User);
        localStorage.setItem('currentUser', JSON.stringify(userToStore));

        const updatedAllUsers = users.map(u => u.id === userToStore.id ? userToStore : u);
        localStorage.setItem('users', JSON.stringify(updatedAllUsers));

        if (userAfterTierCheck.isAdmin) {
            // console.log(`[handleLogin] User ${userAfterTierCheck.name} (Admin) redirecting to /admin/dashboard`);
            navigate('/admin/dashboard', { replace: true });
        } else if (['Technician', 'Manager', 'Receptionist'].includes(userAfterTierCheck.role)) {
            // console.log(`[handleLogin] User ${userAfterTierCheck.name} (Staff: ${userAfterTierCheck.role}) redirecting to /staff/dashboard`);
            navigate('/staff/dashboard', { replace: true });
        } else {
            // console.log(`[handleLogin] User ${userAfterTierCheck.name} (Client: ${userAfterTierCheck.role}) redirecting to /`);
            navigate('/', { replace: true });
        }
    };

    const handleLogout = () => {
        // console.log("[App.tsx] Handling logout...");
        isLoggingOutRef.current = true; // Set flag when starting logout
        setCurrentUser(null);
        localStorage.removeItem('currentUser');
        navigate('/login', { replace: true }); // Navigate to login page and replace history entry
        // A short delay to reset the flag, allowing the navigation to settle.
        // This is a common pattern for "transient" states during navigation/unmount.
        setTimeout(() => {
            isLoggingOutRef.current = false;
            // console.log("[App.tsx] Logout process complete, isLoggingOutRef reset.");
        }, 1000); // 1 second delay should be enough for navigation
    };

    const handleUpdateUser = (updatedUser: User) => {
        const updatedSpending = calculateUserTotalSpending(updatedUser.id);
        const userWithSpending = { ...updatedUser, totalSpending: updatedSpending };

        const userAfterTierCheck = checkAndUpgradeTier(userWithSpending, wallet);

        if (userAfterTierCheck.tierLevel > userWithSpending.tierLevel) {
            console.log(`User ${userAfterTierCheck.name} upgraded to Tier ${userAfterTierCheck.tierLevel}!`);
            const tierUpgradeVoucher = MOCK_REDEEMABLE_VOUCHERS.find(
                v => v.targetAudience === (`Tier Level ${userAfterTierCheck.tierLevel}` as PromotionTargetAudience) && v.pointsRequired === 0
            );

            if (tierUpgradeVoucher) {
                const hasClaimedTierVoucher = userVouchers.some(
                    uv => uv.title.includes(`tri ân nâng hạng ${MOCK_TIERS.find(t => t.level === userAfterTierCheck.tierLevel)?.name}`)
                );
                if (!hasClaimedTierVoucher) {
                    const newVoucher: Promotion = {
                        id: `tier-thankyou-${userAfterTierCheck.tierLevel}-${Date.now()}`,
                        title: `Voucher tri ân nâng hạng ${MOCK_TIERS.find(t => t.level === userAfterTierCheck.tierLevel)?.name}`,
                        description: `Chúc mừng bạn đã đạt hạng ${MOCK_TIERS.find(t => t.level === userAfterTierCheck.tierLevel)?.name}!`,
                        code: `TIER${userAfterTierCheck.tierLevel}THANKS`,
                        expiryDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
                        imageUrl: 'https://picsum.photos/seed/tier-voucher/500/300',
                        discountType: 'fixed',
                        discountValue: tierUpgradeVoucher.value,
                        termsAndConditions: `Voucher áp dụng cho mọi dịch vụ. Giá trị ${new Intl.NumberFormat('vi-VN').format(tierUpgradeVoucher.value)} VND.`,
                        targetAudience: (`Tier Level ${userAfterTierCheck.tierLevel}` as PromotionTargetAudience),
                        applicableServiceIds: [],
                        minOrderValue: 0,
                        usageCount: 0,
                    };
                    setUserVouchers(prev => [...prev, newVoucher]);
                }
            }
        }
        
        // Ensure password is not inadvertently cleared if updatedUser doesn't contain it
        const users: User[] = JSON.parse(localStorage.getItem('users') || '[]');
        const existingUser = users.find(u => u.id === updatedUser.id);
        const finalUser = { ...userAfterTierCheck, password: existingUser?.password }; // Retain old password if not explicitly updated here

        setCurrentUser(finalUser);
        localStorage.setItem('currentUser', JSON.stringify(finalUser));

        const updatedAllUsers = users.map(u => u.id === finalUser.id ? finalUser : u);
        localStorage.setItem('users', JSON.stringify(updatedAllUsers));
    };

    return (
        <div className={`flex flex-col min-h-screen text-brand-text ${currentIsAdminRoute || currentIsStaffRoute ? 'bg-gray-100' : 'bg-brand-light'}`}>
            {!currentIsAdminRoute && !currentIsStaffRoute && <Header currentUser={currentUser} onLogout={handleLogout} />}
            <main className={`flex-grow ${!currentIsAdminRoute && !currentIsStaffRoute ? 'pt-20' : ''}`}>
                <Routes>
                    {/* Client Routes */}
                    <Route path="/" element={<HomePage />} />
                    <Route path="/services" element={<ServicesListPage />} />
                    <Route path="/service/:id" element={<ServiceDetailPage />} />
                    <Route path="/qa" element={<QAPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
                    <Route path="/register" element={<RegisterPage onRegister={handleLogin} />} />
                    <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                    <Route
                        path="/booking"
                        element={<ProtectedRoute user={currentUser}><BookingPage /></ProtectedRoute>}
                    />
                    <Route
                        path="/appointments"
                        element={<ProtectedRoute user={currentUser}><AppointmentsPage currentUser={currentUser!} wallet={wallet} setWallet={setWallet} /></ProtectedRoute>}
                    />
                    <Route
                        path="/profile"
                        element={<ProtectedRoute user={currentUser}><ProfilePage currentUser={currentUser!} wallet={wallet} onUpdateUser={handleUpdateUser} /></ProtectedRoute>}
                    />
                    <Route
                        path="/promotions"
                        element={<ProtectedRoute user={currentUser}><PromotionsPage wallet={wallet} setWallet={setWallet} userVouchers={userVouchers} setUserVouchers={setUserVouchers} /></ProtectedRoute>}
                    />
                    
                    {/* Admin Routes */}
                    <Route
                        element={
                            <ProtectedRoute user={currentUser} adminOnly={true}>
                                <AdminLayout currentUser={currentUser!} onLogout={handleLogout} />
                            </ProtectedRoute>
                        }
                    >
                        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
                        <Route path="/admin/dashboard" element={<DashboardPage />} />
                        <Route path="/admin/users" element={<UsersPage />} />
                        <Route path="/admin/services" element={<ServicesPage />} />
                        <Route path="/admin/appointments" element={<AdminAppointmentsPage />} />
                        <Route path="/admin/payments" element={<PaymentsPage />} />
                        <Route path="/admin/staff" element={<StaffPage />} />
                        <Route path="/admin/promotions" element={<AdminPromotionsPage />} />
                        <Route path="/admin/loyalty-shop" element={<LoyaltyShopPage />} />
                        <Route path="/admin/analytics" element={<AnalyticsPage />} />
                        <Route path="/admin/invoices" element={<PlaceholderPage />} />
                        <Route path="/admin/membership" element={<PlaceholderPage />} />
                        <Route path="/admin/reviews" element={<PlaceholderPage />} />
                        <Route path="/admin/branches" element={<PlaceholderPage />} />
                        <Route path="/admin/notifications" element={<PlaceholderPage />} />
                        <Route path="/admin/reports" element={<PlaceholderPage />} />
                        <Route path="/admin/settings" element={<PlaceholderPage />} />
                        <Route path="/admin/security" element={<PlaceholderPage />} />
                    </Route>

                    {/* Staff Routes */}
                    <Route
                        element={
                            <ProtectedRoute user={currentUser} staffOnly={true}>
                                <StaffLayout currentUser={currentUser!} onLogout={handleLogout} />
                            </ProtectedRoute>
                        }
                    >
                        <Route path="/staff" element={<Navigate to="/staff/dashboard" replace />} />
                        <Route path="/staff/dashboard" element={<StaffDashboardPage currentUser={currentUser!} />} />
                        <Route path="/staff/schedule" element={<StaffSchedulePage currentUser={currentUser!} />} />
                        <Route path="/staff/appointments" element={<StaffAppointmentsPage currentUser={currentUser!} />} />
                        <Route path="/staff/treatment-progress" element={<StaffTreatmentProgressPage currentUser={currentUser!} />} />
                        <Route path="/staff/customer-interaction" element={<StaffCustomerInteractionPage currentUser={currentUser!} />} />
                        <Route path="/staff/rewards" element={<StaffRewardsPage currentUser={currentUser!} />} />
                        <Route path="/staff/upselling" element={<StaffUpsellingPage currentUser={currentUser!} />} />
                        <Route path="/staff/personal-reports" element={<StaffPersonalReportsPage currentUser={currentUser!} />} />
                        <Route path="/staff/notifications" element={<StaffNotificationsPage currentUser={currentUser!} />} />
                        <Route path="/staff/profile" element={<StaffProfilePage currentUser={currentUser!} onUpdateUser={handleUpdateUser} />} />
                        <Route path="/staff/transaction-history" element={<StaffTransactionHistoryPage currentUser={currentUser!} />} />
                    </Route>

                </Routes>
            </main>
            {!currentIsAdminRoute && !currentIsStaffRoute && <Footer />}
            {!currentIsAdminRoute && !currentIsStaffRoute && <Chatbot />}
        </div>
    );
};

const App: React.FC = () => (
    <HashRouter>
        <AppContent />
    </HashRouter>
);

export default App;
