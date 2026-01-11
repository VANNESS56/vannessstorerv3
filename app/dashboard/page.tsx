'use client';

import { useState, useEffect } from 'react';
import { LayoutGrid, Lock, Settings, LogOut, Users, MessageSquare, Terminal, Ticket } from 'lucide-react';
import DashboardTable from './components/DashboardTable';
import ApiTester from './components/ApiTester';
import ProductSyncer from './components/ProductSyncer';
import UserManagement from './components/UserManagement';
import InfoBoardManagement from './components/InfoBoardManagement';
import VoucherManager from './components/VoucherManager';
import Link from 'next/link';
import ThemeToggle from '@/app/components/ThemeToggle';

export default function DashboardPage() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [hydrated, setHydrated] = useState(false);
    const [activeView, setActiveView] = useState('products');

    useEffect(() => {
        setHydrated(true);
        const storedAuth = localStorage.getItem('isAdminAuthenticated');
        if (storedAuth === 'true') {
            setIsAuthenticated(true);
        }
    }, []);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // Simple hardcoded password for demonstration
        if (password === 'admin123') {
            localStorage.setItem('isAdminAuthenticated', 'true');
            setIsAuthenticated(true);
        } else {
            alert('Password salah!');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('isAdminAuthenticated');
        setIsAuthenticated(false);
    };

    if (!hydrated) return null;

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4 transition-colors duration-300">
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-md p-8 border border-slate-100 dark:border-slate-700">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Lock className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                        </div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Admin Login</h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-2">Masukkan password untuk mengakses dashboard.</p>
                    </div>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <input
                            type="password"
                            placeholder="Password..."
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        />
                        <button
                            type="submit"
                            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors shadow-lg shadow-blue-500/20"
                        >
                            Masuk Dashboard
                        </button>
                    </form>
                    <div className="mt-6 text-center">
                        <Link href="/" className="text-sm text-slate-400 hover:text-blue-600 transition-colors">
                            &larr; Kembali ke Beranda
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex transition-colors duration-300">
            {/* Sidebar */}
            <aside className="w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 hidden md:flex flex-col fixed h-full z-10 transition-colors duration-300">
                <div className="p-6 border-b border-slate-100 dark:border-slate-700">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                            <LayoutGrid className="text-white w-5 h-5" />
                        </div>
                        <span className="font-bold text-slate-800 dark:text-white text-lg">VANNESS ADMIN</span>
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    <button
                        onClick={() => setActiveView('products')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeView === 'products' ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-700 dark:hover:text-slate-200'}`}
                    >
                        <LayoutGrid className="w-5 h-5" />
                        Produk
                    </button>
                    <button
                        onClick={() => setActiveView('users')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeView === 'users' ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-700 dark:hover:text-slate-200'}`}
                    >
                        <Users className="w-5 h-5" />
                        Pengguna
                    </button>
                    <button
                        onClick={() => setActiveView('vouchers')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeView === 'vouchers' ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-700 dark:hover:text-slate-200'}`}
                    >
                        <Ticket className="w-5 h-5" />
                        Vouchers
                    </button>
                    <button
                        onClick={() => setActiveView('info')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeView === 'info' ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-700 dark:hover:text-slate-200'}`}
                    >
                        <MessageSquare className="w-5 h-5" />
                        Informasi
                    </button>
                    <button
                        onClick={() => setActiveView('api')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeView === 'api' ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-700 dark:hover:text-slate-200'}`}
                    >
                        <Terminal className="w-5 h-5" />
                        API Tester
                    </button>
                    <button
                        onClick={() => setActiveView('settings')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeView === 'settings' ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-700 dark:hover:text-slate-200'}`}
                    >
                        <Settings className="w-5 h-5" />
                        Pengaturan
                    </button>
                </nav>

                <div className="p-4 border-t border-slate-100 dark:border-slate-700">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl font-medium transition-colors"
                    >
                        <LogOut className="w-5 h-5" />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 md:ml-64 p-8">
                <header className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard Admin</h1>
                        <p className="text-slate-500 dark:text-slate-400">Kelola semua layanan, user, dan konfigurasi.</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <ThemeToggle />
                        <div className="text-right hidden sm:block">
                            <p className="font-semibold text-slate-900 dark:text-white">Admin User</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Super Administrator</p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700" />
                    </div>
                </header>

                {activeView === 'products' && (
                    <div className="space-y-6">
                        <ProductSyncer />
                        <DashboardTable />
                    </div>
                )}

                {activeView === 'users' && <UserManagement />}

                {activeView === 'vouchers' && <VoucherManager />}

                {activeView === 'info' && <InfoBoardManagement />}

                {activeView === 'api' && <ApiTester />}

                {activeView === 'settings' && (
                    <div className="bg-white dark:bg-slate-800 p-8 rounded-xl border border-slate-200 dark:border-slate-700 text-center text-slate-500 dark:text-slate-400">
                        <Settings className="w-12 h-12 mx-auto mb-4 text-slate-300 dark:text-slate-600" />
                        <h3 className="text-lg font-medium text-slate-900 dark:text-white">Pengaturan Belum Tersedia</h3>
                        <p>Fitur pengaturan akan segera hadir.</p>
                    </div>
                )}
            </main>
        </div>
    );
}
